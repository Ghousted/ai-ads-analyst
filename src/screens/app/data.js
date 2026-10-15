// Sample data shared by every module until real integrations replace it.
// Each connection is one login. Meta, Google Ads, TikTok and Microsoft Ads have an agency container, so one login
// sees every client. GA4, Search Console and Business Profile grant access per Google user, so a platform can have
// several logins and each one sees different properties.
// base: connected in the sample agency. second: what another teammate's Google login finds.
const CATALOG = [
  { id: 'meta', tool: 'meta', base: true, who: 'Rivera Digital Business Manager', by: 'Alex Rivera', sync: 'Synced 4 minutes ago', accts: [['Northside Physio · Main', 'act_2841 0937', 'Northside Physio'], ['Kalye Streetwear · Ads', 'act_5520 1186', 'Kalye Streetwear'], ['Harbor & Pine · Bookings', 'act_7713 4402', 'Harbor & Pine Dental'], ['Mara Skincare · US', 'act_3390 7751', 'Mara Skincare'], ['Rivera Digital · Agency', 'act_1102 5530', '']] },
  { id: 'ga4', tool: 'ga4', base: true, who: 'alex@riveradigital.com', by: 'Alex Rivera', sync: 'Synced 4 minutes ago', accts: [['northsidephysio.com', 'Property 3184 2207', 'Northside Physio'], ['kalye.co', 'Property 4471 9025', 'Kalye Streetwear'], ['harborpine.com', 'Property 2290 6614', 'Harbor & Pine Dental'], ['coastline.realty', 'Property 5823 1170', 'Coastline Realty']] },
  { id: 'ga4-jordan', tool: 'ga4', base: true, who: 'jordan@riveradigital.com', by: 'Jordan Santos', sync: 'Synced 6 minutes ago', accts: [['maraskin.com', 'Property 6612 0458', '']] },
  { id: 'gads', tool: 'gads', base: true, who: 'Rivera Digital manager account', by: 'Alex Rivera', sync: 'Synced 12 minutes ago', accts: [['Mara Skincare', '482-119-3307', 'Mara Skincare'], ['Coastline Realty', '771-204-5598', 'Coastline Realty'], ['Harbor & Pine Dental', '309-662-1184', '']] },
  { id: 'tt', tool: 'tt', base: true, who: 'Rivera Digital Business Center', by: 'Jordan Santos', sync: 'Synced 1 hour ago', accts: [['Kalye Streetwear', '7302 1984 5521', 'Kalye Streetwear']] },
  { id: 'sc', tool: 'sc', who: 'alex@riveradigital.com', sync: 'Synced just now', accts: [['harborpine.com', 'Domain property', ''], ['northsidephysio.com', 'Domain property', ''], ['maraskin.com', 'URL prefix property', '']] },
  { id: 'li', tool: 'li', who: 'Alex Rivera (LinkedIn)', sync: 'Synced just now', accts: [['Coastline Realty · Sponsored', '508 221 904', ''], ['Rivera Digital', '508 117 332', '']] },
  { id: 'ms', tool: 'ms', who: 'Rivera Digital manager account', sync: 'Synced just now', accts: [['Harbor & Pine Dental', 'F120 4471', '']] },
  { id: 'gbp', tool: 'gbp', who: 'alex@riveradigital.com', sync: 'Synced just now', accts: [['Harbor & Pine Dental · Main St', 'Location 8841', ''], ['Northside Physio', 'Location 2207', ''], ['Coastline Realty', 'Location 5590', '']] },
  { id: 'ga4-mia', tool: 'ga4', second: true, who: 'mia@riveradigital.com', sync: 'Synced just now', accts: [['harborpine.com/kids', 'Property 7720 3318', '']] },
  { id: 'gads-jordan', tool: 'gads', second: true, who: 'jordan@riveradigital.com', sync: 'Synced just now', accts: [['Kalye Streetwear', '615-338-2047', '']] },
  { id: 'sc-jordan', tool: 'sc', second: true, who: 'jordan@riveradigital.com', sync: 'Synced just now', accts: [['kalye.co', 'Domain property', '']] },
  { id: 'gbp-jordan', tool: 'gbp', second: true, who: 'jordan@riveradigital.com', sync: 'Synced just now', accts: [['Kalye Streetwear · Store', 'Location 3127', '']] }
];
export const TOOL_NAMES = { meta: 'Meta', ga4: 'Google Analytics 4', gads: 'Google Ads', tt: 'TikTok Ads', sc: 'Google Search Console', li: 'LinkedIn Ads', ms: 'Microsoft Ads', gbp: 'Google Business Profile' };
// The order client logos are shown in.
export const TOOL_ORDER = ['meta', 'tt', 'gads', 'ga4', 'sc', 'li', 'ms', 'gbp'];
// Tools with no agency container: access is granted per Google user, so the agency may need several logins.
export const MULTI = ['ga4', 'gads', 'sc', 'gbp'];

// Connections the agency has right now: the sample ones, minus any disconnected, plus any connected later.
// S.connBy holds who owns a connection after it was reconnected, without touching its account assignments.
export const connList = S => { const off = S.connOff || {}, on = S.connOn || {}, by = S.connBy || {}; return CATALOG.filter(c => (c.base || on[c.id]) && !off[c.id]).map(c => ({ ...c, ...(by[c.id] || {}) })); };
// The connection that connecting this tool now would add, or null when there is nothing more to find.
export const nextConn = (S, tool) => { const live = connList(S).filter(c => c.tool === tool); if (live.length && !MULTI.includes(tool)) return null; const ids = live.map(c => c.id); return CATALOG.find(c => c.tool === tool && !ids.includes(c.id) && (live.length ? true : !c.second)) || null; };
export const acctKey = (id, j) => 'acct-' + id + '-' + j;
export const acctFor = (sel, conn, j) => { const k = acctKey(conn.id, j); return k in (sel || {}) ? sel[k] : conn.accts[j][2]; };
// Every account a tool can see across its connections, with the client it is assigned to.
export const toolAccts = (S, tool) => connList(S).filter(c => c.tool === tool).flatMap(c => c.accts.map((a, j) => ({ conn: c, j, a, client: acctFor(S.stgSel, c, j) })));
// A client's tools are the tools with at least one account assigned to that client.
export const clientTools = (S, name) => TOOL_ORDER.filter(t => toolAccts(S, t).some(x => x.client === name));
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
