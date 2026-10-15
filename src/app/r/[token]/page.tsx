import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { eq, sql } from 'drizzle-orm';
import { db, schema } from '@/db';
import { normalizeContent } from '@/lib/report-blocks';
import ReportReader from '@/screens/app/modules/livereports/ReportReader';

// A report as the client sees it, from the private link in the email. Each visit counts as a view, except the
// agency's own previews (?preview=1).
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const label = (d: string) => { const x = new Date(d + 'T00:00:00Z'); return MON[x.getUTCMonth()] + ' ' + x.getUTCDate() + ', ' + x.getUTCFullYear(); };

async function load(token: string) {
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(token)) return null;
  const [r] = await db.select({ report: schema.reports, client: schema.clients, agency: schema.agencies }).from(schema.reports)
    .innerJoin(schema.clients, eq(schema.clients.id, schema.reports.clientId))
    .innerJoin(schema.agencies, eq(schema.agencies.id, schema.reports.agencyId))
    .where(eq(schema.reports.shareToken, token));
  return r || null;
}

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const r = await load((await params).token);
  return { title: r ? r.report.title + ' · ' + r.agency.name : 'Report not found', robots: { index: false, follow: false } };
}

export default async function Page({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ preview?: string; print?: string }> }) {
  const [{ token }, q] = await Promise.all([params, searchParams]);
  const r = await load(token);
  if (!r) notFound();
  // Mail scanners and link previews open links too. They don't count as the client viewing the report.
  const ua = (await headers()).get('user-agent') || '';
  const bot = !ua || /bot|crawl|spider|preview|scan|fetch|curl|wget|python|java\/|go-http|okhttp|headless|lighthouse|facebookexternalhit|slack|whatsapp|telegram|discord|skype|googleimageproxy|proofpoint|mimecast|barracuda|safelinks|outlook-ios|ms office|microsoft office|bingpreview/i.test(ua);
  if (q.preview !== '1' && !bot) await db.update(schema.reports).set({ viewCount: sql`${schema.reports.viewCount} + 1`, firstViewedAt: sql`coalesce(${schema.reports.firstViewedAt}, now())`, lastViewedAt: new Date() }).where(eq(schema.reports.id, r.report.id));
  const print = q.print === '1', color = r.agency.brandColor || '#1f6be2', content = normalizeContent(r.report.content, r.report.facts as never);
  return (
    // print=1: the layout the PDF is made from, white and edge to edge (the PDF adds its own margins).
    <main style={{ minHeight: '100vh', background: print ? '#ffffff' : '#f4f7fb', padding: print ? '0' : '32px 16px 64px', fontFamily: "'DM Sans',ui-sans-serif,system-ui,sans-serif", letterSpacing: '-0.4px' }}>
      <article style={{ maxWidth: print ? 'none' : '860px', margin: '0 auto', background: '#ffffff', padding: print ? '0' : 'clamp(24px,5vw,48px)' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '28px', fontSize: '14px', color: '#5a6474' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {r.agency.brandLogo ? <img src={r.agency.brandLogo} alt={r.agency.name + ' logo'} style={{ height: '36px', maxWidth: '180px', objectFit: 'contain', display: 'block' }} /> : null}
            <strong style={{ color: '#0b1626' }}>{r.agency.name}</strong>
          </span>
          <span>{'Prepared for ' + r.client.name + ' · ' + label(r.report.periodStart) + ' – ' + label(r.report.periodEnd)}</span>
        </header>
        <ReportReader doc={content.doc} facts={r.report.facts} color={color} />
      </article>
      <p style={{ textAlign: 'center', fontSize: '13px', color: '#5a6474', marginTop: '16px' }}>{'Sent by ' + r.agency.name + ' with AI Ads Analyst'}</p>
    </main>
  );
}
