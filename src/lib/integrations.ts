import 'server-only';
import { and, eq, inArray, notInArray, sql } from 'drizzle-orm';
import { db, schema } from '@/db';
import { accessTokenFor, listProperties } from './google';

type Conn = typeof schema.connections.$inferSelect;

// Refreshes the list of GA4 properties a Google login can see. Assignments of properties that are still visible stay as
// they are; properties the login lost access to are removed.
export async function syncGoogleAccounts(conn: Conn) {
  const props = await listProperties(await accessTokenFor(conn));
  if (props.length) {
    await db.insert(schema.accounts)
      .values(props.map(p => ({ agencyId: conn.agencyId, connectionId: conn.id, tool: 'ga4' as const, externalId: p.id, name: p.name, detail: p.account + ' · Property ' + p.id })))
      .onConflictDoUpdate({ target: [schema.accounts.connectionId, schema.accounts.externalId], set: { name: sqlExcluded('name'), detail: sqlExcluded('detail') } });
  }
  const keep = props.map(p => p.id);
  await db.delete(schema.accounts).where(and(eq(schema.accounts.connectionId, conn.id), keep.length ? notInArray(schema.accounts.externalId, keep) : undefined));
  await db.update(schema.connections).set({ lastSyncAt: new Date(), status: 'ok', error: null }).where(eq(schema.connections.id, conn.id));
  return props.length;
}

// Integrations as the settings page shows them, for one agency.
export async function listIntegrations(agencyId: string) {
  const conns = await db.select({ c: schema.connections, by: schema.users.name, byEmail: schema.users.email })
    .from(schema.connections).leftJoin(schema.users, eq(schema.users.id, schema.connections.connectedBy))
    .where(eq(schema.connections.agencyId, agencyId)).orderBy(schema.connections.createdAt);
  const ids = conns.map(r => r.c.id);
  const accts = ids.length ? await db.select().from(schema.accounts).where(inArray(schema.accounts.connectionId, ids)).orderBy(schema.accounts.name) : [];
  return conns.map(({ c, by, byEmail }) => ({
    id: c.id, provider: c.provider, login: c.login, by: by || byEmail || 'a former teammate', status: c.status, error: c.error,
    lastSyncAt: c.lastSyncAt?.toISOString() ?? null,
    accounts: accts.filter(a => a.connectionId === c.id).map(a => ({ id: a.id, tool: a.tool, name: a.name, detail: a.detail, clientId: a.clientId })),
  }));
}

const sqlExcluded = (col: string) => sql.raw('excluded.' + col);
