'use client';

import { SECTION_CONFIGS } from '@/core/config/section-configs';
import type { TResumeData, TResumeSection } from '@/types/resume';
import { EducationSection } from '../sections/education-section';
import { PersonalInfoSection } from '../sections/personal-info-section';
import { SkillsSection } from '../sections/skills-section';
import { WorkExperienceSection } from '../sections/work-experience-section';
import { EmptyState } from '../../shared/components/ui/empty-state';

type TProps = {
	readonly section: TResumeSection;
	readonly resumeData: TResumeData;
};

export function SectionRenderer({ section, resumeData }: TProps) {
	const config = SECTION_CONFIGS[section.type];
	const IconComponent = config.icon;

	switch (section.type) {
		case 'personal-info':
			return <PersonalInfoSection data={resumeData.personalInfo} />;

		case 'work-experience':
			return <WorkExperienceSection data={resumeData.workExperience} />;

		case 'education':
			return <EducationSection data={resumeData.education} />;

		case 'skills':
			return <SkillsSection data={resumeData.skills} />;

		case 'projects':
		case 'certifications':
		case 'languages':
			return (
				<div className='max-w-4xl mx-auto p-8'>
					<EmptyState
						icon={<IconComponent className='h-8 w-8' />}
						title={`${section.title} Coming Soon`}
						description={`The ${section.title.toLowerCase()} section is currently under development. Check back soon for this feature!`}
						actionLabel={`Add ${section.title}`}
						onAction={() => console.log(`${section.title} functionality coming soon`)}
					/>
				</div>
			);

		default:
			return (
				<div className='max-w-4xl mx-auto p-8'>
					<EmptyState
						icon={<IconComponent className='h-8 w-8' />}
						title='Unknown Section'
						description='This section type is not supported yet.'
						actionLabel='Go Back'
						onAction={() => console.log('Unknown section type')}
					/>
				</div>
			);
	}
}
