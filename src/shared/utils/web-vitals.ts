import type { Metric } from 'web-vitals';

type TPerformanceBudget = {
	LCP: number;
	TTI: number;
	FCP: number;
	CLS: number;
	TTFB: number;
};

const PERFORMANCE_BUDGET: TPerformanceBudget = {
	LCP: 2500, // 2.5s
	TTI: 3800, // 3.8s (estimated from TTI)
	FCP: 1800, // 1.8s
	CLS: 0.1, // 0.1 units
	TTFB: 600, // 600ms
};

function checkBudgetCompliance(metric: Metric): boolean {
	const budget = PERFORMANCE_BUDGET[metric.name as keyof TPerformanceBudget];
	if (!budget) return true;

	return metric.value <= budget;
}

function sendToAnalytics(metric: Metric) {
	// In production, send to your analytics service
	if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
		// Example: Google Analytics 4
		if (typeof (window as any).gtag !== 'undefined') {
			(window as any).gtag('event', metric.name, {
				custom_parameter_1: Math.round(metric.value),
				custom_parameter_2: metric.rating,
				custom_parameter_3: checkBudgetCompliance(metric) ? 'within_budget' : 'over_budget',
			});
		}

		// Console log for debugging (can be removed in prod)
		logWebVital(metric);
	}
}

export function reportWebVitals(onPerfEntry?: (metric: Metric) => void) {
	const handleMetric = (metric: Metric) => {
		// Log the metric
		logWebVital(metric);

		// Send to analytics
		sendToAnalytics(metric);

		// Call custom callback if provided
		if (onPerfEntry && typeof onPerfEntry === 'function') {
			onPerfEntry(metric);
		}
	};

	if (typeof window !== 'undefined') {
		import('web-vitals')
			.then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
				onCLS(handleMetric);
				onFCP(handleMetric);
				onLCP(handleMetric);
				onTTFB(handleMetric);
				onINP(handleMetric);
			})
			.catch((error) => {
				console.warn('Failed to load web-vitals:', error);
			});
	}
}

export function logWebVital(metric: Metric) {
	const { name, value, rating } = metric;
	const withinBudget = checkBudgetCompliance(metric);
	const budgetEmoji = withinBudget ? '💚' : '💔';
	const ratingEmoji = rating === 'good' ? '✅' : rating === 'needs-improvement' ? '⚠️' : '❌';

	const budget = PERFORMANCE_BUDGET[name as keyof TPerformanceBudget];
	const budgetInfo = budget ? ` (Budget: ${budget}${name === 'CLS' ? '' : 'ms'})` : '';

	console.log(
		`${ratingEmoji} ${budgetEmoji} ${name}: ${name === 'CLS' ? value.toFixed(3) : value.toFixed(0)}${name === 'CLS' ? '' : 'ms'} (${rating})${budgetInfo}`
	);
}

// Export performance budget for use in other parts of the app
export { PERFORMANCE_BUDGET };
