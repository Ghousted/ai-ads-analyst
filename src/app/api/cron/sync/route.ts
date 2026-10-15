import { syncAll } from '@/lib/sync';

export const maxDuration = 300;

// Vercel Cron calls this daily with the CRON_SECRET bearer token. Pulls every linked GA4 property and Meta ad account.
export async function GET(req: Request) {
  if (!process.env.CRON_SECRET || req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) return new Response('Unauthorized', { status: 401 });
  const { results, skipped } = await syncAll();
  return Response.json({ accounts: results.length, failed: results.filter(r => r && 'error' in r).length, leftForNextRun: skipped });
}
