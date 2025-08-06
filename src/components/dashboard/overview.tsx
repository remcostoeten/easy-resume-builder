import { AnimatedActivityCount } from './animated-activity-count';

type TProps = {
    totalResumes: number;
    activeApplications: number;
    interviewsScheduled: number;
    
    lastLogin: Date;
    memberSince: Date;
};

export function Overview(props: TProps) {
    const { totalResumes, activeApplications, interviewsScheduled, lastLogin, memberSince } = props;

    function formatMemberSince(date: Date) {
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return <><AnimatedActivityCount count={day} /> {month} {year}</>;
    }

	return (
		<div className='space-y-6'>
			<div>
				<h2 className='text-xl font-semibold mb-4'>Overview</h2>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4'>
					<div className='p-4 bg-card rounded-lg border'>
						<h3 className='text-sm font-medium text-muted-foreground'>Total Resumes</h3>
						<p className='text-2xl font-bold'><AnimatedActivityCount count={totalResumes} /></p>
					</div>
					<div className='p-4 bg-card rounded-lg border'>
						<h3 className='text-sm font-medium text-muted-foreground'>
							Active Applications
						</h3>
						<p className='text-2xl font-bold'><AnimatedActivityCount count={activeApplications} /></p>
					</div>
					<div className='p-4 bg-card rounded-lg border'>
						<h3 className='text-sm font-medium text-muted-foreground'>
							Interviews Scheduled
						</h3>
						<p className='text-2xl font-bold'>{interviewsScheduled}</p>
					</div>
					
					<div className='p-4 bg-card rounded-lg border'>
						<h3 className='text-sm font-medium text-muted-foreground'>Last Login</h3>
						<p className='text-2xl font-bold'>Just now</p>
					</div>
					<div className='p-4 bg-card rounded-lg border'>
						<h3 className='text-sm font-medium text-muted-foreground'>Member Since</h3>
						<p className='text-2xl font-bold'>{formatMemberSince(memberSince)}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
