'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.3 }}
					className='w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-6'
				>
					<div className='text-muted-foreground'>{icon}</div>
				</motion.div>

				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.3, delay: 0.1 }}
					className='text-center space-y-3 mb-6'
				>
					<h3 className='text-lg font-semibold text-foreground'>{title}</h3>
					<p className='text-muted-foreground max-w-md leading-relaxed'>{description}</p>
				</motion.div>

				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.3, delay: 0.2 }}
				>
					<Button onClick={onAction} className='gap-2 bg-primary hover:bg-primary/90'>
						<Plus className='h-4 w-4' />
						{actionLabel}
					</Button>
				</motion.div>
			</CardContent>
		</Card>
	);
}
