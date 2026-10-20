import 'server-only';
import { and, eq, gte, inArray, lte } from 'drizzle-orm';
import { z } from 'zod';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { db, schema } from '@/db';
import { aiModel, getClaude } from './ai';


const addDays = (day: string, n: number) => { const d = new Date(day + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };

export type Facts = Awaited<ReturnType<typeof buildFacts>>;

// An account this many days behind the client's newest numbers is left out of the report rather than counted as zero.
const MAX_LAG_DAYS = 2;

// Which of the client's accounts a report counts, the ones it leaves out, and the day its period ends.
type Acct = { name: string; tool: string; dataThrough: string | null; syncError: string | null };
export function pickAccounts<A extends Acct>(linked: A[]) {
  const newest = linked.map(a => a.dataThrough).filter((d): d is string => !!d).sort().pop();
  if (!newest) return null;
  const accts = linked.filter(a => a.dataThrough && a.dataThrough >= addDays(newest, -MAX_LAG_DAYS));
  const leftOut = linked.filter(a => !accts.includes(a)).map(a => ({ name: a.name, platform: a.tool === 'meta' ? 'Meta' : 'Google Analytics', numbersThrough: a.dataThrough, problem: a.syncError }));
  return { accts, leftOut, end: accts.map(a => a.dataThrough!).sort()[0] };
}

// The numbers a report is written from: this period and the one before, for the client's linked GA4 properties and
// Meta ad accounts. The period ends on the last day every included account has numbers for, so a pull that is a day
// behind never reads as a drop. Accounts further behind (or never pulled) are left out of both periods and listed in
// leftOut, so the report can say their numbers aren't in yet.
export async function buildFacts(clientId: string, periodDays: number) {
  const linked = await db.select().from(schema.accounts).where(and(eq(schema.accounts.clientId, clientId), inArray(schema.accounts.tool, ['ga4', 'meta'])));
  const picked = pickAccounts(linked);
  if (!picked) return null;
  const { accts, leftOut, end } = picked;
  const start = addDays(end, -periodDays + 1), prevEnd = addDays(start, -1), prevStart = addDays(prevEnd, -periodDays + 1);
  const rows = await db.select().from(schema.metricRows)
    .where(and(inArray(schema.metricRows.accountId, accts.map(a => a.id)), gte(schema.metricRows.day, prevStart), lte(schema.metricRows.day, end)));
  const metaIds = new Set(accts.filter(a => a.tool === 'meta').map(a => a.id));
  const ga4Rows = rows.filter(r => !metaIds.has(r.accountId)), metaRows = rows.filter(r => metaIds.has(r.accountId));
  const cur = ga4Rows.filter(r => r.day >= start), prev = ga4Rows.filter(r => r.day < start);
  const mCur = metaRows.filter(r => r.day >= start), mPrev = metaRows.filter(r => r.day < start);
  const total = (rs: typeof rows, m: string) => Math.round(rs.filter(r => r.dim === 'total' && r.metric === m).reduce((t, r) => t + r.value, 0) * 100) / 100;
  // Meta numbers sit beside GA4's, never added to them: Meta counts leads its ads only helped with.
  const totals = (rs: typeof rows, ms: typeof rows) => ({ sessions: total(rs, 'sessions'), engagedSessions: total(rs, 'engagedSessions'), leads: total(rs, 'keyEvents'), pageViews: total(rs, 'screenPageViews'),
    adCost: Math.round(rs.filter(r => r.dim === 'campaign' && r.metric === 'adCost').reduce((t, r) => t + r.value, 0) * 100) / 100,
    metaSpend: total(ms, 'spend'), metaImpressions: total(ms, 'impressions'), metaClicks: total(ms, 'clicks'), metaLeads: total(ms, 'leads') });
  const by = (rs: typeof rows, dim: string, metric: string) => { const o: Record<string, number> = {}; for (const r of rs) if (r.dim === dim && r.metric === metric) o[r.dimValue] = (o[r.dimValue] || 0) + r.value; return o; };
  const top = (dim: string, n: number) => { const s = by(cur, dim, 'sessions'), k = by(cur, dim, 'keyEvents'), ps = by(prev, dim, 'sessions');
    return Object.entries(s).sort((a, b) => b[1] - a[1]).slice(0, n).map(([name, sessions]) => ({ name, sessions, leads: k[name] || 0, prevSessions: ps[name] || 0 })); };
  const daily = Array.from({ length: periodDays * 2 }, (_, i) => { const day = addDays(prevStart, i), rs = ga4Rows.filter(r => r.day === day && r.dim === 'total');
    return { day, sessions: rs.find(r => r.metric === 'sessions')?.value || 0, leads: rs.find(r => r.metric === 'keyEvents')?.value || 0, engaged: rs.find(r => r.metric === 'engagedSessions')?.value || 0, pageViews: rs.find(r => r.metric === 'screenPageViews')?.value || 0 }; });
  const camps = by(cur, 'campaign', 'adCost'), clicks = by(cur, 'campaign', 'adClicks');
  const mSpend = by(mCur, 'campaign', 'spend'), mClicks = by(mCur, 'campaign', 'clicks'), mLeads = by(mCur, 'campaign', 'leads'), mPrevSpend = by(mPrev, 'campaign', 'spend');
  const r2 = (v: number) => Math.round(v * 100) / 100;
  return {
    periodDays, start, end, prevStart, prevEnd, properties: accts.filter(a => a.tool === 'ga4').map(a => a.name), adAccounts: accts.filter(a => a.tool === 'meta').map(a => a.name), leftOut,
    totals: totals(cur, mCur), prev: totals(prev, mPrev), daily,
    channels: top('channel', 6), devices: top('device', 3), pages: top('page', 5),
    campaigns: Object.entries(camps).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, cost]) => ({ name, cost: Math.round(cost * 100) / 100, clicks: clicks[name] || 0 })),
    metaCampaigns: Object.entries(mSpend).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, spend]) => ({ name, spend: r2(spend), clicks: mClicks[name] || 0, leads: mLeads[name] || 0, prevSpend: r2(mPrevSpend[name] || 0) })),
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
- "leads" are the client's Google Analytics key events (the actions they chose to count, such as form submissions). If leads are 0 in both periods and the client has a Google Analytics property, say that leads are not being tracked yet and suggest setting up key events, instead of calling it a drop.
- The meta* numbers and metaCampaigns are from the client's Meta (Facebook and Instagram) ads: spend, impressions, clicks and the leads Meta reports. Meta counts leads its ads only helped with, so never add Meta leads to Google Analytics leads. When both exist, cost per lead is Meta spend divided by Meta leads, and say it is Meta's count. When the client has no Google Analytics property, Meta leads are their leads.
- leftOut lists accounts whose numbers weren't up to date, so none of their numbers are in the data. If it isn't empty, say in one short sentence which ones aren't included yet and that they'll be in the next report. Never treat their absence as a drop.
- Leave out any platform with no numbers. When the client has no Google Analytics property (properties is empty), don't mention Google Analytics, website traffic or tracking set-up at all; report on Meta alone.
- When you explain why something changed, present it as a likely reason the data supports, not a fact.
- Write for the client, as the agency ("we"). Plain English, short sentences, no marketing jargon, no emojis. Headings in sentence case.
- Next steps are concrete things the agency will do in the coming period, based on the data.
- Small numbers are noisy. If a change is based on a handful of sessions or leads, say so instead of overstating it.`;

type Ctx = { client: string; agency: string; tone: string };
const clip = (s: string, n: number) => s.trim().slice(0, n);

// The client, tone, period and numbers, shared by every writing request.
function briefFor(facts: NonNullable<Facts>, ctx: Ctx) {
  return `Client: ${ctx.client}
