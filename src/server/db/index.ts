import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

export const sql = neon(
	'postgresql://neondb_owner:npg_gB0nmESK2AdF@ep-patient-field-a2huk0c6-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
);
export const db = drizzle(sql, {
	schema,
});
