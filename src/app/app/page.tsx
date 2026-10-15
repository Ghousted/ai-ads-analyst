import type { Metadata } from 'next';
import { and, asc, eq, isNull } from 'drizzle-orm';
import AppScreen from '@/screens/app/Screen';
import { db, schema } from '@/db';
import { requireAgency } from '@/lib/auth';
import { listIntegrations } from '@/lib/integrations';

export const metadata: Metadata = { title: 'AI Ads Analyst' };

const cap = (r: string) => r[0].toUpperCase() + r.slice(1);

export default async function Page() {
  const { user, agency, role } = await requireAgency();
  const [members, invites] = await Promise.all([
    db.select({ id: schema.users.id, name: schema.users.name, email: schema.users.email, role: schema.agencyMembers.role })
      .from(schema.agencyMembers).innerJoin(schema.users, eq(schema.users.id, schema.agencyMembers.userId))
      .where(eq(schema.agencyMembers.agencyId, agency.id)).orderBy(asc(schema.agencyMembers.createdAt)),
    db.select({ email: schema.invitations.email, role: schema.invitations.role })
      .from(schema.invitations).where(and(eq(schema.invitations.agencyId, agency.id), isNull(schema.invitations.acceptedAt)))
      .orderBy(asc(schema.invitations.createdAt)),
  ]);
  // Out of sample mode, the app works on the agency's own clients and connections.
  const live = agency.sampleMode ? null : {
    clients: (await db.select().from(schema.clients).where(eq(schema.clients.agencyId, agency.id)).orderBy(asc(schema.clients.createdAt)))
      .map(c => ({ id: c.id, name: c.name, email: c.email, contactName: c.contactName, schedule: c.schedule, tone: c.tone })),
    conns: await listIntegrations(agency.id),
  };
  const team = members.map(m => ({ id: m.id, name: m.name || m.email.split('@')[0], email: m.email, role: cap(m.role), pending: false }))
    .concat(invites.map(i => ({ id: '', name: i.email, email: i.email, role: cap(i.role), pending: true })));
  return (
    <AppScreen
      me={{ id: user.id, name: user.name || user.email.split('@')[0], email: user.email, role: cap(role) }}
      agency={{ name: agency.name, sampleMode: agency.sampleMode, reportFreq: agency.reportFreq, reportTone: agency.reportTone }}
      team={team}
      live={live}
    />
  );
}
