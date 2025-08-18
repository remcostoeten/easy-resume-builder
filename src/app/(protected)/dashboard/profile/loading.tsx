import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

export default function ProfileLoading() {
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
				<div className='max-w-4xl mx-auto'>
					<div className='space-y-6'>
						<div>
							<Skeleton className='h-8 w-48 mb-2' />
							<Skeleton className='h-4 w-96' />
						</div>

						<div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
							<div className='lg:col-span-1'>
								<Card>
									<CardContent className='p-6'>
										<div className='flex flex-col items-center space-y-4'>
											<Skeleton className='h-20 w-20 rounded-full' />
											<div className='text-center space-y-2'>
												<Skeleton className='h-5 w-32' />
												<Skeleton className='h-4 w-24' />
											</div>
										</div>
									</CardContent>
								</Card>
							</div>

							<div className='lg:col-span-3'>
								<div className='space-y-6'>
									<div className='border-b'>
										<div className='flex space-x-8'>
											{Array.from({ length: 6 }).map(
												function renderTabSkeleton(_, i) {
													return (
														<Skeleton key={i} className='h-10 w-24' />
													);
												}
											)}
										</div>
									</div>

									<div className='space-y-6'>
										<Card>
											<CardHeader>
												<Skeleton className='h-6 w-32' />
											</CardHeader>
											<CardContent>
												<div className='space-y-4'>
													<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
														{Array.from({ length: 6 }).map(
															function renderFieldSkeleton(_, i) {
																return (
																	<div
																		key={i}
																		className='space-y-2'
																	>
																		<Skeleton className='h-4 w-20' />
																		<Skeleton className='h-10 w-full' />
																	</div>
																);
															}
														)}
													</div>
													<div className='flex justify-end space-x-3'>
														<Skeleton className='h-10 w-20' />
														<Skeleton className='h-10 w-24' />
													</div>
												</div>
											</CardContent>
										</Card>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
