'use client';

import { useAtomValue } from 'jotai/react';
import { useEffect, useState } from 'react';
import { EditingArea } from '@/features/resume-builder/editing/editing-area';
import { PreviewArea } from '@/features/resume-builder/preview/preview-area';
import { SectionsPanel } from '@/features/resume-builder/sidebar/sections-panel';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/shared/components/ui';
import { reorderSections, resumeAtom, toggleSection } from '@/store/resume-store';
import type { TResumeData, TResumeSection } from '@/types/resume';

export function MainLayout() {
	const resumeData = useAtomValue(resumeAtom);
	const sections = resumeData.sections as unknown as readonly TResumeSection[];
	const [isLoading, setIsLoading] = useState(false);

	useEffect(function() {
		console.log('MainLayout render - store data:', {
			personalInfo: resumeData.personalInfo,
			sectionsCount: resumeData.sections.length,
			hasFirstName: !!resumeData.personalInfo.firstName,
			hasEmail: !!resumeData.personalInfo.email,
		});
	}, [resumeData]);

	useEffect(function() {
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

	function handleToggleLoading(loading: boolean) {
		setIsLoading(loading);
		if (loading) {
			// Auto-hide after 3 seconds for demo purposes
			setTimeout(function() { setIsLoading(false); }, 3000);
		}
	}

	return (
		<div className='h-screen bg-background'>
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
							onToggleLoading={handleToggleLoading}
						/>
					</div>
				</ResizablePanel>

				<ResizableHandle withHandle />

				<ResizablePanel defaultSize={45} minSize={30} id='editing-area' order={2}>
					<div className='h-full overflow-auto'>
						<EditingArea
							sections={sections}
							resumeData={resumeData as unknown as TResumeData}
							isLoading={isLoading}
						/>
					</div>
				</ResizablePanel>

				<ResizableHandle withHandle />

				<ResizablePanel defaultSize={35} minSize={25} id='preview-area' order={3}>
					<div className='h-full bg-muted/30 border-l'>
						<PreviewArea />
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
