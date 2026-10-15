'use server';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/db';
import { requireAgency } from '@/lib/auth';
import { aiErrorMessage, aiModel, recordAiUsage, takeAiQuota } from '@/lib/ai';
import { analyzeFlag, flagFacts } from '@/lib/flag-writer';
import { loadMetrics } from '@/lib/metrics';
import { scoreClients } from '@/lib/risk';

const Id = z.string().uuid();

// The client's current risk, worked out the same way as on page load.
async function riskFor(agencyId: string, clientId: string) {
  const [client] = await db.select().from(schema.clients).where(and(eq(schema.clients.id, clientId), eq(schema.clients.agencyId, agencyId)));
  if (!client) return null;
  const [metrics, reports, goals] = await Promise.all([
    loadMetrics(agencyId),
    db.select({ clientId: schema.reports.clientId, createdAt: schema.reports.createdAt, status: schema.reports.status, sentAt: schema.reports.sentAt }).from(schema.reports).where(eq(schema.reports.clientId, client.id)),
    db.select().from(schema.clientGoals).where(eq(schema.clientGoals.clientId, client.id)),
  ]);
  return { client, metrics, risk: scoreClients(metrics, [client], reports, goals)[client.id] };
}

// Claude's read of a flagged client and what to do. Reuses the saved analysis while the numbers and signals are the
// same; `fresh` asks for a new one.
export async function analyzeFlagAction(input: { clientId: string; fresh?: boolean }) {
  const { agency } = await requireAgency();
  if (!Id.safeParse(input.clientId).success) return { error: 'Unknown client.' };
  const r = await riskFor(agency.id, input.clientId);
  if (!r) return { error: 'That client no longer exists.' };
  const { client, metrics, risk } = r;
  if (risk.level === 'h') return { error: client.name + ' is no longer flagged. Their latest numbers look fine.' };
  const [saved] = await db.select().from(schema.clientFlags).where(eq(schema.clientFlags.clientId, client.id));
  if (saved?.analysis && saved.signature === risk.signature && !input.fresh) return { ok: true, analysis: saved.analysis, signature: saved.signature };
  if (!(await takeAiQuota(agency.id, 'flag'))) return { error: 'You’ve reached today’s limit for AI analyses. It resets within 24 hours.' };
  try {
    const { analysis, usage } = await analyzeFlag(flagFacts(metrics, client.id, risk), { client: client.name, contact: client.contactName, agency: agency.name, tone: client.tone, level: risk.level });
    await recordAiUsage(agency.id, 'flag', usage);
    const row = { signature: risk.signature, analysis, model: aiModel(), analyzedAt: new Date() };
    await db.insert(schema.clientFlags).values({ clientId: client.id, agencyId: agency.id, ...row })
      .onConflictDoUpdate({ target: schema.clientFlags.clientId, set: row });
    return { ok: true, analysis, signature: risk.signature };
  } catch (e) {
    console.error('[flag]', e);
    return { error: e instanceof Error && !('status' in e) ? e.message : aiErrorMessage(e, 'The analysis failed. Try again.') };
  }
}

// Hides a client's flag until its signals change.
export async function dismissFlagAction(input: { clientId: string; keys: string }) {
  const { agency } = await requireAgency();
  const p = z.object({ clientId: Id, keys: z.string().max(500) }).safeParse(input);
  if (!p.success) return { error: 'Unknown client.' };
  const [client] = await db.select({ id: schema.clients.id }).from(schema.clients).where(and(eq(schema.clients.id, p.data.clientId), eq(schema.clients.agencyId, agency.id)));
  if (!client) return { error: 'That client no longer exists.' };
  await db.insert(schema.clientFlags).values({ clientId: client.id, agencyId: agency.id, dismissedKeys: p.data.keys })
    .onConflictDoUpdate({ target: schema.clientFlags.clientId, set: { dismissedKeys: p.data.keys } });
  return { ok: true };
}
