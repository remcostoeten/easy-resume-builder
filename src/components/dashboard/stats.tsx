import { AnimatedActivityCount } from './animated-activity-count';

export function Stats() {
	return (
		<div className='space-y-6'>
			<div>
				<h2 className='text-xl font-semibold mb-4'>Statistics</h2>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<div className='p-6 bg-card rounded-lg border'>
						<h3 className='text-lg font-medium mb-4'>Application Status</h3>
						<div className='space-y-2'>
							<div className='flex justify-between'>
								<span className='text-sm'>Pending</span>
								<span className='text-sm font-medium'><AnimatedActivityCount count={5} /></span>
							</div>
							<div className='flex justify-between'>
								<span className='text-sm'>In Review</span>
								<span className='text-sm font-medium'><AnimatedActivityCount count={3} /></span>
							</div>
							<div className='flex justify-between'>
								<span className='text-sm'>Accepted</span>
								<span className='text-sm font-medium'><AnimatedActivityCount count={2} /></span>
							</div>
							<div className='flex justify-between'>
								<span className='text-sm'>Rejected</span>
								<span className='text-sm font-medium'><AnimatedActivityCount count={2} /></span>
							</div>
						</div>
					</div>
					<div className='p-6 bg-card rounded-lg border'>
						<h3 className='text-lg font-medium mb-4'>Monthly Progress</h3>
						<div className='space-y-2'>
							<div className='flex justify-between'>
								<span className='text-sm'>Applications Sent</span>
								<span className='text-sm font-medium'><AnimatedActivityCount count={15} /></span>
							</div>
							<div className='flex justify-between'>
								<span className='text-sm'>Responses Received</span>
								<span className='text-sm font-medium'><AnimatedActivityCount count={7} /></span>
							</div>
							<div className='flex justify-between'>
								<span className='text-sm'>Interviews</span>
								<span className='text-sm font-medium'><AnimatedActivityCount count={3} /></span>
							</div>
							<div className='flex justify-between'>
								<span className='text-sm'>Offers</span>
								<span className='text-sm font-medium'><AnimatedActivityCount count={1} /></span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
