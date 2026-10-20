import 'server-only';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { db, schema } from '@/db';
import { emailConfigured, sendEmail } from './email';
import { loadMetrics } from './metrics';
import { noticeEmail, type NoticeItem } from './notice-email';
import { kindOf, prefsFor, type Prefs } from './prefs';
import { scoreClients, type Risk } from './risk';
import { money } from './money';

// Email alerts and the Monday summary, run every hour after the sync. An alert goes out once, to each teammate who
// chose that kind by email, and again only after its cause has cleared and come back. Alerts wait for daytime
// (7am–8pm in the agency's time zone); the summary goes out on Monday morning.
const appUrl = () => (process.env.APP_URL || '').replace(/\/$/, '');
const pct = (a: number, b: number) => { if (!b) return a ? '+100%' : '0%'; const p = Math.round((a - b) / b * 100); return (p > 0 ? '+' : p < 0 ? '−' : '') + Math.abs(p) + '%'; };
const LEVEL: Record<string, [string, string]> = { h: ['Healthy', '#1d6b3a'], n: ['Needs attention', '#7a5a00'], r: ['At risk', '#a3330c'] };

type Person = { id: string; email: string; name: string; role: string; prefs: Prefs };

export async function teamOf(agencyId: string): Promise<Person[]> {
  const rows = await db.select({ id: schema.users.id, email: schema.users.email, name: schema.users.name, role: schema.agencyMembers.role, prefs: schema.notificationPrefs.prefs })
    .from(schema.agencyMembers).innerJoin(schema.users, eq(schema.users.id, schema.agencyMembers.userId))
    .leftJoin(schema.notificationPrefs, and(eq(schema.notificationPrefs.userId, schema.users.id), eq(schema.notificationPrefs.agencyId, agencyId)))
    .where(eq(schema.agencyMembers.agencyId, agencyId));
  return rows.map(r => ({ ...r, prefs: prefsFor(r.prefs, r.role) }));
}

// Who hears about reports ready to review (scheduler.ts).
export const draftRecipients = async (agencyId: string) => (await teamOf(agencyId)).filter(p => p.prefs.n4);

