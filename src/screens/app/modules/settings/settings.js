// Settings, including integrations.
import { assignAccountAction, disconnectAction } from '@/app/actions/integrations';
import { renameMeAction, renameAgencyAction, inviteAction, setRoleAction } from '@/app/actions/agency';
import { signOutAction, forgotAction } from '@/app/actions/auth';
import { connList, nextConn, toolAccts, acctFor, acctKey, clSplit, LOGOS, TOOL_NAMES, MULTI } from '../../data';

const TOOLS = [['meta', 'Meta', 'Facebook and Instagram ads'], ['ga4', 'Google Analytics 4', 'Website visits and conversions'], ['gads', 'Google Ads', 'Search, display and Performance Max'], ['tt', 'TikTok Ads', 'Video ads on TikTok'], ['sc', 'Google Search Console', 'Organic search clicks and rankings'], ['li', 'LinkedIn Ads', 'Sponsored content and lead forms'], ['ms', 'Microsoft Ads', 'Bing search ads'], ['gbp', 'Google Business Profile', 'Calls, directions and website clicks']];
// What one Google login gives access to, per tool.
const UNIT = { ga4: 'property', gads: 'ad account', sc: 'site', gbp: 'location' };
const CHANNELS = ['#client-alerts', '#marketing-team', '#general'];
const PLANS = [['Free', '$0', 'Up to 2 clients'], ['Solo', '$19', 'Up to 5 clients'], ['Studio', '$49', 'Up to 20 clients'], ['Agency', '$99', 'Unlimited clients and teammates']];
const INVOICES = [['Oct 1, 2026', '$79.00'], ['Sep 1, 2026', '$79.00'], ['Aug 1, 2026', '$79.00']];
const emailOk = x => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((x || '').trim());

