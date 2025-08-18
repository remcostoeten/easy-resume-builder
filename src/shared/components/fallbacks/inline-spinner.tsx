import type { ReactNode } from 'react';

type TProps = {
	className?: string;
	children?: ReactNode;
};

export function InlineSpinner({ className, children }: TProps) {
	return (
		<span className={`inline-flex items-center gap-2 ${className ?? ''}`}>
			<span
				className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent'
				aria-hidden='true'
			/>
			{children ? <span className='text-sm text-muted-foreground'>{children}</span> : null}
		</span>
	);
}
