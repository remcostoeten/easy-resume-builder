'use client';

import { Download, Edit, Eye, EyeOff, Moon, RotateCcw, Split, Sun, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AutoSaveIndicator } from '@/components/dashboard/auto-save-indicator';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { resetStore, setResumeDraft } from '@/store/resume-store';
import { clearAllFormData } from '@/utils/storage/form-storage';

type TProps = {
	readonly onPreview: () => void;
	readonly onDownload: () => void;
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
	onTogglePreview,
	onToggleEdit,
	onToggleSplit,
	isPreviewMode = false,
	isEditMode = true,
	isSplitMode = true,
}: TProps) {
	const [isDarkMode, setIsDarkMode] = useState(true);
	const [showRestartConfirm, setShowRestartConfirm] = useState(false);

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

	function handleRestart() {
		if (showRestartConfirm) {
			// Confirmed - clear everything
			clearAllFormData();
			resetStore();
			setShowRestartConfirm(false);
			console.log('🔄 Resume data cleared completely');
		} else {
			// First click - show confirmation
			setShowRestartConfirm(true);
			// Auto-hide confirmation after 3 seconds
			setTimeout(() => {
				setShowRestartConfirm(false);
			}, 3000);
		}
	}

	function prefillDemoCV() {
		const now = new Date();
		const demoData = {
			personalInfo: {
				id: 'personal-info-demo',
				createdAt: now,
				updatedAt: now,
				firstName: 'John',
				lastName: 'Doe',
				email: 'john.doe@example.com',
				phone: '+1 (555) 123-4567',
				location: 'San Francisco, CA',
				website: 'johndoe.dev',
				linkedin: 'linkedin.com/in/johndoe',
				github: 'github.com/johndoe',
				summary:
					'Experienced full-stack developer with 8+ years of experience building scalable web applications. Passionate about clean code, modern technologies, and delivering exceptional user experiences.',
			},
			workExperience: [
				{
					id: 'work-1',
					createdAt: now,
					updatedAt: now,
					company: 'TechCorp Solutions',
					position: 'Senior Full Stack Developer',
					location: 'San Francisco, CA',
					dateRange: {
						startDate: new Date('2020-01-01'),
						endDate: new Date('2024-01-01'),
						isCurrentPosition: false,
						dateFormat: 'month-year' as const,
					},
					description:
						'Led development of multiple high-traffic web applications using React, Node.js, and cloud infrastructure. Collaborated with cross-functional teams to deliver products used by 100k+ users.',
					achievements: [
						'Increased application performance by 40% through optimization techniques',
						'Mentored 3 junior developers, improving team productivity by 25%',
						'Implemented CI/CD pipeline reducing deployment time by 60%',
					],
				},
				{
					id: 'work-2',
					createdAt: now,
					updatedAt: now,
					company: 'StartupXYZ',
					position: 'Frontend Developer',
					location: 'Remote',
					dateRange: {
						startDate: new Date('2018-03-01'),
						endDate: new Date('2019-12-01'),
						isCurrentPosition: false,
						dateFormat: 'month-year' as const,
					},
					description:
						'Built responsive web applications using modern JavaScript frameworks. Worked closely with designers to implement pixel-perfect UI components.',
					achievements: [
						'Developed reusable component library used across 5+ projects',
						'Improved mobile user experience, increasing engagement by 30%',
					],
				},
			],
			education: [
				{
					id: 'edu-1',
					createdAt: now,
					updatedAt: now,
					institution: 'University of California, Berkeley',
					degree: 'Bachelor of Science',
					field: 'Computer Science',
					location: 'Berkeley, CA',
					dateRange: {
						startDate: new Date('2014-09-01'),
						endDate: new Date('2018-05-01'),
						isCurrentPosition: false,
						dateFormat: 'month-year' as const,
					},
					gpa: '3.8',
					achievements: [
						'Magna Cum Laude',
						"Dean's List - 6 semesters",
						'ACM Programming Contest Winner',
					],
				},
			],
			skills: [
				{
					id: 'skills-1',
					createdAt: now,
					updatedAt: now,
					name: 'Programming Languages',
					skills: [
						{
							id: 'skill-js',
							createdAt: now,
							updatedAt: now,
							name: 'JavaScript/TypeScript',
							proficiency: { level: 9, showLevel: true, displayType: 'bar' as const },
						},
						{
							id: 'skill-react',
							createdAt: now,
							updatedAt: now,
							name: 'React/Next.js',
							proficiency: { level: 9, showLevel: true, displayType: 'bar' as const },
						},
						{
							id: 'skill-node',
							createdAt: now,
							updatedAt: now,
							name: 'Node.js',
							proficiency: { level: 8, showLevel: true, displayType: 'bar' as const },
						},
						{
							id: 'skill-python',
							createdAt: now,
							updatedAt: now,
							name: 'Python',
							proficiency: { level: 7, showLevel: true, displayType: 'bar' as const },
						},
					],
					showGroupLabel: true,
				},
				{
					id: 'skills-2',
					createdAt: now,
					updatedAt: now,
					name: 'Tools & Technologies',
					skills: [
						{
							id: 'skill-docker',
							createdAt: now,
							updatedAt: now,
							name: 'Docker/Kubernetes',
							proficiency: { level: 7, showLevel: true, displayType: 'bar' as const },
						},
						{
							id: 'skill-aws',
							createdAt: now,
							updatedAt: now,
							name: 'AWS/GCP',
							proficiency: { level: 8, showLevel: true, displayType: 'bar' as const },
						},
						{
							id: 'skill-db',
							createdAt: now,
							updatedAt: now,
							name: 'PostgreSQL/MongoDB',
							proficiency: { level: 8, showLevel: true, displayType: 'bar' as const },
						},
					],
					showGroupLabel: true,
				},
			],
		};

		setResumeDraft(demoData);
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
						<Button
							variant='ghost'
							size='sm'
							className='text-xs'
							onClick={prefillDemoCV}
						>
							Prefill Demo CV
						</Button>
						<Button
							variant={showRestartConfirm ? 'destructive' : 'ghost'}
							size='sm'
							className={`text-xs ${
								showRestartConfirm
									? 'bg-destructive text-destructive-foreground'
									: ''
							}`}
							onClick={handleRestart}
							title={
								showRestartConfirm
									? 'Click again to confirm'
									: 'Clear all resume data'
							}
						>
							{showRestartConfirm ? (
								<>
									<Trash2 className='h-3 w-3 mr-1' />
									Confirm Clear?
								</>
							) : (
								<>
									<RotateCcw className='h-3 w-3 mr-1' />
									Restart
								</>
							)}
						</Button>
						<Button variant='ghost' size='sm' className='text-xs'>
							Template: <span className='font-medium ml-1'>General</span>
						</Button>
					</div>
				</div>

				<div className='flex items-center gap-2'>
					<AutoSaveIndicator variant='compact' />

					<div className='h-6 w-px bg-border' />

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
