// Money in an account's own currency, for the server and the browser alike. Whole units by default, cents when asked
// (cost per lead). An unknown code falls back to dollars rather than failing the page.
const formats = new Map<string, Intl.NumberFormat>();
export function money(v: number, currency?: string | null, cents = false) {
  const key = (currency || 'USD') + (cents ? ':c' : '');
  let f = formats.get(key);
  if (!f) {
    const o = { style: 'currency', minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 } as const;
    try { f = new Intl.NumberFormat('en-US', { ...o, currency: currency || 'USD' }); } catch { f = new Intl.NumberFormat('en-US', { ...o, currency: 'USD' }); }
    formats.set(key, f);
  }
  return f.format(v);
}

// The symbol shown before an amount typed in that currency, e.g. "$" or "€". Codes with no symbol show the code.
export function symbolOf(currency?: string | null) {
  return money(0, currency).replace(/[\d.,\s]/g, '') || currency || '$';
}

// The currency to show for a set of accounts: the ad account's when there is one (it is what was spent), otherwise
// the first that has one. Clients rarely mix currencies; when they do, the ad account's wins.
export function currencyOf(accounts: { tool: string; currency?: string | null }[]) {
  return accounts.find(a => a.tool === 'meta' && a.currency)?.currency || accounts.find(a => a.currency)?.currency || 'USD';
}
