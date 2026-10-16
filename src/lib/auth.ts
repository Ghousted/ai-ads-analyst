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

// The signed-in person, or null. Creates their profile row on first visit and accepts any pending invite.
export const getUser = cache(async (): Promise<User | null> => {
  await connection();
  // When the session needs refreshing, Neon Auth writes new cookies, which a page render isn't allowed to do. Pages
  // behind the proxy (/app, /setup) are refreshed there first; elsewhere (/login) treat it as signed out for now.
  let data;
  try { ({ data } = await neonAuth().getSession()); }
  catch (e) { if (e instanceof Error && /Cookies can only be modified/.test(e.message)) return null; throw e; }
  const au = data?.user;
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

async function acceptInvites(user: User) {
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
  const [row] = await db
    .select({ agency: schema.agencies, role: schema.agencyMembers.role })
    .from(schema.agencyMembers)
    .innerJoin(schema.agencies, eq(schema.agencies.id, schema.agencyMembers.agencyId))
    .where(eq(schema.agencyMembers.userId, userId))
    .limit(1);
  return row ?? null;
});

// For pages inside the app: signed in and set up, otherwise sent to log in or setup.
export async function requireAgency() {
  const user = await requireUser();
  const m = await getMembership(user.id);
  if (!m) redirect('/setup');
  return { user, ...m };
}

export const canManage = (role: Role) => role === 'owner' || role === 'admin';
