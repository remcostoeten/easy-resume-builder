'use client';

import { ErrorBoundary } from '@/shared/components/error-boundary';

type TProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export default function ResumeError({ error, reset }: TProps) {
	return <ErrorBoundary error={error} reset={reset} />;
}
