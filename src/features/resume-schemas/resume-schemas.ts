import { z } from 'zod';

export const personalInfoSchema = z.object({
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'Last name is required'),
	email: z.string().email('Invalid email address'),
	phone: z.string().min(1, 'Phone number is required'),
	location: z.string().min(1, 'Location is required'),
	jobTitle: z.string().optional(),
	website: z
		.string()
		.optional()
		.refine((val) => !val || val === '' || z.string().url().safeParse(val).success, {
			message: 'Invalid URL format',
		}),
	portfolio: z
		.string()
		.optional()
		.refine((val) => !val || val === '' || z.string().url().safeParse(val).success, {
			message: 'Invalid URL format',
		}),
	linkedin: z
		.string()
		.optional()
		.refine(
			(val) =>
				!val || val === '' || z.string().url().safeParse(val).success || val.includes('linkedin.com'),
			{ message: 'Invalid LinkedIn URL format' }
		),
	github: z
		.string()
		.optional()
		.refine(
			(val) => !val || val === '' || z.string().url().safeParse(val).success || val.includes('github.com'),
			{ message: 'Invalid GitHub URL format' }
		),
	twitter: z
		.string()
		.optional()
		.refine(
			(val) => !val || val === '' || z.string().url().safeParse(val).success || val.includes('twitter.com'),
			{ message: 'Invalid Twitter URL format' }
		),
	summary: z.string().optional(),
});

export const dateRangeSchema = z.object({
	startDate: z.date(),
	endDate: z.date().optional(),
	isCurrentPosition: z.boolean(),
	dateFormat: z.enum(['year', 'month-year', 'full-date']),
});

export const workItemSchema = z.object({
	company: z.string().min(1, 'Company name is required'),
	position: z.string().min(1, 'Position is required'),
	location: z.string().min(1, 'Location is required'),
	dateRange: dateRangeSchema,
	description: z.string().min(1, 'Description is required'),
	achievements: z.array(z.string()),
});

export const skillProficiencySchema = z.object({
	level: z.number().min(1).max(10),
	showLevel: z.boolean(),
	displayType: z.enum(['bar', 'dots', 'text']),
});

export const skillSchema = z.object({
	name: z.string().min(1, 'Skill name is required'),
	proficiency: skillProficiencySchema.optional(),
});

export const skillCategorySchema = z.object({
	name: z.string().min(1, 'Category name is required'),
	skills: z.array(skillSchema),
	showGroupLabel: z.boolean(),
});

export const educationItemSchema = z.object({
	institution: z.string().min(1, 'Institution is required'),
	degree: z.string().min(1, 'Degree is required'),
	field: z.string().min(1, 'Field of study is required'),
	location: z.string().min(1, 'Location is required'),
	dateRange: dateRangeSchema,
	gpa: z.string().optional(),
	achievements: z.array(z.string()),
});

export type TPersonalInfoForm = z.infer<typeof personalInfoSchema>;
export type TWorkItemForm = z.infer<typeof workItemSchema>;
export type TSkillForm = z.infer<typeof skillSchema>;
export type TSkillCategoryForm = z.infer<typeof skillCategorySchema>;
export type TEducationItemForm = z.infer<typeof educationItemSchema>;
