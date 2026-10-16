import 'server-only';
import { z } from 'zod';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { aiModel, getClaude } from './ai';
import { flagFacts } from './flag-writer';
import type { loadMetrics } from './metrics';
import { TEMPLATES } from './report-blocks';
import type { Risk } from './risk';

type Metrics = Awaited<ReturnType<typeof loadMetrics>>;
type Client = { id: string; name: string; contactName: string; tone: string; createdAt: Date };
type Report = { clientId: string; title: string; status: string; createdAt: Date; sentAt: Date | null; shareToken: string | null; viewCount: number };
export type Extra = { goals: { client: string; goal: string; target: number }[]; tasks: { client: string; title: string; status: string }[] };

// Ask Analyst: Claude answers the agency's question from its own data, and can suggest actions the agency then takes
// with one click (add a task, write a report). It never acts on its own.
export const Answer = z.object({
  reply: z.string().describe('The answer, in plain text. Short paragraphs; use "• " for lists. No markdown, no headings.'),
  actions: z.array(z.object({
    kind: z.enum(['task', 'report']),
    client: z.string().describe('The client name exactly as in the data, or "" for no client.'),
    title: z.string().describe('For a task: what to do, under 70 characters. For a report: "Write <client>’s <period> report".'),
    why: z.string().describe('One short sentence on why, tied to the data.'),
    days: z.number().describe('Report period in days: 7, 14 or 30. 0 for tasks.'),
    template: z.string().describe('Report template id: ' + TEMPLATES.map(t => t.id).join(', ') + '. "" for tasks.'),
  })).describe('Zero to three suggested actions. Only when the question asks for help deciding or doing something, or a clear next step follows from the answer.'),
});
export type Answer = z.infer<typeof Answer>;

const SYSTEM = `You are Analyst, the assistant inside AI Ads Analyst, a tool marketing agencies use to report to their clients and keep them.
You talk to someone at the agency. Answer their question using only the data you are given.

Rules:
- Use only the numbers and facts in the data. Never invent numbers, campaigns, causes or clients. If the data can't answer, say what's missing (for example: "Meta isn't connected for this client") and how to get it.
- Be direct and brief: lead with the answer, then the numbers that support it. Two to five short paragraphs at most.
- "leads" are Google Analytics key events when a client tracks them, otherwise Meta leads. Small numbers are noisy; say so when a change rests on a few leads.
- Flags come from rules on the numbers: "r" is at risk, "n" needs attention, "h" is healthy.
- Suggest actions only when they help: a task the agency can do this week, or a report worth sending. Use real client names from the data. Don't suggest a report for a client with no data.
- You can't send emails, change budgets or settings, or connect accounts. If asked, say how the agency can do it in the app.
- Plain English, sentence case, no emojis, no markdown.`;

// Everything Analyst knows about the agency, compact enough to send each turn.
export function agencyContext(o: { agency: string; today: string; clients: Client[]; metrics: Metrics; risk: Record<string, Risk>; reports: Report[]; focusId: string | null; extra: Extra }) {
  const r2 = (v: number) => Math.round(v * 100) / 100;
  return {
    agency: o.agency, today: o.today,
    clients: o.clients.map(c => {
      const r = o.risk[c.id], focus = c.id === o.focusId;
      return {
        name: c.name, contact: c.contactName || null, reportTone: c.tone, added: c.createdAt.toISOString().slice(0, 10),
        flag: r ? r.level : 'h', signals: r ? r.signals.map(s => s.say) : [],
        accounts: r ? r.accounts : [], dataThrough: r ? r.through : null, leadSource: r ? r.leadSource : null,
        weeks: r ? r.weeks.map(w => ({ end: w.end, leads: w.leads, sessions: Math.round(w.sessions), metaSpend: r2(w.spend), metaLeads: Math.round(w.metaLeads) })) : [],
        metaCostPerLead: r && r.cpl ? { last14Days: r2(r.cpl.now), previous14Days: r2(r.cpl.before) } : null,
        // timesOpened is how often the client opened the report's link; null when it was never sent with one.
        reports: o.reports.filter(x => x.clientId === c.id).slice(0, 5).map(x => ({ title: x.title, status: x.status, written: x.createdAt.toISOString().slice(0, 10),
          sent: x.status === 'sent' && x.sentAt ? x.sentAt.toISOString().slice(0, 10) : null, timesOpened: x.status === 'sent' && x.shareToken ? x.viewCount : null })),
        goals: o.extra.goals.filter(g => g.client === c.name),
        openTasks: o.extra.tasks.filter(t => t.client === c.name && t.status !== 'done').map(t => t.title),
        // The client the agency is looking at gets the channel and campaign breakdowns too.
        ...(focus && r ? (({ channels, metaCampaigns }) => ({ channels, metaCampaigns }))(flagFacts(o.metrics, c.id, r)) : {}),
      };
    }),
    tasksWithoutClient: o.extra.tasks.filter(t => !t.client && t.status !== 'done').map(t => t.title),
  };
}

export async function askAnalyst(context: ReturnType<typeof agencyContext>, focus: string | null, messages: { me: boolean; text: string }[]) {
  const claude = getClaude();
  if (!claude) throw new Error('AI is not configured on this server.');
  // The conversation so far, starting with one of the agency's messages, as the API requires.
  const recent = messages.slice(-12), start = recent.findIndex(m => m.me), history = start < 0 ? [] : recent.slice(start);
  if (!history.length) throw new Error('Ask Analyst a question first.');
  const res = await claude.messages.parse({
    model: aiModel(),
    max_tokens: 8000,
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }, { type: 'text', text: 'Agency data (JSON):\n' + JSON.stringify(context) + (focus ? '\n\nThe agency is looking at ' + focus + '.' : '\n\nThe agency is looking at all clients.') }],
    output_config: { effort: 'low', format: zodOutputFormat(Answer) },
    messages: history.map(m => ({ role: m.me ? 'user' as const : 'assistant' as const, content: m.text })),
  });
  if (res.stop_reason === 'refusal') throw new Error('Analyst can’t help with that one.');
  if (!res.parsed_output) throw new Error('Analyst’s answer came back incomplete. Try again.');
  const a = res.parsed_output, names = new Set(context.clients.map(c => c.name));
  return {
    reply: a.reply.trim().slice(0, 4000),
    // Only actions about real clients, and reports only with a known template and period.
    actions: a.actions.slice(0, 3).filter(x => !x.client || names.has(x.client)).filter(x => x.kind === 'task' || (x.client && [7, 14, 30].includes(x.days) && TEMPLATES.some(t => t.id === x.template)))
      .map(x => ({ kind: x.kind, client: x.client, title: x.title.trim().slice(0, 120), why: x.why.trim().slice(0, 300), days: x.days, template: x.template })),
    usage: res.usage,
  };
}
