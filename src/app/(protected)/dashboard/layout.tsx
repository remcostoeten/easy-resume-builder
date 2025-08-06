'use client';

import type React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { useRequireAuth } from '@/features/auth/hooks/hooks';
import { DashboardSkeleton } from '@/features/dashboard/components/dashboard-skeleton';
import { WithErrorBoundary } from '@/shared/components/with-error-boundary';

type TProps = {
	children: React.ReactNode;
};

export default function DashboardLayoutPage({ children }: TProps) {
	const { session, isLoading } = useRequireAuth();

	if (isLoading) {
		return <DashboardSkeleton />;
	}

	if (!session) {
		return null; // useRequireAuth handles the redirect
	}

	return (
		<WithErrorBoundary
			title='Dashboard Error'
			description="The dashboard encountered an error and couldn't be loaded."
		>
			<DashboardLayout>{children}</DashboardLayout>
		</WithErrorBoundary>
	);
}
