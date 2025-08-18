'use client';

import type { ErrorInfo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { SectionErrorBoundary } from './section-error-boundary';

type TErrorBoundaryWrapperProps = {
	title?: string;
	description?: string;
	children: React.ReactNode;
};

export function WithErrorBoundary({ title, description, children }: TErrorBoundaryWrapperProps) {
	function handleError(error: Error, errorInfo: ErrorInfo) {
		console.error('Component error caught by boundary:', error, errorInfo);
	}

	return (
		<ErrorBoundary
			FallbackComponent={({ error, resetErrorBoundary }) => (
				<SectionErrorBoundary
					error={error}
					reset={resetErrorBoundary}
					title={title}
					description={description}
				/>
			)}
			onError={handleError}
		>
			{children}
		</ErrorBoundary>
	);
}

export function withErrorBoundary<TProps extends object>(
	Component: React.ComponentType<TProps>,
	title?: string,
	description?: string
) {
	return function WrappedComponent(props: TProps) {
		return (
			<WithErrorBoundary title={title} description={description}>
				<Component {...props} />
			</WithErrorBoundary>
		);
	};
}
