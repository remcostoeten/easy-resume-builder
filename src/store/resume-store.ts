import { atom, getDefaultStore } from 'jotai';
import { produce } from 'immer';
import { SECTION_CONFIGS } from '@/core/config/section-configs';
import type { TPersonalInfoForm } from '@/features/resume-schemas/resume-schemas';
import type { TResumeData, TResumeSection, TSkillCategory, TWorkItem, TEducationItem } from '@/types/resume';

// ---------------------- Jotai store ----------------------

// Utility type to convert all readonly properties in a deeply nested type to mutable
// This allows state mutations while still deriving from our readonly domain model types.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type Mutable<T> = {
	-readonly [P in keyof T]: T[P] extends object ? Mutable<T[P]> : T[P];
};

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

// ---------------------- Jotai store ----------------------

// Main atom that holds the resume data
export const resumeAtom = atom<Mutable<TResumeData>>(createEmptyResumeData());

// Replace the current draft with a shallow-merged version of the given update
export function setResumeDraft(update: Partial<Mutable<TResumeData>>): void {
	const store = getDefaultStore();
	store.set(resumeAtom, (prev) => ({ ...prev, ...update }));
}

// Clear the entire store back to its initial empty state
export function clearStore(): void {
	const store = getDefaultStore();
	store.set(resumeAtom, createEmptyResumeData());
}

// ---------------------- New Jotai helper functions ----------------------

// Update personal info using the new atom
export function updatePersonalInfo(data: TPersonalInfoForm): void {
	const store = getDefaultStore();
	store.set(resumeAtom, (prev) => {
		const now = new Date();
		return {
			...prev,
			personalInfo: { ...prev.personalInfo, ...data, updatedAt: now },
		};
	});
}

// Toggle section enabled state using the new atom
export function toggleSection(sectionId: string): void {
	const store = getDefaultStore();
	store.set(resumeAtom, (current) => {
		const updatedSections = current.sections.map((section) =>
			section.id === sectionId ? { ...section, isEnabled: !section.isEnabled } : section
		);

		return {
			...current,
			sections: updatedSections,
		};
	});
}

// Reorder sections using the new atom
export function reorderSections(sections: readonly TResumeSection[]): void {
	const store = getDefaultStore();
	store.set(resumeAtom, (current) => ({
		...current,
		sections: sections.map((s) => ({ ...s })),
	}));
}

// Add work experience using the new atom
export function addWorkExperience(data: TWorkItem): void {
	const store = getDefaultStore();
	store.set(resumeAtom, (current) => ({
		...current,
		workExperience: [...current.workExperience, data as any] as Mutable<TWorkItem>[],
	}));
}

// Update work experience using the new atom
export function updateWorkExperience(id: string, data: TWorkItem): void {
	const store = getDefaultStore();
	store.set(resumeAtom, (current) => ({
		...current,
		workExperience: current.workExperience.map((item) => (item.id === id ? data : item)) as any,
	}));
}

// Remove work experience using the new atom
export function removeWorkExperience(id: string): void {
	const store = getDefaultStore();
	store.set(resumeAtom, (current) => ({
		...current,
		workExperience: current.workExperience.filter((item) => item.id !== id),
	}));
}

// Add education using Immer-style draft mutation
export function addEducation(data: TEducationItem): void {
	const store = getDefaultStore();
	store.set(resumeAtom, (current) =>
		produce(current, (draft) => {
			// Ensure default empty array exists
			if (!draft.education) draft.education = [] as unknown as Mutable<TEducationItem>[];
			draft.education.push(data as unknown as Mutable<TEducationItem>);
		})
	);
}

// Update education using Immer-style draft mutation
export function updateEducation(id: string, data: TEducationItem): void {
	const store = getDefaultStore();
	store.set(resumeAtom, (current) =>
		produce(current, (draft) => {
			if (!draft.education) draft.education = [] as unknown as Mutable<TEducationItem>[];
			const idx = draft.education.findIndex((item) => item.id === id);
			if (idx !== -1) {
				draft.education[idx] = data as unknown as Mutable<TEducationItem>;
			}
		})
	);
}

// Remove education using Immer-style draft mutation
export function removeEducation(id: string): void {
	const store = getDefaultStore();
	store.set(resumeAtom, (current) =>
		produce(current, (draft) => {
			if (!draft.education) draft.education = [] as unknown as Mutable<TEducationItem>[];
			draft.education = draft.education.filter((item) => item.id !== id) as unknown as Mutable<TEducationItem>[];
		})
	);
}

// Add skill category using the new atom
export function addSkillCategory(data: TSkillCategory): void {
	const store = getDefaultStore();
	store.set(resumeAtom, (current) => ({
		...current,
		skills: [...current.skills, data] as Mutable<TSkillCategory>[],
	}));
}

// Update skill category using the new atom
export function updateSkillCategory(id: string, data: TSkillCategory): void {
	const store = getDefaultStore();
	store.set(resumeAtom, (current) => ({
		...current,
		skills: current.skills.map((category) =>
			category.id === id ? data : category
		) as Mutable<TSkillCategory>[],
	}));
}

// Remove skill category using the new atom
export function removeSkillCategory(id: string): void {
	const store = getDefaultStore();
	store.set(resumeAtom, (current) => ({
		...current,
		skills: current.skills.filter(
			(category) => category.id !== id
		) as Mutable<TSkillCategory>[],
	}));
}

// Reset the entire resume to empty state
export function resetResume(): void {
	const store = getDefaultStore();
	store.set(resumeAtom, createEmptyResumeData());
}

// Helper function to ensure sections are initialized
export function initializeSections(): void {
	const store = getDefaultStore();
	store.set(resumeAtom, (current) => {
		if (current.sections.length === 0) {
			return {
				...current,
				sections: createDefaultSections(),
			};
		}
		return current;
	});
}

// Helper function to reset the entire store
export function resetStore(): void {
	resetResume();
}
