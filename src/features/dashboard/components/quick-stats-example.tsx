import { Suspense } from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { QuickStats } from './quick-stats';

export function QuickStatsExample() {
	return (
		<div className='space-y-4'>
			<h2 className='text-lg font-semibold'>Dashboard Quick Stats</h2>
			<Suspense
				fallback={
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						{[1, 2, 3].map((i) => (
							<Card key={i}>
								<CardContent>
									<div className='animate-pulse space-y-2'>
										<div className='h-4 bg-muted rounded w-1/3'></div>
										<div className='h-8 bg-muted rounded w-1/2'></div>
										<div className='h-3 bg-muted rounded w-2/3'></div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				}
			>
				<QuickStats />
			</Suspense>
		</div>
	);
}
