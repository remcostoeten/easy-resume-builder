'use client';

import * as React from 'react';

import { useState } from 'react';
import { useSnapshot } from 'valtio';
import { ProfessionalEditingArea } from '@/features/resume-builder/editing/professional-editing-area';
import { ProfessionalPreview } from '@/features/resume-builder/preview/professional-preview';
import { ProfessionalSidebar } from '@/features/resume-builder/sidebar/professional-sidebar';
import { ProfessionalHeader } from './professional-header';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/shared/components/ui/resizable-panels';
import { resumeStore, resumeReducer } from '@/store/resume-store';
import { TResumeSection } from '@/types/resume';
import { convertStoreResumeData, convertStoreSections } from '@/utils/store-type-utils';
export function ProfessionalMainLayout() {
	const storeSnapshot = useSnapshot(resumeStore).data;
	const resumeData = convertStoreResumeData(storeSnapshot);
	const sections = convertStoreSections(storeSnapshot.sections);
	const [isPreviewMode, setIsPreviewMode] = useState(false);
	const [isEditMode, setIsEditMode] = useState(true);
	const [isSplitMode, setIsSplitMode] = useState(true);

	function handleToggleSection(sectionId: string) {
		resumeReducer({ type: 'TOGGLE_SECTION', sectionId });
	}

	function handleReorderSections(sections: readonly TResumeSection[]) {
		resumeReducer({ type: 'REORDER_SECTIONS', sections });
	}

	function handleTogglePreview() {
		setIsPreviewMode(!isPreviewMode);
		if (!isPreviewMode) {
			setIsEditMode(false);
			setIsSplitMode(false);
		} else {
			setIsEditMode(true);
			setIsSplitMode(true);
		}
	}

	function handleToggleEdit() {
		setIsEditMode(!isEditMode);
		if (!isEditMode) {
			setIsPreviewMode(false);
			setIsSplitMode(true);
		}
	}

	function handleToggleSplit() {
		setIsSplitMode(!isSplitMode);
		if (!isSplitMode) {
			setIsPreviewMode(false);
			setIsEditMode(true);
		}
	}

	function handlePreview() {
		console.log('Preview mode:', !isPreviewMode);
	}

	function handleDownload() {
		window.print();
	}

	function handleSettings() {
		console.log('Open settings');
	}

	const sidebarSize = isPreviewMode ? 0 : 20;
	const editingSize = isPreviewMode ? 0 : isSplitMode ? 50 : isEditMode ? 80 : 0;
	const previewSize = isPreviewMode ? 100 : isSplitMode ? 30 : isEditMode ? 0 : 100;

	return (
		<div className='h-screen bg-background'>
			<ProfessionalHeader
				onPreview={handlePreview}
				onDownload={handleDownload}
				onSettings={handleSettings}
				onTogglePreview={handleTogglePreview}
				onToggleEdit={handleToggleEdit}
				onToggleSplit={handleToggleSplit}
				isPreviewMode={isPreviewMode}
				isEditMode={isEditMode}
				isSplitMode={isSplitMode}
			/>

			<div className='h-[calc(100vh-73px)]'>
				<ResizablePanelGroup direction='horizontal' className='h-full'>
					{!isPreviewMode && (
						<>
							<ResizablePanel
								defaultSize={sidebarSize}
								minSize={15}
								maxSize={30}
								className='min-w-[280px]'
								id='professional-sidebar'
								order={1}
							>
								<ProfessionalSidebar
									sections={sections}
									onToggleSection={handleToggleSection}
									onReorderSections={handleReorderSections}
								/>
							</ResizablePanel>
							<ResizableHandle withHandle />
						</>
					)}

					{(isEditMode || isSplitMode) && !isPreviewMode && (
						<>
							<ResizablePanel defaultSize={editingSize} minSize={35} id='professional-editing-area' order={2}>
								<ProfessionalEditingArea
									sections={sections}
									resumeData={resumeData}
								/>
							</ResizablePanel>
							{isSplitMode && <ResizableHandle withHandle />}
						</>
					)}

					{(isSplitMode || isPreviewMode || (!isEditMode && !isSplitMode)) && (
						<ResizablePanel defaultSize={previewSize} minSize={25} id='professional-preview-area' order={3}>
							<ProfessionalPreview resumeData={resumeData} />
						</ResizablePanel>
					)}
				</ResizablePanelGroup>
			</div>
		</div>
	);
}
