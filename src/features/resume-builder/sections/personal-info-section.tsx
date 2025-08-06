'use client';

import { Check, Save, User } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { AutoSaveIndicator } from '@/components/effects/auto-save-indicator';
import { PersistedInput } from '@/components/ui/persisted-input';
import { PersonalInfoSkeleton } from '@/shared/components/skeletons';
import { updatePersonalInfo } from '@/store/resume-store';
import type { TPersonalInfo } from '@/types/resume';
import { getFormData } from '@/utils/storage';
import { FormSection } from '../form/form-section';

type TProps = {
	readonly className?: string;
	readonly data: TPersonalInfo;
	readonly isLoading?: boolean;
};

export function PersonalInfoSection({ className, data, isLoading }: TProps) {
	const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

	if (isLoading) {
		return <PersonalInfoSkeleton />;
	}

	async function handleFormSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSaveStatus('saving');

		try {
			// Simulate async operation
			await new Promise((resolve) => {
				setTimeout(resolve, 1000);
			});

			// Get the latest data from localStorage
			const latestData = getFormData('personal-info') || {};
			updatePersonalInfo(latestData as any);

			setSaveStatus('saved');
			toast.success('Personal information saved!', {
				description: 'Your changes have been automatically saved.',
			});

			// Reset to idle after 2 seconds
			setTimeout(() => {
				setSaveStatus('idle');
			}, 2000);
		} catch (_error) {
			setSaveStatus('error');
			toast.error('Failed to save', {
				description:
					'There was an error saving your personal information. Please try again.',
			});
			setTimeout(() => {
				setSaveStatus('idle');
			}, 3000);
		}
	}

	return (
		<FormSection title='Personal Information' icon={<User className='h-5 w-5' />} isRequired>
			<form
				onSubmit={handleFormSubmit}
				className={`w-full max-w-4xl mx-auto space-y-6 ${className || ''}`}
			>
				{/* First Row - First Name & Last Name */}
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
					<div>
						<label
							htmlFor='firstName'
							className='block text-sm font-medium text-gray-700 mb-1'
						>
							First Name <span className='text-red-500'>*</span>
						</label>
						<PersistedInput
							id='firstName'
							formKey='personal-info'
							fieldName='firstName'
							placeholder='John'
							defaultValue={data.firstName}
						/>
					</div>

					<div>
						<label
							htmlFor='lastName'
							className='block text-sm font-medium text-gray-700 mb-1'
						>
							Last Name <span className='text-red-500'>*</span>
						</label>
						<PersistedInput
							id='lastName'
							formKey='personal-info'
							fieldName='lastName'
							placeholder='Doe'
							defaultValue={data.lastName}
						/>
					</div>
				</div>

				{/* Second Row - Email & Phone */}
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
					<div>
						<label
							htmlFor='email'
							className='block text-sm font-medium text-gray-700 mb-1'
						>
							Email <span className='text-red-500'>*</span>
						</label>
						<PersistedInput
							id='email'
							formKey='personal-info'
							fieldName='email'
							type='email'
							placeholder='john.doe@example.com'
							defaultValue={data.email}
						/>
					</div>

					<div>
						<label
							htmlFor='phone'
							className='block text-sm font-medium text-gray-700 mb-1'
						>
							Phone <span className='text-red-500'>*</span>
						</label>
						<PersistedInput
							id='phone'
							formKey='personal-info'
							fieldName='phone'
							type='tel'
							placeholder='+31 6 26 36 39 19'
							defaultValue={data.phone}
						/>
					</div>
				</div>

				{/* Third Row - Location & Job Title */}
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
					<div>
						<label
							htmlFor='location'
							className='block text-sm font-medium text-gray-700 mb-1'
						>
							Location <span className='text-red-500'>*</span>
						</label>
						<PersistedInput
							id='location'
							formKey='personal-info'
							fieldName='location'
							placeholder='New York, NY'
							defaultValue={data.location}
						/>
					</div>

					<div>
						<label
							htmlFor='jobTitle'
							className='block text-sm font-medium text-gray-700 mb-1'
						>
							Job Title
						</label>
						<PersistedInput
							id='jobTitle'
							formKey='personal-info'
							fieldName='jobTitle'
							placeholder='Software Engineer'
							defaultValue={data.jobTitle || ''}
						/>
					</div>
				</div>

				{/* Fourth Row - Website, Portfolio, LinkedIn */}
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					<div>
						<label
							htmlFor='website'
							className='block text-sm font-medium text-gray-700 mb-1'
						>
							Website
						</label>
						<PersistedInput
							id='website'
							formKey='personal-info'
							fieldName='website'
							type='url'
							placeholder='https://johndoe.com'
							defaultValue={data.website || ''}
						/>
					</div>

					<div>
						<label
							htmlFor='portfolio'
							className='block text-sm font-medium text-gray-700 mb-1'
						>
							Portfolio
						</label>
						<PersistedInput
							id='portfolio'
							formKey='personal-info'
							fieldName='portfolio'
							type='url'
							placeholder='https://portfolio.johndoe.com'
							defaultValue={data.portfolio || ''}
						/>
					</div>

					<div>
						<label
							htmlFor='linkedin'
							className='block text-sm font-medium text-gray-700 mb-1'
						>
							LinkedIn
						</label>
						<PersistedInput
							id='linkedin'
							formKey='personal-info'
							fieldName='linkedin'
							type='url'
							placeholder='https://linkedin.com/in/johndoe'
							defaultValue={data.linkedin || ''}
						/>
					</div>
				</div>

				{/* Fifth Row - GitHub, Twitter */}
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
					<div>
						<label
							htmlFor='github'
							className='block text-sm font-medium text-gray-700 mb-1'
						>
							GitHub
						</label>
						<PersistedInput
							id='github'
							formKey='personal-info'
							fieldName='github'
							type='url'
							placeholder='https://github.com/johndoe'
							defaultValue={data.github || ''}
						/>
					</div>

					<div>
						<label
							htmlFor='twitter'
							className='block text-sm font-medium text-gray-700 mb-1'
						>
							Twitter
						</label>
						<PersistedInput
							id='twitter'
							formKey='personal-info'
							fieldName='twitter'
							type='url'
							placeholder='https://twitter.com/johndoe'
							defaultValue={data.twitter || ''}
						/>
					</div>
				</div>

				{/* Fifth Row - Professional Summary */}
				<div>
					<label
						htmlFor='summary'
						className='block text-sm font-medium text-gray-700 mb-1'
					>
						Professional Summary
					</label>
					<PersistedInput
						id='summary'
						formKey='personal-info'
						fieldName='summary'
						placeholder='Brief overview of your professional background and key achievements...'
						defaultValue={data.summary || ''}
					/>
				</div>

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
						{saveStatus === 'idle' && <AutoSaveIndicator showIcon={false} />}
					</div>
				</div>
			</form>
		</FormSection>
	);
}
