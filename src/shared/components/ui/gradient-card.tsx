'use client';

import type { ReactNode } from 'react';
import { cn } from 'utilities';
export type TGradientCardProps = {
	readonly children: ReactNode;
	readonly className?: string;
	readonly gradient?: 'blue' | 'purple' | 'green' | 'orange';
	readonly hover?: boolean;
};

export function GradientCard({
	children,
	className,
	gradient = 'blue',
	hover = true,
}: TGradientCardProps) {
	const gradients = {
		blue: 'from-blue-500/10 via-cyan-500/5 to-blue-600/10',
		purple: 'from-purple-500/10 via-pink-500/5 to-purple-600/10',
		green: 'from-green-500/10 via-emerald-500/5 to-green-600/10',
		orange: 'from-orange-400/10 via-amber-400/5 to-rose-500/10',
	};

	return (
		<div
			className={cn(
				'relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br backdrop-blur-sm',
				gradients[gradient],
				hover &&
					'gradient-card transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10',
				className
			)}
		>
			<div className='absolute inset-0 bg-gradient-to-br from-white/5 to-transparent' />
			<div className='relative'>{children}</div>
		</div>
	);
}
