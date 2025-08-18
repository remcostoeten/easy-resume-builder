'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { FocusScope } from '@radix-ui/react-focus-scope';
import { XIcon } from 'lucide-react';
import type * as React from 'react';
import { useEffect, useRef, useState } from 'react';

import { cn } from 'utilities';
import '@/styles/modal-transitions.css';
import { start } from '../../utilities/view-transition';

function Dialog({ open, children, onOpenChange, ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
	function handleOpenChange(next: boolean) {
		if (typeof onOpenChange !== 'function') {
			return;
		}
		void start(function run() {
			onOpenChange(next);
		});
	}

	return (
		<DialogPrimitive.Root data-slot='dialog' open={open} onOpenChange={handleOpenChange} {...props}>
			{children}
		</DialogPrimitive.Root>
	);
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
	return <DialogPrimitive.Trigger data-slot='dialog-trigger' {...props} />;
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
	return <DialogPrimitive.Portal data-slot='dialog-portal' {...props} />;
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
	return <DialogPrimitive.Close data-slot='dialog-close' {...props} />;
}

function DialogOverlay({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
	return (
			<DialogPrimitive.Overlay asChild {...props}>
				<div
					data-slot='dialog-overlay'
					data-open='true'
					data-vt='modal'
					style={{ viewTransitionName: 'modal' } as any}
					className={cn('modal-overlay fixed inset-0 z-50', className)}
				/>
			</DialogPrimitive.Overlay>
	);
}

function DialogContent({
	className,
	children,
	showCloseButton = true,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
	showCloseButton?: boolean;
}) {
	const previousActiveElementRef = useRef<Element | null>(null);

	function handleMountAutoFocus(event: Event) {
		previousActiveElementRef.current = document.activeElement;
		event.preventDefault();

		const target = event.currentTarget as HTMLElement;
		const closeButton = target?.querySelector('[data-slot="dialog-close"]') as HTMLElement;
		if (closeButton) {
			closeButton.focus();
		}
	}

	function handleUnmountAutoFocus() {
		if (previousActiveElementRef.current instanceof HTMLElement) {
			previousActiveElementRef.current.focus();
		}
	}

	return (
		<DialogPortal data-slot='dialog-portal'>
			<DialogOverlay />
			<DialogPrimitive.Content asChild {...props}>
				<div
					data-slot='dialog-content'
					data-open='true'
					data-vt='modal'
					style={{ viewTransitionName: 'modal' } as any}
					role='dialog'
					aria-modal='true'
					aria-labelledby='dialog-title'
					aria-describedby='dialog-description'
					aria-live='polite'
					className={cn(
						'modal bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-[50%] -translate-y-[50%] gap-4 rounded-lg border p-6 shadow-lg sm:max-w-lg',
						className
					)}
				>
					<FocusScope
						loop
						trapped
						onMountAutoFocus={handleMountAutoFocus}
						onUnmountAutoFocus={handleUnmountAutoFocus}
					>
						{children}
						{showCloseButton && (
							<DialogPrimitive.Close
								data-slot='dialog-close'
								aria-label='Close dialog'
								className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
							>
								<XIcon />
								<span className='sr-only'>Close</span>
							</DialogPrimitive.Close>
						)}
					</FocusScope>
				</div>
			</DialogPrimitive.Content>
		</DialogPortal>
	);
}

function DialogInlinePlaceholder() {
	return (
		<div className='flex items-center justify-center gap-2 py-6'>
			<div className='size-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent' />
			<span className='text-muted-foreground text-sm'>Loading…</span>
		</div>
	);
}

type TDialogLazyProps = {
	load: () => Promise<{ default: React.ComponentType<any> }>;
	componentProps?: Record<string, unknown>;
	placeholder?: React.ReactNode;
};

function DialogLazyContent({ load, componentProps, placeholder }: TDialogLazyProps) {
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
		return placeholder ? placeholder : <DialogInlinePlaceholder />;
	}
	return <Loaded {...(componentProps || {})} />;
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot='dialog-header'
			className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
			{...props}
		/>
	);
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot='dialog-footer'
			className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
			{...props}
		/>
	);
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
	return (
		<DialogPrimitive.Title
			id='dialog-title'
			data-slot='dialog-title'
			className={cn('text-lg leading-none font-semibold', className)}
			{...props}
		/>
	);
}

function DialogDescription({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
	return (
		<DialogPrimitive.Description
			id='dialog-description'
			data-slot='dialog-description'
			className={cn('text-muted-foreground text-sm', className)}
			{...props}
		/>
	);
}

export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
	DialogLazyContent,
};