export function settingsVals(app, ctx) {
  // eslint-disable-next-line no-unused-vars
  // SL is the state plus live (server) data, so connection helpers read real connections when the agency is live.
  const { SL: S, live, refresh, v, go, ST, L, C, clients, inDash, rkCount, atRisk, defTasks, TCOLS, PEOPLE, tkSrc, setTasks, moveTask, tasksAll } = ctx;
  return {
      vSet: v === 'settings', ...(() => {
        const tab = S.stgTab || 'general', on = S.stg || {}, sel = S.stgSel || {};
        const toast = t => { clearTimeout(app.stT); app.setState({ stgToast: t }); app.stT = setTimeout(() => app.setState({ stgToast: null }), 3000); };
        const ic = { profile: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0', general: 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0', conn: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1', agency: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6', members: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8', security: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4', billing: 'M3 6h18v12H3zM3 10h18' };
        const NAV = [['Account', [['profile', 'My profile'], ['general', 'Notifications']]], ['Workspace', [['agency', 'Agency and branding'], ['conn', 'Integrations'], ['members', 'Team members'], ['security', 'Security'], ['billing', 'Plan and billing']]]];
        const lab = Object.fromEntries(NAV.flatMap(g => g[1]));
        const tg = (k, t, d, def) => { const v2 = k in on ? on[k] : def; return { t, d, isToggle: true, on: v2, tBg: v2 ? '#1f6be2' : '#d3dbe6', tX: v2 ? 18 : 0, toggle: () => app.setState(s => ({ stg: { ...(s.stg || {}), [k]: !v2 } })) }; };
        const sl = (k, t, d, opts) => ({ t, d, isSelect: true, opts, val: sel[k] || opts[0], set: e => { const x = e.target.value; app.setState(s => ({ stgSel: { ...(s.stgSel || {}), [k]: x } })); } });
        const bt = (t, d, btnLabel, act, primary) => ({ t, d, isBtn: !primary, isPrimary: !!primary, btnLabel, btn: typeof act === 'function' ? act : () => toast(act) });
        const dlg = o => () => app.setState({ dlg: o, dlgErr: null });
        const me = S.me, agency = S.agName, members = S.members || [], plan = S.plan || 'Agency', manager = me.role !== 'Member';
        const conns = connList(S);
        const ck = (k, label, def) => { const v2 = k in on ? on[k] : def; return { label, on: v2, bg: v2 ? '#1f6be2' : '#ffffff', bd: v2 ? '#1f6be2' : '#97a2b2', o: v2 ? 1 : 0, toggle: () => app.setState(s => ({ stg: { ...(s.stg || {}), [k]: !v2 } })) }; };
        const G = {
          profile: [{ title: 'My profile', rows: [bt(me.name, me.role + ' at ' + agency, 'Edit name', dlg({ kind: 'name', val: me.name })), { t: 'Email', d: me.email },
            bt('Password', 'We email you a link to choose a new one.', 'Reset password', () => forgotAction(me.email).then(() => toast('We emailed a reset link to ' + me.email))),
            bt('Sign out', 'Sign out of AI Ads Analyst on this device.', 'Sign out', () => signOutAction())] }],
          general: [{ title: 'My notifications', checkTitle: 'Tell me when…', checks: [ck('a0', 'A client gets 20% fewer leads than usual', true), ck('a1', 'Cost per lead goes over a goal', true), ck('a2', 'Spend is 15% ahead or behind budget', true), ck('a3', 'An account disconnects and data stops', true), ck('a4', 'Analyst flags a client as at risk', true)],
              rows: [tg('n0', 'In Ask Analyst', 'Analyst messages you in the chat with what happened and what to do.', true), tg('n1', 'By email', 'Alerts go to ' + me.email + ' as they happen.', true), tg('n2', 'Weekly summary email', 'A Monday morning email with every client\'s results.', true), tg('n3', 'Slack direct messages', S.slack ? 'Also DM me in Slack. The team channel is set in Integrations.' : 'Connect Slack in Integrations first. Alerts then post to a team channel, and Analyst can DM you too.', false)] },
            { title: 'My preferences', rows: [sl('lang', 'Language', 'Used across the app and in AI replies.', ['English', 'Español', 'Français']), sl('tz', 'Time zone', 'Report schedules and alerts follow this time.', ['Eastern time (New York)', 'Central time (Chicago)', 'Pacific time (Los Angeles)']), sl('cur', 'Currency', 'Shown on spend, budgets and cost per lead.', ['USD ($)', 'EUR (€)', 'GBP (£)'])] }],
          conn: TOOLS.map(t => t[0]).filter(t => conns.some(c => c.tool === t)).map(tool => {
            const mine = conns.filter(c => c.tool === tool), all = toolAccts(S, tool), open = !!(S.stgOpen || {})[tool], many = mine.length > 1, pend = S.connPend || {};
            const rows = mine.map(c => {
              const nA = c.accts.filter((_, j) => acctFor(sel, c, j)).length;
              if (c.live) { const err = c.status === 'error' ? ' ' + (c.error || 'This login stopped working.') : '';
                return { ...bt('Connected as ' + c.who, 'Connected by ' + c.by + ' · ' + c.sync + ' · ' + nA + ' of ' + c.accts.length + (c.accts.length === 1 ? ' property' : ' properties') + ' assigned to clients.' + err, 'Reconnect', () => { window.location.href = '/api/integrations/google/start?hint=' + encodeURIComponent(c.who); }), hasBtn2: true, btn2Label: 'Disconnect', btn2: dlg({ kind: 'disconnect', id: c.id }) }; }
              const note = pend[c.id] ? ' Waiting for ' + pend[c.id] + ' to sign in again.' : tool === 'meta' && !c.sys ? ' It stops working if ' + c.by.split(' ')[0] + ' leaves or loses access. A system user is safer.' : '';
              return { ...bt('Connected as ' + c.who, (c.sys ? 'System user, not tied to a person' : 'Connected by ' + c.by) + ' · ' + c.sync + ' · ' + nA + ' of ' + c.accts.length + ' accounts assigned to clients.' + note, 'Reconnect', dlg({ kind: 'reconnect', id: c.id, who: tool === 'meta' && !c.sys ? 'sys' : me.name })), hasBtn2: true, btn2Label: 'Disconnect', btn2: dlg({ kind: 'disconnect', id: c.id }) };
            });
            if (MULTI.includes(tool)) rows.push(nextConn(S, tool) ? bt('Add another Google login', 'Clients share ' + TOOL_NAMES[tool] + ' with whichever teammate asked. Add each login so every ' + UNIT[tool] + ' shows up.', 'Add login', live ? () => { window.location.href = '/api/integrations/google/start'; } : dlg({ kind: 'connect', tool, st: 'pick', another: true })) : { t: 'Add another Google login', d: 'Every teammate\'s Google login is connected.' });
            return { title: TOOL_NAMES[tool], logo: L[tool], rows,
              subLabel: (open ? 'Hide ' : 'Show ') + all.length + (all.length === 1 ? ' account' : ' accounts'), subOpen: open, subChev: open ? 'rotate(180deg)' : 'rotate(0deg)', subRows: open ? '1fr' : '0fr', subToggle: () => app.setState(st => ({ stgOpen: { ...(st.stgOpen || {}), [tool]: !open } })),
              sub: all.map(({ conn: c, j, a: [an, id], client }) => { const k = acctKey(c.id, j); return { t: an, d: id + (many ? ' · via ' + c.who : ''), aria: 'Client for ' + an, opts: ['Not assigned'].concat(C.map(x => x.name)), val: client || 'Not assigned', c: client ? '#0b1626' : '#5a6474', set: ev => { const x = ev.target.value; app.setState(st => ({ stgSel: { ...(st.stgSel || {}), [k]: x === 'Not assigned' ? '' : x } }));
                if (c.live) assignAccountAction({ accountId: c.acctIds[j], clientId: x === 'Not assigned' ? null : (live.clients.find(y => y.name === x) || {}).id || null }).then(r => { if (r.error) { toast(r.error); app.setState(st => { const o = { ...(st.stgSel || {}) }; delete o[k]; return { stgSel: o }; }); } else refresh(); }); } }; }) };
          }).concat(live ? [] : [{ title: 'Slack', rows: S.slack ? [sl('slackCh', 'Alert channel', 'Risk and performance alerts post here for the whole team.', CHANNELS), bt('Connected to the ' + agency + ' Slack', 'Installed by ' + S.slack.by + '. Teammates can also get alerts as direct messages from Notifications.', 'Disconnect', () => { app.setState({ slack: null }); toast('Slack disconnected'); })]
              : [bt('Post alerts to a Slack channel', 'Install AI Ads Analyst in your Slack workspace once, then pick the channel your team watches.', 'Connect Slack', dlg({ kind: 'slack', who: CHANNELS[0] }), true)] }]).concat([
            { title: 'Add a tool', rows: [bt('Connect a new tool', 'Only the owner and admins can connect or change tools. Every teammate sees the data in reports.', 'Connect a tool', dlg({ kind: 'connect', tool: null, st: 'pick' }), true)] }]),
          agency: [{ title: 'Agency', rows: [manager ? bt(agency, C.length + ' clients · ' + members.length + ' teammates', 'Edit agency', dlg({ kind: 'agency', val: agency })) : { t: agency, d: C.length + ' clients · ' + members.length + ' teammates' }, bt('Report branding', 'Your logo and colour are set when you create your first report. Change them anytime from Design in the report editor.', 'Open reports', () => app.setState({ view: 'templates' }))] },
            { title: 'Client portal', rows: [tg('portal', 'Client portal', 'A secure login where clients see every report you have sent them.', true), sl('rsched', 'Default report schedule', 'New clients start with this schedule.', ['Mondays, 8:00am', 'Fridays, 4:00pm', 'First of the month']), sl('rtone', 'Default report tone', 'How Analyst writes reports for new clients.', ['Friendly', 'Professional', 'Short and direct'])] }],
          members: [{ title: 'Team members', rows: members.map(m => {
              const label = m.pending ? 'Invited · joins when they sign up with this email' : m.email;
              if (m.role === 'Owner' || m.id === me.id || !manager) return { t: m.name + (m.id === me.id ? ' (you)' : ''), d: label + ' · ' + m.role };
              return { t: m.name, d: label, isSelect: true, opts: [m.role, m.role === 'Admin' ? 'Member' : 'Admin', 'Remove from team'], val: m.role, set: ev => { const x = ev.target.value;
                setRoleAction({ userId: m.id || undefined, email: m.pending ? m.email : undefined, role: x }).then(r => { if (r.error) return toast(r.error);
                  app.setState({ members: x === 'Remove from team' ? members.filter(o => o !== m) : members.map(o => o === m ? { ...o, role: x } : o) });
                  toast(x === 'Remove from team' ? m.name + ' was removed from ' + agency : m.name + ' is now ' + (x === 'Admin' ? 'an admin' : 'a member')); }); } };
            }).concat(manager ? [bt('Invite a teammate', 'They join ' + agency + ' when they sign up with the email you enter.', 'Invite', dlg({ kind: 'invite', val: '', role: 'Member' }), true)] : []) }],
          security: [{ title: 'Security', rows: [tg('2fa', 'Two-step sign-in', 'Ask for a code from your phone each time you sign in.', false), tg('sso', 'Google sign-in for the team', 'Teammates sign in with their riveradigital.com Google account.', true), bt('Signed-in devices', S.signedOut ? '1 device · this Mac' : '2 devices · this Mac and an iPhone', 'Sign out others', () => { app.setState({ signedOut: true }); toast('Your iPhone was signed out'); })] }],
          billing: [{ title: 'Plan and billing', rows: [bt(plan + ' plan', (PLANS.find(x => x[0] === plan) || PLANS[3])[1] + ' a month · renews Nov 1 · ' + (PLANS.find(x => x[0] === plan) || PLANS[3])[2].toLowerCase(), 'Change plan', dlg({ kind: 'plan', val: plan })), bt('Payment method', 'Visa ending 4242', 'Update card', dlg({ kind: 'card' })), bt('Invoices', 'Emailed to ' + me.email + ' each month', 'View invoices', dlg({ kind: 'invoices' }))] }]
        };
        return { stgCols: ((S.vw || 1280) - (S.navC ? 72 : 264)) < 640 ? 'minmax(0,1fr)' : '200px minmax(0,1fr)', stgCrumb: lab[tab], stgToast: !!S.stgToast, stgToastText: S.stgToast || '',
          stgNav: NAV.map(([label, items]) => ({ label, items: items.map(([k, l]) => ({ label: l, icon: ic[k], aria: k === tab ? 'page' : undefined, bg: k === tab ? '#e6ebf2' : 'transparent', fw: k === tab ? 700 : 500, c: k === tab ? '#0b1626' : '#45505f', ic: k === tab ? '#1f6be2' : '#5a6474', pick: () => app.setState({ stgTab: k }) })) })),
          ...dialogVals(app, S, { toast, me, agency, members, conns, C, live, refresh }),
          stgGroups: G[tab].map(g => ({ hasLogo: !!g.logo, logo: g.logo || '', hasSub: !!g.sub, sub: g.sub || [], subLabel: g.subLabel || '', subOpen: !!g.subOpen, subChev: g.subChev || '', subRows: g.subRows || '0fr', subToggle: g.subToggle, title: g.title, hasChecks: !!g.checks, checkTitle: g.checkTitle || '', checks: (g.checks || []).map(x => ({ ...x, ls: clSplit(x.label) })), rows: g.rows.map(r => ({ isToggle: false, isSelect: false, isBtn: false, isPrimary: false, ...r, ts: clSplit(r.t), ds: clSplit(r.d) })) })) };
      })(),
  };
}

