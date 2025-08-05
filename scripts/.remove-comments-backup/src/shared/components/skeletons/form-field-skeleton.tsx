'use client';

import { cn } from '@/shared/utilities';
import { SkeletonInput, SkeletonText, SkeletonTextarea } from './skeleton-factory';

type TProps = {
	readonly type?: 'text' | 'email' | 'tel' | 'url' | 'textarea';
	readonly required?: boolean;
	readonly className?: string;
	readonly labelWidth?: 'short' | 'medium' | 'long';
};

export function FormFieldSkeleton({
	type = 'text',
	required = false,
	className,
	labelWidth = 'medium',
}: TProps) {
	const labelWidthClasses = {
		short: 'w-16',
		medium: 'w-24',
		long: 'w-32',
	};

	return (
		<div className={cn('space-y-2', className)}>
			<div className='flex items-center gap-1'>
				<SkeletonText className={cn('h-4', labelWidthClasses[labelWidth])} />
				{required && <SkeletonText className='h-3 w-2' />}
			</div>

			{type === 'textarea' ? <SkeletonTextarea /> : <SkeletonInput />}
		</div>
	);
}
