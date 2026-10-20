// Clients: list, add-client wizard and profile panel.
import { createClientAction, deleteClientAction, sendConnectLinkAction, updateClientAction } from '@/app/actions/clients';
import { connList, toolAccts, acctKey, clSplit, TOOL_NAMES, TOOL_ORDER } from '../../data';
import { clientGoalVals } from './clientGoals';
import { fmtDay, pct } from '../../metrics';
import { DAYS, TIMES, TIME_ZONES, joinSchedule, scheduleParts } from '@/lib/schedule';

const tzName = tz => ((TIME_ZONES.find(t => t[0] === tz) || [])[1] || tz || 'Eastern time (New York)').replace(/ \(.*\)$/, '');

export const TONES = ['Friendly', 'Professional', 'Short and direct', 'Reassuring', 'Detailed'];
const money = v => '$' + v.toFixed(2), cash = v => '$' + Math.round(v).toLocaleString('en-US');
const up = d => d.startsWith('+') && d !== '+0%' ? '#1d6b3a' : d.startsWith('−') ? '#a3330c' : '#5a6474';

// A live client's numbers: leads this week (from the same source as their flags), Meta cost per lead, ad spend this
// month (Meta plus Google Ads) and website visits. null when no account with numbers is linked.
export function liveKpis(M, c) {
  const a = M && c.extra ? M.accountsFor(c.extra.id) : [];
  if (!a.length) return null;
  const w = c.week, day = Number(M.through.slice(8));
  const spend = M.sum(a, 'spend', day) + M.dimSum(a, 'campaign', 'adCost', day);
  const visits = M.sum(a, 'sessions', 7), before = M.sum(a, 'sessions', 7, 1);
  return [
    { label: 'Leads', value: String(c.leads), note: c.delta + ' vs last week', c: up(c.delta), short: c.leads + (c.leads === 1 ? ' lead' : ' leads') },
    w && w.metaLeads > 0 ? { label: 'Cost per lead', value: money(w.spend / w.metaLeads), note: 'Meta, last 7 days', c: '#5a6474', short: money(w.spend / w.metaLeads) + ' per lead' }
      : { label: 'Cost per lead', value: '—', note: 'No Meta leads this week', c: '#5a6474' },
    { label: 'Spend this month', value: cash(spend), note: spend ? 'Through ' + fmtDay(M.through) : 'No ad spend linked', c: '#5a6474', short: spend ? cash(spend) + ' spent this month' : '' },
    visits || before ? { label: 'Website visits', value: Math.round(visits).toLocaleString('en-US'), note: pct(visits, before) + ' vs last week', c: up(pct(visits, before)) }
      : { label: 'Website visits', value: '—', note: 'No Google Analytics linked', c: '#5a6474' },
  ];
}

