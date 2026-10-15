'use server';
import { revalidatePath } from 'next/cache';
import { after } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/db';
import { requireAgency, canManage } from '@/lib/auth';
import { decrypt } from '@/lib/crypto';
import { revokeToken, GoogleError } from '@/lib/google';
import { syncGoogleAccounts } from '@/lib/integrations';
import { syncGa4Account } from '@/lib/ga4';

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
  // A newly linked property starts pulling its numbers in the background (only accounts this agency owns).
  if (p.data.clientId) { const id = changed[0].id, ag = agency.id; after(() => syncGa4Account(id, ag)); }
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

// Re-reads which properties a login can see, e.g. after a client shared a new one.
export async function refreshAccountsAction(connectionId: string) {
  const { agency } = await managerAgency().catch(() => ({ agency: null }));
  if (!agency) return { error: 'Only the owner and admins can refresh tools.' };
  if (!Id.safeParse(connectionId).success) return { error: 'Unknown connection.' };
  const [conn] = await db.select().from(schema.connections).where(and(eq(schema.connections.id, connectionId), eq(schema.connections.agencyId, agency.id)));
  if (!conn) return { error: 'That connection was removed.' };
  try {
    const n = await syncGoogleAccounts(conn);
    revalidatePath('/app');
    return { ok: true, found: n };
  } catch (e) {
    return { error: e instanceof GoogleError && e.code === 'invalid_grant' ? 'Google signed this login out. Connect it again.' : 'Google didn’t answer. Try again in a minute.' };
  }
}
