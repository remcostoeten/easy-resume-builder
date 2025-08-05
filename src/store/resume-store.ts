import { atom, getDefaultStore } from 'jotai';
import { SECTION_CONFIGS } from '@/core/config/section-configs';
import { getItem, setItem } from '@/core/storage';
import type { TPersonalInfoForm } from '@/features/resume-schemas/resume-schemas';
import type { TResumeData, TResumeSection, TSkillCategory, TWorkItem } from '@/types/resume';

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

// Storage key for localStorage
const STORAGE_KEY = 'resume-builder-data';

function convertDates(obj: any): any {
	if (obj && typeof obj === 'object') {
		if (obj.createdAt) obj.createdAt = new Date(obj.createdAt);
		if (obj.updatedAt) obj.updatedAt = new Date(obj.updatedAt);
		if (obj.lastModified) obj.lastModified = new Date(obj.lastModified);
		if (obj.startDate) obj.startDate = new Date(obj.startDate);
		if (obj.endDate) obj.endDate = new Date(obj.endDate);

		Object.keys(obj).forEach((key) => {
			if (Array.isArray(obj[key])) {
				obj[key] = obj[key].map(convertDates);
			} else if (obj[key] && typeof obj[key] === 'object') {
				obj[key] = convertDates(obj[key]);
			}
		});
	}
	return obj;
}

function loadPersistedData(): Mutable<TResumeData> {
	const stored = getItem<any>(STORAGE_KEY);
	
	if (stored) {
		const converted = convertDates(stored);
		
		if (!converted.sections || converted.sections.length === 0) {
			converted.sections = createDefaultSections();
		}
		
		return converted;
	}
	
	return createEmptyResumeData();
}

function saveToStorage(data: Mutable<TResumeData>): void {
	setItem(STORAGE_KEY, data);
}

// ---------------------- Jotai store ----------------------

// Main atom that holds the resume data
export const resumeAtom = atom<Mutable<TResumeData>>(loadPersistedData());

// Enhanced atom with automatic persistence and timestamp updates
export const resumeAtomWithMigration = atom(
	(get) => get(resumeAtom),
	(
		get,
		set,
		update:
			| Partial<Mutable<TResumeData>>
			| ((prev: Mutable<TResumeData>) => Mutable<TResumeData>)
	) => {
		const current = get(resumeAtom);
		const next = typeof update === 'function' ? update(current) : { ...current, ...update };

		// Update timestamps
		const now = new Date();
		next.updatedAt = now;
		next.metadata = { ...next.metadata, lastModified: now };

		set(resumeAtom, next);

		// Save to localStorage
		saveToStorage(next);
	}
);

// Legacy draft atom for backward compatibility (now aliases to resumeAtom)
export const resumeDraftAtom = resumeAtomWithMigration;

// Replace the current draft with a shallow-merged version of the given update
export function setResumeDraft(update: Partial<Mutable<TResumeData>>): void {
	const store = getDefaultStore();
	store.set(resumeAtomWithMigration, update);
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
	const current = store.get(resumeAtom);
	const now = new Date();

	const updated = {
		...current,
		personalInfo: {
			...current.personalInfo,
			...data,
			updatedAt: now,
		},
		updatedAt: now,
		metadata: {
			...current.metadata,
			lastModified: now,
		},
	} as Mutable<TResumeData>;

	store.set(resumeAtom, updated);
	saveToStorage(updated);
}

// Toggle section enabled state using the new atom
export function toggleSection(sectionId: string): void {
	const store = getDefaultStore();
	const current = store.get(resumeAtom);

	const updatedSections = current.sections.map((section) =>
		section.id === sectionId ? { ...section, isEnabled: !section.isEnabled } : section
	);

	const updated = {
		...current,
		sections: updatedSections,
		updatedAt: new Date(),
	};

	store.set(resumeAtom, updated);
	saveToStorage(updated);
}

// Reorder sections using the new atom
export function reorderSections(sections: readonly TResumeSection[]): void {
	const store = getDefaultStore();
	const current = store.get(resumeAtom);

	const updated = {
		...current,
		sections: sections.map((s) => ({ ...s })),
		updatedAt: new Date(),
	};

	store.set(resumeAtom, updated);
	saveToStorage(updated);
}

// Add work experience using the new atom
export function addWorkExperience(data: TWorkItem): void {
	const store = getDefaultStore();
	const current = store.get(resumeAtom);

	const updated = {
		...current,
		workExperience: [...current.workExperience, data as any] as Mutable<TWorkItem>[],
		updatedAt: new Date(),
	} as Mutable<TResumeData>;

	store.set(resumeAtom, updated);
	saveToStorage(updated);
}

// Update work experience using the new atom
export function updateWorkExperience(id: string, data: TWorkItem): void {
	const store = getDefaultStore();
	const current = store.get(resumeAtom);

	const updated = {
		...current,
		workExperience: current.workExperience.map((item) => (item.id === id ? data : item)) as any,
		updatedAt: new Date(),
	} as Mutable<TResumeData>;

	store.set(resumeAtom, updated);
	saveToStorage(updated);
}

// Remove work experience using the new atom
export function removeWorkExperience(id: string): void {
	const store = getDefaultStore();
	const current = store.get(resumeAtom);

	const updated = {
		...current,
		workExperience: current.workExperience.filter((item) => item.id !== id),
		updatedAt: new Date(),
	};

	store.set(resumeAtom, updated);
	saveToStorage(updated);
}

// Add skill category using the new atom
export function addSkillCategory(data: TSkillCategory): void {
	const store = getDefaultStore();
	const current = store.get(resumeAtom);

	const updated = {
		...current,
		skills: [...current.skills, data] as Mutable<TSkillCategory>[],
		updatedAt: new Date(),
	} as Mutable<TResumeData>;

	store.set(resumeAtom, updated);
	saveToStorage(updated);
}

// Update skill category using the new atom
export function updateSkillCategory(id: string, data: TSkillCategory): void {
	const store = getDefaultStore();
	const current = store.get(resumeAtom);

	const updated = {
		...current,
		skills: current.skills.map((category) =>
			category.id === id ? data : category
		) as Mutable<TSkillCategory>[],
		updatedAt: new Date(),
	} as Mutable<TResumeData>;

	store.set(resumeAtom, updated);
	saveToStorage(updated);
}

// Remove skill category using the new atom
export function removeSkillCategory(id: string): void {
	const store = getDefaultStore();
	const current = store.get(resumeAtom);

	const updated = {
		...current,
		skills: current.skills.filter(
			(category) => category.id !== id
		) as Mutable<TSkillCategory>[],
		updatedAt: new Date(),
	} as Mutable<TResumeData>;

	store.set(resumeAtom, updated);
	saveToStorage(updated);
}

// Reset the entire resume to empty state
export function resetResume(): void {
	const store = getDefaultStore();
	const newData = createEmptyResumeData();
	store.set(resumeAtom, newData);
	saveToStorage(newData);
}

// Helper function to ensure sections are initialized
export function initializeSections(): void {
	const store = getDefaultStore();
	const current = store.get(resumeAtom);

	if (current.sections.length === 0) {
		const updated = {
			...current,
			sections: createDefaultSections(),
			updatedAt: new Date(),
		};

		store.set(resumeAtom, updated);
		saveToStorage(updated);
	}
}

// Helper function to reset the entire store
export function resetStore(): void {
	resetResume();
}
