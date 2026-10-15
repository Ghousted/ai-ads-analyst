// Turns the stored daily rows (from the server) into the numbers the dashboard and client list show.
// rows: [account index, day 'YYYY-MM-DD', dim, dim value, metric, value]. Days with no row count as zero.

const addDays = (day, n) => { const d = new Date(day + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const fmtDay = day => { const d = new Date(day + 'T00:00:00Z'); return MON[d.getUTCMonth()] + ' ' + d.getUTCDate(); };

export function makeMetrics(m) {
  const through = m && m.through;
  // Index rows once: total[acct][metric][day] and dims[acct][dim][metric][value][day].
  const total = {}, dims = {};
  for (const [a, day, dim, val, metric, v] of (m && m.rows) || []) {
    if (dim === 'total') { ((total[a] ??= {})[metric] ??= {})[day] = v; }
    else { const x = (((dims[a] ??= {})[dim] ??= {})[metric] ??= {}); (x[val] ??= {})[day] = v; }
  }
  const idxFor = clientId => (m ? m.accounts : []).map((x, i) => (clientId == null || x.clientId === clientId ? i : -1)).filter(i => i >= 0);
  const days = n => Array.from({ length: n }, (_, k) => addDays(through, k - n + 1));
  const sumDays = (map, from, to) => { let t = 0; for (const day in map || {}) if (day >= from && day <= to) t += map[day]; return t; };
  return {
    has: !!through,
    through,
    // Daily values of a total metric across the given accounts, for the last n days ending at `through`.
    series(accts, metric, n) { return days(n).map(day => accts.reduce((t, a) => t + (((total[a] || {})[metric] || {})[day] || 0), 0)); },
    // Sum of a total metric over [end - n + 1, end], where end is `back` periods before `through`.
    sum(accts, metric, n, back = 0) { const to = addDays(through, -n * back), from = addDays(to, -n + 1); return accts.reduce((t, a) => t + sumDays((total[a] || {})[metric], from, to), 0); },
    // A breakdown over the last n days: [[value, amount], ...] sorted largest first.
    breakdown(accts, dim, metric, n) {
      const from = addDays(through, -n + 1), out = {};
      for (const a of accts) for (const [val, map] of Object.entries((((dims[a] || {})[dim] || {})[metric]) || {})) out[val] = (out[val] || 0) + sumDays(map, from, through);
      return Object.entries(out).filter(x => x[1] > 0).sort((x, y) => y[1] - x[1]);
    },
    dayLabels: n => days(n).map(fmtDay),
    accountsFor: idxFor,
  };
}

// "+12%" / "−8%" / "0%" change from previous to current.
export const pct = (cur, prev) => { if (!prev) return cur ? '+100%' : '0%'; const p = Math.round(((cur - prev) / prev) * 100); return (p > 0 ? '+' : p < 0 ? '−' : '') + Math.abs(p) + '%'; };
export const fmtNum = v => (v >= 10000 ? (v / 1000).toFixed(v >= 100000 ? 0 : 1) + 'k' : Math.round(v).toLocaleString());
