'use client';

import { Save, AlertTriangle, Check, Clock } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useSaveStatus } from './providers/save-status-provider';
import { SavedAtTimestamp } from './effects/saved-at-timestamp';

type TProps = {
	readonly className?: string;
};

export function SaveButton({ className }: TProps) {
	const { saveStatus, manualSave } = useSaveStatus();

	function getStatusIcon() {
		switch (saveStatus) {
			case 'saving':
				return <Clock className="h-3 w-3 animate-spin" />;
			case 'saved':
				return <Check className="h-3 w-3 text-green-500" />;
			case 'error':
				return <AlertTriangle className="h-3 w-3 text-orange-500" />;
			default:
				return null;
		}
	}

	function getStatusText() {
		switch (saveStatus) {
			case 'saving':
				return 'Saving…';
			case 'saved':
				return 'Saved';
			case 'error':
				return 'Error';
			default:
				return '';
		}
	}

	function handleStatusClick() {
		if (saveStatus === 'error') {
			manualSave();
		}
	}

	return (
		<div className={`flex items-center gap-3 ${className || ''}`}>
			<Button onClick={manualSave} size="sm">
				<Save className="h-4 w-4 mr-2" />
				Save
			</Button>
			
			{saveStatus !== 'idle' && (
				<div 
					className={`flex items-center gap-1 text-xs ${
						saveStatus === 'error' ? 'cursor-pointer hover:opacity-80' : ''
					}`}
					onClick={handleStatusClick}
					role={saveStatus === 'error' ? 'button' : undefined}
					tabIndex={saveStatus === 'error' ? 0 : undefined}
				>
					{getStatusIcon()}
					<span className="text-muted-foreground">{getStatusText()}</span>
				</div>
			)}
			
			<SavedAtTimestamp />
		</div>
	);
}
