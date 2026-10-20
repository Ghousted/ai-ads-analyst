import 'server-only';
import { and, eq, gte, inArray, lte, sql } from 'drizzle-orm';
import { db, schema } from '@/db';

// Shared by the platform pulls: dates, and writing daily rows into metric_rows.
export type Row = { dim: string; dimValue: string; day: string; metric: string; value: number };

export const iso = (d: Date) => d.toISOString().slice(0, 10);
// n days before today, where today is the date in the given time zone (an account's), or in UTC without one.
export const daysAgo = (n: number, timeZone?: string | null) => {
  let today = iso(new Date());
  if (timeZone) try { today = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); } catch {}
  return addDays(today, -n);
};
export const addDays = (day: string, n: number) => { const d = new Date(day + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return iso(d); };

// Replaces an account's rows for [start, end], but only the breakdowns that came back: a breakdown that failed keeps
// its stored days. Rows are upserted, so a second pull of the same account running at the same time can't fail on duplicates.
export async function storeRows(accountId: string, rows: Row[], start: string, end: string, dims: string[]) {
  await db.transaction(async tx => {
    if (dims.length) await tx.delete(schema.metricRows).where(and(eq(schema.metricRows.accountId, accountId), gte(schema.metricRows.day, start), lte(schema.metricRows.day, end), inArray(schema.metricRows.dim, dims)));
    for (let i = 0; i < rows.length; i += 2000) await tx.insert(schema.metricRows).values(rows.slice(i, i + 2000).map(r => ({ accountId, ...r })))
      .onConflictDoUpdate({ target: [schema.metricRows.accountId, schema.metricRows.day, schema.metricRows.dim, schema.metricRows.dimValue, schema.metricRows.metric], set: { value: sql.raw('excluded.value') } });
    await tx.update(schema.accounts).set({ dataThrough: end, syncError: null, syncedAt: new Date() }).where(eq(schema.accounts.id, accountId));
  });
}

export async function saveSyncError(accountId: string, msg: string) {
  await db.update(schema.accounts).set({ syncError: msg, syncedAt: new Date() }).where(eq(schema.accounts.id, accountId));
}
