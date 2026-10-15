import type { Metadata } from 'next';
import AppScreen from '@/screens/app/Screen';

export const metadata: Metadata = { title: 'AI Ads Analyst' };

export default function Page() {
  return <AppScreen />;
}
