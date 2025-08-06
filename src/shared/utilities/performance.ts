'use client';

function measurePerformance(name: string, fn: () => void) {
	if (typeof window === 'undefined') return;

	const start = performance.now();
	fn();
	const end = performance.now();

	console.log(`⚡ ${name}: ${(end - start).toFixed(2)}ms`);
}

function measureAsyncPerformance<T>(name: string, fn: () => Promise<T>): Promise<T> {
	if (typeof window === 'undefined') return fn();

	const start = performance.now();
	return fn().finally(function() {
		const end = performance.now();
		console.log(`⚡ ${name}: ${(end - start).toFixed(2)}ms`);
	});
}

function markComponentLoad(componentName: string) {
	if (typeof window === 'undefined') return;

	performance.mark(`${componentName}-load`);
	console.log(`📦 Component loaded: ${componentName}`);
}

function measureComponentRender(componentName: string) {
	if (typeof window === 'undefined') return function() {};

	const start = performance.now();

	return function() {
		const end = performance.now();
		console.log(`🎨 ${componentName} render: ${(end - start).toFixed(2)}ms`);
	};
}

function reportWebVitals(metric: any) {
	// Only log in development
	if (process.env.NODE_ENV === 'development') {
		console.log(`📊 ${metric.name}: ${metric.value}${metric.unit || ''}`);
	}
}

function logBundleSize() {
	if (typeof window === 'undefined') return;

	// Use Navigation API to get resource timing
	const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

	if (navigation) {
		const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
		const domContentLoaded =
			navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;

		console.log(`📈 Page load time: ${loadTime.toFixed(2)}ms`);
		console.log(`📈 DOM content loaded: ${domContentLoaded.toFixed(2)}ms`);
	}
}

export {
	measurePerformance,
	measureAsyncPerformance,
	markComponentLoad,
	measureComponentRender,
	reportWebVitals,
	logBundleSize,
};
