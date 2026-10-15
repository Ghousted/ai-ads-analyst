import 'server-only';
import { createNeonAuth } from '@neondatabase/auth/next/server';

type NeonAuth = ReturnType<typeof createNeonAuth>;
let instance: NeonAuth | undefined;

// Created on first use, so `next build` needs no auth secrets.
export function neonAuth(): NeonAuth {
  instance ??= createNeonAuth({
    baseUrl: process.env.NEON_AUTH_BASE_URL!,
    cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET! },
  });
  return instance;
}
