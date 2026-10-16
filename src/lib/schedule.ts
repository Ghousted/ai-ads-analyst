// Report schedules. A client's schedule is stored as text the profile builds from two choices, e.g. "Mondays, 8:00am",
// "First of the month, 8:00am" or "Not scheduled". Times are in the agency's time zone.

export const DAYS = ['Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays', 'Sundays', 'First of the month', 'Not scheduled'] as const;
export const TIMES = Array.from({ length: 13 }, (_, k) => { const h = k + 6; return (h > 12 ? h - 12 : h) + ':00' + (h >= 12 ? 'pm' : 'am'); });
export const TIME_ZONES = [
  ['America/New_York', 'Eastern time (New York)'], ['America/Chicago', 'Central time (Chicago)'], ['America/Denver', 'Mountain time (Denver)'],
  ['America/Los_Angeles', 'Pacific time (Los Angeles)'], ['Europe/London', 'London'], ['Europe/Paris', 'Central Europe (Paris, Berlin)'],
  ['Asia/Dubai', 'Dubai'], ['Asia/Singapore', 'Singapore'], ['Asia/Manila', 'Manila'], ['Australia/Sydney', 'Sydney'],
] as const;

export type Schedule = { kind: 'weekly'; dow: number; hour: number } | { kind: 'monthly'; hour: number };

// dow: 0 = Sunday … 6 = Saturday, as Date.getUTCDay() counts.
const DOW: Record<string, number> = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };

// Reads a schedule, including older free-text ones like "Every Monday" (8:00am when no time is given). null means the
// client's reports are sent by hand.
export function parseSchedule(s: string | null | undefined): Schedule | null {
  const t = (s || '').trim().toLowerCase();
  if (!t || t.startsWith('not')) return null;
  const tm = t.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/);
  let hour = 8;
  if (tm) { hour = Number(tm[1]) % 12 + (tm[3] === 'pm' ? 12 : 0); }
  if (/first|1st|month/.test(t)) return { kind: 'monthly', hour };
  const day = Object.keys(DOW).find(d => t.includes(d) || t.includes(d.slice(0, 3)));
  return day ? { kind: 'weekly', dow: DOW[day], hour } : null;
}

// The two choices the profile shows for a stored schedule.
export function scheduleParts(s: string | null | undefined): { day: string; time: string } {
  const p = parseSchedule(s);
  if (!p) return { day: 'Not scheduled', time: '8:00am' };
  const time = (p.hour % 12 || 12) + ':00' + (p.hour >= 12 ? 'pm' : 'am');
  return { day: p.kind === 'monthly' ? 'First of the month' : DAYS[(p.dow + 6) % 7], time };
}
export const joinSchedule = (day: string, time: string) => (day === 'Not scheduled' ? day : day + ', ' + time);

// The wall-clock parts of an instant in a time zone.
function partsIn(d: Date, tz: string) {
  const f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', weekday: 'short' });
  const o: Record<string, string> = {};
  for (const p of f.formatToParts(d)) o[p.type] = p.value;
  return { y: +o.year, m: +o.month, d: +o.day, h: +o.hour, min: +o.minute, dow: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday) };
}

// The instant a wall-clock time in a time zone happens. Corrects for the zone's offset on that day (summer time).
export function zonedTime(y: number, m: number, d: number, h: number, tz: string): Date {
  let t = Date.UTC(y, m - 1, d, h);
  for (let i = 0; i < 2; i++) { const p = partsIn(new Date(t), tz); t += Date.UTC(y, m - 1, d, h) - Date.UTC(p.y, p.m - 1, p.d, p.h, p.min); }
  return new Date(t);
}

// The next time a schedule fires at or after `from`.
export function nextSend(s: Schedule, tz: string, from = new Date()): Date {
  const p = partsIn(from, tz);
  for (let k = 0; k < 40; k++) {
    const day = new Date(Date.UTC(p.y, p.m - 1, p.d + k)), y = day.getUTCFullYear(), m = day.getUTCMonth() + 1, d = day.getUTCDate();
    if (s.kind === 'weekly' ? day.getUTCDay() !== s.dow : d !== 1) continue;
    const at = zonedTime(y, m, d, s.hour, tz);
    if (at >= from) return at;
  }
  throw new Error('No send time found');
}

// How many days a scheduled report covers.
export const periodDays = (s: Schedule) => (s.kind === 'monthly' ? 30 : 7);

// "Mon, Oct 19, 8:00am" in the agency's time zone.
export function sendLabel(at: Date | string, tz: string) {
  const d = typeof at === 'string' ? new Date(at) : at;
  return new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(d).replace(' AM', 'am').replace(' PM', 'pm');
}
