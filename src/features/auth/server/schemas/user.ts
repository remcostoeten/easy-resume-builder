import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified')
		.$defaultFn(() => false)
		.notNull(),
	image: text('image'),
	bio: text('bio'),
	location: text('location'),
	website: text('website'),
	createdAt: timestamp('created_at', { mode: 'date' })
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: timestamp('updated_at', { mode: 'date' })
		.$defaultFn(() => new Date())
		.notNull(),
	admin: boolean('admin')
		.$defaultFn(() => false)
		.notNull(),
});

export type TUser = typeof user.$inferSelect;
export type TUserInsert = typeof user.$inferInsert;
