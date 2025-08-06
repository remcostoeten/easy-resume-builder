import { z } from 'zod';

export const TUpdateProfileSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters').optional(),
	email: z.string().email('Please enter a valid email address').optional(),
	image: z.string().url('Please enter a valid image URL').optional(),
});

export const TChangePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, 'Current password is required'),
		newPassword: z.string().min(8, 'Password must be at least 8 characters'),
		confirmPassword: z.string().min(1, 'Please confirm your password'),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

export type TUpdateProfile = z.infer<typeof TUpdateProfileSchema>;
export type TChangePassword = z.infer<typeof TChangePasswordSchema>;
