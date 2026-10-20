import 'server-only';
import { createHmac } from 'node:crypto';

// Meta Marketing API with a Business Manager system user token. The token is pasted once in Integrations; it belongs to
// the agency's Business Manager, not a person, so it keeps working when people leave. Read-only: ads_read is all we ask.
const VERSION = process.env.META_API_VERSION || 'v24.0';
const GRAPH = 'https://graph.facebook.com/' + VERSION;
export const META_SCOPE = 'ads_read';

export class MetaError extends Error {
  constructor(message: string, public code?: number, public subcode?: number) { super(message); }
}

// Token problems (expired, revoked, the system user was removed) all come back as code 190.
export const isTokenError = (e: unknown) => e instanceof MetaError && e.code === 190;
// Too many calls for this app or ad account. Meta lifts it on its own after a while.
export const isRateLimit = (e: unknown) => e instanceof MetaError && (e.code === 4 || e.code === 17 || e.code === 32 || e.code === 613 || (e.code ?? 0) >= 80000 && (e.code ?? 0) <= 80014);

// Apps with "Require app secret" on reject calls without this proof, so it is always sent when the secret is set.
const proof = (token: string) => (process.env.META_APP_SECRET ? createHmac('sha256', process.env.META_APP_SECRET).update(token).digest('hex') : null);

export async function graph<T>(path: string, token: string, params: Record<string, string> = {}): Promise<T> {
  const u = new URL(path.startsWith('https://') ? path : GRAPH + path);
  if (!path.startsWith('https://')) {
    for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
    u.searchParams.set('access_token', token);
    const p = proof(token);
    if (p) u.searchParams.set('appsecret_proof', p);
  }
  const res = await fetch(u, { cache: 'no-store', signal: AbortSignal.timeout(30_000) });
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.error) {
    const e = json?.error;
    throw new MetaError(e?.error_user_msg || e?.message || 'Meta didn’t answer', e?.code, e?.error_subcode);
  }
  return json as T;
}

// Every page of a list endpoint, up to a safe limit. Paging links already carry the token and proof.
export async function graphAll<T>(path: string, token: string, params: Record<string, string> = {}, maxPages = 100): Promise<T[]> {
  const out: T[] = [];
  let page = await graph<{ data: T[]; paging?: { next?: string } }>(path, token, params);
  for (let n = 1; ; n++) {
    out.push(...page.data);
    if (!page.paging?.next || n >= maxPages) return out;
    page = await graph(page.paging.next, token);
  }
}

export type MetaLogin = { id: string; name: string; expiresAt: Date | null };

// Checks a pasted token: it must work and carry ads_read. Returns who it belongs to and when it runs out
// (system user tokens can be set to never expire). debug_token needs the app's own credentials.
export async function checkToken(token: string): Promise<MetaLogin> {
  const me = await graph<{ id: string; name: string }>('/me', token, { fields: 'id,name' });
  const perms = await graph<{ data: { permission: string; status: string }[] }>('/me/permissions', token);
  if (!perms.data.some(p => p.permission === META_SCOPE && p.status === 'granted')) throw new MetaError('missing_scope');
  let expiresAt: Date | null = null;
  if (process.env.META_APP_ID && process.env.META_APP_SECRET) {
    const d = await graph<{ data: { expires_at?: number } }>('/debug_token', process.env.META_APP_ID + '|' + process.env.META_APP_SECRET, { input_token: token }).catch(() => null);
    if (d?.data.expires_at) expiresAt = new Date(d.data.expires_at * 1000);
  }
  return { id: me.id, name: me.name, expiresAt };
}

export type MetaAdAccount = { id: string; name: string; detail: string };

// account_status values Meta uses for accounts that can't run ads. Their history can still be read.
const STATUS: Record<number, string> = { 2: 'Disabled', 3: 'Unsettled', 7: 'Pending review', 9: 'In grace period', 100: 'Pending closure', 101: 'Closed' };

// Every ad account the system user was given in Business Manager.
export async function listAdAccounts(token: string): Promise<MetaAdAccount[]> {
  const rows = await graphAll<{ account_id: string; name: string; currency?: string; account_status?: number; business?: { name: string } }>(
    '/me/adaccounts', token, { fields: 'account_id,name,currency,account_status,business{name}', limit: '200' });
  return rows.map(a => ({
    id: a.account_id, name: a.name || 'Ad account ' + a.account_id,
    detail: [a.business?.name, a.currency, 'Ad account ' + a.account_id, STATUS[a.account_status ?? 1]].filter(Boolean).join(' · '),
  }));
}

// What the person sees when a pasted token is rejected.
export function tokenProblem(e: unknown): string {
  if (e instanceof MetaError && e.message === 'missing_scope') return 'That token doesn’t have the ads_read permission. Generate a new one and tick ads_read.';
  if (isTokenError(e)) return 'Meta didn’t accept that token. It may have expired or been revoked. Generate a new one and paste it again.';
  if (isRateLimit(e)) return 'Meta is limiting calls right now. Try again in a few minutes.';
  return 'Meta didn’t answer. Try again in a minute.';
}
