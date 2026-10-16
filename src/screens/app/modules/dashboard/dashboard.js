// Dashboard analytics.
import { LOGOS, connList } from '../../data';
import { makeMetrics, pct, fmtNum, fmtDay } from '../../metrics';

const L = LOGOS;
const tb = (cols, rows) => ({ type: 'table', cols, rows });
const br = (rows) => ({ type: 'bars', rows });
const fn = (rows) => ({ type: 'funnel', rows });
const AN = {
  // Leads come from one source of truth (the client's GA4 key events). Ad platforms each claim the leads they
  // influenced, so their counts overlap and are shown as reported, never added up.
  'an-all': { name: 'All sources', logo: '/assets/clario-mark-v2.png', color: '#1f6be2', s: [60, 64, 58, 70, 72, 68, 75, 80, 78, 74, 82, 86, 84, 90], fresh: 'Leads from GA4 key events · data up to Oct 5',
    m: [['Leads', '533', '+6%'], ['Spend', '$4,320', '+2%'], ['Cost per lead', '$8.10', '−4%'], ['Conversions', '612', '+9%']],
    take: 'Your sites recorded 533 leads, up 6%, while spend rose only 2%. Most came from Meta and Google search visitors. The platforms claim 501 leads between them, but each counts leads it only helped with, so cost per lead uses your sites\' count.',
    sec: [['Leads by source, from Google Analytics 4', br([['Meta', '236'], ['Google Ads', '132'], ['Organic search', '88'], ['Direct', '47'], ['TikTok Ads', '30']])],
      ['Spend by platform', br([['Meta', '$2,246'], ['Google Ads', '$1,410'], ['TikTok Ads', '$664']])],
      ['Leads each platform reports', tb(['Platform', 'Spend', 'Leads they report', 'Cost per lead they report'], [['Meta', '$2,246', '312', '$7.20'], ['Google Ads', '$1,410', '148', '$9.53'], ['TikTok Ads', '$664', '41', '$16.20']]), true],
      ['Top campaigns, as each platform reports them', tb(['Campaign', 'Platform', 'Spend', 'Leads reported', 'Cost per lead'], [['Retargeting · site visitors', 'Meta', '$820', '134', '$6.12'], ['Brand search', 'Google Ads', '$410', '61', '$6.72'], ['Lookalike · past leads', 'Meta', '$690', '88', '$7.84'], ['Local services', 'Google Ads', '$560', '52', '$10.77'], ['Spark ads · creators', 'TikTok Ads', '$664', '41', '$16.20']]), true]] },
  'an-meta': { name: 'Meta', logo: L.meta, color: '#0866FF', fresh: 'Data up to Oct 5 · Meta may still revise the last 3 days', s: [40, 44, 42, 48, 46, 52, 55, 50, 58, 60, 57, 62, 64, 66],
    m: [['Spend', '$2,246', '+3%'], ['Reach', '84.2k', '+12%'], ['Clicks', '3,940', '+8%'], ['CTR', '1.9%', '+0.2 pts'], ['Leads', '312', '+5%'], ['Cost per lead', '$7.20', '−6%']],
    take: 'Retargeting returns leads at $6.12, about 35% cheaper than cold audiences. Instagram Reels now drive more leads than the Facebook feed.',
    sec: [['Campaigns', tb(['Campaign', 'Status', 'Spend', 'Reach', 'Leads', 'Cost per lead'], [['Retargeting · site visitors', 'Active', '$820', '18.4k', '134', '$6.12'], ['Lookalike · past leads', 'Active', '$690', '31.2k', '88', '$7.84'], ['Interest · local 25–45', 'Active', '$480', '26.9k', '62', '$7.74'], ['Promo · October offer', 'Paused', '$256', '7.7k', '28', '$9.14']]), true],
      ['Leads by placement', br([['Instagram Reels', '38%'], ['Facebook feed', '29%'], ['Instagram feed', '21%'], ['Stories', '12%']])],
      ['Leads by age', br([['18–24', '9%'], ['25–34', '34%'], ['35–44', '31%'], ['45–54', '17%'], ['55+', '9%']])],
      ['Top ads', tb(['Ad', 'CTR', 'Leads', 'Cost per lead'], [['Before and after video', '2.8%', '71', '$5.40'], ['Customer testimonial', '2.1%', '58', '$6.30'], ['Free consult offer', '1.6%', '44', '$7.90'], ['Team photo carousel', '0.9%', '19', '$11.20']]), true]] },
  'an-ga4': { name: 'Google Analytics 4', logo: L.ga4, color: '#E37400', fresh: 'Data up to Oct 5 · GA4 can take 2 days to finish processing', s: [70, 72, 68, 74, 80, 62, 58, 75, 78, 76, 82, 66, 60, 84],
    m: [['Sessions', '18.4k', '+4%'], ['Users', '12.1k', '+3%'], ['Engagement rate', '61%', '+2 pts'], ['Conversions', '640', '+9%'], ['Conversion rate', '3.5%', '+0.3 pts']],
    take: 'Most visitors who start the booking form leave at step 2, mostly on mobile. Shortening that step could add 20+ leads a week.',
    sec: [['Sessions by channel', br([['Paid social', '6,210'], ['Organic search', '4,880'], ['Direct', '3,120'], ['Paid search', '2,940'], ['Referral', '860'], ['Email', '390']])],
      ['Sessions by device', br([['Mobile', '71%'], ['Desktop', '25%'], ['Tablet', '4%']])],
      ['Booking funnel, from the site\'s GA4 events', fn([['Viewed a page', 18400], ['Started the form', 2310], ['Reached step 2', 1420], ['Submitted', 640]]), true],
      ['Top landing pages', tb(['Page', 'Sessions', 'Engagement', 'Conversions', 'Conv. rate'], [['/book-now', '4,210', '68%', '312', '7.4%'], ['/', '6,880', '57%', '148', '2.2%'], ['/services/physio', '2,140', '64%', '82', '3.8%'], ['/pricing', '1,960', '71%', '58', '3.0%'], ['/blog/back-pain-tips', '1,720', '49%', '12', '0.7%']]), true]] },
  'an-gads': { name: 'Google Ads', logo: L.gads, color: '#1A73E8', fresh: 'Data up to Oct 5 · Google Ads runs a few hours behind', s: [50, 55, 60, 58, 62, 40, 38, 57, 63, 65, 61, 44, 42, 68],
    m: [['Spend', '$1,410', '+1%'], ['Impressions', '210k', '+2%'], ['Clicks', '5,120', '+6%'], ['CTR', '2.4%', '+0.1 pts'], ['Conversions', '148', '+11%'], ['Cost per conversion', '$9.53', '−9%']],
    take: 'Brand search converts at the lowest cost. Weekday mornings bring twice the conversions of weekends, so shifting budget there would help.',
    sec: [['Campaigns', tb(['Campaign', 'Type', 'Spend', 'Clicks', 'Conv.', 'Cost per conv.'], [['Brand search', 'Search', '$410', '1,880', '61', '$6.72'], ['Local services', 'Search', '$560', '1,940', '52', '$10.77'], ['Remarketing display', 'Display', '$260', '910', '24', '$10.83'], ['Performance Max', 'PMax', '$180', '390', '11', '$16.36']]), true],
      ['Top search terms', tb(['Search term', 'Clicks', 'Conv.'], [['physio near me', '412', '22'], ['northside physio', '388', '31'], ['sports massage', '204', '9'], ['back pain clinic', '176', '7']])],
      ['Conversions by device', br([['Mobile', '58%'], ['Desktop', '38%'], ['Tablet', '4%']])]] },
  'an-tt': { name: 'TikTok Ads', logo: L.tt, color: '#FE2C55', fresh: 'Data up to Oct 5 · TikTok runs a few hours behind', s: [30, 34, 40, 38, 45, 52, 60, 58, 64, 70, 68, 74, 80, 86],
    m: [['Spend', '$664', '+14%'], ['Video views', '182k', '+18%'], ['Avg. watch time', '6.1s', '+0.4s'], ['Clicks', '2,410', '+3%'], ['Leads', '41', '−4%'], ['Cost per lead', '$16.20', '+18%']],
    take: 'Views are climbing but leads are not. Viewers drop off before the offer appears, so moving it into the first 3 seconds should help.',
    sec: [['Top videos', tb(['Video', 'Views', '2s view rate', 'Avg. watch', 'Clicks', 'Leads'], [['Drop day unboxing', '64.2k', '48%', '7.4s', '920', '17'], ['Creator try-on', '51.8k', '44%', '6.8s', '710', '12'], ['Street style montage', '39.5k', '37%', '5.1s', '480', '8'], ['Behind the scenes', '26.5k', '31%', '4.2s', '300', '4']]), true],
      ['Watch-through', fn([['Impressions', 412000], ['2-second views', 182000], ['6-second views', 74000], ['Watched to the end', 21000]])],
      ['Viewers by age', br([['18–24', '46%'], ['25–34', '38%'], ['35–44', '12%'], ['45+', '4%']])]] }
};
const PAL = {
  'an-all': { pal: ['#1f6be2', '#0b1626', '#97a2b2'], tint: '#eef3fd', ink: '#0b1626' },
  'an-meta': { pal: ['#0866FF', '#0064E0', '#5B9BFF', '#A4C8FF', '#1C2B33'], tint: '#e7f0ff', ink: '#0866FF' },
  'an-ga4': { pal: ['#E37400', '#F9AB00', '#FFCA4F', '#B85C00', '#5F6368', '#FFE3A3'], tint: '#fef3e2', ink: '#E37400' },
  'an-gads': { pal: ['#4285F4', '#FBBC04', '#34A853', '#EA4335'], tint: '#e8f0fe', ink: '#1A73E8' },
  'an-tt': { pal: ['#FE2C55', '#25F4EE', '#000000', '#8A8B91'], tint: '#ffe9ee', ink: '#000000' }
};
const PLOGO = { 'Meta': L.meta, 'Google Ads': L.gads, 'TikTok Ads': L.tt, 'Website (organic)': L.ga4,
  'Instagram Reels': '/assets/logo-instagram.png', 'Instagram feed': '/assets/logo-instagram.png', 'Stories': '/assets/logo-instagram.png', 'Facebook feed': '/assets/logo-facebook.png',
  'Paid social': L.meta, 'Organic search': '/assets/logo-search-console.png', 'Paid search': L.gads };
