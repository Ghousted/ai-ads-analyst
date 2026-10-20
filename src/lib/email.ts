import 'server-only';

// Email through Resend's HTTP API. RESEND_API_KEY and EMAIL_FROM (an address on a domain verified in Resend) must be
// set. The agency's name goes in front of the address, and replies go to whoever sent the email.
export const emailConfigured = () => !!process.env.RESEND_API_KEY && !!process.env.EMAIL_FROM;

export async function sendEmail(o: { fromName: string; replyTo?: string; to: string[]; subject: string; html: string; text: string; tag?: string; attachments?: { filename: string; content: Buffer }[] }) {
  const key = process.env.RESEND_API_KEY, from = process.env.EMAIL_FROM;
  if (!key || !from) throw new Error('Email isn’t set up on this server yet. Add RESEND_API_KEY and EMAIL_FROM.');
  const address = from.match(/<([^>]+)>/)?.[1] || from.trim();
  // Display names can't hold quotes or angle brackets.
  const name = o.fromName.replace(/["<>\\]/g, '').trim().slice(0, 80) || 'AI Ads Analyst';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(20_000),
    body: JSON.stringify({ from: `"${name}" <${address}>`, to: o.to, reply_to: o.replyTo, subject: o.subject, html: o.html, text: o.text, tags: o.tag ? [{ name: 'kind', value: o.tag }] : undefined,
      attachments: o.attachments?.map(a => ({ filename: a.filename, content: a.content.toString('base64') })) }),
  });
  const body = await res.json().catch(() => ({})) as { id?: string; message?: string; name?: string };
  if (!res.ok) {
    console.error('[email]', res.status, body);
    if (res.status === 401 || res.status === 403) throw new Error(/domain/i.test(body.message || '') ? 'The sending domain isn’t verified in Resend yet. Verify it, then try again.' : 'Resend rejected the API key. Check RESEND_API_KEY.');
    if (res.status === 422) throw new Error('Resend couldn’t send this: ' + (body.message || 'check the email addresses.'));
    if (res.status === 429) throw new Error('Too many emails at once. Try again in a minute.');
    throw new Error('Sending failed (' + res.status + '). Try again.');
  }
  return body.id || '';
}
