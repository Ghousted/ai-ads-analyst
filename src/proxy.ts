import type { NextRequest } from 'next/server';
import { neonAuth } from '@/lib/neon-auth';

// Signed-in pages: the app and setup. Everything else (landing, login, info pages, auth and cron routes) is public.
let middleware: ReturnType<ReturnType<typeof neonAuth>['middleware']> | undefined;

export default function proxy(req: NextRequest) {
  middleware ??= neonAuth().middleware({ loginUrl: '/login' });
  return middleware(req);
}

export const config = { matcher: ['/app/:path*', '/setup/:path*'] };
