import { neonAuth } from '@/lib/neon-auth';

// Proxies session refresh, OAuth callbacks and sign-out to Neon Auth.
type Ctx = { params: Promise<{ path: string[] }> };
const h = (m: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE') => (req: Request, ctx: Ctx) => (neonAuth().handler() as Record<string, (r: Request, c: Ctx) => Promise<Response>>)[m](req, ctx);

export const GET = h('GET');
export const POST = h('POST');
export const PUT = h('PUT');
export const PATCH = h('PATCH');
export const DELETE = h('DELETE');
