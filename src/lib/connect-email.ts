import 'server-only';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// The ask-to-connect email: who is asking, what they get access to, and the button to the client's private link.
export function connectEmail(o: { agency: string; client: string; from: string; url: string }) {
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#f4f7fb">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;font-family:'DM Sans',Helvetica,Arial,sans-serif"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff">
<tr><td style="padding:28px 32px 8px"><div style="font-size:16px;font-weight:700;color:#0b1626">${esc(o.agency)}</div></td></tr>
<tr><td style="padding:12px 32px 0"><h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:#0b1626">Connect ${esc(o.client)}’s Google Analytics</h1>
<p style="margin:0 0 14px;font-size:16px;line-height:1.55;color:#0b1626">${esc(o.from)} at ${esc(o.agency)} asked you to connect your Google Analytics, so your reports show your website’s results.</p>
<p style="margin:0 0 14px;font-size:16px;line-height:1.55;color:#0b1626">Sign in with the Google login that has your Analytics. ${esc(o.agency)} gets read-only access and can’t change anything in your account. You can remove access any time in your Google account settings.</p></td></tr>
<tr><td style="padding:12px 32px 32px"><a href="${esc(o.url)}" style="display:inline-block;padding:14px 22px;background:#1f6be2;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none">Connect Google Analytics</a>
<p style="margin:16px 0 0;font-size:13px;color:#5a6474">The link works for 14 days.</p></td></tr>
</table>
<div style="padding:16px;font-size:12px;color:#5a6474">Sent by ${esc(o.agency)} with AI Ads Analyst. Reply to this email to reach them.</div>
</td></tr></table></body></html>`;
  const text = `${o.from} at ${o.agency} asked you to connect your Google Analytics, so your reports show your website's results.\n\nSign in with the Google login that has your Analytics. ${o.agency} gets read-only access and can't change anything in your account.\n\nConnect Google Analytics: ${o.url}\n\nThe link works for 14 days.`;
  return { html, text };
}
