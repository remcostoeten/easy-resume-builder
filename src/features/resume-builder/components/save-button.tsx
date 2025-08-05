'use client';

import { AlertTriangle, Check, Clock, Save } from 'lucide-react';
import { SavedAtTimestamp } from '@/components/effects/saved-at-timestamp';
import { useSaveStatus } from '@/components/providers/save-status-provider';
import { Button } from '@/shared/components/ui/button';

type TProps = {
	readonly className?: string;
};

export function SaveButton({ className }: TProps) {
	const { saveStatus, manualSave } = useSaveStatus();

	function getButtonIcon() {
		switch (saveStatus) {
			case 'saving':
				return <Clock className='h-4 w-4 animate-spin mr-2' />;
			case 'saved':
				return <Check className='h-4 w-4 mr-2' />;
			case 'error':
				return <AlertTriangle className='h-4 w-4 mr-2' />;
			default: // 'idle'
				return <Save className='h-4 w-4 mr-2' />;
		}
	}

	function getButtonText() {
		switch (saveStatus) {
			case 'saving':
				return 'Saving…';
			case 'saved':
				return 'Saved!';
			case 'error':
				return 'Error! Retry';
			default:
				return 'Save';
		}
	}

	const handleButtonClick = () => {
		if (saveStatus === 'error' || saveStatus === 'idle') {
			manualSave();
		}
	};

	const isClickable = saveStatus === 'idle' || saveStatus === 'error';

	return (
		<div className={`flex items-center gap-3 ${className || ''}`}>
			<Button
				onClick={handleButtonClick}
				size='sm'
				disabled={saveStatus === 'saving'}
				className={`
          ${saveStatus === 'error' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
          ${saveStatus === 'saved' ? 'bg-green-600 text-white opacity-90 cursor-default' : ''}
          ${saveStatus === 'saving' ? 'opacity-70 cursor-not-allowed' : ''}
          ${!isClickable ? 'pointer-events-none' : ''}
        `}
			>
				{getButtonIcon()}
				{getButtonText()}
			</Button>

			{saveStatus === 'saved' && <SavedAtTimestamp />}
		</div>
	);
}
