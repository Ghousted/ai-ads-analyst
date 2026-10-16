// Reports for live agencies: list, "write a report" with Claude, and the report page (numbers + editable text + Ask Analyst).
import { generateReportAction, saveReportAction, rewritePartAction, deleteReportAction, sendReportAction, previewReportEmailAction } from '@/app/actions/reports';
import { fmtDay } from '../../metrics';
import { TEMPLATES, templateBlocks } from '@/lib/report-blocks';
import { sampleFacts, sampleWritten } from './preview';

// New reports are titled "Weekly report · Oct 8 – Oct 14". The list shows the period in its own column, so the dates come off the title there.
const listTitle = t => t.replace(/ · [A-Z][a-z]{2} \d{1,2} – [A-Z][a-z]{2} \d{1,2}$/, '');


export function liveReportsVals(app, ctx) {
  const { live, refresh, S, v, C } = ctx;
  const off = { lrList: false, lrPage: false };
  if (!live) return off;
  const clients = live.clients, reports = live.reports || [];
  const hasData = id => (live.metrics.accounts || []).some(a => a.clientId === id && a.through);
  const withData = clients.filter(c => hasData(c.id));
  const toast = t => { clearTimeout(app.lrT); app.setState({ lrToast: t }); app.lrT = setTimeout(() => app.setState({ lrToast: null }), 4000); };
  // Sending a report, from the Recent reports list or the editor: the email on the left, a live preview of what the
  // client receives on the right, a line saying exactly what will happen, then a confirmation once it's sent.
  const preview = (id, message) => { clearTimeout(app.lrPvT); app.lrPvT = setTimeout(() => previewReportEmailAction({ id, message }).then(x => {
    if (app.state.lrSend && app.state.lrSend.id === id) app.setState({ lrSendPv: x.error ? '' : x.html, lrSendPvErr: x.error || '', lrSendReady: x.configured !== false }); }, () => {}), 400); };
  const openSend = (r, title) => { const cl = clients.find(x => x.id === r.clientId) || {}, first = (cl.contactName || '').trim().split(/\s+/)[0], me = ((S.me && S.me.name) || '').trim().split(/\s+/)[0];
    const message = 'Hi ' + (first || 'there') + ',\n\nHere\u2019s your report for ' + fmtDay(r.periodStart) + ' \u2013 ' + fmtDay(r.periodEnd) + '. The highlights are below, and the full report is one click away.\n\n' + (me || S.agName);
    app.setState({ lrSend: { id: r.id, to: cl.email || '', subject: (title || r.title) + ' from ' + S.agName, message, pdf: true }, lrSendErr: null, lrSendDone: null, lrSendPv: '', lrSendPvErr: '' }); preview(r.id, message); };
  const sendVals = (() => { const sd = S.lrSend, r = sd && reports.find(x => x.id === sd.id); if (!sd || !r) return { lrSendOpen: false };
    const cl = clients.find(x => x.id === r.clientId) || { name: 'this client' }, to = sd.to.split(/[\s,;]+/).map(x => x.trim()).filter(Boolean);
    const set = o => app.setState(s => ({ lrSend: { ...s.lrSend, ...o }, lrSendErr: null }));
    const close = () => { if (!S.lrSending) app.setState({ lrSend: null, lrSendErr: null, lrSendDone: null, lrSendPv: '' }); };
    return { lrSendOpen: true, lrSendDone: !!S.lrSendDone, lrSendDoneText: S.lrSendDone || '', lrSendTitle: (r.status === 'sent' ? 'Send again to ' : 'Send to ') + cl.name,
      lrSendTo: sd.to, lrSendSubject: sd.subject, lrSendMsg: sd.message, lrSendErr: S.lrSendErr || '', lrSending: !!S.lrSending,
      lrSendPv: S.lrSendPv || '', lrSendPvLoading: !S.lrSendPv && !S.lrSendPvErr, lrSendPvErr: S.lrSendPvErr || '', lrSendNotReady: S.lrSendReady === false,
      lrSendConfirm: to.length ? 'Sends \u201c' + (r.title) + '\u201d' + (sd.pdf ? ' with the PDF attached' : '') + ' to ' + to.join(', ') + ' from ' + S.agName + '. Replies go to you.' : 'Add who it goes to.',
      lrSendPdf: !!sd.pdf, lrTogglePdf: () => set({ pdf: !sd.pdf }), lrSendingLabel: sd.pdf ? 'Making the PDF\u2026' : 'Sending\u2026',
      lrSendClose: close, lrSendBackdrop: e => { if (e.target === e.currentTarget) close(); },
      lrSetTo: e => set({ to: e.target.value }), lrSetSubject: e => set({ subject: e.target.value }), lrSetMsg: e => { set({ message: e.target.value }); preview(sd.id, e.target.value); },
      lrSendGo: e => { e.preventDefault();
        if (!to.length) return app.setState({ lrSendErr: 'Add at least one email address.' });
        if (to.length > 5) return app.setState({ lrSendErr: 'Send to 5 addresses at most.' });
        if (to.some(x => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x))) return app.setState({ lrSendErr: 'Check the email addresses. Separate several with commas.' });
        if (!sd.subject.trim()) return app.setState({ lrSendErr: 'Add a subject.' });
        app.setState({ lrSending: true, lrSendErr: null });
        sendReportAction({ id: r.id, to, subject: sd.subject, message: sd.message, attachPdf: !!sd.pdf }).then(x => { if (x.error) return app.setState({ lrSending: false, lrSendErr: x.error }); app.setState({ lrSending: false, lrSendDone: to.join(', ') }); refresh(); },
          () => app.setState({ lrSending: false, lrSendErr: 'Couldn\u2019t reach the server. Try again.' })); } };
  })();
  const base = { ...off, ...sendVals, lrModal: false, lrWriting: false, lrToast: !!S.lrToast, lrToastText: S.lrToast || '' };

  // While a report is being written, and until the refreshed list contains it, a full-screen loading state shows.
  // Only a report created in the last minute counts as pending, so deleting it later can't bring the loader back.
  const pending = !!S.lrPendingId && !reports.some(x => x.id === S.lrPendingId) && Date.now() - (S.lrPendingAt || 0) < 60000;
  const writing = !!S.lrBusy || pending;
  const MSGS = ['Reading the numbers\u2026', 'Comparing with the period before\u2026', 'Writing the summary\u2026', 'Checking every number\u2026'];
  const startMsgs = () => { clearInterval(app.lrMsgT); app.setState({ lrMsg: 0 });
    app.lrMsgT = setInterval(() => { const st = app.state, list = (app.props.live && app.props.live.reports) || [];
      if (!st.lrBusy && !(st.lrPendingId && !list.some(x => x.id === st.lrPendingId))) { clearInterval(app.lrMsgT); return; }
      app.setState({ lrMsg: Math.min((st.lrMsg || 0) + 1, MSGS.length - 1) }); }, 2600); };
  const writingVals = { lrWriting: writing, lrWritingTitle: 'Writing ' + ((clients.find(c => c.id === (S.lrWritingFor || '')) || {}).name || 'the') + (S.lrWritingFor ? '\u2019s report' : ' report'), lrWritingMsg: S.lrWritingBlank ? 'Setting up a blank report\u2026' : MSGS[S.lrMsg || 0], lrWritingKey: String(S.lrMsg || 0) };

  // The Reports page shows the template gallery above the recent reports. Picking a template opens a short dialog for
  // the client and period, then Analyst writes it (or a blank report is set up).
  const modal = (() => {
    const pick = S.lrClient && withData.some(c => c.id === S.lrClient) ? S.lrClient : (S.sel != null && C[S.sel] && C[S.sel].extra && hasData(C[S.sel].extra.id) ? C[S.sel].extra.id : (withData[0] || {}).id || '');
    const days = S.lrDays || 7, busy = !!S.lrBusy, tplId = S.lrTpl || 'blank';
    const close = () => { if (!busy) app.setState({ lrModal: false, lrErr: null }); };
    const toolsOf = id => { const t = new Set((live.metrics.accounts || []).filter(a => (id == null ? a.clientId : a.clientId === id)).map(a => a.tool)); return [...t].map(x => x === 'ga4' ? '/assets/logo-ga4.png' : '/assets/logo-meta.png'); };
    const create = tpl => { if (busy || !pick) return; app.setState({ lrBusy: true, lrErr: null, lrWritingFor: pick, lrWritingBlank: tpl === 'blank' }); if (tpl !== 'blank') startMsgs();
      generateReportAction({ clientId: pick, days, template: tpl, title: (S.lrName || '').trim() }).then(r => { if (r.error) return app.setState({ lrBusy: false, lrErr: r.error }); app.setState({ lrBusy: false, lrModal: false, lrPendingId: r.id, lrPendingAt: Date.now(), view: 'lrep', lrId: r.id, lrDraft: null }); refresh(); },
        () => app.setState({ lrBusy: false, lrErr: 'Writing the report failed. Try again.' })); };
    // Template cards: a small preview drawn from the blocks each template lays out.
    const PH = { headline: 'x', summary: 'x', sections: [{ heading: 'x', body: 'x' }], nextSteps: ['x'] };
    const prevOf = blocks => blocks.filter(b => b.t !== 'title').slice(0, 5).map(b => ({ kpis: b.t === 'kpis', line: b.t === 'chart', table: b.t === 'table', donut: b.t === 'breakdown', text: b.t === 'text' || b.t === 'list', heading: b.t === 'heading',
      tiles: [0, 1, 2, 3].map(j => ({ logo: '/assets/logo-ga4.png', c: j % 3 === 2 ? '#f6c9bb' : '#c9e8d3' })), rowsT: [{ w: '38%' }, { w: '28%' }, { w: '44%' }, { w: '32%' }] }));
    const CAT = { weekly: ['Traffic', 'Leads'], traffic: ['Traffic'], leads: ['Leads'] };
    const all = [{ id: 'blank', label: 'Blank', desc: 'An empty report. Add text, charts and tables from the client’s tools yourself.', prev: [], logos: [], cats: [] }]
      .concat(TEMPLATES.map(t => ({ id: t.id, label: t.label, desc: t.desc + ' Analyst writes it from the numbers.', prev: prevOf(templateBlocks(t.id, PH, null)), logos: toolsOf(null), cats: CAT[t.id] || [] })));
    const cat = S.lrCat || 'All templates', q = (S.lrQ || '').trim().toLowerCase();
    const shown = all.filter(t => q ? (t.label + ' ' + t.desc).toLowerCase().includes(q) : cat === 'All templates' || t.id === 'blank' || t.cats.includes(cat));
    const tpl = all.find(t => t.id === tplId) || all[0];
    return { ...writingVals, lrModal: writing || (!!S.lrModal && (v === 'templates' || v === 'reports')), lrClose: close, lrBackdrop: e => { if (e.target === e.currentTarget) close(); },
      lrCanWrite: withData.length > 0,
      lrNoDataText: clients.length ? 'None of your clients has Google Analytics or Meta numbers yet. Link a property or ad account to a client in Integrations, and their numbers arrive within a minute.' : 'Add a client and link their Google Analytics property or Meta ad account. Then Analyst can write their report from real numbers.',
      lrGoInt: () => app.setState({ lrModal: false, view: 'settings', stgTab: 'conn' }),
      lrClients: withData.map(c => ({ id: c.id, name: c.name, logos: toolsOf(c.id), on: c.id === pick, bd: c.id === pick ? '#1f6be2' : '#d3dbe6', bg: c.id === pick ? '#eef3fd' : '#ffffff', pick: () => app.setState({ lrClient: c.id, lrErr: null }) })),
      lrDaysOpts: [[7, 'Last 7 days'], [14, 'Last 14 days'], [30, 'Last 30 days']].map(([d, label]) => ({ value: String(d), label })), lrDays: String(days), lrSetDays: e => app.setState({ lrDays: Number(e.target.value), lrErr: null }),
      lrSubmit: e => { e.preventDefault(); create(tplId); }, lrTplLabel: tpl.label, lrName: S.lrName || '', lrSetName: e => app.setState({ lrName: e.target.value }), lrNamePh: (() => { const end = (live.metrics.accounts || []).filter(a => a.clientId === pick).map(a => a.through).filter(Boolean).sort().pop(); if (!end) return ''; const d = new Date(end + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() - days + 1); return (days === 30 ? 'Monthly' : days === 14 ? 'Two-week' : 'Weekly') + ' report \u00b7 ' + fmtDay(d.toISOString().slice(0, 10)) + ' \u2013 ' + fmtDay(end); })(), lrGoLabel: tplId === 'blank' ? 'Create blank report' : 'Write report',
      lrCats: ['All templates', 'Traffic', 'Leads'].map(c => ({ label: c, count: String(all.filter(t => c === 'All templates' || t.id === 'blank' || t.cats.includes(c)).length), aria: c === cat ? 'true' : undefined, bg: c === cat ? '#eef3fd' : 'transparent', fw: c === cat ? 700 : 500, pick: () => app.setState({ lrCat: c }) })),
      lrQ: S.lrQ || '', lrSetQ: e => app.setState({ lrQ: e.target.value }), lrClearQ: () => app.setState({ lrQ: '' }), lrNoMatch: !!q && shown.length === 0,
      lrTpls: shown.map(t => ({ ...t, blank: t.id === 'blank', btn: t.id === 'blank' ? 'Start blank' : 'Use template', create: () => app.setState({ lrModal: true, lrTpl: t.id, lrErr: null, lrName: '', lrPrev: null }),
        preview: t.id === 'blank' ? null : () => app.setState({ lrPrev: t.id }), previewLabel: 'Preview ' + t.label })),
      // The preview: the template laid out as a real report, filled with example numbers and words.
      ...(() => { const pt = S.lrPrev && all.find(t => t.id === S.lrPrev && t.id !== 'blank'); if (!pt) return { lrPrevOn: false };
        const end = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        return { lrPrevOn: true, lrPrevLabel: pt.label, lrPrevDesc: pt.desc, lrPrevFacts: app._pf && app._pf.end === end ? app._pf : (app._pf = sampleFacts(end)), lrPrevBlocks: app._pb && app._pbId === pt.id ? app._pb : (app._pbId = pt.id, app._pb = templateBlocks(pt.id, sampleWritten(pt.id), null)),
          lrPrevColor: S.brandColor || '#1f6be2', lrPrevLogo: S.brandLogo || '', lrPrevAgency: S.agName || '',
          lrPrevClose: () => app.setState({ lrPrev: null }), lrPrevBackdrop: e => { if (e.target === e.currentTarget) app.setState({ lrPrev: null }); },
          lrPrevUse: () => app.setState({ lrPrev: null, lrModal: true, lrTpl: pt.id, lrErr: null, lrName: '' }) }; })(),
      lrNoBrand: !S.brandLogo && !S.lrBrandSkip, lrSkipBrand: () => app.setState({ lrBrandSkip: true }),
      lrSetBrand: () => app.setState({ lrModal: false, view: 'settings', stgTab: 'agency' }),
      lrBusy: busy, lrErr: S.lrErr || '', lrHasErr: !!S.lrErr };
  })();

  if (v === 'templates' || v === 'reports') {
    return { ...base, ...modal, lrList: true,
      lrRows: reports.map(r => { const c = clients.find(x => x.id === r.clientId); return { title: listTitle(r.title), period: fmtDay(r.periodStart) + ' – ' + fmtDay(r.periodEnd), client: c ? c.name : 'Removed client', status: r.viewCount ? 'Viewed' : r.status === 'sent' ? 'Sent' : 'Draft', pBg: r.viewCount ? '#e3f3e8' : r.status === 'sent' ? '#eef3fd' : '#eef1f6', pC: r.viewCount ? '#1d6b3a' : r.status === 'sent' ? '#1f5bc4' : '#45505f',
        date: fmtDay(r.createdAt.slice(0, 10)), open: () => app.setState({ view: 'lrep', lrId: r.id, lrDraft: null, lrAsk: '', lrAskErr: null }),
          sendLabel: r.status === 'sent' ? 'Send again' : 'Send', sendAria: (r.status === 'sent' ? 'Send again: ' : 'Send: ') + r.title + (c ? ' to ' + c.name : ''), send: e => { e.stopPropagation(); openSend(r); } }; }),
      lrNoReports: reports.length === 0 };
  }

  if (v !== 'lrep') return base;
  const r = reports.find(x => x.id === S.lrId);
  if (!r && pending && S.lrPendingId === S.lrId) return { ...base, ...writingVals, lrWriting: true, lrModal: true, lrBackdrop: () => {}, lrClose: () => {} };
  if (!r) return { ...base, lrPage: true, lrMissing: true, lrBack: () => app.setState({ view: 'templates' }) };
  const f = r.facts, client = clients.find(x => x.id === r.clientId) || { name: 'Removed client' };
  // The editor holds the document; every change lands here as an unsaved draft. Discard reloads the saved version.
  const D = S.lrDraft && S.lrDraft.id === r.id ? S.lrDraft : { id: r.id, title: r.title, content: r.content };
  const dirty = !!(S.lrDraft && S.lrDraft.id === r.id);
  // Saving resolves true when it worked, so leaving the page or sending can wait for it.
  const save = () => { app.setState({ lrSaving: true }); return saveReportAction({ id: r.id, title: D.title, content: D.content }).then(x => { app.setState({ lrSaving: false }); if (x.error) { toast(x.error); return false; } app.setState({ lrDraft: null }); toast('Report saved'); refresh(); return true; }); };
  app._lrSave = save;
  const setDraft = o => app.setState(s => ({ lrDraft: { ...(s.lrDraft && s.lrDraft.id === r.id ? s.lrDraft : { id: r.id, title: r.title, content: r.content }), ...o } }));
  return { ...base, lrPage: true, lrMissing: false,
    lrBack: () => app.leaveGuard(() => app.setState({ view: 'templates', lrDraft: null })),
    lrStatus: r.status === 'sent' ? 'Sent' : 'Draft', lrDate: 'Written ' + fmtDay(r.createdAt.slice(0, 10)),
    lrAgency: S.agName, lrLogo: S.brandLogo || '', lrPeriod: fmtDay(f.start) + ' \u2013 ' + fmtDay(f.end), lrClientName: client.name, lrColor: S.brandColor || '#1f6be2',
    lrTitle: D.title, lrSetTitle: e => setDraft({ title: e.target.value }),
    lrEditor: { docKey: r.id + ':' + (S.lrEditorKey || 0), initialDoc: r.content.doc, facts: f, color: S.brandColor || '#1f6be2', logo: S.brandLogo || '', toast,
      onChange: doc => setDraft({ content: { doc } }),
      onRewrite: ({ kind, text, doc, instruction }) => rewritePartAction({ id: r.id, kind, text, content: { doc }, instruction }) },
    lrSource: 'From Google Analytics: ' + f.properties.join(', ') + '.',
    lrDirty: dirty, lrSaving: !!S.lrSaving,
    lrSave: () => { if (dirty) save(); },
    // The editor's send button: unsaved edits are saved first, because the saved report is what goes out.
    lrSendLabel: r.status === 'sent' ? 'Send again' : 'Send to client',
    lrSentNote: r.status === 'sent' && r.sentAt ? 'Sent ' + fmtDay(r.sentAt.slice(0, 10)) + (r.sentTo ? ' to ' + r.sentTo : '') + ' \u00b7 ' + (r.viewCount ? 'Viewed ' + (r.viewCount === 1 ? 'once' : r.viewCount + ' times') + ', last ' + fmtDay(r.lastViewedAt.slice(0, 10)) : 'Not viewed yet') : '',
    lrClientLink: r.shareToken ? '/r/' + r.shareToken + '?preview=1' : '',
    lrSend: () => { if (S.lrSaving) return; if (dirty) save().then(ok => ok && openSend(r, D.title)); else openSend(r, D.title); },
    lrDiscard: () => app.confirm({ title: 'Discard your edits?', body: 'The report goes back to how it was last saved. Your changes since then are lost.', confirm: 'Discard edits', tone: 'danger', cancel: 'Keep editing',
      onConfirm: () => app.setState(s => ({ lrDraft: null, lrEditorKey: (s.lrEditorKey || 0) + 1 })) }),
    // Download PDF: the saved report, printed on the server the way the client sees it. Unsaved edits are saved first.
    lrPdfBusy: !!S.lrPdfBusy, lrPdfLabel: S.lrPdfBusy ? 'Preparing PDF\u2026' : 'Download PDF',
    lrPdf: () => { if (S.lrPdfBusy || S.lrSaving) return; const go = () => { app.setState({ lrPdfBusy: true });
      fetch('/api/reports/' + r.id + '/pdf').then(async res => { if (!res.ok) throw new Error(await res.text()); const b = await res.blob(), name = decodeURIComponent((res.headers.get('Content-Disposition') || '').split("''")[1] || 'report.pdf');
        const url = URL.createObjectURL(b), a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); app.setState({ lrPdfBusy: false }); })
        .catch(e => { app.setState({ lrPdfBusy: false }); toast(e.message || 'The PDF couldn\u2019t be made. Try again.'); }); };
      if (dirty) save().then(ok => ok && go()); else go(); },
    lrDelete: () => app.confirm({ title: 'Delete this report?', body: '\u201c' + D.title + '\u201d for ' + client.name + ' is deleted for good. This can\u2019t be undone.', confirm: 'Delete report', busy: 'Deleting\u2026', tone: 'danger',
      onConfirm: () => deleteReportAction(r.id).then(x => { if (x.error) { toast(x.error); return false; } app.setState({ view: 'templates', lrDraft: null, lrPendingId: null }); refresh(); return true; }) }),
    lrDeleteLabel: 'Delete',
  };
}
