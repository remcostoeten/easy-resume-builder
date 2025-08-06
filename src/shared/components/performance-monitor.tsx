'use client';

import { useEffect } from 'react';
import { reportWebVitals } from '../utils/web-vitals';

type TProps = {
	enabled?: boolean;
};

export function PerformanceMonitor({ enabled = process.env.NODE_ENV === 'development' }: TProps) {
	useEffect(() => {
		if (!enabled) return;

		// Monitor Web Vitals
		if (typeof reportWebVitals === 'function') {
			reportWebVitals(console.log);
		}

		// Monitor dashboard-specific performance metrics
		const observer = new PerformanceObserver((list) => {
			for (const entry of list.getEntries()) {
				if (entry.name.includes('dashboard') || entry.name.includes('resume')) {
					console.log(
						`🔍 Performance: ${entry.name} took ${entry.duration.toFixed(2)}ms`
					);
				}
			}
		});

		observer.observe({ entryTypes: ['navigation', 'measure', 'resource'] });

		return () => {
			observer.disconnect();
		};
	}, [enabled]);

	// Component doesn't render anything
	return null;
}
