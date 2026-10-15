import 'server-only';
import { and, eq, gte, inArray, isNotNull } from 'drizzle-orm';
import { db, schema } from '@/db';

// The last 90 days of numbers for every linked account in an agency, compact enough to send to the dashboard.
// rows: [account index, day, dim, dim value, metric, value].
export async function loadMetrics(agencyId: string) {
  const accts = await db.select({ id: schema.accounts.id, clientId: schema.accounts.clientId, tool: schema.accounts.tool, name: schema.accounts.name, through: schema.accounts.dataThrough, error: schema.accounts.syncError })
    .from(schema.accounts).where(and(eq(schema.accounts.agencyId, agencyId), isNotNull(schema.accounts.clientId)));
  if (!accts.length) return { through: null, accounts: [], rows: [] };
  const from = new Date(); from.setUTCDate(from.getUTCDate() - 92);
  const rows = await db.select().from(schema.metricRows)
    .where(and(inArray(schema.metricRows.accountId, accts.map(a => a.id)), gte(schema.metricRows.day, from.toISOString().slice(0, 10))));
  const idx = new Map(accts.map((a, i) => [a.id, i]));
  const through = accts.map(a => a.through).filter(Boolean).sort().pop() ?? null;
  return {
    through,
    accounts: accts.map(a => ({ id: a.id, clientId: a.clientId, tool: a.tool, name: a.name, through: a.through, error: a.error })),
    rows: rows.map(r => [idx.get(r.accountId)!, r.day, r.dim, r.dimValue, r.metric, r.value] as [number, string, string, string, string, number]),
  };
}
