import 'server-only';
import { and, eq, gte, isNotNull, lte } from 'drizzle-orm';
import { db, schema } from '@/db';
import { accessTokenFor, GoogleError } from './google';

type Row = { dim: string; dimValue: string; day: string; metric: string; value: number };
type Report = { dim: string; dimension?: string; metrics: string[]; limit?: number; optional?: boolean };

// What each pull asks GA4 for. keyEvents are the leads (the source of truth for lead counts).
// Google Ads cost only exists when the property is linked to Google Ads, so that report may fail and is skipped.
const REPORTS: Report[] = [
  { dim: 'total', metrics: ['sessions', 'totalUsers', 'engagedSessions', 'keyEvents', 'screenPageViews'] },
  { dim: 'channel', dimension: 'sessionDefaultChannelGroup', metrics: ['sessions', 'keyEvents'] },
  { dim: 'device', dimension: 'deviceCategory', metrics: ['sessions', 'keyEvents'] },
  { dim: 'page', dimension: 'landingPage', metrics: ['sessions', 'engagedSessions', 'keyEvents'], limit: 5000 },
  { dim: 'campaign', dimension: 'sessionGoogleAdsCampaignName', metrics: ['advertiserAdCost', 'advertiserAdClicks', 'advertiserAdImpressions'], optional: true },
];

const iso = (d: Date) => d.toISOString().slice(0, 10);
const daysAgo = (n: number) => { const d = new Date(); d.setUTCDate(d.getUTCDate() - n); return iso(d); };

async function runReport(token: string, propertyId: string, r: Report, start: string, end: string): Promise<Row[]> {
  const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
    method: 'POST', headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' },
    body: JSON.stringify({
      dateRanges: [{ startDate: start, endDate: end }],
      dimensions: [{ name: 'date' }, ...(r.dimension ? [{ name: r.dimension }] : [])],
      metrics: r.metrics.map(name => ({ name })),
      ...(r.limit ? { limit: r.limit, orderBys: [{ metric: { metricName: 'sessions' }, desc: true }] } : {}),
      keepEmptyRows: false,
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new GoogleError(json?.error?.message || 'GA4 report failed', json?.error?.status);
  const out: Row[] = [];
  for (const row of json.rows ?? []) {
    const ymd: string = row.dimensionValues[0].value;
    const day = `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`;
    const dimValue = r.dimension ? String(row.dimensionValues[1].value || '(not set)').slice(0, 300) : '';
    // Campaign rows without Google Ads traffic come back as "(not set)" with zero cost; they add nothing.
    if (r.dim === 'campaign' && dimValue === '(not set)') continue;
    r.metrics.forEach((metric, i) => {
      const value = Number(row.metricValues[i].value) || 0;
      if (value) out.push({ dim: r.dim, dimValue, day, metric: metric.replace(/^advertiserAd/, 'ad'), value });
    });
  }
  return out;
}

// Pulls a GA4 property's numbers into metric_rows. First pull: the last 90 days. After that: the last 4 days, because
// GA4 keeps processing recent days for up to 48 hours. Today is left out until it's over.
export async function syncGa4Account(accountId: string) {
  const [acct] = await db.select().from(schema.accounts).where(eq(schema.accounts.id, accountId));
  if (!acct || acct.tool !== 'ga4') return;
  const [conn] = await db.select().from(schema.connections).where(eq(schema.connections.id, acct.connectionId));
  if (!conn) return;
  const end = daysAgo(1);
  const start = acct.dataThrough ? (() => { const d = new Date(acct.dataThrough + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() - 3); return iso(d); })() : daysAgo(90);
  try {
    const token = await accessTokenFor(conn);
    const rows: Row[] = [];
    for (const r of REPORTS) {
      try { rows.push(...(await runReport(token, acct.externalId, r, start, end))); }
      catch (e) { if (!r.optional) throw e; }
    }
    await db.transaction(async tx => {
      await tx.delete(schema.metricRows).where(and(eq(schema.metricRows.accountId, acct.id), gte(schema.metricRows.day, start), lte(schema.metricRows.day, end)));
      for (let i = 0; i < rows.length; i += 2000) await tx.insert(schema.metricRows).values(rows.slice(i, i + 2000).map(r => ({ accountId: acct.id, ...r })));
      await tx.update(schema.accounts).set({ dataThrough: end, syncError: null, syncedAt: new Date() }).where(eq(schema.accounts.id, acct.id));
    });
    return { rows: rows.length, start, end };
  } catch (e) {
    const msg = e instanceof GoogleError
      ? (e.code === 'RESOURCE_EXHAUSTED' ? 'Google’s daily limit for this property is used up. It resumes tomorrow.'
        : e.code === 'PERMISSION_DENIED' ? 'This Google login lost access to the property.'
        : e.code === 'invalid_grant' ? 'Google signed this login out. Reconnect it.' : e.message)
      : 'The data pull failed. It will try again on the next sync.';
    await db.update(schema.accounts).set({ syncError: msg, syncedAt: new Date() }).where(eq(schema.accounts.id, acct.id));
    console.error('[ga4 sync]', acct.externalId, e instanceof Error ? e.message : e);
    return { error: msg };
  }
}

// Every GA4 property that is linked to a client, for the daily sync.
export async function syncAllGa4(agencyId?: string) {
  const linked = await db.select({ id: schema.accounts.id }).from(schema.accounts)
    .where(and(eq(schema.accounts.tool, 'ga4'), isNotNull(schema.accounts.clientId), agencyId ? eq(schema.accounts.agencyId, agencyId) : undefined));
  const results = [];
  for (const a of linked) results.push(await syncGa4Account(a.id));
  return results;
}
