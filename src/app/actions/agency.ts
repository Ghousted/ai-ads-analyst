'use server';
import { revalidatePath } from 'next/cache';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/db';
import { requireAgency, requireUser, getMembership, canManage } from '@/lib/auth';

const Opt = z.string().trim().max(80).nullish();

// Finishing setup creates the agency with the signed-in person as owner. Running it twice does nothing.
export async function createAgencyAction(input: { workspace: string; team?: string | null; freq?: string | null; tone?: string | null; client?: string | null }) {
  const user = await requireUser();
  const p = z.object({ workspace: z.string().trim().min(1).max(80), team: Opt, freq: Opt, tone: Opt, client: Opt }).safeParse(input);
  if (!p.success) return { error: 'Enter your business name.' };
  if (await getMembership(user.id)) return { ok: true };
  const d = p.data;
  await db.transaction(async tx => {
    const [agency] = await tx.insert(schema.agencies).values({ name: d.workspace, teamSize: d.team || null, ...(d.freq ? { reportFreq: d.freq } : {}), ...(d.tone ? { reportTone: d.tone } : {}) }).returning();
    await tx.insert(schema.agencyMembers).values({ agencyId: agency.id, userId: user.id, role: 'owner' });
    if (d.client) await tx.insert(schema.clients).values({ agencyId: agency.id, name: d.client, tone: d.tone || 'Friendly' });
  });
  return { ok: true };
}

export async function renameMeAction(name: string) {
  const { user } = await requireAgency();
  const n = z.string().trim().min(1).max(80).safeParse(name);
  if (!n.success) return { error: 'Enter your name.' };
  await db.update(schema.users).set({ name: n.data }).where(eq(schema.users.id, user.id));
  revalidatePath('/app');
  return { ok: true };
}

export async function renameAgencyAction(name: string) {
  const { agency, role } = await requireAgency();
  if (!canManage(role)) return { error: 'Only the owner and admins can rename the agency.' };
  const n = z.string().trim().min(1).max(80).safeParse(name);
  if (!n.success) return { error: 'Enter your agency name.' };
  await db.update(schema.agencies).set({ name: n.data }).where(eq(schema.agencies.id, agency.id));
  revalidatePath('/app');
  return { ok: true };
}

// Leaves sample mode for good: the app shows the agency's own clients from here on.
export async function useRealDataAction() {
  const { agency } = await requireAgency();
  await db.update(schema.agencies).set({ sampleMode: false }).where(eq(schema.agencies.id, agency.id));
  revalidatePath('/app');
  return { ok: true };
}

export async function inviteAction(input: { email: string; role: string }) {
  const { user, agency, role } = await requireAgency();
  if (!canManage(role)) return { error: 'Only the owner and admins can invite teammates.' };
  const p = z.object({ email: z.string().trim().toLowerCase().email(), role: z.enum(['admin', 'member']) }).safeParse({ email: input.email, role: input.role.toLowerCase() });
  if (!p.success) return { error: 'Enter a valid email, like name@agency.com.' };
  const [already] = await db.select({ id: schema.users.id }).from(schema.users)
    .innerJoin(schema.agencyMembers, eq(schema.agencyMembers.userId, schema.users.id))
    .where(and(eq(schema.users.email, p.data.email), eq(schema.agencyMembers.agencyId, agency.id)));
  if (already) return { error: 'That person is already on your team.' };
  await db.insert(schema.invitations).values({ agencyId: agency.id, email: p.data.email, role: p.data.role, invitedBy: user.id })
    .onConflictDoUpdate({ target: [schema.invitations.agencyId, schema.invitations.email], set: { role: p.data.role } });
  revalidatePath('/app');
  return { ok: true };
}

export async function setRoleAction(input: { userId?: string; email?: string; role: string }) {
  const { user, agency, role } = await requireAgency();
  if (!canManage(role)) return { error: 'Only the owner and admins can change roles.' };
  const next = input.role === 'Remove from team' ? null : input.role.toLowerCase();
  if (input.userId) {
    if (input.userId === user.id) return { error: 'You can’t change your own role.' };
    const where = and(eq(schema.agencyMembers.agencyId, agency.id), eq(schema.agencyMembers.userId, input.userId));
    const [m] = await db.select().from(schema.agencyMembers).where(where);
    if (!m || m.role === 'owner') return { error: 'The owner’s role can’t be changed here.' };
    if (next === null) await db.delete(schema.agencyMembers).where(where);
    else await db.update(schema.agencyMembers).set({ role: next === 'admin' ? 'admin' : 'member' }).where(where);
  } else if (input.email) {
    const where = and(eq(schema.invitations.agencyId, agency.id), eq(schema.invitations.email, input.email));
    if (next === null) await db.delete(schema.invitations).where(where);
    else await db.update(schema.invitations).set({ role: next === 'admin' ? 'admin' : 'member' }).where(where);
  }
  revalidatePath('/app');
  return { ok: true };
}
