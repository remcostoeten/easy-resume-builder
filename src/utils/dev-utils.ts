import { resumeStore, resetStore, initializeSections } from '@/store/resume-store';

/**
 * Development utilities for debugging and managing the resume store
 * Available in browser console as window.devUtils
 */
export const devUtils = {
  // View current store state
  getStoreState: () => resumeStore.data,
  
  // View current sections
  getSections: () => resumeStore.data.sections,
  
  // Reset the entire store to default
  resetStore,
  
  // Initialize sections if missing
  initializeSections,
  
  // Check if sections are initialized
  hasSections: () => resumeStore.data.sections.length > 0,
  
  // Log current state for debugging
  debugState: () => {
    console.log('=== Resume Store Debug ===');
    console.log('Sections count:', resumeStore.data.sections.length);
    console.log('Sections:', resumeStore.data.sections);
    console.log('Work Experience count:', resumeStore.data.workExperience.length);
    console.log('Skills count:', resumeStore.data.skills.length);
    console.log('Personal Info:', resumeStore.data.personalInfo);
    console.log('========================');
  },
};

// Make available globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).devUtils = devUtils;
  console.log('🛠️ Dev utils available at window.devUtils');
  console.log('Available methods:', Object.keys(devUtils));
}
