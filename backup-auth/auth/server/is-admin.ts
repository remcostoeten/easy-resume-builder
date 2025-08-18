import { eq } from 'drizzle-orm';
import { db } from '@/server/db';
import { session, user } from './better-auth-schema';

export async function isAdmin(token: string | undefined): Promise<boolean> {
	if (!token) {
		return false;
	}

	try {
		const sessionResult = await db
			.select({ userId: session.userId })
			.from(session)
			.where(eq(session.token, token))
			.limit(1);

		if (!sessionResult.length) {
			return false;
		}

		const userId = sessionResult[0].userId;

		const userResult = await db
			.select({ admin: user.admin })
			.from(user)
			.where(eq(user.id, userId))
			.limit(1);

		return userResult[0]?.admin ?? false;
	} catch {
		return false;
	}
}
