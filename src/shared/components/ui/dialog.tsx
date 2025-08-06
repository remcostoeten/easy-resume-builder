'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { FocusScope } from '@radix-ui/react-focus-scope';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import type * as React from 'react';
import { useRef } from 'react';

import { cn } from 'utilities';

function Dialog({ open, children, ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
	return (
		<DialogPrimitive.Root data-slot='dialog' open={open} {...props}>
			<AnimatePresence mode="wait">
				{open && children}
			</AnimatePresence>
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
			<motion.div
				data-slot='dialog-overlay'
				className={cn('fixed inset-0 z-50', className)}
				initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
				animate={{ opacity: 1, backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
				exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
				transition={{ duration: 0.2, ease: 'easeOut' }}
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
				<motion.div
					data-slot='dialog-content'
					role='dialog'
					aria-modal='true'
					aria-labelledby='dialog-title'
					aria-describedby='dialog-description'
					aria-live='polite'
					className={cn(
						'bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-[50%] -translate-y-[50%] gap-4 rounded-lg border p-6 shadow-lg sm:max-w-lg',
						className
					)}
					initial={{ opacity: 0, scale: 0.9, y: 30 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.9, y: 30 }}
					transition={{ duration: 0.2, ease: 'easeOut' }}
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
								className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
							>
								<XIcon />
								<span className='sr-only'>Close</span>
							</DialogPrimitive.Close>
						)}
					</FocusScope>
				</motion.div>
			</DialogPrimitive.Content>
		</DialogPortal>
	);
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
};
