import type { TResumeData, TResumeSection } from '@/types/resume';

/**
 * Converts mutable store data to the readonly types expected by components
 * This handles the type mismatch between Valtio proxy objects and our domain types
 */
export function convertStoreResumeData(storeData: any): TResumeData {
  return storeData as TResumeData;
}

/**
 * Converts mutable store sections to readonly sections expected by components
 */
export function convertStoreSections(storeSections: any): readonly TResumeSection[] {
  return storeSections as readonly TResumeSection[];
}
