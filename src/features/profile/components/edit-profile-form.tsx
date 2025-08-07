'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
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
import { Textarea } from '@/shared/components/ui/textarea';

type TProps = {
	initialData: {
		name?: string;
		email?: string;
		image?: string;
		bio?: string;
		location?: string;
		website?: string;
	};
	userId: string;
	onSuccess?: (data: TUpdateProfile) => void;
	onError?: (error: string) => void;
	onSubmitStart?: () => void;
};

export function EditProfileForm({ initialData, userId, onSuccess, onError, onSubmitStart }: TProps) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const isSubmitting = isPending;

	const form = useForm<TUpdateProfile>({
		resolver: zodResolver(TUpdateProfileSchema),
		defaultValues: {
			name: initialData.name || '',
			email: initialData.email || '',
			image: initialData.image || '',
			bio: initialData.bio || '',
			location: initialData.location || '',
			website: initialData.website || '',
		},
	});

	function handleSubmit(data: TUpdateProfile) {
		onSubmitStart?.();
		startTransition(async () => {
			try {
				const _updatedUser = await updateUserProfile(userId, data);

				// Force a full page refresh to update session data and UI
				router.refresh();

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

	function handleCancel() {
		// Reset form to original data
		form.reset({
			name: initialData.name || '',
			email: initialData.email || '',
			image: initialData.image || '',
			bio: initialData.bio || '',
			location: initialData.location || '',
			website: initialData.website || '',
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
								<Input placeholder='Enter your name' disabled={isSubmitting} {...field} />
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
								<Input type='email' placeholder='Enter your email' disabled={isSubmitting} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Image upload UI disabled */}
				<div className='text-xs text-muted-foreground'>Image upload not supported yet.</div>

				<FormField
					control={form.control}
					name='bio'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Bio</FormLabel>
							<FormControl>
								<Textarea 
									placeholder='Tell us about yourself...' 
									rows={3}
									disabled={isSubmitting}
									{...field} 
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<FormField
						control={form.control}
						name='location'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Location</FormLabel>
								<FormControl>
									<Input placeholder='City, Country' disabled={isSubmitting} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='website'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Website</FormLabel>
								<FormControl>
									<Input type='url' placeholder='https://yourwebsite.com' disabled={isSubmitting} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className='flex gap-4'>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<FormField
						control={form.control}
						name='location'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Location</FormLabel>
								<FormControl>
									<Input placeholder='City, Country' disabled={isSubmitting} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='website'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Website</FormLabel>
								<FormControl>
									<Input type='url' placeholder='https://yourwebsite.com' disabled={isSubmitting} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className='flex gap-4'>
					<Button 
						type='button' 
						variant='outline' 
						className='flex-1'
						disabled={isSubmitting}
						onClick={handleCancel}
					>
						Cancel
					</Button>
					<Button 
						type='submit' 
						className='flex-1'
						disabled={isSubmitting}
					>
						{isSubmitting ? 'Updating...' : 'Save Changes'}
					</Button>
				</div>
			</form>
		</Form>
	);
}
