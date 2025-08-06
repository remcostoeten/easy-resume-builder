import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: text('email').unique().notNull(),
	passwordHash: text('password_hash'),
	name: text('name'),
	image: text('image'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type TUser = typeof user.$inferSelect;
export type TUserInsert = typeof user.$inferInsert;
