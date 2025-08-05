import { useEffect, useCallback } from 'react';
import { saveFormData, getFormData, saveFormField } from '@/utils/storage/form-storage';

export interface UseFormPersistenceOptions {
	/**
	 * Unique key to identify this form in localStorage
	 */
	formKey: string;
	
	/**
	 * Debounce delay in milliseconds for auto-save
	 * @default 500
	 */
	debounceMs?: number;
	
	/**
	 * Whether to enable auto-save on form changes
	 * @default true
	 */
	autoSave?: boolean;
	
	/**
	 * Fields to exclude from persistence
	 */
	excludeFields?: string[];
	
	/**
	 * Callback when data is loaded from storage
	 */
	onDataLoaded?: (data: Record<string, any>) => void;
	
	/**
	 * Callback when data is saved to storage
	 */
	onDataSaved?: (data: Record<string, any>) => void;
}

/**
 * Custom hook for automatic form persistence using localStorage
 */
export function useFormPersistence({
	formKey,
	debounceMs = 500,
	autoSave = true,
	excludeFields = [],
	onDataLoaded,
	onDataSaved,
}: UseFormPersistenceOptions) {
	
	/**
	 * Load saved form data from localStorage
	 */
	const loadFormData = useCallback(() => {
		const savedData = getFormData(formKey);
		if (savedData && onDataLoaded) {
			onDataLoaded(savedData);
		}
		return savedData;
	}, [formKey, onDataLoaded]);
	
	/**
	 * Save form data to localStorage
	 */
	const saveFormToPersistence = useCallback((data: Record<string, any>) => {
		// Filter out excluded fields
		const filteredData = Object.keys(data).reduce((acc, key) => {
			if (!excludeFields.includes(key)) {
				acc[key] = data[key];
			}
			return acc;
		}, {} as Record<string, any>);
		
		const success = saveFormData(formKey, filteredData);
		if (success && onDataSaved) {
			onDataSaved(filteredData);
		}
		return success;
	}, [formKey, excludeFields, onDataSaved]);
	
	/**
	 * Save a specific field to localStorage
	 */
	const saveField = useCallback((fieldName: string, value: any) => {
		if (excludeFields.includes(fieldName)) return false;
		return saveFormField(formKey, fieldName, value);
	}, [formKey, excludeFields]);
	
	/**
	 * Create a debounced save function
	 */
	const createDebouncedSave = useCallback((callback: (data: Record<string, any>) => void) => {
		let timeoutId: NodeJS.Timeout;
		
		return (data: Record<string, any>) => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				callback(data);
			}, debounceMs);
		};
	}, [debounceMs]);
	
	/**
	 * Create input change handler with auto-save
	 */
	const createChangeHandler = useCallback((
		setValue: (name: string, value: any) => void,
		getValues: () => Record<string, any>
	) => {
		const debouncedSave = createDebouncedSave(saveFormToPersistence);
		
		return (name: string, value: any) => {
			setValue(name, value);
			
			if (autoSave) {
				// Save individual field immediately
				saveField(name, value);
				
				// Also save entire form after debounce
				debouncedSave(getValues());
			}
		};
	}, [createDebouncedSave, saveFormToPersistence, autoSave, saveField]);
	
	/**
	 * Load data on mount
	 */
	useEffect(() => {
		loadFormData();
	}, [loadFormData]);
	
	return {
		loadFormData,
		saveFormData: saveFormToPersistence,
		saveField,
		createChangeHandler,
	};
}
