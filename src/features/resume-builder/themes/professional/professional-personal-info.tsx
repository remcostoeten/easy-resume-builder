'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, User, Save, Check, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useFormPersistence } from '@/hooks/use-form-persistence';
import { personalInfoSchema, type TPersonalInfoForm } from '@/features/resume-schemas';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { updatePersonalInfo } from '@/store/resume-store';
import { getFormData, removeFormData } from '@/utils/storage';
import type { TPersonalInfo } from '@/types/resume';
import { FormField } from '../../form/form-field';
import { AutoSaveIndicator } from '@/components/effects/auto-save-indicator';

export type TProfessionalPersonalInfoProps = {
	readonly data: TPersonalInfo;
};

export function ProfessionalPersonalInfo({ data }: TProfessionalPersonalInfoProps) {
	const previousDataRef = useRef<string>('');
	const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
	
	const {
		reset,
		setValue,
		getValues,
		watch,
		formState: { errors, isDirty, isValid },
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

	const formValues = watch();

	const setAllFormValues = useCallback((loadedData: Record<string, any>) => {
		console.log('🔄 Loading form data from localStorage:', loadedData);
		Object.entries(loadedData).forEach(([key, value]) => {
			setValue(key as keyof TPersonalInfoForm, value);
		});
		console.log('✅ Form values after loading:', getValues());
	}, [setValue, getValues]);

	const { loadFormData, createChangeHandler, createBlurHandler } = useFormPersistence({
		formKey: 'personal-info',
		onDataLoaded: setAllFormValues,
	});

	function setValueWrapper(name: string, value: any) {
		setValue(name as keyof TPersonalInfoForm, value);
	}

	const handleChange = createChangeHandler(setValueWrapper, getValues);
	const handleBlur = createBlurHandler(setValueWrapper, getValues);


	useEffect(function() {
		loadFormData();
	}, []);

	async function handleFormSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSaveStatus('saving');

		try {
			// Simulate async operation
			await new Promise(resolve => setTimeout(resolve, 1000));

			// Get the latest data from localStorage
			const latestData = getFormData('personal-info') || {};
			updatePersonalInfo(latestData as any);

			setSaveStatus('saved');

			// Reset to idle after 2 seconds
			setTimeout(() => setSaveStatus('idle'), 2000);
		} catch (error) {
			setSaveStatus('error');
			setTimeout(() => setSaveStatus('idle'), 3000);
		}
	}


	// Debug form state on every render
	useEffect(() => {
		console.log('ProfessionalPersonalInfo FormState:', {
			isDirty,
			isValid,
			errors,
			formValues,
			saveStatus: 'N/A (using useForm, not useSmartForm)'
		});
	}, [isDirty, isValid, errors, formValues]);

	// Reset form when external data changes (cross-tab sync)
	useEffect(() => {
		const currentDataSerialized = JSON.stringify(data);
		if (previousDataRef.current && previousDataRef.current !== currentDataSerialized) {
			console.log('External data change detected, resetting form');
			reset({
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				phone: data.phone,
				location: data.location,
				website: data.website || '',
				linkedin: data.linkedin || '',
				github: data.github || '',
				summary: data.summary || '',
			});
		}
		previousDataRef.current = currentDataSerialized;
	}, [data, reset]);


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
							<div className='flex items-center gap-3'>
								<Button
									variant='ghost'
									size='sm'
									onClick={function() {
										removeFormData('personal-info');
										reset({
											firstName: '',
											lastName: '',
											email: '',
											phone: '',
											location: '',
											website: '',
											linkedin: '',
											github: '',
											summary: '',
										});
										console.log('🗑️ Personal info section cleared');
									}}
									title='Clear all form data'
									className='text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors px-3 py-2 h-8'
								>
									<Trash2 className='h-3.5 w-3.5 mr-1.5' />
									<span className='text-xs font-medium'>Clear Section</span>
								</Button>
								<div className='h-4 w-px bg-border' />
								<Button variant='outline' size='sm' className='gap-2 bg-transparent'>
									<Upload className='h-4 w-4' />
									Upload Photo
									<span className='text-xs text-muted-foreground ml-1'>
										JPG, PNG up to 2MB
									</span>
								</Button>
							</div>
					</div>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleFormSubmit} className='space-y-6'>
						<div className='grid grid-cols-2 gap-6'>
							<FormField
								label='First Name'
								name='firstName'
								type='text'
								placeholder='John'
								required
								value={formValues.firstName}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('firstName', e.target.value)}
								onBlur={(e: React.FocusEvent<HTMLInputElement>) => handleBlur('firstName', e.target.value)}
								error={errors.firstName?.message}
								hasError={Boolean(errors.firstName)}
							/>

							<FormField
								label='Last Name'
								name='lastName'
								type='text'
								placeholder='Doe'
								required
								value={formValues.lastName}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('lastName', e.target.value)}
								onBlur={(e: React.FocusEvent<HTMLInputElement>) => handleBlur('lastName', e.target.value)}
								error={errors.lastName?.message}
								hasError={Boolean(errors.lastName)}
							/>
						</div>

						<div className='grid grid-cols-2 gap-6'>
							<FormField
								label='Email'
								name='email'
								type='email'
								placeholder='john@example.com'
								required
								value={formValues.email}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('email', e.target.value)}
								onBlur={(e: React.FocusEvent<HTMLInputElement>) => handleBlur('email', e.target.value)}
								error={errors.email?.message}
								hasError={Boolean(errors.email)}
							/>

							<FormField
								label='Phone'
								name='phone'
								type='tel'
								placeholder='+1 (555) 123-4567'
								value={formValues.phone}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('phone', e.target.value)}
								onBlur={(e: React.FocusEvent<HTMLInputElement>) => handleBlur('phone', e.target.value)}
								error={errors.phone?.message}
								hasError={Boolean(errors.phone)}
							/>
						</div>

						<FormField
							label='Location'
							name='location'
							type='text'
							placeholder='New York, NY'
							value={formValues.location}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('location', e.target.value)}
							onBlur={(e: React.FocusEvent<HTMLInputElement>) => handleBlur('location', e.target.value)}
							error={errors.location?.message}
							hasError={Boolean(errors.location)}
						/>

						<div className='grid grid-cols-2 gap-6'>
							<FormField
								label='Website'
								name='website'
								type='url'
								placeholder='https://johndoe.com'
								value={formValues.website}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('website', e.target.value)}
								onBlur={(e: React.FocusEvent<HTMLInputElement>) => handleBlur('website', e.target.value)}
								error={errors.website?.message}
								hasError={Boolean(errors.website)}
							/>

							<FormField
								label='LinkedIn'
								name='linkedin'
								type='url'
								placeholder='linkedin.com/in/johndoe'
								value={formValues.linkedin}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('linkedin', e.target.value)}
								onBlur={(e: React.FocusEvent<HTMLInputElement>) => handleBlur('linkedin', e.target.value)}
								error={errors.linkedin?.message}
								hasError={Boolean(errors.linkedin)}
							/>
						</div>

						<FormField
							label='Professional Summary'
							name='summary'
							type='textarea'
							placeholder='Brief overview of your professional background and career objectives...'
							value={formValues.summary}
							onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('summary', e.target.value)}
							onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => handleBlur('summary', e.target.value)}
							error={errors.summary?.message}
							hasError={Boolean(errors.summary)}
								className='min-h-[120px]'
						/>

						{/* Save Status and Button */}
						<div className='flex justify-between items-center pt-4 border-t'>
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
									<AutoSaveIndicator showIcon={false} />
								)}
							</div>
							
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