const PICON = {
  'Direct': 'M5 3l14 8-6 2-2 6z', 'Referral': 'M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1', 'Email': 'M3 6h18v12H3zM3 7l9 6 9-6',
  'Mobile': 'M7 2h10v20H7zM11 18h2', 'Desktop': 'M3 4h18v12H3zM8 20h8M12 16v4', 'Tablet': 'M5 2h14v20H5zM11 18h2',
  '18–24': 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0', '25–34': 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0', '35–44': 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0', '45–54': 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0', '55+': 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0', '45+': 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0'
};
const PLAT = { 'Meta': '#0866FF', 'Google Ads': '#4285F4', 'TikTok Ads': '#000000', 'Organic search': '#97a2b2', 'Direct': '#d3dbe6' };

export function dashboardVals(app, ctx) {
  // eslint-disable-next-line no-unused-vars
  const { SL: S, live, v, go, ST, L, C, clients, inDash, rkCount, atRisk, defTasks, TCOLS, PEOPLE, tkSrc, setTasks, moveTask, tasksAll } = ctx;
  return {
      tapTake: () => app.setState({ takeOpen: true }), takeOpenB: !!S.takeOpen,
      showTake: () => app.setState({ takeOpen: true }), hideTake: () => app.setState({ takeOpen: false }), takeO: S.takeOpen ? 1 : 0, takeT: S.takeOpen ? 'translateY(0) scale(1)' : 'translateY(-4px) scale(0.97)', takeVis: S.takeOpen ? 'visible' : 'hidden', takeBtnBg: S.takeOpen ? '#eef3fd' : '#f4f7fb',
      vAn: v === 'an', ...(() => {
        let av = S.anTool || 'an-all';
        const blank = { anVB: '0 0 600 180', anGrid: '', anChartW: '100%', chartRef: app.chartRef, anTint: '#eef3fd', anInk: '#0b1626', anTools: [], anMetrics: [], anSections: [], anDays: [], anRanges: [], anLine: '', anArea: '', anPrev: '', anColor: '#1f6be2', anFill: '#eef3fd', anTake: '', anChartLabel: '', anEmpty: false, anHas: false, anEmptyTitle: '', anEmptyBtn: '', anEmptyLogo: '', anEmptyTool: '', anEmptyLink: false, anEmptyLive: false, anEmptyLiveText: '', anFresh: '' };
        if (v !== 'an') return blank;
        const A0 = AN[av];
        const anTools0 = Object.keys(AN).map(key => ({ label: AN[key].name, logo: AN[key].logo, on: key === av, bg: key === av ? '#ffffff' : 'transparent', fw: key === av ? 700 : 500, tipO: S.anTip === key ? 1 : 0, tipY: S.anTip === key ? '0px' : '-4px', tipOn: () => app.setState({ anTip: key }), tipOff: () => app.setState(s => s.anTip === key ? { anTip: null } : null), pick: () => app.setState({ anTool: key, anMetric: 0, takeOpen: false }) }));
        // Live agencies: empty states until numbers are stored, then views built from them.
        let LV = null;
        if (live) {
          const props = live.conns.flatMap(c => c.accounts);
          const M = app._metricsFor === live.metrics ? app._metrics : (app._metricsFor = live.metrics, app._metrics = makeMetrics(live.metrics));
          const selC = S.sel != null && C[S.sel] ? C[S.sel] : null, MA = (live.metrics && live.metrics.accounts) || [];
          const ofTool = (tool, ids) => ids.filter(i => MA[i].tool === tool);
          // One tab per connected platform. All sources only makes sense once two or more are connected (two Google
          // logins are one platform).
          const providers = new Set(live.conns.map(c => c.provider)), showAll = providers.size >= 2;
          const keys = (showAll ? ['an-all'] : []).concat(providers.has('google') || !providers.size ? ['an-ga4'] : [], providers.has('meta') ? ['an-meta'] : []);
          const curKey = keys.includes(av) ? av : keys[0];
          const liveTools = keys.map(key => ({ label: AN[key].name, logo: AN[key].logo, on: key === curKey, bg: key === curKey ? '#ffffff' : 'transparent', fw: key === curKey ? 700 : 500, tipO: S.anTip === key ? 1 : 0, tipY: S.anTip === key ? '0px' : '-4px', tipOn: () => app.setState({ anTip: key }), tipOff: () => app.setState(s => s.anTip === key ? { anTip: null } : null), pick: () => app.setState({ anTool: key, anMetric: 0, takeOpen: false }) }));
          // What the tab can show: every linked account in All sources, else that platform's.
          const tool = curKey === 'an-meta' ? 'meta' : curKey === 'an-ga4' ? 'ga4' : null;
          const mine = ids => tool ? ofTool(tool, ids) : ids;
          const tprops = props.filter(x => !tool || x.tool === tool), linked = tprops.filter(x => x.clientId).length;
          const accts = mine(M.accountsFor(selC && selC.extra ? selC.extra.id : null));
          const conns = live.conns.filter(c => !tool || c.provider === (tool === 'meta' ? 'meta' : 'google'));
          const has = mine(M.accountsFor(null)).some(i => MA[i].through);
          const st = !conns.length ? 'none' : !tprops.length ? 'empty' : !linked ? 'unlinked' : selC && !accts.length ? 'client' : !has ? 'waiting' : 'ready';
          const meta = tool === 'meta', thing = meta ? 'ad account' : 'GA4 property', things = meta ? 'ad accounts' : 'GA4 properties', src = meta ? 'Meta' : 'Google Analytics';
          const T = {
            none: meta ? ['Connect Meta to see ad results', 'Add a Meta system user token in Integrations. Every ad account it can see shows up there.', 'Connect Meta', null]
              : ['Connect Google Analytics to see results', 'Sign in with Google. Every GA4 property that login can see shows up in Integrations.', 'Connect Google Analytics', () => { window.location.href = '/api/integrations/google/start'; }],
            empty: meta ? ['No ad accounts found', 'The Meta login you connected can\'t see any ad accounts. Give it access in Business Manager, then look again in Integrations.', 'Open integrations', null]
              : ['No GA4 properties found', 'The Google login you connected can\'t see any GA4 properties. Connect a login that has access, or ask the client to add it.', 'Open integrations', null],
            unlinked: [tprops.length + ' ' + (tprops.length === 1 ? thing : things) + ' found', 'Link each ' + (meta ? 'ad account' : 'property') + ' to the client it belongs to. Results start once one is linked.', meta ? 'Link ad accounts' : 'Link properties', null],
            client: ['No ' + thing + ' is linked to ' + (selC ? selC.name : ''), 'Link their ' + (meta ? 'ad account' : 'property') + ' in Integrations and their results show up here.', meta ? 'Link an ad account' : 'Link a property', null],
            waiting: ['Your numbers are on the way', linked + ' ' + (linked === 1 ? thing + ' is' : things + ' are') + ' linked to clients. Results appear here after the first data pull from ' + src + '.', 'Open integrations', null],
          }[st];
          if (T) return { ...blank, anTools: liveTools, anEmpty: true, anEmptyLive: true, anEmptyLogo: meta ? L.meta : L.ga4, anEmptyTool: meta ? 'Meta' : 'Google Analytics 4', anEmptyTitle: T[0], anEmptyLiveText: T[1], anEmptyBtn: T[2],
            anEmptyGo: T[3] || (() => app.setState(s => ({ view: 'settings', stgTab: 'conn', stgOpen: { ...(s.stgOpen || {}), [meta ? 'meta' : 'ga4']: true } }))) };
          // Viewing all clients: tables say which client each row belongs to.
          const per = selC ? null : live.clients.map(c => ({ name: c.name, accts: mine(M.accountsFor(c.id)) })).filter(c => c.accts.length);
          LV = { M, accts, per: per && per.length > 1 ? per : null, tools: liveTools, key: curKey, ga4: ofTool('ga4', accts), meta: ofTool('meta', accts) };
        }
        const A = LV ? (LV.key === 'an-meta' ? metaView : liveView)(LV, S, { '7 days': 7, '14 days': 14, '30 days': 30 }[S.range || '14 days']) : A0;
        if (LV) av = LV.key;
        const toolKey = ({ 'an-meta': 'meta', 'an-ga4': 'ga4', 'an-gads': 'gads', 'an-tt': 'tt' })[av];
        // The agency may already be connected and only the client's account is unlinked. Then the fix is linking, not connecting.
        const anTools = LV ? LV.tools : anTools0;
        const agencyHas = !!toolKey && connList(S).some(c => c.tool === toolKey);
        if (!LV && S.sel != null && toolKey && !C[S.sel].logos.includes(toolKey)) return { ...blank, anTools, anEmpty: true, anEmptyLink: agencyHas, anEmptyLogo: A.logo, anEmptyTool: A.name, anEmptyTitle: agencyHas ? 'No ' + A.name + ' account is linked to ' + C[S.sel].name : C[S.sel].name + ' is not connected to ' + A.name, anEmptyBtn: agencyHas ? 'Link an account' : 'Connect ' + A.name, anEmptyGo: () => app.setState(s => ({ view: 'settings', stgTab: 'conn', stgOpen: { ...(s.stgOpen || {}), [toolKey]: true } })) };
        const mi = Math.min(S.anMetric || 0, A.m.length - 1);
        // Up is good, except for costs. Spend going up is neither.
        const good = (label, note) => { if (/^spend$/i.test(label)) return '#5a6474'; const up = note.startsWith('+'), down = note.startsWith('−'); if (/cost/i.test(label)) return up ? '#a3330c' : down ? '#1d6b3a' : '#5a6474'; return up ? '#1d6b3a' : down ? '#a3330c' : '#5a6474'; };
        const TOTAL = 90, rngDays = { '7 days': 7, '14 days': 14, '30 days': 30 }[S.range || '14 days'];
        const pts = A.series ? A.series[mi] : Array.from({ length: TOTAL }, (_, k) => A.s[k % A.s.length] * (0.72 + 0.28 * k / (TOTAL - 1)) * (1 + 0.12 * Math.sin(k * 0.9 + mi * 1.7)));
        const n = pts.length, mx = Math.max(1, ...pts) * 1.15, W = (n - 1) * 10;
        const path = arr => arr.map((p, i) => (i ? 'L' : 'M') + (i * 10) + ' ' + Math.round(180 - (p / mx) * 170)).join(' ');
        const end = A.through ? new Date(A.through + 'T12:00:00') : new Date(2026, 9, 5), MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const step = rngDays <= 7 ? 1 : rngDays <= 14 ? 2 : 5;
        const days = []; for (let k = n - 1; k >= 0; k -= step) { const dt = new Date(end); dt.setDate(end.getDate() - (n - 1 - k)); days.push({ t: MON[dt.getMonth()] + ' ' + dt.getDate(), x: (k / (n - 1) * 100).toFixed(3) + '%', tx: k === n - 1 ? '-100%' : k < step ? '0' : '-50%' }); }
        app._chartKey = av + '|' + mi + '|' + rngDays;
        // Previous period: the same metric rngDays earlier, drawn where that data exists.
        const line = path(pts), prev = A.series ? pts.slice(0, n - rngDays).map((p, i) => 'ML'[i ? 1 : 0] + ((i + rngDays) * 10) + ' ' + Math.round(180 - (p / mx) * 170)).join(' ') : path(pts.map((p, i) => p * 0.88 + (i % 3) * 2));
        const num = s => parseFloat(String(s).replace(/[^0-9.]/g, '')) || 0;
        // A breakdown with no rows (say, no device numbers yet) is left out rather than drawn empty.
        const anSections = A.sec.filter(([, d]) => d.rows.length).map(([title, d, full]) => {
          const o = { title, span: full ? '1 / -1' : 'auto', isBars: d.type === 'bars', isFunnel: d.type === 'funnel', isTable: d.type === 'table', cols: [], rows: [] };
          if (d.type === 'bars') { const m = Math.max(...d.rows.map(r => num(r[1]))), tot = d.rows.reduce((t, r) => t + num(r[1]), 0); o.aria = title + ': ' + d.rows.map(r => r[0] + ' ' + r[1]).join(', '); o.rows = d.rows.map(([label, value], ri) => ({ label, value, logo: PLOGO[label] || '', hasLogo: !!PLOGO[label], icon: PICON[label] || '', hasIcon: !PLOGO[label] && !!PICON[label], noLogo: !PLOGO[label] && !PICON[label], pct: (num(value) / tot * 100).toFixed(1) + '%', pctLabel: Math.round(num(value) / tot * 100) + '%', col: (av === 'an-all' && PLAT[label]) || PAL[av].pal[ri % PAL[av].pal.length], w: Math.max(3, Math.round(num(value) / m * 100)) + '%' })); const CIRC = 2 * Math.PI * 40; let acc = 0; o.rows.forEach(r => { const len = num(r.pct) / 100 * CIRC; r.dash = Math.max(len - 1, 0.5).toFixed(2) + ' ' + CIRC.toFixed(2); r.off = (-acc).toFixed(2); acc += len; }); const top = o.rows.reduce((b, r) => num(r.pct) > num(b.pct) ? r : b, o.rows[0]); o.topPct = top.pctLabel; o.topLabel = top.label; }
          if (d.type === 'funnel') { const top = d.rows[0][1]; o.rows = d.rows.map(([label, val], i) => ({ label, col: PAL[av].pal[i % PAL[av].pal.length], value: val >= 10000 ? (val / 1000).toFixed(val >= 100000 ? 0 : 1) + 'k' : val.toLocaleString(), w: Math.max(2, Math.round(Math.sqrt(val / top) * 100)) + '%', drop: i ? Math.round(val / d.rows[i - 1][1] * 100) + '% of previous step' : 'Starting point', dc: i && val / d.rows[i - 1][1] < 0.5 ? '#a3330c' : '#5a6474' })); }
          if (d.type === 'table') { const left = i => !i || d.cols[i] === 'Client'; o.cols = d.cols.map((t, i) => ({ t, a: left(i) ? 'left' : 'right' })); const SL = { 'Meta': '/assets/logo-meta.png', 'Meta Ads': '/assets/logo-meta.png', 'Google Ads': '/assets/logo-google-ads.png', 'GA4': '/assets/logo-ga4.png', 'Google Analytics 4': '/assets/logo-ga4.png', 'TikTok': '/assets/logo-tiktok.png', 'TikTok Ads': '/assets/logo-tiktok.png', 'Search Console': '/assets/logo-search-console.png', 'Google Search Console': '/assets/logo-search-console.png', 'Instagram': '/assets/logo-instagram.png', 'LinkedIn': '/assets/logo-linkedin.png', 'Microsoft Ads': '/assets/logo-microsoft.png' }; o.rows = d.rows.map(r => ({ cells: r.map((v, i) => ({ v, logo: SL[v] || null, a: left(i) ? 'left' : 'right', fw: i ? 500 : 600, c: v === 'Paused' ? '#5a6474' : '#0b1626' })) })); }
          return o;
        });
        const rng = S.range || '14 days';
        // Hover: the day under the pointer, with this period's and the previous period's value.
        const prevAt = k => A.series ? (k >= rngDays ? pts[k - rngDays] : null) : pts[k] * 0.88 + (k % 3) * 2;
        const label = A.m[mi][0], fmtV = v => v == null ? 'No data' : /rate/i.test(label) ? v.toFixed(1) + '%' : /spend|cost/i.test(label) ? '$' + Math.round(v).toLocaleString() : Math.round(v).toLocaleString();
        const dayOf = k => { const dt = new Date(end); dt.setDate(end.getDate() - (n - 1 - k)); return MON[dt.getMonth()] + ' ' + dt.getDate(); };
        const hideCur = !!S.anHideCur, hidePrev = !!S.anHidePrev, hk = S.anHover;
        const hover = hk != null && hk >= 0 && hk < n ? { x: (hk / (n - 1) * 100).toFixed(3) + '%', flip: hk > n - 8, date: dayOf(hk), cur: fmtV(pts[hk]), prev: fmtV(prevAt(hk)),
          curY: (180 - (pts[hk] / mx) * 170) / 180 * 100 + '%', prevY: prevAt(hk) == null ? null : (180 - (prevAt(hk) / mx) * 170) / 180 * 100 + '%' } : null;
        const chartVals = { anHover: hover, anShowCur: !hideCur, anShowPrev: !hidePrev,
          anToggleCur: () => app.setState({ anHideCur: !hideCur, anHidePrev: !hideCur ? false : hidePrev }), anTogglePrev: () => app.setState({ anHidePrev: !hidePrev, anHideCur: !hidePrev ? false : hideCur }),
          anMove: e => { const r = e.currentTarget.getBoundingClientRect(), k = Math.max(0, Math.min(n - 1, Math.round((e.clientX - r.left) / r.width * (n - 1)))); if (k !== S.anHover) app.setState({ anHover: k }); },
          anLeave: () => { if (S.anHover != null) app.setState({ anHover: null }); } };
        return { ...blank, ...chartVals, anTools, anHas: true, anTint: PAL[av].tint, anInk: PAL[av].ink, anSections, anTake: A.take, anFresh: A.fresh, anHasTake: !!A.take, anColor: A.color, anFill: A.color + '1a',
          anMetrics: A.m.map(([label, value, note], i) => ({ label, value, note: note + ' vs previous', c: good(label, note), on: i === mi, bg: i === mi ? 'var(--an-tint)' : 'transparent', pick: () => app.setState({ anMetric: i }) })),
          anChartLabel: A.m[mi][0] + ' per day, ' + A.name,
          anLine: line, anPrev: prev, anArea: line + ' L' + W + ' 180 L0 180 Z', anVB: '0 0 ' + W + ' 180', anGrid: 'M0 45H' + W + 'M0 90H' + W + 'M0 135H' + W, anChartW: (TOTAL / rngDays * 100).toFixed(1) + '%', chartRef: app.chartRef,
          anDays: days.reverse(),
          anRanges: ['7 days', '14 days', '30 days'].map(label => ({ label, bg: label === rng ? 'var(--an-ink)' : '#ffffff', c: label === rng ? '#ffffff' : '#0b1626', bd: label === rng ? 'var(--an-ink)' : '#d3dbe6', pick: () => app.setState({ range: label }) })) };
      })(),

  };
}

