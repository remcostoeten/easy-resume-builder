import { env } from '@/server/env';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src/server/db/migrations',
  schema: './src/server/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
});

