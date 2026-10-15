import type { Metadata } from 'next';
import { and, asc, desc, eq, isNull } from 'drizzle-orm';
import AppScreen from '@/screens/app/Screen';
import { db, schema } from '@/db';
import { requireAgency } from '@/lib/auth';
import { listIntegrations } from '@/lib/integrations';
import { loadMetrics } from '@/lib/metrics';
import { scoreClients } from '@/lib/risk';
import { normalizeContent } from '@/lib/report-blocks';

export const metadata: Metadata = { title: 'AI Ads Analyst' };
// Sending a report can print its PDF first, which takes a few seconds.
export const maxDuration = 60;

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
  const live = agency.sampleMode ? null : await (async () => {
    const [clients, conns, metrics, reports, flags] = await Promise.all([
      db.select().from(schema.clients).where(eq(schema.clients.agencyId, agency.id)).orderBy(asc(schema.clients.createdAt)),
      listIntegrations(agency.id),
      loadMetrics(agency.id),
      db.select().from(schema.reports).where(eq(schema.reports.agencyId, agency.id)).orderBy(desc(schema.reports.createdAt)).limit(100),
      db.select().from(schema.clientFlags).where(eq(schema.clientFlags.agencyId, agency.id)),
    ]);
    // Who is flagged and why, with Claude's saved analysis while it still matches the numbers.
    const scored = scoreClients(metrics, clients, reports);
    const risk = Object.fromEntries(Object.entries(scored).map(([id, r]) => {
      const f = flags.find(x => x.clientId === id);
      return [id, { level: r.level, keys: r.keys, signals: r.signals.map(s => ({ key: s.key, label: s.label, detail: s.detail, say: s.say, act: s.act })),
        lastReport: r.lastReport, weeks: r.weeks.map(w => w.leads), dismissed: !!r.keys && f?.dismissedKeys === r.keys, analysis: f?.analysis && f.signature === r.signature ? f.analysis : null }];
    }));
    return {
      clients: clients.map(c => ({ id: c.id, name: c.name, email: c.email, contactName: c.contactName, schedule: c.schedule, tone: c.tone })),
      conns, metrics, risk,
      reports: reports.map(r => ({ id: r.id, clientId: r.clientId, title: r.title, status: r.status, createdAt: r.createdAt.toISOString(), sentAt: r.sentAt?.toISOString() ?? null, sentTo: r.sentTo, shareToken: r.shareToken, viewCount: r.viewCount, lastViewedAt: r.lastViewedAt?.toISOString() ?? null, periodStart: r.periodStart, periodEnd: r.periodEnd, facts: r.facts, content: normalizeContent(r.content, r.facts as never) })),
    };
  })();
  const team = members.map(m => ({ id: m.id, name: m.name || m.email.split('@')[0], email: m.email, role: cap(m.role), pending: false }))
    .concat(invites.map(i => ({ id: '', name: i.email, email: i.email, role: cap(i.role), pending: true })));
  return (
    <AppScreen
      me={{ id: user.id, name: user.name || user.email.split('@')[0], email: user.email, role: cap(role) }}
      agency={{ name: agency.name, sampleMode: agency.sampleMode, reportFreq: agency.reportFreq, reportTone: agency.reportTone, brandLogo: agency.brandLogo, brandColor: agency.brandColor }}
      team={team}
      live={live}
    />
  );
}
