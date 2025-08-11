type TProps = {
	className?: string;
};

export function ProfessionalEducationSkeleton({ className }: TProps) {
	return (
		<div className={className ?? ''}>
			<div className='max-w-4xl mx-auto p-8 space-y-6 animate-pulse'>
				<div className='h-10 w-64 bg-muted rounded' />
				<div className='space-y-3'>
					<div className='h-20 bg-muted rounded' />
					<div className='h-20 bg-muted rounded' />
				</div>
			</div>
		</div>
	);
}
