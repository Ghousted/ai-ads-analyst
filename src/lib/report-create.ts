import 'server-only';
import { db, schema } from '@/db';
import { aiErrorMessage, aiModel, recordAiUsage, takeAiQuota } from './ai';
import { buildFacts, writeReport } from './report-writer';
import { blankContent, layoutTemplate, TEMPLATES, type Content } from './report-blocks';

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const dayLabel = (d: string) => { const x = new Date(d + 'T00:00:00Z'); return MON[x.getUTCMonth()] + ' ' + x.getUTCDate(); };

type Agency = { id: string; name: string };
type Client = { id: string; name: string; tone: string };

// Writes one client's report from their latest numbers and saves it as a draft. With a template, Claude writes the
// words and the template places them with charts and tables; blank sets up an empty report (no AI).
// Used by the Reports page and by scheduled drafts (no createdBy, a scheduledFor).
export async function createReport(o: { agency: Agency; client: Client; days: number; template: string; title?: string; createdBy?: string | null; scheduledFor?: Date }) {
  const facts = await buildFacts(o.client.id, o.days);
  if (!facts) return { error: o.client.name + ' has no Google Analytics or Meta numbers yet. Link their property or ad account in Integrations first.' };
  const title = o.title || (o.days === 30 ? 'Monthly' : o.days === 14 ? 'Two-week' : 'Weekly') + ' report · ' + dayLabel(facts.start) + ' – ' + dayLabel(facts.end);
  const save = async (content: Content, model: string | null) => {
    const [r] = await db.insert(schema.reports).values({ agencyId: o.agency.id, clientId: o.client.id, title, periodStart: facts.start, periodEnd: facts.end, facts, content, model, createdBy: o.createdBy ?? null, scheduledFor: o.scheduledFor ?? null })
      .onConflictDoNothing().returning({ id: schema.reports.id });
    // A scheduled draft for the same send time already exists (two runs at once): nothing new.
    return r ? { ok: true as const, id: r.id, title } : { error: 'A report for this send is already written.' };
  };
  if (o.template === 'blank') return save(blankContent(o.client.name + ' report'), null);
  if (!(await takeAiQuota(o.agency.id, 'report'))) return { error: 'You’ve reached today’s limit for AI-written reports. It resets within 24 hours.' };
  try {
    const tpl = TEMPLATES.find(t => t.id === o.template) || TEMPLATES[0];
    const { content: written, usage } = await writeReport(facts, { client: o.client.name, agency: o.agency.name, tone: o.client.tone }, tpl.focus);
    await recordAiUsage(o.agency.id, 'report', usage);
    return await save(layoutTemplate(tpl.id, written, facts), aiModel());
  } catch (e) {
    console.error('[report]', e);
    return { error: e instanceof Error && !('status' in e) ? e.message : aiErrorMessage(e) };
  }
}
