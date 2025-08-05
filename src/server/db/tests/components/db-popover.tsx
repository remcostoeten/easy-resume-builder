// @ts-nocheck
import { Database } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from 'ui/popover';
import { getDbMetrics } from '../queries/get-db-metrics';

export async function DbMetricsPopover() {
	const metrics = await getDbMetrics();

	return (
		<Popover>
			<PopoverTrigger asChild>
				<button
					type='button'
					className='inline-flex items-center gap-1 rounded-xl bg-gray-800 px-3 py-1.5 text-sm text-white hover:bg-gray-700 transition'
				>
					<Database className='w-4 h-4' />
					DB Metrics
				</button>
			</PopoverTrigger>

			<PopoverContent className='z-10 mt-2 w-64 rounded-xl border border-gray-700 bg-gray-900 p-4 text-sm text-white shadow-lg'>
				{metrics.ok ? (
					<div className='space-y-1'>
						<div>
							<span className='font-semibold'>Status:</span> ✅ Connected
						</div>
						<div>
							<span className='font-semibold'>Latency:</span> {metrics.latency} ms
						</div>
						<div>
							<span className='font-semibold'>Checked at:</span>{' '}
							{new Date(metrics.timestamp).toLocaleTimeString()}
						</div>
					</div>
				) : (
					<div className='text-red-400 space-y-1'>
						<div>
							<span className='font-semibold'>Status:</span> ❌ Error
						</div>
						<div>
							<span className='font-semibold'>Message:</span> {metrics.error}
						</div>
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}
