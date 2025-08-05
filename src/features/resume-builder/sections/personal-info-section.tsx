'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Save, User } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/components/ui/button';
import { updatePersonalInfo } from '@/store/resume-store';
import type { TPersonalInfo } from '@/types/resume';
import { personalInfoSchema, type TPersonalInfoForm } from '../../resume-schemas';
import { FormField } from '../form/form-field';
import { FormGrid } from '../form/form-grid';
import { FormSection } from '../form/form-section';

type TProps = {
	readonly className?: string;
	readonly data: TPersonalInfo;
};

export function PersonalInfoSection({ className, data }: TProps) {
	const {
		register,
		handleSubmit,
		formState: { errors, isDirty, isValid },
		watch,
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

	const watchedValues = watch();
	const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

	const handleFormSubmit = useCallback((formData: TPersonalInfoForm) => {
		setSaveStatus('saving');
		try {
			updatePersonalInfo(formData);
			setSaveStatus('saved');
			setTimeout(() => setSaveStatus('idle'), 2000);
		} catch (error) {
			console.error('Failed to save form data:', error);
			setSaveStatus('error');
			setTimeout(() => setSaveStatus('idle'), 3000);
		}
	}, []);

	function handleAutoSave() {
		if (isDirty && isValid) {
			handleSubmit(handleFormSubmit)();
		}
	}
	useEffect(() => {
		if (!isDirty || !isValid) return;

		const timeoutId = setTimeout(() => {
			if (isDirty && isValid) {
				console.log('Auto-saving form data...', watchedValues);
			}
		}, 1000);

		return () => clearTimeout(timeoutId);
	}, [watchedValues, isDirty, isValid]);

	useEffect(() => {
		if (isDirty && saveStatus === 'saved') {
			setSaveStatus('idle');
		}
	}, [isDirty, saveStatus]);

	return (
		<FormSection title='Personal Information' icon={<User className='h-5 w-5' />} isRequired>
			<form
				onSubmit={handleSubmit(handleFormSubmit)}
				className={`space-y-6 ${className || ''}`}
			>
				<FormGrid columns={2}>
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
				</FormGrid>

				<FormGrid columns={2}>
					<FormField
						label='Email'
						type='email'
						placeholder='john.doe@example.com'
						required
						{...register('email')}
						error={errors.email?.message}
						hasError={Boolean(errors.email)}
					/>

					<FormField
						label='Phone'
						type='tel'
						placeholder='+1 (555) 123-4567'
						required
						{...register('phone')}
						error={errors.phone?.message}
						hasError={Boolean(errors.phone)}
					/>
				</FormGrid>

				<FormField
					label='Location'
					type='text'
					placeholder='New York, NY'
					required
					{...register('location')}
					error={errors.location?.message}
					hasError={Boolean(errors.location)}
				/>

				<FormGrid columns={3}>
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
						placeholder='https://linkedin.com/in/johndoe'
						{...register('linkedin')}
						error={errors.linkedin?.message}
						hasError={Boolean(errors.linkedin)}
					/>

					<FormField
						label='GitHub'
						type='url'
						placeholder='https://github.com/johndoe'
						{...register('github')}
						error={errors.github?.message}
						hasError={Boolean(errors.github)}
					/>
				</FormGrid>

				<FormField
					label='Professional Summary'
					type='textarea'
					placeholder='Brief overview of your professional background and key achievements...'
					{...register('summary')}
					error={errors.summary?.message}
					hasError={Boolean(errors.summary)}
				/>

				<div className='flex justify-between items-center pt-4'>
					<div className='flex items-center gap-2 text-sm'>
						{saveStatus === 'saving' && (
							<>
								<Save className='h-4 w-4 animate-spin text-blue-500' />
								<span className='text-blue-500'>Saving...</span>
							</>
						)}
						{saveStatus === 'saved' && (
							<>
								<Check className='h-4 w-4 text-green-500' />
								<span className='text-green-500'>Saved successfully</span>
							</>
						)}
						{saveStatus === 'error' && (
							<span className='text-red-500'>Failed to save</span>
						)}
						{saveStatus === 'idle' && (
							<span className='text-muted-foreground'>
								{isDirty ? 'Unsaved changes' : 'All changes saved'}
							</span>
						)}
					</div>
					<div className='flex gap-2'>
						<Button
							type='button'
							variant='outline'
							onClick={handleAutoSave}
							disabled={!isDirty || !isValid || saveStatus === 'saving'}
						>
							{saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
						</Button>
						<Button
							type='submit'
							disabled={!isDirty || !isValid || saveStatus === 'saving'}
						>
							{saveStatus === 'saving' ? 'Saving...' : 'Save & Continue'}
						</Button>
					</div>
				</div>
			</form>
		</FormSection>
	);
}
