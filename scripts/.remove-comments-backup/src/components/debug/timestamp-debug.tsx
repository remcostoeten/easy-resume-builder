'use client';

import { useSaveStatus } from '@/components/providers/save-status-provider';

export function TimestampDebug() {
	const { saveStatus, lastSavedAt, manualSave } = useSaveStatus();

	return (
		<div className='p-4 bg-gray-100 rounded-lg'>
			<h3 className='font-bold mb-2'>Debug Info:</h3>
			<div className='space-y-1 text-sm'>
				<div>Save Status: {saveStatus}</div>
				<div>Last Saved At: {lastSavedAt ? lastSavedAt.toISOString() : 'null'}</div>
				<div>
					LocalStorage Timestamp:{' '}
					{typeof window !== 'undefined'
						? localStorage.getItem('resume-builder-last-saved')
						: 'N/A'}
				</div>
				<button
					onClick={manualSave}
					className='mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs'
				>
					Test Save
				</button>
			</div>
		</div>
	);
}
