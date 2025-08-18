'use client';

import { cn } from '@/shared/utilities/cn';

type TProps = {
	className?: string;
	lines?: number;
	showHeader?: boolean;
	variant?: 'form' | 'card' | 'list' | 'preview';
};

export function LoadingSkeleton({
	className,
	lines = 3,
	showHeader = true,
	variant = 'form',
}: TProps) {
	function renderFormSkeleton() {
		return (
			<div className={cn('space-y-4 p-6', className)}>
				{showHeader && (
					<div className='space-y-2'>
						<div className='h-6 bg-muted rounded w-1/3 animate-pulse' />
						<div className='h-4 bg-muted rounded w-2/3 animate-pulse' />
					</div>
				)}
				<div className='space-y-3'>
					{Array.from({ length: lines }).map((_, i) => (
						<div key={i} className='space-y-2'>
							<div className='h-4 bg-muted rounded w-1/4 animate-pulse' />
							<div className='h-10 bg-muted rounded animate-pulse' />
						</div>
					))}
				</div>
			</div>
		);
	}

	function renderCardSkeleton() {
		return (
			<div className={cn('space-y-4 p-6', className)}>
				{Array.from({ length: lines }).map((_, i) => (
					<div key={i} className='border rounded-lg p-4 space-y-3'>
						<div className='h-5 bg-muted rounded w-1/3 animate-pulse' />
						<div className='space-y-2'>
							<div className='h-4 bg-muted rounded animate-pulse' />
							<div className='h-4 bg-muted rounded w-4/5 animate-pulse' />
						</div>
					</div>
				))}
			</div>
		);
	}

	function renderListSkeleton() {
		return (
			<div className={cn('space-y-2 p-6', className)}>
				{Array.from({ length: lines }).map((_, i) => (
					<div key={i} className='flex items-center space-x-3 p-2'>
						<div className='w-6 h-6 bg-muted rounded animate-pulse' />
						<div className='flex-1 space-y-1'>
							<div className='h-4 bg-muted rounded w-3/4 animate-pulse' />
							<div className='h-3 bg-muted rounded w-1/2 animate-pulse' />
						</div>
					</div>
				))}
			</div>
		);
	}

	function renderPreviewSkeleton() {
		return (
			<div className={cn('space-y-6 p-8', className)}>
				<div className='space-y-2'>
					<div className='h-8 bg-muted rounded w-1/2 animate-pulse' />
					<div className='h-4 bg-muted rounded w-3/4 animate-pulse' />
				</div>
				{Array.from({ length: lines }).map((_, i) => (
					<div key={i} className='space-y-2'>
						<div className='h-5 bg-muted rounded w-1/4 animate-pulse' />
						<div className='space-y-1'>
							<div className='h-4 bg-muted rounded animate-pulse' />
							<div className='h-4 bg-muted rounded w-5/6 animate-pulse' />
							<div className='h-4 bg-muted rounded w-3/4 animate-pulse' />
						</div>
					</div>
				))}
			</div>
		);
	}

	switch (variant) {
		case 'card':
			return renderCardSkeleton();
		case 'list':
			return renderListSkeleton();
		case 'preview':
			return renderPreviewSkeleton();
		default:
			return renderFormSkeleton();
	}
}
