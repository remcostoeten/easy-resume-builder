'use client';

import { Suspense, useState } from 'react';
import { toast } from 'sonner';
import { SignInForm, SignUpForm } from '@/features/auth/components';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { FormLoadingSkeleton } from '@/shared/components/ui/form-loading-skeleton';

function AsyncAuthForm({ type }: { type: 'signin' | 'signup' }) {
	function handleSuccess() {
		toast.success('Demo: Form submission successful!', {
			description: 'In a real app, you would be redirected to the dashboard.',
		});
	}

	if (type === 'signin') {
		return <SignInForm onSuccess={handleSuccess} />;
	}

	return <SignUpForm onSuccess={handleSuccess} />;
}

export function StyledFormsDemo() {
	const [formType, setFormType] = useState<'signin' | 'signup' | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	function handleShowForm(type: 'signin' | 'signup') {
		setIsLoading(true);

		// Simulate loading
		setTimeout(() => {
			setFormType(type);
			setIsLoading(false);
		}, 1000);
	}

	function handleReset() {
		setFormType(null);
		setIsLoading(false);
	}

	function handleToastDemo() {
		toast.success('This is a success toast!', {
			description: 'Sonner toasts are now integrated throughout the application.',
		});
	}

	if (isLoading) {
		return (
			<div className='max-w-md mx-auto p-6'>
				<FormLoadingSkeleton fieldCount={4} />
			</div>
		);
	}

	if (formType) {
		return (
			<div className='max-w-md mx-auto p-6 space-y-4'>
				<Button variant='outline' onClick={handleReset} className='w-full'>
					← Back to Demo
				</Button>

				<Suspense
					fallback={
						<FormLoadingSkeleton
							fieldCount={formType === 'signup' ? 5 : 3}
							title={formType === 'signup' ? 'Creating Account...' : 'Signing In...'}
						/>
					}
				>
					<AsyncAuthForm type={formType} />
				</Suspense>
			</div>
		);
	}

	return (
		<div className='max-w-2xl mx-auto p-6'>
			<Card className='w-full max-w-lg mx-auto'>
				<CardHeader>
					<CardTitle>Styled Forms Demo</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='space-y-3'>
						<h3 className='font-semibold'>✨ Features Implemented:</h3>
						<ul className='space-y-2 text-sm text-muted-foreground'>
							<li>• Mobile-friendly forms (w-full max-w-sm mx-auto)</li>
							<li>• Sonner toast notifications for success/error feedback</li>
							<li>• Suspense fallbacks with loading skeletons</li>
							<li>• Responsive grid layouts (sm:grid-cols-2, lg:grid-cols-3)</li>
							<li>• Proper loading states and error handling</li>
						</ul>
					</div>

					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4'>
						<Button onClick={() => handleShowForm('signin')} className='w-full'>
							Demo Sign In Form
						</Button>
						<Button
							onClick={() => handleShowForm('signup')}
							variant='outline'
							className='w-full'
						>
							Demo Sign Up Form
						</Button>
					</div>

					<div className='pt-4 border-t'>
						<Button onClick={handleToastDemo} variant='secondary' className='w-full'>
							Test Toast Notification
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
