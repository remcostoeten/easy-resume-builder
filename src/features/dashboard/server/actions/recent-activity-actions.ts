'use server';

import { desc, eq, sql } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { headers } from 'next/headers';
import { auth } from '@/features/auth/server/auth';
import { session } from '@/features/auth/server/schemas';
import { resumeTable } from '@/features/resume/server/schemas';
import { db } from '@/server/db';

type TActivityType = 'resume_edit' | 'sign_in' | 'resume_create';

type TRecentActivity = {
	id: string;
	type: TActivityType;
	title: string;
	description: string;
	timestamp: Date;
	icon?: string;
};

// Cache recent activity for 1 minute since it changes frequently
const getCachedRecentActivity = unstable_cache(
	async (userId: string): Promise<TRecentActivity[]> => {
		// Get resume activities
		const resumeActivities = await db
			.select({
				id: sql<string>`CAST(${resumeTable.id} AS TEXT)`,
				type: sql<TActivityType>`CASE 
					WHEN ${resumeTable.created_at} = ${resumeTable.lastModified} THEN 'resume_create'
					ELSE 'resume_edit'
				END`,
				title: resumeTable.title,
				description: sql<string>`CASE 
					WHEN ${resumeTable.created_at} = ${resumeTable.lastModified} THEN 'Created new resume'
					ELSE 'Updated resume'
				END`,
				timestamp: resumeTable.lastModified,
				icon: sql<string>`'📄'`,
			})
			.from(resumeTable)
			.where(eq(resumeTable.userId, userId))
			.orderBy(desc(resumeTable.lastModified))
			.limit(5);

		// Get sign-in activities
		const signInActivities = await db
			.select({
				id: session.id,
				type: sql<TActivityType>`'sign_in'`,
				title: sql<string>`'Signed in'`,
				description: sql<string>`'Account access'`,
				timestamp: session.createdAt,
				icon: sql<string>`'🔐'`,
			})
			.from(session)
			.where(eq(session.userId, userId))
			.orderBy(desc(session.createdAt))
			.limit(5);

		// Combine and sort activities in JavaScript
		const allActivities: TRecentActivity[] = [
			...resumeActivities.map((activity) => ({
				id: activity.id,
				type: activity.type,
				title: activity.title,
				description: activity.description,
				timestamp: activity.timestamp as Date,
				icon: activity.icon,
			})),
			...signInActivities.map((activity) => ({
				id: activity.id,
				type: activity.type,
				title: activity.title,
				description: activity.description,
				timestamp: activity.timestamp,
				icon: activity.icon,
			})),
		];

		// Sort by timestamp and limit to 10
		return allActivities
			.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
			.slice(0, 10);
	},
	['recent-activity'],
	{
		revalidate: 60, // 1 minute
		tags: ['activity', 'dashboard'],
	}
);

export async function getRecentActivity(): Promise<TRecentActivity[]> {
	const sessionData = await auth.api.getSession({
		headers: await headers(),
	});

	if (!sessionData?.user?.id) {
		throw new Error('Unauthorized');
	}

	return getCachedRecentActivity(sessionData.user.id);
}
