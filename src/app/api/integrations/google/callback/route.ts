import { NextResponse, after } from 'next/server';
import { and, eq, isNull } from 'drizzle-orm';
import { db, schema } from '@/db';
import { getUser, getMembership, canManage } from '@/lib/auth';
import { findConnectLink } from '@/lib/client-connect';
import { encrypt } from '@/lib/crypto';
import { emailFromIdToken, exchangeCode, GOOGLE_SCOPES, GoogleError } from '@/lib/google';
import { syncGoogleAccounts } from '@/lib/integrations';
import { syncAccount } from '@/lib/sync';

const COOKIE_PATH = '/api/integrations/google';

// Google sends people back here. Saves (or refreshes) the connection for that Google login and lists its properties.
// A client signing in from their ask-to-connect link gets their properties linked to them, and goes back to that page.
export async function GET(req: Request) {
  const url = new URL(req.url), cookies = req.headers.get('cookie') || '';
  const read = (name: string) => cookies.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'))?.[1];
  const connect = read('ga_oauth_connect');
  const back = (result: string, extra = '') => {
    const to = connect ? '/connect/' + encodeURIComponent(connect) + '?result=' + result + extra : '/app?integration=google&result=' + result + extra;
    const res = NextResponse.redirect(new URL(to, req.url));
    res.cookies.delete({ name: 'ga_oauth_state', path: COOKIE_PATH });
    res.cookies.delete({ name: 'ga_oauth_connect', path: COOKIE_PATH });
    return res;
  };

  // Who the connection is for: the signed-in agency, or the client behind the link.
  let agencyId: string, sampleMode = false, connectedBy: string | null = null, forClientId: string | null = null;
  if (connect) {
    const link = await findConnectLink(connect);
    if (!link) return back('expired');
    agencyId = link.agency.id; forClientId = link.client.id;
  } else {
    const user = await getUser();
    if (!user) return NextResponse.redirect(new URL('/login', req.url));
    const m = await getMembership(user.id);
    if (!m || !canManage(m.role)) return back('forbidden');
    agencyId = m.agency.id; sampleMode = m.agency.sampleMode; connectedBy = user.id;
  }

  if (!read('ga_oauth_state') || read('ga_oauth_state') !== url.searchParams.get('state')) return back('expired');
  if (url.searchParams.get('error')) return back('cancelled');
  const code = url.searchParams.get('code');
  if (!code) return back('cancelled');

  try {
    const t = await exchangeCode(code);
    const granted = (t.scope || '').split(' ');
    if (!granted.includes(GOOGLE_SCOPES[2])) return back('noscope');
    const login = emailFromIdToken(t.id_token);
    if (!login) return back('failed');
    const tokens = {
      accessToken: encrypt(t.access_token), accessTokenExpiresAt: new Date(Date.now() + t.expires_in * 1000), status: 'ok' as const, error: null,
      ...(t.refresh_token ? { refreshToken: encrypt(t.refresh_token) } : {}),
    };
    // Signing in again refreshes the tokens. A login the agency already has keeps its owner and its assignments.
    await db.insert(schema.connections).values({ agencyId, provider: 'google', login, connectedBy, forClientId, ...tokens })
      .onConflictDoUpdate({ target: [schema.connections.agencyId, schema.connections.provider, schema.connections.login], set: connect ? tokens : { connectedBy, ...tokens } });
    const [conn] = await db.select().from(schema.connections)
      .where(and(eq(schema.connections.agencyId, agencyId), eq(schema.connections.provider, 'google'), eq(schema.connections.login, login)));
    const found = await syncGoogleAccounts(conn);
    if (forClientId) {
      // Everything this login sees that no other client has goes to the client who connected it.
      const linked = await db.update(schema.accounts).set({ clientId: forClientId })
        .where(and(eq(schema.accounts.connectionId, conn.id), isNull(schema.accounts.clientId))).returning({ id: schema.accounts.id });
      after(async () => { for (const a of linked) await syncAccount(a.id, agencyId); });
      return back('connected', '&found=' + linked.length);
    }
    // The first real connection takes the agency out of sample mode.
    if (sampleMode) await db.update(schema.agencies).set({ sampleMode: false }).where(eq(schema.agencies.id, agencyId));
    return back('connected', '&found=' + found + '&login=' + encodeURIComponent(login));
  } catch (e) {
    console.error('[google callback]', e instanceof GoogleError ? e.message : e);
    return back(e instanceof GoogleError && /has not been used|disabled/i.test(e.message) ? 'apidisabled' : 'failed');
  }
}
