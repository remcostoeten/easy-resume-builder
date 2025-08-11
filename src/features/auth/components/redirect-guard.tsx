'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSession } from '@/hooks';

type TProps = {
	children: ReactNode;
	redirectTo?: string;
};

export function RedirectGuard({ children, redirectTo = '/dashboard' }: TProps) {
	const { data: session, isLoading } = useSession();
	const router = useRouter();

	useEffect(
		function redirectIfAuthenticated() {
			if (!isLoading && session) {
				router.push(redirectTo);
			}
		},
		[session, isLoading, router, redirectTo]
	);

	if (isLoading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='flex flex-col items-center space-y-4'>
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
					<p className='text-muted-foreground text-sm'>Loading...</p>
				</div>
			</div>
		);
	}

	if (session) {
		return null;
	}

	return <>{children}</>;
}
