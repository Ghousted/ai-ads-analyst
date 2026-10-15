import { NextResponse, type NextRequest } from 'next/server';
import { neonAuth } from '@/lib/neon-auth';

// Signed-in pages: the app, setup and the sign-in callback. Everything else is public, except that any page Google
// sends someone back to with a session verifier gets that verifier exchanged for a session cookie.
const VERIFIER = 'neon_auth_session_verifier';
const PROTECTED = ['/app', '/setup', '/auth/callback'];
let middleware: ReturnType<ReturnType<typeof neonAuth>['middleware']> | undefined;

export default async function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const isProtected = PROTECTED.some(p => pathname === p || pathname.startsWith(p + '/'));
  const returning = searchParams.has(VERIFIER);
  if (!isProtected && !returning) return NextResponse.next();
  middleware ??= neonAuth().middleware({ loginUrl: '/login' });
  const res = await middleware(req);
  // Back from Google on a public page: keep the new session cookies, then continue into the app.
  if (returning && !isProtected && res.headers.get('location')) {
    const next = NextResponse.redirect(new URL('/auth/callback', req.url));
    for (const c of res.headers.getSetCookie()) next.headers.append('set-cookie', c);
    return next;
  }
  return res;
}

export const config = { matcher: ['/((?!api/|_next/|assets/|.*\\.[a-zA-Z0-9]+$).*)'] };
