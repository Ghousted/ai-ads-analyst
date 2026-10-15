import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import { getUser, getMembership, canManage } from '@/lib/auth';
import { encrypt } from '@/lib/crypto';
import { emailFromIdToken, exchangeCode, GOOGLE_SCOPES, GoogleError } from '@/lib/google';
import { syncGoogleAccounts } from '@/lib/integrations';

// Google sends people back here. Saves (or refreshes) the connection for that Google login and lists its properties.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const back = (result: string, extra = '') => {
    const res = NextResponse.redirect(new URL('/app?integration=google&result=' + result + extra, req.url));
    res.cookies.delete({ name: 'ga_oauth_state', path: '/api/integrations/google' });
    return res;
  };
  const user = await getUser();
  if (!user) return NextResponse.redirect(new URL('/login', req.url));
  const m = await getMembership(user.id);
  if (!m || !canManage(m.role)) return back('forbidden');

  const cookieState = req.headers.get('cookie')?.match(/(?:^|;\s*)ga_oauth_state=([^;]+)/)?.[1];
  if (!cookieState || cookieState !== url.searchParams.get('state')) return back('expired');
  if (url.searchParams.get('error')) return back('cancelled');
  const code = url.searchParams.get('code');
  if (!code) return back('cancelled');

  try {
    const t = await exchangeCode(code);
    const granted = (t.scope || '').split(' ');
    if (!granted.includes(GOOGLE_SCOPES[2])) return back('noscope');
    const login = emailFromIdToken(t.id_token);
    if (!login) return back('failed');
    const values = {
      agencyId: m.agency.id, provider: 'google' as const, login, connectedBy: user.id,
      accessToken: encrypt(t.access_token), accessTokenExpiresAt: new Date(Date.now() + t.expires_in * 1000), status: 'ok' as const, error: null,
      ...(t.refresh_token ? { refreshToken: encrypt(t.refresh_token) } : {}),
    };
    await db.insert(schema.connections).values(values)
      .onConflictDoUpdate({ target: [schema.connections.agencyId, schema.connections.provider, schema.connections.login], set: values });
    const [conn] = await db.select().from(schema.connections)
      .where(and(eq(schema.connections.agencyId, m.agency.id), eq(schema.connections.provider, 'google'), eq(schema.connections.login, login)));
    const found = await syncGoogleAccounts(conn);
    // The first real connection takes the agency out of sample mode.
    if (m.agency.sampleMode) await db.update(schema.agencies).set({ sampleMode: false }).where(eq(schema.agencies.id, m.agency.id));
    return back('connected', '&found=' + found + '&login=' + encodeURIComponent(login));
  } catch (e) {
    console.error('[google callback]', e instanceof GoogleError ? e.message : e);
    return back(e instanceof GoogleError && /has not been used|disabled/i.test(e.message) ? 'apidisabled' : 'failed');
  }
}