Agency: ${ctx.agency}
Tone: ${TONES[ctx.tone] || TONES.Friendly}
Period: ${facts.start} to ${facts.end} (${facts.periodDays} days), compared with ${facts.prevStart} to ${facts.prevEnd}.

Data (JSON):
${JSON.stringify({ ...facts, daily: undefined })}`;
}

function claudeOrThrow() {
  const claude = getClaude();
  if (!claude) throw new Error('AI is not configured on this server.');
  return claude;
}

export async function writeReport(facts: NonNullable<Facts>, ctx: Ctx, focus = '') {
  const res = await claudeOrThrow().messages.parse({
    model: aiModel(),
    max_tokens: 16000,
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    output_config: { effort: 'medium', format: zodOutputFormat(ReportContent) },
    messages: [{ role: 'user', content: `${briefFor(facts, ctx)}\n\nWrite the report.${focus ? ' ' + focus : ''}` }],
  });
  if (res.stop_reason === 'refusal') throw new Error('The AI declined to write this report.');
  if (!res.parsed_output) throw new Error('The AI returned an incomplete report. Try again.');
  const c = res.parsed_output;
  // Trim and cap what goes into the database.
  return {
    content: { headline: clip(c.headline, 160), summary: clip(c.summary, 1200), sections: c.sections.slice(0, 5).map(s => ({ heading: clip(s.heading, 120), body: clip(s.body, 2000) })), nextSteps: c.nextSteps.slice(0, 6).map(s => clip(s, 400)) },
    usage: res.usage,
  };
}

const LIMITS: Record<string, number> = { headline: 160, heading: 160, paragraph: 2000, 'list item': 500 };

// Ask Analyst on one piece of text (a headline, heading, paragraph or list item): Claude rewrites only that piece,
// keeping it true to the numbers and consistent with the rest of the report.
export async function rewritePart(facts: NonNullable<Facts>, ctx: Ctx, reportText: string, kind: string, current: string, instruction: string) {
  const res = await claudeOrThrow().messages.parse({
    model: aiModel(),
    max_tokens: 8000,
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    output_config: { effort: 'low', format: zodOutputFormat(z.object({ text: z.string().describe('The new text for that part only, with no heading or label.') })) },
    messages: [{ role: 'user', content: `${briefFor(facts, ctx)}

The report's text as it stands:
${reportText}

Rewrite only this ${kind}. Its current text:
"""${current}"""

The agency's request: ${instruction}

Keep it accurate to the data and consistent with the rest of the report. Return only the new text for this part.` }],
  });
  if (res.stop_reason === 'refusal') throw new Error('The AI declined to rewrite this part.');
  if (!res.parsed_output?.text?.trim()) throw new Error('The AI returned nothing. Try again.');
  return { text: clip(res.parsed_output.text, LIMITS[kind] || 2000), usage: res.usage };
}
