import { formatDistanceToNow } from 'date-fns';
import { AnimatedActivityCount } from './animated-activity-count';
import { StatCard } from './stat-card';

type TProps = {
	totalResumes: number;
	activeApplications: number;
	interviewsScheduled: number;
	lastLogin: Date | null;
	memberSince: Date;
	lastResumeUpdate: Date | null;
};

export function Overview(props: TProps) {
	const {
		totalResumes,
		activeApplications,
		interviewsScheduled,
		lastLogin,
		memberSince,
		lastResumeUpdate,
	} = props;

	function formatMemberSince(date: Date) {
		const day = date.getDate();
		const month = date.toLocaleString('default', { month: 'long' });
		const year = date.getFullYear();
		return (
			<>
				<AnimatedActivityCount count={day} /> {month} {year}
			</>
		);
	}

	function formatLastLogin(date: Date | null) {
		if (!date) return 'Never';
		return formatDistanceToNow(date, { addSuffix: true });
	}

	function formatLastUpdate(date: Date | null) {
		if (!date) return 'No updates yet';
		return formatDistanceToNow(date, { addSuffix: true });
	}

	return (
		<div className='space-y-6'>
			<div>
				<h2 className='text-xl font-semibold mb-4'>Overview</h2>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4'>
					<StatCard
						title='Total Resumes'
						value={<AnimatedActivityCount count={totalResumes} />}
						description={`${totalResumes === 1 ? 'resume' : 'resumes'} created`}
					/>
					<StatCard
						title='Active Applications'
						value={<AnimatedActivityCount count={activeApplications} />}
						description='Coming soon'
					/>
					<StatCard
						title='Interviews Scheduled'
						value={<AnimatedActivityCount count={interviewsScheduled} />}
						description='Coming soon'
					/>
					<StatCard
						title='Last Login'
						value={formatLastLogin(lastLogin)}
						description='Account activity'
					/>
					<StatCard
						title='Member Since'
						value={formatMemberSince(memberSince)}
						description='Account created'
					/>
					<StatCard
						title='Last Update'
						value={formatLastUpdate(lastResumeUpdate)}
						description='Resume modification'
					/>
				</div>
			</div>
		</div>
	);
}
