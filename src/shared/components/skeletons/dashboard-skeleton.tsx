import { Card, CardContent, CardHeader } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export function DashboardSkeleton() {
	return (
		<div className='space-y-8'>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				{Array.from({ length: 3 }).map((_, i) => (
					<Card key={i}>
						<CardHeader>
							<Skeleton className='h-4 w-24' />
						</CardHeader>
						<CardContent>
							<div className='space-y-3'>
								<Skeleton className='h-8 w-16' />
								<Skeleton className='h-3 w-full' />
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				<div className='lg:col-span-2'>
					<Card>
						<CardHeader>
							<div className='flex justify-between items-center'>
								<Skeleton className='h-6 w-32' />
								<Skeleton className='h-9 w-24' />
							</div>
						</CardHeader>
						<CardContent>
							<div className='space-y-4'>
								{Array.from({ length: 3 }).map((_, i) => (
									<div key={i} className='border rounded p-4 space-y-3'>
										<div className='flex justify-between'>
											<Skeleton className='h-5 w-48' />
											<Skeleton className='h-4 w-20' />
										</div>
										<Skeleton className='h-4 w-full' />
										<Skeleton className='h-4 w-2/3' />
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				<div className='lg:col-span-1'>
					<Card>
						<CardHeader>
							<Skeleton className='h-6 w-28' />
						</CardHeader>
						<CardContent>
							<div className='space-y-6'>
								<div className='flex items-center space-x-4'>
									<Skeleton className='h-12 w-12 rounded-full' />
									<div className='space-y-2'>
										<Skeleton className='h-4 w-32' />
										<Skeleton className='h-3 w-24' />
									</div>
								</div>

								<div className='grid grid-cols-2 gap-4'>
									{Array.from({ length: 4 }).map((_, i) => (
										<div key={i} className='text-center p-3 border rounded'>
											<Skeleton className='h-6 w-8 mx-auto mb-2' />
											<Skeleton className='h-3 w-16 mx-auto' />
										</div>
									))}
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			<Card>
				<CardHeader>
					<Skeleton className='h-6 w-36' />
				</CardHeader>
				<CardContent>
					<div className='space-y-3'>
						{Array.from({ length: 5 }).map((_, i) => (
							<div key={i} className='flex items-center justify-between py-2'>
								<div className='flex items-center space-x-3'>
									<Skeleton className='h-8 w-8 rounded' />
									<div className='space-y-1'>
										<Skeleton className='h-4 w-32' />
										<Skeleton className='h-3 w-24' />
									</div>
								</div>
								<Skeleton className='h-3 w-16' />
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
