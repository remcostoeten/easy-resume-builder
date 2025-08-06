'use server';

import { count, desc, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { auth } from '@/features/auth/server/auth';
import { resumeTable } from '@/features/resume/server/schemas';
import { db } from '@/server/db';
import type { TQuickStats } from '../types';

export async function getQuickStats(): Promise<TQuickStats> {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		throw new Error('Unauthorized');
	}

	const userId = session.user.id;

	const totalResumesResult = await db
		.select({ count: count() })
		.from(resumeTable)
		.where(eq(resumeTable.userId, userId));

	const totalResumes = totalResumesResult[0]?.count || 0;

	const lastEditedResume = await db
		.select({ lastModified: resumeTable.lastModified })
		.from(resumeTable)
		.where(eq(resumeTable.userId, userId))
		.orderBy(desc(resumeTable.lastModified))
		.limit(1);

	const lastEditedDate = lastEditedResume[0]?.lastModified || null;

	const profileCompletionPercentage = await calculateProfileCompletion(userId);

	return {
		totalResumes,
		lastEditedDate,
		profileCompletionPercentage,
	};
}

async function calculateProfileCompletion(userId: string): Promise<number> {
	const userResumes = await db
		.select({
			personalInfo: resumeTable.personalInfo,
			workExperience: resumeTable.workExperience,
			education: resumeTable.education,
			skills: resumeTable.skills,
		})
		.from(resumeTable)
		.where(eq(resumeTable.userId, userId));

	if (userResumes.length === 0) {
		return 0;
	}

	const resume = userResumes[0];
	let completedSections = 0;
	const totalSections = 4;

	if (resume.personalInfo && Object.keys(resume.personalInfo as object).length > 0) {
		completedSections++;
	}

	if (
		resume.workExperience &&
		Array.isArray(resume.workExperience) &&
		resume.workExperience.length > 0
	) {
		completedSections++;
	}

	if (resume.education && Array.isArray(resume.education) && resume.education.length > 0) {
		completedSections++;
	}

	if (resume.skills && Array.isArray(resume.skills) && resume.skills.length > 0) {
		completedSections++;
	}

	return (completedSections / totalSections);
}
