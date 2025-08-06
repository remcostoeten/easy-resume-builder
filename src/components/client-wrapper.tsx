'use client';

import { getDefaultStore } from 'jotai';
import { useEffect } from 'react';
import { trackWebVitals } from '@/app/web-vitals';
import { SECTION_CONFIGS } from '@/core/config/section-configs';
import { logBundleSize } from '@/shared/utilities/performance';
import { preloadCriticalResources, preloadModulesOnIdle } from '@/shared/utilities/preload';
import type { Mutable } from '@/store/resume-store';
import { resumeAtom } from '@/store/resume-store';
import type { TResumeData, TResumeSection } from '@/types/resume';

function createDefaultSections(): Mutable<TResumeSection>[] {
	const now = new Date();

	return Object.values(SECTION_CONFIGS)
		.sort((a, b) => a.defaultOrder - b.defaultOrder)
		.map((config) => ({
			id: `section-${config.type}`,
			createdAt: now,
			updatedAt: now,
			type: config.type,
			title: config.title,
			isEnabled:
				config.type === 'personal-info' ||
				config.type === 'work-experience' ||
				config.type === 'skills',
			order: config.defaultOrder,
			isRequired: config.isRequired,
		})) as Mutable<TResumeSection>[];
}

function createEmptyResumeData(): Mutable<TResumeData> {
	const now: Date = new Date();

	return {
		id: 'resume-root',
		createdAt: now,
		updatedAt: now,
		personalInfo: {
			id: 'personal-info',
			createdAt: now,
			updatedAt: now,
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
			location: '',
		},
		workExperience: [],
		education: [],
		skills: [],
		sections: createDefaultSections(),
		metadata: {
			title: 'Untitled Resume',
			template: 'professional',
			lastModified: now,
		},
	} as Mutable<TResumeData>;
}

type TClientWrapperProps = {
	children: React.ReactNode;
};

export function ClientWrapper({ children }: TClientWrapperProps) {
	useEffect(() => {
		const store = getDefaultStore();
		store.set(resumeAtom, createEmptyResumeData());

		// Preload critical resources and modules
		preloadCriticalResources();
		preloadModulesOnIdle();

		// Start web vitals tracking
		trackWebVitals();

		// Log performance metrics in development
		if (process.env.NODE_ENV === 'development') {
			setTimeout(logBundleSize, 1000);
		}
	}, []);

	return <>{children}</>;
}
