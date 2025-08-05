'use client';

import { AlertTriangle, Check, Clock, Save } from 'lucide-react';


type TSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

type TProps = {
	readonly className?: string;
};

export function SaveButton({ className }: TProps) {
	const status: TSaveStatus = 'idle';

	function getButtonIcon() {
		switch (status) {
			case 'saving':
				return <Clock className='h-4 w-4 animate-spin mr-2' />;
			case 'saved':
				return <Check className='h-4 w-4 mr-2' />;
			case 'error':
				return <AlertTriangle className='h-4 w-4 mr-2' />;
			default:
				return <Save className='h-4 w-4 mr-2' />;
		}
	}

	function getButtonText() {
		switch (status) {
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

return (
		<div className={`flex items-center gap-3 ${className || ''}`}>
			<span className={`
				text-sm flex items-center
				text-gray-400
			`}>
				{getButtonIcon()}
				{getButtonText()}
			</span>

			{false && <div>Last Saved: Never</div>}
		</div>
	);
}
