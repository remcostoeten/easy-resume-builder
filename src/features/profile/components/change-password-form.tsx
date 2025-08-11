'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
	type TChangePassword,
	TChangePasswordSchema,
} from '@/features/profile/client/schemas/profile-schemas';
import { changeUserPassword } from '@/features/profile/server/actions/profile-actions';
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
	userId: string;
	onSuccess?: () => void;
	onError?: (error: string) => void;
};

export function ChangePasswordForm({ userId, onSuccess, onError }: TProps) {
	const form = useForm<TChangePassword>({
		resolver: zodResolver(TChangePasswordSchema),
		defaultValues: {
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		},
	});

	function handleSubmit(data: TChangePassword) {
		startTransition(async () => {
			const result = await changeUserPassword(userId, data.currentPassword, data.newPassword);

			if (result.ok) {
				toast.success('Password changed', {
					description: 'Your password has been successfully updated.',
				});
				form.reset();
				onSuccess?.();
				return;
			}

			const message = result.message ?? 'Password update failed';
			toast.error('Password change failed', { description: message });
			onError?.(message);
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
				<FormField
					control={form.control}
					name='currentPassword'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Current Password</FormLabel>
							<FormControl>
								<Input
									type='password'
									placeholder='Enter current password'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='newPassword'
					render={({ field }) => (
						<FormItem>
							<FormLabel>New Password</FormLabel>
							<FormControl>
								<Input
									type='password'
									placeholder='Enter new password'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='confirmPassword'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirm Password</FormLabel>
							<FormControl>
								<Input
									type='password'
									placeholder='Confirm new password'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type='submit' className='w-full' disabled={form.formState.isSubmitting}>
					{form.formState.isSubmitting ? 'Updating...' : 'Change Password'}
				</Button>
			</form>
		</Form>
	);
}
