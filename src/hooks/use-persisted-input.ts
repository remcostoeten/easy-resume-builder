import { useCallback, useEffect, useState } from 'react';
import { getFormField, saveFormField } from '@/utils/storage/form-storage';

type TUsePersistedInputOptions = {
	/**
	 * Form key to group related fields
	 */
	formKey: string;

	/**
	 * Field name within the form
	 */
	fieldName: string;

	/**
	 * Default value if nothing is stored
	 */
	defaultValue?: string;

	/**
	 * Debounce delay in milliseconds
	 * @default 300
	 */
	debounceMs?: number;

	/**
	 * Whether to save immediately on change or use debouncing
	 * @default false
	 */
	saveImmediately?: boolean;
};

/**
 * Simple hook for persisting individual input field values
 */
export function usePersistedInput({
	formKey,
	fieldName,
	defaultValue = '',
	debounceMs = 300,
	saveImmediately = false,
}: TUsePersistedInputOptions) {
	const [value, setValue] = useState<string>(defaultValue);
	const [isLoading, setIsLoading] = useState(true);

	// Load value from storage on mount
	useEffect(() => {
		const storedValue = getFormField<string>(formKey, fieldName);
		if (storedValue !== null) {
			setValue(storedValue);
		}
		setIsLoading(false);
	}, [formKey, fieldName]);

	// Debounced save function
	const _debouncedSave = useCallback(
		(() => {
			let timeoutId: NodeJS.Timeout;

			return (valueToSave: string) => {
				clearTimeout(timeoutId);
				timeoutId = setTimeout(() => {
					saveFormField(formKey, fieldName, valueToSave);
				}, debounceMs);
			};
		})(),
		[]
	);

	// Handle value changes
	const handleChange = useCallback(
		(newValue: string, shouldSave?: boolean) => {
			setValue(newValue); // Always update the local state to allow typing

			// Only save if explicitly requested (on blur) or if saveImmediately is true
			if (shouldSave || saveImmediately) {
				saveFormField(formKey, fieldName, newValue);
			}
		},
		[formKey, fieldName, saveImmediately]
	);

	// Manual save function
	const save = useCallback(() => {
		saveFormField(formKey, fieldName, value);
	}, [formKey, fieldName, value]);

	// Clear function
	const clear = useCallback(() => {
		setValue(defaultValue);
		saveFormField(formKey, fieldName, defaultValue);
	}, [formKey, fieldName, defaultValue]);

	return {
		value,
		setValue: handleChange,
		save,
		clear,
		isLoading,
	};
}
