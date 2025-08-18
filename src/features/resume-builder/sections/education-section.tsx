'use client';

import { GraduationCap } from 'lucide-react';
import { nanoid } from 'nanoid';
import { EmptyState } from '@/shared/components/ui';
import { Card, CardContent } from '@/shared/components/ui/card';
import { addEducation } from '@/store/resume-store';
import type { TEducationItem } from '@/types/resume';

type TProps = {
	readonly data: readonly TEducationItem[];
};

export function EducationSection({ data }: TProps) {
	return (
		<div className='max-w-4xl mx-auto p-8 space-y-8'>
			<div className='flex items-center gap-3 mb-6'>
				<div className='w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center'>
					<GraduationCap className='h-5 w-5 text-primary' />
				</div>
				<div>
					<h1 className='text-2xl font-semibold text-foreground'>Education</h1>
					<p className='text-muted-foreground'>
						Showcase your academic background and achievements
					</p>
				</div>
			</div>

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
							<Card key={item.id} className='hover:shadow-sm transition-shadow'>
								<CardContent className='p-6'>
									<h4 className='font-semibold text-lg'>{item.degree}</h4>
									<p className='text-muted-foreground'>{item.institution}</p>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
