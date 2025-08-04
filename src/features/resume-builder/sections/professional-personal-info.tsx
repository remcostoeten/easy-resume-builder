'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, User } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/src/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/ui/card';
import { FormField } from '../form/form-field';
import { resumeReducer } from '@/src/store/resume-store';
import { TPersonalInfo } from '@/src/types/resume';
import { TPersonalInfoForm, personalInfoSchema } from '../../resume-schemas';

export type TProfessionalPersonalInfoProps = {
	readonly data: TPersonalInfo;
};

export function ProfessionalPersonalInfo({ data }: TProfessionalPersonalInfoProps) {
	const {
		register,
		watch,
		formState: { errors },
	} = useForm<TPersonalInfoForm>({
		resolver: zodResolver(personalInfoSchema),
		defaultValues: {
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			phone: data.phone,
			location: data.location,
			website: data.website || '',
			linkedin: data.linkedin || '',
			github: data.github || '',
			summary: data.summary || '',
		},
		mode: 'onChange',
	});

	const _watchedValues = watch();

	// Auto-save on form changes
	useEffect(() => {
		const subscription = watch((value) => {
			// Only update if we have valid data
			if (value.firstName || value.lastName || value.email) {
				resumeReducer({
					type: 'UPDATE_PERSONAL_INFO',
					data: {
						firstName: value.firstName || '',
						lastName: value.lastName || '',
						email: value.email || '',
						phone: value.phone || '',
						location: value.location || '',
						website: value.website || '',
						linkedin: value.linkedin || '',
						github: value.github || '',
						summary: value.summary || '',
					},
				});
			}
		});
		return () => subscription.unsubscribe();
	}, [watch]);

	return (
		<div className='max-w-4xl mx-auto p-8 space-y-8'>
			<div className='flex items-center gap-3 mb-6'>
				<div className='w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center'>
					<User className='h-5 w-5 text-primary' />
				</div>
				<div>
					<h1 className='text-2xl font-semibold text-foreground'>Personal Information</h1>
					<p className='text-muted-foreground'>
						Your personal details and professional summary
					</p>
				</div>
			</div>

			<Card className='border-border bg-card'>
				<CardHeader className='pb-6'>
					<div className='flex items-center justify-between'>
						<CardTitle className='text-lg text-card-foreground'>
							Personal Information
						</CardTitle>
						<Button variant='outline' size='sm' className='gap-2 bg-transparent'>
							<Upload className='h-4 w-4' />
							Upload Photo
							<span className='text-xs text-muted-foreground ml-1'>
								JPG, PNG up to 2MB
							</span>
						</Button>
					</div>
				</CardHeader>

				<CardContent>
					<div className='space-y-6'>
						<div className='grid grid-cols-2 gap-6'>
							<FormField
								label='First Name'
								type='text'
								placeholder='John'
								required
								{...register('firstName')}
								error={errors.firstName?.message}
								hasError={Boolean(errors.firstName)}
							/>

							<FormField
								label='Last Name'
								type='text'
								placeholder='Doe'
								required
								{...register('lastName')}
								error={errors.lastName?.message}
								hasError={Boolean(errors.lastName)}
							/>
						</div>

						<div className='grid grid-cols-2 gap-6'>
							<FormField
								label='Email'
								type='email'
								placeholder='john@example.com'
								required
								{...register('email')}
								error={errors.email?.message}
								hasError={Boolean(errors.email)}
							/>

							<FormField
								label='Phone'
								type='tel'
								placeholder='+1 (555) 123-4567'
								{...register('phone')}
								error={errors.phone?.message}
								hasError={Boolean(errors.phone)}
							/>
						</div>

						<FormField
							label='Location'
							type='text'
							placeholder='New York, NY'
							{...register('location')}
							error={errors.location?.message}
							hasError={Boolean(errors.location)}
						/>

						<div className='grid grid-cols-2 gap-6'>
							<FormField
								label='Website'
								type='url'
								placeholder='https://johndoe.com'
								{...register('website')}
								error={errors.website?.message}
								hasError={Boolean(errors.website)}
							/>

							<FormField
								label='LinkedIn'
								type='url'
								placeholder='linkedin.com/in/johndoe'
								{...register('linkedin')}
								error={errors.linkedin?.message}
								hasError={Boolean(errors.linkedin)}
							/>
						</div>

						<FormField
							label='Professional Summary'
							type='textarea'
							placeholder='Brief overview of your professional background and career objectives...'
							{...register('summary')}
							error={errors.summary?.message}
							hasError={Boolean(errors.summary)}
							className='min-h-[120px]'
						/>

						<div className='text-center pt-4 border-t border-border'>
							<p className='text-sm text-muted-foreground'>
								✓ Changes are automatically saved as you type
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
