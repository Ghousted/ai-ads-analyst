import type { Metadata } from 'next';
import SetupScreen from '@/screens/setup/Screen';

export const metadata: Metadata = { title: 'Set up Clario' };

export default function Page() {
  return <SetupScreen />;
}
