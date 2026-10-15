import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import LoginScreen from '@/screens/login/Screen';
import { getUser } from '@/lib/auth';

export const metadata: Metadata = { title: 'Log in · AI Ads Analyst' };

export default async function Page({ searchParams }: { searchParams: Promise<{ mode?: string; token?: string }> }) {
  const { mode, token } = await searchParams;
  const resetToken = mode === 'reset' && token ? token : undefined;
  if (!resetToken && (await getUser())) redirect('/app');
  return <LoginScreen startMode={mode === 'signup' ? 'Sign up' : 'Log in'} resetToken={resetToken} />;
}
