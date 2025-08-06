'use client';

import * as SheetPrimitive from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import type * as React from 'react';

import { cn } from 'utilities';

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
	right: {
		initial: {
			opacity: 0,
			x: '100%',
		},
		animate: {
			opacity: 1,
			x: 0,
		},
		exit: {
			opacity: 0,
			x: '100%',
		},
	},
	left: {
		initial: {
			opacity: 0,
			x: '-100%',
		},
		animate: {
			opacity: 1,
			x: 0,
		},
		exit: {
			opacity: 0,
			x: '-100%',
		},
	},
	top: {
		initial: {
			opacity: 0,
			y: '-100%',
		},
		animate: {
			opacity: 1,
			y: 0,
		},
		exit: {
			opacity: 0,
			y: '-100%',
		},
	},
	bottom: {
		initial: {
			opacity: 0,
			y: '100%',
		},
		animate: {
			opacity: 1,
			y: 0,
		},
		exit: {
			opacity: 0,
			y: '100%',
		},
	},
};

function Sheet({ open, children, ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
	return (
		<SheetPrimitive.Root data-slot='sheet' open={open} {...props}>
			<AnimatePresence mode='wait'>{open && children}</AnimatePresence>
		</SheetPrimitive.Root>
	);
}

function SheetTrigger({ ...props }: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
	return <SheetPrimitive.Trigger data-slot='sheet-trigger' {...props} />;
}

function SheetClose({ ...props }: React.ComponentProps<typeof SheetPrimitive.Close>) {
	return <SheetPrimitive.Close data-slot='sheet-close' {...props} />;
}

function SheetPortal({ ...props }: React.ComponentProps<typeof SheetPrimitive.Portal>) {
	return <SheetPrimitive.Portal data-slot='sheet-portal' {...props} />;
}

function SheetOverlay({
	className,
	...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
	return (
		<SheetPrimitive.Overlay asChild {...props}>
			<motion.div
				data-slot='sheet-overlay'
				className={cn('fixed inset-0 z-50', className)}
				variants={overlayVariants}
				initial='initial'
				animate='animate'
				exit='exit'
				transition={{ duration: 0.2, ease: 'easeOut' }}
			/>
		</SheetPrimitive.Overlay>
	);
}

function SheetContent({
	className,
	children,
	side = 'right',
	...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
	side?: 'top' | 'right' | 'bottom' | 'left';
}) {
	return (
		<SheetPortal>
			<SheetOverlay />
			<SheetPrimitive.Content asChild {...props}>
				<motion.div
					data-slot='sheet-content'
					className={cn(
						'bg-background fixed z-50 flex flex-col gap-4 shadow-lg',
						side === 'right' && 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
						side === 'left' && 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
						side === 'top' && 'inset-x-0 top-0 h-auto border-b',
						side === 'bottom' && 'inset-x-0 bottom-0 h-auto border-t',
						className
					)}
					variants={contentVariants[side]}
					initial='initial'
					animate='animate'
					exit='exit'
					transition={{ duration: 0.3, ease: 'easeInOut' }}
				>
					{children}
					<SheetPrimitive.Close className='ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none'>
						<XIcon className='size-4' />
						<span className='sr-only'>Close</span>
					</SheetPrimitive.Close>
				</motion.div>
			</SheetPrimitive.Content>
		</SheetPortal>
	);
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot='sheet-header'
			className={cn('flex flex-col gap-1.5 p-4', className)}
			{...props}
		/>
	);
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot='sheet-footer'
			className={cn('mt-auto flex flex-col gap-2 p-4', className)}
			{...props}
		/>
	);
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
	return (
		<SheetPrimitive.Title
			data-slot='sheet-title'
			className={cn('text-foreground font-semibold', className)}
			{...props}
		/>
	);
}

function SheetDescription({
	className,
	...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
	return (
		<SheetPrimitive.Description
			data-slot='sheet-description'
			className={cn('text-muted-foreground text-sm', className)}
			{...props}
		/>
	);
}

export {
	Sheet,
	SheetTrigger,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetFooter,
	SheetTitle,
	SheetDescription,
};
