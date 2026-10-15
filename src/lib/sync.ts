import 'server-only';
import { and, asc, eq, isNotNull, sql } from 'drizzle-orm';
import { db, schema } from '@/db';
import { syncGa4Account } from './ga4';
import { syncMetaAccount } from './meta-insights';

export type SyncResult = { rows: number; start: string; end: string } | { error: string } | undefined;

// Pulls one account, whichever platform it is on. agencyId, when given, must own the account: callers acting for a
// signed-in agency always pass it.
export async function syncAccount(accountId: string, agencyId?: string): Promise<SyncResult> {
  const [acct] = await db.select().from(schema.accounts).where(and(eq(schema.accounts.id, accountId), agencyId ? eq(schema.accounts.agencyId, agencyId) : undefined));
  if (!acct) return;
  return acct.tool === 'meta' ? syncMetaAccount(acct) : syncGa4Account(acct);
}

// Every account linked to a client, for the daily sync. Least recently synced first, a few at a time, and no new batch
// once the time budget is nearly spent, so the accounts left over go first on the next run.
export async function syncAll(agencyId?: string, budgetMs = 240_000) {
  const started = Date.now();
  const linked = await db.select().from(schema.accounts)
    .where(and(isNotNull(schema.accounts.clientId), agencyId ? eq(schema.accounts.agencyId, agencyId) : undefined))
    .orderBy(sql`${schema.accounts.syncedAt} asc nulls first`, asc(schema.accounts.createdAt));
  const results: SyncResult[] = [];
  for (let i = 0; i < linked.length; i += 4) {
    if (Date.now() - started > budgetMs) break;
    results.push(...(await Promise.all(linked.slice(i, i + 4).map(a => (a.tool === 'meta' ? syncMetaAccount(a) : syncGa4Account(a))))));
  }
  return { results, skipped: linked.length - results.length };
}
