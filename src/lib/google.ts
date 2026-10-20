import 'server-only';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import { decrypt, encrypt } from './crypto';

// Google OAuth for GA4: read-only Analytics access, offline so a refresh token keeps the connection alive.
export const GOOGLE_SCOPES = ['openid', 'email', 'https://www.googleapis.com/auth/analytics.readonly'];
const appUrl = () => (process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, '');
export const googleRedirectUri = () => appUrl() + '/api/integrations/google/callback';

export function googleAuthUrl(state: string, loginHint?: string) {
  const u = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  u.search = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!, redirect_uri: googleRedirectUri(), response_type: 'code',
    scope: GOOGLE_SCOPES.join(' '), access_type: 'offline', prompt: 'consent select_account', include_granted_scopes: 'true', state,
    ...(loginHint ? { login_hint: loginHint } : {}),
  }).toString();
  return u.toString();
}

type TokenResponse = { access_token: string; expires_in: number; refresh_token?: string; id_token?: string; scope?: string; error?: string; error_description?: string };

async function tokenRequest(body: Record<string, string>): Promise<TokenResponse> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: process.env.GOOGLE_CLIENT_ID!, client_secret: process.env.GOOGLE_CLIENT_SECRET!, ...body }),
  });
  const json = (await res.json()) as TokenResponse;
  if (!res.ok) throw new GoogleError(json.error_description || json.error || 'Google token request failed', json.error);
  return json;
}

export class GoogleError extends Error {
  constructor(message: string, public code?: string) { super(message); }
}

export const exchangeCode = (code: string) => tokenRequest({ code, grant_type: 'authorization_code', redirect_uri: googleRedirectUri() });

// The id_token comes straight from Google's token endpoint over TLS, so its payload can be read without verifying the signature.
export function emailFromIdToken(idToken?: string): string | null {
  if (!idToken) return null;
  try { return (JSON.parse(Buffer.from(idToken.split('.')[1], 'base64url').toString()).email as string)?.toLowerCase() ?? null; } catch { return null; }
}

type Conn = typeof schema.connections.$inferSelect;

// A valid access token for a connection, refreshing (and saving) it when it is about to expire.
export async function accessTokenFor(conn: Conn): Promise<string> {
  if (conn.accessToken && conn.accessTokenExpiresAt && conn.accessTokenExpiresAt.getTime() > Date.now() + 60_000) return decrypt(conn.accessToken);
  if (!conn.refreshToken) throw new GoogleError('This Google login needs to be connected again.', 'invalid_grant');
  try {
    const t = await tokenRequest({ refresh_token: decrypt(conn.refreshToken), grant_type: 'refresh_token' });
    await db.update(schema.connections).set({ accessToken: encrypt(t.access_token), accessTokenExpiresAt: new Date(Date.now() + t.expires_in * 1000), status: 'ok', error: null }).where(eq(schema.connections.id, conn.id));
    return t.access_token;
  } catch (e) {
    if (e instanceof GoogleError && e.code === 'invalid_grant') {
      await db.update(schema.connections).set({ status: 'error', error: 'Google signed this login out. Connect it again.' }).where(eq(schema.connections.id, conn.id));
    }
    throw e;
  }
}

export type GA4Property = { id: string; name: string; account: string };

// Every GA4 property the login can see, through the Analytics Admin API.
export async function listProperties(accessToken: string): Promise<GA4Property[]> {
  const out: GA4Property[] = [];
  let pageToken = '';
  do {
    const u = new URL('https://analyticsadmin.googleapis.com/v1beta/accountSummaries');
    u.searchParams.set('pageSize', '200');
    if (pageToken) u.searchParams.set('pageToken', pageToken);
    const res = await fetch(u, { headers: { authorization: 'Bearer ' + accessToken } });
    const json = await res.json();
    if (!res.ok) throw new GoogleError(json?.error?.message || 'Could not list Google Analytics properties', json?.error?.status);
    for (const a of json.accountSummaries ?? []) for (const p of a.propertySummaries ?? []) out.push({ id: String(p.property).replace('properties/', ''), name: p.displayName, account: a.displayName });
    pageToken = json.nextPageToken ?? '';
  } while (pageToken);
  return out;
}

// A property's reporting time zone and currency, set in GA4's property settings.
export async function propertySettings(accessToken: string, propertyId: string): Promise<{ timeZone?: string; currencyCode?: string }> {
  const res = await fetch('https://analyticsadmin.googleapis.com/v1beta/properties/' + propertyId, { headers: { authorization: 'Bearer ' + accessToken }, signal: AbortSignal.timeout(15_000) });
  const json = await res.json();
  if (!res.ok) throw new GoogleError(json?.error?.message || 'Could not read the property settings', json?.error?.status);
  return json;
}

export async function revokeToken(token: string) {
  await fetch('https://oauth2.googleapis.com/revoke?token=' + encodeURIComponent(token), { method: 'POST' }).catch(() => {});
}
