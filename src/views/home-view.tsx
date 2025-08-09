'use client';

import { useAtomValue } from 'jotai/react';
import { ChevronDownIcon, LogOutIcon, UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
	lazy,
	memo,
	Suspense,
	useCallback,
	useDeferredValue,
	useState,
	useTransition,
} from 'react';
import { authClient } from '@/features/auth/client/auth-client';
import { LoginButton } from '@/features/auth/components/login-button';
import { useSession } from '@/features/auth/hooks/hooks';
import { PerformanceMonitor } from '@/shared/components/performance-monitor';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/shared/components/ui';
import { Avatar } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { LoadingSkeleton } from '@/shared/components/ui/loading-skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Separator } from '@/shared/components/ui/separator';
import type { Mutable } from '@/store/resume-store';
import { resumeAtom, setResumeDraft } from '@/store/resume-store';
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
const ProfessionalPreview = lazy(() =>
	import('../features/resume-builder/themes/professional/professional-preview').then((m) => ({
		default: m.ProfessionalPreview,
	}))
);

function HomeView() {
	const [isPreviewMode, setIsPreviewMode] = useState(false);
	const [isEditMode, setIsEditMode] = useState(true);
	const [isSplitMode, setIsSplitMode] = useState(true);
	const [isPending, startTransition] = useTransition();

	const { data: session, isLoading } = useSession();
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
	const [isSigningOut, setIsSigningOut] = useState(false);
	const router = useRouter();
	const resumeData: Mutable<TResumeData> = useAtomValue(resumeAtom);
	const deferredResumeData = useDeferredValue(resumeData);

	// Memoize expensive operations with useCallback
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

	// Auth-related functions
	function getInitials(name?: string | null) {
		if (!name) return 'U';
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}

	async function handleSignOut() {
		setIsSigningOut(true);
		setIsUserMenuOpen(false);

		try {
			await authClient.signOut();
			router.push('/login');
		} catch (error) {
			console.error('Sign out failed:', error);
		} finally {
			setIsSigningOut(false);
		}
	}

	function handleProfileClick() {
		setIsUserMenuOpen(false);
		router.push('/profile');
	}

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
								<Button variant='ghost' size='sm' onClick={handleDownload}>
									Export PDF
								</Button>
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

							{/* Auth Section */}
							{isLoading ? (
								<div className='flex items-center gap-2 px-3 py-2 h-auto opacity-50 pointer-events-none'>
									<div className='w-8 h-8 bg-muted rounded-full animate-pulse' />
									<div className='hidden sm:block w-20 h-4 bg-muted rounded animate-pulse' />
									<div className='w-4 h-4 bg-muted rounded animate-pulse' />
								</div>
							) : session ? (
								<Popover open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
									<PopoverTrigger asChild>
										<Button
											variant='ghost'
											className='flex items-center gap-2 px-3 py-2 h-auto hover:bg-accent'
										>
											<Avatar
												src={session.user.image || undefined}
												alt={session.user.name}
												fallback={getInitials(session.user.name)}
												size='sm'
											/>
											<span className='hidden sm:block text-sm font-medium'>
												{session.user.name}
											</span>
											<ChevronDownIcon className='h-4 w-4 text-muted-foreground' />
										</Button>
									</PopoverTrigger>

									<PopoverContent className='w-56 p-2' align='end'>
										<div className='flex flex-col space-y-1'>
											<div className='px-2 py-1.5 text-sm text-muted-foreground'>
												{session.user.email}
											</div>

											<Button
												variant='ghost'
												className='justify-start h-9 px-2'
												onClick={handleProfileClick}
											>
												<UserIcon className='mr-2 h-4 w-4' />
												Profile
											</Button>

											<Separator className='my-1' />

											<Button
												variant='ghost'
												className='justify-start h-9 px-2 text-red-600 hover:text-red-600 hover:bg-red-50'
												onClick={handleSignOut}
												disabled={isSigningOut}
											>
												<LogOutIcon className='mr-2 h-4 w-4' />
												{isSigningOut ? 'Signing out...' : 'Sign out'}
											</Button>
										</div>
									</PopoverContent>
								</Popover>
							) : (
								<LoginButton useModal />
							)}
						</div>
					</div>
				</header>

				{/* Main Content Area */}
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
										<ProfessionalEditingArea
											sections={
												(deferredResumeData?.sections ||
													[]) as unknown as readonly TResumeSection[]
											}
											resumeData={
												deferredResumeData as unknown as TResumeData
											}
										/>
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
