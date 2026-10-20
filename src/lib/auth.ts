import 'server-only';
import { cache } from 'react';
import { connection } from 'next/server';
import { redirect } from 'next/navigation';
import { and, eq, isNull } from 'drizzle-orm';
import { db, schema } from '@/db';
import { neonAuth } from './neon-auth';

export type User = typeof schema.users.$inferSelect;
export type Agency = typeof schema.agencies.$inferSelect;
export type Role = (typeof schema.ROLES)[number];

const session = cache(async () => {
  await connection();
  const { data } = await neonAuth().getSession();
  return data?.user ?? null;
});

// The signed-in person, or null. Creates their profile row on first visit and accepts any pending invite.
export const getUser = cache(async (): Promise<User | null> => {
  const au = await session();
  if (!au) return null;
  const email = au.email.toLowerCase();
  const [found] = await db.select().from(schema.users).where(eq(schema.users.authUserId, au.id));
  if (found) {
    if (found.email !== email) await db.update(schema.users).set({ email }).where(eq(schema.users.id, found.id));
    return { ...found, email };
  }
  await db.insert(schema.users).values({ authUserId: au.id, email, name: au.name || '' }).onConflictDoNothing();
  const [created] = await db.select().from(schema.users).where(eq(schema.users.authUserId, au.id));
  await acceptInvites(created);
  return created;
});

// An invite is accepted only once the person has proved they own its email (Google sign-in always has), so nobody can
// join an agency by signing up with an address someone else was invited at. Until then it stays open, and setup tells
// them how to join.
async function acceptInvites(user: User) {
  const au = await session();
  if (!au?.emailVerified || au.id !== user.authUserId) return;
  const open = await db.select().from(schema.invitations).where(and(eq(schema.invitations.email, user.email), isNull(schema.invitations.acceptedAt)));
  for (const inv of open) {
    await db.insert(schema.agencyMembers).values({ agencyId: inv.agencyId, userId: user.id, role: inv.role }).onConflictDoNothing();
    await db.update(schema.invitations).set({ acceptedAt: new Date() }).where(eq(schema.invitations.id, inv.id));
  }
}

export async function requireUser(): Promise<User> {
  const user = await getUser();
  if (!user) redirect('/login');
  return user;
}

// The agency the person belongs to, with their role. A person belongs to one agency for now.
export const getMembership = cache(async (userId: string): Promise<{ agency: Agency; role: Role } | null> => {
  return (await membership(userId)) ?? (await joinInvited(userId));
});

// Someone without an agency who verified their email since signing up joins any agency that invited them.
async function joinInvited(userId: string) {
  const [user] = await db.select().from(schema.users).where(eq(schema.users.id, userId));
  if (!user) return null;
  await acceptInvites(user);
  return membership(userId);
}

// The agency that invited this person while their email isn't verified yet, so setup can say how to join it.
export async function waitingInvite(user: User) {
  const [row] = await db.select({ agency: schema.agencies.name }).from(schema.invitations).innerJoin(schema.agencies, eq(schema.agencies.id, schema.invitations.agencyId))
    .where(and(eq(schema.invitations.email, user.email), isNull(schema.invitations.acceptedAt))).limit(1);
  return row?.agency ?? null;
}

async function membership(userId: string): Promise<{ agency: Agency; role: Role } | null> {
  const [row] = await db
    .select({ agency: schema.agencies, role: schema.agencyMembers.role })
    .from(schema.agencyMembers)
    .innerJoin(schema.agencies, eq(schema.agencies.id, schema.agencyMembers.agencyId))
    .where(eq(schema.agencyMembers.userId, userId))
    .limit(1);
  return row ?? null;
}

// For pages inside the app: signed in and set up, otherwise sent to log in or setup.
export async function requireAgency() {
  const user = await requireUser();
  const m = await getMembership(user.id);
  if (!m) redirect('/setup');
  return { user, ...m };
}

export const canManage = (role: Role) => role === 'owner' || role === 'admin';
