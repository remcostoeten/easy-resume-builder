'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Button, type buttonVariants } from '@/shared/components/ui/button';
import { cn } from '@/utils/cn';

const LoadingButtonVariants = cva('flex items-center justify-center', {
	variants: {
		loading: {
			true: 'cursor-not-allowed',
		},
	},
	defaultVariants: {
		loading: false,
	},
});

export interface LoadingButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	loading?: boolean;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
	({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button';
		return (
			<Button
				className={cn(LoadingButtonVariants({ loading }), className)}
				ref={ref}
				disabled={loading}
				variant={variant}
				size={size}
				{...props}
			>
				{loading ? (
					<div className='flex items-center justify-center'>
						<div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full' />
					</div>
				) : (
					children
				)}
			</Button>
		);
	}
);

LoadingButton.displayName = 'LoadingButton';

export { LoadingButton, LoadingButtonVariants };
