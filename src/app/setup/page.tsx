import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import SetupScreen from '@/screens/setup/Screen';
import { db, schema } from '@/db';
import { requireUser, getMembership } from '@/lib/auth';
import { listIntegrations } from '@/lib/integrations';

export const metadata: Metadata = { title: 'Set up AI Ads Analyst' };

// Setup creates the agency before its connect step, so coming back from Google lands here with an agency already
// made: setup resumes at the connect step with what was saved. Otherwise a person with an agency goes to the app.
export default async function Page({ searchParams }: { searchParams: Promise<{ integration?: string; result?: string; found?: string; login?: string }> }) {
  const user = await requireUser();
  const q = await searchParams, m = await getMembership(user.id);
  if (!m) return <SetupScreen />;
  if (q.integration !== 'google') redirect('/app');
  const conns = await listIntegrations(m.agency.id);
  const [first] = await db.select({ name: schema.clients.name }).from(schema.clients).where(eq(schema.clients.agencyId, m.agency.id)).limit(1);
  return <SetupScreen resume={{ workspace: m.agency.name, team: m.agency.teamSize, freq: m.agency.reportFreq, tone: m.agency.reportTone, client: first?.name || '',
    conns: conns.map(c => ({ provider: c.provider, login: c.login, found: c.accounts.length })), result: q.result || '', found: Number(q.found || 0), login: q.login || '' }} />;
}
