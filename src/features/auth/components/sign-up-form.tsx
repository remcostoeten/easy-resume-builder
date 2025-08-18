'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { authClient } from '@/features/auth/client/auth-client';
import { OAuthButtons } from '@/features/auth/components';
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
import { LoadingButton } from '@/shared/components/ui/loading-button';

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
	const [error, setError] = useState<string>('');
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
		setError(''); // Clear previous errors

		try {
			const result = await authClient.signUp.email({
				name: values.name,
				email: values.email,
				password: values.password,
			});

			// Debug logging
			console.log('Sign up result:', result);

			if (result.data) {
				toast.success('Account created successfully!', {
					description: 'Welcome! Redirecting to dashboard...',
				});

				if (onSuccess) {
					onSuccess();
				} else {
					// Small delay to ensure session is established
					setTimeout(() => {
						router.push('/dashboard');
					}, 100);
				}
			} else {
				const errorMessage = result.error?.message || 'Please check your information and try again.';
				console.log('Sign up error:', result.error);
				setError(errorMessage);
				toast.error('Failed to create account', {
					description: errorMessage,
				});
			}
		} catch (error) {
			console.error('Sign up exception:', error);
			let errorMessage = 'An unexpected error occurred';
			
			if (error instanceof Error) {
				// Handle specific error types
				if (error.message.includes('fetch') || error.message.includes('network')) {
					errorMessage = 'Network error. Please check your connection and try again.';
				} else if (error.message.includes('timeout')) {
					errorMessage = 'Request timed out. Please try again.';
				} else {
					errorMessage = error.message;
				}
			}
			
			setError(errorMessage);
			toast.error('Failed to create account', {
				description: errorMessage,
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
				{error && (
					<div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
						{error}
					</div>
				)}
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

						<LoadingButton type='submit' loading={isLoading} className='w-full'>
							Create Account
						</LoadingButton>
					</form>
				</Form>

				<div className='relative py-4'>
					<div className='absolute inset-0 flex items-center'>
						<span className='w-full border-t border-border' />
					</div>
					<span className='relative bg-background px-2 text-xs text-muted-foreground'>
						Or continue with
					</span>
				</div>

				<OAuthButtons
					onError={(msg) => toast.error('OAuth sign-up failed', { description: msg })}
					className='pt-2'
				/>
			</CardContent>
		</Card>
	);
}
