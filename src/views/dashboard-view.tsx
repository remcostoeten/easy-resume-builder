import { Suspense } from 'react';

export function DashboardView() {
	return (
		<div className='p-6'>
			<h1 className='text-xl font-semibold'>Dashboard</h1>
			<p className='text-sm text-muted-foreground'>This is a placeholder view.</p>
			<Suspense fallback={null} />
		</div>
	);
}
