import type { Metadata } from 'next';
import LoginScreen from '@/screens/login/Screen';

export const metadata: Metadata = { title: 'Log in · AI Ads Analyst' };

export default async function Page({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const { mode } = await searchParams;
  return <LoginScreen startMode={mode === 'signup' ? 'Sign up' : 'Log in'} />;
}
