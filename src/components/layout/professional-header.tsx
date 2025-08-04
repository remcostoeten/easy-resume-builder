'use client';

import { Download, Edit, Eye, EyeOff, Moon, Split, Sun } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';

type TProps = {
	readonly onPreview: () => void;
	readonly onDownload: () => void;
	readonly onSettings: () => void;
	readonly onTogglePreview?: () => void;
	readonly onToggleEdit?: () => void;
	readonly onToggleSplit?: () => void;
	readonly isPreviewMode?: boolean;
	readonly isEditMode?: boolean;
	readonly isSplitMode?: boolean;
};

export function ProfessionalHeader({
	onPreview,
	onDownload,
	onSettings,
	onTogglePreview,
	onToggleEdit,
	onToggleSplit,
	isPreviewMode = false,
	isEditMode = true,
	isSplitMode = true,
}: TProps) {
	const [isDarkMode, setIsDarkMode] = useState(true);

	function toggleTheme() {
		setIsDarkMode(!isDarkMode);
		document.documentElement.classList.toggle('light');
	}

	function handlePreview() {
		onTogglePreview?.();
		onPreview();
	}

	function handleEdit() {
		onToggleEdit?.();
	}

	function handleSplit() {
		onToggleSplit?.();
	}

	return (
		<header className='border-b bg-card px-6 py-4'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-4'>
					<div className='flex items-center gap-3'>
						<div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center'>
							<span className='text-primary-foreground font-bold text-sm'>R</span>
						</div>
						<div>
							<h1 className='text-lg font-semibold text-foreground'>
								Resume Builder
							</h1>
							<Badge
								variant='secondary'
								className='text-xs bg-primary/20 text-primary border-primary/30'
							>
								Professional
							</Badge>
						</div>
					</div>

					<div className='h-6 w-px bg-border ml-2' />

					<div className='flex items-center gap-1'>
						<Button variant='ghost' size='sm' className='text-xs'>
							Demo
						</Button>
						<Button variant='ghost' size='sm' className='text-xs'>
							Template: <span className='font-medium ml-1'>General</span>
						</Button>
					</div>
				</div>

				<div className='flex items-center gap-2'>
					<Button variant='ghost' size='sm' onClick={toggleTheme}>
						{isDarkMode ? <Sun className='h-4 w-4' /> : <Moon className='h-4 w-4' />}
					</Button>

					<div className='h-6 w-px bg-border' />

					<Button
						variant={isEditMode ? 'default' : 'ghost'}
						size='sm'
						onClick={handleEdit}
						className={isEditMode ? 'bg-primary text-primary-foreground' : ''}
					>
						<Edit className='h-4 w-4 mr-2' />
						Edit
					</Button>

					<Button
						variant={isSplitMode ? 'default' : 'ghost'}
						size='sm'
						onClick={handleSplit}
						className={isSplitMode ? 'bg-primary text-primary-foreground' : ''}
					>
						<Split className='h-4 w-4 mr-2' />
						Split
					</Button>

					<Button
						variant={isPreviewMode ? 'default' : 'ghost'}
						size='sm'
						onClick={handlePreview}
						className={isPreviewMode ? 'bg-primary text-primary-foreground' : ''}
					>
						{isPreviewMode ? (
							<EyeOff className='h-4 w-4 mr-2' />
						) : (
							<Eye className='h-4 w-4 mr-2' />
						)}
						{isPreviewMode ? 'Exit Preview' : 'Preview'}
					</Button>

					<Button
						className='bg-primary hover:bg-primary/90 text-primary-foreground'
						onClick={onDownload}
					>
						<Download className='h-4 w-4 mr-2' />
						Export PDF
					</Button>
				</div>
			</div>
		</header>
	);
}
