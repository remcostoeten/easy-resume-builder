'use client';

import { Camera, Mail, Pencil, User } from 'lucide-react';
import type { TSession } from '@/features/auth/types';
import { Avatar } from '@/shared/components/ui/avatar';
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
import { Textarea } from '@/shared/components/ui/textarea';

type TProps = {
	user: TSession['user'];
};

export function ProfileEditProfile({ user }: TProps) {
	const userInitials = user.name
		.split(' ')
		.map((n) => n[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);

	return (
		<div className='space-y-6'>
			<div>
				<h3 className='text-lg font-medium'>Edit Profile</h3>
				<p className='text-sm text-muted-foreground'>
					Update your profile information and preferences
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className='text-base flex items-center space-x-2'>
						<User className='h-4 w-4' />
						<span>Profile Picture</span>
					</CardTitle>
					<CardDescription>
						Update your profile picture to personalize your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='flex items-center space-x-4'>
						<Avatar
							src={user.image || undefined}
							alt={user.name}
							fallback={userInitials}
							size='2xl'
							className='text-lg'
						/>
						<div className='space-y-2'>
							<Button variant='outline' size='sm' disabled>
								<Camera className='h-4 w-4 mr-2' />
								Upload New Picture
							</Button>
							<div className='text-xs text-muted-foreground'>
								Recommended: Square image, at least 200x200px
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className='text-base flex items-center space-x-2'>
						<Pencil className='h-4 w-4' />
						<span>Personal Information</span>
					</CardTitle>
					<CardDescription>
						Update your personal details and contact information
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form className='space-y-4'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='fullName'>Full Name</Label>
								<Input
									id='fullName'
									defaultValue={user.name}
									placeholder='Enter your full name'
									disabled
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='email'>Email Address</Label>
								<div className='relative'>
									<Input
										id='email'
										type='email'
										defaultValue={user.email}
										placeholder='Enter your email'
										disabled
									/>
									<Mail className='absolute right-3 top-2.5 h-4 w-4 text-muted-foreground' />
								</div>
							</div>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='bio'>Bio</Label>
							<Textarea
								id='bio'
								placeholder='Tell us about yourself...'
								rows={3}
								disabled
							/>
							<div className='text-xs text-muted-foreground'>
								Brief description for your profile. Maximum 500 characters.
							</div>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='location'>Location</Label>
								<Input id='location' placeholder='City, Country' disabled />
							</div>
							<div className='space-y-2'>
								<Label htmlFor='website'>Website</Label>
								<Input
									id='website'
									type='url'
									placeholder='https://yourwebsite.com'
									disabled
								/>
							</div>
						</div>

						<div className='pt-4 border-t'>
							<div className='flex space-x-2'>
								<Button type='submit' disabled>
									Save Changes
								</Button>
								<Button type='button' variant='outline' disabled>
									Cancel
								</Button>
							</div>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
