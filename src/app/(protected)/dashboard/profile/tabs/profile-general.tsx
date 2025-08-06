'use client';

import { format } from 'date-fns';
import type { TSession } from '@/features/auth/types';
import { Avatar } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';

type TProps = {
	user: TSession['user'];
	session: TSession['session'];
};

export function ProfileGeneral({ user, session }: TProps) {
	const userInitials = user.name
		.split(' ')
		.map((n) => n[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);

	return (
		<div className='space-y-6'>
			<div className='flex items-center space-x-4'>
				<Avatar
					src={user.image || undefined}
					alt={user.name}
					fallback={userInitials}
					size='2xl'
					className='text-lg'
				/>
				<div>
					<h2 className='text-2xl font-semibold'>{user.name}</h2>
					<p className='text-muted-foreground'>{user.email}</p>
					<div className='flex items-center space-x-2 mt-2'>
						<Badge variant={user.emailVerified ? 'default' : 'destructive'}>
							{user.emailVerified ? 'Email Verified' : 'Email Not Verified'}
						</Badge>
					</div>
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<div className='space-y-2'>
					<h3 className='text-lg font-medium'>Account Information</h3>
					<div className='space-y-2 text-sm'>
						<div>
							<span className='font-medium text-muted-foreground'>User ID:</span>
							<span className='ml-2 font-mono text-xs'>{user.id}</span>
						</div>
						<div>
							<span className='font-medium text-muted-foreground'>Created:</span>
							<span className='ml-2'>{format(user.createdAt, 'PPP')}</span>
						</div>
						<div>
							<span className='font-medium text-muted-foreground'>Last Updated:</span>
							<span className='ml-2'>{format(user.updatedAt, 'PPP')}</span>
						</div>
					</div>
				</div>

				<div className='space-y-2'>
					<h3 className='text-lg font-medium'>Current Session</h3>
					<div className='space-y-2 text-sm'>
						<div>
							<span className='font-medium text-muted-foreground'>Session ID:</span>
							<span className='ml-2 font-mono text-xs'>{session.id}</span>
						</div>
						<div>
							<span className='font-medium text-muted-foreground'>Expires:</span>
							<span className='ml-2'>{format(session.expiresAt, 'PPp')}</span>
						</div>
						{session.ipAddress && (
							<div>
								<span className='font-medium text-muted-foreground'>
									IP Address:
								</span>
								<span className='ml-2 font-mono text-xs'>{session.ipAddress}</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
