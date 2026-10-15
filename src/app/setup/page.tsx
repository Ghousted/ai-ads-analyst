import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import SetupScreen from '@/screens/setup/Screen';
import { requireUser, getMembership } from '@/lib/auth';

export const metadata: Metadata = { title: 'Set up AI Ads Analyst' };

export default async function Page() {
  const user = await requireUser();
  if (await getMembership(user.id)) redirect('/app');
  return <SetupScreen />;
}
