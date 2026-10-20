import { runAlerts } from '@/lib/alerts';
import { cronAuthorized, cronDeadline } from '@/lib/cron';

export const maxDuration = 300;

// After the sync: alerts and the Monday summary go out.
export async function GET(req: Request) {
  if (!cronAuthorized(req)) return new Response('Unauthorized', { status: 401 });
  return Response.json(await runAlerts(cronDeadline()));
}
