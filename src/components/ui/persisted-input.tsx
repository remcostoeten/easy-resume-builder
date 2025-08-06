'use client';

import type React from 'react';
import { usePersistedInput } from '@/hooks/use-persisted-input';

export type TPersistedInputProps = {
	formKey: string;
	fieldName: string;
	placeholder?: string;
	defaultValue?: string;
	type?: 'text' | 'email' | 'tel' | 'url' | 'password';
	saveImmediately?: boolean;
	className?: string;
	id?: string;
};

export function PersistedInput({
	formKey,
	fieldName,
	placeholder,
	defaultValue = '',
	type = 'text',
	saveImmediately = false,
	className = '',
	id,
}: TPersistedInputProps) {
	const { value, setValue, isLoading } = usePersistedInput({
		formKey,
		fieldName,
		defaultValue,
		saveImmediately,
	});

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const newValue = e.target.value;
		setValue(newValue, false);
	}

	function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
		const newValue = e.target.value;
		if (newValue !== value) {
			setValue(newValue, true);
		}
	}

	if (isLoading) {
		return <div className={`animate-pulse bg-gray-200 h-10 rounded ${className}`} />;
	}

	return (
		<input
			id={id}
			type={type}
			value={value}
			onChange={handleChange}
			onBlur={handleBlur}
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
