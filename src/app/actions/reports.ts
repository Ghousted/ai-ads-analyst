'use server';
import { revalidatePath } from 'next/cache';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/db';
import { randomBytes } from 'node:crypto';
import { requireAgency } from '@/lib/auth';
import { emailConfigured, sendEmail } from '@/lib/email';
import { reportEmail } from '@/lib/report-email';
import { pdfName, reportPdf } from '@/lib/report-pdf';
import { aiErrorMessage, aiModel, recordAiUsage, takeAiQuota } from '@/lib/ai';
import { buildFacts, rewritePart, writeReport } from '@/lib/report-writer';
import { blankContent, Content, docText, layoutTemplate, normalizeContent, TEMPLATES, type Doc } from '@/lib/report-blocks';

const Id = z.string().uuid();
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const label = (d: string) => { const x = new Date(d + 'T00:00:00Z'); return MON[x.getUTCMonth()] + ' ' + x.getUTCDate(); };

// Claude writes a report for one client from their latest numbers. Saved as a draft for the agency to review.
// With a template, Claude writes the words and the template places them with charts and tables. Blank creates an empty
// report (no AI) that the agency builds from the same blocks.
export async function generateReportAction(input: { clientId: string; days: number; template: string; title?: string }) {
  const { user, agency } = await requireAgency();
  const p = z.object({ clientId: Id, days: z.union([z.literal(7), z.literal(14), z.literal(30)]), template: z.enum(['blank', ...TEMPLATES.map(t => t.id)] as [string, ...string[]]), title: z.string().trim().max(160).optional() }).safeParse(input);
  if (!p.success) return { error: 'Pick a client, a period and a template.' };
  const [client] = await db.select().from(schema.clients).where(and(eq(schema.clients.id, p.data.clientId), eq(schema.clients.agencyId, agency.id)));
  if (!client) return { error: 'That client no longer exists.' };
  const facts = await buildFacts(client.id, p.data.days);
  if (!facts) return { error: client.name + ' has no Google Analytics numbers yet. Link their property in Integrations first.' };
  // The agency's name for the report, or one from the period.
  const title = p.data.title || (p.data.days === 30 ? 'Monthly' : p.data.days === 14 ? 'Two-week' : 'Weekly') + ' report · ' + label(facts.start) + ' – ' + label(facts.end);
  const save = async (content: Content, model: string | null) => {
    const [r] = await db.insert(schema.reports).values({ agencyId: agency.id, clientId: client.id, title, periodStart: facts.start, periodEnd: facts.end, facts, content, model, createdBy: user.id }).returning({ id: schema.reports.id });
    revalidatePath('/app');
    return { ok: true, id: r.id };
  };
  if (p.data.template === 'blank') return save(blankContent(client.name + ' report'), null);
  if (!(await takeAiQuota(agency.id, 'report'))) return { error: 'You’ve reached today’s limit for AI-written reports. It resets within 24 hours.' };
  try {
    const tpl = TEMPLATES.find(t => t.id === p.data.template)!;
    const { content: written, usage } = await writeReport(facts, { client: client.name, agency: agency.name, tone: client.tone }, tpl.focus);
    await recordAiUsage(agency.id, 'report', usage);
    return await save(layoutTemplate(tpl.id, written, facts), aiModel());
  } catch (e) {
    console.error('[report]', e);
    return { error: e instanceof Error && !('status' in e) ? e.message : aiErrorMessage(e) };
  }
}

// Saves edits the agency made to the written report.
export async function saveReportAction(input: { id: string; title: string; content: unknown }) {
  const { agency } = await requireAgency();
  const p = z.object({ id: Id, title: z.string().trim().min(1).max(160), content: Content }).safeParse(input);
  if (!p.success) return { error: 'The report couldn’t be saved. Try again.' };
  await db.update(schema.reports).set({ title: p.data.title, content: p.data.content, updatedAt: new Date() })
    .where(and(eq(schema.reports.id, p.data.id), eq(schema.reports.agencyId, agency.id)));
  revalidatePath('/app');
  return { ok: true };
}

// Ask Analyst on one piece of text. Works on the agency's current (possibly unsaved) document and returns the new text;
// the editor puts it in place as an edit the agency can save or undo. Numbers stay the saved snapshot.
export async function rewritePartAction(input: { id: string; kind: string; text: string; content: unknown; instruction: string }) {
  const { agency } = await requireAgency();
  const p = z.object({ id: Id, kind: z.enum(['headline', 'heading', 'paragraph', 'list item']), text: z.string().max(8000), instruction: z.string().trim().min(2).max(1000), content: Content }).safeParse(input);
  if (!p.success) return { error: 'Tell Analyst what to change.' };
  const [r] = await db.select({ report: schema.reports, client: schema.clients }).from(schema.reports)
    .innerJoin(schema.clients, eq(schema.clients.id, schema.reports.clientId))
    .where(and(eq(schema.reports.id, p.data.id), eq(schema.reports.agencyId, agency.id)));
  if (!r) return { error: 'That report was deleted.' };
  if (!(await takeAiQuota(agency.id, 'revise'))) return { error: 'You\u2019ve reached today\u2019s limit for AI edits. It resets within 24 hours.' };
  try {
    const { text, usage } = await rewritePart(r.report.facts as never, { client: r.client.name, agency: agency.name, tone: r.client.tone }, docText(p.data.content.doc as Doc), p.data.kind, p.data.text, p.data.instruction);
    await recordAiUsage(agency.id, 'revise', usage);
    return { ok: true, text };
  } catch (e) {
    console.error('[rewrite part]', e);
    return { error: e instanceof Error && !('status' in e) ? e.message : aiErrorMessage(e) };
  }
}

