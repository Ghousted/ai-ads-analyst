import 'server-only';
import { and, eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import { takeAiQuota } from './ai';
import { emailConfigured, sendEmail } from './email';
import { reportEmail } from './report-email';
import { reportLink } from './report-link';
import { pdfName, reportPdf } from './report-pdf';
import { dayLabel } from './report-create';
import { normalizeContent, type Doc } from './report-blocks';

type Agency = { id: string; name: string; brandColor: string; brandLogo: string | null };

// The report and its client, for sending. Shared by the preview, the send dialog and scheduled sends.
export async function reportFor(agencyId: string, id: string) {
  const [r] = await db.select({ report: schema.reports, client: schema.clients }).from(schema.reports)
    .innerJoin(schema.clients, eq(schema.clients.id, schema.reports.clientId))
    .where(and(eq(schema.reports.id, id), eq(schema.reports.agencyId, agencyId)));
  return r || null;
}
type Found = NonNullable<Awaited<ReturnType<typeof reportFor>>>;

export function buildReportEmail(agency: Agency, r: Found, message: string, token: string) {
  const base = (process.env.APP_URL || '').replace(/\/$/, '');
  const content = normalizeContent(r.report.content, r.report.facts as never);
  return reportEmail({
    agency: agency.name, color: agency.brandColor, // Email apps don't show SVG, so only image logos go in the email.
    logoUrl: agency.brandLogo && !agency.brandLogo.startsWith('data:image/svg') && base.startsWith('https://') ? base + '/api/brand/' + agency.id : null,
    client: r.client.name, title: r.report.title, period: dayLabel(r.report.periodStart) + ' – ' + dayLabel(r.report.periodEnd),
    message, doc: content.doc as Doc, facts: r.report.facts, link: base + '/r/' + token,
  });
}

// The note a scheduled report goes out with, the same one the send dialog starts from.
export function defaultMessage(r: Found, from: string) {
  const first = (r.client.contactName || '').trim().split(/\s+/)[0];
  return 'Hi ' + (first || 'there') + ',\n\nHere’s your report for ' + dayLabel(r.report.periodStart) + ' – ' + dayLabel(r.report.periodEnd) + '. The highlights are below, and the full report is one click away.\n\n' + from;
}

// Emails the saved report to the client: the headline, key numbers and a private link to the full report, with the
// PDF attached if asked. Counts against the agency's daily sending limit, and marks the report sent.
export async function deliverReport(agency: Agency, r: Found, o: { to: string[]; subject: string; message: string; attachPdf?: boolean; replyTo?: string }) {
  if (!emailConfigured()) return { error: 'Email isn’t set up on this server yet. Add RESEND_API_KEY and EMAIL_FROM.' };
  if (!(await takeAiQuota(agency.id, 'email'))) return { error: 'You’ve reached today’s limit for sending reports. It resets within 24 hours.' };
  // Count the send before it goes out, so sends fired together can't all slip under the limit. A failed send gives it back.
  const [use] = await db.insert(schema.aiUsage).values({ agencyId: agency.id, action: 'email' }).returning({ id: schema.aiUsage.id });
  const giveBack = () => db.delete(schema.aiUsage).where(eq(schema.aiUsage.id, use.id));
  try {
    const token = await reportLink(r.report.id);
    const { html, text } = buildReportEmail(agency, r, o.message, token);
    // The PDF is printed from the report's private page, made above.
    let attachments: { filename: string; content: Buffer }[] | undefined;
    if (o.attachPdf) {
      try { attachments = [{ filename: pdfName(r.client.name, r.report.title), content: await reportPdf(token) }]; }
      catch (e) { console.error('[pdf]', e); await giveBack(); return { error: 'The PDF couldn’t be made, so nothing was sent. Try again, or send without the PDF.' }; }
    }
    await sendEmail({ fromName: agency.name, replyTo: o.replyTo, to: o.to, subject: o.subject, html, text, tag: 'report', attachments });
  } catch (e) {
    await giveBack();
    return { error: e instanceof Error ? e.message : 'Sending failed. Try again.' };
  }
  await db.update(schema.reports).set({ status: 'sent', sentAt: new Date(), sentTo: o.to.join(', '), updatedAt: new Date() }).where(eq(schema.reports.id, r.report.id));
  return { ok: true as const };
}
