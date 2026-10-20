// What a chart or table in a report shows, from the report's saved numbers (facts).
import { fmtDay, fmtNum, pct } from '../../metrics';
import { money as fmtMoney } from '@/lib/money';

const rate = (a, b) => (b ? (a / b) * 100 : 0);
const ptsChange = (a, b) => { const d = Math.round((a - b) * 10) / 10; return (d > 0 ? '+' : d < 0 ? '−' : '') + Math.abs(d) + ' pts'; };
export const tint = note => (String(note).startsWith('+') ? '#1d6b3a' : String(note).startsWith('−') ? '#a3330c' : '#5a6474');
// Costs read the other way round: falling is good. Spend is neither.
const tintFor = (label, note) => (/^cost/i.test(label) ? tint(String(note).replace(/^[+−]/, m => (m === '+' ? '−' : '+'))) : /spend/i.test(label) ? '#5a6474' : tint(note));
// Money in the report's currency (saved with its numbers; reports from before that are in dollars). Cents under 100.
const moneyIn = f => (v, cents) => fmtMoney(v, f.currency, cents && v < 100);
// Whether the report has GA4 numbers, and Meta numbers. Reports saved before Meta have no meta* fields.
const hasGa4 = f => !f.properties || f.properties.length > 0;
const hasMeta = f => !!(f.totals.metaSpend || f.prev.metaSpend);
const METRIC = { sessions: ['Sessions per day', 'sessions'], leads: ['Leads per day', 'leads'], engaged: ['Engaged sessions per day', 'engaged'], pageViews: ['Page views per day', 'pageViews'] };

export function kpis(f) {
  const money = moneyIn(f);
  const t = f.totals, p = f.prev, n = f.periodDays, ga4 = hasGa4(f), meta = hasMeta(f);
  const cpl = x => (x.metaLeads ? x.metaSpend / x.metaLeads : 0);
  // With GA4, leads are the site's; Meta's own lead count sits beside it, labelled. Without GA4, Meta's leads are the leads.
  return (ga4 ? [
    ['Leads', fmtNum(t.leads), pct(t.leads, p.leads)],
    ['Sessions', fmtNum(t.sessions), pct(t.sessions, p.sessions)],
    ['Conversion rate', rate(t.leads, t.sessions).toFixed(1) + '%', ptsChange(rate(t.leads, t.sessions), rate(p.leads, p.sessions))],
  ].concat(meta ? [] : [['Engagement rate', Math.round(rate(t.engagedSessions, t.sessions)) + '%', ptsChange(rate(t.engagedSessions, t.sessions), rate(p.engagedSessions, p.sessions))]]) : [])
    .concat(meta ? [
      ['Meta spend', money(t.metaSpend), pct(t.metaSpend, p.metaSpend)],
      [ga4 ? 'Leads Meta reports' : 'Leads', fmtNum(t.metaLeads), pct(t.metaLeads, p.metaLeads)],
      ['Cost per lead' + (ga4 ? ', Meta' : ''), t.metaLeads ? money(cpl(t), true) : 'No leads', t.metaLeads && p.metaLeads ? pct(cpl(t), cpl(p)) : '0%'],
    ].concat(ga4 ? [] : [['Clicks', fmtNum(t.metaClicks), pct(t.metaClicks, p.metaClicks)]]) : [])
    .concat(t.adCost ? [['Google Ads spend', money(t.adCost), pct(t.adCost, p.adCost)]] : [])
    .map(([label, value, note]) => ({ label, value, note: note + ' vs previous ' + n + ' days', c: tintFor(label, note) }));
}

export function chart(f, a) {
  const m = METRIC[a.metric] || METRIC.sessions, key = m[1], n = f.periodDays, H = Math.max(60, (a.h || 180) - 40);
  const cur = f.daily.slice(n), prev = f.daily.slice(0, n), mx = Math.max(1, ...f.daily.map(d => d[key] || 0)) * 1.15;
  const path = arr => arr.map((d, i) => (i ? 'L' : 'M') + Math.round((i / Math.max(1, n - 1)) * 600) + ' ' + Math.round(H - ((d[key] || 0) / mx) * (H - 10))).join(' ');
  return { caption: m[0], vb: '0 0 600 ' + H, H, line: path(cur), prevLine: path(prev), area: path(cur) + ' L600 ' + H + ' L0 ' + H + ' Z', from: fmtDay(f.start), to: fmtDay(f.end) };
}

