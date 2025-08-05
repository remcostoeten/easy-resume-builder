'use client';

import { User, Save, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { updatePersonalInfo } from '@/store/resume-store';
import { PersistedInput } from '@/components/ui/persisted-input';
import { getFormData } from '@/utils/storage';
import type { TPersonalInfo } from '@/types/resume';
import { FormSection } from '../form/form-section';
import { AutoSaveIndicator } from '@/components/effects/auto-save-indicator';
import { PersonalInfoSkeleton } from '@/shared/components/skeletons';

type TProps = {
	readonly className?: string;
	readonly data: TPersonalInfo;
	readonly isLoading?: boolean;
};

export function PersonalInfoSection({ className, data, isLoading }: TProps) {
	if (isLoading) {
		return <PersonalInfoSkeleton />;
	}

	const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

	async function handleFormSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSaveStatus('saving');

		try {
			// Simulate async operation
			await new Promise(function(resolve) { setTimeout(resolve, 1000); });

			// Get the latest data from localStorage
			const latestData = getFormData('personal-info') || {};
			updatePersonalInfo(latestData as any);

			setSaveStatus('saved');

			// Reset to idle after 2 seconds
			setTimeout(function() { setSaveStatus('idle'); }, 2000);
		} catch (error) {
			setSaveStatus('error');
			setTimeout(function() { setSaveStatus('idle'); }, 3000);
		}
	}

	return (
		<FormSection
			title='Personal Information'
			icon={<User className='h-5 w-5' />}
			isRequired
		>
			<form
				onSubmit={handleFormSubmit}
				className={`space-y-6 ${className || ''}`}
			>
				{/* First Row - First Name & Last Name */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							First Name <span className='text-red-500'>*</span>
						</label>
						<PersistedInput
							formKey='personal-info'
							fieldName='firstName'
							placeholder='John'
							defaultValue={data.firstName}
						/>
					</div>
					
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Last Name <span className='text-red-500'>*</span>
						</label>
						<PersistedInput
							formKey='personal-info'
							fieldName='lastName'
							placeholder='Doe'
							defaultValue={data.lastName}
						/>
					</div>
				</div>

				{/* Second Row - Email & Phone */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Email <span className='text-red-500'>*</span>
						</label>
						<PersistedInput
							formKey='personal-info'
							fieldName='email'
							type='email'
							placeholder='john.doe@example.com'
							defaultValue={data.email}
						/>
					</div>
					
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Phone <span className='text-red-500'>*</span>
						</label>
						<PersistedInput
							formKey='personal-info'
							fieldName='phone'
							type='tel'
							placeholder='+31 6 26 36 39 19'
							defaultValue={data.phone}
						/>
					</div>
				</div>

				{/* Third Row - Location & Job Title */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Location <span className='text-red-500'>*</span>
						</label>
						<PersistedInput
							formKey='personal-info'
							fieldName='location'
							placeholder='New York, NY'
							defaultValue={data.location}
						/>
					</div>
					
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Job Title
						</label>
						<PersistedInput
							formKey='personal-info'
							fieldName='jobTitle'
							placeholder='Software Engineer'
							defaultValue={data.jobTitle || ''}
						/>
					</div>
				</div>

				{/* Fourth Row - Website, Portfolio, LinkedIn */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Website
						</label>
						<PersistedInput
							formKey='personal-info'
							fieldName='website'
							type='url'
							placeholder='https://johndoe.com'
							defaultValue={data.website || ''}
						/>
					</div>
					
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Portfolio
						</label>
						<PersistedInput
							formKey='personal-info'
							fieldName='portfolio'
							type='url'
							placeholder='https://portfolio.johndoe.com'
							defaultValue={data.portfolio || ''}
						/>
					</div>
					
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							LinkedIn
						</label>
						<PersistedInput
							formKey='personal-info'
							fieldName='linkedin'
							type='url'
							placeholder='https://linkedin.com/in/johndoe'
							defaultValue={data.linkedin || ''}
						/>
					</div>
				</div>
				
				{/* Fifth Row - GitHub, Twitter */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							GitHub
						</label>
						<PersistedInput
							formKey='personal-info'
							fieldName='github'
							type='url'
							placeholder='https://github.com/johndoe'
							defaultValue={data.github || ''}
						/>
					</div>
					
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Twitter
						</label>
						<PersistedInput
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
					<label className='block text-sm font-medium text-gray-700 mb-1'>
						Professional Summary
					</label>
					<PersistedInput
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
						{saveStatus === 'idle' && (
							<AutoSaveIndicator showIcon={false} />
						)}
					</div>
					
				</div>
			</form>
		</FormSection>
	);
}
