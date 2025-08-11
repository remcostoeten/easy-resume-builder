'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import type * as React from 'react';
import { useEffect, useState } from 'react';

import { cn } from 'utilities';

function Popover({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Root>) {
	return <PopoverPrimitive.Root data-slot='popover' {...props} />;
}

function PopoverTrigger({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
	return <PopoverPrimitive.Trigger data-slot='popover-trigger' {...props} />;
}

function PopoverAnchor({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
	return <PopoverPrimitive.Anchor data-slot='popover-anchor' {...props} />;
}

function PopoverContent({
	className,
	align = 'center',
	sideOffset = 4,
	...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
	return (
		<PopoverPrimitive.Portal>
			<PopoverPrimitive.Content
				data-slot='popover-content'
				align={align}
				sideOffset={sideOffset}
				className={cn(
					'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 rounded-md border p-4 shadow-md outline-none',
					className
				)}
				{...props}
			/>
		</PopoverPrimitive.Portal>
	);
}

function PopoverInlinePlaceholder() {
	return (
		<div className='flex items-center justify-center gap-2 p-2'>
			<div className='size-3 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent' />
			<span className='text-muted-foreground text-xs'>Loading…</span>
		</div>
	);
}

type TPopoverLazyProps = {
	load: () => Promise<{ default: React.ComponentType<any> }>;
	componentProps?: Record<string, unknown>;
	placeholder?: React.ReactNode;
};

function PopoverLazyContent({ load, componentProps, placeholder }: TPopoverLazyProps) {
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
		return placeholder ? placeholder : <PopoverInlinePlaceholder />;
	}
	return <Loaded {...(componentProps || {})} />;
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor, PopoverLazyContent };
