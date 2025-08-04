import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { ZodSchema } from 'zod';

export function useFormValidation<T extends Record<string, unknown>>(
	schema: ZodSchema<T>,
	defaultValues?: Partial<T>
) {
	return useForm<T>({
		resolver: zodResolver(schema),
		defaultValues,
		mode: 'onChange',
	});
}
