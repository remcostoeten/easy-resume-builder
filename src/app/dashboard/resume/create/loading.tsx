import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

export default function CreateResumeLoading() {
	return (
		<div className='container mx-auto py-8'>
			<div className='max-w-4xl mx-auto'>
				<div className='mb-8'>
					<Skeleton className='h-9 w-64' />
				</div>

				<Card>
					<CardHeader>
						<Skeleton className='h-6 w-40' />
					</CardHeader>
					<CardContent className='text-center p-8'>
						<div className='space-y-4'>
							<Skeleton className='h-4 w-96 mx-auto' />
							<Skeleton className='h-4 w-80 mx-auto' />
							<Skeleton className='h-3 w-64 mx-auto' />
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
