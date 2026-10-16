'use server';
import { revalidatePath } from 'next/cache';
import { and, eq, isNotNull } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/db';
import { requireAgency } from '@/lib/auth';
import { emailConfigured } from '@/lib/email';
import { aiErrorMessage, recordAiUsage, takeAiQuota } from '@/lib/ai';
import { rewritePart } from '@/lib/report-writer';
import { createReport } from '@/lib/report-create';
import { buildReportEmail, deliverReport, reportFor } from '@/lib/report-send';
import { Content, docText, TEMPLATES, type Doc } from '@/lib/report-blocks';

const Id = z.string().uuid();

// Claude writes a report for one client from their latest numbers. Saved as a draft for the agency to review.
export async function generateReportAction(input: { clientId: string; days: number; template: string; title?: string }) {
  const { user, agency } = await requireAgency();
  const p = z.object({ clientId: Id, days: z.union([z.literal(7), z.literal(14), z.literal(30)]), template: z.enum(['blank', ...TEMPLATES.map(t => t.id)] as [string, ...string[]]), title: z.string().trim().max(160).optional() }).safeParse(input);
  if (!p.success) return { error: 'Pick a client, a period and a template.' };
  const [client] = await db.select().from(schema.clients).where(and(eq(schema.clients.id, p.data.clientId), eq(schema.clients.agencyId, agency.id)));
  if (!client) return { error: 'That client no longer exists.' };
  const r = await createReport({ agency, client, days: p.data.days, template: p.data.template, title: p.data.title, createdBy: user.id });
  if ('error' in r) return { error: r.error };
  revalidatePath('/app');
  return { ok: true, id: r.id };
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

// What the client will receive, for the send dialog's preview. Nothing is sent.
export async function previewReportEmailAction(input: { id: string; message: string }) {
  const { agency } = await requireAgency();
  const p = z.object({ id: Id, message: z.string().max(3000) }).safeParse(input);
  if (!p.success) return { error: 'The preview couldn’t be built.' };
  const r = await reportFor(agency.id, p.data.id);
  if (!r) return { error: 'That report was deleted.' };
  return { ok: true, html: buildReportEmail(agency, r, p.data.message.trim(), r.report.shareToken || 'your-private-link').html, configured: emailConfigured() };
}

// Sends the saved report to the client: an email with the headline, key numbers and a private link to the full report.
export async function sendReportAction(input: { id: string; to: string[]; subject: string; message: string; attachPdf?: boolean }) {
  const { user, agency } = await requireAgency();
  const p = z.object({ id: Id, to: z.array(z.string().trim().email()).min(1).max(5), subject: z.string().trim().min(1).max(200), message: z.string().trim().max(3000), attachPdf: z.boolean().optional() }).safeParse(input);
  if (!p.success) return { error: 'Check the email addresses (up to 5) and the subject.' };
  const r = await reportFor(agency.id, p.data.id);
  if (!r) return { error: 'That report was deleted.' };
  const res = await deliverReport(agency, r, { to: p.data.to, subject: p.data.subject, message: p.data.message, attachPdf: p.data.attachPdf, replyTo: user.email });
  if ('error' in res) return { error: res.error };
  revalidatePath('/app');
  return { ok: true };
}

// Approving a scheduled draft lets it send itself at its scheduled time. Unapproving stops that.
export async function approveReportAction(input: { id: string; approve: boolean }) {
  const { user, agency } = await requireAgency();
  const p = z.object({ id: Id, approve: z.boolean() }).safeParse(input);
  if (!p.success) return { error: 'Unknown report.' };
  const [r] = await db.update(schema.reports).set(p.data.approve ? { approvedAt: new Date(), approvedBy: user.id } : { approvedAt: null, approvedBy: null })
    .where(and(eq(schema.reports.id, p.data.id), eq(schema.reports.agencyId, agency.id), eq(schema.reports.status, 'draft'), isNotNull(schema.reports.scheduledFor)))
    .returning({ id: schema.reports.id });
  if (!r) return { error: 'This report was already sent or deleted.' };
  revalidatePath('/app');
  return { ok: true };
}
