import { RecentActivity, ResumeListServer } from '@/components/dashboard';
import { QuickStats } from '@/features/dashboard';
import { ProfileOverview } from '@/features/profile/components';
import { getUserProfileOverview } from '@/features/profile/server/actions/profile-actions';
import { AsyncSection } from '@/shared/components';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { OverviewServer } from '@/components/dashboard/overview-server';
import { OverviewSkeleton } from '@/components/dashboard/overview-skeleton';

function QuickStatsSkeleton() {
	return (
		<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
			{Array.from({ length: 3 }).map(function renderQuickStatSkeleton(_, i) {
				return (
					<Card key={i}>
						<CardHeader>
							<Skeleton className='h-4 w-24' />
						</CardHeader>
						<CardContent>
							<div className='space-y-3'>
								<Skeleton className='h-8 w-16' />
								<Skeleton className='h-3 w-full' />
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}

function ResumeListSkeleton() {
	return (
		<Card>
			<CardHeader>
				<div className='flex justify-between items-center'>
					<Skeleton className='h-6 w-32' />
					<Skeleton className='h-9 w-24' />
				</div>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{Array.from({ length: 3 }).map(function renderResumeListSkeleton(_, i) {
						return (
							<div key={i} className='border rounded p-4 space-y-3'>
								<div className='flex justify-between'>
									<Skeleton className='h-5 w-48' />
									<Skeleton className='h-4 w-20' />
								</div>
								<Skeleton className='h-4 w-full' />
								<Skeleton className='h-4 w-2/3' />
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}

function ProfileSkeleton() {
	return (
		<Card>
			<CardHeader>
				<Skeleton className='h-6 w-28' />
			</CardHeader>
			<CardContent>
				<div className='space-y-6'>
					<div className='flex items-center space-x-4'>
						<Skeleton className='h-12 w-12 rounded-full' />
						<div className='space-y-2'>
							<Skeleton className='h-4 w-32' />
							<Skeleton className='h-3 w-24' />
						</div>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						{Array.from({ length: 4 }).map(function renderProfileStatSkeleton(_, i) {
							return (
								<div key={i} className='text-center p-3 border rounded'>
									<Skeleton className='h-6 w-8 mx-auto mb-2' />
									<Skeleton className='h-3 w-16 mx-auto' />
								</div>
							);
						})}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function RecentActivitySkeleton() {
	return (
		<Card>
			<CardHeader>
				<Skeleton className='h-6 w-36' />
			</CardHeader>
			<CardContent>
				<div className='space-y-3'>
					{Array.from({ length: 5 }).map(function renderActivitySkeleton(_, i) {
						return (
							<div key={i} className='flex items-center justify-between py-2'>
								<div className='flex items-center space-x-3'>
									<Skeleton className='h-8 w-8 rounded' />
									<div className='space-y-1'>
										<Skeleton className='h-4 w-32' />
										<Skeleton className='h-3 w-24' />
									</div>
								</div>
								<Skeleton className='h-3 w-16' />
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}

export default async function DashboardPage() {
	const userId = 'temp-user-id';
	const profileData = await getUserProfileOverview();

	return (
		<div className='space-y-8'>
			<AsyncSection
				fallback={<OverviewSkeleton />}
				errorTitle='Overview Loading Error'
				errorDescription='Unable to load dashboard overview.'
			>
				<OverviewServer userId={userId} />
			</AsyncSection>

			<AsyncSection
				fallback={<QuickStatsSkeleton />}
				errorTitle='Stats Loading Error'
				errorDescription='Unable to load dashboard statistics.'
			>
				<QuickStats />
			</AsyncSection>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				<div className='lg:col-span-2'>
					<AsyncSection
						fallback={<ResumeListSkeleton />}
						errorTitle='Resume List Error'
						errorDescription='Unable to load your resume list.'
					>
						<ResumeListServer userId={userId} />
					</AsyncSection>
				</div>
				<div className='lg:col-span-1'>
					<AsyncSection
						fallback={<ProfileSkeleton />}
						errorTitle='Profile Overview Error'
						errorDescription='Unable to load profile information.'
					>
						<ProfileOverview userData={profileData} />
					</AsyncSection>
				</div>
			</div>

			<AsyncSection
				fallback={<RecentActivitySkeleton />}
				errorTitle='Activity Feed Error'
				errorDescription='Unable to load recent activity data.'
			>
				<RecentActivity />
			</AsyncSection>
		</div>
	);
}
