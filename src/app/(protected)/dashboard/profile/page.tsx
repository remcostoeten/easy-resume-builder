import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/features/auth/server/auth';
import { account } from '@/features/auth/server/better-auth-schema';
import type { TAccount } from '@/features/auth/server/schemas/account';
import type { TSession } from '@/features/auth/types';
import { db } from '@/server/db';
import { ProfileTabs } from './profile-tabs';

type TUserProfileData = {
	user: TSession['user'];
	session: TSession['session'];
	oauthAccounts: TAccount[];
};

async function getUserProfileData(): Promise<TUserProfileData> {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect('/login');
	}

	const oauthAccounts = await db
		.select()
		.from(account)
		.where(eq(account.userId, session.user.id));

	return {
		user: session.user,
		session: session.session,
		oauthAccounts,
	};
}

export default async function ProfilePage() {
	const profileData = await getUserProfileData();

	return (
		<div className='max-w-4xl mx-auto p-6 space-y-6'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>Profile Settings</h1>
				<p className='text-muted-foreground'>
					Manage your account settings and preferences
				</p>
			</div>

			<ProfileTabs
				user={profileData.user}
				session={profileData.session}
				oauthAccounts={profileData.oauthAccounts}
			/>
		</div>
	);
}
