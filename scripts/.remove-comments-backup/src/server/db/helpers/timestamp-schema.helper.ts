import { timestamp } from 'drizzle-orm/pg-core';

/**
 * Defines timestamp fields for database schemas, including creation, update, and deletion timestamps.
 */
export const timestamps = {
	updated_at: timestamp(),
	created_at: timestamp().defaultNow().notNull(),
	deleted_at: timestamp(),
};
