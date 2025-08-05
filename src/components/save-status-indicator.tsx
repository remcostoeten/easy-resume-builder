'use client';

import { useSaveStatus } from './providers/save-status-provider';
import { SavedAtTimestamp } from './effects/saved-at-timestamp';

export function SaveStatusIndicator() {
  const { saveStatus, manualSave, lastSavedAt } = useSaveStatus();

  function getStatusText(status: typeof saveStatus) {
    switch (status) {
      case 'idle':
        return 'Ready';
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Saved';
      case 'error':
        return 'Error saving';
      default:
        return 'Unknown';
    }
  }

  function getStatusColor(status: typeof saveStatus) {
    switch (status) {
      case 'idle':
        return 'text-gray-500';
      case 'saving':
        return 'text-blue-500';
      case 'saved':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className={`text-sm ${getStatusColor(saveStatus)}`}>
          {getStatusText(saveStatus)}
        </span>
        <button
          onClick={manualSave}
          className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          disabled={saveStatus === 'saving'}
        >
          Save Now
        </button>
      </div>
      <SavedAtTimestamp className="border-t border-gray-200 pt-2" />
    </div>
  );
}
