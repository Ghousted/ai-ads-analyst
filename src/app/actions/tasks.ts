'use server';
import { revalidatePath } from 'next/cache';
import { and, eq, inArray, max, min } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/db';
import { requireAgency } from '@/lib/auth';

const T = schema.tasks;
const Id = z.string().uuid();
const Items = z.array(z.object({ label: z.string().trim().min(1).max(200), done: z.boolean() })).max(50);
const Day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable();

// Only the agency's own clients and members can be put on a task.
async function check(agencyId: string, clientId: string | null | undefined, assignees: string[] | undefined) {
  if (clientId) {
    const [c] = await db.select({ id: schema.clients.id }).from(schema.clients).where(and(eq(schema.clients.id, clientId), eq(schema.clients.agencyId, agencyId)));
    if (!c) return 'That client no longer exists.';
  }
  if (assignees?.length) {
    const m = await db.select({ id: schema.agencyMembers.userId }).from(schema.agencyMembers)
      .where(and(eq(schema.agencyMembers.agencyId, agencyId), inArray(schema.agencyMembers.userId, assignees)));
    if (m.length !== new Set(assignees).size) return 'Someone on this task is no longer on your team.';
  }
  return null;
}

// Adds a task, at the top of the board or the bottom of its column.
export async function createTaskAction(input: { title: string; desc: string; clientId: string | null; status: string; due: string | null; assignees: string[]; items: { label: string; done: boolean }[]; at: 'top' | 'bottom' }) {
  const { agency, user } = await requireAgency();
  const p = z.object({ title: z.string().trim().min(1).max(200), desc: z.string().trim().max(5000), clientId: Id.nullable(), status: z.enum(schema.TASK_STATUS), due: Day,
    assignees: z.array(Id).max(20), items: Items, at: z.enum(['top', 'bottom']) }).safeParse(input);
  if (!p.success) return { error: 'Give the task a title.' };
  const d = p.data, err = await check(agency.id, d.clientId, d.assignees);
  if (err) return { error: err };
  const [edge] = await db.select({ lo: min(T.position), hi: max(T.position) }).from(T).where(eq(T.agencyId, agency.id));
  const position = d.at === 'top' ? (edge?.lo ?? 1) - 1 : (edge?.hi ?? -1) + 1;
  const [row] = await db.insert(T).values({ agencyId: agency.id, clientId: d.clientId, title: d.title, description: d.desc, status: d.status, due: d.due,
    assignees: [...new Set(d.assignees)], items: d.items, position, createdBy: user.id }).returning({ id: T.id });
  revalidatePath('/app');
  return { ok: true, id: row.id };
}

// Changes a task's status or checklist.
export async function updateTaskAction(input: { id: string; status?: string; items?: { label: string; done: boolean }[] }) {
  const { agency } = await requireAgency();
  const p = z.object({ id: Id, status: z.enum(schema.TASK_STATUS).optional(), items: Items.optional() }).safeParse(input);
  if (!p.success) return { error: 'That change couldn’t be saved.' };
  const { id, ...set } = p.data;
  const done = await db.update(T).set({ ...set, updatedAt: new Date() }).where(and(eq(T.id, id), eq(T.agencyId, agency.id))).returning({ id: T.id });
  if (!done.length) return { error: 'That task no longer exists.' };
  revalidatePath('/app');
  return { ok: true };
}

export async function deleteTaskAction(input: { id: string }) {
  const { agency } = await requireAgency();
  if (!Id.safeParse(input.id).success) return { error: 'That task no longer exists.' };
  await db.delete(T).where(and(eq(T.id, input.id), eq(T.agencyId, agency.id)));
  revalidatePath('/app');
  return { ok: true };
}

export async function addTaskCommentAction(input: { taskId: string; body: string }) {
  const { agency, user } = await requireAgency();
  const p = z.object({ taskId: Id, body: z.string().trim().min(1).max(2000) }).safeParse(input);
  if (!p.success) return { error: 'Write a comment first.' };
  const [task] = await db.select({ id: T.id }).from(T).where(and(eq(T.id, p.data.taskId), eq(T.agencyId, agency.id)));
  if (!task) return { error: 'That task no longer exists.' };
  await db.insert(schema.taskComments).values({ taskId: task.id, userId: user.id, body: p.data.body });
  revalidatePath('/app');
  return { ok: true };
}
