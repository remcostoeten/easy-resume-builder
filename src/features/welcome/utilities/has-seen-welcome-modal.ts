import { STORAGE_KEY } from '../constants';

/**
 * Check if user has seen the welcome modal
 */
export function hasSeenWelcomeModal(): boolean {
	try {
		return localStorage.getItem(STORAGE_KEY) === 'true';
	} catch (error) {
		console.warn('Could not check welcome modal state:', error);
		return false;
	}
}
