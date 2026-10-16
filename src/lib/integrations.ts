import 'server-only';
import { and, eq, inArray, notInArray, sql } from 'drizzle-orm';
import { db, schema } from '@/db';
import { accessTokenFor, listProperties } from './google';
import { decrypt } from './crypto';
import { isTokenError, listAdAccounts, MetaError } from './meta';

type Conn = typeof schema.connections.$inferSelect;

// Refreshes the list of GA4 properties a Google login can see.
export async function syncGoogleAccounts(conn: Conn) {
  const props = await listProperties(await accessTokenFor(conn));
  return saveAccounts(conn, 'ga4', props.map(p => ({ id: p.id, name: p.name, detail: p.account + ' · Property ' + p.id })));
}

// Refreshes the list of ad accounts a Meta system user was given in Business Manager.
export async function syncMetaAccounts(conn: Conn) {
  if (!conn.accessToken) throw new MetaError('This Meta connection has no token.', 190);
  try {
    return await saveAccounts(conn, 'meta', await listAdAccounts(decrypt(conn.accessToken)));
  } catch (e) {
    if (isTokenError(e)) await db.update(schema.connections).set({ status: 'error', error: 'Meta stopped accepting this token. Paste a new one.' }).where(eq(schema.connections.id, conn.id));
    throw e;
  }
}

// Assignments of accounts that are still visible stay as they are; accounts the login lost access to are removed.
async function saveAccounts(conn: Conn, tool: 'ga4' | 'meta', found: { id: string; name: string; detail: string }[]) {
  if (found.length) {
    await db.insert(schema.accounts)
      .values(found.map(p => ({ agencyId: conn.agencyId, connectionId: conn.id, tool, externalId: p.id, name: p.name, detail: p.detail })))
      .onConflictDoUpdate({ target: [schema.accounts.connectionId, schema.accounts.externalId], set: { name: sqlExcluded('name'), detail: sqlExcluded('detail') } });
  }
  const keep = found.map(p => p.id);
  await db.delete(schema.accounts).where(and(eq(schema.accounts.connectionId, conn.id), keep.length ? notInArray(schema.accounts.externalId, keep) : undefined));
  await db.update(schema.connections).set({ lastSyncAt: new Date(), status: 'ok', error: null }).where(eq(schema.connections.id, conn.id));
  return found.length;
}

// Integrations as the settings page shows them, for one agency.
export async function listIntegrations(agencyId: string) {
  const conns = await db.select({ c: schema.connections, by: schema.users.name, byEmail: schema.users.email, byClient: schema.clients.name })
    .from(schema.connections).leftJoin(schema.users, eq(schema.users.id, schema.connections.connectedBy))
    .leftJoin(schema.clients, eq(schema.clients.id, schema.connections.forClientId))
    .where(eq(schema.connections.agencyId, agencyId)).orderBy(schema.connections.createdAt);
  const ids = conns.map(r => r.c.id);
  const accts = ids.length ? await db.select().from(schema.accounts).where(inArray(schema.accounts.connectionId, ids)).orderBy(schema.accounts.name) : [];
  // expiresAt only matters for Meta: a system user token can be set to run out. Google tokens refresh themselves.
  return conns.map(({ c, by, byEmail, byClient }) => ({
    id: c.id, provider: c.provider, login: c.login, by: byClient ? byClient + ' (client)' : by || byEmail || 'a former teammate', status: c.status, error: c.error,
    lastSyncAt: c.lastSyncAt?.toISOString() ?? null, expiresAt: c.provider === 'meta' ? c.accessTokenExpiresAt?.toISOString() ?? null : null,
    accounts: accts.filter(a => a.connectionId === c.id).map(a => ({ id: a.id, tool: a.tool, name: a.name, detail: a.detail, clientId: a.clientId })),
  }));
}

const sqlExcluded = (col: string) => sql.raw('excluded.' + col);
