// Reports for live agencies: list, "write a report" with Claude, and the report page (numbers + editable text + Ask Analyst).
import { generateReportAction, saveReportAction, reviseReportAction, deleteReportAction } from '@/app/actions/reports';
import { fmtDay, fmtNum, pct } from '../../metrics';

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
  const writingVals = { lrWriting: writing, lrWritingTitle: 'Writing ' + ((clients.find(c => c.id === (S.lrWritingFor || '')) || {}).name || 'the') + (S.lrWritingFor ? '\u2019s report' : ' report'), lrWritingMsg: MSGS[S.lrMsg || 0], lrWritingKey: String(S.lrMsg || 0) };

  // The write-a-report dialog, opened from the Reports header button.
  const modal = (() => {
    const pick = S.lrClient && withData.some(c => c.id === S.lrClient) ? S.lrClient : (S.sel != null && C[S.sel] && C[S.sel].extra && hasData(C[S.sel].extra.id) ? C[S.sel].extra.id : (withData[0] || {}).id || '');
    const days = S.lrDays || 7, busy = !!S.lrBusy, close = () => { if (!busy) app.setState({ lrModal: false, lrErr: null }); };
    return { ...writingVals, lrModal: !!S.lrModal && !writing && (v === 'templates' || v === 'reports'), lrClose: close, lrBackdrop: e => { if (e.target === e.currentTarget) close(); },
      lrCanWrite: withData.length > 0,
      lrNoDataText: clients.length ? 'None of your clients has Google Analytics numbers yet. Link a property to a client in Integrations, and their numbers arrive within a minute.' : 'Add a client and link their Google Analytics property. Then Analyst can write their report from real numbers.',
      lrGoInt: () => app.setState({ lrModal: false, view: 'settings', stgTab: 'conn' }),
      lrClients: withData.map(c => ({ id: c.id, name: c.name })), lrClient: pick, lrSetClient: e => app.setState({ lrClient: e.target.value, lrErr: null }),
      lrDaysOpts: [[7, 'Last 7 days'], [14, 'Last 14 days'], [30, 'Last 30 days']].map(([d, label]) => ({ value: String(d), label })), lrDays: String(days), lrSetDays: e => app.setState({ lrDays: Number(e.target.value), lrErr: null }),
      lrBusy: busy, lrWriteLabel: busy ? 'Writing\u2026' : 'Write report', lrErr: S.lrErr || '', lrHasErr: !!S.lrErr,
      lrWrite: e => { e.preventDefault(); if (busy || !pick) return; app.setState({ lrBusy: true, lrErr: null, lrWritingFor: pick }); startMsgs();
        generateReportAction({ clientId: pick, days }).then(r => { if (r.error) return app.setState({ lrBusy: false, lrErr: r.error }); app.setState({ lrBusy: false, lrModal: false, lrPendingId: r.id, view: 'lrep', lrId: r.id, lrDraft: null }); refresh(); },
          () => app.setState({ lrBusy: false, lrErr: 'Writing the report failed. Try again.' })); } };
  })();

  if (v === 'templates' || v === 'reports') {
    return { ...base, ...modal, lrList: true,
      lrRows: reports.map(r => { const c = clients.find(x => x.id === r.clientId); return { title: r.title, client: c ? c.name : 'Removed client', status: r.status === 'sent' ? 'Sent' : 'Draft', pBg: r.status === 'sent' ? '#e3f3e8' : '#eef1f6', pC: r.status === 'sent' ? '#1d6b3a' : '#45505f',
        date: 'Written ' + fmtDay(r.createdAt.slice(0, 10)), open: () => app.setState({ view: 'lrep', lrId: r.id, lrDraft: null, lrAsk: '', lrAskErr: null }) }; }),
      lrNoReports: reports.length === 0 };
  }

  if (v !== 'lrep') return base;
  const r = reports.find(x => x.id === S.lrId);
  if (!r && S.lrPendingId === S.lrId) return { ...base, ...writingVals, lrWriting: true };
  if (!r) return { ...base, lrPage: true, lrMissing: true, lrBack: () => app.setState({ view: 'templates' }) };
  const f = r.facts, client = clients.find(x => x.id === r.clientId) || { name: 'Removed client' };
  const D = S.lrDraft && S.lrDraft.id === r.id ? S.lrDraft : { id: r.id, title: r.title, content: r.content };
  const ct = D.content, dirty = !!(S.lrDraft && S.lrDraft.id === r.id);
  const edit = fn => app.setState(s => { const cur = s.lrDraft && s.lrDraft.id === r.id ? s.lrDraft : { id: r.id, title: r.title, content: r.content }; const next = JSON.parse(JSON.stringify(cur)); fn(next); return { lrDraft: next }; });
  const t = f.totals, p = f.prev;
  const kpis = [
    ['Leads', fmtNum(t.leads), pct(t.leads, p.leads)],
    ['Sessions', fmtNum(t.sessions), pct(t.sessions, p.sessions)],
    ['Conversion rate', rate(t.leads, t.sessions).toFixed(1) + '%', ptsChange(rate(t.leads, t.sessions), rate(p.leads, p.sessions))],
    ['Engagement rate', Math.round(rate(t.engagedSessions, t.sessions)) + '%', ptsChange(rate(t.engagedSessions, t.sessions), rate(p.engagedSessions, p.sessions))],
  ].concat(t.adCost ? [['Google Ads spend', '$' + Math.round(t.adCost).toLocaleString(), pct(t.adCost, p.adCost)]] : []);
  // Sessions per day, this period over the previous one.
  const n = f.periodDays, curD = f.daily.slice(n), prevD = f.daily.slice(0, n), mx = Math.max(1, ...f.daily.map(d => d.sessions)) * 1.15;
  const path = arr => arr.map((d, i) => (i ? 'L' : 'M') + Math.round((i / Math.max(1, n - 1)) * 600) + ' ' + Math.round(160 - (d.sessions / mx) * 150)).join(' ');
  const busy = !!S.lrAskBusy;
  return { ...base, lrPage: true, lrMissing: false,
    lrBack: () => app.setState({ view: 'templates', lrDraft: null }),
    lrStatus: r.status === 'sent' ? 'Sent' : 'Draft', lrDate: 'Written ' + fmtDay(r.createdAt.slice(0, 10)),
    lrAgency: S.agName, lrPeriod: fmtDay(f.start) + ' – ' + fmtDay(f.end), lrClientName: client.name, lrColor: S.wlColor || '#1f6be2',
    lrTitle: D.title, lrSetTitle: e => { const x = e.target.value; edit(d => { d.title = x; }); },
    lrHeadline: ct.headline, lrSetHeadline: e => { const x = e.target.value; edit(d => { d.content.headline = x; }); },
    lrSummary: ct.summary, lrSetSummary: e => { const x = e.target.value; edit(d => { d.content.summary = x; }); },
    lrSections: ct.sections.map((s, i) => ({ heading: s.heading, body: s.body, setHeading: e => { const x = e.target.value; edit(d => { d.content.sections[i].heading = x; }); }, setBody: e => { const x = e.target.value; edit(d => { d.content.sections[i].body = x; }); },
      remove: () => edit(d => { d.content.sections.splice(i, 1); }) })),
    lrAddSection: () => edit(d => { d.content.sections.push({ heading: 'New section', body: '' }); }),
    lrSteps: ct.nextSteps.map((s, i) => ({ text: s, set: e => { const x = e.target.value; edit(d => { d.content.nextSteps[i] = x; }); }, remove: () => edit(d => { d.content.nextSteps.splice(i, 1); }) })),
    lrAddStep: () => edit(d => { d.content.nextSteps.push(''); }),
    lrKpis: kpis.map(([label, value, note]) => ({ label, value, note: note + ' vs previous ' + n + ' days', c: tint(note) })),
    lrLine: path(curD), lrPrevLine: path(prevD), lrArea: path(curD) + ' L600 160 L0 160 Z', lrFrom: fmtDay(f.start), lrTo: fmtDay(f.end),
    lrChannels: f.channels.map(c => ({ name: c.name, sessions: fmtNum(c.sessions), leads: fmtNum(c.leads), change: pct(c.sessions, c.prevSessions), c: tint(pct(c.sessions, c.prevSessions)) })),
    lrHasChannels: f.channels.length > 0, lrSource: 'From Google Analytics: ' + f.properties.join(', ') + '.',
    lrDirty: dirty, lrSaving: !!S.lrSaving,
    lrSave: () => { if (!dirty) return; app.setState({ lrSaving: true }); saveReportAction({ id: r.id, title: D.title, content: D.content }).then(x => { app.setState({ lrSaving: false }); if (x.error) return toast(x.error); app.setState({ lrDraft: null }); toast('Report saved'); refresh(); }); },
    lrDiscard: () => app.setState({ lrDraft: null }),
    lrPdf: () => window.print(),
    lrDelete: () => { if (S.lrDelAsk !== r.id) { app.setState({ lrDelAsk: r.id }); clearTimeout(app.lrDT); app.lrDT = setTimeout(() => app.setState({ lrDelAsk: null }), 4000); return; }
      deleteReportAction(r.id).then(x => { if (x.error) return toast(x.error); app.setState({ view: 'templates', lrDelAsk: null, lrDraft: null }); refresh(); }); },
    lrDeleteLabel: S.lrDelAsk === r.id ? 'Click again to delete' : 'Delete',
    lrAsk: S.lrAsk || '', lrSetAsk: e => app.setState({ lrAsk: e.target.value, lrAskErr: null }), lrAskBusy: busy, lrAskLabel: busy ? 'Rewriting…' : 'Rewrite',
    lrAskErr: S.lrAskErr || '', lrHasAskErr: !!S.lrAskErr,
    lrAskIdeas: ['Make it shorter', 'Explain the drop in plain words', 'Sound more reassuring'].map(label => ({ label, use: () => app.setState({ lrAsk: label }) })),
    lrAskSend: e => { e.preventDefault(); const q = (S.lrAsk || '').trim(); if (!q || busy) return; if (dirty) return app.setState({ lrAskErr: 'Save or discard your edits first, so Analyst works on the latest version.' });
      app.setState({ lrAskBusy: true, lrAskErr: null });
      reviseReportAction({ id: r.id, instruction: q }).then(x => { if (x.error) return app.setState({ lrAskBusy: false, lrAskErr: x.error }); app.setState({ lrAskBusy: false, lrAsk: '' }); toast('Analyst rewrote the report'); refresh(); },
        () => app.setState({ lrAskBusy: false, lrAskErr: 'Rewriting failed. Try again.' })); },
  };
}
