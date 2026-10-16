// Notification choices. a0–a4 are what to be told about, n0–n4 where and what else. Defaults apply until a person
// changes them; "reports to review" starts on for the owner and admins only.
export const ALERT_KINDS = [
  ['a0', 'A client gets 20% fewer leads than usual'],
  ['a1', 'Cost per lead goes over a goal'],
  ['a2', 'Spend is 15% ahead or behind budget'],
  ['a3', 'An account disconnects and data stops'],
  ['a4', 'Analyst flags a client as at risk'],
] as const;

export type Prefs = Record<string, boolean>;
export const prefsFor = (saved: Prefs | null | undefined, role: string): Prefs => ({
  a0: true, a1: true, a2: true, a3: true, a4: true, n0: true, n1: true, n2: true, n4: role !== 'member' && role !== 'Member', ...(saved || {}),
});

// Which choice a risk signal belongs to.
export function kindOf(signalKey: string): string | null {
  if (/^(leads-|goal-leads|goal-conv)/.test(signalKey)) return 'a0';
  if (/^(goal-cpl|cpl-up)/.test(signalKey)) return 'a1';
  if (/^budget-/.test(signalKey)) return 'a2';
  if (/^(sync-error|stale)$/.test(signalKey)) return 'a3';
  return null;
}
