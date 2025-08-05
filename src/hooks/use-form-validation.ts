import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { ZodType, ZodTypeDef } from 'zod';

export function useFormValidation<T extends Record<string, unknown>>(
	schema: ZodType<T, ZodTypeDef, T>,
	defaultValues?: Partial<T>
) {
	return useForm<T>({
		resolver: zodResolver(schema as any),
		defaultValues: defaultValues as any,
		mode: 'onChange',
	});
}
