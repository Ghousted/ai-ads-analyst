import { cronAuthorized, cronDeadline } from '@/lib/cron';
import { draftScheduled } from '@/lib/scheduler';

export const maxDuration = 300;

// After the sync: reports due in the next day are drafted for review.
export async function GET(req: Request) {
  if (!cronAuthorized(req)) return new Response('Unauthorized', { status: 401 });
  const drafts = await draftScheduled(cronDeadline());
  return Response.json({ drafted: drafts.drafted, notDrafted: drafts.skipped });
}
