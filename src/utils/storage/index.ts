/**
 * Storage utilities - centralized localStorage helpers
 */

// Base storage helpers
export {
	getStorageItem,
	setStorageItem,
	removeStorageItem,
	isStorageAvailable,
	getStorageBoolean,
	setStorageBoolean,
	getStorageObject,
	setStorageObject,
} from './storage-helpers';

// Welcome modal specific utilities
export {
	hasSeenWelcomeModal,
	markWelcomeModalAsSeen,
	resetWelcomeModal,
	setStorageOnClick,
	setStorageOnBlur,
	forceShowWelcomeModal,
} from './welcome-storage';

// App-specific storage utilities
export {
	getUserPreferences,
	saveUserPreferences,
	getThemePreference,
	saveThemePreference,
	getLastSavedTimestamp,
	saveLastSavedTimestamp,
	clearAppStorage,
} from './app-storage';

// Form persistence utilities
export {
	saveFormData,
	getFormData,
	removeFormData,
	saveFormField,
	getFormField,
	clearAllFormData,
	getExistingFormKeys,
} from './form-storage';

// Storage keys constants
export const STORAGE_KEYS = {
	WELCOME_MODAL_SEEN: 'welcome-modal-seen',
	// Add more storage keys here as needed
} as const;

// Type definitions
export type StorageKey = keyof typeof STORAGE_KEYS;
