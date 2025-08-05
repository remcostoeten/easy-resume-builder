import { useAtomValue } from 'jotai/react';
import { resumeAtomWithMigration } from '@/store/resume-store';
import type { TResumeData } from '@/types/resume';

type TProps = {
  onMigrationComplete?: (data: TResumeData) => void;
};

export function useResumeMigration({ onMigrationComplete }: TProps = {}) {
  const resumeData = useAtomValue(resumeAtomWithMigration);
  
  // The migration will have happened automatically on first access
  // due to the atom's getter function
  
  // Optionally notify when migration is complete
  if (onMigrationComplete && resumeData) {
    onMigrationComplete(resumeData as unknown as TResumeData);
  }
  
  return {
    resumeData,
    isMigrated: true, // Will always be true after first access
  };
}
