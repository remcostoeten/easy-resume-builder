'use client';

import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';
import { reportWebVitals } from '@/shared/utilities/performance';

function trackWebVitals() {
	if (typeof window === 'undefined') return;

	// Track Core Web Vitals with the new API
	onCLS(reportWebVitals);
	onFCP(reportWebVitals);
	onLCP(reportWebVitals);
	onTTFB(reportWebVitals);
	onINP(reportWebVitals); // New metric replacing FID
}

// Initialize tracking on load
if (typeof window !== 'undefined') {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', trackWebVitals);
	} else {
		trackWebVitals();
	}
}

export { trackWebVitals };
