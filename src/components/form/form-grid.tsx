import type { ReactNode } from 'react';
import { cn } from 'utilities';
export type TFormGridProps = {
	readonly children: ReactNode;
	readonly columns?: 1 | 2 | 3;
	readonly className?: string;
};

export function FormGrid({ children, columns = 2, className }: TFormGridProps) {
	return (
		<div
			className={cn(
				'grid gap-4',
				columns === 1 && 'grid-cols-1',
				columns === 2 && 'grid-cols-1 md:grid-cols-2',
				columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
				className
			)}
		>
			{children}
		</div>
	);
}
