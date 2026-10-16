import 'server-only';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export type NoticeItem = { title: string; detail: string; note?: string; noteColor?: string; link?: string; linkLabel?: string };

// Emails AI Ads Analyst sends to the agency itself: drafts to review, alerts, the weekly summary, invites.
// One heading, a short intro, a list of items, and a button. Tables and inline styles only, for Gmail and Outlook.
export function noticeEmail(o: { agency: string; heading: string; intro: string; items?: NoticeItem[]; button?: { label: string; url: string }; footer: string }) {
  const items = (o.items || []).map(i => `<tr><td style="padding:14px 0;border-top:1px solid #eef1f6">
<div style="font-size:16px;font-weight:700;color:#0b1626">${esc(i.title)}</div>
<div style="font-size:15px;line-height:1.5;color:#45505f;padding-top:2px">${esc(i.detail)}</div>
${i.note ? `<div style="font-size:14px;font-weight:600;color:${i.noteColor || '#5a6474'};padding-top:4px">${esc(i.note)}</div>` : ''}
${i.link ? `<div style="padding-top:6px"><a href="${esc(i.link)}" style="font-size:15px;font-weight:600;color:#1f6be2">${esc(i.linkLabel || 'Open')}</a></div>` : ''}
</td></tr>`).join('');
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#f4f7fb">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;font-family:'DM Sans',Helvetica,Arial,sans-serif"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff">
<tr><td style="padding:28px 32px 0"><div style="font-size:14px;font-weight:600;color:#5a6474">${esc(o.agency)}</div>
<h1 style="margin:6px 0 10px;font-size:22px;line-height:1.3;color:#0b1626">${esc(o.heading)}</h1>
<p style="margin:0 0 8px;font-size:16px;line-height:1.55;color:#0b1626">${esc(o.intro)}</p></td></tr>
${items ? `<tr><td style="padding:8px 32px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${items}</table></td></tr>` : ''}
${o.button ? `<tr><td style="padding:20px 32px 32px"><a href="${esc(o.button.url)}" style="display:inline-block;padding:14px 22px;background:#1f6be2;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none">${esc(o.button.label)}</a></td></tr>` : '<tr><td style="padding:0 0 24px"></td></tr>'}
</table>
<div style="padding:16px;max-width:560px;font-size:12px;line-height:1.5;color:#5a6474">${esc(o.footer)}</div>
</td></tr></table></body></html>`;
  const text = [o.heading, '', o.intro, '', ...(o.items || []).map(i => [i.title, i.detail, i.note, i.link].filter(Boolean).join('\n') + '\n'), o.button ? o.button.label + ': ' + o.button.url : '', '', o.footer].join('\n');
  return { html, text };
}
