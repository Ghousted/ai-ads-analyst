import 'server-only';
import { z } from 'zod';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { aiModel, getClaude } from './ai';
import { addDays } from './metric-store';
import type { loadMetrics } from './metrics';
import type { Risk } from './risk';

type Metrics = Awaited<ReturnType<typeof loadMetrics>>;

// What Claude returns for a flagged client: its read of the numbers, what the agency should do, and a check-in
// message the agency can send the client.
export const FlagAnalysis = z.object({
  summary: z.string().describe('Two or three short sentences on what is going on with this client and how serious it is.'),
  causes: z.array(z.string()).describe('Zero to three likely reasons the data supports, one sentence each. Empty if the data does not point to one.'),
  steps: z.array(z.object({
    action: z.string().describe('What to do, as a short instruction under 70 characters, e.g. "Pause the two Meta ads with the highest cost per lead".'),
    why: z.string().describe('One sentence on why, tied to a number in the data.'),
  })).describe('Two to four steps, most important first.'),
  message: z.string().describe('A short check-in message from the agency to the client, under 90 words, in the client\'s tone. Greets the contact by first name when given.'),
});
export type FlagAnalysis = z.infer<typeof FlagAnalysis>;

const SYSTEM = `You help a marketing agency look after its clients. A rule has flagged one client because their numbers or reporting slipped. You explain the flag to the agency and say what to do about it.

Rules:
- Use only the numbers in the data you are given. Never invent numbers, campaigns, events or causes.
- Say plainly how serious it is. Small numbers are noisy: if a change rests on a handful of leads, say so.
- Likely causes must come from the breakdowns (channels, campaigns) or the signals. If the data does not show a cause, leave causes empty instead of guessing.
- Steps are things the agency can do this week, specific to this client and data. The first step is the most important.
- "Data not updating" means the numbers may be stale: the first step is to fix the connection, and the rest of the read should say it may be out of date.
- The check-in message is written as the agency to the client. It is honest about the dip without alarming them, says what the agency is doing, and offers a short call when the client is at risk. No numbers the client hasn't seen in a report unless they help. No subject line, no sign-off name.
- Plain English, short sentences, no jargon, no emojis. Sentence case.`;

const TONES: Record<string, string> = {
  Friendly: 'Warm and easy to read.',
  Reassuring: 'Calm and confident. Lead with what is being done.',
  Professional: 'Clear and polished.',
  Straightforward: 'Direct, no padding.',
  'Short and direct': 'As short as possible.',
  Detailed: 'Thorough, explains the reasoning.',
};

// Breakdowns for the last 14 days against the 14 before: GA4 channels (sessions, leads) and Meta campaigns (spend, leads).
export function flagFacts(metrics: Metrics, clientId: string, risk: Risk) {
  const through = risk.through;
  const idx = new Set(metrics.accounts.map((a, i) => (a.clientId === clientId ? i : -1)).filter(i => i >= 0));
  const by = (dim: string, metric: string, from: string, to: string) => {
    const o: Record<string, number> = {};
    if (through) for (const [a, day, d, val, m, v] of metrics.rows) if (idx.has(a) && d === dim && m === metric && day >= from && day <= to) o[val] = (o[val] || 0) + v;
    return o;
  };
  const r2 = (v: number) => Math.round(v * 100) / 100;
  const compare = (dim: string, metrics: string[], top: number) => {
    if (!through) return [];
    const now = [addDays(through, -13), through] as const, before = [addDays(through, -27), addDays(through, -14)] as const;
    const cur = metrics.map(m => by(dim, m, ...now)), prev = metrics.map(m => by(dim, m, ...before));
    return Object.keys({ ...cur[0], ...prev[0] }).sort((a, b) => (cur[0][b] || 0) - (cur[0][a] || 0)).slice(0, top)
      .map(name => ({ name, ...Object.fromEntries(metrics.flatMap((m, k) => [[m, r2(cur[k][name] || 0)], ['prev_' + m, r2(prev[k][name] || 0)]])) }));
  };
  return {
    through,
    leadSource: risk.leadSource === 'ga4' ? 'Google Analytics key events' : risk.leadSource === 'meta' ? 'Meta leads' : 'not tracked',
    signals: risk.signals.map(s => s.say),
    weeks: risk.weeks,
    metaCostPerLead: risk.cpl && { last14Days: r2(risk.cpl.now), previous14Days: r2(risk.cpl.before) },
    lastReport: risk.lastReport,
    accounts: risk.accounts,
    channels: compare('channel', ['sessions', 'keyEvents'], 6),
    metaCampaigns: compare('campaign', ['spend', 'leads'], 6),
  };
}

type Ctx = { client: string; contact: string; agency: string; tone: string; level: string };
const clip = (s: string, n: number) => s.trim().slice(0, n);

export async function analyzeFlag(facts: ReturnType<typeof flagFacts>, ctx: Ctx) {
  const claude = getClaude();
  if (!claude) throw new Error('AI is not configured on this server.');
  const res = await claude.messages.parse({
    model: aiModel(),
    max_tokens: 8000,
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    output_config: { effort: 'medium', format: zodOutputFormat(FlagAnalysis) },
    messages: [{ role: 'user', content: `Client: ${ctx.client}
Contact: ${ctx.contact || 'not given'}
Agency: ${ctx.agency}
Flag: ${ctx.level === 'r' ? 'At risk' : 'Needs attention'}
Tone for the message: ${TONES[ctx.tone] || TONES.Friendly}

Weeks are 7 days ending on "end", oldest first. "leads" is the lead count from the lead source; prev_ fields are the 14 days before.

Data (JSON):
${JSON.stringify(facts)}

Explain the flag and say what to do.` }],
  });
  if (res.stop_reason === 'refusal') throw new Error('The AI declined to analyse this client.');
  if (!res.parsed_output) throw new Error('The AI returned an incomplete analysis. Try again.');
  const a = res.parsed_output;
  return {
    analysis: {
      summary: clip(a.summary, 800),
      causes: a.causes.slice(0, 3).map(s => clip(s, 300)),
      steps: a.steps.slice(0, 4).map(s => ({ action: clip(s.action, 120), why: clip(s.why, 300) })),
      message: clip(a.message, 1200),
    } satisfies FlagAnalysis,
    usage: res.usage,
  };
}
