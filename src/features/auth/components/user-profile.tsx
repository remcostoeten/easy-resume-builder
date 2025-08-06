'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authClient } from '@/features/auth/client/auth-client';
import type { TSession } from '@/features/auth/types';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';

type TProps = {
	session: TSession;
	className?: string;
	onSignOut?: () => void;
};

export function UserProfile({ session, className, onSignOut }: TProps) {
	const [isSigningOut, setIsSigningOut] = useState(false);
	const router = useRouter();

	async function handleSignOut() {
		setIsSigningOut(true);

		try {
			await authClient.signOut();

			if (onSignOut) {
				onSignOut();
			} else {
				router.push('/sign-in');
			}
		} catch (error) {
			console.error('Sign out failed:', error);
		} finally {
			setIsSigningOut(false);
		}
	}

	function getInitials(name?: string | null) {
		if (!name) return 'U';

		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}

	const { user } = session;

	return (
		<Card className={className}>
			<CardHeader className='text-center'>
				<div className='flex justify-center mb-4'>
					{user.image ? (
						<img
							src={user.image}
							alt={user.name || 'User avatar'}
							className='w-16 h-16 rounded-full object-cover'
						/>
					) : (
						<div className='w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold'>
							{getInitials(user.name)}
						</div>
					)}
				</div>

				{user.name && <h2 className='text-xl font-semibold'>{user.name}</h2>}

				<p className='text-muted-foreground text-sm'>{user.email}</p>
			</CardHeader>

			<CardContent className='text-center'>
				<Button
					variant='outline'
					onClick={handleSignOut}
					disabled={isSigningOut}
					className='w-full'
				>
					{isSigningOut ? 'Signing out...' : 'Sign Out'}
				</Button>
			</CardContent>
		</Card>
	);
}
