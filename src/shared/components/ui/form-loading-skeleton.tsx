'use client';

import { Card, CardContent, CardHeader } from './card';
import { Skeleton } from './skeleton';

type TProps = {
	title?: string;
	fieldCount?: number;
	showHeader?: boolean;
	className?: string;
};

export function FormLoadingSkeleton({
	title,
	fieldCount = 4,
	showHeader = true,
	className,
}: TProps) {
	return (
		<Card className={`w-full max-w-sm mx-auto ${className || ''}`}>
			{showHeader && (
				<CardHeader>
					<Skeleton className='h-6 w-32' />
					{title && <Skeleton className='h-4 w-48 mt-2' />}
				</CardHeader>
			)}
			<CardContent className='space-y-4'>
				{Array.from({ length: fieldCount }).map((_, index) => (
					<div key={index} className='space-y-2'>
						<Skeleton className='h-4 w-24' />
						<Skeleton className='h-10 w-full' />
					</div>
				))}
				<div className='pt-4'>
					<Skeleton className='h-10 w-full' />
				</div>
			</CardContent>
		</Card>
	);
}
