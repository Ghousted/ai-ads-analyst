import 'server-only';

// Vercel Cron calls each job with the CRON_SECRET bearer token. Every job gets its own function and time budget, so a
// slow sync can't stop alerts or drafts from running. Schedules are in vercel.json, a few minutes apart so the numbers
// are pulled before alerts and drafts read them.
export function cronAuthorized(req: Request) {
  return !!process.env.CRON_SECRET && req.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`;
}

// Stop starting new work this long before the 300-second limit, so each job can report what it did.
export const cronDeadline = () => Date.now() + 270_000;
