/**
 * Storage utilities - centralized localStorage helpers
 */

// App-specific storage utilities
export {
	clearAppStorage,
	getLastSavedTimestamp,
	getThemePreference,
	getUserPreferences,
	saveLastSavedTimestamp,
	saveThemePreference,
	saveUserPreferences,
} from './app-storage';
// Form persistence utilities
export {
	clearAllFormData,
	getExistingFormKeys,
	getFormData,
	getFormField,
	removeFormData,
	saveFormData,
	saveFormField,
} from './form-storage';
// Base storage helpers
export {
	getStorageBoolean,
	getStorageItem,
	getStorageObject,
	isStorageAvailable,
	removeStorageItem,
	setStorageBoolean,
	setStorageItem,
	setStorageObject,
} from './storage-helpers';
// Welcome modal specific utilities
export {
	forceShowWelcomeModal,
	hasSeenWelcomeModal,
	markWelcomeModalAsSeen,
	resetWelcomeModal,
	setStorageOnBlur,
	setStorageOnClick,
} from './welcome-storage';

// Storage keys constants
export const STORAGE_KEYS = {
	WELCOME_MODAL_SEEN: 'welcome-modal-seen',
	// Add more storage keys here as needed
} as const;

// Type definitions
export type StorageKey = keyof typeof STORAGE_KEYS;
