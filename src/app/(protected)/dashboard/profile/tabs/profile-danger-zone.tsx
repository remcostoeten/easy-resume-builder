'use client';

import { AlertTriangle, Database, LogOut, Trash2, UserX } from 'lucide-react';
import type { TSession } from '@/features/auth/types';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/card';

type TProps = {
	user: TSession['user'];
	session: TSession['session'];
};

export function ProfileDangerZone({ user, session }: TProps) {
	return (
		<div className='space-y-6'>
			<div className='flex items-center space-x-3'>
				<AlertTriangle className='h-5 w-5 text-destructive' />
				<div>
					<h3 className='text-lg font-medium text-destructive'>Danger Zone</h3>
					<p className='text-sm text-muted-foreground'>
						Irreversible and destructive actions
					</p>
				</div>
			</div>

			<div className='space-y-4'>
				<Card className='border-destructive/20'>
					<CardHeader>
						<CardTitle className='text-base flex items-center space-x-2'>
							<LogOut className='h-4 w-4' />
							<span>Sign Out All Devices</span>
						</CardTitle>
						<CardDescription>
							End all active sessions on all devices. You will need to sign in again.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='flex items-center justify-between'>
							<div className='text-sm text-muted-foreground'>
								This will invalidate all current sessions including this one.
							</div>
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button variant='destructive' size='sm' disabled>
										Sign Out All
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Sign out all devices?</AlertDialogTitle>
										<AlertDialogDescription>
											This will end all active sessions on all devices. You
											will need to sign in again to access your account.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction className='bg-destructive hover:bg-destructive/90'>
											Sign Out All Devices
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					</CardContent>
				</Card>

				<Card className='border-destructive/20'>
					<CardHeader>
						<CardTitle className='text-base flex items-center space-x-2'>
							<Database className='h-4 w-4' />
							<span>Export Account Data</span>
						</CardTitle>
						<CardDescription>
							Download a copy of all your account data and activity.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='flex items-center justify-between'>
							<div className='text-sm text-muted-foreground'>
								Includes profile data, settings, and activity history.
							</div>
							<Button variant='outline' size='sm' disabled>
								Export Data
							</Button>
						</div>
					</CardContent>
				</Card>

				<Card className='border-destructive/30'>
					<CardHeader>
						<CardTitle className='text-base flex items-center space-x-2'>
							<UserX className='h-4 w-4 text-destructive' />
							<span>Deactivate Account</span>
							<Badge variant='destructive' className='ml-2'>
								Reversible
							</Badge>
						</CardTitle>
						<CardDescription>
							Temporarily deactivate your account. You can reactivate it later.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='space-y-3'>
							<div className='text-sm text-muted-foreground'>
								Your profile will be hidden and you won't be able to sign in. Your
								data will be preserved and you can reactivate anytime.
							</div>
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button variant='destructive' size='sm' disabled>
										Deactivate Account
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Deactivate your account?
										</AlertDialogTitle>
										<AlertDialogDescription>
											Your account will be temporarily disabled. You can
											reactivate it anytime by signing in. Your data will be
											preserved.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction className='bg-destructive hover:bg-destructive/90'>
											Deactivate Account
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					</CardContent>
				</Card>

				<Card className='border-destructive'>
					<CardHeader>
						<CardTitle className='text-base flex items-center space-x-2'>
							<Trash2 className='h-4 w-4 text-destructive' />
							<span className='text-destructive'>Delete Account</span>
							<Badge variant='destructive' className='ml-2'>
								Permanent
							</Badge>
						</CardTitle>
						<CardDescription>
							Permanently delete your account and all associated data. This cannot be
							undone.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='space-y-3'>
							<div className='text-sm text-muted-foreground'>
								This will permanently delete:
							</div>
							<ul className='text-sm text-muted-foreground space-y-1 ml-4'>
								<li className='flex items-center space-x-2'>
									<div className='h-1 w-1 rounded-full bg-destructive' />
									<span>Your profile and account data</span>
								</li>
								<li className='flex items-center space-x-2'>
									<div className='h-1 w-1 rounded-full bg-destructive' />
									<span>All connected OAuth accounts</span>
								</li>
								<li className='flex items-center space-x-2'>
									<div className='h-1 w-1 rounded-full bg-destructive' />
									<span>Settings and preferences</span>
								</li>
								<li className='flex items-center space-x-2'>
									<div className='h-1 w-1 rounded-full bg-destructive' />
									<span>Activity history and sessions</span>
								</li>
							</ul>
							<div className='pt-2'>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button variant='destructive' size='sm' disabled>
											<Trash2 className='h-4 w-4 mr-2' />
											Delete Account Permanently
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle className='text-destructive'>
												Delete account permanently?
											</AlertDialogTitle>
											<AlertDialogDescription>
												This action cannot be undone. This will permanently
												delete your account and remove all your data from
												our servers.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<AlertDialogAction className='bg-destructive hover:bg-destructive/90'>
												Delete Account Forever
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
