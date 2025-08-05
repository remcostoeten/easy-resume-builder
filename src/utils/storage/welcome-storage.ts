import { getStorageBoolean, setStorageBoolean, removeStorageItem } from './storage-helpers';

/**
 * Storage key for welcome modal seen status
 */
const WELCOME_MODAL_SEEN_KEY = 'welcome-modal-seen';

/**
 * Check if the user has seen the welcome modal
 */
export function hasSeenWelcomeModal(): boolean {
	return getStorageBoolean(WELCOME_MODAL_SEEN_KEY, false);
}

/**
 * Mark the welcome modal as seen
 */
export function markWelcomeModalAsSeen(): boolean {
	return setStorageBoolean(WELCOME_MODAL_SEEN_KEY, true);
}

/**
 * Reset the welcome modal state - user will see it again on next visit
 */
export function resetWelcomeModal(): boolean {
	return removeStorageItem(WELCOME_MODAL_SEEN_KEY);
}

/**
 * Set storage on click event (for buttons/interactions)
 * Marks the welcome modal as seen when user clicks "Get Started" or similar
 */
export function setStorageOnClick(): boolean {
	return markWelcomeModalAsSeen();
}

/**
 * Set storage on blur event (when modal loses focus)
 * Optionally mark as seen when user interacts outside the modal
 */
export function setStorageOnBlur(): boolean {
	return markWelcomeModalAsSeen();
}

/**
 * Force show the welcome modal (bypasses the seen check)
 * Useful for previewing the modal in development
 */
export function forceShowWelcomeModal(): void {
	resetWelcomeModal();
	// Dispatch a custom event that could be listened to
	if (typeof window !== 'undefined') {
		window.dispatchEvent(new CustomEvent('force-show-welcome-modal'));
	}
}
