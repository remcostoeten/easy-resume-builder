'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { auth } from '@/features/auth/server/auth';
import { session, verification } from '@/features/auth/server/better-auth-schema';
import { account, user } from '@/features/auth/server/schemas';
import { createResumeFactory } from '@/features/resume/server/factories';
import { db } from '@/server/db';

type TUpdateProfileData = {
	name?: string;
	email?: string;
	image?: string;
	bio?: string;
	location?: string;
	website?: string;
	admin?: boolean;
};

type TOAuthProvider = 'google' | 'github';

type TOAuthAccount = {
	id: string;
	providerId: string;
	accountId: string;
	accessToken?: string | null;
	createdAt: Date;
	updatedAt: Date;
};

type TUserProfileOverviewData = {
	name: string;
	email: string;
	lastLoginTime: Date | null;
	verificationStatus: boolean;
	image?: string | null;
	createdAt: Date;
	admin: boolean;
};

const resumeFactory = createResumeFactory();

export async function updateUserProfile(userId: string, data: TUpdateProfileData) {
	const updateData = {
		...data,
		updatedAt: new Date(),
	};

	const [updatedUser] = await db
		.update(user)
		.set(updateData)
		.where(eq(user.id, userId))
		.returning();

	// Revalidate relevant pages to show updated profile data
	revalidatePath('/dashboard/profile');
	revalidatePath('/dashboard');
	revalidatePath('/', 'layout'); // Revalidate root layout for session data

	return updatedUser;
}

type TResult = { ok: boolean; message?: string };

export async function changeUserPassword(
	userId: string,
	currentPassword: string,
	newPassword: string
): Promise<TResult> {
	try {
		const sessionResult = await auth.api.getSession({
			headers: await headers(),
		});

		if (!sessionResult || sessionResult.user.id !== userId) {
			return { ok: false, message: 'Unauthorized' };
		}

		if (!newPassword || newPassword.length < 8) {
			return { ok: false, message: 'Password update failed' };
		}

		try {
			await auth.api.changePassword({
				body: {
					currentPassword,
					newPassword,
				},
				headers: await headers(),
			});
			return { ok: true };
		} catch (err) {
			const message = err instanceof Error ? err.message.toLowerCase() : '';
			if (message.includes('invalid') || message.includes('current password')) {
				return { ok: false, message: 'Invalid current password' };
			}
			return { ok: false, message: 'Password update failed' };
		}
	} catch {
		return { ok: false, message: 'Password update failed' };
	}
}

export async function deleteUserAccount(userId: string): Promise<TResult> {
	try {
		const sessionResult = await auth.api.getSession({
			headers: await headers(),
		});

		if (!sessionResult || sessionResult.user.id !== userId) {
			return { ok: false, message: 'Unauthorized' };
		}

		const userResumes = await resumeFactory.listByUserId(userId);
		for (const resume of userResumes) {
			await resumeFactory.destroy(resume.id);
		}

		let deletedViaAPI = false;
		try {
			await auth.api.deleteUser({
				body: {},
				headers: await headers(),
			});
			deletedViaAPI = true;
		} catch {
			deletedViaAPI = false;
		}

		if (!deletedViaAPI) {
			const [uRow] = await db
				.select({ email: user.email })
				.from(user)
				.where(eq(user.id, userId));

			await db.transaction(async (tx) => {
				if (uRow?.email) {
					await tx.delete(verification).where(eq(verification.identifier, uRow.email));
				}
				await tx.delete(session).where(eq(session.userId, userId));
				await tx.delete(account).where(eq(account.userId, userId));
				await tx.delete(user).where(eq(user.id, userId));
			});
		}

		await auth.api.signOut({ headers: await headers() });
		return { ok: true };
	} catch {
		return { ok: false, message: 'Account deletion failed' };
	}
}

export async function listOAuthAccounts(userId: string): Promise<TOAuthAccount[]> {
	const accounts = await db
		.select({
			id: account.id,
			providerId: account.providerId,
			accountId: account.accountId,
			accessToken: account.accessToken,
			createdAt: account.createdAt,
			updatedAt: account.updatedAt,
		})
		.from(account)
		.where(eq(account.userId, userId));

	return accounts;
}

export async function linkOAuthAccount(_provider: TOAuthProvider) {
	try {
		const sessionResult = await auth.api.getSession({
			headers: await headers(),
		});

		if (!sessionResult) {
			throw new Error('No active session found');
		}

		// TODO: Implement OAuth linking functionality
		// const result = await auth.api.linkSocial({
		//   body: {
		//     provider,
		//     userId: user.id,
		//   },
		//   headers: await headers(),
		// });
		const result = { success: true };

		return result;
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'Failed to link OAuth account';
		throw new Error(`OAuth linking failed: ${errorMessage}`);
	}
}

export async function unlinkOAuthAccount(provider: TOAuthProvider) {
	try {
		const sessionResult = await auth.api.getSession({
			headers: await headers(),
		});

		if (!sessionResult) {
			throw new Error('No active session found');
		}

		const { user } = sessionResult;

		await db
			.delete(account)
			.where(and(eq(account.userId, user.id), eq(account.providerId, provider)));

		return { success: true };
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'Failed to unlink OAuth account';
		throw new Error(`OAuth unlinking failed: ${errorMessage}`);
	}
}

export async function getUserProfileOverview(): Promise<TUserProfileOverviewData | null> {
	try {
		const sessionResult = await auth.api.getSession({
			headers: await headers(),
		});

		if (!sessionResult) {
			return null;
		}

		const { user: sessionUser, session } = sessionResult;

		// Fetch admin field from database since better-auth session may not include it
		const userFromDb = await db
			.select({ admin: user.admin })
			.from(user)
			.where(eq(user.id, sessionUser.id))
			.limit(1);

	return {
		name: sessionUser.name,
		email: sessionUser.email,
		lastLoginTime: session.createdAt,
		verificationStatus: sessionUser.emailVerified,
		image: sessionUser.image,
		createdAt: sessionUser.createdAt,
		admin: userFromDb[0]?.admin ?? false,
	};
	} catch (error) {
		console.error('Failed to fetch user profile overview data:', error);
		return null;
	}
}
