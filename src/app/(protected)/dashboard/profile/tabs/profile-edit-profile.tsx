'use client';

import { useState } from 'react';
import { User, Pencil } from 'lucide-react';
import type { TSession } from '@/features/auth/types';
import { Avatar } from '@/shared/components/ui/avatar';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/card';
import { EditProfileForm } from '@/features/profile/components/edit-profile-form';

type TProps = {
	user: TSession['user'];
};

export function ProfileEditProfile({ user }: TProps) {
	const [isLoading, setIsLoading] = useState(false);
	const userInitials = user.name
		.split(' ')
		.map((n) => n[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);

	function handleFormSubmitStart() {
		setIsLoading(true);
	}

	function handleFormSubmitEnd() {
		setIsLoading(false);
	}

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
						<div className='space-y-2 text-xs text-muted-foreground'>
							Image upload not supported yet.
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
					<EditProfileForm
						initialData={{
							name: user.name,
							email: user.email,
							image: user.image || undefined,
							bio: '',
							location: '',
							website: '',
						}}
						userId={user.id}
						onSubmitStart={handleFormSubmitStart}
						onSuccess={handleFormSubmitEnd}
						onError={handleFormSubmitEnd}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
