// Reports for live agencies: list, "write a report" with Claude, and the report page (numbers + editable text + Ask Analyst).
import { generateReportAction, saveReportAction, rewritePartAction, deleteReportAction } from '@/app/actions/reports';
import { fmtDay } from '../../metrics';
import { TEMPLATES, templateBlocks } from '@/lib/report-blocks';

// New reports are titled "Weekly report · Oct 8 – Oct 14". The list shows the period on its own line, so the dates come off the title there.
const listTitle = t => t.replace(/ · [A-Z][a-z]{2} \d{1,2} – [A-Z][a-z]{2} \d{1,2}$/, '');


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
      .concat(TEMPLATES.map(t => ({ id: t.id, label: t.label, desc: t.desc + ' Analyst writes it from the numbers.', prev: prevOf(templateBlocks(t.id, PH, null)), logos: toolsOf(pick), cats: CAT[t.id] || [] })));
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
      lrNoBrand: !S.brandLogo && !S.lrBrandSkip, lrSkipBrand: () => app.setState({ lrBrandSkip: true }),
      lrSetBrand: () => app.setState({ lrModal: false, lrStep: 1, view: 'settings', stgTab: 'agency' }),
      lrBusy: busy, lrErr: S.lrErr || '', lrHasErr: !!S.lrErr };
  })();

  if (v === 'templates' || v === 'reports') {
    return { ...base, ...modal, lrList: true,
      lrRows: reports.map(r => { const c = clients.find(x => x.id === r.clientId); return { title: listTitle(r.title), period: fmtDay(r.periodStart) + ' – ' + fmtDay(r.periodEnd), client: c ? c.name : 'Removed client', status: r.status === 'sent' ? 'Sent' : 'Draft', pBg: r.status === 'sent' ? '#e3f3e8' : '#eef1f6', pC: r.status === 'sent' ? '#1d6b3a' : '#45505f',
        date: fmtDay(r.createdAt.slice(0, 10)), open: () => app.setState({ view: 'lrep', lrId: r.id, lrDraft: null, lrAsk: '', lrAskErr: null }) }; }),
      lrNoReports: reports.length === 0 };
  }

  if (v !== 'lrep') return base;
  const r = reports.find(x => x.id === S.lrId);
  if (!r && S.lrPendingId === S.lrId) return { ...base, ...writingVals, lrWriting: true, lrModal: true, lrBackdrop: () => {}, lrClose: () => {} };
  if (!r) return { ...base, lrPage: true, lrMissing: true, lrBack: () => app.setState({ view: 'templates' }) };
  const f = r.facts, client = clients.find(x => x.id === r.clientId) || { name: 'Removed client' };
  // The editor holds the document; every change lands here as an unsaved draft. Discard reloads the saved version.
  const D = S.lrDraft && S.lrDraft.id === r.id ? S.lrDraft : { id: r.id, title: r.title, content: r.content };
  const dirty = !!(S.lrDraft && S.lrDraft.id === r.id);
  const setDraft = o => app.setState(s => ({ lrDraft: { ...(s.lrDraft && s.lrDraft.id === r.id ? s.lrDraft : { id: r.id, title: r.title, content: r.content }), ...o } }));
  return { ...base, lrPage: true, lrMissing: false,
    lrBack: () => app.setState({ view: 'templates', lrDraft: null }),
    lrStatus: r.status === 'sent' ? 'Sent' : 'Draft', lrDate: 'Written ' + fmtDay(r.createdAt.slice(0, 10)),
    lrAgency: S.agName, lrLogo: S.brandLogo || '', lrPeriod: fmtDay(f.start) + ' \u2013 ' + fmtDay(f.end), lrClientName: client.name, lrColor: S.brandColor || '#1f6be2',
    lrTitle: D.title, lrSetTitle: e => setDraft({ title: e.target.value }),
    lrEditor: { docKey: r.id + ':' + (S.lrEditorKey || 0), initialDoc: r.content.doc, facts: f, color: S.brandColor || '#1f6be2', logo: S.brandLogo || '', toast,
      onChange: doc => setDraft({ content: { doc } }),
      onRewrite: ({ kind, text, doc, instruction }) => rewritePartAction({ id: r.id, kind, text, content: { doc }, instruction }) },
    lrSource: 'From Google Analytics: ' + f.properties.join(', ') + '.',
    lrDirty: dirty, lrSaving: !!S.lrSaving,
    lrSave: () => { if (!dirty) return; app.setState({ lrSaving: true }); saveReportAction({ id: r.id, title: D.title, content: D.content }).then(x => { app.setState({ lrSaving: false }); if (x.error) return toast(x.error); app.setState({ lrDraft: null }); toast('Report saved'); refresh(); }); },
    lrDiscard: () => app.setState(s => ({ lrDraft: null, lrEditorKey: (s.lrEditorKey || 0) + 1 })),
    lrPdf: () => { if (document.activeElement) document.activeElement.blur(); setTimeout(() => window.print(), 50); },
    lrDelete: () => { if (S.lrDelAsk !== r.id) { app.setState({ lrDelAsk: r.id }); clearTimeout(app.lrDT); app.lrDT = setTimeout(() => app.setState({ lrDelAsk: null }), 4000); return; }
      deleteReportAction(r.id).then(x => { if (x.error) return toast(x.error); app.setState({ view: 'templates', lrDelAsk: null, lrDraft: null }); refresh(); }); },
    lrDeleteLabel: S.lrDelAsk === r.id ? 'Click again to delete' : 'Delete',
  };
}
