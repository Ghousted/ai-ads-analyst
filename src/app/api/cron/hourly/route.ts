import { syncAll } from '@/lib/sync';
import { draftScheduled, sendApproved } from '@/lib/scheduler';
import { runAlerts } from '@/lib/alerts';

export const maxDuration = 300;

// Vercel Cron calls this every hour with the CRON_SECRET bearer token. In order: approved reports that are due go out,
// accounts not pulled in the last 20 hours are pulled, alerts and the Monday summary go out, and reports due in the next
// day are drafted for review.
export async function GET(req: Request) {
  if (!process.env.CRON_SECRET || req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) return new Response('Unauthorized', { status: 401 });
  const deadline = Date.now() + 270_000;
  const sent = await sendApproved(deadline);
  const { results, skipped } = await syncAll(undefined, 120_000, 20 * 3600_000);
  const alerts = await runAlerts(deadline);
  const drafts = await draftScheduled(deadline);
  return Response.json({
    sent: sent.filter(s => s.ok).length, sendFailed: sent.filter(s => !s.ok).map(s => s.error),
    accounts: results.length, failed: results.filter(r => r && 'error' in r).length, leftForNextRun: skipped,
    alerts: alerts.alerts, summaries: alerts.summaries, drafted: drafts.drafted, notDrafted: drafts.skipped,
  });
}
