'use client';

import NumberFlow from '@number-flow/react';

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
};

export function AnimatedNumber({ value, className, format }: TProps) {
	return (
		<span className={`inline-block ${className || ''}`}>
			<NumberFlow value={value} format={format} />
		</span>
	);
}
