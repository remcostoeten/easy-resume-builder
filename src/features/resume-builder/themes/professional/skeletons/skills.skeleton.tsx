'use client';

type TProps = {
	className?: string;
};

export function ProfessionalSkillsSkeleton({ className }: TProps) {
	return (
		<div className={className ?? ''}>
			<div className='max-w-4xl mx-auto p-8 space-y-6 animate-pulse'>
				<div className='h-10 w-52 bg-muted rounded' />
				<div className='grid grid-cols-2 gap-4'>
					<div className='h-24 bg-muted rounded' />
					<div className='h-24 bg-muted rounded' />
					<div className='h-24 bg-muted rounded' />
					<div className='h-24 bg-muted rounded' />
				</div>
			</div>
		</div>
	);
}
