type TProps = {
	lines?: number;
	className?: string;
};

export function CardSkeleton({ lines = 3, className }: TProps) {
	const placeholders = Array.from({ length: lines });
	return (
		<div className={`rounded-md border p-4 ${className ?? ''}`.trim()}>
			<div className='h-4 w-1/3 animate-pulse rounded bg-muted mb-3' />
			<div className='space-y-2'>
				{placeholders.map(function mapLine(_, i) {
					const width = i % 3 === 0 ? 'w-5/6' : i % 3 === 1 ? 'w-2/3' : 'w-3/4';
					return (
						<div key={i} className={`h-3 ${width} animate-pulse rounded bg-muted`} />
					);
				})}
			</div>
		</div>
	);
}
