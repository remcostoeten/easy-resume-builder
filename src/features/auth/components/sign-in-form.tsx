'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { authClient } from '@/features/auth/client/auth-client';
import { OAuthButtons } from '@/features/auth/components';
import { AnimatedCheckbox } from '@/shared/components/primitives/animated-checkbox';
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
import { LoadingButton } from '@/shared/components/ui/loading-button';

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
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: '',
			password: '',
			rememberMe: false,
		},
	});

	async function handleSubmit(values: z.infer<typeof signInSchema>) {
		setIsLoading(true);

		try {
			const result = await authClient.signIn.email({
				email: values.email,
				password: values.password,
				rememberMe: values.rememberMe ?? true,
			});

			if (result.data) {
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
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'An unexpected error occurred';
			toast.error('Sign in failed', {
				description: errorMessage,
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
										<div className='relative'>
											<Input
												type={showPassword ? 'text' : 'password'}
												placeholder='Enter your password'
												disabled={isLoading}
												className='pr-10'
												{...field}
											/>
											<Button
												type='button'
												variant='ghost'
												size='sm'
												className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
												onClick={() => setShowPassword(!showPassword)}
												disabled={isLoading}
											>
												{showPassword ? (
													<EyeOff className='h-4 w-4 text-muted-foreground' />
												) : (
													<Eye className='h-4 w-4 text-muted-foreground' />
												)}
											</Button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='rememberMe'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<AnimatedCheckbox
											label='Remember me'
											disabled={isLoading}
											checked={field.value}
											onChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<LoadingButton type='submit' loading={isLoading} className='w-full'>
							Sign In
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
					onError={(msg) => toast.error('OAuth sign-in failed', { description: msg })}
					className='pt-2'
				/>
			</CardContent>
		</Card>
	);
}
