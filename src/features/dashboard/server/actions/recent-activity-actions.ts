'use server';

import { desc, eq, sql } from 'drizzle-orm';
import { headers } from 'next/headers';
import { auth } from '@/features/auth/server/auth';
import { session } from '@/features/auth/server/schemas';
import { resumeTable } from '@/features/resume/server/schemas';
import { db } from '@/server/db';

type TActivityType = 'resume_edit' | 'sign_in';

type TRecentActivity = {
	id: string;
	type: TActivityType;
	title: string;
	description: string;
	timestamp: Date;
};

export async function getRecentActivity(): Promise<TRecentActivity[]> {
	const sessionData = await auth.api.getSession({
		headers: await headers(),
	});

	if (!sessionData?.user?.id) {
		throw new Error('Unauthorized');
	}

	const userId = sessionData.user.id;

	const resumeActivities = await db
		.select({
			id: sql<string>`CAST(${resumeTable.id} AS TEXT)`,
			type: sql<TActivityType>`'resume_edit'`,
			title: resumeTable.title,
			description: sql<string>`'Updated resume'`,
			timestamp: resumeTable.lastModified,
		})
		.from(resumeTable)
		.where(eq(resumeTable.userId, userId))
		.orderBy(desc(resumeTable.lastModified))
		.limit(10);

	const signInActivities = await db
		.select({
			id: session.id,
			type: sql<TActivityType>`'sign_in'`,
			title: sql<string>`'Signed in'`,
			description: sql<string>`'Account access'`,
			timestamp: session.createdAt,
		})
		.from(session)
		.where(eq(session.userId, userId))
		.orderBy(desc(session.createdAt))
		.limit(10);

	const allActivities: TRecentActivity[] = [
		...resumeActivities.map((activity) => ({
			id: activity.id,
			type: activity.type,
			title: activity.title,
			description: activity.description,
			timestamp: activity.timestamp as Date,
		})),
		...signInActivities.map((activity) => ({
			id: activity.id,
			type: activity.type,
			title: activity.title,
			description: activity.description,
			timestamp: activity.timestamp,
		})),
	];

	return allActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);
}
