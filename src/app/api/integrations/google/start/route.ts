import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getUser, getMembership, canManage } from '@/lib/auth';
import { googleAuthUrl } from '@/lib/google';

// Starts Google sign-in for GA4. The state nonce is kept in a short-lived cookie and checked on the way back.
export async function GET(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.redirect(new URL('/login', req.url));
  const m = await getMembership(user.id);
  if (!m) return NextResponse.redirect(new URL('/setup', req.url));
  if (!canManage(m.role)) return NextResponse.redirect(new URL('/app?integration=google&result=forbidden', req.url));
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) return NextResponse.redirect(new URL('/app?integration=google&result=unconfigured', req.url));
  const state = randomBytes(24).toString('base64url');
  const hint = new URL(req.url).searchParams.get('hint') || undefined;
  const res = NextResponse.redirect(googleAuthUrl(state, hint));
  res.cookies.set('ga_oauth_state', state, { httpOnly: true, sameSite: 'lax', secure: req.url.startsWith('https:'), path: '/api/integrations/google', maxAge: 600 });
  return res;
}
