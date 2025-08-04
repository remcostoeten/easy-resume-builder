'use client';

import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import { Label } from '@/src/components/ui/label';
import { Switch } from '@/src/components/ui/switch';
import { cn } from 'utilities';import { SECTION_CONFIGS } from '../../config/section-configs';
import type { TResumeSection } from '../../types/resume';

type TProps = {
	readonly section: TResumeSection;
	readonly onToggle: (sectionId: string) => void;
	readonly isDragging?: boolean;
	readonly dragHandleProps?: Record<string, unknown>;
};

export function SectionItem({ section, onToggle, isDragging, dragHandleProps }: TProps) {
	const config = SECTION_CONFIGS[section.type];
	const IconComponent = config.icon;

	function handleToggle() {
		if (!section.isRequired) {
			onToggle(section.id);
		}
	}

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.2 }}
			className={cn(
				'flex items-center gap-3 p-3 rounded-lg border bg-card transition-all duration-200',
				isDragging && 'shadow-lg scale-105 bg-accent',
				section.isEnabled && 'border-primary/50 bg-primary/5',
				!section.isEnabled && 'opacity-60'
			)}
		>
			<div
				{...dragHandleProps}
				className={cn(
					'cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted transition-colors',
					isDragging && 'cursor-grabbing'
				)}
				aria-label={`Drag to reorder ${section.title}`}
			>
				<GripVertical className='h-4 w-4 text-muted-foreground' />
			</div>

			<div className='flex items-center gap-2 flex-1 min-w-0'>
				<IconComponent className='h-4 w-4 text-muted-foreground flex-shrink-0' />
				<div className='flex-1 min-w-0'>
					<Label
						htmlFor={`section-${section.id}`}
						className={cn(
							'text-sm font-medium cursor-pointer truncate block',
							section.isRequired &&
								"after:content-['*'] after:ml-1 after:text-destructive"
						)}
					>
						{section.title}
					</Label>
					<p className='text-xs text-muted-foreground truncate'>{config.description}</p>
				</div>
			</div>

			<Switch
				id={`section-${section.id}`}
				checked={section.isEnabled}
				onCheckedChange={handleToggle}
				disabled={section.isRequired}
				aria-label={`Toggle ${section.title} section`}
			/>
		</motion.div>
	);
}
