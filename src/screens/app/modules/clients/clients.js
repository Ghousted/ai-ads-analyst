// Clients: list, add-client wizard and profile panel.
import { createClientAction, updateClientAction } from '@/app/actions/clients';
import { connList, toolAccts, acctKey, clSplit, TOOL_NAMES, TOOL_ORDER } from '../../data';

export function clientsVals(app, ctx) {
  // eslint-disable-next-line no-unused-vars
  const { SL: S, live, refresh, v, go, ST, L, C, clients, inDash, rkCount, atRisk, defTasks, TCOLS, PEOPLE, tkSrc, setTasks, moveTask, tasksAll } = ctx;
  return {
      cur: clients[S.cid] || clients[0],
      ...(() => {
        const pI = S.pfPanel ? S.pfI : S.sel; if (pI == null) return { pfSub: '', pfView: true, pfEditing: false, pfFields: [], pfInputs: [], pfInts: [], pfKpis: [] };
        const i = pI, c = C[i] || C[0], ex = c.extra, ed = (S.pfEdits || {})[i] || {}, D = S.pfDraft, E = S.pfErr || {};
        const base = ex ? { contact: ex.contactName || 'Not set', email: ex.email, schedule: ex.schedule || 'Mondays, 8:00am' } : { contact: ['Dana Whitfield', 'Marco Reyes', 'Dr. Priya Nair', 'Lena Cho', 'Tom Alvarez'][i], email: ['dana@northsidephysio.com', 'marco@kalye.co', 'office@harborpine.com', 'hello@maraskin.com', 'team@coastline.realty'][i], schedule: 'Mondays, 8:00am' };
        const info = { ...base, ...ed };
        const industry = ex ? 'Industry not set' : ['Physiotherapy clinic', 'Streetwear brand', 'Dental practice', 'Skincare brand', 'Real estate agency'][i], since = ex ? 'Oct 2026' : ['Mar 2025', 'Jan 2026', 'Aug 2024', 'May 2025', 'Nov 2025'][i];
        const INT = [['meta', 'Meta', L.meta], ['ga4', 'Google Analytics 4', L.ga4], ['gads', 'Google Ads', L.gads], ['tt', 'TikTok Ads', L.tt], ['sc', 'Google Search Console', '/assets/logo-search-console.png'], ['li', 'LinkedIn Ads', '/assets/logo-linkedin.png'], ['ms', 'Microsoft Ads', '/assets/logo-microsoft.png'], ['gbp', 'Google Business Profile', '/assets/logo-google-business.png']];
        // A client who will not share access with the agency can connect from their side with a one-time link.
        const ask = (S.cAsk || {})[c.name], askUrl = 'https://app.aiadsanalyst.app/connect/' + c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-7f3k';
        const cpl = [12.9, 10.6, 8.73, 7.4, 9.1][i] ?? 0, spend = [1170, 1968, 960, 1280, 696][i] ?? 0;
        const keys = [['contact', 'Contact person'], ['email', 'Contact email'], ['schedule', 'Report schedule']];
        return {
          pfSub: industry + ' · Client since ' + since,
          pfView: !D, pfEditing: !!D,
          pfFields: [{ k: 'Contact person', v: info.contact }, { k: 'Contact email', v: info.email }, { k: 'Industry', v: industry }, { k: 'Report tone', v: c.tone }, { k: 'Report schedule', v: info.schedule }],
          pfEdit: () => app.setState({ pfDraft: { ...info }, pfErr: {} }),
          pfCancel: () => app.setState({ pfDraft: null, pfErr: {} }),
          pfInputs: keys.map(([k, label]) => ({ k: label, v: D ? D[k] : '', bd: E[k] ? '#e0481a' : '#d3dbe6', hasErr: !!E[k], err: E[k] || '', set: e => { const val = e.target.value; app.setState(s => ({ pfDraft: { ...s.pfDraft, [k]: val }, pfErr: { ...(s.pfErr || {}), [k]: null } })); } })),
          pfSave: e => { e.preventDefault(); const err = {}; if (!D.contact.trim()) err.contact = 'Enter a contact name.'; if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(D.email.trim())) err.email = 'Enter a valid email.'; if (!D.schedule.trim()) err.schedule = 'Enter when reports should go out.'; if (Object.keys(err).length) { app.setState({ pfErr: err }); return; } const next = { contact: D.contact.trim(), email: D.email.trim(), schedule: D.schedule.trim() }; app.setState(s => ({ pfEdits: { ...(s.pfEdits || {}), [i]: next }, pfDraft: null, pfErr: {} }));
            if (live && ex && ex.id) updateClientAction({ id: ex.id, contactName: next.contact, email: next.email, schedule: next.schedule }).then(r => { if (r.error) toast(r.error); else refresh(); }); },
          pfInts: INT.map(([k, name, logo]) => { const A = connList(S).some(x => x.tool === k), mine = toolAccts(S, k).filter(x => x.client === c.name);
            const on = mine.length > 0, toSet = () => app.setState(s => ({ view: 'settings', stgTab: 'conn', stgOpen: { ...(s.stgOpen || {}), [k]: true } }));
            return { name, logo, status: on ? mine.map(({ a }) => a[0]).join(', ') + ' · ' + mine[0].conn.sync.toLowerCase() : ask ? 'Waiting for ' + c.name + ' to connect' : A ? 'No account linked' : 'Not connected for your agency', sc: on ? '#1d6b3a' : '#5a6474', btn: on ? 'Change' : A ? 'Link account' : 'Connect', aria: (on ? 'Change ' : A ? 'Link ' : 'Connect ') + name + ' account', bg: on ? '#ffffff' : '#1f6be2', c: on ? '#0b1626' : '#ffffff', bd: on ? '#d3dbe6' : '#1f6be2', toggle: toSet }; }),
          // The client-side connect link is not built yet, so live agencies don't see it.
          pfAskShow: !live,
          pfAskTitle: ask ? 'Link sent to ' + ask : 'Ask ' + c.name + ' to connect',
          pfAskText: ask ? 'They sign in on their side. The accounts they connect attach to ' + c.name + ' only.' : 'Send a secure link to ' + info.email + '. They sign in with their own login, and Analyst attaches the accounts to ' + c.name + ' only.',
          pfAskBtn: ask ? 'Copy link' : 'Send link',
          pfAsk: () => { if (!ask) { app.setState(s => ({ cAsk: { ...(s.cAsk || {}), [c.name]: info.email } })); return; } try { navigator.clipboard.writeText(askUrl); } catch (er) {} app.setState({ pfCopied: c.name }); clearTimeout(app.pcT); app.pcT = setTimeout(() => app.setState({ pfCopied: null }), 2000); },
          pfAskCopied: ask && S.pfCopied === c.name,
          pfKpis: ex ? ['Leads', 'Cost per lead', 'Spend this month', 'Conversions'].map(label => ({ label, value: '—', note: 'Connect accounts to see this', c: '#5a6474' })) : [{ label: 'Leads', value: String(c.leads), note: c.delta + ' vs last week', c: c.delta.startsWith('+') ? '#1d6b3a' : '#a3330c' }, { label: 'Cost per lead', value: '$' + cpl.toFixed(2), note: i < 2 ? '+9% vs last week' : '−6% vs last week', c: i < 2 ? '#1d6b3a' : '#a3330c' }, { label: 'Spend this month', value: '$' + spend.toLocaleString(), note: 'Day 20 of 31', c: '#5a6474' }, { label: 'Conversions', value: String(Math.round(c.leads * 1.15)), note: '+4% vs last week', c: '#1d6b3a' }],
          pfKpisSel: (ex ? ['Leads', 'Cost per lead', 'Spend this month', 'Conversions'].map(label => ({ label, value: '—', note: 'Connect accounts to see this', c: '#5a6474' })) : [{ label: 'Leads', value: String(c.leads), note: c.delta + ' vs last week', c: c.delta.startsWith('+') ? '#1d6b3a' : '#a3330c' }, { label: 'Cost per lead', value: '$' + cpl.toFixed(2), note: i < 2 ? '+9% vs last week' : '−6% vs last week', c: i < 2 ? '#1d6b3a' : '#a3330c' }, { label: 'Spend this month', value: '$' + spend.toLocaleString(), note: 'Day 20 of 31', c: '#5a6474' }, { label: 'Conversions', value: String(Math.round(c.leads * 1.15)), note: '+4% vs last week', c: '#1d6b3a' }]),
        };
      })(),
      pfPanelOn: !!S.pfPanel, pfO: S.pfPanel ? 1 : 0, pfPe: S.pfPanel ? 'auto' : 'none', pfX: S.pfPanel ? '0' : '100%', pfVis: S.pfPanel ? 'visible' : 'hidden', pfClose: () => app.setState({ pfPanel: false, pfDraft: null }),
      vClients: v === 'clients', ...(() => {
        const F = S.cForm, E = S.cErr || {}, extra = S.extraClients || [];
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
          return { exp: ex, bg: ex ? '#f8fafc' : '#ffffff', chev: ex ? 'rotate(180deg)' : 'rotate(0deg)', rows: ex ? '1fr' : '0fr', toggleLabel: (ex ? 'Hide ' : 'Show ') + c.name + ' tools', toggle: () => app.setState(s => ({ cExp: { ...(s.cExp || {}), [i]: !ex } })), rowClick: e => { if (e.target.closest('button')) return; app.setState(s => ({ cExp: { ...(s.cExp || {}), [i]: !ex } })); }, tools, noTools: tools.length === 0, manage: () => app.setState({ view: 'settings', stgTab: 'conn' }) }; })(), status: (clients[i] || {}).status || '', dot: ({ h: '#2f9e5b', n: '#e8a33a', r: '#e0481a' })[c.s] || '#97a2b2', stC: ({ h: '#1d6b3a', n: '#7a5a00', r: '#a3330c' })[c.s] || '#5a6474', open: () => app.setState({ pfPanel: true, pfI: i, cid: i, tab: 0, pfDraft: null }) }));
        const toast = t => { clearTimeout(app.ctT); app.setState({ cToast: t }); app.ctT = setTimeout(() => app.setState({ cToast: null }), 4000); };
        return {
          ...(() => { const nar = ((S.vw || 1280) - (S.navC ? 72 : 264)) < 820; return { cCols: nar ? 'minmax(0,1fr) 150px 56px 24px' : 'minmax(0,2.2fr) minmax(0,1.4fr) minmax(0,1fr) 80px minmax(0,1fr) 24px', cWide: nar ? 'none' : 'block', cWideFlex: nar ? 'none' : 'flex' }; })(), cRows: rows, cNoClients: rows.length === 0, cCount: rows.length + ' clients', cFormOpen: !!F, cEmptyOn: !F, cAddOpen: () => app.setState({ view: 'clients', sel: null, swOpen: false, cForm: { name: '', email: '', plats: [], step: 1 }, cErr: {} }), cfName: F ? F.name : '', cfEmail: F ? F.email : '',
          cErrName: !!E.name, cNameBd: E.name ? '#e0481a' : '#d3dbe6', cErrEmail: !!E.email, cEmailHint: !E.email, cEmailBd: E.email ? '#e0481a' : '#d3dbe6',
          cToast: !!S.cToast, cToastText: S.cToast || '',
          cPlatsNone: free.length === 0, cPlatsNoneText: connList(S).length ? 'Every connected account is already linked to a client.' : 'No accounts are connected yet. Connect Google Analytics to link this client\'s property.', cConnectTool: () => app.setState({ dlg: { kind: 'connect', tool: null, st: 'pick', from: 'wizard' }, dlgErr: null }),
          cPlats: free.map(({ k, a, key }) => { const on = !!(F && F.plats.includes(key)); return { label: a[0], desc: TOOL_NAMES[k] + ' · ' + a[1], logo: L[k], on, bd: on ? '#1f6be2' : '#d3dbe6', bg: on ? '#eef3fd' : '#ffffff', chk: on ? '#1f6be2' : '#ffffff', toggle: () => app.setState(s => ({ cForm: { ...s.cForm, plats: on ? s.cForm.plats.filter(p => p !== key) : [...s.cForm.plats, key] } })) }; }),
          cSetName: e => { const val = e.target.value; app.setState(s => ({ cForm: { ...s.cForm, name: val }, cErr: { ...(s.cErr || {}), name: false } })); },
          cSetEmail: e => { const val = e.target.value; app.setState(s => ({ cForm: { ...s.cForm, email: val }, cErr: { ...(s.cErr || {}), email: false } })); },
          cCancel: () => app.setState({ cForm: null, cErr: {} }),
          cBackdrop: e => { if (e.target === e.currentTarget) app.setState({ cForm: null, cErr: {} }); },
          cStep: F ? F.step || 1 : 1, cS1: !!F && (F.step || 1) === 1, cS2: !!F && F.step === 2, cS3: !!F && F.step === 3,
          cBars: ['Business', 'Contact', 'Accounts'].map((label, i) => { const st = F ? F.step || 1 : 1; return { label, bg: i < st ? '#1f6be2' : '#e6ebf2', fw: i + 1 === st ? 700 : 500, c: i < st ? '#0b1626' : '#5a6474' }; }),
          cBackVis: F && (F.step || 1) > 1 ? 'visible' : 'hidden', cNextLabel: F && F.step === 3 ? 'Add client' : 'Next',
          cHead: F ? ({ 1: "Let's add a new client.", 2: 'Where should ' + (F.name.trim() || 'their') + (F.name.trim() ? "'s" : '') + ' reports go?', 3: 'Which of your accounts belong to ' + (F.name.trim() || 'this client') + '?' })[F.step || 1] : '',
          ...[1, 2, 3].reduce((o, n) => { const st = F ? F.step || 1 : 1; o['cW' + n] = { done: n < st, cur: n === st, todo: n > st, sum: n === 1 ? (F ? F.name : '') : n === 2 ? (F ? F.email : '') : '', go: () => app.setState(s => ({ cForm: { ...s.cForm, step: n }, cErr: {} })) }; return o; }, {}),
          cBackOrClose: () => { const st = F ? F.step || 1 : 1; if (st > 1) app.setState(s => ({ cForm: { ...s.cForm, step: st - 1 }, cErr: {} })); else app.setState({ cForm: null, cErr: {} }); },
          cBack: () => app.setState(s => ({ cForm: { ...s.cForm, step: Math.max(1, (s.cForm.step || 1) - 1) }, cErr: {} })),
          cNext: e => { e.preventDefault(); const st = F.step || 1; if (st === 1) { if (!F.name.trim()) { app.setState({ cErr: { name: true } }); return; } app.setState(s => ({ cForm: { ...s.cForm, step: 2 }, cErr: {} })); return; } if (st === 2) { if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(F.email.trim())) { app.setState({ cErr: { email: true } }); return; } const nm = norm(F.name), guess = nm.length > 2 ? free.filter(x => { const an = norm(x.a[0]); return an.length > 2 && (an.includes(nm) || nm.includes(an)); }).map(x => x.key) : []; app.setState(s => ({ cForm: { ...s.cForm, step: 3, plats: s.cForm.plats.length ? s.cForm.plats : guess }, cErr: {} })); return; } addClient(); },
          cSave: e => { e.preventDefault(); const err = { name: !F.name.trim(), email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(F.email.trim()) }; if (err.name || err.email) { app.setState({ cErr: err }); return; } addClient(); }
        };
      })(),
  };
}
