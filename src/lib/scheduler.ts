import 'server-only';
import { and, eq, gt, inArray, isNotNull, isNull, lte } from 'drizzle-orm';
import { db, schema } from '@/db';
import { emailConfigured, sendEmail } from './email';
import { noticeEmail } from './notice-email';
import { createReport } from './report-create';
import { defaultMessage, deliverReport, reportFor } from './report-send';
import { nextSend, parseSchedule, periodDays, sendLabel } from './schedule';

// Scheduled reports. Each client's report is written as a draft a day before it is due, and the agency is emailed to
// review it. A draft the agency approves sends itself at its scheduled time; one nobody approves stays a draft.
const AHEAD_MS = 24 * 3600_000;
// An approved report that couldn't go out (sending down, daily limit) is retried for this long, then left as a draft.
const RETRY_MS = 48 * 3600_000;
const appUrl = () => (process.env.APP_URL || '').replace(/\/$/, '');

// Who hears about new drafts: the owner and admins. notify, when given, can narrow that (notification settings).
export type Recipients = (agencyId: string, kind: 'drafts') => Promise<{ email: string; name: string }[]>;
export const managers: Recipients = async agencyId => db.select({ email: schema.users.email, name: schema.users.name }).from(schema.agencyMembers)
  .innerJoin(schema.users, eq(schema.users.id, schema.agencyMembers.userId))
  .where(and(eq(schema.agencyMembers.agencyId, agencyId), inArray(schema.agencyMembers.role, ['owner', 'admin'])));

export async function draftScheduled(deadline: number, now = new Date(), recipients: Recipients = managers) {
  const rows = await db.select({ client: schema.clients, agency: schema.agencies }).from(schema.clients)
    .innerJoin(schema.agencies, eq(schema.agencies.id, schema.clients.agencyId)).where(eq(schema.agencies.sampleMode, false));
  const made: { agency: typeof schema.agencies.$inferSelect; client: string; id: string; title: string; at: Date }[] = [];
  const skipped: string[] = [];
  for (const { client, agency } of rows) {
    if (Date.now() > deadline) break;
    const s = parseSchedule(client.schedule);
    if (!s) continue;
    const at = nextSend(s, agency.timeZone, now);
    if (at.getTime() - now.getTime() > AHEAD_MS) continue;
    if (client.draftedFor && client.draftedFor.getTime() === at.getTime()) continue;
    // A report written by hand in the last two days stands in for this one.
    const [recent] = await db.select({ id: schema.reports.id }).from(schema.reports)
      .where(and(eq(schema.reports.clientId, client.id), isNull(schema.reports.scheduledFor), gt(schema.reports.createdAt, new Date(now.getTime() - 2 * 864e5))));
    const r = recent ? { error: 'a report was written by hand in the last two days' } : await createReport({ agency, client, days: periodDays(s), template: 'weekly', scheduledFor: at });
    // No numbers yet, or the daily AI limit: try again next hour.
    if ('error' in r && !recent) { skipped.push(client.name + ': ' + r.error); continue; }
    await db.update(schema.clients).set({ draftedFor: at }).where(eq(schema.clients.id, client.id));
    if ('error' in r) continue;
    made.push({ agency, client: client.name, id: r.id, title: r.title, at });
  }
  // One email per agency for everything written in this run.
  if (emailConfigured()) for (const agencyId of new Set(made.map(m => m.agency.id))) {
    const mine = made.filter(m => m.agency.id === agencyId), agency = mine[0].agency;
    const to = (await recipients(agencyId, 'drafts')).map(u => u.email);
    if (!to.length) continue;
    const { html, text } = noticeEmail({
      agency: agency.name, heading: mine.length === 1 ? mine[0].client + '’s report is ready to review' : mine.length + ' reports are ready to review',
      intro: 'Analyst wrote ' + (mine.length === 1 ? 'this report' : 'these reports') + ' from the latest numbers. Read ' + (mine.length === 1 ? 'it' : 'each one') + ', edit anything you like, then approve it. Approved reports go to the client at the time below. Nothing is sent until you approve.',
      items: mine.map(m => ({ title: m.client, detail: m.title, note: 'Goes out ' + sendLabel(m.at, agency.timeZone) + ' once approved', link: appUrl() + '/app?open=' + m.id, linkLabel: 'Review and approve' })),
      footer: 'You get this because you’re an owner or admin of ' + agency.name + ' on AI Ads Analyst.',
    });
    try { await sendEmail({ fromName: 'AI Ads Analyst', to, subject: mine.length === 1 ? mine[0].client + '’s report is ready to review' : mine.length + ' client reports are ready to review', html, text, tag: 'drafts' }); }
    catch (e) { console.error('[drafts email]', e); }
  }
  return { drafted: made.length, skipped };
}

// Sends approved drafts whose time has come. Each is claimed first (sentAt set while it is still a draft) so two runs
// can't both send it; a failed send releases it for the next run.
export async function sendApproved(deadline: number, now = new Date()) {
  const due = await db.select({ id: schema.reports.id, agencyId: schema.reports.agencyId }).from(schema.reports)
    .where(and(eq(schema.reports.status, 'draft'), isNotNull(schema.reports.approvedAt), isNull(schema.reports.sentAt),
      lte(schema.reports.scheduledFor, now), gt(schema.reports.scheduledFor, new Date(now.getTime() - RETRY_MS))));
  const out: { id: string; ok: boolean; error?: string }[] = [];
  for (const d of due) {
    if (Date.now() > deadline) break;
    const [claimed] = await db.update(schema.reports).set({ sentAt: new Date() }).where(and(eq(schema.reports.id, d.id), isNull(schema.reports.sentAt), eq(schema.reports.status, 'draft'))).returning({ id: schema.reports.id });
    if (!claimed) continue;
    const [agency] = await db.select().from(schema.agencies).where(eq(schema.agencies.id, d.agencyId));
    const r = await reportFor(d.agencyId, d.id);
    const [approver] = r?.report.approvedBy ? await db.select().from(schema.users).where(eq(schema.users.id, r.report.approvedBy)) : [];
    const res = !r || !agency ? { error: 'Report or agency gone' } : !r.client.email ? { error: r.client.name + ' has no contact email' }
      : await deliverReport(agency, r, { to: [r.client.email], subject: r.report.title + ' from ' + agency.name, message: defaultMessage(r, approver?.name || agency.name), replyTo: approver?.email });
    if ('error' in res) await db.update(schema.reports).set({ sentAt: null }).where(and(eq(schema.reports.id, d.id), eq(schema.reports.status, 'draft')));
    out.push({ id: d.id, ok: !('error' in res), error: 'error' in res ? res.error : undefined });
  }
  return out;
}
