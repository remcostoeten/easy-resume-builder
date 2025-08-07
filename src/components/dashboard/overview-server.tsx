import { headers } from 'next/headers';
import { auth } from '@/features/auth/server/auth';
import { getDashboardOverview } from '@/features/dashboard/server/actions/overview-actions';
import { Overview } from './overview';

export async function OverviewServer() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		throw new Error('Unauthorized: User session not found');
	}

	const overviewData = await getDashboardOverview(session.user.id);

	return <Overview {...overviewData} />;
}
