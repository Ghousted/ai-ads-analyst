'use server';
import { revalidatePath } from 'next/cache';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/db';
import { requireAgency } from '@/lib/auth';
import { aiErrorMessage, aiModel, recordAiUsage, takeAiQuota } from '@/lib/ai';
import { buildFacts, rewritePart, writeReport } from '@/lib/report-writer';
import { blankContent, Content, getPart, layoutTemplate, PART, TEMPLATES } from '@/lib/report-blocks';

const Id = z.string().uuid();
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const label = (d: string) => { const x = new Date(d + 'T00:00:00Z'); return MON[x.getUTCMonth()] + ' ' + x.getUTCDate(); };

// Claude writes a report for one client from their latest numbers. Saved as a draft for the agency to review.
// With a template, Claude writes the words and the template places them with charts and tables. Blank creates an empty
// report (no AI) that the agency builds from the same blocks.
export async function generateReportAction(input: { clientId: string; days: number; template: string }) {
  const { user, agency } = await requireAgency();
  const p = z.object({ clientId: Id, days: z.union([z.literal(7), z.literal(14), z.literal(30)]), template: z.enum(['blank', ...TEMPLATES.map(t => t.id)] as [string, ...string[]]) }).safeParse(input);
  if (!p.success) return { error: 'Pick a client, a period and a template.' };
  const [client] = await db.select().from(schema.clients).where(and(eq(schema.clients.id, p.data.clientId), eq(schema.clients.agencyId, agency.id)));
  if (!client) return { error: 'That client no longer exists.' };
  const facts = await buildFacts(client.id, p.data.days);
  if (!facts) return { error: client.name + ' has no Google Analytics numbers yet. Link their property in Integrations first.' };
  const title = (p.data.days === 30 ? 'Monthly' : p.data.days === 14 ? 'Two-week' : 'Weekly') + ' report · ' + label(facts.start) + ' – ' + label(facts.end);
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

// Ask Analyst on one part of the report. Works on the agency's current (possibly unsaved) text and returns the new text
// for that part; the page applies it as an edit the agency can save or discard. Numbers stay the saved snapshot.
export async function rewritePartAction(input: { id: string; path: string; instruction: string; content: unknown }) {
  const { agency } = await requireAgency();
  const p = z.object({ id: Id, path: z.string().regex(PART), instruction: z.string().trim().min(2).max(1000), content: Content }).safeParse(input);
  if (!p.success) return { error: 'Tell Analyst what to change.' };
  if (getPart(p.data.content, p.data.path) === undefined) return { error: 'That part of the report was removed.' };
  const [r] = await db.select({ report: schema.reports, client: schema.clients }).from(schema.reports)
    .innerJoin(schema.clients, eq(schema.clients.id, schema.reports.clientId))
    .where(and(eq(schema.reports.id, p.data.id), eq(schema.reports.agencyId, agency.id)));
  if (!r) return { error: 'That report was deleted.' };
  if (!(await takeAiQuota(agency.id, 'revise'))) return { error: 'You\u2019ve reached today\u2019s limit for AI edits. It resets within 24 hours.' };
  try {
    const { text, usage } = await rewritePart(r.report.facts as never, { client: r.client.name, agency: agency.name, tone: r.client.tone }, p.data.content, p.data.path, p.data.instruction);
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
