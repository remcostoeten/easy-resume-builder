import { count, desc, eq } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { session } from '@/features/auth/server/schemas';
import { resumeTable } from '@/features/resume/server/schemas/resume-schema';
import { db } from '@/server/db';
import { user } from '@/server/db/schema';

type DashboardOverview = {
	totalResumes: number;
	activeApplications: number;
	interviewsScheduled: number;
	lastLogin: Date | null;
	memberSince: Date;
	lastResumeUpdate: Date | null;
};

// Cache for 5 minutes with user-specific tags
const getCachedDashboardOverview = unstable_cache(
	async (userId: string): Promise<DashboardOverview> => {
		// Single query to get user data and resume count efficiently
		const [userResult, resumeCountResult, lastResumeUpdate, lastSession] = await Promise.all([
			db.query.user.findFirst({
				where: eq(user.id, userId),
				columns: { createdAt: true },
			}),
			db.select({ count: count() }).from(resumeTable).where(eq(resumeTable.userId, userId)),
			db
				.select({ lastModified: resumeTable.lastModified })
				.from(resumeTable)
				.where(eq(resumeTable.userId, userId))
				.orderBy(desc(resumeTable.lastModified))
				.limit(1),
			db
				.select({ createdAt: session.createdAt })
				.from(session)
				.where(eq(session.userId, userId))
				.orderBy(desc(session.createdAt))
				.limit(1),
		]);

		return {
			totalResumes: resumeCountResult[0]?.count ?? 0,
			activeApplications: 0, // TODO: Implement when applications table is ready
			interviewsScheduled: 0, // TODO: Implement when interviews table is ready
			lastLogin: lastSession[0]?.createdAt ?? null,
			memberSince: userResult?.createdAt ?? new Date(),
			lastResumeUpdate: lastResumeUpdate[0]?.lastModified ?? null,
		};
	},
	['dashboard-overview'],
	{
		revalidate: 300, // 5 minutes
		tags: ['dashboard', 'user-overview'],
	}
);

export async function getDashboardOverview(userId: string): Promise<DashboardOverview> {
	if (!userId || typeof userId !== 'string') {
		throw new Error('Invalid user ID');
	}

	return getCachedDashboardOverview(userId);
}
