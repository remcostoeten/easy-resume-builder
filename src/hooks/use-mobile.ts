'use client';

import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 1024;

export function useIsMobile() {
	const [isMobile, setIsMobile] = useState<boolean>(false);

	useEffect(() => {
		function handleResize() {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		}

		handleResize();

		window.addEventListener('resize', handleResize);

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return isMobile;
}
