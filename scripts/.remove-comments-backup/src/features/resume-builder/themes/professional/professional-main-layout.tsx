'use client';

import { useAtom } from 'jotai';
import * as React from 'react';
import { useState } from 'react';
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/shared/components/ui/resizable-panels';
import { reorderSections, resumeAtomWithMigration, toggleSection } from '@/store/resume-store';
import type { TResumeData, TResumeSection } from '@/types/resume';
import { ProfessionalEditingArea } from './professional-editing-area';
import { ProfessionalHeader } from './professional-header';
import { ProfessionalPreview } from './professional-preview';
import { ProfessionalSidebar } from './professional-sidebar';
export function ProfessionalMainLayout() {
	const [resumeData] = useAtom(resumeAtomWithMigration);
	const sections = resumeData.sections as unknown as readonly TResumeSection[];
	const [isPreviewMode, setIsPreviewMode] = useState(false);
	const [isEditMode, setIsEditMode] = useState(true);
	const [isSplitMode, setIsSplitMode] = useState(true);

	function handleToggleSection(sectionId: string) {
		toggleSection(sectionId);
	}

	function handleReorderSections(sections: readonly TResumeSection[]) {
		reorderSections(sections);
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
							<ResizablePanel
								defaultSize={editingSize}
								minSize={35}
								id='professional-editing-area'
								order={2}
							>
								<ProfessionalEditingArea
									sections={sections}
									resumeData={resumeData as unknown as TResumeData}
								/>
							</ResizablePanel>
							{isSplitMode && <ResizableHandle withHandle />}
						</>
					)}

					{(isSplitMode || isPreviewMode || (!isEditMode && !isSplitMode)) && (
						<ResizablePanel
							defaultSize={previewSize}
							minSize={25}
							id='professional-preview-area'
							order={3}
						>
							<ProfessionalPreview
								resumeData={resumeData as unknown as TResumeData}
							/>
						</ResizablePanel>
					)}
				</ResizablePanelGroup>
			</div>
		</div>
	);
}
