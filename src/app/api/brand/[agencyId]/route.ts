import { eq } from 'drizzle-orm';
import { db, schema } from '@/db';

// An agency's logo as an image, for emails (email apps don't show logos stored as data URLs).
export async function GET(_req: Request, { params }: { params: Promise<{ agencyId: string }> }) {
  const { agencyId } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(agencyId)) return new Response(null, { status: 404 });
  const [a] = await db.select({ logo: schema.agencies.brandLogo }).from(schema.agencies).where(eq(schema.agencies.id, agencyId));
  const m = a?.logo?.match(/^data:(image\/(?:png|jpeg|gif|webp|svg\+xml));base64,(.+)$/);
  if (!m) return new Response(null, { status: 404 });
  // Logos can be SVG, which can carry script. Served from the app's own origin, it must never run: no sources allowed,
  // sandboxed, and the browser must not guess another type.
  return new Response(Buffer.from(m[2], 'base64'), { headers: { 'Content-Type': m[1], 'Cache-Control': 'public, max-age=3600',
    'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox", 'X-Content-Type-Options': 'nosniff', 'Content-Disposition': 'inline' } });
}
