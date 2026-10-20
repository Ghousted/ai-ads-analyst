'use server';
import { revalidatePath } from 'next/cache';
import { after } from 'next/server';
import { randomBytes } from 'node:crypto';
import { and, eq, inArray, isNull } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/db';
import { canManage, requireAgency } from '@/lib/auth';
import { connectEmail } from '@/lib/connect-email';
import { emailConfigured, sendEmail } from '@/lib/email';
import { joinSchedule, scheduleParts } from '@/lib/schedule';
import { syncAccount } from '@/lib/sync';

// Adds a client and links the chosen unassigned accounts to it.
export async function createClientAction(input: { name: string; email: string; accountIds: string[] }) {
  const { agency } = await requireAgency();
  const p = z.object({ name: z.string().trim().min(1).max(120), email: z.string().trim().toLowerCase().email(), accountIds: z.array(z.string().uuid()).max(50) }).safeParse(input);
  if (!p.success) return { error: 'Enter a name and a valid email.' };
  const res = await db.transaction(async tx => {
    const [c] = await tx.insert(schema.clients).values({ agencyId: agency.id, name: p.data.name, email: p.data.email, tone: agency.reportTone, schedule: joinSchedule(...Object.values(scheduleParts(agency.reportFreq)) as [string, string]) }).returning({ id: schema.clients.id });
    const linked = p.data.accountIds.length ? await tx.update(schema.accounts).set({ clientId: c.id })
      .where(and(eq(schema.accounts.agencyId, agency.id), inArray(schema.accounts.id, p.data.accountIds), isNull(schema.accounts.clientId))).returning({ id: schema.accounts.id }) : [];
    return { id: c.id, linked: linked.map(x => x.id) };
  });
  // Pull numbers only for the accounts this agency actually linked.
  const ag = agency.id;
  after(async () => { for (const a of res.linked) await syncAccount(a, ag); });
  revalidatePath('/app');
  return { ok: true, id: res.id };
}

export async function updateClientAction(input: { id: string; name: string; industry: string; tone: string; contactName: string; email: string; schedule: string }) {
  const { agency } = await requireAgency();
  const p = z.object({ id: z.string().uuid(), name: z.string().trim().min(1).max(120), industry: z.string().trim().max(80), tone: z.string().trim().min(1).max(40),
    contactName: z.string().trim().max(120), email: z.string().trim().toLowerCase().email(), schedule: z.string().trim().min(1).max(80) }).safeParse(input);
  if (!p.success) return { error: 'Check the client name, contact email and report schedule.' };
  const { id, ...set } = p.data;
  await db.update(schema.clients).set(set).where(and(eq(schema.clients.id, id), eq(schema.clients.agencyId, agency.id)));
  revalidatePath('/app');
  return { ok: true };
}

// Removes a client with their reports, goals and flags. Their accounts stay connected and become free to link again;
// their tasks stay on the board with no client.
export async function deleteClientAction(id: string) {
  const { agency, role } = await requireAgency();
  if (!canManage(role)) return { error: 'Only the owner and admins can remove clients.' };
  if (!z.string().uuid().safeParse(id).success) return { error: 'Unknown client.' };
  const gone = await db.delete(schema.clients).where(and(eq(schema.clients.id, id), eq(schema.clients.agencyId, agency.id))).returning({ id: schema.clients.id });
  if (!gone.length) return { error: 'That client was already removed.' };
  revalidatePath('/app');
  return { ok: true };
}

// Ask a client to connect: emails their contact a private link where they sign in to Google with their own login.
// Sending again keeps the same link and restarts its 14 days.
export async function sendConnectLinkAction(input: { id: string; to: string }) {
  const { user, agency } = await requireAgency();
  const p = z.object({ id: z.string().uuid(), to: z.string().trim().toLowerCase().email() }).safeParse(input);
  if (!p.success) return { error: 'Add a contact email to this client first.' };
  if (!emailConfigured()) return { error: 'Email isn’t set up on this server yet. Add RESEND_API_KEY and EMAIL_FROM.' };
  const [c] = await db.select().from(schema.clients).where(and(eq(schema.clients.id, p.data.id), eq(schema.clients.agencyId, agency.id)));
  if (!c) return { error: 'That client was removed.' };
  const token = c.connectToken || randomBytes(18).toString('base64url');
  const url = (process.env.APP_URL || '').replace(/\/$/, '') + '/connect/' + token;
  const { html, text } = connectEmail({ agency: agency.name, client: c.name, from: user.name || user.email, url });
  try {
    await sendEmail({ fromName: agency.name, replyTo: user.email, to: [p.data.to], subject: 'Connect your Google Analytics to ' + agency.name, html, text, tag: 'connect' });
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Sending failed. Try again.' };
  }
  await db.update(schema.clients).set({ connectToken: token, connectSentTo: p.data.to, connectSentAt: new Date() }).where(eq(schema.clients.id, c.id));
  revalidatePath('/app');
  return { ok: true, url };
}
