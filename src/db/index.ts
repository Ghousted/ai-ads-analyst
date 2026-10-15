import 'server-only';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

type DB = NodePgDatabase<typeof schema>;
const globalForDb = globalThis as unknown as { analystDb?: DB };

// Connect on first use, so `next build` needs no database. One pool per server instance.
function connect(): DB {
  if (globalForDb.analystDb) return globalForDb.analystDb;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  const pool = new Pool({ connectionString: url.replace(/sslmode=(require|prefer|verify-ca)\b/, 'sslmode=verify-full'), max: 5 });
  return (globalForDb.analystDb = drizzle(pool, { schema }));
}

export const db = new Proxy({} as DB, {
  get(_t, prop) {
    const real = connect();
    const v = Reflect.get(real, prop, real);
    return typeof v === 'function' ? v.bind(real) : v;
  },
});
export { schema };
