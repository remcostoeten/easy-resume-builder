import { Skeleton } from '@/shared/components/ui/skeleton';

export default function EditResumeLoading() {
	return (
		<div className='h-screen bg-background'>
			<div className='h-[73px] bg-card border-b border-border animate-pulse' />

			<div className='h-[calc(100vh-73px)] flex'>
				<div className='min-w-[280px] bg-card border-r border-border p-4 space-y-4'>
					<Skeleton className='h-6 w-24' />
					{Array.from({ length: 8 }).map((_, i) => (
						<div key={i} className='flex items-center space-x-3 p-2'>
							<Skeleton className='h-4 w-4 rounded' />
							<Skeleton className='h-4 w-32' />
						</div>
					))}
				</div>

				<div className='flex-1 flex'>
					<div className='flex-1 p-6 space-y-6'>
						<div className='mb-8'>
							<Skeleton className='h-8 w-48' />
						</div>

						<div className='space-y-4'>
							{Array.from({ length: 4 }).map((_, i) => (
								<div key={i} className='space-y-3'>
									<Skeleton className='h-5 w-32' />
									<Skeleton className='h-10 w-full' />
								</div>
							))}
						</div>
					</div>

					<div className='w-96 bg-card border-l border-border p-6'>
						<div className='space-y-4'>
							<Skeleton className='h-6 w-20' />
							<Skeleton className='h-80 w-full bg-muted rounded' />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
