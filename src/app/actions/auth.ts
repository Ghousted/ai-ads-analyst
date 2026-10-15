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
