'use client';

import { useAtomValue } from 'jotai';
import {
	lazy,
	memo,
	Suspense,
	useCallback,
	useDeferredValue,
	useState,
	useTransition,
} from 'react';
import { UserDropdown } from '@/features/auth/components';
import { PerformanceMonitor } from '@/shared/components/performance-monitor';
import { Button } from '@/shared/components/ui/button';
import { LoadingSkeleton } from '@/shared/components/ui/loading-skeleton';
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/shared/components/ui/resizable-panels';
import { TooltipButton } from '@/shared/components/ui';
import { type Mutable, resumeAtom, setResumeDraft } from '@/store/resume-store';
import type { TResumeData, TResumeSection } from '@/types/resume';

const ProfessionalSidebar = lazy(() =>
	import('../features/resume-builder/themes/professional/professional-sidebar').then((m) => ({
		default: m.ProfessionalSidebar,
	}))
);
const ProfessionalEditingArea = lazy(() =>
	import('../features/resume-builder/themes/professional/professional-editing-area').then(
		(m) => ({
			default: m.ProfessionalEditingArea,
		})
	)
);
const ProfessionalPreview = lazy(function lazyProfessionalPreview() {
	return import('../features/resume-builder/themes/professional/professional-preview').then(
		function map(m) {
			return { default: m.ProfessionalPreview };
		}
	);
});

function HomeView() {
	const [isPreviewMode, setIsPreviewMode] = useState(false);
	const [isEditMode, setIsEditMode] = useState(true);
	const [isSplitMode, setIsSplitMode] = useState(true);
	const [isPending, startTransition] = useTransition();

	const resumeData: Mutable<TResumeData> = useAtomValue(resumeAtom);
	const deferredResumeData = useDeferredValue(resumeData);

	const handleToggleSection = useCallback(
		(sectionId: string) => {
			startTransition(() => {
				const sections = resumeData?.sections || [];
				const updatedSections = sections.map((section) =>
					section.id === sectionId
						? { ...section, isEnabled: !section.isEnabled }
						: section
				);
				setResumeDraft({ sections: updatedSections });
			});
		},
		[resumeData?.sections]
	);

	const handleReorderSections = useCallback((sections: readonly TResumeSection[]) => {
		startTransition(() => {
			setResumeDraft({
				sections: sections.map((s) => ({ ...s })),
			});
		});
	}, []);

	const handleTogglePreview = useCallback(() => {
		startTransition(() => {
			setIsPreviewMode(!isPreviewMode);
			if (!isPreviewMode) {
				setIsEditMode(false);
				setIsSplitMode(false);
			} else {
				setIsEditMode(true);
				setIsSplitMode(true);
			}
		});
	}, [isPreviewMode]);

	const handleToggleEdit = useCallback(() => {
		const newEditMode = !isEditMode;
		startTransition(() => {
			setIsEditMode(newEditMode);
			if (newEditMode) {
				setIsPreviewMode(false);
				setIsSplitMode(true);
			}
		});
	}, [isEditMode]);

	const handleToggleSplit = useCallback(() => {
		startTransition(() => {
			setIsSplitMode(!isSplitMode);
			if (!isSplitMode) {
				setIsPreviewMode(false);
				setIsEditMode(true);
			}
		});
	}, [isSplitMode]);

	const _handlePreview = useCallback(() => {
		console.log('Preview mode:', !isPreviewMode);
	}, [isPreviewMode]);

	const handleDownload = useCallback(() => {
		// Use modern printing with better performance
		if (typeof window !== 'undefined' && window.print) {
			window.print();
		}
	}, []);

	const sidebarSize = isPreviewMode ? 0 : 20;
	const editingSize = isPreviewMode ? 0 : isSplitMode ? 50 : isEditMode ? 80 : 0;
	const previewSize = isPreviewMode ? 100 : isSplitMode ? 30 : isEditMode ? 0 : 100;

	return (
		<>
			<PerformanceMonitor />
			<div
				className='h-screen bg-background flex flex-col'
				style={isPending ? { opacity: 0.8 } : undefined}
			>
				{/* Professional Header */}
				<header className='flex-none border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
					<div className='flex items-center justify-between px-6 py-4'>
						{/* Brand & Logo */}
						<div className='flex items-center gap-3'>
							<div className='flex items-center gap-3'>
								<div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center'>
									<span className='text-primary-foreground font-bold text-sm'>
										E
									</span>
								</div>
								<div className='flex flex-col'>
									<h1 className='text-lg font-semibold leading-tight'>
										Easy Resume
									</h1>
									<span className='text-xs text-muted-foreground'>
										Professional Builder
									</span>
								</div>
							</div>
						</div>

						{/* Navigation & Actions */}
						<div className='flex items-center gap-4'>
							{/* Quick Actions */}
							<nav className='hidden md:flex items-center gap-1'>
								<TooltipButton label='Export PDF' onClick={handleDownload}>This is still being built!</TooltipButton>
									<Button
									variant={
										isEditMode && !isPreviewMode && !isSplitMode
											? 'default'
											: 'ghost'
									}
									size='sm'
									onClick={handleToggleEdit}
								>
									Edit
								</Button>
								<Button
									variant={isSplitMode ? 'default' : 'ghost'}
									size='sm'
									onClick={handleToggleSplit}
								>
									Split
								</Button>
								<Button
									variant={isPreviewMode ? 'default' : 'ghost'}
									size='sm'
									onClick={handleTogglePreview}
								>
									{isPreviewMode ? 'Exit Preview' : 'Preview'}
								</Button>
							</nav>

							{/* Separator */}
							<div className='h-6 w-px bg-border hidden md:block' />

							{/* <HeaderThemeToggle /> */}
							<UserDropdown />
						</div>
					</div>
				</header>

				<main className='flex-1 min-h-0'>
					<ResizablePanelGroup direction='horizontal' className='h-full'>
						{!isPreviewMode && (
							<>
								<ResizablePanel
									defaultSize={sidebarSize}
									minSize={15}
									maxSize={30}
									className='min-w-[280px]'
								>
									<Suspense
										fallback={
											<LoadingSkeleton
												variant='list'
												lines={5}
												className='h-full bg-card border-r border-border'
											/>
										}
									>
										<ProfessionalSidebar
											sections={
												(deferredResumeData?.sections ||
													[]) as unknown as readonly TResumeSection[]
											}
											onToggleSection={handleToggleSection}
											onReorderSections={handleReorderSections}
										/>
									</Suspense>
								</ResizablePanel>
								<ResizableHandle withHandle />
							</>
						)}

						{(isEditMode || isSplitMode) && !isPreviewMode && (
							<>
								<ResizablePanel defaultSize={editingSize} minSize={35}>
									<Suspense
										fallback={
											<LoadingSkeleton
												variant='form'
												lines={4}
												className='h-full'
											/>
										}
									>
										<ProfessionalEditingArea />
									</Suspense>
								</ResizablePanel>
								{isSplitMode && <ResizableHandle withHandle />}
							</>
						)}

						{(isSplitMode || isPreviewMode || (!isEditMode && !isSplitMode)) && (
							<ResizablePanel defaultSize={previewSize} minSize={25}>
								<Suspense
									fallback={
										<LoadingSkeleton
											variant='preview'
											lines={4}
											className='h-full bg-card border-l border-border'
										/>
									}
								>
									<ProfessionalPreview />
								</Suspense>
							</ResizablePanel>
						)}
					</ResizablePanelGroup>
				</main>
			</div>
		</>
	);
}

// Memoize the entire component for better performance
export default memo(HomeView);

// Export named for backward compatibility
export { HomeView };
