'use client';

import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import type * as React from 'react';
import { cn } from 'utilities';
import { buttonVariants } from '@/shared/components/ui/button';

const overlayVariants = {
	initial: {
		opacity: 0,
		backdropFilter: 'blur(0px)',
	},
	animate: {
		opacity: 1,
		backdropFilter: 'blur(4px)',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	exit: {
		opacity: 0,
		backdropFilter: 'blur(0px)',
	},
};

const contentVariants = {
	initial: {
		opacity: 0,
		scale: 0.9,
		y: 30,
	},
	animate: {
		opacity: 1,
		scale: 1,
		y: 0,
	},
	exit: {
		opacity: 0,
		scale: 0.9,
		y: 30,
	},
};

function AlertDialog({ open, children, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
	return (
		<AlertDialogPrimitive.Root data-slot='alert-dialog' open={open} {...props}>
			<AnimatePresence mode="wait">
				{open && children}
			</AnimatePresence>
		</AlertDialogPrimitive.Root>
	);
}

function AlertDialogTrigger({
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
	return <AlertDialogPrimitive.Trigger data-slot='alert-dialog-trigger' {...props} />;
}

function AlertDialogPortal({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
	return <AlertDialogPrimitive.Portal data-slot='alert-dialog-portal' {...props} />;
}

function AlertDialogOverlay({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
	return (
		<AlertDialogPrimitive.Overlay asChild {...props}>
			<motion.div
				data-slot='alert-dialog-overlay'
				className={cn('fixed inset-0 z-50', className)}
				variants={overlayVariants}
				initial="initial"
				animate="animate"
				exit="exit"
				transition={{ duration: 0.2, ease: 'easeOut' }}
			/>
		</AlertDialogPrimitive.Overlay>
	);
}

function AlertDialogContent({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
	return (
		<AlertDialogPortal>
			<AlertDialogOverlay />
			<AlertDialogPrimitive.Content asChild {...props}>
				<motion.div
					data-slot='alert-dialog-content'
					role='alertdialog'
					aria-modal='true'
					aria-labelledby='alert-dialog-title'
					aria-describedby='alert-dialog-description'
					aria-live='polite'
					className={cn(
						'bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-[50%] -translate-y-[50%] gap-4 rounded-lg border p-6 shadow-lg sm:max-w-lg',
						className
					)}
					variants={contentVariants}
					initial="initial"
					animate="animate"
					exit="exit"
					transition={{ duration: 0.2, ease: 'easeOut' }}
				/>
			</AlertDialogPrimitive.Content>
		</AlertDialogPortal>
	);
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot='alert-dialog-header'
			className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
			{...props}
		/>
	);
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot='alert-dialog-footer'
			className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
			{...props}
		/>
	);
}

function AlertDialogTitle({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
	return (
		<AlertDialogPrimitive.Title
			id='alert-dialog-title'
			data-slot='alert-dialog-title'
			className={cn('text-lg font-semibold', className)}
			{...props}
		/>
	);
}

function AlertDialogDescription({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
	return (
		<AlertDialogPrimitive.Description
			id='alert-dialog-description'
			data-slot='alert-dialog-description'
			className={cn('text-muted-foreground text-sm', className)}
			{...props}
		/>
	);
}

function AlertDialogAction({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
	return (
		<AlertDialogPrimitive.Action 
			className={cn(buttonVariants(), className)} 
			aria-label={props['aria-label'] || 'Confirm action'}
			{...props} 
		/>
	);
}

function AlertDialogCancel({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
	return (
		<AlertDialogPrimitive.Cancel
			className={cn(buttonVariants({ variant: 'outline' }), className)}
			aria-label={props['aria-label'] || 'Cancel action'}
			{...props}
		/>
	);
}

export {
	AlertDialog,
	AlertDialogPortal,
	AlertDialogOverlay,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogAction,
	AlertDialogCancel,
};
