'use client';

import NumberFlow from '@number-flow/react';
import { memo, useMemo } from 'react';

type TProps = {
	value: number;
	className?: string;
	format?: {
		minimumIntegerDigits?: number;
		maximumFractionDigits?: number;
		notation?: 'compact' | 'standard';
		signDisplay?: 'auto' | 'never' | 'always' | 'exceptZero';
		style?: 'decimal' | 'currency' | 'percent';
	};
	delay?: number;
	duration?: number;
};

function AnimatedNumber({ value, className, format, delay = 0, duration = 750 }: TProps) {
	// Memoize the format object to prevent unnecessary re-renders
	const memoizedFormat = useMemo(() => format, [format]);

	const transformTiming = useMemo(
		() => ({
			duration,
			delay,
			easing: 'ease-out' as const,
		}),
		[duration, delay]
	);

	return (
		<span className={`inline-block ${className || ''}`}>
			<NumberFlow
				value={value}
				format={memoizedFormat}
				transformTiming={transformTiming}
				spinTiming={transformTiming}
				opacityTiming={{ ...transformTiming, duration: duration * 0.5 }}
			/>
		</span>
	);
}

// Memoize the component to prevent unnecessary re-renders
export default memo(AnimatedNumber);
