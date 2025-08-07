'use client';

import { Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from 'utilities';
import { Button } from '@/shared/components/ui/button';
export type TFloatingActionButtonProps = {
	readonly onClick: () => void;
	readonly icon?: ReactNode;
	readonly label?: string;
	readonly className?: string;
	readonly variant?: 'primary' | 'secondary';
};

export function FloatingActionButton({
	onClick,
	icon = <Plus className='h-5 w-5' />,
	label,
	className,
	variant = 'primary',
}: TFloatingActionButtonProps) {
	return (
		<div className={cn('fixed bottom-8 right-8 z-50 floating-button', className)}>
			<Button
				onClick={onClick}
				size='lg'
				className={cn(
					'h-14 w-14 rounded-full shadow-2xl transition-all duration-300',
					variant === 'primary' &&
						'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
					variant === 'secondary' &&
						'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700',
					label && 'w-auto px-6 gap-2'
				)}
			>
			{icon}
			{label && <span className='font-medium'>{label}</span>}
		</Button>
	</div>
	);
}
