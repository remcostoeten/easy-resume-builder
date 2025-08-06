'use client';

import NumberFlow, { useCanAnimate } from '@number-flow/react';

import { cn } from '@/shared/utilities/cn';

type TProps = {
	seconds: number;
	className?: string;
};

export function AnimatedTimeAgo({ seconds, className = '' }: TProps) {
	const _canAnimate = useCanAnimate();

	function getTimeUnit(seconds: number) {
		if (seconds < 60) return { value: seconds, unit: 's' };
		if (seconds < 3600) return { value: Math.floor(seconds / 60), unit: 'm' };
		if (seconds < 86400) return { value: Math.floor(seconds / 3600), unit: 'h' };
		return { value: Math.floor(seconds / 86400), unit: 'd' };
	}

	const { value, unit } = getTimeUnit(seconds);

	return (
		<span className={cn('flex items-center gap-0.5', className)}>
			<span className='font-mono font-medium inline-block'>
				<NumberFlow
					value={value}
					format={{
						minimumIntegerDigits: 1,
						maximumFractionDigits: 0,
					}}
				/>
			</span>
			<span>saved {unit} ago</span>
		</span>
	);
}
