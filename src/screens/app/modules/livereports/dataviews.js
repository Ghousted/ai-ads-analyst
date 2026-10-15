// What a chart or table in a report shows, from the report's saved numbers (facts).
import { fmtDay, fmtNum, pct } from '../../metrics';

const rate = (a, b) => (b ? (a / b) * 100 : 0);
const ptsChange = (a, b) => { const d = Math.round((a - b) * 10) / 10; return (d > 0 ? '+' : d < 0 ? '−' : '') + Math.abs(d) + ' pts'; };
export const tint = note => (String(note).startsWith('+') ? '#1d6b3a' : String(note).startsWith('−') ? '#a3330c' : '#5a6474');
const METRIC = { sessions: ['Sessions per day', 'sessions'], leads: ['Leads per day', 'leads'], engaged: ['Engaged sessions per day', 'engaged'], pageViews: ['Page views per day', 'pageViews'] };

export function kpis(f) {
  const t = f.totals, p = f.prev, n = f.periodDays;
  return [
    ['Leads', fmtNum(t.leads), pct(t.leads, p.leads)],
    ['Sessions', fmtNum(t.sessions), pct(t.sessions, p.sessions)],
    ['Conversion rate', rate(t.leads, t.sessions).toFixed(1) + '%', ptsChange(rate(t.leads, t.sessions), rate(p.leads, p.sessions))],
    ['Engagement rate', Math.round(rate(t.engagedSessions, t.sessions)) + '%', ptsChange(rate(t.engagedSessions, t.sessions), rate(p.engagedSessions, p.sessions))],
  ].concat(t.adCost ? [['Google Ads spend', '$' + Math.round(t.adCost).toLocaleString(), pct(t.adCost, p.adCost)]] : [])
    .map(([label, value, note]) => ({ label, value, note: note + ' vs previous ' + n + ' days', c: tint(note) }));
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
  if (a.source === 'pages') return { caption: 'Top landing pages', cols: ['Page', 'Sessions', 'Leads'], rows: f.pages.map(x => [x.name, fmtNum(x.sessions), fmtNum(x.leads)]) };
  if (a.source === 'campaigns') return { caption: 'Google Ads campaigns', cols: ['Campaign', 'Cost', 'Clicks'], rows: (f.campaigns || []).map(x => [x.name, '$' + Math.round(x.cost).toLocaleString(), fmtNum(x.clicks)]) };
  return { caption: 'Where visitors came from', cols: ['Channel', 'Sessions', 'Change', 'Leads'], rows: f.channels.map(x => [x.name, fmtNum(x.sessions), pct(x.sessions, x.prevSessions), fmtNum(x.leads)]), changeCol: 2 };
}

// The charts and tables the Insert tab offers, from the tools this client has. Meta joins when Meta is connected.
export function catalog(f) {
  return [
    ['kpis', 'Key numbers', { kind: 'kpis', w: 1 }],
    ['chart', 'Trend chart', { kind: 'chart', w: 1, h: 180, metric: 'sessions' }],
    ['channels', 'Channel breakdown', { kind: 'breakdown', w: 0.5, h: 220, dim: 'channel', metric: 'sessions', style: 'donut' }],
    ['devices', 'Device breakdown', { kind: 'breakdown', w: 0.5, h: 220, dim: 'device', metric: 'sessions', style: 'bars' }],
    ['tchannels', 'Channels table', { kind: 'table', w: 1, source: 'channels' }],
    ['tpages', 'Landing pages', { kind: 'table', w: 1, source: 'pages' }],
  ].concat(f.totals.adCost ? [['tcamps', 'Ads campaigns', { kind: 'table', w: 1, source: 'campaigns' }]] : []);
}

// Options the Layout tab shows for a chart or table.
export function options(f, a) {
  if (a.kind === 'chart') return [['metric', 'Metric', [['sessions', 'Sessions'], ['leads', 'Leads'], ['engaged', 'Engaged sessions'], ['pageViews', 'Page views']]]];
  if (a.kind === 'breakdown') return [['dim', 'Breakdown', [['channel', 'By channel'], ['device', 'By device']]], ['metric', 'Metric', [['sessions', 'Sessions'], ['leads', 'Leads']]], ['style', 'Style', [['donut', 'Donut'], ['bars', 'Bars']]]];
  if (a.kind === 'table') return [['source', 'Table', [['channels', 'Channels'], ['pages', 'Landing pages']].concat(f.totals.adCost ? [['campaigns', 'Google Ads campaigns']] : [])]];
  return [];
}
