import type React from 'react';
import { UserDropdown } from '@/features/auth/components';
import { ThemeToggleButton } from '@/app/(dev)/showcase/_components';

type TProps = {
	children: React.ReactNode;
};

export function DashboardLayout({ children }: TProps) {
	return (
		<div className='min-h-screen bg-background'>
			<header className='border-b bg-card'>
				<div className='container mx-auto px-4 py-4'>
					<div className='flex items-center justify-between'>
						<h1 className='text-2xl font-bold'>Dashboard</h1>
						<div className='flex items-center space-x-6'>
							<nav className='flex items-center space-x-4' aria-label='Primary'>
								<a href='/dashboard' className='text-foreground hover:text-primary'>
									Overview
								</a>
								<a
									href='/dashboard/profile'
									className='text-muted-foreground hover:text-foreground'
								>
									Profile
								</a>
								<a
									href='/dashboard/settings'
									className='text-muted-foreground hover:text-foreground'
								>
									Settings
								</a>
							</nav>
<ThemeToggleButton theme="light" onClick={() => {}}/>							<UserDropdown />
							<UserDropdown />
						</div>
					</div>
				</div>
			</header>
			<main className='container mx-auto px-4 py-8'>{children}</main>
		</div>
	);
}
