'use client';

import type React from 'react';
import { usePersistedInput } from '@/hooks/use-persisted-input';

export type TPersistedTextareaProps = {
	/**
	 * Form key to group related fields
	 */
	formKey: string;

	/**
	 * Field name within the form
	 */
	fieldName: string;

	/**
	 * Textarea placeholder text
	 */
	placeholder?: string;

	/**
	 * Default value if nothing is stored
	 */
	defaultValue?: string;

	/**
	 * Whether to save immediately on change
	 */
	saveImmediately?: boolean;

	/**
	 * Additional CSS classes
	 */
	className?: string;

	/**
	 * Number of rows
	 */
	rows?: number;
};

/**
 * Textarea component with automatic localStorage persistence
 */
export function PersistedTextarea({
	formKey,
	fieldName,
	placeholder,
	defaultValue = '',
	saveImmediately = false,
	className = '',
	rows = 4,
}: TPersistedTextareaProps) {
	const { value, setValue, isLoading } = usePersistedInput({
		formKey,
		fieldName,
		defaultValue,
		saveImmediately,
	});

	function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		const newValue = e.target.value;
		setValue(newValue, false); // Don't save immediately, just update state
	}

	function handleBlur(e: React.FocusEvent<HTMLTextAreaElement>) {
		const newValue = e.target.value;
		setValue(newValue, true); // Save on blur
	}

	if (isLoading) {
		return <div className={`animate-pulse bg-gray-200 h-24 rounded ${className}`} />;
	}

	return (
		<textarea
			value={value}
			onChange={handleChange}
			onBlur={handleBlur}
			placeholder={placeholder}
			rows={rows}
			className={`
				w-full px-3 py-2 border border-gray-300 rounded-md
				focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
				transition-colors duration-200 resize-y
				${className}
			`.trim()}
		/>
	);
}
