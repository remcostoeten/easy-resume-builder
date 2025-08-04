'use client';

import { GraduationCap } from 'lucide-react';
import { FormSection } from '../form/form-section';
import { EmptyState } from '@/shared/components/ui';
import { TEducationItem } from '@/types/resume';

type TProps = {
	readonly data: readonly TEducationItem[];
};

export function EducationSection({ data }: TProps) {
	function handleAddEducation() {
		console.log('Add education functionality coming soon');
	}

	return (
		<FormSection title='Education' icon={<GraduationCap className='h-5 w-5' />}>
			<div className='space-y-4'>
				{data.length === 0 ? (
					<EmptyState
						icon={<GraduationCap className='h-8 w-8' />}
						title='No Education Added'
						description='Add your educational background, degrees, and academic achievements to showcase your qualifications.'
						actionLabel='Add Education'
						onAction={handleAddEducation}
					/>
				) : (
					<div className='space-y-4'>
						{data.map((item) => (
							<div key={item.id} className='p-4 border rounded-lg'>
								<h4 className='font-medium'>{item.degree}</h4>
								<p className='text-muted-foreground'>{item.institution}</p>
							</div>
						))}
					</div>
				)}
			</div>
		</FormSection>
	);
}