function localNow(tz: string, now: Date) {
  const o: Record<string, string> = {};
  for (const p of new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', weekday: 'short' }).formatToParts(now)) o[p.type] = p.value;
  return { hour: +o.hour, dow: o.weekday, date: o.year + '-' + o.month + '-' + o.day };
}

// Everything that is wrong right now, as alert keys with what to say.
type Alert = { key: string; kind: string; item: NoticeItem };
function activeAlerts(scored: Record<string, Risk>, clients: { id: string; name: string }[], conns: { id: string; login: string; provider: string; status: string; error: string | null }[]): Alert[] {
  const out: Alert[] = [];
  for (const c of clients) {
    const r = scored[c.id];
    if (!r) continue;
    for (const s of r.signals) {
      const kind = kindOf(s.key);
      if (kind) out.push({ key: 'sig:' + c.id + ':' + s.key, kind, item: { title: c.name + ': ' + s.label.toLowerCase(), detail: s.say, note: 'What to do: ' + s.act, noteColor: '#45505f' } });
    }
    if (r.level === 'r') out.push({ key: 'risk:' + c.id, kind: 'a4', item: { title: c.name + ' is at risk', detail: r.signals.map(s => s.say).join(' '), note: r.signals[0] ? 'What to do: ' + r.signals[0].act : '', noteColor: '#a3330c' } });
  }
  for (const c of conns) if (c.status === 'error')
    out.push({ key: 'conn:' + c.id, kind: 'a3', item: { title: (c.provider === 'meta' ? 'Meta' : 'Google Analytics') + ' stopped working for ' + c.login, detail: c.error || 'This login stopped working.', note: 'What to do: reconnect it in Settings › Integrations. Until then, numbers from its accounts stop updating.', noteColor: '#45505f' } });
  return out;
}

export async function runAlerts(deadline: number, now = new Date()) {
  const agencies = await db.select().from(schema.agencies).where(eq(schema.agencies.sampleMode, false));
  const sent = { alerts: 0, summaries: 0 };
  for (const agency of agencies) {
    if (Date.now() > deadline) break;
    const local = localNow(agency.timeZone, now);
    const [clients, metrics, reports, goals, conns, logged] = await Promise.all([
      db.select().from(schema.clients).where(eq(schema.clients.agencyId, agency.id)),
      loadMetrics(agency.id),
      db.select().from(schema.reports).where(eq(schema.reports.agencyId, agency.id)).orderBy(desc(schema.reports.createdAt)).limit(200),
      db.select().from(schema.clientGoals).where(eq(schema.clientGoals.agencyId, agency.id)),
      db.select().from(schema.connections).where(eq(schema.connections.agencyId, agency.id)),
      db.select().from(schema.alertLog).where(eq(schema.alertLog.agencyId, agency.id)),
    ]);
    if (!clients.length) continue;
    const scored = scoreClients(metrics, clients, reports, goals, now.toISOString().slice(0, 10));
    const active = activeAlerts(scored, clients, conns), have = new Set(logged.map(l => l.key));
    // Causes that cleared: forget them, so they alert again if they come back.
    const cleared = logged.filter(l => /^(sig|risk|conn):/.test(l.key) && !active.some(a => a.key === l.key)).map(l => l.key);
    if (cleared.length) await db.delete(schema.alertLog).where(and(eq(schema.alertLog.agencyId, agency.id), inArray(schema.alertLog.key, cleared)));
    const fresh = active.filter(a => !have.has(a.key));
    const team = await teamOf(agency.id);

    if (fresh.length && local.hour >= 7 && local.hour < 20) {
      if (emailConfigured()) for (const p of team) {
        if (!p.prefs.n1) continue;
        const mine = fresh.filter(a => p.prefs[a.kind]);
        if (!mine.length) continue;
        const { html, text } = noticeEmail({ agency: agency.name, heading: mine.length === 1 ? mine[0].item.title : mine.length + ' things need your attention',
          intro: 'Analyst noticed ' + (mine.length === 1 ? 'this' : 'these') + ' in the latest numbers.', items: mine.map(a => a.item),
          button: { label: 'Open AI Ads Analyst', url: appUrl() + '/app' }, footer: 'You get these alerts because of your notification settings in AI Ads Analyst. Change them in Settings › Notifications.' });
        try { await sendEmail({ fromName: 'AI Ads Analyst', to: [p.email], subject: mine.length === 1 ? mine[0].item.title : mine.length + ' client alerts from AI Ads Analyst', html, text, tag: 'alert' }); sent.alerts++; }
        catch (e) { console.error('[alert email]', e); }
      }
      // Logged even when nobody wanted it, so turning an alert on later doesn't send old news.
      await db.insert(schema.alertLog).values(fresh.map(a => ({ agencyId: agency.id, key: a.key }))).onConflictDoNothing();
    }

    // Monday morning: every client's week.
    const wkey = 'weekly:' + local.date;
    if (local.dow === 'Mon' && local.hour >= 8 && local.hour < 12 && !have.has(wkey)) {
      const [claimed] = await db.insert(schema.alertLog).values({ agencyId: agency.id, key: wkey }).onConflictDoNothing().returning();
      if (!claimed) continue;
      const lastWeek = reports.filter(r => r.status === 'sent' && r.sentAt && now.getTime() - r.sentAt.getTime() < 7 * 864e5);
      const items = clients.map(c => summaryItem(c, scored[c.id], lastWeek.filter(r => r.clientId === c.id).length));
      const flagged = clients.filter(c => scored[c.id] && scored[c.id].level !== 'h').length;
      if (emailConfigured()) for (const p of team.filter(p => p.prefs.n2)) {
        const { html, text } = noticeEmail({ agency: agency.name, heading: 'Your week: ' + clients.length + (clients.length === 1 ? ' client' : ' clients'),
          intro: (flagged ? flagged + (flagged === 1 ? ' client needs' : ' clients need') + ' attention. ' : 'Every client is healthy. ') + lastWeek.length + (lastWeek.length === 1 ? ' report was' : ' reports were') + ' sent last week.',
          items, button: { label: 'Open the dashboard', url: appUrl() + '/app' }, footer: 'The Monday summary from AI Ads Analyst. Turn it off in Settings › Notifications.' });
        try { await sendEmail({ fromName: 'AI Ads Analyst', to: [p.email], subject: 'Your week at ' + agency.name, html, text, tag: 'weekly' }); sent.summaries++; }
        catch (e) { console.error('[weekly email]', e); }
      }
    }
  }
  return sent;
}

function summaryItem(c: { name: string }, r: Risk | undefined, reportsSent: number): NoticeItem {
  if (!r || !r.through) return { title: c.name, detail: 'No numbers yet. Link their Google Analytics property or Meta ad account.', note: 'No data', noteColor: '#5a6474' };
  const w = r.weeks, now = w.at(-1), before = w.at(-2);
  const bits = [now ? now.leads + (now.leads === 1 ? ' lead' : ' leads') + (before ? ' (' + pct(now.leads, before.leads) + ' vs the week before)' : '') : null,
    now && now.metaLeads > 0 ? money(now.spend / now.metaLeads, r.currency, true) + ' per Meta lead' : null,
    now && now.spend ? money(now.spend, r.currency) + ' Meta spend' : null,
    reportsSent ? reportsSent + (reportsSent === 1 ? ' report sent' : ' reports sent') : 'No report sent'].filter(Boolean);
  const [label, color] = LEVEL[r.level];
  return { title: c.name, detail: bits.join(' · '), note: label + (r.signals[0] ? ': ' + r.signals[0].label.toLowerCase() : ''), noteColor: color };
}
