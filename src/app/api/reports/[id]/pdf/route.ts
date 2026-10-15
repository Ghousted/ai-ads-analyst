import { and, eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import { requireAgency } from '@/lib/auth';
import { reportLink } from '@/lib/report-link';
import { pdfName, reportPdf } from '@/lib/report-pdf';

export const maxDuration = 60;

// Download PDF in the report editor: the saved report, printed the way the client sees it.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { agency } = await requireAgency();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response('Unknown report.', { status: 404 });
  const [r] = await db.select({ report: schema.reports, client: schema.clients }).from(schema.reports)
    .innerJoin(schema.clients, eq(schema.clients.id, schema.reports.clientId))
    .where(and(eq(schema.reports.id, id), eq(schema.reports.agencyId, agency.id)));
  if (!r) return new Response('That report was deleted.', { status: 404 });
  try {
    // The PDF is printed from the report's private page, so the report needs its link first.
    const pdf = await reportPdf(await reportLink(id));
    return new Response(new Uint8Array(pdf), { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename*=UTF-8\'\'' + encodeURIComponent(pdfName(r.client.name, r.report.title)), 'Cache-Control': 'no-store' } });
  } catch (e) {
    console.error('[pdf]', e);
    return new Response(e instanceof Error ? e.message : 'The PDF couldn’t be made.', { status: 500 });
  }
}
