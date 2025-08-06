import { boolean, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { entityBase } from '@/server/db/helpers/entity-schema.helper';

export const resumeTable = pgTable('resume', {
	...entityBase,
	userId: text('user_id').notNull(),
	title: text('title').notNull(),
	template: text('template').notNull().default('professional'),
	personalInfo: jsonb('personal_info'),
	workExperience: jsonb('work_experience'),
	education: jsonb('education'),
	skills: jsonb('skills'),
	sections: jsonb('sections'),
	isActive: boolean('is_active').default(true),
	lastModified: timestamp('last_modified').defaultNow().notNull(),
});

export type TResumeTable = typeof resumeTable;
export type TResume = typeof resumeTable.$inferSelect;
export type TCreateResume = typeof resumeTable.$inferInsert;
