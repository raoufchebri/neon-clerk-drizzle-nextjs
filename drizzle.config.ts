import type { Config } from 'drizzle-kit';
import * as dotenv from "dotenv";

dotenv.config();

if (!('DATABASE_URL' in process.env)) throw new Error('DATABASE_URL not found in environment');

export default {
  schema: './src/app/db/schema.ts',
  out: './src/app/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  strict: true,
} satisfies Config;
