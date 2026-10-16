import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getUser, getMembership, canManage } from '@/lib/auth';
import { findConnectLink } from '@/lib/client-connect';
import { googleAuthUrl } from '@/lib/google';

// Starts Google sign-in for GA4. The state nonce is kept in a short-lived cookie and checked on the way back.
// With ?connect=<token> a client signs in from their ask-to-connect link: no agency login is needed, and the token
// rides along in a second cookie.
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams, connect = q.get('connect');
  const cookie = { httpOnly: true, sameSite: 'lax' as const, secure: req.url.startsWith('https:'), path: '/api/integrations/google', maxAge: 600 };
  const state = randomBytes(24).toString('base64url');
  if (connect) {
    const back = (r: string) => NextResponse.redirect(new URL('/connect/' + encodeURIComponent(connect) + '?result=' + r, req.url));
    if (!(await findConnectLink(connect))) return back('expired');
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) return back('failed');
    const res = NextResponse.redirect(googleAuthUrl(state));
    res.cookies.set('ga_oauth_state', state, cookie);
    res.cookies.set('ga_oauth_connect', connect, cookie);
    return res;
  }
  const user = await getUser();
  if (!user) return NextResponse.redirect(new URL('/login', req.url));
  const m = await getMembership(user.id);
  if (!m) return NextResponse.redirect(new URL('/setup', req.url));
  if (!canManage(m.role)) return NextResponse.redirect(new URL('/app?integration=google&result=forbidden', req.url));
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) return NextResponse.redirect(new URL('/app?integration=google&result=unconfigured', req.url));
  const res = NextResponse.redirect(googleAuthUrl(state, q.get('hint') || undefined));
  res.cookies.set('ga_oauth_state', state, cookie);
  res.cookies.delete({ name: 'ga_oauth_connect', path: '/api/integrations/google' });
  return res;
}
