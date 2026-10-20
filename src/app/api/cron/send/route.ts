import { cronAuthorized, cronDeadline } from '@/lib/cron';
import { sendApproved } from '@/lib/scheduler';

export const maxDuration = 300;

// On the hour: approved reports that are due go out.
export async function GET(req: Request) {
  if (!cronAuthorized(req)) return new Response('Unauthorized', { status: 401 });
  const sent = await sendApproved(cronDeadline());
  return Response.json({ sent: sent.filter(s => s.ok).length, sendFailed: sent.filter(s => !s.ok).map(s => s.error) });
}
