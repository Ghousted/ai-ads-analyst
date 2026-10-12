// Dashboard analytics.
import { LOGOS } from '../../data';

const L = LOGOS;
const tb = (cols, rows) => ({ type: 'table', cols, rows });
const br = (rows) => ({ type: 'bars', rows });
const fn = (rows) => ({ type: 'funnel', rows });
const AN = {
  'an-all': { name: 'All sources', logo: '/assets/clario-mark-v2.png', color: '#1f6be2', s: [60, 64, 58, 70, 72, 68, 75, 80, 78, 74, 82, 86, 84, 90],
    m: [['Leads', '533', '+6%'], ['Spend', '$4,320', '+2%'], ['Cost per lead', '$8.10', '−4%'], ['Conversions', '612', '+9%']],
    take: 'Leads are up 6% while spend rose only 2%. Meta retargeting and Google search brought in most of the growth.',
    sec: [['Leads by platform', br([['Meta', '312'], ['Google Ads', '148'], ['TikTok Ads', '41'], ['Website (organic)', '32']])],
      ['Spend by platform', br([['Meta', '$2,246'], ['Google Ads', '$1,410'], ['TikTok Ads', '$664']])],
      ['Top campaigns across platforms', tb(['Campaign', 'Platform', 'Spend', 'Leads', 'Cost per lead'], [['Retargeting · site visitors', 'Meta', '$820', '134', '$6.12'], ['Brand search', 'Google Ads', '$410', '61', '$6.72'], ['Lookalike · past leads', 'Meta', '$690', '88', '$7.84'], ['Local services', 'Google Ads', '$560', '52', '$10.77'], ['Spark ads · creators', 'TikTok Ads', '$664', '41', '$16.20']]), true]] },
  'an-meta': { name: 'Meta', logo: L.meta, color: '#0866FF', s: [40, 44, 42, 48, 46, 52, 55, 50, 58, 60, 57, 62, 64, 66],
    m: [['Spend', '$2,246', '+3%'], ['Reach', '84.2k', '+12%'], ['Clicks', '3,940', '+8%'], ['CTR', '1.9%', '+0.2 pts'], ['Leads', '312', '+5%'], ['Cost per lead', '$7.20', '−6%']],
    take: 'Retargeting returns leads at $6.12, about 35% cheaper than cold audiences. Instagram Reels now drive more leads than the Facebook feed.',
    sec: [['Campaigns', tb(['Campaign', 'Status', 'Spend', 'Reach', 'Leads', 'Cost per lead'], [['Retargeting · site visitors', 'Active', '$820', '18.4k', '134', '$6.12'], ['Lookalike · past leads', 'Active', '$690', '31.2k', '88', '$7.84'], ['Interest · local 25–45', 'Active', '$480', '26.9k', '62', '$7.74'], ['Promo · October offer', 'Paused', '$256', '7.7k', '28', '$9.14']]), true],
      ['Leads by placement', br([['Instagram Reels', '38%'], ['Facebook feed', '29%'], ['Instagram feed', '21%'], ['Stories', '12%']])],
      ['Leads by age', br([['18–24', '9%'], ['25–34', '34%'], ['35–44', '31%'], ['45–54', '17%'], ['55+', '9%']])],
      ['Top ads', tb(['Ad', 'CTR', 'Leads', 'Cost per lead'], [['Before and after video', '2.8%', '71', '$5.40'], ['Customer testimonial', '2.1%', '58', '$6.30'], ['Free consult offer', '1.6%', '44', '$7.90'], ['Team photo carousel', '0.9%', '19', '$11.20']]), true]] },
  'an-ga4': { name: 'Google Analytics 4', logo: L.ga4, color: '#E37400', s: [70, 72, 68, 74, 80, 62, 58, 75, 78, 76, 82, 66, 60, 84],
    m: [['Sessions', '18.4k', '+4%'], ['Users', '12.1k', '+3%'], ['Engagement rate', '61%', '+2 pts'], ['Conversions', '640', '+9%'], ['Conversion rate', '3.5%', '+0.3 pts']],
    take: 'Most visitors who start the booking form leave at step 2, mostly on mobile. Shortening that step could add 20+ leads a week.',
    sec: [['Sessions by channel', br([['Paid social', '6,210'], ['Organic search', '4,880'], ['Direct', '3,120'], ['Paid search', '2,940'], ['Referral', '860'], ['Email', '390']])],
      ['Sessions by device', br([['Mobile', '71%'], ['Desktop', '25%'], ['Tablet', '4%']])],
      ['Booking funnel', fn([['Viewed a page', 18400], ['Started the form', 2310], ['Reached step 2', 1420], ['Submitted', 640]]), true],
      ['Top landing pages', tb(['Page', 'Sessions', 'Engagement', 'Conversions', 'Conv. rate'], [['/book-now', '4,210', '68%', '312', '7.4%'], ['/', '6,880', '57%', '148', '2.2%'], ['/services/physio', '2,140', '64%', '82', '3.8%'], ['/pricing', '1,960', '71%', '58', '3.0%'], ['/blog/back-pain-tips', '1,720', '49%', '12', '0.7%']]), true]] },
  'an-gads': { name: 'Google Ads', logo: L.gads, color: '#1A73E8', s: [50, 55, 60, 58, 62, 40, 38, 57, 63, 65, 61, 44, 42, 68],
    m: [['Spend', '$1,410', '+1%'], ['Impressions', '210k', '+2%'], ['Clicks', '5,120', '+6%'], ['CTR', '2.4%', '+0.1 pts'], ['Conversions', '148', '+11%'], ['Cost per conversion', '$9.53', '−9%']],
    take: 'Brand search converts at the lowest cost. Weekday mornings bring twice the conversions of weekends, so shifting budget there would help.',
    sec: [['Campaigns', tb(['Campaign', 'Type', 'Spend', 'Clicks', 'Conv.', 'Cost per conv.'], [['Brand search', 'Search', '$410', '1,880', '61', '$6.72'], ['Local services', 'Search', '$560', '1,940', '52', '$10.77'], ['Remarketing display', 'Display', '$260', '910', '24', '$10.83'], ['Performance Max', 'PMax', '$180', '390', '11', '$16.36']]), true],
      ['Top search terms', tb(['Search term', 'Clicks', 'Conv.'], [['physio near me', '412', '22'], ['northside physio', '388', '31'], ['sports massage', '204', '9'], ['back pain clinic', '176', '7']])],
      ['Conversions by device', br([['Mobile', '58%'], ['Desktop', '38%'], ['Tablet', '4%']])]] },
  'an-tt': { name: 'TikTok Ads', logo: L.tt, color: '#FE2C55', s: [30, 34, 40, 38, 45, 52, 60, 58, 64, 70, 68, 74, 80, 86],
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
const PLAT = { 'Meta': '#0866FF', 'Google Ads': '#4285F4', 'TikTok Ads': '#000000', 'Website (organic)': '#97a2b2' };

export function dashboardVals(app, ctx) {
  // eslint-disable-next-line no-unused-vars
  const { S, v, go, ST, L, C, clients, inDash, rkCount, atRisk, defTasks, TCOLS, PEOPLE, tkSrc, setTasks, moveTask, tasksAll } = ctx;
  return {
      tapTake: () => app.setState({ takeOpen: true }), takeOpenB: !!S.takeOpen,
      showTake: () => app.setState({ takeOpen: true }), hideTake: () => app.setState({ takeOpen: false }), takeO: S.takeOpen ? 1 : 0, takeT: S.takeOpen ? 'translateY(0) scale(1)' : 'translateY(-4px) scale(0.97)', takeVis: S.takeOpen ? 'visible' : 'hidden', takeBtnBg: S.takeOpen ? '#eef3fd' : '#f4f7fb',
      vAn: v === 'an', ...(() => {
        const av = S.anTool || 'an-all';
        const blank = { anVB: '0 0 600 180', anGrid: '', anChartW: '100%', chartRef: app.chartRef, anTint: '#eef3fd', anInk: '#0b1626', anTools: [], anMetrics: [], anSections: [], anDays: [], anRanges: [], anLine: '', anArea: '', anPrev: '', anColor: '#1f6be2', anFill: '#eef3fd', anTake: '', anChartLabel: '', anEmpty: false, anHas: false, anEmptyTitle: '', anEmptyBtn: '', anEmptyLogo: '', anEmptyTool: '' };
        if (v !== 'an') return blank;
        const A = AN[av];
        const anTools = Object.keys(AN).map(key => ({ label: AN[key].name, logo: AN[key].logo, on: key === av, bg: key === av ? '#ffffff' : 'transparent', fw: key === av ? 700 : 500, tipO: S.anTip === key ? 1 : 0, tipY: S.anTip === key ? '0px' : '-4px', tipOn: () => app.setState({ anTip: key }), tipOff: () => app.setState(s => s.anTip === key ? { anTip: null } : null), pick: () => app.setState({ anTool: key, anMetric: 0, takeOpen: false }) }));
        const toolKey = ({ 'an-meta': 'meta', 'an-ga4': 'ga4', 'an-gads': 'gads', 'an-tt': 'tt' })[av];
        if (S.sel != null && toolKey && !C[S.sel].logos.includes(toolKey)) return { ...blank, anTools, anEmpty: true, anEmptyLogo: A.logo, anEmptyTool: A.name, anEmptyTitle: C[S.sel].name + ' is not connected to ' + A.name, anEmptyBtn: 'Connect ' + A.name, anEmptyGo: () => app.setState(s => ({ view: 'settings', stgTab: 'conn', stgOpen: { ...(s.stgOpen || {}), [toolKey]: true } })) };
        const mi = Math.min(S.anMetric || 0, A.m.length - 1);
        const good = (label, note) => note.startsWith('+') ? '#1d6b3a' : note.startsWith('−') ? '#a3330c' : '#5a6474';
        const TOTAL = 90, rngDays = { '7 days': 7, '14 days': 14, '30 days': 30 }[S.range || '14 days'];
        const pts = Array.from({ length: TOTAL }, (_, k) => A.s[k % A.s.length] * (0.72 + 0.28 * k / (TOTAL - 1)) * (1 + 0.12 * Math.sin(k * 0.9 + mi * 1.7)));
        const n = pts.length, mx = Math.max(...pts) * 1.15, W = (n - 1) * 10;
        const path = arr => arr.map((p, i) => (i ? 'L' : 'M') + (i * 10) + ' ' + Math.round(180 - (p / mx) * 170)).join(' ');
        const end = new Date(2026, 9, 5), MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const step = rngDays <= 7 ? 1 : rngDays <= 14 ? 2 : 5;
        const days = []; for (let k = n - 1; k >= 0; k -= step) { const dt = new Date(end); dt.setDate(end.getDate() - (n - 1 - k)); days.push({ t: MON[dt.getMonth()] + ' ' + dt.getDate(), x: (k / (n - 1) * 100).toFixed(3) + '%', tx: k === n - 1 ? '-100%' : k < step ? '0' : '-50%' }); }
        app._chartKey = av + '|' + mi + '|' + rngDays;
        const line = path(pts), prev = path(pts.map((p, i) => p * 0.88 + (i % 3) * 2));
        const num = s => parseFloat(String(s).replace(/[^0-9.]/g, '')) || 0;
        const anSections = A.sec.map(([title, d, full]) => {
          const o = { title, span: full ? '1 / -1' : 'auto', isBars: d.type === 'bars', isFunnel: d.type === 'funnel', isTable: d.type === 'table', cols: [], rows: [] };
          if (d.type === 'bars') { const m = Math.max(...d.rows.map(r => num(r[1]))), tot = d.rows.reduce((t, r) => t + num(r[1]), 0); o.aria = title + ': ' + d.rows.map(r => r[0] + ' ' + r[1]).join(', '); o.rows = d.rows.map(([label, value], ri) => ({ label, value, logo: PLOGO[label] || '', hasLogo: !!PLOGO[label], icon: PICON[label] || '', hasIcon: !PLOGO[label] && !!PICON[label], noLogo: !PLOGO[label] && !PICON[label], pct: (num(value) / tot * 100).toFixed(1) + '%', pctLabel: Math.round(num(value) / tot * 100) + '%', col: (av === 'an-all' && PLAT[label]) || PAL[av].pal[ri % PAL[av].pal.length], w: Math.max(3, Math.round(num(value) / m * 100)) + '%' })); const CIRC = 2 * Math.PI * 40; let acc = 0; o.rows.forEach(r => { const len = num(r.pct) / 100 * CIRC; r.dash = Math.max(len - 1, 0.5).toFixed(2) + ' ' + CIRC.toFixed(2); r.off = (-acc).toFixed(2); acc += len; }); const top = o.rows.reduce((b, r) => num(r.pct) > num(b.pct) ? r : b, o.rows[0]); o.topPct = top.pctLabel; o.topLabel = top.label; }
          if (d.type === 'funnel') { const top = d.rows[0][1]; o.rows = d.rows.map(([label, val], i) => ({ label, col: PAL[av].pal[i % PAL[av].pal.length], value: val >= 10000 ? (val / 1000).toFixed(val >= 100000 ? 0 : 1) + 'k' : val.toLocaleString(), w: Math.max(2, Math.round(Math.sqrt(val / top) * 100)) + '%', drop: i ? Math.round(val / d.rows[i - 1][1] * 100) + '% of previous step' : 'Starting point', dc: i && val / d.rows[i - 1][1] < 0.5 ? '#a3330c' : '#5a6474' })); }
          if (d.type === 'table') { o.cols = d.cols.map((t, i) => ({ t, a: i ? 'right' : 'left' })); const SL = { 'Meta': '/assets/logo-meta.png', 'Meta Ads': '/assets/logo-meta.png', 'Google Ads': '/assets/logo-google-ads.png', 'GA4': '/assets/logo-ga4.png', 'Google Analytics 4': '/assets/logo-ga4.png', 'TikTok': '/assets/logo-tiktok.png', 'TikTok Ads': '/assets/logo-tiktok.png', 'Search Console': '/assets/logo-search-console.png', 'Google Search Console': '/assets/logo-search-console.png', 'Instagram': '/assets/logo-instagram.png', 'LinkedIn': '/assets/logo-linkedin.png', 'Microsoft Ads': '/assets/logo-microsoft.png' }; o.rows = d.rows.map(r => ({ cells: r.map((v, i) => ({ v, logo: SL[v] || null, a: i ? 'right' : 'left', fw: i ? 500 : 600, c: v === 'Paused' ? '#5a6474' : '#0b1626' })) })); }
          return o;
        });
        const rng = S.range || '14 days';
        return { ...blank, anTools, anHas: true, anTint: PAL[av].tint, anInk: PAL[av].ink, anSections, anTake: A.take, anColor: A.color, anFill: A.color + '1a',
          anMetrics: A.m.map(([label, value, note], i) => ({ label, value, note: note + ' vs previous', c: good(label, note), on: i === mi, bg: i === mi ? 'var(--an-tint)' : 'transparent', pick: () => app.setState({ anMetric: i }) })),
          anChartLabel: A.m[mi][0] + ' per day, ' + A.name,
          anLine: line, anPrev: prev, anArea: line + ' L' + W + ' 180 L0 180 Z', anVB: '0 0 ' + W + ' 180', anGrid: 'M0 45H' + W + 'M0 90H' + W + 'M0 135H' + W, anChartW: (TOTAL / rngDays * 100).toFixed(1) + '%', chartRef: app.chartRef,
          anDays: days.reverse(),
          anRanges: ['7 days', '14 days', '30 days'].map(label => ({ label, bg: label === rng ? 'var(--an-ink)' : '#ffffff', c: label === rng ? '#ffffff' : '#0b1626', bd: label === rng ? 'var(--an-ink)' : '#d3dbe6', pick: () => app.setState({ range: label }) })) };
      })(),

  };
}
