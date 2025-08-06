'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
	type TUpdateProfile,
	TUpdateProfileSchema,
} from '@/features/profile/client/schemas/profile-schemas';
import { updateUserProfile } from '@/features/profile/server/actions/profile-actions';
import { Button } from '@/shared/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';

type TProps = {
	initialData: {
		name?: string;
		email?: string;
		image?: string;
	};
	userId: string;
	onSuccess?: (data: TUpdateProfile) => void;
	onError?: (error: string) => void;
};

export function EditProfileForm({ initialData, userId, onSuccess, onError }: TProps) {
	const form = useForm<TUpdateProfile>({
		resolver: zodResolver(TUpdateProfileSchema),
		defaultValues: {
			name: initialData.name || '',
			email: initialData.email || '',
			image: initialData.image || '',
		},
	});

	function handleSubmit(data: TUpdateProfile) {
		startTransition(async () => {
			try {
				const updatedUser = await updateUserProfile(userId, data);

				toast.success('Profile updated', {
					description: 'Your profile has been successfully updated.',
				});

				form.reset(data);
				onSuccess?.(data);
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : 'Failed to update profile';

				toast.error('Update failed', {
					description: errorMessage,
				});

				onError?.(errorMessage);
			}
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder='Enter your name' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input type='email' placeholder='Enter your email' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='image'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Profile Image URL</FormLabel>
							<FormControl>
								<Input type='url' placeholder='Enter image URL' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type='submit' className='w-full' disabled={form.formState.isSubmitting}>
					{form.formState.isSubmitting ? 'Updating...' : 'Update Profile'}
				</Button>
			</form>
		</Form>
	);
}
