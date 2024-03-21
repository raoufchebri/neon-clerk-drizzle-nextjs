import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Redefining generic fixes a type error. Fix coming soon:
// https://github.com/drizzle-team/drizzle-orm/issues/1945#event-12152755813
const sql = neon<boolean, boolean>(process.env.DATABASE_URL!);
export const db = drizzle(sql);
