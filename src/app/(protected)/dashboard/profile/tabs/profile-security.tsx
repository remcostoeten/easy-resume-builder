'use client';

import { format } from 'date-fns';
import { Clock, Globe, Shield, Smartphone } from 'lucide-react';
import type { TSession } from '@/features/auth/types';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/card';
import NumberFlow from '@number-flow/react'

type TProps = {
	session: TSession['session'];
};

export function ProfileSecurity({ session }: TProps) {
	const isExpiringSoon =
		new Date(session.expiresAt).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000;

	return (
		<div className='space-y-6'>
			<div>
				<h3 className='text-lg font-medium'>Security Settings</h3>
				<p className='text-sm text-muted-foreground'>
					Manage your account security and active sessions
				</p>
			</div>

			<Card>
				<CardHeader>
					<div className='flex items-center space-x-3'>
						<Shield className='h-5 w-5' />
						<div>
							<CardTitle className='text-base'>Current Session</CardTitle>
							<CardDescription>Your active login session</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<div className='flex items-center space-x-2'>
									<Clock className='h-4 w-4 text-muted-foreground' />
									<span className='text-sm font-medium'>Session Duration</span>
								</div>
								<div className='text-sm text-muted-foreground ml-6'>
									Started: {format(session.createdAt, 'PPp')}
								</div>
								<div className='text-sm text-muted-foreground ml-6'>
									<span>Expires: {format(session.expiresAt, 'PPp')}</span>
									<Badge
										variant={isExpiringSoon ? 'destructive' : 'secondary'}
										className='ml-2'
									>
										{isExpiringSoon ? 'Expires Soon' : 'Active'}
									</Badge>
								</div>
							</div>

							<div className='space-y-2'>
								<div className='flex items-center space-x-2'>
									<Globe className='h-4 w-4 text-muted-foreground' />
									<span className='text-sm font-medium'>Connection Info</span>
								</div>
								{session.ipAddress && (
									<div className='text-sm text-muted-foreground ml-6'>
										IP: {session.ipAddress}
									</div>
								)}
								
                <NumberFlow value={123} />
{session.userAgent && (
									<div className='text-sm text-muted-foreground ml-6'>
										<div className='flex items-center space-x-2'>
											<Smartphone className='h-3 w-3' />
											<span
												className='truncate max-w-xs'
												title={session.userAgent}
											>
												{session.userAgent.length > 50
													? `${session.userAgent.substring(0, 50)}...`
													: session.userAgent}
											</span>
										</div>
									</div>
								)}
							</div>
						</div>

						<div className='pt-4 border-t'>
							<div className='flex space-x-2'>
								<Button variant='outline' size='sm' disabled>
									Extend Session
								</Button>
								<Button variant='destructive' size='sm' disabled>
									Sign Out
								</Button>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className='text-base'>Security Actions</CardTitle>
					<CardDescription>Manage your account security preferences</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						<div className='flex items-center justify-between p-3 border rounded-lg'>
							<div>
								<div className='text-sm font-medium'>Change Password</div>
								<div className='text-xs text-muted-foreground'>
									Update your account password
								</div>
							</div>
							<Button variant='outline' size='sm' disabled>
								Change
							</Button>
						</div>

						<div className='flex items-center justify-between p-3 border rounded-lg'>
							<div>
								<div className='text-sm font-medium'>Two-Factor Authentication</div>
								<div className='text-xs text-muted-foreground'>
									Add an extra layer of security
								</div>
							</div>
							<Button variant='outline' size='sm' disabled>
								Enable 2FA
							</Button>
						</div>

						<div className='flex items-center justify-between p-3 border rounded-lg'>
							<div>
								<div className='text-sm font-medium'>Active Sessions</div>
								<div className='text-xs text-muted-foreground'>
									View and manage all active sessions
								</div>
							</div>
							<Button variant='outline' size='sm' disabled>
								View All
							</Button>
						</div>

						<div className='flex items-center justify-between p-3 border rounded-lg border-destructive/20'>
							<div>
								<div className='text-sm font-medium text-destructive'>
									Delete Account
								</div>
								<div className='text-xs text-muted-foreground'>
									Permanently delete your account and all data
								</div>
							</div>
							<Button variant='destructive' size='sm' disabled>
								Delete
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
