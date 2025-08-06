import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').$defaultFn(() => false).notNull(),
	image: text('image'),
	createdAt: timestamp('created_at', { mode: 'date' }).$defaultFn(() => new Date()).notNull(),
	updatedAt: timestamp('updated_at', { mode: 'date' }).$defaultFn(() => new Date()).notNull(),
});

export type TUser = typeof user.$inferSelect;
export type TUserInsert = typeof user.$inferInsert;
