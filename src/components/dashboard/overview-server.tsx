import { getDashboardOverview } from '@/features/dashboard/server/actions/overview-actions';
import { Overview } from './overview';

type TProps = { userId: string };

export async function OverviewServer({ userId }: TProps) {
	const overviewData = await getDashboardOverview(userId);
	return <Overview {...overviewData} />;
}
