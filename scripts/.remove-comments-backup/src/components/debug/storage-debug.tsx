'use client';

import { useAtomValue } from 'jotai/react';
import { useEffect, useState } from 'react';
import { resumeAtomWithMigration } from '@/store/resume-store';

export function StorageDebug() {
	const [localStorageData, setLocalStorageData] = useState<string>('');
	const atomData = useAtomValue(resumeAtomWithMigration);

	useEffect(() => {
		// Check localStorage content
		const stored = localStorage.getItem('resume-builder-data');
		setLocalStorageData(stored || 'No data found');
	}, []);

	function handleClearStorage() {
		if (
			window.confirm(
				'Are you sure you want to clear all resume data? This action cannot be undone.'
			)
		) {
			localStorage.removeItem('resume-builder-data');
			localStorage.removeItem('resume-builder-last-saved');
			setLocalStorageData('Cleared');
			window.location.reload();
		}
	}

	function handleRefresh() {
		window.location.reload();
	}

	return (
		<div className='fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg max-w-md text-xs'>
			<h3 className='font-bold mb-2'>Storage Debug</h3>

			<div className='mb-2'>
				<strong>Atom Data:</strong>
				<pre className='bg-gray-800 p-2 rounded mt-1 overflow-auto max-h-20'>
					{JSON.stringify(
						{
							firstName: atomData.personalInfo.firstName,
							email: atomData.personalInfo.email,
							hasData: !!(
								atomData.personalInfo.firstName || atomData.personalInfo.email
							),
						},
						null,
						2
					)}
				</pre>
			</div>

			<div className='mb-2'>
				<strong>LocalStorage Length:</strong> {localStorageData.length} chars
			</div>

			<div className='flex gap-2'>
				<button
					onClick={handleClearStorage}
					className='bg-red-600 px-2 py-1 rounded text-xs'
				>
					Clear Storage
				</button>
				<button onClick={handleRefresh} className='bg-blue-600 px-2 py-1 rounded text-xs'>
					Refresh
				</button>
			</div>
		</div>
	);
}

// Add this to your main layout temporarily for debugging
