'use server';

import { and, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { auth } from '@/features/auth/server/auth';
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
};

type TPasswordChangeData = {
	currentPassword: string;
	newPassword: string;
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

export async function changeUserPassword(
	_userId: string,
	_currentPassword: string,
	_newPassword: string
) {
	try {
		// TODO: Implement password change functionality
		// const result = await auth.api.changePassword({
		//   body: {
		//     currentPassword,
		//     newPassword,
		//   },
		//   headers: await headers(),
		// });

		return { success: true };
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Failed to change password';
		throw new Error(`Password change failed: ${errorMessage}`);
	}
}

export async function deleteUserAccount(userId: string) {
	const userResumes = await resumeFactory.listByUserId(userId);

	for (const resume of userResumes) {
		await resumeFactory.destroy(resume.id);
	}

	try {
		// TODO: Implement user deletion functionality
		// await auth.api.deleteUser({
		//   body: {},
		//   headers: await headers(),
		// });
		console.log('User account deletion not yet implemented');
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'Failed to delete user account';
		throw new Error(`Account deletion failed: ${errorMessage}`);
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

		const { user } = sessionResult;

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

		const { user, session } = sessionResult;

		return {
			name: user.name,
			email: user.email,
			lastLoginTime: session.createdAt,
			verificationStatus: user.emailVerified,
			image: user.image,
			createdAt: user.createdAt,
		};
	} catch (error) {
		console.error('Failed to fetch user profile overview data:', error);
		return null;
	}
}
