import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { getQuickStats } from '../server/actions/stats-actions';

type TProps = {
	className?: string;
};

export async function QuickStats({ className }: TProps) {
	let stats;

	try {
		stats = await getQuickStats();
	} catch (error) {
		console.error('Failed to fetch quick stats:', error);
		return (
			<div className={className}>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					<Card>
						<CardContent>
							<div className='text-center py-4'>
								<p className='text-sm text-muted-foreground'>
									Unable to load statistics
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	function formatLastEdited(date: Date | null): string {
		if (!date) return 'Never';
		return formatDistanceToNow(date, { addSuffix: true });
	}

	return (
		<div className={className}>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				<Card>
					<CardHeader>
						<CardTitle className='text-sm font-medium'>Total Resumes</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
						{stats.totalResumes}
						</div>
						<p className='text-xs text-muted-foreground'>
							Active resume{stats.totalResumes !== 1 ? 's' : ''} in your account
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className='text-sm font-medium'>Last Edited</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{formatLastEdited(stats.lastEditedDate)}
						</div>
						<p className='text-xs text-muted-foreground'>
							Most recent resume modification
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className='text-sm font-medium'>Profile Completion</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{new Intl.NumberFormat(undefined, { style: 'percent', maximumFractionDigits: 0 }).format(stats.profileCompletionPercentage)}
						</div>
						<p className='text-xs text-muted-foreground'>Resume sections completed</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