const money = (v, cents) => '$' + (cents && v < 100 ? v.toFixed(2) : Math.round(v).toLocaleString());

// The Meta view, from stored Meta numbers. Leads are the ones Meta reports for its own ads.
function metaView(LV, S, rng) {
  const { M, accts } = LV;
  const sum = (m, back = 0) => M.sum(accts, m, rng, back);
  const s = { spend: sum('spend'), imp: sum('impressions'), clicks: sum('clicks'), leads: sum('leads') };
  const p = { spend: sum('spend', 1), imp: sum('impressions', 1), clicks: sum('clicks', 1), leads: sum('leads', 1) };
  const rate = (a, b) => (b ? (a / b) * 100 : 0), pts = (a, b) => { const d = Math.round((a - b) * 10) / 10; return (d > 0 ? '+' : d < 0 ? '\u2212' : '') + Math.abs(d) + ' pts'; };
  const ser = m => M.series(accts, m, 90), ratio = (a, b, k = 1) => { const x = ser(a), y = ser(b); return x.map((v, i) => (y[i] ? (v / y[i]) * k : 0)); };
  const cpl = (a, b) => (b ? a / b : 0);
  const tiles = [
    ['Spend', money(s.spend), pct(s.spend, p.spend), ser('spend')],
    ['Impressions', fmtNum(s.imp), pct(s.imp, p.imp), ser('impressions')],
    ['Clicks', fmtNum(s.clicks), pct(s.clicks, p.clicks), ser('clicks')],
    ['Click-through rate', rate(s.clicks, s.imp).toFixed(1) + '%', pts(rate(s.clicks, s.imp), rate(p.clicks, p.imp)), ratio('clicks', 'impressions', 100)],
    ['Leads', fmtNum(s.leads), pct(s.leads, p.leads), ser('leads')],
    ['Cost per lead', s.leads ? money(cpl(s.spend, s.leads), true) : 'No leads', s.leads && p.leads ? pct(cpl(s.spend, s.leads), cpl(p.spend, p.leads)) : '0%', ratio('spend', 'leads')],
  ];
  const groups = LV.per || [{ name: '', accts }];
  const camps = groups.flatMap(g => M.breakdown(g.accts, 'campaign', 'spend', rng).map(([c, v]) => {
    const get = m => (M.breakdown(g.accts, 'campaign', m, rng).find(r => r[0] === c) || [0, 0])[1], l = get('leads');
    return { v, l, c, row: [c].concat(LV.per ? [g.name] : [], [money(v), fmtNum(get('clicks')), fmtNum(l), l ? money(v / l, true) : '–']) };
  })).sort((x, y) => y.v - x.v);
  // Placement and age: by leads when there are any, else by spend.
  const by = (dim, label) => { const m = M.breakdown(accts, dim, 'leads', rng).length ? 'leads' : 'spend', rows = M.breakdown(accts, dim, m, rng), tot = rows.reduce((t, r) => t + r[1], 0);
    return rows.length ? [(m === 'leads' ? 'Leads by ' : 'Spend by ') + label, { type: 'bars', rows: rows.slice(0, 6).map(([k, v]) => [k.charAt(0).toUpperCase() + k.slice(1), Math.round(v / tot * 100) + '%']) }] : null; };
  const sec = [];
  if (camps.length) sec.push(['Campaigns', { type: 'table', cols: ['Campaign'].concat(LV.per ? ['Client'] : [], ['Spend', 'Clicks', 'Leads', 'Cost per lead']), rows: camps.slice(0, 8).map(x => x.row) }, true]);
  for (const b of [by('placement', 'placement'), by('age', 'age')]) if (b) sec.push(b);
  const best = camps.filter(x => x.l >= 3).sort((x, y) => x.v / x.l - y.v / y.l)[0];
  const take = s.spend ? money(s.spend) + ' spent on Meta in the last ' + rng + ' days, ' + pct(s.spend, p.spend) + ' on the ' + rng + ' days before. '
    + (s.leads ? fmtNum(s.leads) + (s.leads === 1 ? ' lead' : ' leads') + ' at ' + money(cpl(s.spend, s.leads), true) + ' each' + (p.leads ? ', ' + pct(cpl(s.spend, s.leads), cpl(p.spend, p.leads)) + ' on cost per lead.' : '.') + (best && camps.length > 1 ? ' ' + best.c + ' brings the cheapest leads, ' + money(best.v / best.l, true) + ' each.' : '')
      : 'No leads reported, so check the lead form or the pixel\'s lead event.') : 'No Meta spend in the last ' + rng + ' days.';
  return { name: 'Meta', logo: LOGOS.meta, color: '#0866FF', through: M.through, fresh: 'Data up to ' + fmtDay(M.through) + ' · Meta may still revise the last 3 days',
    m: tiles.map(t => [t[0], t[1], t[2]]), series: tiles.map(t => t[3]), take, sec };
}

