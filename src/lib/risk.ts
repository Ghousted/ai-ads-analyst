import 'server-only';
import type { loadMetrics } from './metrics';
import { addDays } from './metric-store';

// Rule-based risk for each client, from their stored numbers, goals and report history. A client is flagged when one of
// the signals below fires: "At risk" (r) for a severe signal or two at once, "Needs attention" (n) for one.
// Claude explains a flag and suggests what to do (see flag-writer.ts); the rules alone decide who is flagged.

type Metrics = Awaited<ReturnType<typeof loadMetrics>>;
type Client = { id: string; name: string; createdAt: Date };
type Report = { clientId: string; createdAt: Date; status: string; sentAt: Date | null };
type Goal = { clientId: string; type: string; target: number };

export type Signal = { key: string; label: string; detail: string; say: string; act: string; severe?: boolean };
export type Risk = {
  level: 'h' | 'n' | 'r';
  signals: Signal[];
  keys: string;
  signature: string;
  through: string | null;
  leadSource: 'ga4' | 'meta' | null;
  weeks: { end: string; leads: number; sessions: number; spend: number; metaLeads: number }[];
  cpl: { now: number; before: number } | null;
  // now is this week's number, or this month's spend for the budget.
  goals: { type: string; target: number; now: number | null }[];
  lastReport: { day: string; status: string } | null;
  accounts: { tool: string; name: string; error: string | null }[];
};

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtDay = (d: string) => { const x = new Date(d + 'T00:00:00Z'); return MON[x.getUTCMonth()] + ' ' + x.getUTCDate(); };
const pct = (a: number, b: number) => Math.round(((a - b) / b) * 100);
const signed = (p: number) => (p > 0 ? '+' : p < 0 ? '−' : '') + Math.abs(p) + '%';
const money = (v: number) => v.toFixed(2);
const cash = (v: number) => '$' + Math.round(v).toLocaleString('en-US');
const daysBetween = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);

// Weeks of 7 days ending at `through`, oldest first.
const WEEKS = 6;

