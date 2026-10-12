import type { Metadata } from 'next';
import AppScreen from '@/screens/app/Screen';

export const metadata: Metadata = { title: 'Clario' };

export default function Page() {
  return <AppScreen />;
}
