'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';
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
	externalFileInputRef?: React.RefObject<HTMLInputElement>;
};

export function EditProfileForm({ initialData, userId, onSuccess, onError, onSubmitStart, externalFileInputRef }: TProps) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const internalFileInputRef = useRef<HTMLInputElement>(null);
	const fileInputRef = externalFileInputRef || internalFileInputRef;
	const [imagePreview, setImagePreview] = useState<string>(initialData.image || '');
	const [currentObjectUrl, setCurrentObjectUrl] = useState<string | null>(null);
	
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

	// Cleanup object URLs on unmount
	useEffect(() => {
		return () => {
			if (currentObjectUrl) {
				URL.revokeObjectURL(currentObjectUrl);
			}
		};
	}, [currentObjectUrl]);

	function handleFileUpload() {
		fileInputRef.current?.click();
	}

	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (file) {
			// Clean up previous object URL
			if (currentObjectUrl) {
				URL.revokeObjectURL(currentObjectUrl);
			}

			// Create new object URL for preview
			const objectUrl = URL.createObjectURL(file);
			setCurrentObjectUrl(objectUrl);
			setImagePreview(objectUrl);
			// For now, set the image field to the object URL (in real app, you'd upload to server first)
			form.setValue('image', objectUrl);
		}
	}

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
		// Reset image preview to original
		setImagePreview(initialData.image || '');
		// Clean up any current object URL
		if (currentObjectUrl) {
			URL.revokeObjectURL(currentObjectUrl);
			setCurrentObjectUrl(null);
		}
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

				{!externalFileInputRef && (
					<FormField
						control={form.control}
						name='image'
						render={() => (
							<FormItem>
								<FormLabel>Profile Picture</FormLabel>
								<FormControl>
									<div className='flex items-center space-x-4'>
										{imagePreview && (
											<img 
												src={imagePreview} 
												alt='Profile preview' 
												className='w-16 h-16 rounded-full object-cover'
											/>
										)}
										<Button
											type='button'
											variant='outline'
											onClick={handleFileUpload}
											disabled={isSubmitting}
										>
											Upload New Picture
										</Button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				<input
					ref={fileInputRef}
					type='file'
					accept='image/*'
					className='hidden'
					onChange={handleFileChange}
				/>

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
