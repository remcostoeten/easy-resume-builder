import { atom, getDefaultStore, createStore as jotaiCreateStore } from 'jotai';
import { proxy } from 'valtio';
import type {
  TResumeData,
  TResumeSection,
  TWorkItem,
  TSkillCategory,
  TPersonalInfo,
} from '@/types/resume';
import type { TPersonalInfoForm } from '@/features/resume-schemas/resume-schemas';
import { SECTION_CONFIGS } from '@/core/config/section-configs';

// ---------------------- Valtio store (for builder UI) ----------------------

// Utility type to convert all readonly properties in a deeply nested type to mutable
// This allows Valtio to mutate the state while still deriving from our readonly domain model types.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type Mutable<T> = {
  -readonly [P in keyof T]: T[P] extends object ? Mutable<T[P]> : T[P];
};

type TResumeState = {
  data: Mutable<TResumeData>;
};

function createDefaultSections(): Mutable<TResumeSection>[] {
  const now = new Date();
  
  return Object.values(SECTION_CONFIGS)
    .sort((a, b) => a.defaultOrder - b.defaultOrder)
    .map(config => ({
      id: `section-${config.type}`,
      createdAt: now,
      updatedAt: now,
      type: config.type,
      title: config.title,
      isEnabled: config.type === 'personal-info' || config.type === 'work-experience' || config.type === 'skills',
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

export const resumeStore = proxy<TResumeState>({ data: createEmptyResumeData() });

type TResumeAction =
  | { type: 'TOGGLE_SECTION'; sectionId: string }
  | { type: 'REORDER_SECTIONS'; sections: readonly TResumeSection[] }
  | { type: 'ADD_WORK_EXPERIENCE'; data: TWorkItem }
  | { type: 'UPDATE_WORK_EXPERIENCE'; id: string; data: TWorkItem }
  | { type: 'REMOVE_WORK_EXPERIENCE'; id: string }
  | { type: 'ADD_SKILL_CATEGORY'; data: TSkillCategory }
  | { type: 'UPDATE_SKILL_CATEGORY'; id: string; data: TSkillCategory }
  | { type: 'REMOVE_SKILL_CATEGORY'; id: string }
  | { type: 'UPDATE_PERSONAL_INFO'; data: TPersonalInfoForm }
  | { type: 'RESET_STORE' }
  | { type: 'INITIALIZE_SECTIONS' };

export function resumeReducer(action: TResumeAction): void {
  const { data } = resumeStore;

  switch (action.type) {
    case 'TOGGLE_SECTION': {
      const index: number = data.sections.findIndex((s) => s.id === action.sectionId);
      if (index !== -1) {
        data.sections[index] = { ...data.sections[index], isEnabled: !data.sections[index].isEnabled };
      }
      break;
    }

    case 'REORDER_SECTIONS': {
data.sections = action.sections.map((s) => ({ ...s })) as Mutable<TResumeSection>[];
      break;
    }

    case 'ADD_WORK_EXPERIENCE': {
data.workExperience = [...data.workExperience, action.data] as Mutable<TWorkItem>[];
      break;
    }

    case 'UPDATE_WORK_EXPERIENCE': {
data.workExperience = data.workExperience.map((w) => (w.id === action.id ? action.data : w)) as Mutable<TWorkItem>[];
      break;
    }

    case 'REMOVE_WORK_EXPERIENCE': {
data.workExperience = data.workExperience.filter((w) => w.id !== action.id) as Mutable<TWorkItem>[];
      break;
    }

    case 'ADD_SKILL_CATEGORY': {
data.skills = [...data.skills, action.data] as Mutable<TSkillCategory>[];
      break;
    }

    case 'UPDATE_SKILL_CATEGORY': {
data.skills = data.skills.map((c) => (c.id === action.id ? action.data : c)) as Mutable<TSkillCategory>[];
      break;
    }
case 'REMOVE_SKILL_CATEGORY': {
data.skills = data.skills.filter((c) => c.id !== action.id) as Mutable<TSkillCategory>[];
      break;
    }

    case 'UPDATE_PERSONAL_INFO': {
      const now: Date = new Date();
      data.personalInfo = {
        ...data.personalInfo,
        ...action.data,
        updatedAt: now,
} as Mutable<TPersonalInfo>;
      data.updatedAt = now;
      break;
    }

    case 'RESET_STORE': {
      const newData = createEmptyResumeData();
      Object.assign(data, newData);
      break;
    }

    case 'INITIALIZE_SECTIONS': {
      if (data.sections.length === 0) {
        data.sections = createDefaultSections();
      }
      break;
    }

    default: {
      // eslint-disable-next-line no-console
      console.warn(`Unhandled resumeReducer action: ${(action as any).type}`);
    }
  }
}

// ---------------------- Jotai helpers (for draft state) ----------------------

// Local, non-exported draft type
type TResumeDraft = Record<string, unknown> | Mutable<TResumeData>;

// Atom holding the current resume draft state
export const resumeDraftAtom = atom<TResumeDraft>(createEmptyResumeData());

// Replace the current draft with a shallow-merged version of the given update
export function setResumeDraft(update: Partial<TResumeDraft>): void {
  const store = getDefaultStore();
  const previous: TResumeDraft = store.get(resumeDraftAtom);
  const next: TResumeDraft = { ...previous, ...update };
  store.set(resumeDraftAtom, next);
}

// Clear the entire store back to its initial empty state
export function clearStore(): void {
  const store = getDefaultStore();
  store.set(resumeDraftAtom, {});
}

// Helper function to ensure sections are initialized
export function initializeSections(): void {
  resumeReducer({ type: 'INITIALIZE_SECTIONS' });
}

// Helper function to reset the entire store
export function resetStore(): void {
  resumeReducer({ type: 'RESET_STORE' });
}

// Factory for creating an isolated jotai store instance that also
// exposes helper actions bound to the isolated store.
export function createStore() {
  const store = jotaiCreateStore();

  // Bound helper replaces the current draft with a shallow-merged update
  function setResumeDraftBound(update: Partial<TResumeDraft>): void {
    const previous: TResumeDraft = store.get(resumeDraftAtom);
    const next: TResumeDraft = { ...previous, ...update };
    store.set(resumeDraftAtom, next);
  }

  // Bound helper clears the entire store back to its initial empty state
  function clearStoreBound(): void {
    store.set(resumeDraftAtom, {});
  }

  return {
    store,
    resumeDraftAtom,
    setResumeDraft: setResumeDraftBound,
    clearStore: clearStoreBound,
  } as const;
}
