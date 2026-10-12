// Sample data shared by every module until real integrations replace it.
export const ACCTS = {
  meta: ['Meta', 'Rivera Digital Business Manager', 'Synced 4 minutes ago', [['Northside Physio · Main', 'act_2841 0937', 'Northside Physio'], ['Kalye Streetwear · Ads', 'act_5520 1186', 'Kalye Streetwear'], ['Harbor & Pine · Bookings', 'act_7713 4402', 'Harbor & Pine Dental'], ['Mara Skincare · US', 'act_3390 7751', 'Mara Skincare'], ['Rivera Digital · Agency', 'act_1102 5530', '']]],
  ga4: ['Google Analytics 4', 'alex@riveradigital.com', 'Synced 4 minutes ago', [['northsidephysio.com', 'Property 3184 2207', 'Northside Physio'], ['kalye.co', 'Property 4471 9025', 'Kalye Streetwear'], ['harborpine.com', 'Property 2290 6614', 'Harbor & Pine Dental'], ['coastline.realty', 'Property 5823 1170', 'Coastline Realty']]],
  gads: ['Google Ads', 'Rivera Digital manager account', 'Synced 12 minutes ago', [['Mara Skincare', '482-119-3307', 'Mara Skincare'], ['Coastline Realty', '771-204-5598', 'Coastline Realty'], ['Harbor & Pine Dental', '309-662-1184', '']]],
  tt: ['TikTok Ads', 'Rivera Digital Business Center', 'Synced 1 hour ago', [['Kalye Streetwear', '7302 1984 5521', 'Kalye Streetwear']]]
};
// Accounts Clario finds when you connect a tool that the sample agency has not connected yet.
export const MORE_ACCTS = {
  sc: ['Google Search Console', 'alex@riveradigital.com', 'Synced just now', [['harborpine.com', 'Domain property', ''], ['northsidephysio.com', 'Domain property', ''], ['maraskin.com', 'URL prefix property', '']]],
  li: ['LinkedIn Ads', 'Alex Rivera (LinkedIn)', 'Synced just now', [['Coastline Realty · Sponsored', '508 221 904', ''], ['Rivera Digital', '508 117 332', '']]],
  ms: ['Microsoft Ads', 'Rivera Digital manager account', 'Synced just now', [['Harbor & Pine Dental', 'F120 4471', '']]],
  gbp: ['Google Business Profile', 'alex@riveradigital.com', 'Synced just now', [['Harbor & Pine Dental · Main St', 'Location 8841', ''], ['Northside Physio', 'Location 2207', ''], ['Coastline Realty', 'Location 5590', '']]]
};
const ALL_ACCTS = { ...ACCTS, ...MORE_ACCTS };

// Tools connected for the agency right now: the sample connections, minus any disconnected, plus any connected later.
export const connections = S => {
  const off = S.connOff || {}, on = S.connOn || {}, out = {};
  for (const k of Object.keys(ALL_ACCTS)) if ((k in ACCTS || on[k]) && !off[k]) out[k] = ALL_ACCTS[k];
  return out;
};
export const acctFor = (sel, tool, j) => { const k = 'acct-' + tool + '-' + j; return k in (sel || {}) ? sel[k] : ALL_ACCTS[tool][3][j][2]; };
export const clSplit = s => { s = String(s == null ? '' : s); const i = s.indexOf('Clario'); return i < 0 ? { a: s, b: '', c: '' } : { a: s.slice(0, i), b: 'Clario', c: s.slice(i + 6) }; };

export const TCOLS = [['todo', 'To do'], ['doing', 'In progress'], ['review', 'Review'], ['done', 'Done']];
export const PEOPLE = { AR: ['Alex Rivera', '#d6e4f8'], JS: ['Jordan Santos', '#fde2c8'], MK: ['Mia Kim', '#d4f0dd'] };
export const DEF_TASKS = [
  { title: 'Refresh TikTok creative', desc: 'Swap the two weakest videos for new hooks before the weekend push.', client: 'Kalye Streetwear', status: 'doing', sub: [2, 5], due: 'Oct 15', who: ['JS', 'MK'], cm: 3 },
  { title: 'Book check-in call with Dana', desc: 'Leads dipped two weeks running. Walk her through the plan before she asks.', client: 'Northside Physio', status: 'todo', sub: [0, 2], due: 'Oct 12', who: ['AR'], cm: 1 },
  { title: 'Fix mobile booking form step 2', desc: 'Half of mobile visitors drop off at the date picker.', client: 'Harbor & Pine Dental', status: 'todo', sub: [1, 4], due: 'Oct 18', who: ['JS'], cm: 2 },
  { title: 'Raise Google Ads budget cap', desc: 'Campaign hits its daily cap by 2pm. Ask for 15% more.', client: 'Harbor & Pine Dental', status: 'review', sub: [2, 3], due: 'Oct 14', who: ['AR', 'JS'], cm: 4 },
  { title: 'Set up GA4 conversion events', desc: 'Track bookings and calls so reports show real results.', client: 'Mara Skincare', status: 'doing', sub: [3, 4], due: 'Oct 16', who: ['MK'], cm: 0 },
  { title: 'Write November ad copy', desc: 'Holiday gift sets, three headline options per ad.', client: 'Mara Skincare', status: 'todo', sub: [0, 3], due: 'Oct 24', who: ['MK', 'AR'], cm: 0 },
  { title: 'Send October report', desc: 'Monthly results with the new cost per lead goal.', client: 'Mara Skincare', status: 'done', sub: [4, 4], due: 'Oct 6', who: ['AR'], cm: 2 }
];

export const LOGOS = { meta: '/assets/logo-meta.png', ga4: '/assets/logo-ga4.png', tt: '/assets/logo-tiktok.png', gads: '/assets/logo-google-ads.png', sc: '/assets/logo-search-console.png', ig: '/assets/logo-instagram.png', li: '/assets/logo-linkedin.png', ms: '/assets/logo-microsoft.png', gbp: '/assets/logo-google-business.png' };