// A dashboard view (same shape as the sample AN entries) built from stored GA4 numbers for the chosen clients and range.
function liveView(LV, S, rng) {
  const { M, accts } = LV, all = LV.key === 'an-all';
  const sum = (m, back = 0) => M.sum(accts, m, rng, back);
  const s = { sessions: sum('sessions'), engaged: sum('engagedSessions'), leads: sum('keyEvents'), views: sum('screenPageViews') };
  const p = { sessions: sum('sessions', 1), engaged: sum('engagedSessions', 1), leads: sum('keyEvents', 1), views: sum('screenPageViews', 1) };
  const rate = (a, b) => (b ? (a / b) * 100 : 0), pts = (a, b) => { const d = Math.round((a - b) * 10) / 10; return (d > 0 ? '+' : d < 0 ? '\u2212' : '') + Math.abs(d) + ' pts'; };
  const ser = m => M.series(accts, m, 90), ratio = (a, b) => { const x = ser(a), y = ser(b); return x.map((v, i) => (y[i] ? (v / y[i]) * 100 : 0)); };
  const spend = M.breakdown(accts, 'campaign', 'adCost', rng).reduce((t, r) => t + r[1], 0);
  const tiles = [
    ['Sessions', fmtNum(s.sessions), pct(s.sessions, p.sessions), ser('sessions')],
    ['Key events', fmtNum(s.leads), pct(s.leads, p.leads), ser('keyEvents')],
    ['Conversion rate', rate(s.leads, s.sessions).toFixed(1) + '%', pts(rate(s.leads, s.sessions), rate(p.leads, p.sessions)), ratio('keyEvents', 'sessions')],
    ['Engagement rate', Math.round(rate(s.engaged, s.sessions)) + '%', pts(rate(s.engaged, s.sessions), rate(p.engaged, p.sessions)), ratio('engagedSessions', 'sessions')],
    ['Page views', fmtNum(s.views), pct(s.views, p.views), ser('screenPageViews')],
  ];
  // Spend across platforms: Meta spend plus Google Ads cost from GA4. Cost per lead divides it by the sites' leads,
  // since each platform counts leads it only helped with.
  const metaSpend = (back = 0) => M.sum(LV.meta, 'spend', rng, back), gadsSpend = (back = 0) => M.dimSum(LV.ga4, 'campaign', 'adCost', rng, back);
  const spendNow = metaSpend() + gadsSpend(), spendPrev = metaSpend(1) + gadsSpend(1);
  const spendSer = () => { const a = M.series(LV.meta, 'spend', 90), b = M.dimSeries(LV.ga4, 'campaign', 'adCost', 90); return a.map((v, i) => v + b[i]); };
  if (all) {
    tiles.splice(0, 2, ['Leads', fmtNum(s.leads), pct(s.leads, p.leads), ser('keyEvents')], ['Sessions', fmtNum(s.sessions), pct(s.sessions, p.sessions), ser('sessions')]);
    if (spendNow || spendPrev) { const sp = spendSer(), ld = ser('keyEvents');
      tiles.splice(1, 0, ['Spend', money(spendNow), pct(spendNow, spendPrev), sp], ['Cost per lead', s.leads ? money(spendNow / s.leads, true) : 'No leads', p.leads && s.leads ? pct(spendNow / s.leads, spendPrev / p.leads) : '0%', sp.map((v, i) => (ld[i] ? v / ld[i] : 0))]);
      tiles.splice(5); }
  }
  const cap = x => x.charAt(0).toUpperCase() + x.slice(1);
  const bars = (dim, metric, label = x => x) => M.breakdown(accts, dim, metric, rng).slice(0, 7).map(([k, v]) => [label(k), fmtNum(v)]);
  const chan = M.breakdown(accts, 'channel', 'sessions', rng), top = chan[0];
  // Top landing pages. With several clients, each row is one client's page, labelled with that client.
  const groups = LV.per || [{ name: '', accts }];
  const pages = groups.flatMap(g => M.breakdown(g.accts, 'page', 'sessions', rng).map(([page, ses]) => {
    const e = M.breakdown(g.accts, 'page', 'engagedSessions', rng).find(r => r[0] === page), k = M.breakdown(g.accts, 'page', 'keyEvents', rng).find(r => r[0] === page);
    return { ses, row: [page].concat(LV.per ? [g.name] : [], [fmtNum(ses), Math.round(rate(e ? e[1] : 0, ses)) + '%', fmtNum(k ? k[1] : 0), rate(k ? k[1] : 0, ses).toFixed(1) + '%']) };
  })).sort((x, y) => y.ses - x.ses).slice(0, 8).map(x => x.row);
  const sec = [];
  const leadsByChannel = bars('channel', 'keyEvents');
  if (all && leadsByChannel.length) sec.push(['Leads by channel, from Google Analytics 4', { type: 'bars', rows: leadsByChannel }]);
  if (all && spendNow) sec.push(['Spend by platform', { type: 'bars', rows: [['Meta', metaSpend()], ['Google Ads', gadsSpend()]].filter(r => r[1] > 0).sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, money(v)]) }]);
  if (all && metaSpend()) { const ml = M.sum(LV.meta, 'leads', rng);
    sec.push(['Leads each platform reports', { type: 'table', cols: ['Platform', 'Spend', 'Leads they report', 'Cost per lead they report'], rows: [['Meta', money(metaSpend()), fmtNum(ml), ml ? money(metaSpend() / ml, true) : '–']] }, true]); }
  sec.push(['Sessions by channel', { type: 'bars', rows: bars('channel', 'sessions') }]);
  sec.push(['Sessions by device', { type: 'bars', rows: bars('device', 'sessions', cap) }]);
  if (spend > 0) sec.push(['Google Ads campaigns, from Google Analytics 4', { type: 'table', cols: ['Campaign'].concat(LV.per ? ['Client'] : [], ['Cost', 'Clicks']),
    rows: groups.flatMap(g => M.breakdown(g.accts, 'campaign', 'adCost', rng).map(([c, v]) => { const cl = M.breakdown(g.accts, 'campaign', 'adClicks', rng).find(r => r[0] === c); return { v, row: [c].concat(LV.per ? [g.name] : [], ['$' + Math.round(v).toLocaleString(), fmtNum(cl ? cl[1] : 0)]) }; }))
      .sort((x, y) => y.v - x.v).slice(0, 8).map(x => x.row) }, true]);
  if (pages.length) sec.push(['Top landing pages', { type: 'table', cols: ['Page'].concat(LV.per ? ['Client'] : [], ['Sessions', 'Engagement', 'Key events', 'Conv. rate']), rows: pages }, true]);
  const spendNote = all && spendNow ? ' ' + money(spendNow) + ' spent on ads' + (s.leads ? ', ' + money(spendNow / s.leads, true) + ' per lead.' : '.') : '';
  const take = s.sessions ? fmtNum(s.sessions) + ' sessions in the last ' + rng + ' days, ' + pct(s.sessions, p.sessions) + ' on the ' + rng + ' days before.' + (top ? ' ' + top[0] + ' brought the most, ' + Math.round((top[1] / s.sessions) * 100) + '%.' : '') + (s.leads ? ' ' + fmtNum(s.leads) + (s.leads === 1 ? ' key event' : ' key events') + ' recorded.' : ' No key events recorded, so check which GA4 events count as leads.') + spendNote : '';
  return { name: all ? 'All sources' : 'Google Analytics 4', logo: all ? '/assets/clario-mark-v2.png' : LOGOS.ga4, color: all ? '#1f6be2' : '#E37400', through: M.through,
    fresh: (all ? 'Leads from GA4 key events · ' : '') + 'Data up to ' + fmtDay(M.through) + ' · GA4 can take 2 days to finish processing',
    m: tiles.map(t => [t[0], t[1], t[2]]), series: tiles.map(t => t[3]), take, sec };
}
