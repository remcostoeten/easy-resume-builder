import { getRecentActivity } from '@/features/dashboard/server/actions/recent-activity-actions';
import { AnimatedActivityCount } from './animated-activity-count';

type TProps = {
	locale?: string;
};

type TActivityType = 'resume_edit' | 'sign_in' | 'resume_create';

export async function RecentActivity({ locale = 'en-US' }: TProps) {
	const activities = await getRecentActivity();

	function getActivityIcon(type: TActivityType, providedIcon?: string) {
		// Use the icon from the database if available, otherwise fallback to type-based icons
		if (providedIcon) return providedIcon;

		switch (type) {
			case 'resume_edit':
				return '✏️';
			case 'resume_create':
				return '📄';
			case 'sign_in':
				return '🔐';
			default:
				return '📋';
		}
	}

	function formatTimestamp(timestamp: Date | string, locale: string) {
		const dateObj = new Date(timestamp);
		const formatter = new Intl.DateTimeFormat(locale, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
		return formatter.format(dateObj);
	}

	function getRelativeTimeString(timestamp: Date | string, locale: string) {
		const dateObj = new Date(timestamp);
		const now = new Date();
		const diffInMs = now.getTime() - dateObj.getTime();
		const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
		const diffInDays = Math.floor(diffInHours / 24);

		if (diffInHours < 1) {
			return 'Just now';
		} else if (diffInHours < 24) {
			const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
			return formatter.format(-diffInHours, 'hour');
		} else if (diffInDays < 7) {
			const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
			return formatter.format(-diffInDays, 'day');
		} else {
			return formatTimestamp(dateObj, locale);
		}
	}

	return (
		<section className='space-y-6' aria-labelledby='recent-activity-heading'>
			<div className='flex items-center justify-between mb-4'>
				<h2 id='recent-activity-heading' className='text-xl font-semibold'>
					Recent Activity
				</h2>
				<AnimatedActivityCount count={activities.length} />
			</div>
			<div className='bg-card rounded-lg border'>
				<div className='p-6'>
					{activities.length === 0 ? (
						<p className='text-muted-foreground text-center py-8'>No recent activity</p>
					) : (
						<ol className='space-y-4' aria-label='Recent activity timeline'>
							{activities.map((activity) => {
								// Ensure timestamp is a Date object with defensive handling
								const timestamp = new Date(activity.timestamp);
								
								// Skip this activity if timestamp is invalid
								if (isNaN(timestamp.getTime())) {
									console.warn('Invalid timestamp for activity:', activity.id, activity.timestamp);
									return null;
								}
								
								return (
									<li
										key={activity.id}
										className='flex items-start space-x-4 p-4 bg-background rounded-lg border hover:bg-muted/50 transition-colors'
									>
										<div
											className='text-xl flex-shrink-0'
											role='img'
											aria-label={`${activity.type} activity`}
										>
											{getActivityIcon(activity.type, activity.icon)}
										</div>
										<article className='flex-1 min-w-0'>
											<p className='text-sm'>
												<span className='font-medium'>
													{activity.description}
												</span>{' '}
												<span className='text-muted-foreground truncate'>
													{activity.title}
												</span>
											</p>
											<time
												className='text-xs text-muted-foreground mt-1 block'
												dateTime={timestamp.toISOString()}
												title={formatTimestamp(timestamp, locale)}
											>
												{getRelativeTimeString(timestamp, locale)}
											</time>
										</article>
									</li>
								);
							}).filter(Boolean)}
						</ol>
					)}
				</div>
			</div>
		</section>
	);
}
