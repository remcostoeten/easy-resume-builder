'use client';

import { useAtomValue } from 'jotai/react';
import { EditingArea } from '@/features/resume-builder/editing/editing-area';
import { PreviewArea } from '@/features/resume-builder/preview/preview-area';
import { SectionsPanel } from '@/features/resume-builder/sidebar/sections-panel';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/shared/components/ui';
import { resumeAtomWithMigration, toggleSection, reorderSections } from '@/store/resume-store';
import { TResumeSection, TResumeData } from '@/types/resume';
import { useEffect } from 'react';
import { StorageDebug } from '@/components/debug/storage-debug';
// Import dev utils for debugging (only in development)
if (process.env.NODE_ENV === 'development') {
	import('@/utils/dev-utils');
}

export function MainLayout() {
	const resumeData = useAtomValue(resumeAtomWithMigration);
	const sections = resumeData.sections as unknown as readonly TResumeSection[];

	// Debug logging
	useEffect(() => {
		console.log('MainLayout render - store data:', {
			personalInfo: resumeData.personalInfo,
			sectionsCount: resumeData.sections.length,
			hasFirstName: !!resumeData.personalInfo.firstName,
			hasEmail: !!resumeData.personalInfo.email
		});
	}, [resumeData]);

	// Initialize sections if they're missing
	useEffect(() => {
		if (sections.length === 0) {
			console.log('Sections are empty, this should not happen with proper initialization');
		}
	}, [sections.length]);

	function handleToggleSection(sectionId: string) {
		toggleSection(sectionId);
	}

	function handleReorderSections(sections: readonly TResumeSection[]) {
		reorderSections(sections);
	}

	return (
		<div className='h-screen bg-background'>
			{process.env.NODE_ENV === 'development' && <StorageDebug />}
			<ResizablePanelGroup direction='horizontal' className='h-full'>
				<ResizablePanel
					defaultSize={20}
					minSize={15}
					maxSize={30}
					className='min-w-[280px]'
					id='sections-panel'
					order={1}
				>
					<div className='h-full p-4 border-r bg-sidebar'>
						<SectionsPanel
							sections={sections}
							onToggleSection={handleToggleSection}
							onReorderSections={handleReorderSections}
						/>
					</div>
				</ResizablePanel>

				<ResizableHandle withHandle />

				<ResizablePanel defaultSize={45} minSize={30} id='editing-area' order={2}>
					<div className='h-full overflow-auto'>
						<EditingArea sections={sections} resumeData={resumeData as unknown as TResumeData} />
					</div>
				</ResizablePanel>

				<ResizableHandle withHandle />

				<ResizablePanel defaultSize={35} minSize={25} id='preview-area' order={3}>
					<div className='h-full bg-muted/30 border-l'>
						<PreviewArea resumeData={resumeData as unknown as TResumeData} />
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
