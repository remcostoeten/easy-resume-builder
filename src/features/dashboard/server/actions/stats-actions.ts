'use server';

import { count, desc, eq, sql } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { headers } from 'next/headers';
import { auth } from '@/features/auth/server/auth';
import { resumeTable } from '@/features/resume/server/schemas';
import { db } from '@/server/db';
import type { TQuickStats } from '../types';

// Cache stats for 2 minutes since they're frequently accessed
const getCachedQuickStats = unstable_cache(
	async (userId: string): Promise<TQuickStats> => {
		// Combine queries to reduce database round trips
		const [statsResult] = await db
			.select({
				totalResumes: count(),
				lastModified: sql<Date | null>`MAX(${resumeTable.lastModified})`,
				completedResumes: sql<number>`COUNT(CASE 
					WHEN ${resumeTable.personalInfo} IS NOT NULL 
						AND ${resumeTable.workExperience} IS NOT NULL 
						AND ${resumeTable.education} IS NOT NULL 
						AND ${resumeTable.skills} IS NOT NULL 
					THEN 1 
					ELSE NULL 
				END)`,
			})
			.from(resumeTable)
			.where(eq(resumeTable.userId, userId));

		const totalResumes = statsResult?.totalResumes || 0;
		const profileCompletionPercentage =
			totalResumes > 0 ? (statsResult?.completedResumes || 0) / totalResumes : 0;

		return {
			totalResumes,
			lastEditedDate: statsResult?.lastModified || null,
			profileCompletionPercentage,
		};
	},
	['quick-stats'],
	{
		revalidate: 120, // 2 minutes
		tags: ['stats', 'dashboard'],
	}
);

export async function getQuickStats(): Promise<TQuickStats> {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		throw new Error('Unauthorized');
	}

	return getCachedQuickStats(session.user.id);
}
