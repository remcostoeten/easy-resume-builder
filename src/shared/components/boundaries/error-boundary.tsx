'use client';

import type { ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

type TProps = {
	children: ReactNode;
};

function Fallback() {
	return (
		<div className='p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded'>
			Something went wrong while loading this section.
		</div>
	);
}

export function ErrorBoundary({ children }: TProps) {
	return <ReactErrorBoundary FallbackComponent={Fallback}>{children}</ReactErrorBoundary>;
}
