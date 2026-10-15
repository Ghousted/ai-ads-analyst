import { redirect } from 'next/navigation';
import { requireUser, getMembership } from '@/lib/auth';

// Where sign-in with Google returns. New people go to setup, everyone else into the app.
export default async function Page() {
  const user = await requireUser();
  redirect((await getMembership(user.id)) ? '/app' : '/setup');
}
