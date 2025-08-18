'use client';

import type { ReactNode } from 'react';
import { useSession } from '@/hooks';
import { SignInForm } from './sign-in-form';

type TProps = {
	children: ReactNode;
	fallback?: ReactNode;
	showSignInForm?: boolean;
	className?: string;
};

export function AuthGuard({ children, fallback, showSignInForm = true, className }: TProps) {
	const { data: session, isLoading } = useSession();

	if (isLoading) {
		return (
			<div className={`flex items-center justify-center min-h-screen ${className || ''}`}>
				<div className='flex flex-col items-center space-y-4'>
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
					<p className='text-muted-foreground text-sm'>Loading...</p>
				</div>
			</div>
		);
	}

	if (!session) {
		if (fallback) {
			return <>{fallback}</>;
		}

		if (showSignInForm) {
			return (
				<div
					className={`flex items-center justify-center min-h-screen p-4 ${className || ''}`}
				>
					<div className='w-full max-w-md'>
						<SignInForm />
					</div>
				</div>
			);
		}

		return null;
	}

	return <>{children}</>;
}
