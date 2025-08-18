'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type * as React from 'react';
import { useEffect, useState } from 'react';

import { cn } from 'utilities';

function TooltipProvider({
	delayDuration = 0,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
	return (
		<TooltipPrimitive.Provider
			data-slot='tooltip-provider'
			delayDuration={delayDuration}
			{...props}
		/>
	);
}

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
	return (
		<TooltipProvider>
			<TooltipPrimitive.Root data-slot='tooltip' {...props} />
		</TooltipProvider>
	);
}

function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
	return <TooltipPrimitive.Trigger data-slot='tooltip-trigger' {...props} />;
}

function TooltipContent({
	className,
	sideOffset = 0,
	children,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Content
				data-slot='tooltip-content'
				sideOffset={sideOffset}
				className={cn(
					'bg-popover text-popover-foreground border border-border animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance shadow-md',
					className
				)}
				{...props}
			>
				{children}
				<TooltipPrimitive.Arrow className='bg-popover fill-popover border border-border z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]' />
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	);
}

function TooltipInlinePlaceholder() {
	return (
		<div className='flex items-center justify-center gap-1 px-2 py-1'>
			<div className='size-2 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent' />
			<span className='text-muted-foreground text-[10px]'>Loading…</span>
		</div>
	);
}

type TTooltipLazyProps = {
	load: () => Promise<{ default: React.ComponentType<any> }>;
	componentProps?: Record<string, unknown>;
	placeholder?: React.ReactNode;
};

function TooltipLazyContent({ load, componentProps, placeholder }: TTooltipLazyProps) {
	const [Loaded, setLoaded] = useState<React.ComponentType<any> | null>(null);
	const [started, setStarted] = useState(false);

	useEffect(
		function startLoading() {
			if (started) {
				return;
			}
			setStarted(true);
			let mounted = true;
			load().then(function onResolve(mod) {
				if (mounted) {
					setLoaded(() => mod.default);
				}
			});
			return function onCleanup() {
				mounted = false;
			};
		},
		[load, started]
	);

	if (!Loaded) {
		return placeholder ? placeholder : <TooltipInlinePlaceholder />;
	}
	return <Loaded {...(componentProps || {})} />;
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, TooltipLazyContent };