export function breakdown(f, a, color) {
  const PAL = [color, '#0b1626', '#97a2b2', '#5b9bff', '#d3dbe6', '#45505f'];
  const src = a.dim === 'device' ? f.devices : f.channels, key = a.metric === 'leads' ? 'leads' : 'sessions';
  const rows = src.map(x => ({ label: x.name.charAt(0).toUpperCase() + x.name.slice(1), v: x[key] || 0 })).filter(x => x.v > 0), tot = rows.reduce((s, x) => s + x.v, 0) || 1, mx = Math.max(1, ...rows.map(x => x.v));
  const C = 2 * Math.PI * 40; let acc = 0;
  return { caption: (key === 'leads' ? 'Leads' : 'Sessions') + ' by ' + (a.dim === 'device' ? 'device' : 'channel'), empty: rows.length === 0, isDonut: a.style === 'donut', size: Math.max(90, Math.min((a.h || 220) - 50, 260)),
    rows: rows.map((x, i) => { const len = (x.v / tot) * C, o = { label: x.label, value: fmtNum(x.v), pct: Math.round((x.v / tot) * 100) + '%', w: Math.max(2, (x.v / mx) * 100) + '%', col: PAL[i % PAL.length], dash: Math.max(len - 1, 0.5).toFixed(2) + ' ' + C.toFixed(2), off: (-acc).toFixed(2) }; acc += len; return o; }) };
}

export function table(f, a) {
  const money = moneyIn(f);
  if (a.source === 'pages') return { caption: 'Top landing pages', cols: ['Page', 'Sessions', 'Leads'], rows: f.pages.map(x => [x.name, fmtNum(x.sessions), fmtNum(x.leads)]) };
  if (a.source === 'metaCampaigns') return { caption: 'Meta campaigns', cols: ['Campaign', 'Spend', 'Clicks', 'Leads', 'Cost per lead'], rows: (f.metaCampaigns || []).map(x => [x.name, money(x.spend), fmtNum(x.clicks), fmtNum(x.leads), x.leads ? money(x.spend / x.leads, true) : '–']) };
  if (a.source === 'campaigns') return { caption: 'Google Ads campaigns', cols: ['Campaign', 'Cost', 'Clicks'], rows: (f.campaigns || []).map(x => [x.name, money(x.cost), fmtNum(x.clicks)]) };
  return { caption: 'Where visitors came from', cols: ['Channel', 'Sessions', 'Change', 'Leads'], rows: f.channels.map(x => [x.name, fmtNum(x.sessions), pct(x.sessions, x.prevSessions), fmtNum(x.leads)]), changeCol: 2 };
}

// The charts and tables the Insert tab offers, from the tools this client has.
export function catalog(f) {
  return [['kpis', 'Key numbers', { kind: 'kpis', w: 1 }]].concat(hasGa4(f) ? [
    ['chart', 'Trend chart', { kind: 'chart', w: 1, h: 180, metric: 'sessions' }],
    ['channels', 'Channel breakdown', { kind: 'breakdown', w: 0.5, h: 220, dim: 'channel', metric: 'sessions', style: 'donut' }],
    ['devices', 'Device breakdown', { kind: 'breakdown', w: 0.5, h: 220, dim: 'device', metric: 'sessions', style: 'bars' }],
    ['tchannels', 'Channels table', { kind: 'table', w: 1, source: 'channels' }],
    ['tpages', 'Landing pages', { kind: 'table', w: 1, source: 'pages' }],
  ] : [], hasMeta(f) ? [['tmeta', 'Meta campaigns', { kind: 'table', w: 1, source: 'metaCampaigns' }]] : [],
  f.totals.adCost ? [['tcamps', 'Google Ads campaigns', { kind: 'table', w: 1, source: 'campaigns' }]] : []);
}

// Options the Layout tab shows for a chart or table.
export function options(f, a) {
  if (a.kind === 'chart') return [['metric', 'Metric', [['sessions', 'Sessions'], ['leads', 'Leads'], ['engaged', 'Engaged sessions'], ['pageViews', 'Page views']]]];
  if (a.kind === 'breakdown') return [['dim', 'Breakdown', [['channel', 'By channel'], ['device', 'By device']]], ['metric', 'Metric', [['sessions', 'Sessions'], ['leads', 'Leads']]], ['style', 'Style', [['donut', 'Donut'], ['bars', 'Bars']]]];
  if (a.kind === 'table') return [['source', 'Table', (hasGa4(f) ? [['channels', 'Channels'], ['pages', 'Landing pages']] : []).concat(hasMeta(f) ? [['metaCampaigns', 'Meta campaigns']] : [], f.totals.adCost ? [['campaigns', 'Google Ads campaigns']] : [])]];
  return [];
}
