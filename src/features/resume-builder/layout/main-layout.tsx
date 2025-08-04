'use client';

import { useSnapshot } from 'valtio';
import { EditingArea } from '../editing/editing-area';
import { PreviewArea } from '../preview/preview-area';
import { SectionsPanel } from '../sidebar/sections-panel';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/src/shared/components/ui';
import { resumeStore, resumeReducer } from '@/src/store/resume-store';
import { TResumeSection } from '@/src/types/resume';

export function MainLayout() {
	const resumeData = useSnapshot(resumeStore).data;

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
				>
					<div className='h-full p-4 border-r bg-sidebar'>
						<SectionsPanel
							sections={resumeData.sections}
							onToggleSection={handleToggleSection}
							onReorderSections={handleReorderSections}
						/>
					</div>
				</ResizablePanel>

				<ResizableHandle withHandle />

				<ResizablePanel defaultSize={45} minSize={30}>
					<div className='h-full overflow-auto'>
						<EditingArea sections={resumeData.sections} resumeData={resumeData} />
					</div>
				</ResizablePanel>

				<ResizableHandle withHandle />

				<ResizablePanel defaultSize={35} minSize={25}>
					<div className='h-full bg-muted/30 border-l'>
						<PreviewArea resumeData={resumeData} />
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
