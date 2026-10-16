'use server';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/db';
import { requireAgency } from '@/lib/auth';
import { aiErrorMessage, recordAiUsage, takeAiQuota } from '@/lib/ai';
import { agencyContext, askAnalyst } from '@/lib/analyst';
import { loadMetrics } from '@/lib/metrics';
import { scoreClients } from '@/lib/risk';

const Input = z.object({
  messages: z.array(z.object({ me: z.boolean(), text: z.string().max(4000) })).min(1).max(40),
  clientId: z.string().uuid().nullable(),
  // Goals and tasks still live in the browser, so the app sends them along.
  goals: z.array(z.object({ client: z.string().max(200), goal: z.string().max(60), target: z.number() })).max(100),
  tasks: z.array(z.object({ client: z.string().max(200), title: z.string().max(300), status: z.string().max(20) })).max(200),
});

// Ask Analyst: one answer from the agency's own data, with suggested actions the agency can take.
export async function askAnalystAction(input: z.input<typeof Input>) {
  const { agency } = await requireAgency();
  const p = Input.safeParse(input);
  if (!p.success) return { error: 'That message couldn’t be sent. Try a shorter one.' };
  if (!(await takeAiQuota(agency.id, 'chat'))) return { error: 'You’ve reached today’s limit for Ask Analyst. It resets within 24 hours.' };
  const [clients, metrics, reports, goals] = await Promise.all([
    db.select().from(schema.clients).where(eq(schema.clients.agencyId, agency.id)),
    loadMetrics(agency.id),
    db.select({ clientId: schema.reports.clientId, title: schema.reports.title, status: schema.reports.status, createdAt: schema.reports.createdAt, sentAt: schema.reports.sentAt })
      .from(schema.reports).where(eq(schema.reports.agencyId, agency.id)).orderBy(desc(schema.reports.createdAt)).limit(100),
    db.select().from(schema.clientGoals).where(eq(schema.clientGoals.agencyId, agency.id)),
  ]);
  const focus = clients.find(c => c.id === p.data.clientId) || null;
  try {
    const context = agencyContext({ agency: agency.name, today: new Date().toISOString().slice(0, 10), clients, metrics, risk: scoreClients(metrics, clients, reports, goals), reports, focusId: focus ? focus.id : null, extra: { goals: p.data.goals, tasks: p.data.tasks } });
    const { reply, actions, usage } = await askAnalyst(context, focus ? focus.name : null, p.data.messages);
    await recordAiUsage(agency.id, 'chat', usage);
    return { ok: true, reply, actions };
  } catch (e) {
    console.error('[analyst]', e);
    return { error: e instanceof Error && !('status' in e) ? e.message : aiErrorMessage(e, 'Analyst couldn’t answer. Try again.') };
  }
}
