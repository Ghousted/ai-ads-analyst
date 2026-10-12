// Settings, including integrations.
import { connections, acctFor, clSplit, MORE_ACCTS, ACCTS, LOGOS } from '../../data';

const TOOLS = [['meta', 'Meta', 'Facebook and Instagram ads'], ['ga4', 'Google Analytics 4', 'Website visits and conversions'], ['gads', 'Google Ads', 'Search, display and Performance Max'], ['tt', 'TikTok Ads', 'Video ads on TikTok'], ['sc', 'Google Search Console', 'Organic search clicks and rankings'], ['ig', 'Instagram Ads', 'Runs through your Meta ad accounts'], ['li', 'LinkedIn Ads', 'Sponsored content and lead forms'], ['ms', 'Microsoft Ads', 'Bing search ads'], ['gbp', 'Google Business Profile', 'Calls, directions and website clicks']];
const PLANS = [['Free', '$0', 'Up to 2 clients'], ['Solo', '$19', 'Up to 5 clients'], ['Studio', '$49', 'Up to 20 clients'], ['Agency', '$99', 'Unlimited clients and teammates']];
const DEF_MEMBERS = [['Alex Rivera', 'alex@riveradigital.com', 'Owner'], ['Jordan Santos', 'jordan@riveradigital.com', 'Admin'], ['Mia Kim', 'mia@riveradigital.com', 'Member']];
const INVOICES = [['Oct 1, 2026', '$79.00'], ['Sep 1, 2026', '$79.00'], ['Aug 1, 2026', '$79.00']];
const emailOk = x => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((x || '').trim());

