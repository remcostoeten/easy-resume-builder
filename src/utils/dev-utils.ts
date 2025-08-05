import { getDefaultStore } from 'jotai';
import { resetStore, initializeSections, resumeAtom } from '@/store/resume-store';

/**
 * Development utilities for debugging and managing the resume store
 * Available in browser console as window.devUtils
 */
export const devUtils = {
  // View current store state
  getStoreState: () => getDefaultStore().get(resumeAtom),
  
  // View current sections
  getSections: () => getDefaultStore().get(resumeAtom).sections,
  
  // Reset the entire store to default
  resetStore,
  
  // Initialize sections if missing
  initializeSections,
  
  // Check if sections are initialized
  hasSections: () => getDefaultStore().get(resumeAtom).sections.length > 0,
  
  // Clear localStorage data
  clearLocalStorage: () => {
    localStorage.removeItem('resume-builder-data');
    console.log('localStorage cleared - refresh to see empty state');
  },
  
  // View localStorage data
  getLocalStorageData: () => {
    const data = localStorage.getItem('resume-builder-data');
    return data ? JSON.parse(data) : null;
  },
  
  // Log current state for debugging
  debugState: () => {
    const state = getDefaultStore().get(resumeAtom);
    console.log('=== Resume Store Debug ===');
    console.log('Sections count:', state.sections.length);
    console.log('Sections:', state.sections);
    console.log('Work Experience count:', state.workExperience.length);
    console.log('Skills count:', state.skills.length);
    console.log('Personal Info:', state.personalInfo);
    console.log('Local Storage size:', new Blob([localStorage.getItem('resume-builder-data') || '']).size, 'bytes');
    console.log('========================');
  },
};

// Make available globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).devUtils = devUtils;
  console.log('🛠️ Dev utils available at window.devUtils');
  console.log('Available methods:', Object.keys(devUtils));
}
