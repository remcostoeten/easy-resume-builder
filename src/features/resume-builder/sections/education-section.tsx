'use client';

import { GraduationCap } from 'lucide-react';
import { EmptyState } from '@/shared/components/ui';
import type { TEducationItem } from '@/types/resume';
import { addEducation } from '@/store/resume-store';
import { nanoid } from 'nanoid';
import { FormSection } from '../form/form-section';

type TProps = {
	readonly data: readonly TEducationItem[];
};

export function EducationSection({ data }: TProps) {
	return (
		<FormSection title='Education' icon={<GraduationCap className='h-5 w-5' />}>
			<div className='space-y-4'>
				{data.length === 0 ? (
					<EmptyState
						icon={<GraduationCap className='h-8 w-8' />}
						title='No Education Added'
						description='Add your educational background, degrees, and academic achievements to showcase your qualifications.'
						actionLabel='Add Education'
						onAction={() =>
							addEducation({
								id: nanoid(),
								// The following fields reflect the simplified payload requested
								// and will be completed in the form after creation
								// Casting to any to align with helper expectations during initial add
								institution: 'New School',
								degree: 'Degree',
								startDate: '',
								endDate: '',
							} as any)
						}
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
