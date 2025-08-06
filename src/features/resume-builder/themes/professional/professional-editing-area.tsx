'use client';

import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { SECTION_CONFIGS } from '@/core/config/section-configs';
import { EmptyState } from '@/shared/components/ui';
import { LoadingSkeleton } from '@/shared/components/ui/loading-skeleton';
import type { TResumeData, TResumeSection } from '@/types/resume';
import { SectionTabs } from '../../navigation/section-tabs';

const EducationSection = lazy(() =>
	import('../../sections/education-section').then((m) => ({ default: m.EducationSection }))
);
const SkillsSection = lazy(() =>
	import('../../sections/skills-section').then((m) => ({ default: m.SkillsSection }))
);
const ProfessionalPersonalInfo = lazy(() =>
	import('./professional-personal-info').then((m) => ({ default: m.ProfessionalPersonalInfo }))
);
const ProfessionalProjects = lazy(() =>
	import('./professional-projects').then((m) => ({ default: m.ProfessionalProjects }))
);
const ProfessionalWorkExperience = lazy(() =>
	import('./professional-work-experience').then((m) => ({
		default: m.ProfessionalWorkExperience,
	}))
);

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
				return (
					<Suspense
						fallback={
							<LoadingSkeleton
								variant='form'
								lines={4}
								className='max-w-4xl mx-auto'
							/>
						}
					>
						<ProfessionalPersonalInfo data={resumeData.personalInfo} />
					</Suspense>
				);

			case 'work-experience':
				return (
					<Suspense
						fallback={
							<LoadingSkeleton
								variant='card'
								lines={2}
								className='max-w-4xl mx-auto'
							/>
						}
					>
						<ProfessionalWorkExperience data={resumeData.workExperience} />
					</Suspense>
				);

			case 'projects':
				return (
					<Suspense
						fallback={
							<LoadingSkeleton
								variant='card'
								lines={2}
								className='max-w-4xl mx-auto'
							/>
						}
					>
						<ProfessionalProjects />
					</Suspense>
				);

			case 'education':
				return (
					<Suspense
						fallback={
							<LoadingSkeleton
								variant='card'
								lines={2}
								className='max-w-4xl mx-auto'
							/>
						}
					>
						<EducationSection data={resumeData.education} />
					</Suspense>
				);

			case 'skills':
				return (
					<Suspense
						fallback={
							<LoadingSkeleton
								variant='form'
								lines={3}
								className='max-w-4xl mx-auto'
							/>
						}
					>
						<SkillsSection data={resumeData.skills} />
					</Suspense>
				);

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
					<div key={activeSection} className='min-h-full'>
						{renderSectionContent()}
					</div>
				</AnimatePresence>
			</div>
		</div>
	);
}
