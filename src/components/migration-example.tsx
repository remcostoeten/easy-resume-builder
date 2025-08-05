'use client';

import { useAtom } from 'jotai/react';
import { resumeAtomWithMigration, toggleSection, updatePersonalInfo } from '@/store/resume-store';
import { useResumeMigration } from '@/hooks/use-resume-migration';
import type { TPersonalInfoForm } from '@/features/resume-schemas/resume-schemas';

export function MigrationExample() {
  const [resumeData, setResumeData] = useAtom(resumeAtomWithMigration);
  
  // Alternative: use the migration hook with callback
  const { resumeData: migratedData, isMigrated } = useResumeMigration({
    onMigrationComplete: (data) => {
      console.log('Migration completed with data:', data.personalInfo);
    }
  });

  function handleToggleSection(sectionId: string) {
    // Option 1: Use the new helper function (recommended)
    toggleSection(sectionId);
    
    // Option 2: Update atom directly
    // setResumeData(prev => ({
    //   ...prev,
    //   sections: prev.sections.map(section =>
    //     section.id === sectionId
    //       ? { ...section, isEnabled: !section.isEnabled }
    //       : section
    //   ),
    //   updatedAt: new Date()
    // }));
  }

  function handleUpdatePersonalInfo(data: TPersonalInfoForm) {
    // Option 1: Use the new helper function (recommended)
    updatePersonalInfo(data);
    
    // Option 2: Update atom directly
    // setResumeData(prev => ({
    //   ...prev,
    //   personalInfo: {
    //     ...prev.personalInfo,
    //     ...data,
    //     updatedAt: new Date()
    //   },
    //   updatedAt: new Date()
    // }));
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Resume Migration Example</h2>
      
      <div className="mb-4">
        <p>Migration Status: {isMigrated ? '✅ Complete' : '⏳ In Progress'}</p>
        <p>Personal Info: {resumeData.personalInfo.firstName || 'No name set'}</p>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Sections:</h3>
        {resumeData.sections.map(section => (
          <div key={section.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={section.isEnabled}
              onChange={() => handleToggleSection(section.id)}
            />
            <span>{section.title}</span>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <button
          onClick={() => handleUpdatePersonalInfo({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com'
          })}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Update Personal Info
        </button>
      </div>
    </div>
  );
}
