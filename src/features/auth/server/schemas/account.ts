import { pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from './user';

export const account = pgTable(
	'account',
	{
		provider: text('provider').notNull(),
		providerAccountId: text('provider_account_id').notNull(),
		userId: uuid('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		type: text('type').notNull(),
		refreshToken: text('refresh_token'),
		accessToken: text('access_token'),
		expiresAt: timestamp('expires_at'),
		idToken: text('id_token'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.provider, table.providerAccountId] }),
	})
);

export type TAccount = typeof account.$inferSelect;
export type TAccountInsert = typeof account.$inferInsert;
