'use client';

import { useAtomValue } from 'jotai/react';
import { resumeAtomWithMigration } from '@/store/resume-store';
import { useResumePersistence } from '@/hooks/use-resume-persistence';

export function AutoSaveDemo() {
	const resumeData = useAtomValue(resumeAtomWithMigration);
	const { saveStatus } = useResumePersistence();

	return (
		<div className="fixed bottom-4 right-4 p-4 bg-white shadow-lg rounded-lg border">
			<h3 className="font-semibold text-sm mb-2">Auto-Save Status</h3>
			<div className="space-y-2">
				<div className="flex items-center gap-2">
					<div 
						className={`w-2 h-2 rounded-full ${
							saveStatus === 'saving' ? 'bg-yellow-500 animate-pulse' :
							saveStatus === 'saved' ? 'bg-green-500' :
							saveStatus === 'error' ? 'bg-red-500' :
							'bg-gray-300'
						}`}
					/>
					<span className="text-xs text-gray-600">
						{saveStatus === 'saving' ? 'Saving...' :
						 saveStatus === 'saved' ? 'All changes saved' :
						 saveStatus === 'error' ? 'Save failed' :
						 'Ready to save'}
					</span>
				</div>
				<div className="text-xs text-gray-500">
					Last updated: {resumeData.updatedAt instanceof Date ? resumeData.updatedAt.toLocaleTimeString() : new Date(resumeData.updatedAt as any).toLocaleTimeString()}
				</div>
				<div className="text-xs text-gray-400">
					Resume ID: {resumeData.id}
				</div>
			</div>
		</div>
	);
}
