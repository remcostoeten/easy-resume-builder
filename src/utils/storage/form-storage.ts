import { getStorageObject, removeStorageItem, setStorageObject } from './storage-helpers';

/**
 * Storage keys for form data
 */
const FORM_STORAGE_KEYS = {
	RESUME_FORM_DATA: 'resume-form-data',
	PERSONAL_INFO: 'personal-info',
	WORK_EXPERIENCE: 'work-experience',
	EDUCATION: 'education',
	SKILLS: 'skills',
} as const;

/**
 * Save form data to localStorage
 */
export function saveFormData(formKey: string, data: Record<string, any>): boolean {
	const storageKey = `${FORM_STORAGE_KEYS.RESUME_FORM_DATA}-${formKey}`;
	const success = setStorageObject(storageKey, {
		data,
		timestamp: new Date().toISOString(),
	});

	// Dispatch custom event for auto-save indicator
	if (success && typeof window !== 'undefined') {
		window.dispatchEvent(
			new CustomEvent('localStorageUpdate', {
				detail: { key: storageKey, action: 'save' },
			})
		);
	}

	return success;
}

/**
 * Get form data from localStorage
 */
export function getFormData<T = Record<string, any>>(formKey: string): T | null {
	const storageKey = `${FORM_STORAGE_KEYS.RESUME_FORM_DATA}-${formKey}`;
	const stored = getStorageObject<{ data: T; timestamp: string }>(storageKey);
	return stored?.data || null;
}

/**
 * Remove form data from localStorage
 */
export function removeFormData(formKey: string): boolean {
	const storageKey = `${FORM_STORAGE_KEYS.RESUME_FORM_DATA}-${formKey}`;
	return removeStorageItem(storageKey);
}

/**
 * Save a specific form field value
 */
export function saveFormField(formKey: string, fieldName: string, value: any): boolean {
	const existingData = getFormData(formKey) || {};
	const updatedData = {
		...existingData,
		[fieldName]: value,
	};
	return saveFormData(formKey, updatedData);
}

/**
 * Get a specific form field value
 */
export function getFormField<T = any>(formKey: string, fieldName: string): T | null {
	const formData = getFormData(formKey);
	return formData?.[fieldName] || null;
}

/**
 * Clear all form data
 */
export function clearAllFormData(): void {
	Object.values(FORM_STORAGE_KEYS).forEach((key) => {
		if (typeof window !== 'undefined') {
			// Remove all keys that start with the form data prefix
			const keysToRemove: string[] = [];
			for (let i = 0; i < localStorage.length; i++) {
				const storageKey = localStorage.key(i);
				if (storageKey?.startsWith(key)) {
					keysToRemove.push(storageKey);
				}
			}
			keysToRemove.forEach((key) => localStorage.removeItem(key));
		}
	});
}

/**
 * Get all form data keys that exist in storage
 */
export function getExistingFormKeys(): string[] {
	if (typeof window === 'undefined') return [];

	const formKeys: string[] = [];
	const prefix = FORM_STORAGE_KEYS.RESUME_FORM_DATA;

	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key?.startsWith(`${prefix}-`)) {
			const formKey = key.replace(`${prefix}-`, '');
			formKeys.push(formKey);
		}
	}

	return formKeys;
}
