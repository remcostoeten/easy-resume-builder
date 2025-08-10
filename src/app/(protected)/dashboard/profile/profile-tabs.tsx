'use client';

import * as Tabs from '@radix-ui/react-tabs';
import { lazy, Suspense } from 'react';
import type { TAccount } from '@/features/auth/server/schemas/account';
import type { TSession } from '@/features/auth/types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from '@/shared/utilities';
import { ChangePasswordForm } from '@/features/profile/components/change-password-form';

const ProfileOverview = lazy(() =>
	import('./tabs/profile-overview').then((module) => ({ default: module.ProfileOverview }))
);
const ProfileEditProfile = lazy(() =>
	import('./tabs/profile-edit-profile').then((module) => ({ default: module.ProfileEditProfile }))
);
const ProfileOAuth = lazy(() =>
	import('./tabs/profile-oauth').then((module) => ({ default: module.ProfileOAuth }))
);
const ProfileDangerZone = lazy(() =>
	import('./tabs/profile-danger-zone').then((module) => ({ default: module.ProfileDangerZone }))
);

type TProps = {
	user: TSession['user'];
	session: TSession['session'];
	oauthAccounts: TAccount[];
};

function TabSkeleton() {
	return (
		<div className='space-y-4'>
			<div className='animate-pulse'>
				<div className='h-4 bg-muted rounded w-1/4 mb-2'></div>
				<div className='h-3 bg-muted rounded w-1/2'></div>
			</div>
			<div className='space-y-3'>
				<div className='h-20 bg-muted rounded'></div>
				<div className='h-20 bg-muted rounded'></div>
			</div>
		</div>
	);
}

export function ProfileTabs({ user, session, oauthAccounts }: TProps) {
	return (
		<Tabs.Root defaultValue='overview' className='space-y-6'>
			<Tabs.List className='border-b border-border'>
				<div className='flex space-x-8'>
					<Tabs.Trigger
						value='overview'
						className={cn(
							'px-0 py-4 border-b-2 border-transparent text-sm font-medium transition-colors hover:text-foreground',
							'data-[state=active]:border-b-primary data-[state=active]:text-foreground',
							'text-muted-foreground hover:border-b-border'
						)}
					>
						Overview
					</Tabs.Trigger>
					<Tabs.Trigger
						value='edit-profile'
						className={cn(
							'px-0 py-4 border-b-2 border-transparent text-sm font-medium transition-colors hover:text-foreground',
							'data-[state=active]:border-b-primary data-[state=active]:text-foreground',
							'text-muted-foreground hover:border-b-border'
						)}
					>
						Edit Profile
					</Tabs.Trigger>
					<Tabs.Trigger
						value='change-password'
						className={cn(
							'px-0 py-4 border-b-2 border-transparent text-sm font-medium transition-colors hover:text-foreground',
							'data-[state=active]:border-b-primary data-[state=active]:text-foreground',
							'text-muted-foreground hover:border-b-border'
						)}
					>
						Change Password
					</Tabs.Trigger>
					<Tabs.Trigger
						value='oauth-accounts'
						className={cn(
							'px-0 py-4 border-b-2 border-transparent text-sm font-medium transition-colors hover:text-foreground',
							'data-[state=active]:border-b-primary data-[state=active]:text-foreground',
							'text-muted-foreground hover:border-b-border'
						)}
					>
						OAuth Accounts
					</Tabs.Trigger>
					<Tabs.Trigger
						value='danger-zone'
						className={cn(
							'px-0 py-4 border-b-2 border-transparent text-sm font-medium transition-colors hover:text-foreground',
							'data-[state=active]:border-b-primary data-[state=active]:text-foreground',
							'text-muted-foreground hover:border-b-border'
						)}
					>
						Danger Zone
					</Tabs.Trigger>
				</div>
			</Tabs.List>

			<Card>
				<CardContent className='p-6'>
					<Tabs.Content value='overview'>
						<Suspense fallback={<TabSkeleton />}>
							<ProfileOverview user={user} session={session} />
						</Suspense>
					</Tabs.Content>

					<Tabs.Content value='edit-profile'>
						<Suspense fallback={<TabSkeleton />}>
							<ProfileEditProfile user={user} />
						</Suspense>
					</Tabs.Content>

					<Tabs.Content value='change-password'>
						<Suspense fallback={<TabSkeleton />}> 
							<ChangePasswordForm userId={user.id} />
						</Suspense>
					</Tabs.Content>

					<Tabs.Content value='oauth-accounts'>
						<Suspense fallback={<TabSkeleton />}>
							<ProfileOAuth accounts={oauthAccounts} />
						</Suspense>
					</Tabs.Content>

					<Tabs.Content value='danger-zone'>
						<Suspense fallback={<TabSkeleton />}>
							<ProfileDangerZone user={user} />
						</Suspense>
					</Tabs.Content>
				</CardContent>
			</Card>
		</Tabs.Root>
	);
}
