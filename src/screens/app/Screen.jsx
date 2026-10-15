'use client';
// Behaviour for AppScreen, ported from design/App.dc.html.
import React from 'react';
import { useRouter } from 'next/navigation';
import View, { css } from './View';
import { FEATURES } from './modules';
import { clSplit, TCOLS, PEOPLE, DEF_TASKS, LOGOS, clientTools } from './data';
import { makeMetrics, pct } from './metrics';


class Logic extends React.Component {
  static defaultProps = {};

  // The signed-in person, their agency and team arrive as props from the server page.
  state = { me: this.props.me, agName: this.props.agency?.name, brandLogo: this.props.agency?.brandLogo || null, brandColor: this.props.agency?.brandColor || '#1f6be2', members: this.props.team, tasks: this.props.live ? [] : null, view: 'an', sel: null, swOpen: false, cid: 0, tab: 0, open: { reporting: false, monitoring: true, risk: false, workflow: false, ai: false }, sent: {}, toggles: { a0: true, a1: true, a2: false, a3: true, b0: true }, tasks: null, newTask: '', prompt: '', outline: false, gen: false, tpl: 'Reassuring', pageO: 1 };
  componentDidMount() {
    // Back from Google sign-in for GA4: open Integrations and say what happened, then tidy the address bar.
    try { const q = new URLSearchParams(window.location.search); if (q.get('integration') === 'google') {
      const n = Number(q.get('found') || 0), msg = { connected: 'Google Analytics connected as ' + q.get('login') + '. ' + n + (n === 1 ? ' property' : ' properties') + ' found. Link each one to a client below.', cancelled: 'Google sign-in was cancelled. Nothing changed.', noscope: 'Google didn\'t share Analytics access. Connect again and tick the Google Analytics box.', expired: 'That sign-in took too long. Try connecting again.', forbidden: 'Only the owner and admins can connect tools.', unconfigured: 'Google sign-in isn\'t set up on this server yet.', apidisabled: 'The Google Analytics Admin API is turned off in the Google Cloud project. Turn it on and connect again.', failed: 'Google didn\'t finish connecting. Try again.' }[q.get('result')] || 'Google didn\'t finish connecting. Try again.';
      this.setState({ view: 'settings', stgTab: 'conn', stgOpen: { ga4: true }, stgToast: msg }); this.stT = setTimeout(() => this.setState({ stgToast: null }), 9000);
      window.history.replaceState(null, '', '/app'); } } catch (e) {}
    try { const r = new URLSearchParams(window.location.search).get('report'); if (r != null && /^\d+$/.test(r)) this.setState({ view: 'repview', repIdx: Number(r) }); } catch (e) {}
    this._hs = () => { const y = (document.scrollingElement || document.documentElement).scrollTop > 8; if (y !== !!this.state.hdrStuck) this.setState({ hdrStuck: y }); }; window.addEventListener('scroll', this._hs, { passive: true });
    this._ctxClose = e => { if (this.state.ctx && !e.target.closest('[role=menu]')) this.setState({ ctx: null }); }; document.addEventListener('mousedown', this._ctxClose); this._rp = () => this.positionSel?.(); window.addEventListener('resize', this._rp);
    this._sc = () => { const el = this.docRef.current, s = window.getSelection(); if (el && s.rangeCount && el.contains(s.anchorNode)) this._range = s.getRangeAt(0).cloneRange(); }; document.addEventListener('selectionchange', this._sc); setTimeout(() => this.syncDoc?.(), 0);
    this._rs = () => { this.autosize(); const w = window.innerWidth; if (w !== this.state.vw) this.setState({ vw: w }); }; this._rs(); window.addEventListener('resize', this._rs);
    try { if (localStorage.getItem('clario-nav-collapsed') === '1') this.setState({ navC: true }); } catch (e) {}
    requestAnimationFrame(() => { const c = this.chartRef.current; if (c) { c.scrollLeft = c.scrollWidth; this._chartSeen = this._chartKey; } });
    let fade = false;
    try { fade = sessionStorage.getItem('clario-fade-in') === '1'; sessionStorage.removeItem('clario-fade-in'); } catch (e) {}
    if (fade) { this.setState({ pageO: 0 }); requestAnimationFrame(() => requestAnimationFrame(() => this.setState({ pageO: 1 }))); }
  }
  chatRef = React.createRef();
  autosize() { document.querySelectorAll('textarea[data-autosize]').forEach(t => { t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }); }
  docRef = React.createRef();
  dropRef = React.createRef();
  viewRef = React.createRef();
  selRef = React.createRef();
  chartRef = React.createRef();
  rbChatRef = React.createRef();
  componentDidUpdate() { this.autosize(); this.syncDoc?.(); this.positionSel?.(); const vr = this.viewRef.current; if (vr && this._viewHTML && vr.innerHTML !== this._viewHTML) vr.innerHTML = this._viewHTML; const el = this.chatRef.current; if (el) el.scrollTop = el.scrollHeight; const rc = this.rbChatRef.current; if (rc) rc.scrollTop = rc.scrollHeight; const c = this.chartRef.current; if (c && this._chartKey !== this._chartSeen) { this._chartSeen = this._chartKey; c.scrollLeft = c.scrollWidth; } }
  componentWillUnmount() { document.removeEventListener('mousedown', this._ctxClose); window.removeEventListener('resize', this._rp); document.removeEventListener('selectionchange', this._sc); window.removeEventListener('resize', this._rs); clearTimeout(this.gt); clearTimeout(this.ct); clearTimeout(this.gtT); clearTimeout(this.ctT); clearTimeout(this.rtT); clearTimeout(this.rbT); clearTimeout(this.rbA); clearTimeout(this.genT); }
  renderVals() {
    // The sidebar collapses while a report is being edited.
    const S = this.state.view === 'lrep' && !this.state.navC ? { ...this.state, navC: true } : this.state, go = (view, extra = {}) => () => this.setState({ view, ...extra });
    const ST = { h: ['Healthy', '#e3f3e8', '#1d6b3a'], n: ['Needs attention', '#fff6c2', '#7a5a00'], r: ['At risk', '#fde2d6', '#a3330c'] };
    const L = LOGOS;
    // Live agencies see their own clients (from the server); sample agencies see the built-in examples.
    const live = this.props.live || null;
    const C = live ? [] : [
      { name: 'Northside Physio', i: 'NP', s: 'r', leads: 44, delta: '−6%', bars: [61, 55, 47, 44, 46, 44], last: 'Sent Sep 26, not viewed', tone: 'Reassuring',
        signals: [['Leads down 3 weeks', '−9%, −14%, −6%'], ['Portal not visited', 'Last visit Sep 12'], ['Last report not viewed', 'Sent Sep 26']], action: 'book a 15-minute call before the Oct 15 invoice.', draft: 'Hi Dana, leads have dipped the last few weeks. I have an idea for fixing it. Do you have 15 minutes on Thursday?' },
      { name: 'Kalye Streetwear', i: 'KS', s: 'n', leads: 188, delta: '−7%', bars: [210, 238, 201, 196, 190, 188], last: 'Sent Oct 6, viewed', tone: 'Straightforward',
        signals: [['Cost per lead rising', '+18% in 2 weeks'], ['Budget pacing ahead', '82% spent, day 20'], ['Reports viewed', 'Within a day']], action: 'refresh the TikTok creative this week.', draft: 'Hi Marco, costs crept up on TikTok. I am swapping in fresh videos this week to bring them back down.' },
      { name: 'Harbor & Pine Dental', i: 'HP', s: 'h', leads: 142, delta: '−3%', bars: [131, 140, 146, 138, 144, 142], last: 'Sent Oct 6, viewed', tone: 'Reassuring',
        signals: [['Leads steady', '142 this week'], ['Cost per lead down', '−11%'], ['Views every report', 'Last 6 of 6']] },
      { name: 'Mara Skincare', i: 'MS', s: 'h', leads: 119, delta: '+14%', bars: [88, 96, 104, 99, 110, 119], last: 'Sent Oct 6, viewed', tone: 'Detailed',
        signals: [['Leads growing', '+14% this week'], ['On budget', '64% spent, day 20'], ['Reports viewed', 'Same day']] },
      { name: 'Coastline Realty', i: 'CR', s: 'h', leads: 40, delta: '+8%', bars: [34, 31, 37, 36, 38, 40], last: 'Sent Oct 5, viewed', tone: 'Straightforward',
        signals: [['Leads up', '+8%'], ['On budget', '58% spent'], ['Reports viewed', 'Within a day']] }
    ];
    (live ? live.clients.map(c => ({ ...c, plats: [] })) : (S.extraClients || [])).forEach(x => C.push({ name: x.name, i: x.name.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase(), s: 'h', leads: 0, delta: '+0%', bars: [1, 1, 1, 1, 1, 1], last: 'No reports yet', tone: 'Reassuring', signals: [['New client', 'No data yet'], ['Accounts', clientTools(S, x.name).length + ' linked'], ['Reports', 'None sent yet']], extra: x }));
    // A client's tools come only from the accounts assigned to it in Settings › Integrations.
    const SL = live ? { ...S, live } : S;
    C.forEach(c => { c.logos = clientTools(SL, c.name); });
    // Live clients: leads are GA4 key events for the last 7 days, compared with the 7 before; bars are the last 6 weeks.
    if (live && live.metrics && live.metrics.through) {
      const M = this._metricsFor === live.metrics ? this._metrics : (this._metricsFor = live.metrics, this._metrics = makeMetrics(live.metrics));
      C.forEach(c => { const a = M.accountsFor(c.extra && c.extra.id); if (!a.length) return;
        c.leads = Math.round(M.sum(a, 'keyEvents', 7)); c.delta = pct(c.leads, M.sum(a, 'keyEvents', 7, 1));
        c.bars = [5, 4, 3, 2, 1, 0].map(w => M.sum(a, 'keyEvents', 7, w) || 0.001); });
    }
    const card = (c, idx) => {
      const [status, bg, col] = ST[c.s], mx = Math.max(...c.bars);
      return { ...c, initials: c.i, status, bg, c: col, dc: c.delta.startsWith('+') ? '#1d6b3a' : '#5a6474',
        spark: c.bars.map((b, k) => ({ h: Math.round(6 + 26 * b / mx) + 'px', c: k === 5 ? '#1f6be2' : '#d6e4f8' })),
        logos: c.logos.map(l => L[l]), risky: c.s !== 'h', open: () => this.setState({ sel: idx, cid: idx, tab: 0, view: 'kpi' }),
        signals: c.signals.map(([t, d]) => ({ t, d })) };
    };
    const clients = C.map(card);
    const icons = {
      clients: 'M16.67 13.13C18.04 14.06 19 15.32 19 17v3h4v-3c0-2.18-3.57-3.47-6.33-3.87zM15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4c-.47 0-.91.1-1.33.24C14.5 5.27 15 6.58 15 8s-.5 2.73-1.33 3.76c.42.14.86.24 1.33.24zm-6 0c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 7c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm6 5H3v-.99C3.2 16.29 6.3 15 9 15s5.8 1.29 6 2v1z',
      reporting: 'M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z',
      monitoring: 'M19 5v2h-4V5h4M9 5v6H5V5h4m10 8v6h-4v-6h4M9 17v2H5v-2h4M21 3h-8v6h8V3zM11 3H3v10h8V3zm10 8h-8v10h8V11zm-10 4H3v6h8v-6z',
      risk: 'M12 2 4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm6 9.09c0 4-2.55 7.7-6 8.83-3.45-1.13-6-4.82-6-8.83v-4.7l6-2.25 6 2.25v4.7zM11 15h2v2h-2zm0-8h2v6h-2z',
      workflow: 'M22 5.18 10.59 16.6l-4.24-4.24 1.41-1.41 2.83 2.83 10-10L22 5.18zm-2.21 5.04c.13.57.21 1.17.21 1.78 0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8c1.58 0 3.04.46 4.28 1.25l1.44-1.44C16.1 2.67 14.13 2 12 2 6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-1.19-.22-2.33-.6-3.39l-1.61 1.61z',
      kpis: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
      ai: 'M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z'
    };
    const M = [
      ['monitoring', 'Dashboard', [['an', 'Analytics']]],
      ['clients', 'Clients', [['clients', 'Clients']]],
      ['reporting', 'Reporting', [['templates', 'Reports']]],
      ['workflow', 'Tasks', [['tasks', 'Tasks']]],
      ['kpis', 'KPIs & goals', [['kpi', 'KPIs & goals']]],
    ];
    const rkCount = C.filter(c => c.s !== 'h' && !(S.rkGone || {})[c.name]).length;
    const activeView = S.view === 'client' ? 'clients' : (S.view === 'builder' || S.view === 'repview' || S.view === 'reports' || S.view === 'lrep') ? 'templates' : S.view;
    const modules = M.map(([id, label, items]) => {
      const hasActive = items.some(x => x[0] === activeView || (x[2] && x[2].some(y => y[0] === activeView))), open = hasActive;
      const single = id === 'reporting' || id === 'monitoring' || id === 'clients' || id === 'kpis' || id === 'workflow' || id === 'risk';
      return { label, open, multi: !single, aria: single && hasActive ? 'page' : undefined, icon: icons[id], rows: open && !single ? '1fr' : '0fr', chev: open ? 'rotate(180deg)' : 'rotate(0deg)',
        bg: single && hasActive ? '#eef3fd' : 'transparent', iconBg: 'transparent', iconC: hasActive ? '#1f6be2' : '#5a6474',
        hasBadge: id === 'workflow' && rkCount > 0, badge: String(rkCount),
        toggle: () => { if (S.navC) { this.setState({ navC: false }); try { localStorage.setItem('clario-nav-collapsed', '0'); } catch (er) {} } if (id === 'clients') { this.setState({ view: 'clients', clList: true, cForm: null, pfDraft: null }); return; } if (id === 'reporting' && S.view !== 'templates') { this.setState({ view: 'templates' }); return; } if (!hasActive) this.setState({ view: items[0][2] ? items[0][2][0][0] : items[0][0] }); },
        items: items.map(([v, l, kids]) => {
          if (kids) {
            const kOpen = kids.some(k => k[0] === activeView);
            return { label: l, hasKids: true, kidsOpen: kOpen, rows: kOpen ? '1fr' : '0fr', chev: kOpen ? 'rotate(180deg)' : 'rotate(0deg)', aria: undefined, bg: 'transparent', c: kOpen ? '#0b1626' : '#45505f', fw: kOpen ? 700 : 500, go: go(kids[0][0]),
              kids: kids.map(([kv, kl]) => { const on = kv === activeView; return { label: kl, aria: on ? 'page' : undefined, bg: on ? '#eef3fd' : 'transparent', c: on ? '#1f6be2' : '#45505f', fw: on ? 700 : 500, go: go(kv) }; }) };
          }
          const on = v === activeView; return { label: l, hasKids: false, kids: [], kidsOpen: false, rows: '0fr', chev: '', aria: on ? 'page' : undefined, bg: on ? '#eef3fd' : 'transparent', c: on ? '#1f6be2' : '#45505f', fw: on ? 700 : 500, go: go(v) };
        }) };
    });
    const pages = {
      'an': ['Dashboard', 'Analytics', 'Results from every connected platform. Switch tools below.', ''],
      'an-all': ['Dashboard · Analytics', 'All sources', 'Every connected platform combined into one view.', ''],
      'an-meta': ['Dashboard · Analytics', 'Meta', 'Facebook and Instagram ad results.', ''],
      'an-ga4': ['Dashboard · Analytics', 'Google Analytics 4', 'What visitors do on the website after they arrive.', ''],
      'an-gads': ['Dashboard · Analytics', 'Google Ads', 'Search and display ad results.', ''],
      'an-tt': ['Dashboard · Analytics', 'TikTok Ads', 'Video ad results on TikTok.', ''],
      settings: ['Settings', 'Settings', '', ''],
      kpi: ['Dashboard', 'KPIs & goals', '', ''],
      clients: ['Clients', 'Clients', '', 'Add client'],
      reports: ['Reporting', 'Report history', '', ''],
      templates: ['Reporting', 'Reports', '', 'Create blank'],
      combined: ['Reporting', 'Combined data', 'Merge the same metric from different platforms into one number and one story.', 'New widget'],
      branding: ['Reporting', 'White label', 'Your logo, colours and domain on every client report.', ''],
      sharing: ['Reporting', 'Sharing & portals', 'Choose how clients receive their reports.', ''],
      goals: ['Dashboard', 'Goals & budget', 'Set a target for each client. Analyst tells you when they drift.', 'Add goal'],
      alerts: ['Dashboard', 'Smart alerts', 'Get told when something changes, so you do not have to check every account.', 'New alert'],
      riskscores: ['Risk & retention', 'Risk & retention', 'Each client\'s risk level, the reasons behind it, and what to do next.', ''],
      notify: ['Risk & retention', 'Alert notifications', 'Choose where risk alerts reach you.', ''],
      tasks: ['Workflow', 'Tasks', 'Keep track of what needs doing for each client.', 'Add task'],
      team: ['Workflow', 'Team', 'Invite teammates and choose what they can see.', 'Invite teammate'],
      builder: ['Reporting', 'Report builder', '', ''],
      insights: ['AI', 'AI insights', 'Plain-language takeaways Analyst found across your clients this week.', '']
    };
    const v = S.view;
    const inDash = true;
    const cur = clients[S.cid] || clients[0];
    const defTasks = live ? [] : DEF_TASKS;
    const tkSrc = (S.tasks || defTasks).map(t => ({ ...t, status: t.status || (t.done ? 'done' : 'todo'), client: t.client || ((t.meta || '').split(' · ')[0] === 'No client' ? '' : (t.meta || '').split(' · ')[0]), sub: t.sub || [0, 0], who: Array.isArray(t.who) ? t.who : [t.who || 'AR'], due: t.due || '', desc: t.desc || '', cm: t.cm || 0 }));
    const setTasks = fn => this.setState(s => { const arr = (s.tasks || defTasks).map(t => ({ ...t })); fn(arr); return { tasks: arr, tkMenu: null }; });
    const moveTask = (i, k) => setTasks(arr => { arr[i].status = k; arr[i].done = k === 'done'; if (k === 'done' && arr[i].sub) arr[i].sub = [arr[i].sub[1], arr[i].sub[1]]; });
    const tasksAll = tkSrc.map((t, i) => ({ ...t, i, done: t.status === 'done', meta: (t.client || 'No client') + (t.due ? ' · Due ' + t.due : ''), statusLabel: TCOLS.find(c => c[0] === t.status)[1], deco: t.status === 'done' ? 'line-through' : 'none', c: t.status === 'done' ? '#97a2b2' : '#0b1626',
      toggle: () => moveTask(i, t.status === 'done' ? 'todo' : 'done') }));
    const p = pages[v] || pages.kpi;
    const atRisk = clients.filter(c => c.risky);
    const ctx = { live, SL, refresh: () => this.props.refresh?.(), S, v, go, ST, L, C, clients, inDash, rkCount, atRisk, defTasks, TCOLS, PEOPLE, tkSrc, setTasks, moveTask, tasksAll };
    return {
      pageO: S.pageO, modules: modules.map(m => ({ ...m, badgePill: m.hasBadge && !S.navC, badgeDot: m.hasBadge && !!S.navC, title: m.hasBadge ? m.label + ' (' + m.badge + ' need attention)' : m.label, rowsN: S.navC ? '0fr' : m.rows, multi: m.multi && !S.navC })),
      navOpen: !S.navC, swH: S.navC ? '50px' : '60px', swPadL: S.navC ? '2.5px' : '8px', swAv: S.navC ? '42px' : '42px', swR: S.navC ? '14px' : '16px', navW: S.navC ? '74px' : '264px', navTxt: S.navC ? 'none' : 'inline', navTxtFlex: S.navC ? 'none' : 'flex', navTxtGrid: S.navC ? 'none' : 'grid', navDot: S.navC ? 'block' : 'none', navJust: 'flex-start', navTopDir: S.navC ? 'column' : 'row', navAlign: S.navC ? 'flex-start' : 'center', navPad: '10px', navSwPad: S.navC ? '0' : '12px', navSetW: S.navC ? '36px' : '44px',
      navArrow: S.navC ? 'M5 12h14M13 6l6 6-6 6' : 'M19 12H5M11 6l-6 6 6 6', navToggleLabel: S.navC ? 'Expand sidebar' : 'Collapse sidebar', navCursor: S.navC ? 'e-resize' : 'auto', logoLabel: S.navC ? 'Expand sidebar' : 'AI Ads Analyst home',
      logoClick: e => { if (S.navC) { e.preventDefault(); e.stopPropagation(); this.setState({ navC: false }); try { localStorage.setItem('clario-nav-collapsed', '0'); } catch (er) {} } },
      asideClick: e => { if (!S.navC) return; if (e.target.closest('button, a, input, select, [role=listbox]')) return; this.setState({ navC: false }); try { localStorage.setItem('clario-nav-collapsed', '0'); } catch (er) {} }, toggleNav: () => this.setState(s => { const n = !s.navC; try { localStorage.setItem('clario-nav-collapsed', n ? '1' : '0'); } catch (e) {} return { navC: n, swOpen: false }; }),
      ...(() => {
        const open = !!S.chatOpen, who = inDash && S.sel != null ? clients[S.sel] : null, msgs = S.msgs || [];
        const reply = q => {
          const t = q.toLowerCase(), name = who ? who.name : 'your clients';
          if (/task|todo|remind/.test(t)) { const title = q.replace(/^(add|create)( a)? task( to)?:?\s*/i, '') || 'Follow up'; this.setState(s => ({ tasks: [{ title: title.charAt(0).toUpperCase() + title.slice(1), meta: (who ? who.name : 'No client') + ' · Due this week', who: 'AR', done: false }, ...(s.tasks || defTasks)] })); return 'Added to Tasks: "' + title + '"' + (who ? ' for ' + who.name : '') + ', due this week.'; }
          // Live agencies: answers about numbers come once data is pulled and Claude writes them. Until then, say so.
          if (live) return 'I can\'t read your clients\' numbers yet. They appear once Google Analytics data is pulled for a linked property. For now I can add tasks: try "Add task: call ' + (who ? who.name : 'a client') + '".';
          if (/report/.test(t)) return 'I drafted a ' + (who ? who.tone.toLowerCase() : 'reassuring') + ' report for ' + name + ':\n1. Headline result\n2. Key numbers\n3. What happened and why\n4. Next steps\nIt is waiting in Reporting for you to review before it sends.';
          if (/alert|notify|tell me/.test(t)) return 'Done. I will email you when ' + name + (who ? ' gets' : ' get') + ' 20% fewer leads than usual or goes over the cost per lead target.';
          if (/why|drop|down|worse|risk|attention/.test(t)) { const c = who || clients.find(x => x.s === 'r'); return c.name + ' is ' + c.status.toLowerCase() + ' because: ' + c.signals.map(s => s.t.toLowerCase()).join(', ') + '.' + (c.action ? ' I suggest you ' + c.action : ''); }
          return who ? who.name + ' got ' + who.leads + ' leads this week (' + who.delta + '). ' + who.signals[0].t + '. Ask me to draft a report, set an alert or add a task.' : 'This week: 533 leads across 5 clients, up 6%. Northside Physio needs attention. Ask me to draft a report, set an alert or add a task.';
        };
        const send = text => { const q = (text || '').trim(); if (!q || S.typing) return; this.setState(s => ({ msgs: [...(s.msgs || []), { me: true, text: q }], chatInput: '', typing: true })); clearTimeout(this.ct); this.ct = setTimeout(() => { const a = reply(q); this.setState(s => ({ typing: false, msgs: [...(s.msgs || []), { me: false, text: a }] })); }, 900); };
        const greet = { me: false, text: who ? 'What should I do for ' + who.name + '?' : 'Hi ' + (S.me?.name || '').split(/\s+/)[0] + '. Tell me what you need and I will take care of it.' };
        return {
          chatOpen: open, chatO: open ? 1 : 0, chatT: open ? 'scale(1)' : 'scale(0.96) translateY(8px)', chatPe: open ? 'auto' : 'none', chatVis: open ? 'visible' : 'hidden',
          chatBtn: open ? 'Close' : 'Ask Analyst', toggleChat: () => this.setState(s => ({ chatOpen: !s.chatOpen })),
          chatScope: who ? 'Working on ' + who.name : 'Working across all clients', chatRef: this.chatRef,
          chatMsgs: [greet, ...msgs].map(m => ({ text: m.text, align: m.me ? 'flex-end' : 'flex-start', bg: m.me ? '#1f6be2' : '#f4f7fb', c: m.me ? '#ffffff' : '#0b1626' })),
          chatTyping: !!S.typing, chatFresh: msgs.length === 0,
          chatIdeas: (who ? ['Why is ' + who.name + ' ' + who.status.toLowerCase() + '?', 'Draft this week\'s report', 'Add a task to call them Friday'] : ['Which clients need attention?', 'Draft reports for all clients', 'Alert me when leads drop']).map(label => ({ label, use: () => send(label) })),
          chatInput: S.chatInput || '', setChatInput: e => this.setState({ chatInput: e.target.value }), sendChat: e => { e.preventDefault(); send(S.chatInput); }
        };
      })(),
      swOpen: S.swOpen, toggleSw: () => this.setState(s => ({ swOpen: !s.swOpen })),
      swO: S.swOpen ? 1 : 0, swYUp: S.swOpen ? 0 : 6, inDash, swPe: S.swOpen ? 'auto' : 'none', swVis: S.swOpen ? 'visible' : 'hidden', swChev: S.swOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      swName: S.sel != null ? clients[S.sel].name : 'All clients', swInitials: S.sel != null ? clients[S.sel].initials : 'All',
      swAvBg: S.sel != null ? '#d6e4f8' : '#0b1626', swAvC: S.sel != null ? '#0b1626' : '#ffffff',
      swHasStatus: S.sel != null, swDot: S.sel != null ? ({ h: '#2f9e5b', n: '#e8a33a', r: '#e0481a' })[C[S.sel].s] : 'transparent',
      swProfile: false, goProfile: () => this.setState({ view: 'clients', clList: false, swOpen: false, pfDraft: null }), swProfileLabel: 'View client profile',
      swList: [{ name: 'All clients', initials: 'All', sub: `${clients.length} clients`, avBg: '#0b1626', avC: '#ffffff', on: S.sel == null, bg: S.sel == null ? '#eef3fd' : 'transparent', pick: () => this.setState(s => ({ sel: null, swOpen: false, view: (s.view === 'clients' && !s.cForm) ? 'an' : s.view })) }]
        .concat(clients.map((c, i) => ({ name: c.name, initials: c.initials, sub: c.status, avBg: '#d6e4f8', avC: '#0b1626', on: S.sel === i, bg: S.sel === i ? '#eef3fd' : 'transparent', pick: () => this.setState({ sel: i, cid: i, tab: 0, swOpen: false }) }))),
      hdrShadow: S.hdrStuck ? '0 1px 0 #e6ebf2, 0 8px 20px -16px rgba(11,22,38,.35)' : 'none', showHeader: v !== 'client' && v !== 'builder' && v !== 'repview' && v !== 'settings' && v !== 'lrep', crumb: p[0], pageTitle: v === 'kpi' ? 'KPIs & goals' : (v === 'clients' && S.cForm) ? 'New client' : p[1], pageSub: v === 'kpi' ? `${atRisk.length} clients need attention. ${clients.length - atRisk.length} are doing well.` : p[2],
      showSw: v === 'an' || v.startsWith('an-') || v === 'kpi', hasAction: !!p[3] && !(v === 'clients' && S.cForm), // Live agencies: the Reports header button opens the write-a-report dialog.
      actionLabel: live && (v === 'templates' || v === 'reports') ? 'Write report' : p[3], action: live && (v === 'templates' || v === 'reports') ? () => this.setState({ lrModal: true, lrErr: null }) : v === 'tasks' ? () => this.setState({ tw: { step: 1, title: '', desc: '', client: S.sel != null ? C[S.sel].name : '', due: '', who: ['AR'], items: [], itemVal: '' }, twErr: null }) : v === 'clients' ? () => this.setState({ view: 'clients', sel: null, swOpen: false, cForm: { name: '', email: '', plats: [], step: 1 }, cErr: {} }) : v === 'templates' ? () => this.setState({ newRep: { step: 1, name: '', tpl: 'blank', err: false, direct: true } }) : v === 'clients' ? () => this.setState({ cForm: { name: '', email: '', plats: [], step: 1 }, cErr: {} }) : () => {},
      vKpi: v === 'kpi', vClient: v === 'client', vTasks: v === 'tasks', vBuilder: v === 'builder' && !live,
      meName: S.me?.name || '', meInitials: (S.me?.name || '?').split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase(), meRole: S.me?.role || '', agencyName: S.agName, sampleMode: !!this.props.agency?.sampleMode, // A report being edited uses the full width: its ribbon runs edge to edge, the page stays centred.
      mainPad: v === 'lrep' ? '0 0 64px' : '32px clamp(20px,4vw,48px) 64px', mainMax: v === 'lrep' ? 'none' : '1100px', mainGap: v === 'lrep' ? '0' : '24px', canConnect: S.me?.role !== 'Member',
      goSettings: go('settings'), goReports: go('reports'), goHistory: go('reports'), histCount: '', goTemplates: go('templates'), viewRef: this.viewRef, setAria: v === 'settings' ? 'page' : undefined, setBg: v === 'settings' ? '#eef3fd' : 'transparent', setC: v === 'settings' ? '#1f6be2' : '#45505f',
      ...FEATURES.reduce((o, f) => Object.assign(o, f.vals(this, ctx)), {}),
    };
  }
}
// Download PDF uses the browser's print dialog: only the report page is printed.
const PRINT_CSS = '@media print{body *{visibility:hidden !important}.clario-print,.clario-print *{visibility:visible !important}.clario-print{position:absolute !important;left:0;top:0;box-shadow:none !important}.clario-print .clario-noprint,.clario-print .clario-noprint *{display:none !important}.clario-print button[aria-label^="Remove"]{display:none !important}}';

export default function AppScreen(props) {
  const router = useRouter();
  return <Logic {...props} refresh={() => router.refresh()} />;
}

Logic.prototype.render = function render() {
  const v = { ...this.props, ...this.renderVals() };
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css + PRINT_CSS }} />
      <View v={v} />
    </>
  );
};

FEATURES.forEach(f => f.methods && Object.assign(Logic.prototype, f.methods));
