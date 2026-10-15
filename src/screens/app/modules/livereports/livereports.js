// Reports for live agencies: list, "write a report" with Claude, and the report page (numbers + editable text + Ask Analyst).
import { generateReportAction, saveReportAction, rewritePartAction, deleteReportAction } from '@/app/actions/reports';
import { fmtDay, fmtNum, pct } from '../../metrics';
import { TEMPLATES, WIDTHS, layoutTemplate, newId, setPart } from '@/lib/report-blocks';

const rate = (a, b) => (b ? (a / b) * 100 : 0);
const ptsChange = (a, b) => { const d = Math.round((a - b) * 10) / 10; return (d > 0 ? '+' : d < 0 ? '−' : '') + Math.abs(d) + ' pts'; };
const tint = note => (note.startsWith('+') ? '#1d6b3a' : note.startsWith('−') ? '#a3330c' : '#5a6474');

export function liveReportsVals(app, ctx) {
  const { live, refresh, S, v, C } = ctx;
  const off = { lrList: false, lrPage: false };
  if (!live) return off;
  const clients = live.clients, reports = live.reports || [];
  const hasData = id => (live.metrics.accounts || []).some(a => a.clientId === id && a.through);
  const withData = clients.filter(c => hasData(c.id));
  const toast = t => { clearTimeout(app.lrT); app.setState({ lrToast: t }); app.lrT = setTimeout(() => app.setState({ lrToast: null }), 4000); };
  const base = { ...off, lrModal: false, lrWriting: false, lrToast: !!S.lrToast, lrToastText: S.lrToast || '' };

  // While a report is being written, and until the refreshed list contains it, a full-screen loading state shows.
  const pending = !!S.lrPendingId && !reports.some(x => x.id === S.lrPendingId);
  const writing = !!S.lrBusy || pending;
  const MSGS = ['Reading the numbers\u2026', 'Comparing with the period before\u2026', 'Writing the summary\u2026', 'Checking every number\u2026'];
  const startMsgs = () => { clearInterval(app.lrMsgT); app.setState({ lrMsg: 0 });
    app.lrMsgT = setInterval(() => { const st = app.state, list = (app.props.live && app.props.live.reports) || [];
      if (!st.lrBusy && !(st.lrPendingId && !list.some(x => x.id === st.lrPendingId))) { clearInterval(app.lrMsgT); return; }
      app.setState({ lrMsg: Math.min((st.lrMsg || 0) + 1, MSGS.length - 1) }); }, 2600); };
  const writingVals = { lrWriting: writing, lrWritingTitle: 'Writing ' + ((clients.find(c => c.id === (S.lrWritingFor || '')) || {}).name || 'the') + (S.lrWritingFor ? '\u2019s report' : ' report'), lrWritingMsg: S.lrWritingBlank ? 'Setting up a blank report\u2026' : MSGS[S.lrMsg || 0], lrWritingKey: String(S.lrMsg || 0) };

  // The new-report wizard, opened from the Reports header button: 1. client and period, 2. template (the design's gallery).
  const modal = (() => {
    const pick = S.lrClient && withData.some(c => c.id === S.lrClient) ? S.lrClient : (S.sel != null && C[S.sel] && C[S.sel].extra && hasData(C[S.sel].extra.id) ? C[S.sel].extra.id : (withData[0] || {}).id || '');
    const days = S.lrDays || 7, step = S.lrStep || 1, busy = !!S.lrBusy;
    const close = () => { if (!busy) app.setState({ lrModal: false, lrErr: null, lrStep: 1, lrQ: '', lrCat: null }); };
    const toolsOf = id => { const t = new Set((live.metrics.accounts || []).filter(a => a.clientId === id).map(a => a.tool)); return [...t].map(x => x === 'ga4' ? '/assets/logo-ga4.png' : '/assets/logo-meta.png'); };
    const create = tpl => { if (busy || !pick) return; app.setState({ lrBusy: true, lrErr: null, lrWritingFor: pick, lrWritingBlank: tpl === 'blank' }); if (tpl !== 'blank') startMsgs();
      generateReportAction({ clientId: pick, days, template: tpl }).then(r => { if (r.error) return app.setState({ lrBusy: false, lrErr: r.error }); app.setState({ lrBusy: false, lrModal: false, lrStep: 1, lrQ: '', lrCat: null, lrPendingId: r.id, view: 'lrep', lrId: r.id, lrDraft: null }); refresh(); },
        () => app.setState({ lrBusy: false, lrErr: 'Writing the report failed. Try again.' })); };
    // Template cards: a small preview drawn from the blocks each template lays out.
    const PH = { headline: 'x', summary: 'x', sections: [{ heading: 'x', body: 'x' }], nextSteps: ['x'] };
    const prevOf = blocks => blocks.filter(b => b.t !== 'title').slice(0, 5).map(b => ({ kpis: b.t === 'kpis', line: b.t === 'chart', table: b.t === 'table', donut: b.t === 'breakdown', text: b.t === 'text' || b.t === 'list', heading: b.t === 'heading',
      tiles: [0, 1, 2, 3].map(j => ({ logo: '/assets/logo-ga4.png', c: j % 3 === 2 ? '#f6c9bb' : '#c9e8d3' })), rowsT: [{ w: '38%' }, { w: '28%' }, { w: '44%' }, { w: '32%' }] }));
    const CAT = { weekly: ['Traffic', 'Leads'], traffic: ['Traffic'], leads: ['Leads'] };
    const all = [{ id: 'blank', label: 'Blank', desc: 'An empty report. Add text, charts and tables from the client’s tools yourself.', prev: [], logos: [], cats: [] }]
      .concat(TEMPLATES.map(t => ({ id: t.id, label: t.label, desc: t.desc + ' Analyst writes it from the numbers.', prev: prevOf(layoutTemplate(t.id, PH, null).blocks), logos: toolsOf(pick), cats: CAT[t.id] || [] })));
    const cat = S.lrCat || 'All templates', q = (S.lrQ || '').trim().toLowerCase();
    const shown = all.filter(t => q ? (t.label + ' ' + t.desc).toLowerCase().includes(q) : cat === 'All templates' || t.id === 'blank' || t.cats.includes(cat));
    const clientName = (clients.find(c => c.id === pick) || {}).name || '';
    return { ...writingVals, lrModal: writing || (!!S.lrModal && (v === 'templates' || v === 'reports')), lrClose: close, lrBackdrop: e => { if (e.target === e.currentTarget) close(); },
      lrStep1: step === 1, lrStep2: step === 2, lrStepLabel: 'Step ' + step + ' of 2', lrBar2: step === 2 ? '#1f6be2' : '#e6ebf2', lrW: step === 2 && !writing ? '920px' : '560px', lrH: step === 2 && !writing ? '760px' : 'auto',
      lrCanWrite: withData.length > 0,
      lrNoDataText: clients.length ? 'None of your clients has Google Analytics numbers yet. Link a property to a client in Integrations, and their numbers arrive within a minute.' : 'Add a client and link their Google Analytics property. Then Analyst can write their report from real numbers.',
      lrGoInt: () => app.setState({ lrModal: false, view: 'settings', stgTab: 'conn' }),
      lrClients: withData.map(c => ({ id: c.id, name: c.name, logos: toolsOf(c.id), on: c.id === pick, bd: c.id === pick ? '#1f6be2' : '#d3dbe6', bg: c.id === pick ? '#eef3fd' : '#ffffff', pick: () => app.setState({ lrClient: c.id, lrErr: null }) })),
      lrDaysOpts: [[7, 'Last 7 days'], [14, 'Last 14 days'], [30, 'Last 30 days']].map(([d, label]) => ({ value: String(d), label })), lrDays: String(days), lrSetDays: e => app.setState({ lrDays: Number(e.target.value), lrErr: null }),
      lrNext: e => { e.preventDefault(); if (pick) app.setState({ lrStep: 2, lrErr: null }); }, lrBackStep: () => app.setState({ lrStep: 1, lrErr: null }),
      lrClientName: clientName,
      lrCats: ['All templates', 'Traffic', 'Leads'].map(c => ({ label: c, count: String(all.filter(t => c === 'All templates' || t.id === 'blank' || t.cats.includes(c)).length), aria: c === cat ? 'true' : undefined, bg: c === cat ? '#eef3fd' : 'transparent', fw: c === cat ? 700 : 500, pick: () => app.setState({ lrCat: c }) })),
      lrQ: S.lrQ || '', lrSetQ: e => app.setState({ lrQ: e.target.value }), lrClearQ: () => app.setState({ lrQ: '' }), lrNoMatch: !!q && shown.length === 0,
      lrTpls: shown.map(t => ({ ...t, blank: t.id === 'blank', btn: t.id === 'blank' ? 'Start blank' : 'Use template', create: () => create(t.id) })),
      lrBusy: busy, lrErr: S.lrErr || '', lrHasErr: !!S.lrErr };
  })();

  if (v === 'templates' || v === 'reports') {
    return { ...base, ...modal, lrList: true,
      lrRows: reports.map(r => { const c = clients.find(x => x.id === r.clientId); return { title: r.title, client: c ? c.name : 'Removed client', status: r.status === 'sent' ? 'Sent' : 'Draft', pBg: r.status === 'sent' ? '#e3f3e8' : '#eef1f6', pC: r.status === 'sent' ? '#1d6b3a' : '#45505f',
        date: 'Written ' + fmtDay(r.createdAt.slice(0, 10)), open: () => app.setState({ view: 'lrep', lrId: r.id, lrDraft: null, lrAsk: '', lrAskErr: null }) }; }),
      lrNoReports: reports.length === 0 };
  }

  if (v !== 'lrep') return base;
  const r = reports.find(x => x.id === S.lrId);
  if (!r && S.lrPendingId === S.lrId) return { ...base, ...writingVals, lrWriting: true, lrModal: true, lrBackdrop: () => {}, lrClose: () => {} };
  if (!r) return { ...base, lrPage: true, lrMissing: true, lrBack: () => app.setState({ view: 'templates' }) };
  const f = r.facts, client = clients.find(x => x.id === r.clientId) || { name: 'Removed client' };
  const D = S.lrDraft && S.lrDraft.id === r.id ? S.lrDraft : { id: r.id, title: r.title, content: r.content };
  const blocks = D.content.blocks, dirty = !!(S.lrDraft && S.lrDraft.id === r.id);
  const edit = fn => app.setState(s => { const cur = s.lrDraft && s.lrDraft.id === r.id ? s.lrDraft : { id: r.id, title: r.title, content: r.content }; const next = JSON.parse(JSON.stringify(cur)); fn(next); return { lrDraft: next }; });
  const t = f.totals, p = f.prev, n = f.periodDays, color = S.wlColor || '#1f6be2', busy = !!S.lrAskBusy;
  const PAL = [color, '#0b1626', '#97a2b2', '#5b9bff', '#d3dbe6', '#45505f'];

  // Ask Analyst on one part: clicking a part shows the Analyst button beside it; pressing it opens a small ask box.
  const part = path => { const open = S.lrPart === path, closeAsk = () => app.setState({ lrPart: null, lrAsk: '', lrAskErr: null });
    const send = text => { const q = (text || '').trim(); if (!q || busy) return; app.setState({ lrAskBusy: true, lrAskErr: null });
      rewritePartAction({ id: r.id, path, instruction: q, content: D.content }).then(x => { if (x.error) return app.setState({ lrAskBusy: false, lrAskErr: x.error });
        edit(d => setPart(d.content, path, x.text)); app.setState({ lrAskBusy: false, lrPart: null, lrAsk: '' }); toast('Analyst rewrote this part. Save to keep it.'); },
        () => app.setState({ lrAskBusy: false, lrAskErr: 'Rewriting failed. Try again.' })); };
    return { active: S.lrFocus === path || open, open, focus: () => { if (S.lrFocus !== path) app.setState({ lrFocus: path }); },
      openAsk: () => app.setState({ lrPart: open ? null : path, lrAsk: '', lrAskErr: null }), close: closeAsk,
      ask: open ? S.lrAsk || '' : '', setAsk: e => app.setState({ lrAsk: e.target.value, lrAskErr: null }), busy: open && busy, err: open ? S.lrAskErr || '' : '',
      ideas: ['Make it shorter', 'Use simpler words', 'Sound more reassuring'].map(label => ({ label, use: () => send(label) })),
      submit: e => { e.preventDefault(); send(S.lrAsk); } }; };

  // What each block shows, from the report's saved numbers.
  const METRIC = { sessions: ['Sessions per day', 'sessions'], leads: ['Leads per day', 'leads'], engaged: ['Engaged sessions per day', 'engaged'], pageViews: ['Page views per day', 'pageViews'] };
  const kpis = [
    ['Leads', fmtNum(t.leads), pct(t.leads, p.leads)],
    ['Sessions', fmtNum(t.sessions), pct(t.sessions, p.sessions)],
    ['Conversion rate', rate(t.leads, t.sessions).toFixed(1) + '%', ptsChange(rate(t.leads, t.sessions), rate(p.leads, p.sessions))],
    ['Engagement rate', Math.round(rate(t.engagedSessions, t.sessions)) + '%', ptsChange(rate(t.engagedSessions, t.sessions), rate(p.engagedSessions, p.sessions))],
  ].concat(t.adCost ? [['Google Ads spend', '$' + Math.round(t.adCost).toLocaleString(), pct(t.adCost, p.adCost)]] : []).map(([label, value, note]) => ({ label, value, note: note + ' vs previous ' + n + ' days', c: tint(note) }));
  const chart = b => { const key = METRIC[b.metric][1], H = b.h - 40, cur = f.daily.slice(n), prev = f.daily.slice(0, n), mx = Math.max(1, ...f.daily.map(d => d[key] || 0)) * 1.15;
    const path = arr => arr.map((d, i) => (i ? 'L' : 'M') + Math.round((i / Math.max(1, n - 1)) * 600) + ' ' + Math.round(H - ((d[key] || 0) / mx) * (H - 10))).join(' ');
    return { caption: METRIC[b.metric][0], vb: '0 0 600 ' + H, H, line: path(cur), prevLine: path(prev), area: path(cur) + ' L600 ' + H + ' L0 ' + H + ' Z', from: fmtDay(f.start), to: fmtDay(f.end) }; };
  const breakdown = b => { const src = b.dim === 'channel' ? f.channels : f.devices, key = b.metric === 'leads' ? 'leads' : 'sessions';
    const rows = src.map(x => ({ label: x.name.charAt(0).toUpperCase() + x.name.slice(1), v: x[key] || 0 })).filter(x => x.v > 0), tot = rows.reduce((a, x) => a + x.v, 0) || 1, mx = Math.max(1, ...rows.map(x => x.v));
    const C = 2 * Math.PI * 40; let acc = 0;
    return { caption: (b.metric === 'leads' ? 'Leads' : 'Sessions') + ' by ' + b.dim, empty: rows.length === 0, isBars: b.style === 'bars', isDonut: b.style === 'donut', size: Math.max(90, Math.min(b.h - 50, 260)),
      rows: rows.map((x, i) => { const len = (x.v / tot) * C, o = { label: x.label, value: fmtNum(x.v), pct: Math.round((x.v / tot) * 100) + '%', w: Math.max(2, (x.v / mx) * 100) + '%', col: PAL[i % PAL.length], dash: Math.max(len - 1, 0.5).toFixed(2) + ' ' + C.toFixed(2), off: (-acc).toFixed(2) }; acc += len; return o; }) }; };
  const table = b => b.source === 'pages' ? { caption: 'Top landing pages', cols: ['Page', 'Sessions', 'Leads'], rows: f.pages.map(x => [x.name, fmtNum(x.sessions), fmtNum(x.leads)]) }
    : b.source === 'campaigns' ? { caption: 'Google Ads campaigns', cols: ['Campaign', 'Cost', 'Clicks'], rows: (f.campaigns || []).map(x => [x.name, '$' + Math.round(x.cost).toLocaleString(), fmtNum(x.clicks)]) }
    : { caption: 'Where visitors came from', cols: ['Channel', 'Sessions', 'Change', 'Leads'], rows: f.channels.map(x => [x.name, fmtNum(x.sessions), pct(x.sessions, x.prevSessions), fmtNum(x.leads)]), changeCol: 2 };

  const sel = blocks.find(b => b.id === S.lrSel) ? S.lrSel : null;
  const setB = (id, o) => edit(d => { const i = d.content.blocks.findIndex(b => b.id === id); if (i >= 0) Object.assign(d.content.blocks[i], o); });
  const move = (id, by) => edit(d => { const L = d.content.blocks, i = L.findIndex(b => b.id === id), j = i + by; if (i < 0 || j < 0 || j >= L.length) return; [L[i], L[j]] = [L[j], L[i]]; });
  const VIS = ['kpis', 'chart', 'breakdown', 'table'];
  const opt = (label, value, opts, key, id) => ({ label, value, opts, set: e => setB(id, { [key]: e.target.value }) });
  const lrBlocks = blocks.map((b, i) => {
    const o = { id: b.id, t: b.t, i, sel: sel === b.id, select: () => { if (sel !== b.id) app.setState({ lrSel: b.id }); },
      up: () => move(b.id, -1), down: () => move(b.id, 1), canUp: i > 0, canDown: i < blocks.length - 1,
      remove: () => { edit(d => { d.content.blocks = d.content.blocks.filter(x => x.id !== b.id); }); app.setState({ lrSel: null }); },
      visual: VIS.includes(b.t), w: b.w || 1, h: b.h || 0, hasH: b.t === 'chart' || b.t === 'breakdown', resize: (w, h) => setB(b.id, h ? { w, h } : { w }),
      isTitle: b.t === 'title', isHeading: b.t === 'heading', isText: b.t === 'text', isList: b.t === 'list', isKpis: b.t === 'kpis', isChart: b.t === 'chart', isBreakdown: b.t === 'breakdown', isTable: b.t === 'table', opts: [] };
    if ('text' in b) Object.assign(o, { text: b.text, set: e => { const x = e.target.value; setB(b.id, { text: x }); }, p: part('blocks.' + i) });
    if (b.t === 'list') Object.assign(o, { items: b.items.map((x, j) => ({ text: x, p: part('blocks.' + i + '.items.' + j), set: e => { const v2 = e.target.value; edit(d => { d.content.blocks[i].items[j] = v2; }); }, remove: () => edit(d => { d.content.blocks[i].items.splice(j, 1); }) })),
      addItem: () => edit(d => { d.content.blocks[i].items.push(''); }) });
    if (b.t === 'kpis') o.tiles = kpis;
    if (b.t === 'chart') { o.chart = chart(b); o.opts = [opt('Metric', b.metric, [['sessions', 'Sessions'], ['leads', 'Leads'], ['engaged', 'Engaged sessions'], ['pageViews', 'Page views']], 'metric', b.id)]; }
    if (b.t === 'breakdown') { o.bd = breakdown(b); o.opts = [opt('Breakdown', b.dim, [['channel', 'By channel'], ['device', 'By device']], 'dim', b.id), opt('Metric', b.metric, [['sessions', 'Sessions'], ['leads', 'Leads']], 'metric', b.id), opt('Style', b.style, [['donut', 'Donut'], ['bars', 'Bars']], 'style', b.id)]; }
    if (b.t === 'table') { o.tb = table(b); o.opts = [opt('Table', b.source, [['channels', 'Channels'], ['pages', 'Landing pages']].concat(t.adCost ? [['campaigns', 'Google Ads campaigns']] : []), 'source', b.id)]; }
    if (o.visual) o.opts.unshift({ label: 'Width', value: String(WIDTHS.reduce((a, x) => (Math.abs(x - o.w) < Math.abs(a - o.w) ? x : a), 1)), opts: [[String(1 / 3), 'One third'], [String(1 / 2), 'Half'], [String(2 / 3), 'Two thirds'], ['1', 'Full width']], set: e => setB(b.id, { w: Number(e.target.value) }) });
    return o;
  });

  // Insert: text blocks, plus charts and tables from the tools this client has. Meta blocks join when Meta is connected.
  const mk = { heading: () => ({ t: 'heading', text: 'New section' }), text: () => ({ t: 'text', text: '' }), list: () => ({ t: 'list', items: [''] }),
    kpis: () => ({ t: 'kpis', w: 1 }), chart: () => ({ t: 'chart', w: 1, h: 180, metric: 'sessions' }),
    channels: () => ({ t: 'breakdown', w: 1 / 2, h: 220, dim: 'channel', metric: 'sessions', style: 'donut' }), devices: () => ({ t: 'breakdown', w: 1 / 2, h: 220, dim: 'device', metric: 'sessions', style: 'bars' }),
    tchannels: () => ({ t: 'table', w: 1, source: 'channels' }), tpages: () => ({ t: 'table', w: 1, source: 'pages' }), tcamps: () => ({ t: 'table', w: 1, source: 'campaigns' }) };
  const insert = k => { const blk = { id: newId(), ...mk[k]() }; edit(d => { const i = sel ? d.content.blocks.findIndex(x => x.id === sel) : -1; d.content.blocks.splice(i >= 0 ? i + 1 : d.content.blocks.length, 0, blk); }); app.setState({ lrSel: blk.id }); };
  const lrInsert = [
    { label: 'Text', items: [['heading', 'Heading'], ['text', 'Paragraph'], ['list', 'List']] },
    { label: 'Google Analytics 4', logo: '/assets/logo-ga4.png', items: [['kpis', 'Key numbers'], ['chart', 'Trend chart'], ['channels', 'Channel breakdown'], ['devices', 'Device breakdown'], ['tchannels', 'Channels table'], ['tpages', 'Landing pages table']].concat(t.adCost ? [['tcamps', 'Google Ads campaigns']] : []) },
  ].map(g => ({ ...g, hasLogo: !!g.logo, items: g.items.map(([k, label]) => ({ label, add: () => insert(k) })) }));

  return { ...base, lrPage: true, lrMissing: false,
    lrBack: () => app.setState({ view: 'templates', lrDraft: null, lrSel: null }),
    lrStatus: r.status === 'sent' ? 'Sent' : 'Draft', lrDate: 'Written ' + fmtDay(r.createdAt.slice(0, 10)),
    lrAgency: S.agName, lrPeriod: fmtDay(f.start) + ' – ' + fmtDay(f.end), lrClientName: client.name, lrColor: color,
    lrTitle: D.title, lrSetTitle: e => { const x = e.target.value; edit(d => { d.title = x; }); },
    lrBlocks, lrNoBlocks: blocks.length === 0, lrInsert, lrInsertHint: sel ? 'Adds below the selected block' : 'Adds at the end. Click a block to add below it.',
    lrDeselect: e => { if (e.target === e.currentTarget && sel) app.setState({ lrSel: null }); },
    lrSource: 'From Google Analytics: ' + f.properties.join(', ') + '.',
    lrDirty: dirty, lrSaving: !!S.lrSaving,
    lrSave: () => { if (!dirty) return; app.setState({ lrSaving: true }); saveReportAction({ id: r.id, title: D.title, content: D.content }).then(x => { app.setState({ lrSaving: false }); if (x.error) return toast(x.error); app.setState({ lrDraft: null }); toast('Report saved'); refresh(); }); },
    lrDiscard: () => app.setState({ lrDraft: null, lrSel: null }),
    lrPdf: () => { app.setState({ lrSel: null, lrFocus: null, lrPart: null }); setTimeout(() => window.print(), 50); },
    lrDelete: () => { if (S.lrDelAsk !== r.id) { app.setState({ lrDelAsk: r.id }); clearTimeout(app.lrDT); app.lrDT = setTimeout(() => app.setState({ lrDelAsk: null }), 4000); return; }
      deleteReportAction(r.id).then(x => { if (x.error) return toast(x.error); app.setState({ view: 'templates', lrDelAsk: null, lrDraft: null }); refresh(); }); },
    lrDeleteLabel: S.lrDelAsk === r.id ? 'Click again to delete' : 'Delete',
  };
}
