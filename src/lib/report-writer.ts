import 'server-only';
import { and, eq, gte, inArray, lte } from 'drizzle-orm';
import { z } from 'zod';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { db, schema } from '@/db';
import { aiModel, getClaude } from './ai';

const addDays = (day: string, n: number) => { const d = new Date(day + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };

export type Facts = Awaited<ReturnType<typeof buildFacts>>;

// The numbers a report is written from: this period and the one before, for the client's linked GA4 properties.
export async function buildFacts(clientId: string, periodDays: number) {
  const accts = await db.select().from(schema.accounts).where(and(eq(schema.accounts.clientId, clientId), eq(schema.accounts.tool, 'ga4')));
  const through = accts.map(a => a.dataThrough).filter((d): d is string => !!d).sort().pop();
  if (!through) return null;
  const end = through, start = addDays(end, -periodDays + 1), prevEnd = addDays(start, -1), prevStart = addDays(prevEnd, -periodDays + 1);
  const rows = await db.select().from(schema.metricRows)
    .where(and(inArray(schema.metricRows.accountId, accts.map(a => a.id)), gte(schema.metricRows.day, prevStart), lte(schema.metricRows.day, end)));
  const cur = rows.filter(r => r.day >= start), prev = rows.filter(r => r.day < start);
  const total = (rs: typeof rows, m: string) => Math.round(rs.filter(r => r.dim === 'total' && r.metric === m).reduce((t, r) => t + r.value, 0) * 100) / 100;
  const totals = (rs: typeof rows) => ({ sessions: total(rs, 'sessions'), engagedSessions: total(rs, 'engagedSessions'), leads: total(rs, 'keyEvents'), pageViews: total(rs, 'screenPageViews'),
    adCost: Math.round(rs.filter(r => r.dim === 'campaign' && r.metric === 'adCost').reduce((t, r) => t + r.value, 0) * 100) / 100 });
  const by = (rs: typeof rows, dim: string, metric: string) => { const o: Record<string, number> = {}; for (const r of rs) if (r.dim === dim && r.metric === metric) o[r.dimValue] = (o[r.dimValue] || 0) + r.value; return o; };
  const top = (dim: string, n: number) => { const s = by(cur, dim, 'sessions'), k = by(cur, dim, 'keyEvents'), ps = by(prev, dim, 'sessions');
    return Object.entries(s).sort((a, b) => b[1] - a[1]).slice(0, n).map(([name, sessions]) => ({ name, sessions, leads: k[name] || 0, prevSessions: ps[name] || 0 })); };
  const daily = Array.from({ length: periodDays * 2 }, (_, i) => { const day = addDays(prevStart, i), rs = rows.filter(r => r.day === day && r.dim === 'total');
    return { day, sessions: rs.find(r => r.metric === 'sessions')?.value || 0, leads: rs.find(r => r.metric === 'keyEvents')?.value || 0 }; });
  const camps = by(cur, 'campaign', 'adCost'), clicks = by(cur, 'campaign', 'adClicks');
  return {
    periodDays, start, end, prevStart, prevEnd, properties: accts.map(a => a.name),
    totals: totals(cur), prev: totals(prev), daily,
    channels: top('channel', 6), devices: top('device', 3), pages: top('page', 5),
    campaigns: Object.entries(camps).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, cost]) => ({ name, cost: Math.round(cost * 100) / 100, clicks: clicks[name] || 0 })),
  };
}

// What Claude returns. Kept flat and simple so it validates as strict JSON.
export const ReportContent = z.object({
  headline: z.string().describe('One line, under 90 characters, stating the most important result with a number.'),
  summary: z.string().describe('Two or three short sentences a busy client reads first.'),
  sections: z.array(z.object({ heading: z.string(), body: z.string() })).describe('Two to four sections, e.g. what happened, where visitors came from, what changed.'),
  nextSteps: z.array(z.string()).describe('Two to four concrete actions the agency will take, one sentence each.'),
});
export type ReportContent = z.infer<typeof ReportContent>;

const TONES: Record<string, string> = {
  Friendly: 'Warm and easy to read, like a note from someone on their side.',
  Reassuring: 'Calm and confident. Acknowledge dips plainly and lead with what is being done about them.',
  Professional: 'Clear and polished. No small talk.',
  Straightforward: 'Direct. Lead with the result, no padding.',
  'Short and direct': 'As short as possible. Key points only.',
  Detailed: 'Thorough. Explain the reasoning behind each point.',
};

// Stable across every request, so it can be cached by the provider.
const SYSTEM = `You write the weekly or monthly results report that a marketing agency sends to one of its clients.

Rules:
- Use only the numbers in the data you are given. Never invent numbers, campaigns, events or causes.
- Compare this period with the previous period of the same length. Say whether things went up or down and by how much.
- "leads" are the client's Google Analytics key events (the actions they chose to count, such as form submissions). If leads are 0 in both periods, say that leads are not being tracked yet and suggest setting up key events, instead of calling it a drop.
- When you explain why something changed, present it as a likely reason the data supports, not a fact.
- Write for the client, as the agency ("we"). Plain English, short sentences, no marketing jargon, no emojis. Headings in sentence case.
- Next steps are concrete things the agency will do in the coming period, based on the data.
- Small numbers are noisy. If a change is based on a handful of sessions or leads, say so instead of overstating it.`;

export async function writeReport(facts: NonNullable<Facts>, ctx: { client: string; agency: string; tone: string }, instruction?: string, current?: ReportContent) {
  const claude = getClaude();
  if (!claude) throw new Error('AI is not configured on this server.');
  const brief = `Client: ${ctx.client}
Agency: ${ctx.agency}
Tone: ${TONES[ctx.tone] || TONES.Friendly}
Period: ${facts.start} to ${facts.end} (${facts.periodDays} days), compared with ${facts.prevStart} to ${facts.prevEnd}.

Data (JSON):
${JSON.stringify({ ...facts, daily: undefined })}`;
  const messages: { role: 'user'; content: string }[] = [{ role: 'user', content: current && instruction
    ? `${brief}\n\nHere is the current report (JSON):\n${JSON.stringify(current)}\n\nRevise it following this request from the agency, keeping everything else accurate: ${instruction}`
    : `${brief}\n\nWrite the report.` }];
  const res = await claude.messages.parse({
    model: aiModel(),
    max_tokens: 16000,
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    output_config: { effort: 'medium', format: zodOutputFormat(ReportContent) },
    messages,
  });
  if (res.stop_reason === 'refusal') throw new Error('The AI declined to write this report.');
  if (!res.parsed_output) throw new Error('The AI returned an incomplete report. Try again.');
  const c = res.parsed_output;
  // Trim and cap what goes into the database.
  const clip = (s: string, n: number) => s.trim().slice(0, n);
  return {
    content: { headline: clip(c.headline, 160), summary: clip(c.summary, 1200), sections: c.sections.slice(0, 5).map(s => ({ heading: clip(s.heading, 120), body: clip(s.body, 2000) })), nextSteps: c.nextSteps.slice(0, 6).map(s => clip(s, 400)) },
    usage: res.usage,
  };
}
