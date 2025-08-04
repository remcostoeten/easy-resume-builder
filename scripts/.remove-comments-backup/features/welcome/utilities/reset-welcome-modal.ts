import { STORAGE_KEY } from '../constants';

/**
 * Reset the welcome modal state - useful for development and testing
 */
export function resetWelcomeModal(): void {
	try {
		localStorage.removeItem(STORAGE_KEY);
		console.log('Welcome modal state reset. Refresh the page to see the modal again.');
	} catch (error) {
		console.warn('Could not reset welcome modal state:', error);
	}
}
