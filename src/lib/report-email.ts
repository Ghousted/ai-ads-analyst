import 'server-only';
import { kpis } from '@/screens/app/modules/livereports/dataviews';
import type { Doc } from './report-blocks';

type PM = { type: string; text?: string; content?: PM[]; attrs?: Record<string, unknown> };
const textOf = (n: PM): string => n.text ?? (n.content || []).map(textOf).join('');
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// The report email: the agency's note, the report's headline, summary and key numbers, and a button to the full report.
// Tables and inline styles only, so it holds up in Gmail and Outlook.
export function reportEmail(o: { agency: string; color: string; logoUrl: string | null; client: string; title: string; period: string; message: string; doc: Doc; facts: unknown; link: string }) {
  const nodes = (o.doc.content || []) as PM[];
  const headline = textOf(nodes.find(n => n.type === 'heading') || { type: 'x' }).trim() || o.title;
  const summary = textOf(nodes.find(n => n.type === 'paragraph' && textOf(n).trim()) || { type: 'x' }).trim();
  let tiles: { label: string; value: string; note: string; c: string }[] = [];
  try { tiles = kpis(o.facts as never).slice(0, 4); } catch { tiles = []; }
  const color = /^#[0-9a-f]{6}$/i.test(o.color) ? o.color : '#1f6be2';
  const para = (s: string) => s.split(/\n{2,}/).map(p => `<p style="margin:0 0 14px;font-size:16px;line-height:1.55;color:#0b1626">${esc(p).replace(/\n/g, '<br>')}</p>`).join('');
  const tileCells = tiles.map(t => `<td width="${Math.floor(100 / tiles.length)}%" style="padding:12px 14px;background:#f4f7fb;vertical-align:top">
      <div style="font-size:13px;color:#5a6474">${esc(t.label)}</div>
      <div style="font-size:22px;font-weight:700;color:#0b1626;padding:2px 0">${esc(t.value)}</div>
      <div style="font-size:12px;font-weight:600;color:${t.c}">${esc(t.note)}</div></td>`).join('<td width="8" style="font-size:0">&nbsp;</td>');
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#f4f7fb">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;font-family:'DM Sans',Helvetica,Arial,sans-serif"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff">
<tr><td style="padding:24px 32px 0">${o.logoUrl ? `<img src="${esc(o.logoUrl)}" alt="${esc(o.agency)}" height="36" style="display:block;height:36px;max-width:200px">` : `<div style="font-size:16px;font-weight:700;color:#0b1626">${esc(o.agency)}</div>`}</td></tr>
<tr><td style="padding:24px 32px 8px">${para(o.message)}</td></tr>
<tr><td style="padding:8px 32px 0"><div style="font-size:13px;font-weight:600;color:#5a6474">${esc(o.client)} · ${esc(o.period)}</div>
<h1 style="margin:6px 0 10px;font-size:24px;line-height:1.25;color:#0b1626">${esc(headline)}</h1>${summary ? para(summary) : ''}</td></tr>
${tiles.length ? `<tr><td style="padding:4px 32px 8px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${tileCells}</tr></table></td></tr>` : ''}
<tr><td style="padding:20px 32px 32px"><a href="${esc(o.link)}" style="display:inline-block;padding:14px 22px;background:${color};color:#ffffff;font-size:16px;font-weight:600;text-decoration:none">View the full report</a></td></tr>
</table>
<div style="padding:16px;font-size:12px;color:#5a6474">Sent by ${esc(o.agency)} with AI Ads Analyst. Reply to this email to reach them.</div>
</td></tr></table></body></html>`;
  const text = `${o.message}\n\n${o.client} · ${o.period}\n${headline}\n${summary}\n\n${tiles.map(t => `${t.label}: ${t.value} (${t.note})`).join('\n')}\n\nView the full report: ${o.link}\n\nSent by ${o.agency} with AI Ads Analyst.`;
  return { html, text };
}
