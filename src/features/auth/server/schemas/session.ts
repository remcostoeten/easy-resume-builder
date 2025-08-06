import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from './user';

export const session = pgTable('session', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type TSession = typeof session.$inferSelect;
export type TSessionInsert = typeof session.$inferInsert;
