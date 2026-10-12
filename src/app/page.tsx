import type { Metadata } from 'next';
import LandingScreen from '@/screens/landing/Screen';

export const metadata: Metadata = { title: 'Clario: weekly ad reports in plain English' };

export default function Page() {
  return <LandingScreen />;
}
