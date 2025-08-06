import { CheckCircle, XCircle } from 'lucide-react';
import { headers } from 'next/headers';
import { auth } from '@/features/auth/server/auth';
import { Avatar } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Card } from '@/shared/components/ui/card';
import { ProfileStats } from './profile-stats';

type TUserProfileData = {
	name: string;
	email: string;
	lastLoginTime: Date | null;
	verificationStatus: boolean;
	image?: string | null;
	createdAt: Date;
};

type TProps = {
	userData?: TUserProfileData | null;
};

async function getUserProfileData(): Promise<TUserProfileData | null> {
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
		console.error('Failed to fetch user profile data:', error);
		return null;
	}
}

function getInitials(name: string): string {
	return name
		.split(' ')
		.map((n) => n[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);
}

export async function ProfileOverview({ userData: providedUserData }: TProps) {
	const userData = providedUserData ?? (await getUserProfileData());

	if (!userData) {
		return (
			<section className='space-y-6'>
				<div className='flex items-center justify-between'>
					<h2 className='text-2xl font-bold tracking-tight'>Profile Overview</h2>
				</div>
				<Card className='overflow-hidden'>
					<div className='p-8 text-center'>
						<p className='text-muted-foreground text-lg'>Unable to load profile data</p>
					</div>
				</Card>
			</section>
		);
	}

	return (
		<section className='space-y-8'>
			<div>
				<h2 className='text-2xl font-semibold'>Profile Overview</h2>
			</div>

			<Card className='p-8'>
				<div className='space-y-8'>
					<div className='flex flex-col sm:flex-row sm:items-start gap-6'>
						<div className='flex-shrink-0'>
							<Avatar
								src={userData.image || undefined}
								alt={userData.name}
								fallback={getInitials(userData.name)}
								size='xl'
							/>
						</div>

						<div className='flex-1 min-w-0 space-y-4'>
							<div>
								<h3 className='text-xl font-semibold'>{userData.name}</h3>
								<p className='text-muted-foreground'>{userData.email}</p>
							</div>

							<div className='flex items-center gap-2'>
								{userData.verificationStatus ? (
									<>
										<CheckCircle className='h-5 w-5 text-green-600' />
										<Badge
											variant='default'
											className='bg-green-50 text-green-700 border-green-200'
										>
											Verified
										</Badge>
									</>
								) : (
									<>
										<XCircle className='h-5 w-5 text-amber-600' />
										<Badge
											variant='secondary'
											className='bg-amber-50 text-amber-700 border-amber-200'
										>
											Unverified
										</Badge>
									</>
								)}
							</div>
						</div>
					</div>

					<div className='border-t pt-8'>
						<ProfileStats
							lastLoginTime={userData.lastLoginTime}
							createdAt={userData.createdAt}
						/>
					</div>
				</div>
			</Card>
		</section>
	);
}