export function scoreClients(metrics: Metrics, clients: Client[], reports: Report[], goals: Goal[] = [], today = new Date().toISOString().slice(0, 10)) {
  // total[account index][metric][day]
  const total: Record<number, Record<string, Record<string, number>>> = {};
  for (const [a, day, dim, , metric, v] of metrics.rows) if (dim === 'total') ((total[a] ??= {})[metric] ??= {})[day] = v;
  // Google Ads cost only comes broken down by campaign in GA4.
  const adCost: Record<number, Record<string, number>> = {};
  for (const [a, day, dim, , metric, v] of metrics.rows) if (dim === 'campaign' && metric === 'adCost') (adCost[a] ??= {})[day] = ((adCost[a] ??= {})[day] || 0) + v;
  const out: Record<string, Risk> = {};
  for (const c of clients) {
    const idx = metrics.accounts.map((a, i) => (a.clientId === c.id ? i : -1)).filter(i => i >= 0);
    const accts = idx.map(i => metrics.accounts[i]);
    const through = accts.map(a => a.through).filter((d): d is string => !!d).sort().pop() ?? null;
    const sum = (tool: string, metric: string, from: string, to: string) => idx.filter(i => metrics.accounts[i].tool === tool)
      .reduce((t, i) => { for (const [d, v] of Object.entries((total[i] || {})[metric] || {})) if (d >= from && d <= to) t += v; return t; }, 0);
    const weeks = !through ? [] : Array.from({ length: WEEKS }, (_, k) => {
      const end = addDays(through, -7 * (WEEKS - 1 - k)), from = addDays(end, -6);
      return { end, sessions: sum('ga4', 'sessions', from, end), ga4Leads: sum('ga4', 'keyEvents', from, end), spend: sum('meta', 'spend', from, end), metaLeads: sum('meta', 'leads', from, end) };
    });
    // Leads are GA4 key events when the client tracks them, otherwise Meta leads.
    const ga4 = weeks.some(w => w.ga4Leads > 0), meta = weeks.some(w => w.metaLeads > 0);
    const leadSource = ga4 ? 'ga4' : meta ? 'meta' : null;
    const W = weeks.map(({ ga4Leads, ...w }) => ({ ...w, leads: Math.round(leadSource === 'ga4' ? ga4Leads : w.metaLeads), spend: Math.round(w.spend * 100) / 100 }));
    const L = W.map(w => w.leads);
    const signals: Signal[] = [];

    if (L.length === WEEKS) {
      const [w2, w3, w4, w5] = L.slice(2);
      const before = L.slice(0, 5).reduce((a, b) => a + b, 0);
      if (w5 === 0 && before >= 5) {
        signals.push({ key: 'leads-stopped', label: 'No leads this week', detail: before + ' in the 5 weeks before', severe: true,
          say: 'No leads came in this week, after ' + before + ' in the five weeks before.', act: 'check the forms and tracking still work, then call the client' });
      } else if (w2 >= 10 && w3 < w2 && w4 < w3 && w5 < w4) {
        const p = [pct(w3, w2), pct(w4, w3), pct(w5, w4)];
        signals.push({ key: 'leads-down-3', label: 'Leads down 3 weeks', detail: p.map(signed).join(', '), severe: true,
          say: 'Leads have dropped three weeks in a row (' + p.map(signed).join(', ') + '), from ' + w2 + ' to ' + w5 + ' a week.', act: 'book a 15-minute call to agree a plan to win leads back' });
      } else if (w4 >= 10 && w5 < w4 * 0.75) {
        signals.push({ key: 'leads-drop', label: 'Leads dropped', detail: signed(pct(w5, w4)) + ' this week',
          say: 'Leads fell ' + Math.abs(pct(w5, w4)) + '% this week, from ' + w4 + ' to ' + w5 + '.', act: 'find which channel lost leads and fix it this week' });
      }
    }

    // Meta cost per lead: the last 14 days against the 14 before, with enough leads to mean something.
    let cpl: Risk['cpl'] = null;
    if (through && idx.some(i => metrics.accounts[i].tool === 'meta')) {
      const s1 = sum('meta', 'spend', addDays(through, -13), through), l1 = sum('meta', 'leads', addDays(through, -13), through);
      const s0 = sum('meta', 'spend', addDays(through, -27), addDays(through, -14)), l0 = sum('meta', 'leads', addDays(through, -27), addDays(through, -14));
      if (l1 >= 5 && l0 >= 5) {
        cpl = { now: s1 / l1, before: s0 / l0 };
        const p = pct(cpl.now, cpl.before);
        if (p >= 20) signals.push({ key: 'cpl-up', label: 'Cost per lead rising', detail: signed(p) + ' in 2 weeks',
          say: 'Each Meta lead costs ' + p + '% more than in the two weeks before (' + money(cpl.now) + ' against ' + money(cpl.before) + ').', act: 'refresh the Meta ads that cost the most per lead' });
      }
    }

    // The goals set in the client's profile, against this week's numbers (the same ones the profile shows).
    const target = (t: string) => goals.find(g => g.clientId === c.id && g.type === t)?.target ?? null;
    const wk = W.at(-1), wkRaw = weeks.at(-1);
    const now = {
      leads: wk && leadSource ? wk.leads : null,
      cpl: wk && wk.metaLeads > 0 ? wk.spend / wk.metaLeads : null,
      conv: wkRaw && leadSource === 'ga4' && wkRaw.sessions > 0 ? wkRaw.ga4Leads / wkRaw.sessions * 100 : null,
    };
    const tLeads = target('leads'), tCpl = target('cpl'), tConv = target('conv');
    if (tLeads != null && now.leads != null && now.leads < tLeads)
      signals.push({ key: 'goal-leads', label: 'Below lead goal', detail: now.leads + ' of ' + Math.round(tLeads) + ' this week', severe: now.leads < tLeads * 0.5,
        say: 'They got ' + now.leads + ' leads this week, short of their goal of ' + Math.round(tLeads) + ' a week.', act: 'find which channel is short of leads and fix it this week' });
    // A few leads make cost per lead swing too much to judge.
    if (tCpl != null && now.cpl != null && wk!.metaLeads >= 3 && now.cpl > tCpl)
      signals.push({ key: 'goal-cpl', label: 'Cost per lead over goal', detail: '$' + money(now.cpl) + ' against $' + money(tCpl), severe: now.cpl >= tCpl * 1.5,
        say: 'Each Meta lead cost $' + money(now.cpl) + ' this week, over their goal of $' + money(tCpl) + '.', act: 'pause or refresh the Meta ads that cost the most per lead' });
    if (tConv != null && now.conv != null && wkRaw!.sessions >= 100 && now.conv < tConv)
      signals.push({ key: 'goal-conv', label: 'Conversion rate below goal', detail: now.conv.toFixed(1) + '% against ' + tConv.toFixed(1) + '%',
        say: 'Their conversion rate was ' + now.conv.toFixed(1) + '% this week, under their goal of ' + tConv.toFixed(1) + '%.', act: 'check the forms and landing pages that get the most visits' });

    // Monthly budget: spend so far this month (Meta spend plus Google Ads cost) against how far through the month we are.
    const budget = target('budget');
    let spentThisMonth: number | null = null;
    if (budget != null && through) {
      const month = through.slice(0, 8), td = Number(through.slice(8)), [y, m] = through.split('-').map(Number);
      const dim = new Date(Date.UTC(y, m, 0)).getUTCDate(), pace = td / dim;
      const spent = idx.reduce((t, i) => {
        const days = metrics.accounts[i].tool === 'meta' ? (total[i] || {}).spend || {} : metrics.accounts[i].tool === 'ga4' ? adCost[i] || {} : {};
        for (const [d, v] of Object.entries(days)) if (d.startsWith(month) && d <= through) t += v;
        return t;
      }, 0);
      spentThisMonth = spent;
      const left = dim - td, forecast = spent / td * dim;
      if (spent >= budget && left > 0)
        signals.push({ key: 'budget-out', label: 'Budget used up', detail: cash(spent) + ' of ' + cash(budget), severe: true,
          say: 'They’ve spent ' + cash(spent) + ' of their ' + cash(budget) + ' monthly budget with ' + left + ' days of the month to go.', act: 'agree with the client whether to pause ads or add budget' });
      // Pacing waits for the 5th: the first few days of a month say little about where it will land.
      else if (spent > 0 && td >= 5 && spent / budget > pace + 0.1)
        signals.push({ key: 'budget-fast', label: 'Spending fast', detail: 'On course for ' + cash(forecast),
          say: 'Spend is on course for ' + cash(forecast) + ' this month, over their ' + cash(budget) + ' budget.', act: 'lower daily budgets so the month lands on ' + cash(budget) });
      else if (spent > 0 && td >= 5 && spent / budget < pace - 0.15)
        signals.push({ key: 'budget-slow', label: 'Spending slow', detail: 'On course for ' + cash(forecast),
          say: 'Spend is on course for ' + cash(forecast) + ' this month, well under their ' + cash(budget) + ' budget.', act: 'check the campaigns are running and raise daily budgets if needed' });
    }
    const goalList = (['leads', 'cpl', 'conv', 'budget'] as const).flatMap(t => { const v = target(t); return v == null ? [] : [{ type: t, target: v, now: t === 'budget' ? spentThisMonth : now[t] }]; });

    // Numbers that stopped arriving make every other signal unreliable.
    const broken = accts.find(a => a.error);
    if (broken) signals.push({ key: 'sync-error', label: 'Data not updating', detail: broken.name,
      say: 'We couldn’t pull the latest numbers from ' + broken.name + ': ' + broken.error, act: 'reconnect ' + broken.name + ' in Integrations' });
    else if (through && daysBetween(through, today) > 4) signals.push({ key: 'stale', label: 'Data not updating', detail: 'Last day ' + fmtDay(through),
      say: 'The numbers haven’t updated since ' + fmtDay(through) + '.', act: 'check the connection in Integrations' });

    // A client with numbers who hasn't had a report in two weeks.
    const mine = reports.filter(r => r.clientId === c.id).sort((a, b) => +b.createdAt - +a.createdAt)[0];
    const lastReport = mine ? { day: (mine.sentAt || mine.createdAt).toISOString().slice(0, 10), status: mine.status } : null;
    const since = lastReport ? lastReport.day : c.createdAt.toISOString().slice(0, 10);
    if (through && daysBetween(since, today) > 14) signals.push({ key: 'no-report', label: lastReport ? 'No recent report' : 'No report yet', detail: daysBetween(since, today) + ' days',
      say: lastReport ? 'Their last report was ' + daysBetween(since, today) + ' days ago, on ' + fmtDay(since) + '.' : 'They haven’t had a report in the ' + daysBetween(since, today) + ' days since they were added.', act: 'send them a report this week' });

    // Broken data first: until it's fixed, nothing else can be trusted.
    signals.sort((a, b) => +/sync-error|stale/.test(b.key) - +/sync-error|stale/.test(a.key));
    const level = signals.some(s => s.severe) || signals.length >= 2 ? 'r' : signals.length ? 'n' : 'h';
    const keys = signals.map(s => s.key).sort().join(',');
    out[c.id] = { level, signals, keys, signature: (through || '') + ':' + keys, through, leadSource, weeks: W, cpl, goals: goalList, lastReport, accounts: accts.map(a => ({ tool: a.tool, name: a.name, error: a.error })) };
  }
  return out;
}
