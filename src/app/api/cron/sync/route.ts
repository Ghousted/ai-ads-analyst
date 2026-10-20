import { cronAuthorized } from '@/lib/cron';
import { syncAll } from '@/lib/sync';

export const maxDuration = 300;

// Accounts not pulled in the last 20 hours are pulled. Accounts left over when time runs out go first next hour.
export async function GET(req: Request) {
  if (!cronAuthorized(req)) return new Response('Unauthorized', { status: 401 });
  const { results, skipped } = await syncAll(undefined, 240_000, 20 * 3600_000);
  return Response.json({ accounts: results.length, failed: results.filter(r => r && 'error' in r).length, leftForNextRun: skipped });
}
