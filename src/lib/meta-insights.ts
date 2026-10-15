import 'server-only';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import { decrypt } from './crypto';
import { graphAll, isRateLimit, isTokenError, MetaError } from './meta';
import { addDays, daysAgo, saveSyncError, storeRows, type Row } from './metric-store';

type Account = typeof schema.accounts.$inferSelect;
type Insight = { date_start: string; spend?: string; impressions?: string; reach?: string; clicks?: string; actions?: { action_type: string; value: string }[]; campaign_name?: string; publisher_platform?: string; platform_position?: string; age?: string };
type Report = { dim: string; level: 'account' | 'campaign'; breakdowns?: string; fields: string[]; value?: (r: Insight) => string };

// What each pull asks Meta for, one row per day. Metric names: spend, impressions, reach, clicks, leads.
// Reach is only asked for totals: it counts people, so it doesn't add up across breakdowns (or, strictly, across days).
const REPORTS: Report[] = [
  { dim: 'total', level: 'account', fields: ['spend', 'impressions', 'reach', 'clicks', 'actions'] },
  { dim: 'campaign', level: 'campaign', fields: ['campaign_name', 'spend', 'impressions', 'clicks', 'actions'], value: r => r.campaign_name || '(no name)' },
  { dim: 'placement', level: 'account', breakdowns: 'publisher_platform,platform_position', fields: ['spend', 'impressions', 'clicks', 'actions'], value: r => [r.publisher_platform, r.platform_position].filter(Boolean).join(' · ').replace(/_/g, ' ') },
  { dim: 'age', level: 'account', breakdowns: 'age', fields: ['spend', 'impressions', 'clicks', 'actions'], value: r => r.age || 'Unknown' },
];

// "lead" is Meta's total of every lead (instant forms and website leads). Older setups only report the parts.
export function leadsOf(actions: Insight['actions']) {
  const a = Object.fromEntries((actions ?? []).map(x => [x.action_type, Number(x.value) || 0]));
  return a.lead ?? (a['onsite_conversion.lead_grouped'] ?? 0) + (a['offsite_conversion.fb_pixel_lead'] ?? 0);
}

export function toRows(r: Report, data: Insight[]): Row[] {
  const out: Row[] = [];
  for (const x of data) {
    const dimValue = r.value ? r.value(x).slice(0, 300) : '';
    const vals: [string, number][] = [['spend', Number(x.spend) || 0], ['impressions', Number(x.impressions) || 0], ['clicks', Number(x.clicks) || 0], ['leads', leadsOf(x.actions)]];
    if (r.fields.includes('reach')) vals.push(['reach', Number(x.reach) || 0]);
    // A breakdown can repeat a value on one day (two campaigns with the same name), so values add up.
    for (const [metric, value] of vals) if (value) {
      const same = out.find(o => o.day === x.date_start && o.dimValue === dimValue && o.metric === metric);
      if (same) same.value += value; else out.push({ dim: r.dim, dimValue, day: x.date_start, metric, value });
    }
  }
  return out;
}

// Meta refuses very large requests, so long ranges are asked for a month at a time.
function windows(start: string, end: string, days = 30) {
  const out: [string, string][] = [];
  for (let s = start; s <= end; s = addDays(s, days)) { const e = addDays(s, days - 1); out.push([s, e < end ? e : end]); }
  return out;
}

async function runReport(token: string, adAccountId: string, r: Report, start: string, end: string): Promise<Row[]> {
  const rows: Row[] = [];
  for (const [since, until] of windows(start, end)) {
    const data = await graphAll<Insight>('/act_' + adAccountId + '/insights', token, {
      level: r.level, fields: r.fields.join(','), time_increment: '1', time_range: JSON.stringify({ since, until }), limit: '500',
      ...(r.breakdowns ? { breakdowns: r.breakdowns } : {}),
    });
    rows.push(...toRows(r, data));
  }
  return rows;
}

// Pulls a Meta ad account's numbers into metric_rows. First pull: the last 90 days. After that: the last 3 days again,
// because Meta revises recent numbers. Today is left out until it's over. Days follow the ad account's time zone.
export async function syncMetaAccount(acct: Account) {
  if (acct.tool !== 'meta') return;
  const [conn] = await db.select().from(schema.connections).where(eq(schema.connections.id, acct.connectionId));
  if (!conn) return;
  const end = daysAgo(1);
  const start = acct.dataThrough ? addDays(acct.dataThrough < end ? acct.dataThrough : end, -2) : daysAgo(90);
  try {
    if (!conn.accessToken) throw new MetaError('No token', 190);
    const token = decrypt(conn.accessToken);
    const rows: Row[] = [];
    for (const r of REPORTS) rows.push(...(await runReport(token, acct.externalId, r, start, end)));
    await storeRows(acct.id, rows, start, end, REPORTS.map(r => r.dim));
    return { rows: rows.length, start, end };
  } catch (e) {
    if (isTokenError(e)) await db.update(schema.connections).set({ status: 'error', error: 'Meta stopped accepting this token. Paste a new one.' }).where(eq(schema.connections.id, conn.id));
    const lost = e instanceof MetaError && (e.code === 10 || (e.code ?? 0) >= 200 && (e.code ?? 0) < 300 || (e.code === 100 && e.subcode === 33));
    const msg = isTokenError(e) ? 'Meta stopped accepting the system user token. Paste a new one in Integrations.'
      : isRateLimit(e) ? 'Meta’s limit for this ad account is reached. It tries again on the next sync.'
      : lost ? 'The system user lost access to this ad account. Give it access again in Business Manager.'
      : e instanceof MetaError ? e.message : 'The data pull failed. It will try again on the next sync.';
    await saveSyncError(acct.id, msg);
    console.error('[meta sync]', acct.externalId, e instanceof Error ? e.message : e);
    return { error: msg };
  }
}
