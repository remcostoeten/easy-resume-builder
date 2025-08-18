'use client';

import { User } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { hasPersonalInfo } from '@/store/resume-store';
import type { TPersonalInfo } from '@/types/resume';
import { PersonalInfoForm } from './components/personal-info-form';

export type TProfessionalPersonalInfoProps = {
	readonly data: TPersonalInfo;
};

export function ProfessionalPersonalInfo({ data }: TProfessionalPersonalInfoProps) {
	const [showForm, setShowForm] = useState(hasPersonalInfo(data));

	function handleAddPersonalInfo() {
		setShowForm(true);
	}

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

			{!showForm && !hasPersonalInfo(data) ? (
				<EmptyState
					icon={<User className='h-8 w-8' />}
					title='Start Building Your Resume'
					description='Add your personal information to begin creating a professional resume. This includes your name, contact details, and a brief summary of your professional background.'
					actionLabel='Add Personal Information'
					onAction={handleAddPersonalInfo}
				/>
			) : (
				<PersonalInfoForm data={data} />
			)}
		</div>
	);
}
