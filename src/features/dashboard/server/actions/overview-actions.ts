import { db } from '@/server/db';
import { user } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { resumeTable } from '@/features/resume/server/schemas/resume-schema';

export async function getDashboardOverview(userId: string) {
    const userData = await db.query.user.findFirst({
        where: eq(user.id, userId),
    });

    const totalResumes = await db.select().from(resumeTable).where(eq(resumeTable.userId, userId));

    return {
        totalResumes: totalResumes.length,
        activeApplications: 8,
        interviewsScheduled: 0,
        
        lastLogin: new Date(),
        memberSince: userData?.createdAt ?? new Date(),
    };
}
