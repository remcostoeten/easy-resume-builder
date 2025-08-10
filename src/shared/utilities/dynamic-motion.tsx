'use client';

import type { ReactElement, ReactNode } from 'react';
import { useEffect, useState } from 'react';

type TProps = {
	readonly children: (mod: typeof import('framer-motion')) => ReactElement;
	readonly fallback?: ReactElement | null;
};

function importMotion() {
	return import('framer-motion');
}

function Motion({ children, fallback = null }: TProps): ReactElement | null {
	const [mod, setMod] = useState<typeof import('framer-motion') | null>(null);

	useEffect(function load() {
		let mounted = true;
		importMotion()
			.then(function onOk(m) {
				if (mounted) setMod(m);
			})
			.catch(function onErr() {
				if (mounted) setMod(null);
			});
		return function cleanup() {
			mounted = false;
		};
	}, []);

	if (!mod) return fallback;
	return children(mod);
}

function AnimatePresenceLazy({
	children,
	initial,
	mode,
}: {
	readonly children: ReactNode;
	readonly initial?: boolean;
	readonly mode?: 'sync' | 'popLayout' | 'wait';
}): ReactElement {
	const [AP, setAP] = useState<null | ((props: any) => ReactElement)>(null);

	useEffect(function load() {
		let mounted = true;
		importMotion()
			.then(function onOk(m) {
				if (mounted) setAP(() => m.AnimatePresence as any);
			})
			.catch(function onErr() {
				if (mounted) setAP(null);
			});
		return function cleanup() {
			mounted = false;
		};
	}, []);

	if (!AP) return <>{children}</>;
	const Cmp = AP as any;
	return (
		<Cmp initial={initial} mode={mode}>
			{children}
		</Cmp>
	);
}

export { importMotion, Motion, AnimatePresenceLazy };
