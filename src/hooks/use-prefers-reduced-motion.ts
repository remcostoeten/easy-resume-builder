'use client';

import { useEffect, useState } from 'react';

function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState(false);

	function handleChange(event: MediaQueryListEvent) {
		setMatches(event.matches);
	}

	useEffect(function setupMediaQuery() {
		const mediaQuery = window.matchMedia(query);
		setMatches(mediaQuery.matches);

		mediaQuery.addEventListener('change', handleChange);
		
		function cleanup() {
			mediaQuery.removeEventListener('change', handleChange);
		}
		
		return cleanup;
	}, [query]);

	return matches;
}

export function usePrefersReducedMotion(): boolean {
	return useMediaQuery('(prefers-reduced-motion: reduce)');
}
