'use client';

function preloadComponent(importFn: () => Promise<any>) {
	if (typeof window === 'undefined') return;

	// Use requestIdleCallback for non-critical preloading
	if ('requestIdleCallback' in window) {
		requestIdleCallback(() => {
			importFn().catch(() => {
				// Silently handle preload failures
			});
		});
	} else {
		// Fallback for browsers without requestIdleCallback
		setTimeout(() => {
			importFn().catch(() => {
				// Silently handle preload failures
			});
		}, 100);
	}
}

function preloadRoute(route: string) {
	if (typeof window === 'undefined') return;

	const link = document.createElement('link');
	link.rel = 'prefetch';
	link.href = route;
	document.head.appendChild(link);
}

function preloadCriticalResources() {
	if (typeof window === 'undefined') return;

	// Preload critical fonts
	const fonts = ['/fonts/inter-var.woff2', '/fonts/geist-sans.woff2'];

	fonts.forEach((font) => {
		const link = document.createElement('link');
		link.rel = 'preload';
		link.as = 'font';
		link.type = 'font/woff2';
		link.crossOrigin = 'anonymous';
		link.href = font;
		document.head.appendChild(link);
	});
}

function preloadModulesOnIdle() {
	if (typeof window === 'undefined') return;

	const modules = [
		// Preload heavy components when idle
		() => import('framer-motion'),
		() => import('recharts'),
	];

	if ('requestIdleCallback' in window) {
		requestIdleCallback(
			() => {
				modules.forEach((moduleImport) => {
					moduleImport().catch(() => {
						// Silently handle preload failures
					});
				});
			},
			{ timeout: 5000 }
		);
	}
}

function preloadOnHover(element: HTMLElement, importFn: () => Promise<any>) {
	if (typeof window === 'undefined') return;

	let preloaded = false;

	const preloadFn = () => {
		if (!preloaded) {
			preloaded = true;
			importFn().catch(() => {
				// Silently handle preload failures
			});
		}
	};

	element.addEventListener('mouseenter', preloadFn, { once: true, passive: true });
	element.addEventListener('focus', preloadFn, { once: true, passive: true });
}

function schedulePreload(importFn: () => Promise<any>, delay = 2000) {
	if (typeof window === 'undefined') return;

	setTimeout(() => {
		importFn().catch(() => {
			// Silently handle preload failures
		});
	}, delay);
}

export {
	preloadComponent,
	preloadRoute,
	preloadCriticalResources,
	preloadModulesOnIdle,
	preloadOnHover,
	schedulePreload,
};
