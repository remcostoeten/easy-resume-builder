'use client';

import { Card, CardContent } from '@/shared/components/ui/card';
import { FormSectionSkeleton } from './form-section-skeleton';
import { SkeletonButton, SkeletonIcon, SkeletonText, SkeletonTitle } from './skeleton-factory';

type TProps = {
	readonly cardCount?: number;
	readonly showAddButton?: boolean;
	readonly showEmptyState?: boolean;
};

export function EducationSkeleton({
	cardCount = 2,
	showAddButton = true,
	showEmptyState = false,
}: TProps) {
	if (showEmptyState) {
		return (
			<FormSectionSkeleton titleWidth='medium'>
				<div className='flex flex-col items-center justify-center py-12 space-y-4'>
					<SkeletonIcon className='h-16 w-16 rounded-full' />
					<SkeletonTitle className='w-48 h-6' />
					<div className='space-y-2 text-center'>
						<SkeletonText className='w-96 h-4' />
						<SkeletonText className='w-80 h-4' />
					</div>
					<SkeletonButton className='w-36 h-10 mt-4' />
				</div>
			</FormSectionSkeleton>
		);
	}

	return (
		<FormSectionSkeleton titleWidth='medium'>
			<div className='space-y-4'>
				{Array.from({ length: cardCount }).map((_, index) => (
					<Card key={index} className='hover:shadow-md transition-shadow'>
						<CardContent className='p-4 space-y-2'>
							<SkeletonTitle className='w-64 h-5' />
							<SkeletonText className='w-56 h-4' />
							<div className='flex items-center gap-2'>
								<SkeletonText className='w-24 h-3' />
								<SkeletonText className='w-2 h-3' />
								<SkeletonText className='w-20 h-3' />
							</div>
						</CardContent>
					</Card>
				))}

				{showAddButton && (
					<SkeletonButton className='w-full h-12 flex items-center justify-center gap-2 bg-transparent border border-dashed' />
				)}
			</div>
		</FormSectionSkeleton>
	);
}
