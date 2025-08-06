import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const verificationToken = pgTable('verification_token', {
	identifier: text('identifier').notNull(),
	token: text('token').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type TVerificationToken = typeof verificationToken.$inferSelect;
export type TVerificationTokenInsert = typeof verificationToken.$inferInsert;
