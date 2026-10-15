import type { Metadata } from 'next';
import LandingScreen from '@/screens/landing/Screen';

export const metadata: Metadata = { title: 'AI Ads Analyst: weekly ad reports in plain English' };

export default function Page() {
  return <LandingScreen />;
}
