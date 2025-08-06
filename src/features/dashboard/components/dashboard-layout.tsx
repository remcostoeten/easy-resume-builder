'use client';

import type React from 'react';
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarInset,
	SidebarProvider,
} from '@/shared/components/ui';
import { SidebarNavigation } from './sidebar-navigation';
import { UserTopBar } from './user-top-bar';

type TProps = {
	children: React.ReactNode;
};

function DashboardLayout({ children }: TProps) {
	return (
		<SidebarProvider defaultOpen={true}>
			<div className='flex min-h-screen w-full'>
				<Sidebar side='left' variant='sidebar' collapsible='icon'>
					<SidebarHeader>
						<div className='flex items-center gap-2 px-2 py-2'>
							<div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
								<span className='text-sm font-bold'>D</span>
							</div>
							<span className='text-lg font-semibold group-data-[collapsible=icon]:hidden'>
								Dashboard
							</span>
						</div>
					</SidebarHeader>

					<SidebarContent className='gap-0'>
						<SidebarNavigation />
					</SidebarContent>
				</Sidebar>

				<SidebarInset className='flex flex-1 flex-col overflow-hidden'>
					<UserTopBar />

					<main className='flex-1 overflow-auto p-6'>{children}</main>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}

export { DashboardLayout };