export function settingsVals(app, ctx) {
  // eslint-disable-next-line no-unused-vars
  const { S, v, go, ST, L, C, clients, inDash, rkCount, atRisk, defTasks, TCOLS, PEOPLE, tkSrc, setTasks, moveTask, tasksAll } = ctx;
  return {
      vSet: v === 'settings', ...(() => {
        const tab = S.stgTab || 'general', on = S.stg || {}, sel = S.stgSel || {};
        const toast = t => { clearTimeout(app.stT); app.setState({ stgToast: t }); app.stT = setTimeout(() => app.setState({ stgToast: null }), 3000); };
        const ic = { profile: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0', general: 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0', conn: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1', agency: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6', members: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8', security: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4', billing: 'M3 6h18v12H3zM3 10h18' };
        const NAV = [['Account', [['profile', 'My profile'], ['general', 'Notifications'], ['conn', 'Integrations']]], ['Workspace', [['agency', 'Agency and branding'], ['members', 'Team members'], ['security', 'Security'], ['billing', 'Plan and billing']]]];
        const lab = Object.fromEntries(NAV.flatMap(g => g[1]));
        const tg = (k, t, d, def) => { const v2 = k in on ? on[k] : def; return { t, d, isToggle: true, on: v2, tBg: v2 ? '#1f6be2' : '#d3dbe6', tX: v2 ? 18 : 0, toggle: () => app.setState(s => ({ stg: { ...(s.stg || {}), [k]: !v2 } })) }; };
        const sl = (k, t, d, opts) => ({ t, d, isSelect: true, opts, val: sel[k] || opts[0], set: e => { const x = e.target.value; app.setState(s => ({ stgSel: { ...(s.stgSel || {}), [k]: x } })); } });
        const bt = (t, d, btnLabel, act, primary) => ({ t, d, isBtn: !primary, isPrimary: !!primary, btnLabel, btn: typeof act === 'function' ? act : () => toast(act) });
        const dlg = o => () => app.setState({ dlg: o, dlgErr: null });
        const me = S.me || { name: 'Alex Rivera', email: 'alex@riveradigital.com' }, agency = S.agName ?? 'Rivera Digital', members = S.members || DEF_MEMBERS, plan = S.plan || 'Agency';
        const conns = connections(S);
        const ck = (k, label, def) => { const v2 = k in on ? on[k] : def; return { label, on: v2, bg: v2 ? '#1f6be2' : '#ffffff', bd: v2 ? '#1f6be2' : '#97a2b2', o: v2 ? 1 : 0, toggle: () => app.setState(s => ({ stg: { ...(s.stg || {}), [k]: !v2 } })) }; };
        const G = {
          profile: [{ title: 'My profile', rows: [bt(me.name, 'Owner at ' + agency, 'Edit name', dlg({ kind: 'name', val: me.name })), bt('Email', me.email, 'Change email', dlg({ kind: 'email', val: '' })), bt('Password', 'Last changed 3 months ago', 'Change password', 'We emailed a reset link to ' + me.email)] }],
          general: [{ title: 'My notifications', checkTitle: 'Tell me when…', checks: [ck('a0', 'A client gets 20% fewer leads than usual', true), ck('a1', 'Cost per lead goes over a goal', true), ck('a2', 'Spend is 15% ahead or behind budget', true), ck('a3', 'An account disconnects and data stops', true), ck('a4', 'Clario flags a client as at risk', true)],
              rows: [tg('n0', 'In Ask Clario', 'Clario messages you in the chat with what happened and what to do.', true), tg('n1', 'By email', 'Alerts go to ' + me.email + ' as they happen.', true), tg('n2', 'Weekly summary email', 'A Monday morning email with every client\'s results.', true), tg('n3', 'Slack', 'Post alerts to a Slack channel your team watches.', false)] },
            { title: 'My preferences', rows: [sl('lang', 'Language', 'Used across the app and in AI replies.', ['English', 'Español', 'Français']), sl('tz', 'Time zone', 'Report schedules and alerts follow this time.', ['Eastern time (New York)', 'Central time (Chicago)', 'Pacific time (Los Angeles)']), sl('cur', 'Currency', 'Shown on spend, budgets and cost per lead.', ['USD ($)', 'EUR (€)', 'GBP (£)'])] }],
          conn: Object.entries(conns).map(([tool, [name, who, sync, list]]) => { const open = !!(S.stgOpen || {})[tool], nA = list.filter((_, j) => acctFor(sel, tool, j)).length; return { title: name, logo: L[tool], rows: [bt('Connected as ' + who, sync + ' · ' + nA + ' of ' + list.length + ' accounts assigned to clients.', 'Disconnect', dlg({ kind: 'disconnect', tool }))],
            subLabel: (open ? 'Hide ' : 'Show ') + list.length + (list.length === 1 ? ' account' : ' accounts'), subOpen: open, subChev: open ? 'rotate(180deg)' : 'rotate(0deg)', subRows: open ? '1fr' : '0fr', subToggle: () => app.setState(st => ({ stgOpen: { ...(st.stgOpen || {}), [tool]: !open } })),
            sub: list.map(([an, id], j) => { const k = 'acct-' + tool + '-' + j, cur = acctFor(sel, tool, j); return { t: an, d: id, aria: 'Client for ' + an, opts: ['Not assigned'].concat(C.map(c => c.name)), val: cur || 'Not assigned', c: cur ? '#0b1626' : '#5a6474', set: ev => { const x = ev.target.value; app.setState(st => ({ stgSel: { ...(st.stgSel || {}), [k]: x === 'Not assigned' ? '' : x } })); } }; }) }; }).concat([{ title: 'Add a tool', rows: [bt('Connect a new tool', 'Sign in once with your agency login. Clario finds every account you manage.', 'Connect a tool', dlg({ kind: 'connect', tool: null, st: 'pick' }), true)] }]),
          agency: [{ title: 'Agency', rows: [bt(agency, C.length + ' clients · ' + members.length + ' teammates', 'Edit agency', dlg({ kind: 'agency', val: agency })), bt('Report branding', 'Your logo and colour are set when you create your first report. Change them anytime from Design in the report editor.', 'Open reports', () => app.setState({ view: 'templates' }))] },
            { title: 'Client portal', rows: [tg('portal', 'Client portal', 'A secure login where clients see every report you have sent them.', true), sl('rsched', 'Default report schedule', 'New clients start with this schedule.', ['Mondays, 8:00am', 'Fridays, 4:00pm', 'First of the month']), sl('rtone', 'Default report tone', 'How Clario writes reports for new clients.', ['Friendly', 'Professional', 'Short and direct'])] }],
          members: [{ title: 'Team members', rows: members.map(([n, e, r], j) => j === 0 ? { t: n === 'Alex Rivera' ? me.name : n, d: (n === 'Alex Rivera' ? me.email : e) + ' · Owner' } : { t: n, d: e, isSelect: true, opts: r === 'Admin' ? ['Admin', 'Member', 'Remove from team'] : ['Member', 'Admin', 'Remove from team'], val: r, set: ev => { const x = ev.target.value; if (x === 'Remove from team') { app.setState({ members: members.filter((_, k) => k !== j) }); toast(n + ' was removed from ' + agency); } else { app.setState({ members: members.map((mm, k) => k === j ? [mm[0], mm[1], x] : mm) }); toast(n + ' is now ' + (x === 'Admin' ? 'an admin' : 'a member')); } } }).concat([bt('Invite a teammate', 'They get an email to join ' + agency + '.', 'Invite', dlg({ kind: 'invite', val: '', role: 'Member' }), true)]) }],
          security: [{ title: 'Security', rows: [tg('2fa', 'Two-step sign-in', 'Ask for a code from your phone each time you sign in.', false), tg('sso', 'Google sign-in for the team', 'Teammates sign in with their riveradigital.com Google account.', true), bt('Signed-in devices', S.signedOut ? '1 device · this Mac' : '2 devices · this Mac and an iPhone', 'Sign out others', () => { app.setState({ signedOut: true }); toast('Your iPhone was signed out'); })] }],
          billing: [{ title: 'Plan and billing', rows: [bt(plan + ' plan', (PLANS.find(x => x[0] === plan) || PLANS[3])[1] + ' a month · renews Nov 1 · ' + (PLANS.find(x => x[0] === plan) || PLANS[3])[2].toLowerCase(), 'Change plan', dlg({ kind: 'plan', val: plan })), bt('Payment method', 'Visa ending 4242', 'Update card', dlg({ kind: 'card' })), bt('Invoices', 'Emailed to ' + me.email + ' each month', 'View invoices', dlg({ kind: 'invoices' }))] }]
        };
        return { stgCols: ((S.vw || 1280) - (S.navC ? 72 : 264)) < 640 ? 'minmax(0,1fr)' : '200px minmax(0,1fr)', stgCrumb: lab[tab], stgToast: !!S.stgToast, stgToastText: S.stgToast || '',
          stgNav: NAV.map(([label, items]) => ({ label, items: items.map(([k, l]) => ({ label: l, icon: ic[k], aria: k === tab ? 'page' : undefined, bg: k === tab ? '#e6ebf2' : 'transparent', fw: k === tab ? 700 : 500, c: k === tab ? '#0b1626' : '#45505f', ic: k === tab ? '#1f6be2' : '#5a6474', pick: () => app.setState({ stgTab: k }) })) })),
          ...dialogVals(app, S, { toast, me, agency, members, conns, C }),
          stgGroups: G[tab].map(g => ({ hasLogo: !!g.logo, logo: g.logo || '', hasSub: !!g.sub, sub: g.sub || [], subLabel: g.subLabel || '', subOpen: !!g.subOpen, subChev: g.subChev || '', subRows: g.subRows || '0fr', subToggle: g.subToggle, title: g.title, hasChecks: !!g.checks, checkTitle: g.checkTitle || '', checks: (g.checks || []).map(x => ({ ...x, ls: clSplit(x.label) })), rows: g.rows.map(r => ({ isToggle: false, isSelect: false, isBtn: false, isPrimary: false, ...r, ts: clSplit(r.t), ds: clSplit(r.d) })) })) };
      })(),
  };
}

