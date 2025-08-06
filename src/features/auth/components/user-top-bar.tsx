'use client';

import { ChevronDownIcon, Home as DashboardIcon, LogOutIcon, UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authClient } from '@/features/auth/client/auth-client';
import { useSession } from '@/features/auth/hooks/hooks';
import { Avatar } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Separator } from '@/shared/components/ui/separator';

type TProps = {
	className?: string;
};

export function UserTopBar({ className }: TProps) {
	const { data: session, isLoading } = useSession();
	const [isOpen, setIsOpen] = useState(false);
	const [isSigningOut, setIsSigningOut] = useState(false);
	const router = useRouter();

	function getInitials(name?: string | null) {
		if (!name) return 'U';
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}

	async function handleSignOut() {
		setIsSigningOut(true);
		setIsOpen(false);

		try {
			await authClient.signOut();
			router.push('/login');
		} catch (error) {
			console.error('Sign out failed:', error);
		} finally {
			setIsSigningOut(false);
		}
	}

	function handleProfileClick() {
		setIsOpen(false);
		router.push('/dashboard/profile');
	}

	function handleDashboardClick() {
		setIsOpen(false);
		router.push('/dashboard');
	}

	if (isLoading || !session) {
		return null;
	}

	const { user } = session;

	return (
		<div className={className}>
			<Popover open={isOpen} onOpenChange={setIsOpen}>
				<PopoverTrigger asChild>
					<Button variant='ghost' className='flex items-center gap-2 px-3 py-2 h-auto'>
						<Avatar
							src={user.image || undefined}
							alt={user.name}
							fallback={getInitials(user.name)}
							size='sm'
						/>
						<span className='hidden sm:block text-sm font-medium'>{user.name}</span>
						<ChevronDownIcon className='h-4 w-4 text-muted-foreground' />
					</Button>
				</PopoverTrigger>

				<PopoverContent className='w-56 p-2' align='end'>
					<div className='flex flex-col space-y-1'>
						<div className='px-2 py-1.5 text-sm text-muted-foreground'>
							{user.email}
						</div>

						<Button
							variant='ghost'
							className='justify-start h-9 px-2'
							onClick={handleDashboardClick}
						>
							<DashboardIcon className='mr-2 h-4 w-4' />
							Dashboard
						</Button>

						<Separator className='my-1' />
						<Button
							variant='ghost'
							className='justify-start h-9 px-2'
							onClick={handleProfileClick}
						>
							<UserIcon className='mr-2 h-4 w-4' />
							Profile
						</Button>

						<Separator className='my-1' />

						<Button
							variant='ghost'
							className='justify-start h-9 px-2 text-red-600 hover:text-red-600 hover:bg-red-50'
							onClick={handleSignOut}
							disabled={isSigningOut}
						>
							<LogOutIcon className='mr-2 h-4 w-4' />
							{isSigningOut ? 'Signing out...' : 'Sign out'}
						</Button>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
