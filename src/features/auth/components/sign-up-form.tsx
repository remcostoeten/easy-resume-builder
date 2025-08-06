'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { signUpEmail } from '@/features/auth/server/mutations/sign-up-email';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';

const signUpSchema = z
	.object({
		name: z.string().min(2, 'Name must be at least 2 characters'),
		email: z.string().email('Please enter a valid email address'),
		password: z.string().min(8, 'Password must be at least 8 characters'),
		confirmPassword: z.string().min(1, 'Please confirm your password'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

type TProps = {
	onSuccess?: () => void;
	className?: string;
};

export function SignUpForm({ onSuccess, className }: TProps) {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	});

	async function handleSubmit(values: z.infer<typeof signUpSchema>) {
		setIsLoading(true);

		try {
			const result = await signUpEmail({
				name: values.name,
				email: values.email,
				password: values.password,
			});

			if (result.success) {
				toast.success('Account created successfully!', {
					description: 'Welcome! Redirecting to dashboard...',
				});

				if (onSuccess) {
					onSuccess();
				} else {
					router.push('/dashboard');
				}
			} else {
				toast.error('Failed to create account', {
					description:
						result.error?.message || 'Please check your information and try again.',
				});
			}
		} catch (_error) {
			toast.error('An unexpected error occurred', {
				description: 'Please try again later.',
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Card className={`w-full max-w-sm mx-auto ${className || ''}`}>
			<CardHeader>
				<CardTitle>Create Account</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Full Name</FormLabel>
									<FormControl>
										<Input
											placeholder='Enter your full name'
											disabled={isLoading}
											{...field}
										/>
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
										<Input
											type='email'
											placeholder='Enter your email'
											disabled={isLoading}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type='password'
											placeholder='Create a password'
											disabled={isLoading}
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
											placeholder='Confirm your password'
											disabled={isLoading}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type='submit' disabled={isLoading} className='w-full'>
							{isLoading ? 'Creating account...' : 'Create Account'}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