// Values for the settings dialog (one dialog at a time, chosen by S.dlg.kind).
function dialogVals(app, S, { toast, me, agency, members, conns, C, live, refresh }) {
  const D = S.dlg, err = S.dlgErr;
  const close = () => { clearTimeout(app.cnT); app.setState({ dlg: null, dlgErr: null }); };
  const base = { dlgOpen: !!D, dlgClose: close, dlgBackdrop: e => { if (e.target === e.currentTarget) close(); }, dlgErr: err || '', dlgHasErr: !!err };
  if (!D) return { ...base, dlgTitle: '', dlgText: '', dlgTools: [], dlgPlans: [], dlgInvoices: [], dlgRoles: [] };
  const set = o => app.setState(s => s.dlg ? { dlg: { ...s.dlg, ...o }, dlgErr: null } : null);
  const k = D.kind, signing = D.st === 'signing';
  const cn = conns.find(c => c.id === D.id) || { tool: '', who: '', accts: [] }, tn = TOOL_NAMES[cn.tool] || '';
  // Only the owner and admins can own a connection. Meta can also use a Business Manager system user.
  const owners = (cn.tool === 'meta' ? [['sys', 'System user', 'Owned by your Business Manager, not a person. It keeps working when people leave and does not expire.']] : [])
    .concat([me].concat(members.filter(m => !m.pending && m.id !== me.id && m.role !== 'Member')).map(m => m === me ? [me.name, 'You (' + me.name + ')', 'Sign in again with your own login.'] : [m.name, m.name, 'We email them a link to sign in.']));
  const done = k === 'connect' && D.st === 'done', added = conns.find(c => c.id === D.conn);
  const T = {
    name: ['Edit your name', 'This is how teammates and clients see you.', 'Save name'],
    email: ['Change your email', 'We will send a confirmation link to the new address. Your email changes once you click it.', 'Send confirmation link'],
    agency: ['Edit agency', 'Clients see this name on every report.', 'Save agency'],
    invite: ['Invite a teammate', 'They get an email to join ' + agency + '.', 'Send invite'],
    disconnect: ['Disconnect ' + tn, 'Analyst stops pulling data from every account ' + cn.who + ' can see. Clients using these accounts show no new numbers until you connect again. Past reports stay as they are.', 'Disconnect'],
    connect: D.another ? ['Add another Google login', 'Sign in with the Google login a client shared their ' + (UNIT[D.tool] || 'account') + ' with. Analyst adds what it can see and remembers which login reads each one.', 'Sign in with Google'] : ['Connect a tool', 'Sign in once with your agency login. Analyst finds every account you manage. It only reads your data and never changes your ads.', 'Connect'],
    reconnect: ['Reconnect ' + tn, 'Choose who owns this connection. Every account stays assigned to its client while you switch.', 'Reconnect'],
    slack: ['Connect Slack', 'AI Ads Analyst installs once for ' + agency + '. Pick the channel your team watches for alerts.', 'Continue to Slack'],
    plan: ['Change plan', 'You pay per number of clients. Changes apply from your next invoice.', 'Switch plan'],
    card: ['Update payment method', 'Card details are entered on our payment provider\'s secure page. AI Ads Analyst never sees or stores your card number.', 'Continue to secure page'],
    invoices: ['Invoices', 'Every invoice is also emailed to ' + me.email + '.', 'Done']
  }[k];
  // Fake the provider's sign-in. Only finish if the same dialog is still open.
  const signIn = (fn, after) => { set({ st: 'signing' }); clearTimeout(app.cnT); app.cnT = setTimeout(() => { const s = app.state; if (!s.dlg || s.dlg.kind !== k || s.dlg.st !== 'signing') return; app.setState(fn(s)); if (after) toast(after); }, 1200); };
  const submit = e => {
    if (e) e.preventDefault();
    const val = (D.val || '').trim();
    if (k === 'name') { if (!val) return app.setState({ dlgErr: 'Enter your name.' }); return renameMeAction(val).then(r => { if (r.error) return app.setState({ dlgErr: r.error }); app.setState({ me: { ...me, name: val } }); close(); toast('Name updated'); }); }
    if (k === 'email') { if (!emailOk(val)) return app.setState({ dlgErr: 'Enter a valid email, like name@agency.com.' }); close(); return toast('Confirmation link sent to ' + val); }
    if (k === 'agency') { if (!val) return app.setState({ dlgErr: 'Enter your agency name.' }); return renameAgencyAction(val).then(r => { if (r.error) return app.setState({ dlgErr: r.error }); app.setState({ agName: val }); close(); toast('Agency name updated'); }); }
    if (k === 'invite') { if (!emailOk(val)) return app.setState({ dlgErr: 'Enter a valid email, like name@agency.com.' }); const em = val.toLowerCase(); if (members.some(m => m.email === em)) return app.setState({ dlgErr: 'That person is already on your team.' }); return inviteAction({ email: em, role: D.role || 'Member' }).then(r => { if (r.error) return app.setState({ dlgErr: r.error }); app.setState({ members: [...members, { id: '', name: em, email: em, role: D.role || 'Member', pending: true }] }); close(); toast(em + ' can now join by signing up with that email'); }); }
    if (k === 'disconnect' && cn.live) return disconnectAction(D.id).then(r => { if (r.error) return app.setState({ dlgErr: r.error }); close(); toast(tn + ' disconnected from ' + cn.who); refresh(); });
    if (k === 'disconnect') { app.setState(s => ({ connOff: { ...(s.connOff || {}), [D.id]: true }, connOn: { ...(s.connOn || {}), [D.id]: false }, connPend: { ...(s.connPend || {}), [D.id]: null } })); close(); return toast(tn + ' disconnected from ' + cn.who); }
    if (k === 'connect') {
      if (!D.tool) return app.setState({ dlgErr: 'Pick a tool to connect.' });
      const c = nextConn(S, D.tool);
      if (c && c.start) { set({ st: 'signing' }); window.location.href = '/api/integrations/google/start'; return; }
      if (!c) return app.setState({ dlgErr: live ? TOOL_NAMES[D.tool] + ' isn\'t available yet.' : TOOL_NAMES[D.tool] + ' is already connected.' });
      return signIn(s => ({ connOn: { ...(s.connOn || {}), [c.id]: true }, connOff: { ...(s.connOff || {}), [c.id]: false }, connBy: c.base ? s.connBy : { ...(s.connBy || {}), [c.id]: { by: me.name } }, dlg: { ...s.dlg, st: 'done', conn: c.id }, dlgErr: null }));
    }
    if (k === 'reconnect') {
      const who = D.who || owners[0][0];
      if (who !== 'sys' && who !== me.name) { app.setState(s => ({ connPend: { ...(s.connPend || {}), [D.id]: who } })); close(); return toast('We emailed ' + who + ' a link to reconnect ' + tn + '. Accounts stay assigned meanwhile.'); }
      return signIn(s => ({ connBy: { ...(s.connBy || {}), [D.id]: who === 'sys' ? { by: agency + ' system user', sys: true, sync: 'Synced just now' } : { by: me.name, sys: false, sync: 'Synced just now' } }, connPend: { ...(s.connPend || {}), [D.id]: null }, dlg: null, dlgErr: null }), tn + ' reconnected' + (who === 'sys' ? ' with a system user' : ''));
    }
    if (k === 'slack') { const ch = D.who || CHANNELS[0]; return signIn(s => ({ slack: { by: me.name }, stgSel: { ...(s.stgSel || {}), slackCh: ch }, dlg: null, dlgErr: null }), 'Slack connected. Alerts post to ' + ch); }
    if (k === 'plan') { app.setState({ plan: D.val }); close(); return toast('You are now on the ' + D.val + ' plan'); }
    if (k === 'card') { close(); return toast('Secure card page opens here once billing is connected'); }
    close();
  };
  const found = added ? added.accts.length : 0;
  const radios = k === 'invite' ? ['Member', 'Admin'].map(r => [r, r, r === 'Admin' ? 'Can manage clients, integrations and billing' : 'Can edit and send reports'])
    : k === 'reconnect' ? owners : k === 'slack' ? CHANNELS.map(c => [c, c, c === CHANNELS[0] ? 'Suggested. A channel just for client alerts.' : 'Shared with other conversations.']) : [];
  const picked = k === 'invite' ? D.role || 'Member' : D.who || (radios[0] || [])[0];
  return { ...base,
    dlgTitle: done ? (D.another ? added.who : TOOL_NAMES[D.tool]) + ' is connected' : T[0],
    dlgText: done ? found + (found === 1 ? ' account' : ' accounts') + ' found. ' + (D.from ? 'Pick the ones that belong to this client.' : 'Assign each one to a client below.') : T[1],
    dlgSubmitLabel: signing ? 'Signing in…' : done ? (D.from ? 'Back to the client' : 'Assign accounts') : T[2],
    dlgDanger: k === 'disconnect', dlgSubmitBg: k === 'disconnect' ? '#a3330c' : '#1f6be2',
    dlgSubmit: done ? e => { e.preventDefault(); app.setState(s => ({ stgOpen: { ...(s.stgOpen || {}), [D.tool]: true } })); close(); } : submit,
    dlgShowCancel: k !== 'invoices' && !done,
    dlgHasInput: ['name', 'email', 'agency', 'invite'].includes(k), dlgInputLabel: { name: 'Your name', email: 'New email', agency: 'Agency name', invite: 'Their work email' }[k] || '',
    dlgInputType: k === 'email' || k === 'invite' ? 'email' : 'text', dlgPlaceholder: k === 'invite' || k === 'email' ? 'name@agency.com' : '',
    dlgVal: D.val || '', dlgSetVal: e => set({ val: e.target.value }), dlgInputBd: err ? '#e0481a' : '#d3dbe6',
    dlgHasRoles: radios.length > 0 && !signing, dlgRoleLegend: { invite: 'Role', reconnect: 'Who owns the connection', slack: 'Alert channel' }[k] || '',
    dlgRoles: radios.map(([id, label, desc]) => ({ label, desc, on: picked === id, bd: picked === id ? '#1f6be2' : '#d3dbe6', bg: picked === id ? '#eef3fd' : '#ffffff', pick: () => set(k === 'invite' ? { role: id } : { who: id }) })),
    dlgHasTools: k === 'connect' && D.st === 'pick' && !D.another, dlgTools: TOOLS.map(([id, label, desc]) => { const nx = nextConn(S, id), live = conns.some(c => c.tool === id), on = D.tool === id; return { label, desc: S.live ? (id === 'ga4' ? (live ? 'Add another Google login' : 'Sign in with Google') : 'Coming soon') : !nx ? 'Already connected' : live ? 'Add another Google login' : desc, logo: LOGOS[id], disabled: !nx, on, bd: on ? '#1f6be2' : '#e6ebf2', bg: on ? '#eef3fd' : !nx ? '#f4f7fb' : '#ffffff', o: !nx ? 0.6 : 1, pick: () => { if (nx) set({ tool: id }); } }; }),
    dlgSigning: signing, dlgSignText: k === 'slack' ? 'Waiting for Slack to confirm the install…' : 'Waiting for you to sign in…',
    dlgHasPlans: k === 'plan', dlgPlans: PLANS.map(([n, price, note]) => { const on = D.val === n; return { label: n, price: price + ' a month', note, on, bd: on ? '#1f6be2' : '#e6ebf2', bg: on ? '#eef3fd' : '#ffffff', pick: () => set({ val: n }) }; }),
    dlgHasInvoices: k === 'invoices', dlgInvoices: INVOICES.map(([date, amt]) => ({ date, amt, download: () => {
      const html = '<!doctype html><meta charset="utf-8"><title>Invoice ' + date + '</title><body style="font-family:sans-serif;padding:40px"><h1>AI Ads Analyst invoice</h1><p>' + agency + '<br>' + me.email + '</p><p>Date: ' + date + '</p><p>Agency plan, monthly: <strong>' + amt + '</strong></p><p>Paid with Visa ending 4242.</p></body>';
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' })); a.download = 'ai-ads-analyst-invoice-' + date.replace(/[ ,]+/g, '-').toLowerCase() + '.html'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    } }))
  };
}
