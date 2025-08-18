/**
 * Base localStorage utility functions
 */

/**
 * Safely get an item from localStorage
 */
export function getStorageItem(key: string): string | null {
	if (typeof window === 'undefined') return null;

	try {
		return localStorage.getItem(key);
	} catch (error) {
		console.warn(`Failed to get localStorage item "${key}":`, error);
		return null;
	}
}

/**
 * Safely set an item in localStorage
 */
export function setStorageItem(key: string, value: string): boolean {
	if (typeof window === 'undefined') return false;

	try {
		localStorage.setItem(key, value);
		return true;
	} catch (error) {
		console.warn(`Failed to set localStorage item "${key}":`, error);
		return false;
	}
}

/**
 * Safely remove an item from localStorage
 */
export function removeStorageItem(key: string): boolean {
	if (typeof window === 'undefined') return false;

	try {
		localStorage.removeItem(key);
		return true;
	} catch (error) {
		console.warn(`Failed to remove localStorage item "${key}":`, error);
		return false;
	}
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
	if (typeof window === 'undefined') return false;

	try {
		const testKey = '__storage_test__';
		localStorage.setItem(testKey, 'test');
		localStorage.removeItem(testKey);
		return true;
	} catch {
		return false;
	}
}

/**
 * Get a boolean value from localStorage
 */
export function getStorageBoolean(key: string, defaultValue = false): boolean {
	const value = getStorageItem(key);
	if (value === null) return defaultValue;
	return value === 'true';
}

/**
 * Set a boolean value in localStorage
 */
export function setStorageBoolean(key: string, value: boolean): boolean {
	return setStorageItem(key, value.toString());
}

/**
 * Get a JSON object from localStorage
 */
export function getStorageObject<T>(key: string, defaultValue: T | null = null): T | null {
	const value = getStorageItem(key);
	if (value === null) return defaultValue;

	try {
		return JSON.parse(value) as T;
	} catch (error) {
		console.warn(`Failed to parse JSON from localStorage key "${key}":`, error);
		return defaultValue;
	}
}

/**
 * Set a JSON object in localStorage
 */
export function setStorageObject<T>(key: string, value: T): boolean {
	try {
		return setStorageItem(key, JSON.stringify(value));
	} catch (error) {
		console.warn(`Failed to stringify object for localStorage key "${key}":`, error);
		return false;
	}
}
