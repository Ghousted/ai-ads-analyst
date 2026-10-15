'use server';
import { revalidatePath } from 'next/cache';
import { after } from 'next/server';
import { and, eq, inArray, isNull } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/db';
import { requireAgency } from '@/lib/auth';
import { syncGa4Account } from '@/lib/ga4';

// Adds a client and links the chosen unassigned accounts to it.
export async function createClientAction(input: { name: string; email: string; accountIds: string[] }) {
  const { agency } = await requireAgency();
  const p = z.object({ name: z.string().trim().min(1).max(120), email: z.string().trim().toLowerCase().email(), accountIds: z.array(z.string().uuid()).max(50) }).safeParse(input);
  if (!p.success) return { error: 'Enter a name and a valid email.' };
  const id = await db.transaction(async tx => {
    const [c] = await tx.insert(schema.clients).values({ agencyId: agency.id, name: p.data.name, email: p.data.email, tone: agency.reportTone }).returning({ id: schema.clients.id });
    if (p.data.accountIds.length) await tx.update(schema.accounts).set({ clientId: c.id })
      .where(and(eq(schema.accounts.agencyId, agency.id), inArray(schema.accounts.id, p.data.accountIds), isNull(schema.accounts.clientId)));
    return c.id;
  });
  const linked = p.data.accountIds;
  after(async () => { for (const a of linked) await syncGa4Account(a); });
  revalidatePath('/app');
  return { ok: true, id };
}

export async function updateClientAction(input: { id: string; contactName: string; email: string; schedule: string }) {
  const { agency } = await requireAgency();
  const p = z.object({ id: z.string().uuid(), contactName: z.string().trim().max(120), email: z.string().trim().toLowerCase().email(), schedule: z.string().trim().min(1).max(80) }).safeParse(input);
  if (!p.success) return { error: 'Check the contact email and report schedule.' };
  await db.update(schema.clients).set({ contactName: p.data.contactName, email: p.data.email, schedule: p.data.schedule })
    .where(and(eq(schema.clients.id, p.data.id), eq(schema.clients.agencyId, agency.id)));
  revalidatePath('/app');
  return { ok: true };
}
