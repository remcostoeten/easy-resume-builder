'use client';

import { Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from 'utilities';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';

type TProps = {
	readonly icon: ReactNode;
	readonly title: string;
	readonly description: string;
	readonly actionLabel: string;
	readonly onAction: () => void;
	readonly className?: string;
};

export function EmptyState({ icon, title, description, actionLabel, onAction, className }: TProps) {
	return (
		<Card className={cn('border-dashed border-2 border-muted-foreground/25', className)}>
			<CardContent className='flex flex-col items-center justify-center py-12 px-8'>
				<div className='w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-6 empty-state-icon'>
					<div className='text-muted-foreground'>{icon}</div>
				</div>

				<div className='text-center space-y-3 mb-6 empty-state-content'>
					<h3 className='text-lg font-semibold text-foreground'>{title}</h3>
					<p className='text-muted-foreground max-w-md leading-relaxed'>{description}</p>
				</div>

				<div className='empty-state-button'>
					<Button onClick={onAction} className='gap-2 bg-primary hover:bg-primary/90'>
						<Plus className='h-4 w-4' />
						{actionLabel}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
