'use client';

import { useEffect, useState } from 'react';

type TProps = {
	children: React.ReactNode;
	fallback?: React.ReactNode;
};

export function ClientOnly({ children, fallback }: TProps) {
	const [hasMounted, setHasMounted] = useState(false);

	useEffect(function setMountedFlag() {
		setHasMounted(true);
	}, []);

	if (!hasMounted) {
		return fallback ? <>{fallback}</> : null;
	}

	return <>{children}</>;
}
