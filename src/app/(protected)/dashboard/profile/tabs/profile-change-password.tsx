'use client';

import { Eye, EyeOff, Key, Shield } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

export function ProfileChangePassword() {
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	function togglePasswordVisibility(field: 'current' | 'new' | 'confirm') {
		switch (field) {
			case 'current':
				setShowCurrentPassword(!showCurrentPassword);
				break;
			case 'new':
				setShowNewPassword(!showNewPassword);
				break;
			case 'confirm':
				setShowConfirmPassword(!showConfirmPassword);
				break;
		}
	}

	return (
		<div className='space-y-6'>
			<div>
				<h3 className='text-lg font-medium'>Change Password</h3>
				<p className='text-sm text-muted-foreground'>
					Update your password to keep your account secure
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className='text-base flex items-center space-x-2'>
						<Shield className='h-4 w-4' />
						<span>Password Security</span>
					</CardTitle>
					<CardDescription>
						Choose a strong password that you haven't used elsewhere
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='currentPassword'>Current Password</Label>
							<div className='relative'>
								<Input
									id='currentPassword'
									type={showCurrentPassword ? 'text' : 'password'}
									placeholder='Enter your current password'
									disabled
								/>
								<Button
									type='button'
									variant='ghost'
									size='sm'
									className='absolute right-0 top-0 h-full px-3'
									onClick={() => togglePasswordVisibility('current')}
									disabled
								>
									{showCurrentPassword ? (
										<EyeOff className='h-4 w-4' />
									) : (
										<Eye className='h-4 w-4' />
									)}
								</Button>
							</div>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='newPassword'>New Password</Label>
							<div className='relative'>
								<Input
									id='newPassword'
									type={showNewPassword ? 'text' : 'password'}
									placeholder='Enter your new password'
									disabled
								/>
								<Button
									type='button'
									variant='ghost'
									size='sm'
									className='absolute right-0 top-0 h-full px-3'
									onClick={() => togglePasswordVisibility('new')}
									disabled
								>
									{showNewPassword ? (
										<EyeOff className='h-4 w-4' />
									) : (
										<Eye className='h-4 w-4' />
									)}
								</Button>
							</div>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='confirmPassword'>Confirm New Password</Label>
							<div className='relative'>
								<Input
									id='confirmPassword'
									type={showConfirmPassword ? 'text' : 'password'}
									placeholder='Confirm your new password'
									disabled
								/>
								<Button
									type='button'
									variant='ghost'
									size='sm'
									className='absolute right-0 top-0 h-full px-3'
									onClick={() => togglePasswordVisibility('confirm')}
									disabled
								>
									{showConfirmPassword ? (
										<EyeOff className='h-4 w-4' />
									) : (
										<Eye className='h-4 w-4' />
									)}
								</Button>
							</div>
						</div>

						<div className='pt-4 border-t'>
							<div className='flex space-x-2'>
								<Button type='submit' disabled>
									<Key className='h-4 w-4 mr-2' />
									Update Password
								</Button>
								<Button type='button' variant='outline' disabled>
									Cancel
								</Button>
							</div>
						</div>
					</form>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className='text-base'>Password Requirements</CardTitle>
					<CardDescription>
						Your password should meet the following criteria
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ul className='space-y-2 text-sm text-muted-foreground'>
						<li className='flex items-center space-x-2'>
							<div className='h-1.5 w-1.5 rounded-full bg-muted-foreground' />
							<span>At least 8 characters long</span>
						</li>
						<li className='flex items-center space-x-2'>
							<div className='h-1.5 w-1.5 rounded-full bg-muted-foreground' />
							<span>Include uppercase and lowercase letters</span>
						</li>
						<li className='flex items-center space-x-2'>
							<div className='h-1.5 w-1.5 rounded-full bg-muted-foreground' />
							<span>Include at least one number</span>
						</li>
						<li className='flex items-center space-x-2'>
							<div className='h-1.5 w-1.5 rounded-full bg-muted-foreground' />
							<span>Include at least one special character</span>
						</li>
					</ul>
				</CardContent>
			</Card>
		</div>
	);
}
