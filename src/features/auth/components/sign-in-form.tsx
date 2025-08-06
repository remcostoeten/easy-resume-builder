'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { signInEmail } from '@/features/auth/server/mutations/sign-in-email';
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

const signInSchema = z.object({
	email: z.string().email('Please enter a valid email address'),
	password: z.string().min(1, 'Password is required'),
	rememberMe: z.boolean().optional(),
});

type TProps = {
	onSuccess?: () => void;
	className?: string;
};

export function SignInForm({ onSuccess, className }: TProps) {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	async function handleSubmit(values: z.infer<typeof signInSchema>) {
		setIsLoading(true);

		try {
			const result = await signInEmail({
				email: values.email,
				password: values.password,
				rememberMe: values.rememberMe,
			});

			if (result.success) {
				toast.success('Successfully signed in!', {
					description: 'Welcome back. Redirecting to dashboard...',
				});

				if (onSuccess) {
					onSuccess();
				} else {
					router.push('/dashboard');
				}
			} else {
				toast.error('Sign in failed', {
					description:
						result.error?.message || 'Please check your credentials and try again.',
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
				<CardTitle>Sign In</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
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
											placeholder='Enter your password'
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
							name='rememberMe'
							render={({ field }) => (
								<FormItem className='flex flex-row items-center space-x-2 space-y-0'>
									<FormControl>
										<input
											type='checkbox'
											disabled={isLoading}
											checked={field.value}
											onChange={field.onChange}
											className='rounded border border-input'
										/>
									</FormControl>
									<FormLabel className='text-sm font-normal'>
										Remember me
									</FormLabel>
								</FormItem>
							)}
						/>

						<Button type='submit' disabled={isLoading} className='w-full'>
							{isLoading ? 'Signing in...' : 'Sign In'}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
