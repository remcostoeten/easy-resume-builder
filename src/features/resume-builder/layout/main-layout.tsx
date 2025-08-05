'use client';

import { useSnapshot } from 'valtio';
import { EditingArea } from '@/features/resume-builder/editing/editing-area';
import { PreviewArea } from '@/features/resume-builder/preview/preview-area';
import { SectionsPanel } from '@/features/resume-builder/sidebar/sections-panel';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/shared/components/ui';
import { resumeStore, resumeReducer, initializeSections } from '@/store/resume-store';
import { TResumeSection } from '@/types/resume';
import { convertStoreResumeData, convertStoreSections } from '@/utils/store-type-utils';
import { useEffect } from 'react';
// Import dev utils for debugging (only in development)
if (process.env.NODE_ENV === 'development') {
	import('@/utils/dev-utils');
}

export function MainLayout() {
	const storeSnapshot = useSnapshot(resumeStore).data;
	const resumeData = convertStoreResumeData(storeSnapshot);
	const sections = convertStoreSections(storeSnapshot.sections);

	// Initialize sections if they're missing
	useEffect(() => {
		if (sections.length === 0) {
			initializeSections();
		}
	}, [sections.length]);

	function handleToggleSection(sectionId: string) {
		resumeReducer({ type: 'TOGGLE_SECTION', sectionId });
	}

	function handleReorderSections(sections: readonly TResumeSection[]) {
		resumeReducer({ type: 'REORDER_SECTIONS', sections });
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
						/>
					</div>
				</ResizablePanel>

				<ResizableHandle withHandle />

				<ResizablePanel defaultSize={45} minSize={30} id='editing-area' order={2}>
					<div className='h-full overflow-auto'>
						<EditingArea sections={sections} resumeData={resumeData} />
					</div>
				</ResizablePanel>

				<ResizableHandle withHandle />

				<ResizablePanel defaultSize={35} minSize={25} id='preview-area' order={3}>
					<div className='h-full bg-muted/30 border-l'>
						<PreviewArea resumeData={resumeData} />
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
