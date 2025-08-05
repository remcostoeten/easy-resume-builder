'use client';

import React from 'react';
import { usePersistedInput } from '@/hooks/use-persisted-input';

export type TPersistedInputProps = {
	/**
	 * Form key to group related fields
	 */
	formKey: string;
	
	/**
	 * Field name within the form
	 */
	fieldName: string;
	
	/**
	 * Input placeholder text
	 */
	placeholder?: string;
	
	/**
	 * Default value if nothing is stored
	 */
	defaultValue?: string;
	
	/**
	 * Input type
	 */
	type?: 'text' | 'email' | 'tel' | 'url' | 'password';
	
	/**
	 * Whether to save immediately on change
	 */
	saveImmediately?: boolean;
	
	/**
	 * Additional CSS classes
	 */
	className?: string;
};

/**
 * Input component with automatic localStorage persistence
 */
export function PersistedInput({
	formKey,
	fieldName,
	placeholder,
	defaultValue = '',
	type = 'text',
	saveImmediately = false,
	className = '',
}: TPersistedInputProps) {
	const { value, setValue, isLoading } = usePersistedInput({
		formKey,
		fieldName,
		defaultValue,
		saveImmediately,
	});
	
	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const newValue = e.target.value;
		setValue(newValue);
	}
	
	if (isLoading) {
		return (
			<div className={`animate-pulse bg-gray-200 h-10 rounded ${className}`} />
		);
	}
	
	return (
		<input
			type={type}
			value={value}
			onChange={handleChange}
			placeholder={placeholder}
			className={`
				w-full px-3 py-2 border border-gray-300 rounded-md
				focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
				transition-colors duration-200
				${className}
			`.trim()}
		/>
	);
}
