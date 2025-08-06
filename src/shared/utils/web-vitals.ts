import type { Metric } from 'web-vitals';

export function reportWebVitals(onPerfEntry: (metric: Metric) => void) {
	if (onPerfEntry && typeof onPerfEntry === 'function') {
		import('web-vitals')
			.then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
				onCLS(onPerfEntry);
				onFCP(onPerfEntry);
				onLCP(onPerfEntry);
				onTTFB(onPerfEntry);
				onINP(onPerfEntry);
			})
			.catch(() => {
				// Silently fail if web-vitals is not available
			});
	}
}

export function logWebVital(metric: Metric) {
	const { name, value, rating } = metric;
	const emoji = rating === 'good' ? '✅' : rating === 'needs-improvement' ? '⚠️' : '❌';
	console.log(`${emoji} ${name}: ${value.toFixed(2)}ms (${rating})`);
}
