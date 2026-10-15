'use server';
import { revalidatePath } from 'next/cache';
import { after } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/db';
import { requireAgency, canManage } from '@/lib/auth';
import { decrypt, encrypt } from '@/lib/crypto';
import { revokeToken, GoogleError } from '@/lib/google';
import { syncGoogleAccounts, syncMetaAccounts } from '@/lib/integrations';
import { checkToken, tokenProblem } from '@/lib/meta';
import { syncAccount } from '@/lib/sync';

const Id = z.string().uuid();

async function managerAgency() {
  const m = await requireAgency();
  if (!canManage(m.role)) throw new Error('forbidden');
  return m;
}

// Assigns an account to a client, or unassigns it (clientId null). An account belongs to at most one client.
export async function assignAccountAction(input: { accountId: string; clientId: string | null }) {
  const { agency } = await managerAgency().catch(() => ({ agency: null }));
  if (!agency) return { error: 'Only the owner and admins can assign accounts.' };
  const p = z.object({ accountId: Id, clientId: Id.nullable() }).safeParse(input);
  if (!p.success) return { error: 'Pick a client.' };
  if (p.data.clientId) {
    const [c] = await db.select({ id: schema.clients.id }).from(schema.clients).where(and(eq(schema.clients.id, p.data.clientId), eq(schema.clients.agencyId, agency.id)));
    if (!c) return { error: 'That client no longer exists.' };
  }
  const changed = await db.update(schema.accounts).set({ clientId: p.data.clientId }).where(and(eq(schema.accounts.id, p.data.accountId), eq(schema.accounts.agencyId, agency.id))).returning({ id: schema.accounts.id });
  if (!changed.length) return { error: 'That account is no longer connected.' };
  // A newly linked account starts pulling its numbers in the background (only accounts this agency owns).
  if (p.data.clientId) { const id = changed[0].id, ag = agency.id; after(() => syncAccount(id, ag)); }
  revalidatePath('/app');
  return { ok: true };
}

// Disconnects a login: revokes its Google access and removes its accounts (and their assignments).
export async function disconnectAction(connectionId: string) {
  const { agency } = await managerAgency().catch(() => ({ agency: null }));
  if (!agency) return { error: 'Only the owner and admins can disconnect tools.' };
  if (!Id.safeParse(connectionId).success) return { error: 'Unknown connection.' };
  const where = and(eq(schema.connections.id, connectionId), eq(schema.connections.agencyId, agency.id));
  const [conn] = await db.select().from(schema.connections).where(where);
  if (!conn) return { ok: true };
  if (conn.provider === 'google' && conn.refreshToken) await revokeToken(decrypt(conn.refreshToken));
  await db.delete(schema.connections).where(where);
  revalidatePath('/app');
  return { ok: true };
}

// Connects Meta with a Business Manager system user token. Pasting a new token for the same system user replaces the old one,
// and its ad accounts keep their clients.
export async function connectMetaAction(token: string) {
  const m = await managerAgency().catch(() => null);
  if (!m) return { error: 'Only the owner and admins can connect tools.' };
  const t = (token || '').trim();
  if (!/^[A-Za-z0-9_-]{40,}$/.test(t)) return { error: 'Paste the whole token. It is a long string of letters and numbers.' };
  let who;
  try { who = await checkToken(t); } catch (e) { return { error: tokenProblem(e) }; }
  const values = { agencyId: m.agency.id, provider: 'meta' as const, login: who.name, connectedBy: m.user.id, accessToken: encrypt(t), accessTokenExpiresAt: who.expiresAt, refreshToken: null, status: 'ok' as const, error: null };
  const [conn] = await db.insert(schema.connections).values(values)
    .onConflictDoUpdate({ target: [schema.connections.agencyId, schema.connections.provider, schema.connections.login], set: values }).returning();
  let found;
  try { found = await syncMetaAccounts(conn); } catch (e) { revalidatePath('/app'); return { error: 'The token works, but listing ad accounts failed. ' + tokenProblem(e) }; }
  // The first real connection takes the agency out of sample mode.
  if (m.agency.sampleMode) await db.update(schema.agencies).set({ sampleMode: false }).where(eq(schema.agencies.id, m.agency.id));
  revalidatePath('/app');
  return { ok: true, login: who.name, found };
}

// Re-reads which properties or ad accounts a login can see, e.g. after a client shared a new one.
export async function refreshAccountsAction(connectionId: string) {
  const { agency } = await managerAgency().catch(() => ({ agency: null }));
  if (!agency) return { error: 'Only the owner and admins can refresh tools.' };
  if (!Id.safeParse(connectionId).success) return { error: 'Unknown connection.' };
  const [conn] = await db.select().from(schema.connections).where(and(eq(schema.connections.id, connectionId), eq(schema.connections.agencyId, agency.id)));
  if (!conn) return { error: 'That connection was removed.' };
  try {
    const n = conn.provider === 'meta' ? await syncMetaAccounts(conn) : await syncGoogleAccounts(conn);
    revalidatePath('/app');
    return { ok: true, found: n };
  } catch (e) {
    if (conn.provider === 'meta') { revalidatePath('/app'); return { error: tokenProblem(e) }; }
    return { error: e instanceof GoogleError && e.code === 'invalid_grant' ? 'Google signed this login out. Connect it again.' : 'Google didn’t answer. Try again in a minute.' };
  }
}
