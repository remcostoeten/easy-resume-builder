'use client';

export function TimestampDebug() {
	return (
		<div className='p-4 bg-gray-100 rounded-lg'>
			<h3 className='font-bold mb-2'>Debug Info:</h3>
			<div className='space-y-1 text-sm'>
				<div>Save Status: Not available</div>
				<div>Last Saved At: Not available</div>
				<div>LocalStorage Timestamp: Not available (persistence removed)</div>
			</div>
		</div>
	);
}
