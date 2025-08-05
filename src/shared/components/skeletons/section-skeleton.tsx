'use client';

import { EducationSkeleton } from './education-skeleton';
import { FormSectionSkeleton } from './form-section-skeleton';
import { PersonalInfoSkeleton } from './personal-info-skeleton';
import { SkeletonButton, SkeletonIcon, SkeletonText, SkeletonTitle } from './skeleton-factory';
import { SkillsSkeleton } from './skills-skeleton';
import { WorkExperienceSkeleton } from './work-experience-skeleton';

type TSectionType =
	| 'personal-info'
	| 'work-experience'
	| 'education'
	| 'skills'
	| 'projects'
	| 'certifications'
	| 'languages';

type TProps = {
	readonly sectionType: TSectionType;
	readonly isLoading?: boolean;
};

function ComingSoonSkeleton() {
	return (
		<FormSectionSkeleton titleWidth='medium'>
			<div className='flex flex-col items-center justify-center py-12 space-y-4'>
				<SkeletonIcon className='h-16 w-16 rounded-full' />
				<SkeletonTitle className='w-48 h-6' />
				<div className='space-y-2 text-center'>
					<SkeletonText className='w-96 h-4' />
					<SkeletonText className='w-80 h-4' />
				</div>
				<SkeletonButton className='w-40 h-10' />
			</div>
		</FormSectionSkeleton>
	);
}

export function SectionSkeleton({ sectionType, isLoading = true }: TProps) {
	if (!isLoading) return null;

	switch (sectionType) {
		case 'personal-info':
			return <PersonalInfoSkeleton />;

		case 'work-experience':
			return <WorkExperienceSkeleton cardCount={2} />;

		case 'education':
			return <EducationSkeleton cardCount={2} />;

		case 'skills':
			return <SkillsSkeleton cardCount={2} />;

		case 'projects':
		case 'certifications':
		case 'languages':
			return <ComingSoonSkeleton />;

		default:
			return <ComingSoonSkeleton />;
	}
}
