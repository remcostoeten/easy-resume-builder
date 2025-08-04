'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Keyboard } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/src/shared/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/src/shared/components/ui/tooltip';
import { SECTION_CONFIGS } from '@/src/core/config/section-configs';
import { cn } from '@/src/shared/utilities';
import { TResumeSection } from '@/src/types/resume';

type TProps = {
	readonly sections: readonly TResumeSection[];
	readonly activeSection: string;
	readonly onSectionChange: (sectionId: string) => void;
};

export function SectionTabs({ sections, activeSection, onSectionChange }: TProps) {
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);
	const [showKeyboardHint, setShowKeyboardHint] = useState(false);

	const enabledSections = sections
		.filter((section) => section.isEnabled)
		.sort((a, b) => a.order - b.order);
	const currentIndex = enabledSections.findIndex((section) => section.id === activeSection);

	function checkScrollState() {
		if (!scrollContainerRef.current) return;

		const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
		setCanScrollLeft(scrollLeft > 0);
		setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
	}

	function scrollToLeft() {
		if (!scrollContainerRef.current) return;
		scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
	}

	function scrollToRight() {
		if (!scrollContainerRef.current) return;
		scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
	}

	function goToPreviousSection() {
		if (currentIndex > 0) {
			onSectionChange(enabledSections[currentIndex - 1].id);
		}
	}

	function goToNextSection() {
		if (currentIndex < enabledSections.length - 1) {
			onSectionChange(enabledSections[currentIndex + 1].id);
		}
	}

	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (
				event.target instanceof HTMLInputElement ||
				event.target instanceof HTMLTextAreaElement
			) {
				return;
			}

			if (!showKeyboardHint && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
				setShowKeyboardHint(true);
				setTimeout(() => setShowKeyboardHint(false), 3000);
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
					const num = Number.parseInt(event.key);
					if (num >= 1 && num <= enabledSections.length) {
						event.preventDefault();
						onSectionChange(enabledSections[num - 1].id);
					}
					break;
				}
			}
		}

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [enabledSections, onSectionChange, showKeyboardHint, goToNextSection, goToPreviousSection]);

	useEffect(() => {
		checkScrollState();
		const container = scrollContainerRef.current;
		if (container) {
			container.addEventListener('scroll', checkScrollState);
			return () => container.removeEventListener('scroll', checkScrollState);
		}
	}, [checkScrollState]);

	useEffect(() => {
		if (!scrollContainerRef.current) return;

		const activeTab = scrollContainerRef.current.querySelector(
			`[data-section-id="${activeSection}"]`
		);
		if (activeTab) {
			activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
		}
	}, [activeSection]);

	return (
		<div className='border-b border-border bg-card relative'>
			<div className='flex items-center'>
				<div className='flex-shrink-0'>
					<Button
						variant='ghost'
						size='sm'
						onClick={scrollToLeft}
						disabled={!canScrollLeft}
						className={cn(
							'h-12 px-2 rounded-none border-r border-border transition-opacity',
							canScrollLeft ? 'opacity-100' : 'opacity-30'
						)}
					>
						<ChevronLeft className='h-4 w-4' />
					</Button>
				</div>

				<div ref={scrollContainerRef} className='flex-1 overflow-x-auto scrollbar-hidden'>
					<div className='flex min-w-max'>
						{enabledSections.map((section, index) => {
							const config = SECTION_CONFIGS[section.type];
							const IconComponent = config.icon;
							const isActive = section.id === activeSection;

							return (
								<TooltipProvider key={section.id}>
									<Tooltip>
										<TooltipTrigger asChild>
											<button
												data-section-id={section.id}
												onClick={() => onSectionChange(section.id)}
												className={cn(
													'relative flex items-center gap-2 px-6 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200',
													'hover:text-foreground hover:bg-accent/50 border-b-2 border-transparent min-h-[48px]',
													isActive
														? 'text-foreground bg-background border-b-primary'
														: 'text-muted-foreground'
												)}
											>
												<IconComponent className='h-4 w-4 flex-shrink-0' />
												<span>{section.title}</span>
												<span className='text-xs opacity-60 ml-1'>
													{index + 1}
												</span>

												{isActive && (
													<motion.div
														className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary'
														layoutId='activeTab'
														transition={{
															type: 'spring',
															stiffness: 500,
															damping: 30,
														}}
													/>
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

				<div className='flex-shrink-0'>
					<Button
						variant='ghost'
						size='sm'
						onClick={scrollToRight}
						disabled={!canScrollRight}
						className={cn(
							'h-12 px-2 rounded-none border-l border-border transition-opacity',
							canScrollRight ? 'opacity-100' : 'opacity-30'
						)}
					>
						<ChevronRight className='h-4 w-4' />
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
									className='h-8 w-8 p-0'
								>
									<ChevronLeft className='h-3 w-3' />
								</Button>
							</TooltipTrigger>
							<TooltipContent side='bottom' className='text-xs'>
								Previous section (←)
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>

					<div className='text-xs text-muted-foreground px-2'>
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
									className='h-8 w-8 p-0'
								>
									<ChevronRight className='h-3 w-3' />
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
									className='h-8 w-8 p-0 opacity-60 hover:opacity-100'
								>
									<Keyboard className='h-3 w-3' />
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
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					className='absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50'
				>
					<div className='bg-popover text-popover-foreground px-3 py-2 rounded-md shadow-lg border text-xs'>
						💡 Use ← → arrow keys or number keys (1-{enabledSections.length}) to
						navigate sections
					</div>
				</motion.div>
			)}
		</div>
	);
}