export function clientsVals(app, ctx) {
  // eslint-disable-next-line no-unused-vars
  const { SL: S, live, metrics: M, refresh, v, go, ST, L, C, clients, inDash, rkCount, atRisk, defTasks, TCOLS, PEOPLE, tkSrc, setTasks, moveTask, tasksAll } = ctx;
  return {
      cur: clients[S.cid] || clients[0],
      ...(() => {
        const pI = S.pfPanel ? S.pfI : S.sel; if (pI == null || !C[pI]) return { pfSub: '', pfView: true, pfEditing: false, pfFields: [], pfInputs: [], pfInts: [], pfKpis: [], pfHasKpis: false, cgGoals: [], cgTypes: [] };
        const i = pI, c = C[i] || C[0], ex = c.extra, ed = (S.pfEdits || {})[i] || {}, D = S.pfDraft, E = S.pfErr || {};
        const sp = scheduleParts(ex && ex.schedule);
        const base = ex ? { name: c.name, industry: ex.industry || '', tone: c.tone, contact: ex.contactName || '', email: ex.email, schedule: ex.schedule || 'Mondays, 8:00am', sDay: sp.day, sTime: sp.time } : { contact: ['Dana Whitfield', 'Marco Reyes', 'Dr. Priya Nair', 'Lena Cho', 'Tom Alvarez'][i], email: ['dana@northsidephysio.com', 'marco@kalye.co', 'office@harborpine.com', 'hello@maraskin.com', 'team@coastline.realty'][i], schedule: 'Mondays, 8:00am' };
        const info = { ...base, ...ed };
        const industry = ex ? ex.industry || 'Industry not set' : ['Physiotherapy clinic', 'Streetwear brand', 'Dental practice', 'Skincare brand', 'Real estate agency'][i], since = ex ? (ex.createdAt ? new Date(ex.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }) : 'recently') : ['Mar 2025', 'Jan 2026', 'Aug 2024', 'May 2025', 'Nov 2025'][i];
        const INT = [['meta', 'Meta', L.meta], ['ga4', 'Google Analytics 4', L.ga4], ['gads', 'Google Ads', L.gads], ['tt', 'TikTok Ads', L.tt], ['sc', 'Google Search Console', '/assets/logo-search-console.png'], ['li', 'LinkedIn Ads', '/assets/logo-linkedin.png'], ['ms', 'Microsoft Ads', '/assets/logo-microsoft.png'], ['gbp', 'Google Business Profile', '/assets/logo-google-business.png']];
        // A client who will not share access with the agency can connect from their side with a private link.
        // Live: the link the server made and emailed. Sample: a pretend one.
        const ask = live ? (S.cAskLive || {})[ex.id] || ex.connect : (S.cAsk || {})[c.name] && { to: (S.cAsk || {})[c.name], url: 'https://app.aiadsanalyst.app/connect/' + c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-7f3k' };
        const cpl = [12.9, 10.6, 8.73, 7.4, 9.1][i] ?? 0, spend = [1170, 1968, 960, 1280, 696][i] ?? 0;
        // Live schedules are a day and a time (in the agency's time zone), so the scheduler can read them.
        const keys = live ? [['name', 'Client name'], ['industry', 'Industry'], ['contact', 'Contact person'], ['email', 'Contact email'], ['sDay', 'Report day', DAYS], ['sTime', 'Report time', TIMES], ['tone', 'Report tone', TONES]]
          : [['contact', 'Contact person'], ['email', 'Contact email'], ['schedule', 'Report schedule']];
        const cgToast = t => { clearTimeout(app.ctT); app.setState({ cToast: t }); app.ctT = setTimeout(() => app.setState({ cToast: null }), 4000); };
        const cg = clientGoalVals(app, { S, live, C }, i, cgToast);
        const kp = live ? liveKpis(M, c) : null;
        const sendLink = () => { if (!info.email) return cgToast('Add a contact email for ' + c.name + ' first.'); app.setState({ pfAsking: c.name });
          sendConnectLinkAction({ id: ex.id, to: info.email }).then(r => { app.setState({ pfAsking: null }); if (r.error) return cgToast(r.error);
            app.setState(s => ({ cAskLive: { ...(s.cAskLive || {}), [ex.id]: { to: info.email, url: r.url } } })); cgToast('Link sent to ' + info.email); refresh(); }); };
        // Closing the profile with unsaved details, budget or goal edits asks first.
        app._pfDirty = (!!D && keys.some(([k]) => (D[k] || '') !== (info[k] || ''))) || cg.cgDirty; app._pfName = c.name;
        return { ...cg,
          pfSub: industry + ' · Client since ' + since,
          pfView: !D, pfEditing: !!D,
          pfFields: [{ k: 'Contact person', v: info.contact || 'Not set' }, { k: 'Contact email', v: info.email }, { k: 'Industry', v: live ? info.industry || 'Not set' : industry }, { k: 'Report tone', v: live ? info.tone : c.tone }, { k: 'Report schedule', v: live ? (sp.day === 'Not scheduled' ? 'Not scheduled. You send reports yourself.' : info.schedule + ', ' + tzName(S.timeZone)) : info.schedule }],
          pfEdit: () => app.setState({ pfDraft: { ...info }, pfErr: {} }),
          pfCancel: () => app.setState({ pfDraft: null, pfErr: {} }),
          pfInputs: keys.map(([k, label, opts]) => ({ k: label, isSelect: !!opts, opts: opts && (opts.includes(D && D[k]) ? opts : [D && D[k]].filter(Boolean).concat(opts)), isText: !opts, v: D ? D[k] : '', bd: E[k] ? '#e0481a' : '#d3dbe6', hasErr: !!E[k], err: E[k] || '', set: e => { const val = e.target.value; app.setState(s => ({ pfDraft: { ...s.pfDraft, [k]: val }, pfErr: { ...(s.pfErr || {}), [k]: null } })); } })),
          pfSave: e => { e.preventDefault(); const err = {}; if (live && !D.name.trim()) err.name = 'Enter the client\u2019s name.'; if (!live && !D.contact.trim()) err.contact = 'Enter a contact name.'; if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(D.email.trim())) err.email = 'Enter a valid email.'; if (!live && !D.schedule.trim()) err.schedule = 'Enter when reports should go out.'; if (Object.keys(err).length) { app.setState({ pfErr: err }); return; } const next = { contact: D.contact.trim(), email: D.email.trim(), schedule: live ? joinSchedule(D.sDay, D.sTime) : D.schedule.trim() };
            if (!live) { app.setState(s => ({ pfEdits: { ...(s.pfEdits || {}), [i]: next }, pfDraft: null, pfErr: {} })); return; }
            // Live: the server's copy comes back on refresh, so nothing is kept locally.
            const all = { ...next, name: D.name.trim(), industry: D.industry.trim(), tone: D.tone };
            app.setState({ pfSaving: true });
            updateClientAction({ id: ex.id, name: all.name, industry: all.industry, tone: all.tone, contactName: all.contact, email: all.email, schedule: all.schedule }).then(r => { app.setState({ pfSaving: false }); if (r.error) return cgToast(r.error); app.setState({ pfDraft: null, pfErr: {} }); cgToast(all.name + '\u2019s details saved'); refresh(); }); },
          pfSaveLabel: S.pfSaving ? 'Saving\u2026' : 'Save details',
          // Removing a live client deletes their reports, goals and flags. Their accounts stay connected. Owner and admins only.
          pfCanRemove: !!live && !!ex && S.me?.role !== 'Member',
          pfRemove: () => app.confirm({ title: 'Remove ' + c.name + '?', body: 'Their reports, goals and flags are deleted. Their accounts stay connected, so you can link them to another client. Their tasks stay on the board with no client.', confirm: 'Remove client', busy: 'Removing\u2026', tone: 'danger',
            onConfirm: () => deleteClientAction(ex.id).then(r => { if (r.error) { cgToast(r.error); return false; } app.setState({ pfPanel: false, pfDraft: null, pfErr: {}, sel: null, cid: 0 }); app._pfDirty = false; cgToast(c.name + ' was removed'); refresh(); return true; }) }),
          pfInts: INT.map(([k, name, logo]) => { const A = connList(S).some(x => x.tool === k), mine = toolAccts(S, k).filter(x => x.client === c.name);
            const on = mine.length > 0, toSet = () => app.setState(s => ({ view: 'settings', stgTab: 'conn', stgOpen: { ...(s.stgOpen || {}), [k]: true } }));
            return { name, logo, status: on ? mine.map(({ a }) => a[0]).join(', ') + ' · ' + mine[0].conn.sync.toLowerCase() : ask ? 'Waiting for ' + c.name + ' to connect' : A ? 'No account linked' : 'Not connected for your agency', sc: on ? '#1d6b3a' : '#5a6474', btn: on ? 'Change' : A ? 'Link account' : 'Connect', aria: (on ? 'Change ' : A ? 'Link ' : 'Connect ') + name + ' account', bg: on ? '#ffffff' : '#1f6be2', c: on ? '#0b1626' : '#ffffff', bd: on ? '#d3dbe6' : '#1f6be2', toggle: toSet }; }),
          pfAskShow: true,
          pfAskTitle: ask ? 'Link sent to ' + ask.to : 'Ask ' + c.name + ' to connect',
          pfAskText: ask ? 'They sign in to Google on their side. The properties they connect attach to ' + c.name + ' only.' + (live ? ' The link works for 14 days.' : '')
            : info.email ? 'Email a secure link to ' + info.email + '. They sign in with their own Google login, and Analyst attaches their Google Analytics to ' + c.name + ' only.' : 'Add a contact email above, then send them a secure link to connect their own Google Analytics.',
          pfAskBtn: S.pfAsking === c.name ? 'Sending\u2026' : ask ? 'Copy link' : 'Send link',
          pfAskAgain: !!live && !!ask && S.pfAsking !== c.name, pfAskAgainDo: () => sendLink(),
          pfAsk: () => { if (S.pfAsking) return; if (!ask) { if (!live) { app.setState(s => ({ cAsk: { ...(s.cAsk || {}), [c.name]: info.email } })); return; } return sendLink(); }
            try { navigator.clipboard.writeText(ask.url); } catch (er) {} app.setState({ pfCopied: c.name }); clearTimeout(app.pcT); app.pcT = setTimeout(() => app.setState({ pfCopied: null }), 2000); },
          pfAskCopied: ask && S.pfCopied === c.name,
          pfHasKpis: !!live, pfKpiNote: kp ? 'Last 7 days, through ' + fmtDay(M.through) : 'Link ' + c.name + '\u2019s Google Analytics property or Meta ad account to see their results here.',
          pfKpis: live ? kp || [] : ex ? ['Leads', 'Cost per lead', 'Spend this month', 'Conversions'].map(label => ({ label, value: '—', note: 'Connect accounts to see this', c: '#5a6474' })) : [{ label: 'Leads', value: String(c.leads), note: c.delta + ' vs last week', c: c.delta.startsWith('+') ? '#1d6b3a' : '#a3330c' }, { label: 'Cost per lead', value: '$' + cpl.toFixed(2), note: i < 2 ? '+9% vs last week' : '−6% vs last week', c: i < 2 ? '#1d6b3a' : '#a3330c' }, { label: 'Spend this month', value: '$' + spend.toLocaleString(), note: 'Day 20 of 31', c: '#5a6474' }, { label: 'Conversions', value: String(Math.round(c.leads * 1.15)), note: '+4% vs last week', c: '#1d6b3a' }],
          pfKpisSel: (ex ? ['Leads', 'Cost per lead', 'Spend this month', 'Conversions'].map(label => ({ label, value: '—', note: 'Connect accounts to see this', c: '#5a6474' })) : [{ label: 'Leads', value: String(c.leads), note: c.delta + ' vs last week', c: c.delta.startsWith('+') ? '#1d6b3a' : '#a3330c' }, { label: 'Cost per lead', value: '$' + cpl.toFixed(2), note: i < 2 ? '+9% vs last week' : '−6% vs last week', c: i < 2 ? '#1d6b3a' : '#a3330c' }, { label: 'Spend this month', value: '$' + spend.toLocaleString(), note: 'Day 20 of 31', c: '#5a6474' }, { label: 'Conversions', value: String(Math.round(c.leads * 1.15)), note: '+4% vs last week', c: '#1d6b3a' }]),
        };
      })(),
      pfPanelOn: !!S.pfPanel, pfO: S.pfPanel ? 1 : 0, pfPe: S.pfPanel ? 'auto' : 'none', pfX: S.pfPanel ? '0' : '100%', pfVis: S.pfPanel ? 'visible' : 'hidden', pfClose: () => { const close = () => app.setState({ pfPanel: false, pfDraft: null, pfErr: {}, cgForm: null, cgBudgetDraft: null, cgBudgetErr: null }); if (!app._pfDirty) return close();
        app.confirm({ title: 'Discard your changes?', body: 'You have unsaved changes to ' + app._pfName + '\u2019s profile. If you close it now, they\u2019re lost.', confirm: 'Discard changes', tone: 'danger', cancel: 'Keep editing', onConfirm: close }); },
      vClients: v === 'clients', ...(() => {
        const F = S.cForm, E = S.cErr || {}, extra = S.extraClients || [];
        // Leaving the new-client form after typing in it asks first.
        const leaveForm = () => { const close = () => app.setState({ cForm: null, cErr: {} }); if (!F || !((F.name || '').trim() || (F.email || '').trim())) return close();
          app.confirm({ title: 'Discard this new client?', body: 'You started adding ' + ((F.name || '').trim() || 'a client') + '. If you leave now, what you entered is lost.', confirm: 'Discard', tone: 'danger', cancel: 'Keep editing', onConfirm: close }); };
        // Accounts no client uses yet. An account belongs to at most one client.
        const free = TOOL_ORDER.flatMap(k => toolAccts(S, k).filter(x => !x.client).map(x => ({ ...x, k, key: acctKey(x.conn.id, x.j) })));
        // Loose name match for suggesting accounts: "Onnit" matches "onnit.com" and "Onnit · Main".
        const norm = x => String(x || '').toLowerCase().replace(/\.(com|co|net|org|io)\b.*$/, '').replace(/[^a-z0-9]/g, '');
        const addedMsg = () => F.name.trim() + ' added. ' + (F.plats.length ? F.plats.length + (F.plats.length === 1 ? ' account is' : ' accounts are') + ' linked.' : 'Link their accounts to start seeing results.');
        const addClient = () => {
          if (!live) { app.setState(s => ({ extraClients: [...(s.extraClients || []), { name: F.name.trim(), email: F.email.trim() }], stgSel: assign(s), cForm: null, cErr: {}, sel: C.length, cid: C.length, view: 'clients' })); toast(addedMsg()); return; }
          const ids = F.plats.map(key => { const x = free.find(f => f.key === key); return x && x.conn.acctIds ? x.conn.acctIds[x.j] : null; }).filter(Boolean);
          createClientAction({ name: F.name.trim(), email: F.email.trim(), accountIds: ids }).then(r => { if (r.error) return toast(r.error); app.setState({ cForm: null, cErr: {}, sel: null, view: 'clients' }); toast(addedMsg()); refresh(); });
        };
        const assign = s => { const o = { ...(s.stgSel || {}) }; F.plats.forEach(key => { o[key] = F.name.trim(); }); return o; };
        const emails = ['dana@northsidephysio.com', 'marco@kalye.co', 'office@harborpine.com', 'hello@maraskin.com', 'team@coastline.realty'];
        const rows = C.map((c, i) => ({ name: c.name, initials: c.i, email: c.extra ? c.extra.email : emails[i], logos: c.logos.map(l => L[l]), none: false, leads: String(c.leads), last: c.last, openLabel: 'Open ' + c.name + ' profile', ...(() => { const ex = !!(S.cExp || {})[i]; const tools = TOOL_ORDER.flatMap(k => toolAccts(S, k).filter(x => x.client === c.name).map(({ conn, a }) => ({ name: TOOL_NAMES[k], logo: L[k], acct: a[0] + ' · ' + a[1], sync: conn.sync })));
          const kp = live ? liveKpis(M, c) : null;
          return { nums: kp ? 'Last 7 days: ' + kp.map(k => k.short).filter(Boolean).join(' · ') : '', exp: ex, bg: ex ? '#f8fafc' : '#ffffff', chev: ex ? 'rotate(180deg)' : 'rotate(0deg)', rows: ex ? '1fr' : '0fr', toggleLabel: (ex ? 'Hide ' : 'Show ') + c.name + ' tools', toggle: () => app.setState(s => ({ cExp: { ...(s.cExp || {}), [i]: !ex } })), rowClick: e => { if (e.target.closest('button')) return; app.setState(s => ({ cExp: { ...(s.cExp || {}), [i]: !ex } })); }, tools, noTools: tools.length === 0, manage: () => app.setState({ view: 'settings', stgTab: 'conn' }) }; })(), status: (clients[i] || {}).status || '', dot: ({ h: '#2f9e5b', n: '#e8a33a', r: '#e0481a' })[c.s] || '#97a2b2', stC: ({ h: '#1d6b3a', n: '#7a5a00', r: '#a3330c' })[c.s] || '#5a6474', open: () => app.setState({ pfPanel: true, pfI: i, cid: i, tab: 0, pfDraft: null }) }));
        const toast = t => { clearTimeout(app.ctT); app.setState({ cToast: t }); app.ctT = setTimeout(() => app.setState({ cToast: null }), 4000); };
        return {
          ...(() => { const nar = ((S.vw || 1280) - (S.navC ? 72 : 264)) < 820; return { cCols: nar ? 'minmax(0,1fr) 150px 56px 24px' : 'minmax(0,2.2fr) minmax(0,1.4fr) minmax(0,1fr) 80px minmax(0,1fr) 24px', cWide: nar ? 'none' : 'block', cWideFlex: nar ? 'none' : 'flex' }; })(), cRows: rows, cNoClients: rows.length === 0, cCount: rows.length + ' clients', cFormOpen: !!F, cEmptyOn: !F, cAddOpen: () => app.setState({ view: 'clients', sel: null, swOpen: false, cForm: { name: '', email: '', plats: [], step: 1 }, cErr: {} }), cfName: F ? F.name : '', cfEmail: F ? F.email : '',
          cErrName: !!E.name, cNameBd: E.name ? '#e0481a' : '#d3dbe6', cErrEmail: !!E.email, cEmailHint: !E.email, cEmailBd: E.email ? '#e0481a' : '#d3dbe6',
          cToast: !!S.cToast, cToastText: S.cToast || '',
          cPlatsNone: free.length === 0, cPlatsNoneText: connList(S).length ? 'Every connected account is already linked to a client.' : 'No accounts are connected yet. Connect Google Analytics or Meta to link this client\'s accounts.', cConnectTool: () => app.setState({ dlg: { kind: 'connect', tool: null, st: 'pick', from: 'wizard' }, dlgErr: null }),
          cPlats: free.map(({ k, a, key }) => { const on = !!(F && F.plats.includes(key)); return { label: a[0], desc: TOOL_NAMES[k] + ' · ' + a[1], logo: L[k], on, bd: on ? '#1f6be2' : '#d3dbe6', bg: on ? '#eef3fd' : '#ffffff', chk: on ? '#1f6be2' : '#ffffff', toggle: () => app.setState(s => ({ cForm: { ...s.cForm, plats: on ? s.cForm.plats.filter(p => p !== key) : [...s.cForm.plats, key] } })) }; }),
          cSetName: e => { const val = e.target.value; app.setState(s => ({ cForm: { ...s.cForm, name: val }, cErr: { ...(s.cErr || {}), name: false } })); },
          cSetEmail: e => { const val = e.target.value; app.setState(s => ({ cForm: { ...s.cForm, email: val }, cErr: { ...(s.cErr || {}), email: false } })); },
          cCancel: () => leaveForm(),
          cBackdrop: e => { if (e.target === e.currentTarget) leaveForm(); },
          cStep: F ? F.step || 1 : 1, cS1: !!F && (F.step || 1) === 1, cS2: !!F && F.step === 2, cS3: !!F && F.step === 3,
          cBars: ['Business', 'Contact', 'Accounts'].map((label, i) => { const st = F ? F.step || 1 : 1; return { label, bg: i < st ? '#1f6be2' : '#e6ebf2', fw: i + 1 === st ? 700 : 500, c: i < st ? '#0b1626' : '#5a6474' }; }),
          cBackVis: F && (F.step || 1) > 1 ? 'visible' : 'hidden', cNextLabel: F && F.step === 3 ? 'Add client' : 'Next',
          cHead: F ? ({ 1: "Let's add a new client.", 2: 'Where should ' + (F.name.trim() || 'their') + (F.name.trim() ? "'s" : '') + ' reports go?', 3: 'Which of your accounts belong to ' + (F.name.trim() || 'this client') + '?' })[F.step || 1] : '',
          ...[1, 2, 3].reduce((o, n) => { const st = F ? F.step || 1 : 1; o['cW' + n] = { done: n < st, cur: n === st, todo: n > st, sum: n === 1 ? (F ? F.name : '') : n === 2 ? (F ? F.email : '') : '', go: () => app.setState(s => ({ cForm: { ...s.cForm, step: n }, cErr: {} })) }; return o; }, {}),
          cBackOrClose: () => { const st = F ? F.step || 1 : 1; if (st > 1) app.setState(s => ({ cForm: { ...s.cForm, step: st - 1 }, cErr: {} })); else leaveForm(); },
          cBack: () => app.setState(s => ({ cForm: { ...s.cForm, step: Math.max(1, (s.cForm.step || 1) - 1) }, cErr: {} })),
          cNext: e => { e.preventDefault(); const st = F.step || 1; if (st === 1) { if (!F.name.trim()) { app.setState({ cErr: { name: true } }); return; } app.setState(s => ({ cForm: { ...s.cForm, step: 2 }, cErr: {} })); return; } if (st === 2) { if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(F.email.trim())) { app.setState({ cErr: { email: true } }); return; } const nm = norm(F.name), guess = nm.length > 2 ? free.filter(x => { const an = norm(x.a[0]); return an.length > 2 && (an.includes(nm) || nm.includes(an)); }).map(x => x.key) : []; app.setState(s => ({ cForm: { ...s.cForm, step: 3, plats: s.cForm.plats.length ? s.cForm.plats : guess }, cErr: {} })); return; } addClient(); },
          cSave: e => { e.preventDefault(); const err = { name: !F.name.trim(), email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(F.email.trim()) }; if (err.name || err.email) { app.setState({ cErr: err }); return; } addClient(); }
        };
      })(),
  };
}
