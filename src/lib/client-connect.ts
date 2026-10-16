import 'server-only';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/db';

const DAYS = 14;

// The client and agency behind an ask-to-connect link, while it still works.
export async function findConnectLink(token: string) {
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(token)) return null;
  const [r] = await db.select({ client: schema.clients, agency: schema.agencies }).from(schema.clients)
    .innerJoin(schema.agencies, eq(schema.agencies.id, schema.clients.agencyId))
    .where(eq(schema.clients.connectToken, token));
  if (!r || !r.client.connectSentAt || Date.now() - r.client.connectSentAt.getTime() > DAYS * 864e5) return null;
  return r;
}
