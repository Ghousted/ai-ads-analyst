'use server';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { neonAuth } from '@/lib/neon-auth';

const appUrl = () => (process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, '');
const Email = z.string().trim().toLowerCase().email();
const Password = z.string().min(8);
type Result = { error: string } | undefined;

// Errors stay generic so the form never reveals whether an account exists.
export async function signInAction(input: { email: string; password: string }): Promise<Result> {
  const p = z.object({ email: Email, password: Password }).safeParse(input);
  if (!p.success) return { error: 'Check your email and password.' };
  const { error } = await neonAuth().signIn.email({ email: p.data.email, password: p.data.password });
  if (error) return { error: 'That email and password don’t match an account.' };
  redirect('/app');
}

export async function signUpAction(input: { name: string; email: string; password: string }): Promise<Result> {
  const p = z.object({ name: z.string().trim().max(80), email: Email, password: Password }).safeParse(input);
  if (!p.success) return { error: 'Check your email and password.' };
  const { error } = await neonAuth().signUp.email({ name: p.data.name || p.data.email.split('@')[0], email: p.data.email, password: p.data.password });
  if (error) return { error: 'We couldn’t create that account. If you already have one, log in instead.' };
  redirect('/setup');
}

// Google sign-in runs through Neon Auth and returns to /auth/callback, which sends new people to setup.
export async function googleAction(): Promise<{ url?: string; error?: string }> {
  const { data, error } = await neonAuth().signIn.social({ provider: 'google', callbackURL: appUrl() + '/auth/callback' });
  if (error || !data?.url) return { error: 'Google sign-in isn’t available right now. Use your email instead.' };
  return { url: data.url };
}

export async function forgotAction(email: string): Promise<Result> {
  const p = Email.safeParse(email);
  if (!p.success) return { error: 'Enter your email first.' };
  await neonAuth().requestPasswordReset({ email: p.data, redirectTo: appUrl() + '/login?mode=reset' });
}

export async function resetAction(input: { token: string; password: string }): Promise<Result> {
  const p = z.object({ token: z.string().min(1), password: Password }).safeParse(input);
  if (!p.success) return { error: 'Use at least 8 characters.' };
  const { error } = await neonAuth().resetPassword({ newPassword: p.data.password, token: p.data.token });
  if (error) return { error: 'That reset link has expired. Ask for a new one from the log in page.' };
}

export async function signOutAction() {
  await neonAuth().signOut();
  redirect('/login');
}

// "Chrome on Mac" from a browser's user agent.
function device(ua: string | null | undefined) {
  const u = ua || '';
  const browser = /Edg\//.test(u) ? 'Edge' : /OPR\//.test(u) ? 'Opera' : /Firefox\//.test(u) ? 'Firefox' : /Chrome\//.test(u) ? 'Chrome' : /Safari\//.test(u) ? 'Safari' : 'A browser';
  const os = /iPhone/.test(u) ? 'iPhone' : /iPad/.test(u) ? 'iPad' : /Android/.test(u) ? 'Android' : /Mac OS X|Macintosh/.test(u) ? 'Mac' : /Windows/.test(u) ? 'Windows' : /Linux/.test(u) ? 'Linux' : '';
  return os ? browser + ' on ' + os : browser;
}

type AuthSession = { id: string; token: string; userAgent?: string | null; updatedAt: string | Date; expiresAt: string | Date };

async function sessions() {
  const auth = neonAuth();
  const [cur, list] = await Promise.all([auth.getSession({ query: { disableCookieCache: 'true' } }), auth.listSessions()]);
  const me = (cur.data as { session?: { id?: string } } | null)?.session?.id;
  if (!me || list.error || !Array.isArray(list.data)) return null;
  return { me, all: (list.data as AuthSession[]).filter(s => new Date(s.expiresAt).getTime() > Date.now()) };
}

// Where the signed-in person is signed in (Settings › Security).
export async function listSessionsAction() {
  const s = await sessions();
  if (!s) return { error: 'Your devices couldn’t be loaded. Try again.' };
  return { ok: true, devices: s.all.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)).map(x => ({ name: device(x.userAgent), current: x.id === s.me, lastActive: new Date(x.updatedAt).toISOString() })) };
}

// Signs the person out everywhere except this browser.
export async function signOutOthersAction() {
  const s = await sessions();
  if (!s) return { error: 'Your devices couldn’t be loaded. Try again.' };
  const others = s.all.filter(x => x.id !== s.me);
  for (const x of others) await neonAuth().revokeSession({ token: x.token });
  return { ok: true, count: others.length };
}
