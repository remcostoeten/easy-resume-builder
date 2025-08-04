'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

import { SectionTabs } from '../navigation/section-tabs';
import { EducationSection } from '../sections/education-section';
import { ProfessionalPersonalInfo } from '../sections/professional-personal-info';
import { ProfessionalProjects } from '../sections/professional-projects';
import { ProfessionalWorkExperience } from '../sections/professional-work-experience';
import { SkillsSection } from '../sections/skills-section';
import { SECTION_CONFIGS } from '@/src/core/config/section-configs';
import { EmptyState } from '@/src/shared/components/ui';
import { TResumeSection, TResumeData } from '@/src/types/resume';

export type TProfessionalEditingAreaProps = {
	readonly sections: readonly TResumeSection[];
	readonly resumeData: TResumeData;
};

export function ProfessionalEditingArea({ sections, resumeData }: TProfessionalEditingAreaProps) {
	const enabledSections = useMemo(
		() => sections.filter((section) => section.isEnabled).sort((a, b) => a.order - b.order),
		[sections]
	);

	const [activeSection, setActiveSection] = useState('');

	useEffect(() => {
		if (enabledSections.length > 0 && !enabledSections.find((s) => s.id === activeSection)) {
			setActiveSection(enabledSections[0].id);
		}
	}, [enabledSections, activeSection]);

	const currentSection = enabledSections.find((section) => section.id === activeSection);

	function renderSectionContent() {
		if (!currentSection) return null;

		const config = SECTION_CONFIGS[currentSection.type];
		const IconComponent = config.icon;

		switch (currentSection.type) {
			case 'personal-info':
				return <ProfessionalPersonalInfo data={resumeData.personalInfo} />;

			case 'work-experience':
				return <ProfessionalWorkExperience data={resumeData.workExperience} />;

			case 'projects':
				return <ProfessionalProjects />;

			case 'education':
				return <EducationSection data={resumeData.education} />;

			case 'skills':
				return <SkillsSection data={resumeData.skills} />;

			case 'certifications':
			case 'languages':
				return (
					<div className='max-w-4xl mx-auto p-8'>
						<EmptyState
							icon={<IconComponent className='h-8 w-8' />}
							title={`${currentSection.title} Coming Soon`}
							description={`The ${currentSection.title.toLowerCase()} section is currently under development. Check back soon for this feature!`}
							actionLabel={`Add ${currentSection.title}`}
							onAction={() =>
								console.log(`${currentSection.title} functionality coming soon`)
							}
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

	if (enabledSections.length === 0) {
		return (
			<div className='h-full flex items-center justify-center bg-background'>
				<div className='text-center max-w-md p-8'>
					<div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4'>
						<span className='text-2xl'>📝</span>
					</div>
					<h2 className='text-xl font-semibold mb-2 text-foreground'>
						No Sections Enabled
					</h2>
					<p className='text-muted-foreground'>
						Enable at least one section from the sidebar to start building your resume.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className='h-full flex flex-col'>
			<SectionTabs
				sections={enabledSections}
				activeSection={activeSection}
				onSectionChange={setActiveSection}
			/>

			<div className='flex-1 overflow-auto bg-background'>
				<AnimatePresence mode='wait'>
					<motion.div
						key={activeSection}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.2 }}
						className='min-h-full'
					>
						{renderSectionContent()}
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
}
