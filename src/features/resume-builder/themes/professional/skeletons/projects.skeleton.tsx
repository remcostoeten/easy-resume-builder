'use client';

type TProps = {
	className?: string;
};

export function ProfessionalProjectsSkeleton({ className }: TProps) {
	return (
		<div className={className ?? ''}>
			<div className='max-w-4xl mx-auto p-8 space-y-6 animate-pulse'>
				<div className='h-10 w-60 bg-muted rounded' />
				<div className='h-40 bg-muted rounded' />
				<div className='h-24 bg-muted rounded' />
			</div>
		</div>
	);
}
