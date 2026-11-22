import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.');
}

/** Tagged-template SQL client. Values interpolated into it are always parameterised. */
export const sql = neon(process.env.DATABASE_URL);
