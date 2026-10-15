'use server';
import { revalidatePath } from 'next/cache';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/db';
import { requireAgency } from '@/lib/auth';

const Type = z.enum(schema.GOAL_TYPES);

// Sets one of a client's goals, or removes it when target is null. `replaces` is the goal's old type when an edit
// changed it, so the old one goes in the same step.
export async function saveGoalAction(input: { clientId: string; type: string; target: number | null; replaces?: string | null }) {
  const { agency } = await requireAgency();
  const p = z.object({ clientId: z.string().uuid(), type: Type, target: z.number().positive().max(1e9).nullable(), replaces: Type.nullish() }).safeParse(input);
  if (!p.success) return { error: 'Enter a number above 0.' };
  const { clientId, type, target, replaces } = p.data;
  const [client] = await db.select({ id: schema.clients.id }).from(schema.clients).where(and(eq(schema.clients.id, clientId), eq(schema.clients.agencyId, agency.id)));
  if (!client) return { error: 'That client no longer exists.' };
  const G = schema.clientGoals;
  await db.transaction(async tx => {
    if (replaces && replaces !== type) await tx.delete(G).where(and(eq(G.clientId, clientId), eq(G.type, replaces)));
    if (target == null) await tx.delete(G).where(and(eq(G.clientId, clientId), eq(G.type, type)));
    else await tx.insert(G).values({ clientId, agencyId: agency.id, type, target })
      .onConflictDoUpdate({ target: [G.clientId, G.type], set: { target, updatedAt: new Date() } });
  });
  revalidatePath('/app');
  return { ok: true };
}