// Values for the settings dialog (one dialog at a time, chosen by S.dlg.kind).
function dialogVals(app, S, { toast, me, agency, members, conns, C }) {
  const D = S.dlg, err = S.dlgErr;
  const close = () => { clearTimeout(app.cnT); app.setState({ dlg: null, dlgErr: null }); };
  const base = { dlgOpen: !!D, dlgClose: close, dlgBackdrop: e => { if (e.target === e.currentTarget) close(); }, dlgErr: err || '', dlgHasErr: !!err };
  if (!D) return { ...base, dlgTitle: '', dlgText: '', dlgTools: [], dlgPlans: [], dlgInvoices: [], dlgRoles: [] };
  const set = o => app.setState(s => s.dlg ? { dlg: { ...s.dlg, ...o }, dlgErr: null } : null);
  const k = D.kind;
  const T = {
    name: ['Edit your name', 'This is how teammates and clients see you.', 'Save name'],
    email: ['Change your email', 'We will send a confirmation link to the new address. Your email changes once you click it.', 'Send confirmation link'],
    agency: ['Edit agency', 'Clients see this name on every report.', 'Save agency'],
    invite: ['Invite a teammate', 'They get an email to join ' + agency + '.', 'Send invite'],
    disconnect: ['Disconnect ' + ((conns[D.tool] || [])[0] || ''), 'Clario stops pulling data from every account in this connection. Clients using these accounts show no new numbers until you connect again. Past reports stay as they are.', 'Disconnect'],
    connect: ['Connect a tool', 'Sign in once with your agency login. Clario finds every account you manage and only reads the data.', 'Connect'],
    plan: ['Change plan', 'You pay per number of clients. Changes apply from your next invoice.', 'Switch plan'],
    card: ['Update payment method', 'Card details are entered on our payment provider\'s secure page. Clario never sees or stores your card number.', 'Continue to secure page'],
    invoices: ['Invoices', 'Every invoice is also emailed to ' + me.email + '.', 'Done']
  }[k];
  const submit = e => {
    if (e) e.preventDefault();
    const val = (D.val || '').trim();
    if (k === 'name') { if (!val) return app.setState({ dlgErr: 'Enter your name.' }); app.setState({ me: { ...me, name: val } }); close(); return toast('Name updated'); }
    if (k === 'email') { if (!emailOk(val)) return app.setState({ dlgErr: 'Enter a valid email, like name@agency.com.' }); close(); return toast('Confirmation link sent to ' + val); }
    if (k === 'agency') { if (!val) return app.setState({ dlgErr: 'Enter your agency name.' }); app.setState({ agName: val }); close(); return toast('Agency name updated'); }
    if (k === 'invite') { if (!emailOk(val)) return app.setState({ dlgErr: 'Enter a valid email, like name@agency.com.' }); if (members.some(m => m[1] === val)) return app.setState({ dlgErr: 'That person is already on your team.' }); app.setState({ members: [...members, [val.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), val, D.role || 'Member']] }); close(); return toast('Invite sent to ' + val); }
    if (k === 'disconnect') { const name = conns[D.tool][0]; app.setState(s => ({ connOff: { ...(s.connOff || {}), [D.tool]: true }, connOn: { ...(s.connOn || {}), [D.tool]: false } })); close(); return toast(name + ' disconnected'); }
    if (k === 'connect') {
      if (!D.tool) return app.setState({ dlgErr: 'Pick a tool to connect.' });
      if (D.tool === 'ig') return app.setState({ dlgErr: 'Instagram ads live in your Meta ad accounts. Connect Meta to report on them.' });
      set({ st: 'signing' }); clearTimeout(app.cnT);
      const tool = D.tool;
      // The sign-in may be cancelled while it runs. Only finish if this connect dialog is still open.
      app.cnT = setTimeout(() => app.setState(s => s.dlg && s.dlg.kind === 'connect' && s.dlg.tool === tool ? { connOn: { ...(s.connOn || {}), [tool]: true }, connOff: { ...(s.connOff || {}), [tool]: false }, dlg: { ...s.dlg, st: 'done' }, dlgErr: null } : null), 1200);
      return;
    }
    if (k === 'plan') { app.setState({ plan: D.val }); close(); return toast('You are now on the ' + D.val + ' plan'); }
    if (k === 'card') { close(); return toast('Secure card page opens here once billing is connected'); }
    close();
  };
  const found = D.tool ? ((MORE_ACCTS[D.tool] || ACCTS[D.tool] || [0, 0, 0, []])[3].length) : 0;
  return { ...base,
    dlgTitle: k === 'connect' && D.st === 'done' ? (TOOLS.find(t => t[0] === D.tool) || [])[1] + ' is connected' : T[0],
    dlgText: k === 'connect' && D.st === 'done' ? found + (found === 1 ? ' account' : ' accounts') + ' found. Assign each one to a client below.' : T[1],
    dlgSubmitLabel: k === 'connect' && D.st === 'signing' ? 'Signing in…' : k === 'connect' && D.st === 'done' ? 'Assign accounts' : T[2],
    dlgDanger: k === 'disconnect', dlgSubmitBg: k === 'disconnect' ? '#a3330c' : '#1f6be2',
    dlgSubmit: k === 'connect' && D.st === 'done' ? e => { e.preventDefault(); app.setState(s => ({ stgOpen: { ...(s.stgOpen || {}), [D.tool]: true } })); close(); } : submit,
    dlgShowCancel: k !== 'invoices' && !(k === 'connect' && D.st === 'done'),
    dlgHasInput: ['name', 'email', 'agency', 'invite'].includes(k), dlgInputLabel: { name: 'Your name', email: 'New email', agency: 'Agency name', invite: 'Their work email' }[k] || '',
    dlgInputType: k === 'email' || k === 'invite' ? 'email' : 'text', dlgPlaceholder: k === 'invite' || k === 'email' ? 'name@agency.com' : '',
    dlgVal: D.val || '', dlgSetVal: e => set({ val: e.target.value }), dlgInputBd: err ? '#e0481a' : '#d3dbe6',
    dlgHasRoles: k === 'invite', dlgRoles: ['Member', 'Admin'].map(r => ({ label: r, desc: r === 'Admin' ? 'Can manage clients, integrations and billing' : 'Can edit and send reports', on: (D.role || 'Member') === r, bd: (D.role || 'Member') === r ? '#1f6be2' : '#d3dbe6', bg: (D.role || 'Member') === r ? '#eef3fd' : '#ffffff', pick: () => set({ role: r }) })),
    dlgHasTools: k === 'connect' && D.st === 'pick', dlgTools: TOOLS.map(([id, label, desc]) => { const conn = !!conns[id], on = D.tool === id; return { label, desc: conn ? 'Already connected' : desc, logo: LOGOS[id], disabled: conn, on, bd: on ? '#1f6be2' : '#e6ebf2', bg: on ? '#eef3fd' : conn ? '#f4f7fb' : '#ffffff', o: conn ? 0.6 : 1, pick: () => { if (!conn) set({ tool: id }); } }; }),
    dlgSigning: k === 'connect' && D.st === 'signing',
    dlgHasPlans: k === 'plan', dlgPlans: PLANS.map(([n, price, note]) => { const on = D.val === n; return { label: n, price: price + ' a month', note, on, bd: on ? '#1f6be2' : '#e6ebf2', bg: on ? '#eef3fd' : '#ffffff', pick: () => set({ val: n }) }; }),
    dlgHasInvoices: k === 'invoices', dlgInvoices: INVOICES.map(([date, amt]) => ({ date, amt, download: () => {
      const html = '<!doctype html><meta charset="utf-8"><title>Invoice ' + date + '</title><body style="font-family:sans-serif;padding:40px"><h1>Clario invoice</h1><p>' + agency + '<br>' + me.email + '</p><p>Date: ' + date + '</p><p>Agency plan, monthly: <strong>' + amt + '</strong></p><p>Paid with Visa ending 4242.</p></body>';
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' })); a.download = 'clario-invoice-' + date.replace(/[ ,]+/g, '-').toLowerCase() + '.html'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    } }))
  };
}
