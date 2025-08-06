import { Suspense } from 'react';
import { WithErrorBoundary } from './with-error-boundary';

type TProps = {
	fallback: React.ReactNode;
	errorTitle?: string;
	errorDescription?: string;
	children: React.ReactNode;
};

export function AsyncSection({ fallback, errorTitle, errorDescription, children }: TProps) {
	return (
		<WithErrorBoundary title={errorTitle} description={errorDescription}>
			<Suspense fallback={fallback}>{children}</Suspense>
		</WithErrorBoundary>
	);
}
