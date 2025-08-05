'use client';

import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { cn } from '@/shared/utilities';
import { SkeletonTitle, SkeletonIcon, SkeletonBadge } from './skeleton-factory';

type TProps = {
	readonly children: ReactNode;
	readonly className?: string;
	readonly isRequired?: boolean;
	readonly titleWidth?: 'short' | 'medium' | 'long';
};

export function FormSectionSkeleton({ 
	children, 
	className, 
	isRequired = false,
	titleWidth = 'medium'
}: TProps) {
	const titleWidthClasses = {
		short: 'w-32',
		medium: 'w-48',
		long: 'w-64'
	};

	return (
		<Card className={cn('w-full', className)}>
			<CardHeader className='pb-4'>
				<div className='flex items-center gap-2'>
					<SkeletonIcon />
					<SkeletonTitle className={cn('h-6', titleWidthClasses[titleWidth])} />
					{isRequired && (
						<SkeletonBadge className='h-6 w-16' />
					)}
				</div>
			</CardHeader>
			<CardContent className='space-y-4'>
				{children}
			</CardContent>
		</Card>
	);
}
