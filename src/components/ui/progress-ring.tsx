'use client';

import { motion } from 'framer-motion';
import { cn } from 'utilities';
export type TProgressRingProps = {
	readonly progress: number;
	readonly size?: number;
	readonly strokeWidth?: number;
	readonly className?: string;
	readonly showPercentage?: boolean;
};

export function ProgressRing({
	progress,
	size = 120,
	strokeWidth = 8,
	className,
	showPercentage = true,
}: TProgressRingProps) {
	const radius = (size - strokeWidth) / 2;
	const circumference = radius * 2 * Math.PI;
	const strokeDasharray = `${circumference} ${circumference}`;
	const strokeDashoffset = circumference - (progress / 100) * circumference;

	return (
		<div className={cn('relative', className)} style={{ width: size, height: size }}>
			<svg className='transform -rotate-90' width={size} height={size}>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke='currentColor'
					strokeWidth={strokeWidth}
					fill='transparent'
					className='text-muted/20'
				/>
				<motion.circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke='url(#gradient)'
					strokeWidth={strokeWidth}
					fill='transparent'
					strokeDasharray={strokeDasharray}
					strokeDashoffset={strokeDashoffset}
					strokeLinecap='round'
					initial={{ strokeDashoffset: circumference }}
					animate={{ strokeDashoffset }}
					transition={{ duration: 1, ease: 'easeInOut' }}
				/>
				<defs>
					<linearGradient id='gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
						<stop offset='0%' stopColor='#3B82F6' />
						<stop offset='100%' stopColor='#8B5CF6' />
					</linearGradient>
				</defs>
			</svg>
			{showPercentage && (
				<div className='absolute inset-0 flex items-center justify-center'>
					<motion.span
						className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.5 }}
					>
						{Math.round(progress)}%
					</motion.span>
				</div>
			)}
		</div>
	);
}
