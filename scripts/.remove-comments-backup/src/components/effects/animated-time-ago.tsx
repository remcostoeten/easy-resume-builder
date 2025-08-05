'use client';

import NumberFlow, { useCanAnimate } from '@number-flow/react';
import React from 'react';
import { cn } from '@/shared/utilities/cn';

type TProps = {
	seconds: number;
	className?: string;
};

export function AnimatedTimeAgo({ seconds, className = '' }: TProps) {
	const canAnimate = useCanAnimate();

	function getTimeUnit(seconds: number) {
		if (seconds < 60) return { value: seconds, unit: 's' };
		if (seconds < 3600) return { value: Math.floor(seconds / 60), unit: 'm' };
		if (seconds < 86400) return { value: Math.floor(seconds / 3600), unit: 'h' };
		return { value: Math.floor(seconds / 86400), unit: 'd' };
	}

	const { value, unit } = getTimeUnit(seconds);

	return (
		<span className={cn('flex items-center gap-0.5', className)}>
			<NumberFlow
				value={value}
				className='font-mono font-medium'
				format={{
					minimumIntegerDigits: 1,
					maximumFractionDigits: 0,
				}}
			/>
			<span>{unit} ago</span>
		</span>
	);
}
