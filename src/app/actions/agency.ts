'use server';
import { revalidatePath } from 'next/cache';
import { and, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/db';
import { requireAgency, requireUser, getMembership, canManage } from '@/lib/auth';
import { TIME_ZONES } from '@/lib/schedule';
import { emailConfigured, sendEmail } from '@/lib/email';
import { noticeEmail } from '@/lib/notice-email';

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
  // The invite email. They join when they sign up (or sign in) with this address, so the invite stands even if it fails.
  let emailed = false;
  if (emailConfigured()) {
    const from = user.name || user.email, url = (process.env.APP_URL || '').replace(/\/$/, '') + '/login?mode=signup&email=' + encodeURIComponent(p.data.email);
    const { html, text } = noticeEmail({ agency: agency.name, heading: from + ' invited you to ' + agency.name,
      intro: 'Join ' + agency.name + ' on AI Ads Analyst as ' + (p.data.role === 'admin' ? 'an admin. You can manage clients, integrations and the team, and edit and send reports.' : 'a member. You can see every client, and edit and send their reports.') + ' Sign up with ' + p.data.email + ' and you’re in.',
      button: { label: 'Join ' + agency.name, url }, footer: 'Sent by AI Ads Analyst for ' + agency.name + '. Not expecting this? You can ignore it.' });
    try { await sendEmail({ fromName: agency.name, replyTo: user.email, to: [p.data.email], subject: from + ' invited you to ' + agency.name + ' on AI Ads Analyst', html, text, tag: 'invite' }); emailed = true; }
    catch (e) { console.error('[invite email]', e); }
  }
  revalidatePath('/app');
  return { ok: true, emailed };
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

// The time zone report schedules and alerts follow.
export async function setTimeZoneAction(tz: string) {
  const { agency, role } = await requireAgency();
  if (!canManage(role)) return { error: 'Only the owner and admins can change the time zone.' };
  if (!TIME_ZONES.some(([id]) => id === tz)) return { error: 'Pick a time zone from the list.' };
  await db.update(schema.agencies).set({ timeZone: tz }).where(eq(schema.agencies.id, agency.id));
  revalidatePath('/app');
  return { ok: true };
}

// Report branding: the agency's logo (a small image as a data URL) and brand colour, used on every report.
const LOGO = /^data:image\/(png|jpeg|webp|svg\+xml);base64,[A-Za-z0-9+/=]+$/;
export async function updateBrandAction(input: { logo?: string | null; color?: string }) {
  const { agency, role } = await requireAgency();
  if (!canManage(role)) return { error: 'Only the owner and admins can change report branding.' };
  const p = z.object({ logo: z.string().max(1_500_000).regex(LOGO).nullable().optional(), color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional() }).safeParse(input);
  if (!p.success) return { error: 'Use a PNG, JPG, WebP or SVG logo under 1 MB.' };
  await db.update(schema.agencies).set({ ...(p.data.logo !== undefined ? { brandLogo: p.data.logo } : {}), ...(p.data.color ? { brandColor: p.data.color } : {}) }).where(eq(schema.agencies.id, agency.id));
  revalidatePath('/app');
  return { ok: true };
}

// The signed-in person's notification choices (Settings › Notifications).
const PREF_KEYS = ['a0', 'a1', 'a2', 'a3', 'a4', 'n0', 'n1', 'n2', 'n4'] as const;
export async function savePrefsAction(prefs: Record<string, boolean>) {
  const { user, agency } = await requireAgency();
  const p = z.object(Object.fromEntries(PREF_KEYS.map(k => [k, z.boolean().optional()]))).strict().safeParse(prefs);
  if (!p.success) return { error: 'Those settings couldn’t be saved. Try again.' };
  const clean = Object.fromEntries(Object.entries(p.data).filter(([, v]) => v !== undefined)) as Record<string, boolean>;
  await db.insert(schema.notificationPrefs).values({ userId: user.id, agencyId: agency.id, prefs: clean })
    .onConflictDoUpdate({ target: [schema.notificationPrefs.userId, schema.notificationPrefs.agencyId], set: { prefs: sql`${schema.notificationPrefs.prefs} || ${JSON.stringify(clean)}::jsonb`, updatedAt: new Date() } });
  revalidatePath('/app');
  return { ok: true };
}
