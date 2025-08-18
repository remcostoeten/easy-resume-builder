import { Skeleton } from '@/shared/components/ui/skeleton';

export function DashboardSkeleton() {
	return (
		<div className='min-h-screen bg-background'>
			<header className='border-b bg-card'>
				<div className='container mx-auto px-4 py-4'>
					<div className='flex items-center justify-between'>
						<Skeleton className='h-8 w-32' />
						<div className='flex items-center space-x-6'>
							<nav className='flex items-center space-x-4'>
								<Skeleton className='h-4 w-16' />
								<Skeleton className='h-4 w-12' />
								<Skeleton className='h-4 w-16' />
							</nav>
							<div className='flex items-center gap-2'>
								<Skeleton className='h-8 w-8 rounded-full' />
								<Skeleton className='h-4 w-20' />
							</div>
						</div>
					</div>
				</div>
			</header>
			<main className='container mx-auto px-4 py-8'>
				<div className='space-y-6'>
					<div className='space-y-2'>
						<Skeleton className='h-8 w-48' />
						<Skeleton className='h-4 w-96' />
					</div>
					<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
						{Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className='rounded-lg border p-6 space-y-2'>
								<Skeleton className='h-4 w-20' />
								<Skeleton className='h-8 w-16' />
								<Skeleton className='h-3 w-24' />
							</div>
						))}
					</div>
					<div className='grid gap-6 md:grid-cols-2'>
						<div className='rounded-lg border p-6 space-y-4'>
							<Skeleton className='h-6 w-32' />
							<div className='space-y-2'>
								{Array.from({ length: 5 }).map((_, i) => (
									<Skeleton key={i} className='h-4 w-full' />
								))}
							</div>
						</div>
						<div className='rounded-lg border p-6 space-y-4'>
							<Skeleton className='h-6 w-28' />
							<div className='space-y-2'>
								{Array.from({ length: 3 }).map((_, i) => (
									<div key={i} className='flex items-center space-x-3'>
										<Skeleton className='h-8 w-8 rounded-full' />
										<div className='space-y-1'>
											<Skeleton className='h-4 w-24' />
											<Skeleton className='h-3 w-16' />
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
