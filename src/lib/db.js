import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL is not set');
}

/**
 * //### Database Singleton
 * Prevents multiple connections from being created during Next.js Hot Module Replacement (HMR).
 */
const connectionString = process.env.POSTGRES_URL;

const globalForDb = globalThis;

if (!globalForDb.neonSql) {
  globalForDb.neonSql = neon(connectionString);
}

export const db = globalForDb.db || drizzle(globalForDb.neonSql);

if (process.env.NODE_ENV !== 'production') {
  globalForDb.db = db;
}
