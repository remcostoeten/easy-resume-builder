import { getStorageObject, setStorageObject } from './storage-helpers';

/**
 * Storage keys for app-specific data
 */
const APP_STORAGE_KEYS = {
	USER_PREFERENCES: 'user-preferences',
	THEME_PREFERENCE: 'theme-preference',
	LAST_SAVED_TIMESTAMP: 'last-saved-timestamp',
} as const;

/**
 * User preferences interface
 */
interface UserPreferences {
	autoSave: boolean;
	showTips: boolean;
	preferredTemplate: string;
	language: string;
}

/**
 * Get user preferences from storage
 */
export function getUserPreferences(): UserPreferences | null {
	return getStorageObject<UserPreferences>(APP_STORAGE_KEYS.USER_PREFERENCES);
}

/**
 * Save user preferences to storage
 */
export function saveUserPreferences(preferences: UserPreferences): boolean {
	return setStorageObject(APP_STORAGE_KEYS.USER_PREFERENCES, preferences);
}

/**
 * Get theme preference
 */
export function getThemePreference(): 'light' | 'dark' | null {
	const theme = getStorageObject<string>(APP_STORAGE_KEYS.THEME_PREFERENCE);
	return theme as 'light' | 'dark' | null;
}

/**
 * Save theme preference
 */
export function saveThemePreference(theme: 'light' | 'dark'): boolean {
	return setStorageObject(APP_STORAGE_KEYS.THEME_PREFERENCE, theme);
}

/**
 * Get last saved timestamp
 */
export function getLastSavedTimestamp(): Date | null {
	const timestamp = getStorageObject<string>(APP_STORAGE_KEYS.LAST_SAVED_TIMESTAMP);
	return timestamp ? new Date(timestamp) : null;
}

/**
 * Save current timestamp as last saved
 */
export function saveLastSavedTimestamp(): boolean {
	return setStorageObject(APP_STORAGE_KEYS.LAST_SAVED_TIMESTAMP, new Date().toISOString());
}

/**
 * Clear all app-specific storage data
 */
export function clearAppStorage(): void {
	Object.values(APP_STORAGE_KEYS).forEach(key => {
		if (typeof window !== 'undefined') {
			localStorage.removeItem(key);
		}
	});
}
