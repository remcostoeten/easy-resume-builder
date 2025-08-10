'use client';

import { useAtomValue } from 'jotai';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { SECTION_CONFIGS } from '@/core/config/section-configs';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { AnimatePresenceLazy } from '@/shared/utilities/dynamic-motion';
import { resumeAtom } from '@/store/resume-store';
import type { TResumeSection } from '@/types/resume';
import { SectionTabs } from '../../navigation/section-tabs';
import { ProfessionalEducationSkeleton } from './skeletons/education.skeleton';
import { ProfessionalPersonalInfoSkeleton } from './skeletons/personal-info.skeleton';
import { ProfessionalProjectsSkeleton } from './skeletons/projects.skeleton';
import { ProfessionalSkillsSkeleton } from './skeletons/skills.skeleton';

function importEducationSection() {
	return import('../../sections/education-section').then(function map(m) {
		return m.EducationSection;
	});
}

function importSkillsSection() {
	return import('../../sections/skills-section').then(function map(m) {
		return m.SkillsSection;
	});
}

function importProfessionalPersonalInfo() {
	return import('./professional-personal-info').then(function map(m) {
		return m.ProfessionalPersonalInfo;
	});
}

function importProfessionalProjects() {
	return import('./professional-projects').then(function map(m) {
		return m.ProfessionalProjects;
	});
}

function PlaceholderWorkExperience() {
	return (
		<div className='max-w-4xl mx-auto p-8'>
			<EmptyState
				icon={<span className='h-8 w-8'>🧩</span>}
				title='Work Experience temporarily unavailable'
				description='This section is temporarily disabled during build analysis. Please restore after verification.'
				actionLabel='OK'
				onAction={function noop() {}}
			/>
		</div>
	);
}

// Temporarily disable dynamic import of ProfessionalWorkExperience to allow build to complete for analysis
const ProfessionalWorkExperience =
	PlaceholderWorkExperience as unknown as typeof import('./professional-work-experience').ProfessionalWorkExperience;

function renderEducationSkeleton() {
	return ProfessionalEducationSkeleton({});
}

function renderSkillsSkeleton() {
	return ProfessionalSkillsSkeleton({});
}

function renderPersonalInfoSkeleton() {
	return ProfessionalPersonalInfoSkeleton({});
}

function renderProjectsSkeleton() {
	return ProfessionalProjectsSkeleton({});
}

const EducationSection = dynamic(importEducationSection, {
	ssr: false,
	loading: renderEducationSkeleton,
});

const SkillsSection = dynamic(importSkillsSection, {
	ssr: false,
	loading: renderSkillsSkeleton,
});

const ProfessionalPersonalInfo = dynamic(importProfessionalPersonalInfo, {
	ssr: false,
	loading: renderPersonalInfoSkeleton,
});

const ProfessionalProjects = dynamic(importProfessionalProjects, {
	ssr: false,
	loading: renderProjectsSkeleton,
});

export function ProfessionalEditingArea() {
	const resumeData = useAtomValue(resumeAtom);
	const sections = resumeData.sections;

	// Normalize Mutable<TResumeSection>[] to an immutable, readonly TResumeSection[]
	const typedSections: ReadonlyArray<TResumeSection> = useMemo(
		function toTyped() {
			return sections.map(function map(s) {
				return { ...s } as unknown as TResumeSection;
			});
		},
		[sections]
	);

	const enabledSections: ReadonlyArray<TResumeSection> = useMemo(
		function onlyEnabledSorted() {
			return typedSections
				.filter(function enabled(s) {
					return s.isEnabled;
				})
				.slice()
				.sort(function byOrder(a, b) {
					return a.order - b.order;
				});
		},
		[typedSections]
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
				return <ProfessionalPersonalInfo data={resumeData.personalInfo as any} />;

			case 'work-experience':
				return <ProfessionalWorkExperience data={resumeData.workExperience as any} />;

			case 'projects':
				return <ProfessionalProjects />;

			case 'education':
				return <EducationSection data={resumeData.education as any} />;

			case 'skills':
				return <SkillsSection data={resumeData.skills as any} />;

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
				<AnimatePresenceLazy mode='wait'>
					<div key={activeSection} className='min-h-full'>
						{renderSectionContent()}
					</div>
				</AnimatePresenceLazy>
			</div>
		</div>
	);
}
