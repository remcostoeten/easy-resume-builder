'use client';

type TProps = {
	className?: string;
};

export function ResumePreviewSkeleton({ className }: TProps) {
	return (
		<div className={className ?? ''}>
			<div className='w-full bg-white text-black p-8 space-y-6 animate-pulse'>
				<div className='space-y-3'>
					<div className='h-7 w-64 bg-gray-200 rounded' />
					<div className='h-4 w-full max-w-2xl bg-gray-200 rounded' />
				</div>
				<div className='h-4 w-80 bg-gray-200 rounded' />
				<div className='space-y-4'>
					<div className='h-5 w-40 bg-gray-200 rounded' />
					<div className='space-y-2'>
						<div className='h-4 w-full bg-gray-100 rounded' />
						<div className='h-4 w-11/12 bg-gray-100 rounded' />
						<div className='h-4 w-10/12 bg-gray-100 rounded' />
					</div>
				</div>
			</div>
		</div>
	);
}
