import {
	foreignKey,
	pgTable,
	primaryKey,
	text,
	timestamp,
	unique,
	uuid,
} from 'drizzle-orm/pg-core';

export const verificationToken = pgTable('verification_token', {
	identifier: text().notNull(),
	token: text().notNull(),
	expiresAt: timestamp('expires_at', { mode: 'string' }).notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
});

export const user = pgTable(
	'user',
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		email: text().notNull(),
		passwordHash: text('password_hash'),
		name: text(),
		image: text(),
		createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
	},
	(table) => [unique('user_email_unique').on(table.email)]
);

export const session = pgTable(
	'session',
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		userId: uuid('user_id').notNull(),
		expiresAt: timestamp('expires_at', { mode: 'string' }).notNull(),
		createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: 'session_user_id_user_id_fk',
		}).onDelete('cascade'),
	]
);

export const account = pgTable(
	'account',
	{
		provider: text().notNull(),
		providerAccountId: text('provider_account_id').notNull(),
		userId: uuid('user_id').notNull(),
		type: text().notNull(),
		refreshToken: text('refresh_token'),
		accessToken: text('access_token'),
		expiresAt: timestamp('expires_at', { mode: 'string' }),
		idToken: text('id_token'),
		createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: 'account_user_id_user_id_fk',
		}).onDelete('cascade'),
		primaryKey({
			columns: [table.provider, table.providerAccountId],
			name: 'account_provider_provider_account_id_pk',
		}),
	]
);
