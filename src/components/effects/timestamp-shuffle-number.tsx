'use client';

import NumberFlow, { useCanAnimate } from '@number-flow/react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

import { cn } from '@/shared/utilities/cn';

type TProps = {
	value: number;
	diff: number;
	className?: string;
};

const MotionNumberFlow = motion.create(NumberFlow);
const _MotionClock = motion.create(Clock);

export function TimestampShuffleNumber({ value, diff, className = '' }: TProps) {
	const canAnimate = useCanAnimate();

	return (
		<span className={cn('flex items-center gap-2', className)}>
			<NumberFlow
				value={value}
				className='text-lg font-mono text-gray-700 font-semibold'
				format={{
					minimumIntegerDigits: 1,
					maximumFractionDigits: 0,
				}}
			/>
			<span className='text-sm text-gray-500'>s</span>
			{diff !== 0 && (
				<motion.span
					className={cn(
						diff > 0 ? 'bg-green-500/20 text-green-700' : 'bg-red-500/20 text-red-700',
						'inline-flex items-center px-2 py-1 text-sm rounded-full transition-colors duration-300'
					)}
					layout={canAnimate}
					transition={{ layout: { duration: 0.5, type: 'spring', bounce: 0.2 } }}
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.8, opacity: 0 }}
				>
					<span className='mr-1'>{diff > 0 ? '+' : '-'}</span>
					<MotionNumberFlow
						value={Math.abs(diff)}
						className='font-bold'
						format={{
							signDisplay: 'never',
							minimumIntegerDigits: 1,
							maximumFractionDigits: 0,
						}}
						layout={canAnimate}
						layoutRoot={canAnimate}
					/>
				</motion.span>
			)}
		</span>
	);
}
