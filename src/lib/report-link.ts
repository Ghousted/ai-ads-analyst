import 'server-only';
import { randomBytes } from 'node:crypto';
import { eq, sql } from 'drizzle-orm';
import { db, schema } from '@/db';

// A report's private link, made once. The update only sets it when it's empty and returns what's stored, so two sends
// (or a send and a PDF download) at the same moment end up with the same link.
export async function reportLink(reportId: string): Promise<string> {
  const fresh = randomBytes(18).toString('base64url');
  const [row] = await db.update(schema.reports).set({ shareToken: sql`coalesce(${schema.reports.shareToken}, ${fresh})` })
    .where(eq(schema.reports.id, reportId)).returning({ token: schema.reports.shareToken });
  if (!row?.token) throw new Error('That report was deleted.');
  return row.token;
}
