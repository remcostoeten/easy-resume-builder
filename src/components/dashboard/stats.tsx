import { AnimatedActivityCount } from './animated-activity-count';
import { StatCard } from './stat-card';

export function Stats() {
	return (
		<div className='space-y-6'>
			<div>
				<h2 className='text-xl font-semibold mb-4'>Statistics</h2>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<StatCard
						title='Application Status'
						value={<AnimatedActivityCount count={5} />}
					/>
					<StatCard
						title='Monthly Progress'
						value={<AnimatedActivityCount count={15} />}
					/>
				</div>
			</div>
		</div>
	);
}
