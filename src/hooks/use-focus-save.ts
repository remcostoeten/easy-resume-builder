import { useCallback, useEffect, useRef } from 'react';
import { useAtomValue } from 'jotai/react';
import { resumeAtom } from '@/store/resume-store';

function hasValidData(resumeData: any): boolean {
  if (!resumeData) return false;
  
  const personalInfo = resumeData.personalInfo;
  if (!personalInfo) return false;
  
  // Check if at least required fields have content
  const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'location'];
  const hasRequiredData = requiredFields.some(field => 
    personalInfo[field] && personalInfo[field].trim().length > 0
  );
  
  return hasRequiredData;
}

export function useFocusSave() {
  const resumeData = useAtomValue(resumeAtom);
  const saveOnBlurRef = useRef(false);
  const initialDataRef = useRef<string>('');

  function manualSave() {
    console.log('[FOCUS-SAVE] Manual save triggered');
  }

  const handleFocus = useCallback((event: React.FocusEvent) => {
    // Store the initial value when focus starts
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    initialDataRef.current = target.value;
    saveOnBlurRef.current = true;
  }, []);

  const handleBlur = useCallback((event: React.FocusEvent) => {
    if (!saveOnBlurRef.current) return;
    
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const currentValue = target.value;
    const hasChanged = currentValue !== initialDataRef.current;
    
    // Only save if the field value actually changed and has content
    if (hasChanged && currentValue.trim().length > 0) {
      console.log('[FOCUS-SAVE] Saving on blur for field:', target.name, 'value:', currentValue);
      manualSave();
    }
    
    saveOnBlurRef.current = false;
  }, [manualSave]);

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && saveOnBlurRef.current) {
      manualSave();
      saveOnBlurRef.current = false;
    }
  }, [manualSave]);

  const handleBeforeUnload = useCallback((event: BeforeUnloadEvent) => {
    if (saveOnBlurRef.current && hasValidData(resumeData)) {
      manualSave();
      saveOnBlurRef.current = false;
    }
  }, [manualSave, resumeData]);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleVisibilityChange, handleBeforeUnload]);

  return {
    onFocus: handleFocus,
    onBlur: handleBlur,
  };
}
