// src/shared/utilities/useSmartForm.ts
import { useState, useCallback } from 'react';
import { useForm, UseFormProps, FieldValues } from 'react-hook-form';

export type TSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function useSmartForm<T extends FieldValues>(
	props: UseFormProps<T>,
	onSave: (data: T) => Promise<void> | void
) {
	const form = useForm<T>(props);
	const { handleSubmit, reset } = form;

	const [saveStatus, setSaveStatus] = useState<TSaveStatus>('idle');

	const handleFormSubmit = useCallback(
		async (data: T) => {
			try {
				setSaveStatus('saving');
				await onSave(data);
				setSaveStatus('saved');
				reset(data);
				setTimeout(() => setSaveStatus('idle'), 2000);
			} catch (error) {
				console.error('Form save error:', error);
				setSaveStatus('error');
				setTimeout(() => setSaveStatus('idle'), 3000);
			}
		},
		[onSave, reset]
	);

	const handleAutoSave = useCallback(
		() => handleSubmit(handleFormSubmit)(),
		[handleSubmit, handleFormSubmit]
	);

	return {
		...form,
		saveStatus,
		handleFormSubmit,
		handleAutoSave,
	};
}
