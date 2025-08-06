'use client';

import { Bell, LogOut, Search } from 'lucide-react';
import { Button, SidebarTrigger } from '@/shared/components/ui';
import { Avatar } from '../../../shared/components/ui/avatar';

function UserTopBar() {
	return (
		<header className='flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4'>
			<SidebarTrigger />
			<div className='flex flex-1 items-center gap-2 px-3'>
				<div className='flex-1'>
					<div className='relative max-w-md'>
						<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
						<input
							type='search'
							placeholder='Search...'
							aria-label='Search'
							className='h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none ring-ring focus-visible:ring-2 focus-visible:ring-offset-2'
						/>
					</div>
				</div>

				<div className='flex items-center gap-2'>
					<Button
						variant='ghost'
						size='icon'
						className='h-9 w-9'
						aria-label='Notifications'
					>
						<Bell className='h-4 w-4' aria-hidden='true' />
					</Button>

					<div className='flex items-center gap-2 rounded-md border bg-background p-1'>
						<Avatar size='sm' fallback='JD' aria-label='User profile: John Doe' />
						<div className='hidden sm:block'>
							<p className='text-sm font-medium'>John Doe</p>
							<p className='text-xs text-muted-foreground'>john@example.com</p>
						</div>
					</div>

					<Button variant='ghost' size='icon' className='h-9 w-9' aria-label='Log out'>
						<LogOut className='h-4 w-4' aria-hidden='true' />
					</Button>
				</div>
			</div>
		</header>
	);
}

export { UserTopBar };
