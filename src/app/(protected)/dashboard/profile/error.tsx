'use client';

import { ErrorBoundary } from '@/shared/system';


type TProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export default function ProfileError({ error, reset }: TProps) {
	return <ErrorBoundary error={error} reset={reset} />;
}
