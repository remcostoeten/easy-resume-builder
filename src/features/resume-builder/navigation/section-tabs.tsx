'use client';

import { ChevronLeft, ChevronRight, Keyboard } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SECTION_CONFIGS } from '@/core/config/section-configs';
import { Button } from '@/shared/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { cn } from '@/shared/utilities';
import { Motion } from '@/shared/utilities/dynamic-motion';
import type { TResumeSection } from '@/types/resume';

type TProps = {
	readonly sections: readonly TResumeSection[];
	readonly activeSection: string;
	readonly onSectionChange: (sectionId: string) => void;
};

const SCROLL_AMOUNT = 200;
const KEYBOARD_HINT_DURATION = 3000;

export function SectionTabs({ sections, activeSection, onSectionChange }: TProps) {
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);
	const [showKeyboardHint, setShowKeyboardHint] = useState(false);

	// Memoize enabled sections to prevent unnecessary recalculations
	const enabledSections = sections
		.filter((section) => section.isEnabled)
		.sort((a, b) => a.order - b.order);

	const currentIndex = enabledSections.findIndex((section) => section.id === activeSection);

	// Optimize scroll state checking with useCallback
	const checkScrollState = useCallback(() => {
		if (!scrollContainerRef.current) return;

		const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
		const newCanScrollLeft = scrollLeft > 0;
		const newCanScrollRight = scrollLeft < scrollWidth - clientWidth - 1;

		// Only update state if values changed to prevent unnecessary re-renders
		setCanScrollLeft((prev) => (prev !== newCanScrollLeft ? newCanScrollLeft : prev));
		setCanScrollRight((prev) => (prev !== newCanScrollRight ? newCanScrollRight : prev));
	}, []);

	// Optimize scroll functions with useCallback
	const scrollToLeft = useCallback(() => {
		scrollContainerRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
	}, []);

	const scrollToRight = useCallback(() => {
		scrollContainerRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
	}, []);

	const goToPreviousSection = useCallback(() => {
		if (currentIndex > 0) {
			onSectionChange(enabledSections[currentIndex - 1].id);
		}
	}, [currentIndex, enabledSections, onSectionChange]);

	const goToNextSection = useCallback(() => {
		if (currentIndex < enabledSections.length - 1) {
			onSectionChange(enabledSections[currentIndex + 1].id);
		}
	}, [currentIndex, enabledSections, onSectionChange]);

	// Optimize keyboard handler with useCallback and debouncing
	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			// Skip if user is typing in form elements
			if (
				event.target instanceof HTMLInputElement ||
				event.target instanceof HTMLTextAreaElement ||
				event.target instanceof HTMLSelectElement ||
				(event.target as HTMLElement)?.contentEditable === 'true'
			) {
				return;
			}

			// Show keyboard hint for arrow keys
			if (!showKeyboardHint && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
				setShowKeyboardHint(true);
				setTimeout(() => setShowKeyboardHint(false), KEYBOARD_HINT_DURATION);
			}

			switch (event.key) {
				case 'ArrowLeft':
					event.preventDefault();
					goToPreviousSection();
					break;
				case 'ArrowRight':
					event.preventDefault();
					goToNextSection();
					break;
				default: {
					const num = Number.parseInt(event.key, 10);
					if (num >= 1 && num <= enabledSections.length && !Number.isNaN(num)) {
						event.preventDefault();
						onSectionChange(enabledSections[num - 1].id);
					}
					break;
				}
			}
		},
		[enabledSections, onSectionChange, showKeyboardHint, goToNextSection, goToPreviousSection]
	);

	// Keyboard event listener
	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown, { passive: false });
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [handleKeyDown]);

	// Scroll state observer
	useEffect(() => {
		checkScrollState();
		const container = scrollContainerRef.current;
		if (container) {
			// Use passive listener for scroll events
			container.addEventListener('scroll', checkScrollState, { passive: true });
			return () => container.removeEventListener('scroll', checkScrollState);
		}
	}, [checkScrollState]);

	// Auto-scroll to active tab
	useEffect(() => {
		if (!scrollContainerRef.current) return;

		const activeTab = scrollContainerRef.current.querySelector(
			`[data-section-id="${activeSection}"]`
		) as HTMLElement;

		if (activeTab) {
			// Use requestAnimationFrame for smoother scrolling
			requestAnimationFrame(() => {
				activeTab.scrollIntoView({
					behavior: 'smooth',
					block: 'nearest',
					inline: 'center',
				});
			});
		}
	}, [activeSection]);

	return (
		<nav
			className='border-b border-border bg-card relative'
			aria-label='Resume sections navigation'
		>
			<div className='flex items-center'>
				{/* Left scroll button */}
				<div className='flex-shrink-0'>
					<Button
						variant='ghost'
						size='sm'
						onClick={scrollToLeft}
						disabled={!canScrollLeft}
						aria-label='Scroll tabs left'
						className={cn(
							'h-12 px-2 rounded-none border-r border-border transition-opacity',
							canScrollLeft ? 'opacity-100' : 'opacity-30'
						)}
					>
						<ChevronLeft className='h-4 w-4' aria-hidden='true' />
					</Button>
				</div>

				{/* Scrollable tabs container */}
				<div
					ref={scrollContainerRef}
					className='flex-1 overflow-x-auto scrollbar-hidden'
					role='none'
				>
					<div className='flex min-w-max' role='none'>
						{enabledSections.map((section, index) => {
							const config = SECTION_CONFIGS[section.type];
							const IconComponent = config.icon;
							const isActive = section.id === activeSection;

							return (
								<TooltipProvider key={section.id}>
									<Tooltip>
										<TooltipTrigger asChild>
											<button
												type='button'
												id={`tab-${section.id}`}
												data-section-id={section.id}
												onClick={() => onSectionChange(section.id)}
												role='tab'
												aria-selected={isActive}
												aria-controls={`tabpanel-${section.id}`}
												tabIndex={isActive ? 0 : -1}
												className={cn(
													'relative flex items-center gap-2 px-6 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200',
													'hover:text-foreground hover:bg-accent/50 border-b-2 border-transparent min-h-[48px]',
													isActive
														? 'text-foreground bg-background border-b-primary'
														: 'text-muted-foreground'
												)}
											>
												<IconComponent
													className='h-4 w-4 flex-shrink-0'
													aria-hidden='true'
												/>
												<span>{section.title}</span>
												<span
													className='text-xs opacity-60 ml-1'
													aria-label={`Keyboard shortcut: ${index + 1}`}
												>
													{index + 1}
												</span>

												{isActive && (
													<Motion
														fallback={
															<div
																className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary'
																aria-hidden='true'
															/>
														}
													>
														{function render(m) {
															return (
																<m.m.div
																	className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary'
																	layoutId='activeTab'
																	transition={{
																		type: 'spring',
																		stiffness: 500,
																		damping: 30,
																	}}
																	aria-hidden='true'
																/>
															);
														}}
													</Motion>
												)}
											</button>
										</TooltipTrigger>
										<TooltipContent side='bottom' className='text-xs'>
											<div className='text-center'>
												<div>{section.title}</div>
												<div className='text-muted-foreground'>
													Press {index + 1} or use ← → arrows
												</div>
											</div>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							);
						})}
					</div>
				</div>

				{/* Right scroll button */}
				<div className='flex-shrink-0'>
					<Button
						variant='ghost'
						size='sm'
						onClick={scrollToRight}
						disabled={!canScrollRight}
						aria-label='Scroll tabs right'
						className={cn(
							'h-12 px-2 rounded-none border-l border-border transition-opacity',
							canScrollRight ? 'opacity-100' : 'opacity-30'
						)}
					>
						<ChevronRight className='h-4 w-4' aria-hidden='true' />
					</Button>
				</div>

				{/* Navigation controls */}
				<div className='flex-shrink-0 flex items-center gap-1 px-2 border-l border-border'>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant='ghost'
									size='sm'
									onClick={goToPreviousSection}
									disabled={currentIndex === 0}
									aria-label='Go to previous section'
									className='h-8 w-8 p-0'
								>
									<ChevronLeft className='h-3 w-3' aria-hidden='true' />
								</Button>
							</TooltipTrigger>
							<TooltipContent side='bottom' className='text-xs'>
								Previous section (←)
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>

					<div
						className='text-xs text-muted-foreground px-2'
						aria-live='polite'
						aria-label={`Section ${currentIndex + 1} of ${enabledSections.length}`}
					>
						{currentIndex + 1}/{enabledSections.length}
					</div>

					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant='ghost'
									size='sm'
									onClick={goToNextSection}
									disabled={currentIndex === enabledSections.length - 1}
									aria-label='Go to next section'
									className='h-8 w-8 p-0'
								>
									<ChevronRight className='h-3 w-3' aria-hidden='true' />
								</Button>
							</TooltipTrigger>
							<TooltipContent side='bottom' className='text-xs'>
								Next section (→)
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>

				{/* Keyboard shortcuts indicator */}
				<div className='flex-shrink-0 px-2'>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant='ghost'
									size='sm'
									aria-label='View keyboard shortcuts'
									className='h-8 w-8 p-0 opacity-60 hover:opacity-100'
								>
									<Keyboard className='h-3 w-3' aria-hidden='true' />
								</Button>
							</TooltipTrigger>
							<TooltipContent side='bottom' className='text-xs max-w-xs'>
								<div className='space-y-1'>
									<div className='font-medium'>Keyboard Shortcuts:</div>
									<div>← → Arrow keys to navigate</div>
									<div>1-9 Number keys for direct access</div>
									<div>Works when not typing in forms</div>
								</div>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</div>

			{/* Keyboard hint overlay */}
			{showKeyboardHint && (
				<div
					className='absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50 keyboard-hint'
					role='alert'
					aria-live='polite'
				>
					<div className='bg-popover text-popover-foreground px-3 py-2 rounded-md shadow-lg border text-xs'>
						💡 Use ← → arrow keys or number keys (1-{enabledSections.length}) to
						navigate sections
					</div>
				</div>
			)}
		</nav>
	);
}