export async function deleteReportAction(id: string) {
  const { agency } = await requireAgency();
  if (!Id.safeParse(id).success) return { error: 'Unknown report.' };
  await db.delete(schema.reports).where(and(eq(schema.reports.id, id), eq(schema.reports.agencyId, agency.id)));
  revalidatePath('/app');
  return { ok: true };
}

// The report and client for sending, and the email built from them. Shared by the preview and the send.
async function emailFor(agencyId: string, id: string) {
  const [r] = await db.select({ report: schema.reports, client: schema.clients }).from(schema.reports)
    .innerJoin(schema.clients, eq(schema.clients.id, schema.reports.clientId))
    .where(and(eq(schema.reports.id, id), eq(schema.reports.agencyId, agencyId)));
  return r || null;
}
function buildEmail(agency: { id: string; name: string; brandColor: string; brandLogo: string | null }, r: NonNullable<Awaited<ReturnType<typeof emailFor>>>, message: string, token: string) {
  const base = (process.env.APP_URL || '').replace(/\/$/, '');
  const content = normalizeContent(r.report.content, r.report.facts as never);
  return reportEmail({
    agency: agency.name, color: agency.brandColor, logoUrl: agency.brandLogo && base.startsWith('https://') ? base + '/api/brand/' + agency.id : null,
    client: r.client.name, title: r.report.title, period: label(r.report.periodStart) + ' – ' + label(r.report.periodEnd),
    message, doc: content.doc as Doc, facts: r.report.facts, link: base + '/r/' + token,
  });
}

// What the client will receive, for the send dialog's preview. Nothing is sent.
export async function previewReportEmailAction(input: { id: string; message: string }) {
  const { agency } = await requireAgency();
  const p = z.object({ id: Id, message: z.string().max(3000) }).safeParse(input);
  if (!p.success) return { error: 'The preview couldn’t be built.' };
  const r = await emailFor(agency.id, p.data.id);
  if (!r) return { error: 'That report was deleted.' };
  return { ok: true, html: buildEmail(agency, r, p.data.message.trim(), r.report.shareToken || 'your-private-link').html, configured: emailConfigured() };
}

// Sends the saved report to the client: an email with the headline, key numbers and a private link to the full report.
export async function sendReportAction(input: { id: string; to: string[]; subject: string; message: string; attachPdf?: boolean }) {
  const { user, agency } = await requireAgency();
  const p = z.object({ id: Id, to: z.array(z.string().trim().email()).min(1).max(5), subject: z.string().trim().min(1).max(200), message: z.string().trim().max(3000), attachPdf: z.boolean().optional() }).safeParse(input);
  if (!p.success) return { error: 'Check the email addresses (up to 5) and the subject.' };
  if (!emailConfigured()) return { error: 'Email isn’t set up on this server yet. Add RESEND_API_KEY and EMAIL_FROM.' };
  const r = await emailFor(agency.id, p.data.id);
  if (!r) return { error: 'That report was deleted.' };
  if (!(await takeAiQuota(agency.id, 'email'))) return { error: 'You’ve reached today’s limit for sending reports. It resets within 24 hours.' };
  const token = r.report.shareToken || randomBytes(18).toString('base64url');
  const { html, text } = buildEmail(agency, r, p.data.message, token);
  // The PDF is printed from the report's private page, so the link has to exist before it's made.
  let attachments: { filename: string; content: Buffer }[] | undefined;
  if (p.data.attachPdf) {
    if (!r.report.shareToken) await db.update(schema.reports).set({ shareToken: token }).where(eq(schema.reports.id, r.report.id));
    try { attachments = [{ filename: pdfName(r.client.name, r.report.title), content: await reportPdf(token) }]; }
    catch (e) { console.error('[pdf]', e); return { error: 'The PDF couldn’t be made, so nothing was sent. Try again, or send without the PDF.' }; }
  }
  try {
    await sendEmail({ fromName: agency.name, replyTo: user.email, to: p.data.to, subject: p.data.subject, html, text, tag: 'report', attachments });
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Sending failed. Try again.' };
  }
  await recordAiUsage(agency.id, 'email');
  await db.update(schema.reports).set({ status: 'sent', sentAt: new Date(), sentTo: p.data.to.join(', '), shareToken: token, updatedAt: new Date() }).where(eq(schema.reports.id, r.report.id));
  revalidatePath('/app');
  return { ok: true };
}
