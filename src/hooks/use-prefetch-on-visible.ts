import { useEffect, useRef } from 'react';

type TProps = {
	onVisible: () => void;
	rootMargin?: string;
};

export function usePrefetchOnVisible({ onVisible, rootMargin = '200px' }: TProps) {
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(
		function effect() {
			if (!ref.current) return;
			if (!('IntersectionObserver' in window)) {
				onVisible();
				return;
			}
			const observer = new IntersectionObserver(
				function onIntersect(entries) {
					entries.forEach(function each(entry) {
						if (entry.isIntersecting) {
							onVisible();
							observer.disconnect();
						}
					});
				},
				{ rootMargin }
			);

			observer.observe(ref.current);
			return function cleanup() {
				observer.disconnect();
			};
		},
		[onVisible, rootMargin]
	);

	return ref;
}
