'use client';

import { Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from 'utilities';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';

/**
 * EmptyState Design Standards:
 * - Default padding: py-10 px-8 (provides balanced vertical and horizontal spacing)
 * - Icon size: w-12 h-12 (48px) with bg-muted/30 background
 * - Content gap: space-y-6 between sections
 * - Max content width: max-w-sm for description text
 * - Button style: Primary variant with Plus icon
 * These standards ensure consistency across all empty states in the application.
 */

type TProps = {
	readonly icon: ReactNode;
	readonly title: string;
	readonly description: string;
	readonly actionLabel: string;
	readonly onAction: () => void;
	readonly className?: string;
	readonly paddingClass?: string;
};

export function EmptyState({ icon, title, description, actionLabel, onAction, className, paddingClass }: TProps) {
	const defaultPadding = 'py-10 px-8';
	
	return (
		<Card className={cn('border-dashed border-2 border-muted-foreground/25', className)}>
			<CardContent className={cn('flex flex-col items-center justify-center', paddingClass || defaultPadding)}>
				<div className='w-12 h-12 bg-muted/30 rounded-full flex items-center justify-center empty-state-icon'>
					<div className='text-muted-foreground'>{icon}</div>
				</div>

				<div className='text-center space-y-3 mt-6 empty-state-content'>
					<h3 className='text-lg font-semibold text-foreground'>{title}</h3>
					<p className='text-muted-foreground max-w-sm leading-relaxed'>{description}</p>
				</div>

				<div className='empty-state-button mt-6'>
					<Button onClick={onAction} className='gap-2 bg-primary hover:bg-primary/90'>
						<Plus className='h-4 w-4' />
						{actionLabel}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
