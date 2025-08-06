import { Spinner } from '@/shared/components/ui';

export default function Loading() {
	return (
		<div className='min-h-screen flex items-center justify-center'>
			<Spinner />
		</div>
	);
}
