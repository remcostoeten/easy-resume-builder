import { Suspense } from 'react';

// Force dynamic rendering - this page requires authentication
export const dynamic = 'force-dynamic';
import { RecentActivity, ResumeListServer } from '@/components/dashboard';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';
import { OverviewServer } from '@/components/dashboard/overview-server';
import { QuickStats } from '@/features/dashboard';
import { ProfileOverview } from '@/features/profile/components';
import { getUserProfileOverview } from '@/features/profile/server/actions/profile-actions';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

// Create smaller loading components for better streaming
function OverviewSkeleton() {
	return (
		<div className='space-y-6'>
			<div>
				<Skeleton className='h-6 w-24 mb-4' />
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4'>
					{Array.from({ length: 5 }).map((_, i) => (
						<Card key={i}>
							<CardContent className='pt-6'>
								<Skeleton className='h-4 w-16 mb-2' />
								<Skeleton className='h-8 w-12' />
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}

function QuickStatsSkeleton() {
	return (
		<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
			{Array.from({ length: 3 }).map((_, i) => (
				<Card key={i}>
					<CardHeader>
						<Skeleton className='h-4 w-24' />
					</CardHeader>
					<CardContent>
						<Skeleton className='h-8 w-16 mb-2' />
						<Skeleton className='h-3 w-32' />
					</CardContent>
				</Card>
			))}
		</div>
	);
}

function ResumeListSkeleton() {
	return (
		<Card>
			<CardHeader>
				<Skeleton className='h-6 w-32' />
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className='flex items-center space-x-4'>
							<Skeleton className='h-12 w-12 rounded' />
							<div className='space-y-2 flex-1'>
								<Skeleton className='h-4 w-32' />
								<Skeleton className='h-3 w-24' />
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export default async function DashboardPage() {
	// Get profile data separately since it might be used immediately
	const profileData = await getUserProfileOverview();

	return (
		<div className='space-y-8'>
			{/* Overview section with immediate loading */}
			<Suspense fallback={<OverviewSkeleton />}>
				<OverviewServer />
			</Suspense>

			{/* Quick stats with separate loading */}
			<Suspense fallback={<QuickStatsSkeleton />}>
				<QuickStats />
			</Suspense>

			{/* Main content grid */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				<div className='lg:col-span-2'>
					<Suspense fallback={<ResumeListSkeleton />}>
						<ResumeListServer />
					</Suspense>
				</div>
				<div className='lg:col-span-1'>
					<ProfileOverview userData={profileData} />
				</div>
			</div>

			{/* Recent activity with its own loading */}
			<Suspense
				fallback={
					<Card>
						<CardHeader>
							<Skeleton className='h-6 w-32' />
						</CardHeader>
						<CardContent>
							<div className='space-y-4'>
								{Array.from({ length: 5 }).map((_, i) => (
									<div key={i} className='flex items-center space-x-4'>
										<Skeleton className='h-8 w-8 rounded-full' />
										<div className='flex-1 space-y-1'>
											<Skeleton className='h-4 w-48' />
											<Skeleton className='h-3 w-24' />
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				}
			>
				<RecentActivity />
			</Suspense>
		</div>
	);
}
