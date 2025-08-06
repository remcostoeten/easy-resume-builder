'use client';

import { FileText, Home, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/shared/components/ui';
import { cn } from '@/shared/utilities';

type TMenuDefinition = {
	label: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
};

type TFeatureFlags = {
	showAnalytics: boolean;
	showAdvancedSettings: boolean;
};

function getMenuDefinitions(): TMenuDefinition[] {
	return [
		{
			label: 'Dashboard',
			icon: Home,
			href: '/dashboard',
		},
		{
			label: 'Resumes',
			icon: FileText,
			href: '/resumes',
		},
		{
			label: 'Profile',
			icon: User,
			href: '/dashboard/profile',
		},
		{
			label: 'Settings',
			icon: Settings,
			href: '/settings',
		},
	];
}

function filterMenuItemsByFeatureFlags(
	menuItems: TMenuDefinition[],
	featureFlags: TFeatureFlags
): TMenuDefinition[] {
	return menuItems.filter((item) => {
		if (item.href === '/analytics' && !featureFlags.showAnalytics) {
			return false;
		}
		if (item.href === '/settings/advanced' && !featureFlags.showAdvancedSettings) {
			return false;
		}
		return true;
	});
}

function isActiveRoute(currentPath: string, itemPath: string): boolean {
	if (itemPath === '/dashboard') {
		return currentPath === '/dashboard' || currentPath === '/';
	}
	return currentPath.startsWith(itemPath);
}

type TProps = {
	featureFlags?: TFeatureFlags;
};

export function SidebarNavigation({
	featureFlags = { showAnalytics: true, showAdvancedSettings: true },
}: TProps) {
	const pathname = usePathname();
	const menuDefinitions = getMenuDefinitions();
	const filteredMenuItems = filterMenuItemsByFeatureFlags(menuDefinitions, featureFlags);

	return (
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarMenu role='navigation' aria-label='Main navigation'>
					{filteredMenuItems.map((item) => {
						const isActive = isActiveRoute(pathname, item.href);

						return (
							<SidebarMenuItem key={item.href}>
								<SidebarMenuButton asChild>
									<Link
										href={item.href}
										aria-label={`Navigate to ${item.label}`}
										aria-current={isActive ? 'page' : undefined}
										className={cn(
											'flex items-center gap-2',
											isActive &&
												'bg-accent text-accent-foreground font-medium'
										)}
									>
										<item.icon className='h-4 w-4' aria-hidden='true' />
										<span>{item.label}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
