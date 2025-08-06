import { sql } from 'drizzle-orm';
import {
	boolean,
	foreignKey,
	jsonb,
	pgTable,
	serial,
	text,
	timestamp,
	unique,
} from 'drizzle-orm/pg-core';

export const resume = pgTable('resume', {
	id: serial().primaryKey().notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string' }),
	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp('deleted_at', { mode: 'string' }),
	userId: text('user_id').notNull(),
	title: text().notNull(),
	template: text().default('professional').notNull(),
	personalInfo: jsonb('personal_info'),
	workExperience: jsonb('work_experience'),
	education: jsonb(),
	skills: jsonb(),
	sections: jsonb(),
	isActive: boolean('is_active').default(true),
	lastModified: timestamp('last_modified', { mode: 'string' }).defaultNow().notNull(),
});

export const verification = pgTable('verification', {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp('expires_at', { mode: 'string' }).notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }),
	updatedAt: timestamp('updated_at', { mode: 'string' }),
});

export const user = pgTable(
	'user',
	{
		id: text().primaryKey().notNull(),
		name: text().notNull(),
		email: text().notNull(),
		emailVerified: boolean('email_verified').notNull(),
		image: text(),
		createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
		updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
	},
	(table) => [unique('user_email_unique').on(table.email)]
);

export const account = pgTable(
	'account',
	{
		id: text().primaryKey().notNull(),
		accountId: text('account_id').notNull(),
		providerId: text('provider_id').notNull(),
		userId: text('user_id').notNull(),
		accessToken: text('access_token'),
		refreshToken: text('refresh_token'),
		idToken: text('id_token'),
		accessTokenExpiresAt: timestamp('access_token_expires_at', { mode: 'string' }),
		refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { mode: 'string' }),
		scope: text(),
		password: text(),
		createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
		updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: 'account_user_id_user_id_fk',
		}).onDelete('cascade'),
	]
);

export const session = pgTable(
	'session',
	{
		id: text().primaryKey().notNull(),
		expiresAt: timestamp('expires_at', { mode: 'string' }).notNull(),
		token: text().notNull(),
		createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
		updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
		ipAddress: text('ip_address'),
		userAgent: text('user_agent'),
		userId: text('user_id').notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: 'session_user_id_user_id_fk',
		}).onDelete('cascade'),
		unique('session_token_unique').on(table.token),
	]
);
