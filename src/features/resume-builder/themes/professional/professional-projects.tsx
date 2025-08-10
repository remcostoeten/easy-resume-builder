'use client';

import { Calendar, Code, ExternalLink, FolderOpen, Plus, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFormPersistence } from '@/hooks/use-form-persistence';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { FormGrid } from '../../form/form-grid';

type TProject = {
	id: string;
	name: string;
	url?: string;
	description: string;
	startDate: string;
	endDate?: string;
	technologies: string[];
};

type TProps = Record<string, never>;

export function ProfessionalProjects(_props: TProps) {
	const [isAddingNew, setIsAddingNew] = useState(false);
	const [projects, setProjects] = useState<TProject[]>([]);
	const [technologies, setTechnologies] = useState<string[]>([]);
	const [techInput, setTechInput] = useState('');

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm({
		mode: 'onChange',
	});

	function setAllFormValues(loadedData: Record<string, any>) {
		if (loadedData.projects) {
			setProjects(loadedData.projects);
		}
		if (loadedData.technologies) {
			setTechnologies(loadedData.technologies);
		}
		if (loadedData.techInput) {
			setTechInput(loadedData.techInput);
		}
	}

	const { loadFormData } = useFormPersistence({
		formKey: 'projects-form',
		onDataLoaded: setAllFormValues,
	});

	useEffect(() => {
		loadFormData();
	}, [loadFormData]);

	function handleAddNew() {
		setIsAddingNew(true);
	}

	function handleAddTechnology() {
		if (techInput.trim() && !technologies.includes(techInput.trim())) {
			setTechnologies([...technologies, techInput.trim()]);
			setTechInput('');
		}
	}

	function handleRemoveTechnology(tech: string) {
		setTechnologies(technologies.filter((t) => t !== tech));
	}

	function handleFormSubmit(data: any) {
		const newProject: TProject = {
			id: Date.now().toString(),
			name: data.name,
			url: data.url,
			description: data.description,
			startDate: data.startDate,
			endDate: data.endDate,
			technologies: technologies,
		};

		setProjects([...projects, newProject]);
		setIsAddingNew(false);
		setTechnologies([]);
		reset();
	}

	function handleCancel() {
		setIsAddingNew(false);
		setTechnologies([]);
		setTechInput('');
		reset();
	}

	return (
		<div className='max-w-4xl mx-auto p-8 space-y-8'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-3'>
					<div className='w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center'>
						<FolderOpen className='h-5 w-5 text-primary' />
					</div>
					<div>
						<h1 className='text-2xl font-semibold text-foreground'>Projects</h1>
						<p className='text-muted-foreground'>
							Showcase your personal projects, side work, and portfolio pieces
						</p>
					</div>
				</div>

				{!isAddingNew && projects.length > 0 && (
					<Button onClick={handleAddNew} className='gap-2 bg-primary hover:bg-primary/90'>
						<Plus className='h-4 w-4' />
						Add New Project
					</Button>
				)}
			</div>

			{isAddingNew && (
				<Card className='border-border bg-card'>
					<CardHeader>
						<div className='flex items-center justify-between'>
							<CardTitle className='text-lg text-card-foreground flex items-center gap-2'>
								<FolderOpen className='h-5 w-5 text-primary' />
								Add New Project
							</CardTitle>
							<Button
								variant='ghost'
								size='sm'
								onClick={handleCancel}
								className='gap-2'
							>
								<X className='h-4 w-4' />
								Cancel
							</Button>
						</div>
					</CardHeader>
					<CardContent className='space-y-6'>
						<form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
							<FormGrid columns={2}>
								<div className='space-y-2'>
									<Label htmlFor='project-name'>Project Name *</Label>
									<Input
										id='project-name'
										placeholder='e.g., E-commerce Dashboard, Personal Blog'
										{...register('name', {
											required: 'Project name is required',
										})}
									/>
									{errors.name && (
										<p className='text-sm text-destructive'>
											{errors.name.message as string}
										</p>
									)}
								</div>

								<div className='space-y-2'>
									<Label htmlFor='project-url'>Project URL</Label>
									<Input
										id='project-url'
										type='url'
										placeholder='https://github.com/username/project'
										{...register('url')}
									/>
								</div>
							</FormGrid>

							<div className='space-y-2'>
								<Label htmlFor='project-description'>Description *</Label>
								<Textarea
									id='project-description'
									placeholder='Describe what the project does, your role, and key achievements...'
									className='min-h-[100px]'
									{...register('description', {
										required: 'Description is required',
									})}
								/>
								{errors.description && (
									<p className='text-sm text-destructive'>
										{errors.description.message as string}
									</p>
								)}
							</div>

							<FormGrid columns={2}>
								<div className='space-y-2'>
									<Label htmlFor='start-date'>Start Date *</Label>
									<Input
										id='start-date'
										type='month'
										{...register('startDate', {
											required: 'Start date is required',
										})}
									/>
									{errors.startDate && (
										<p className='text-sm text-destructive'>
											{errors.startDate.message as string}
										</p>
									)}
								</div>

								<div className='space-y-2'>
									<Label htmlFor='end-date'>End Date</Label>
									<Input id='end-date' type='month' {...register('endDate')} />
									<p className='text-xs text-muted-foreground'>
										Leave empty if ongoing
									</p>
								</div>
							</FormGrid>

							<div className='space-y-4'>
								<Label>Technologies Used</Label>
								<div className='flex gap-2'>
									<Input
										placeholder='Add technology (React, Node.js, Python...)'
										value={techInput}
										onChange={(e) => setTechInput(e.target.value)}
										onKeyPress={(e) => {
											if (e.key === 'Enter') {
												e.preventDefault();
												handleAddTechnology();
											}
										}}
									/>
									<Button
										type='button'
										variant='outline'
										onClick={handleAddTechnology}
									>
										Enter
									</Button>
								</div>

								{technologies.length > 0 && (
									<div className='flex flex-wrap gap-2'>
										{technologies.map((tech) => (
											<Badge
												key={tech}
												variant='secondary'
												className='cursor-pointer hover:bg-destructive hover:text-destructive-foreground'
												onClick={() => handleRemoveTechnology(tech)}
											>
												{tech} ×
											</Badge>
										))}
									</div>
								)}
							</div>

							<div className='flex justify-end pt-6 border-t border-border'>
								<Button
									type='submit'
									disabled={!isValid}
									className='gap-2 bg-primary hover:bg-primary/90 text-primary-foreground'
								>
									<Save className='h-4 w-4' />
									Add Project
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			)}

			{!isAddingNew && projects.length > 0 && (
				<div className='space-y-4'>
					{projects.map((project) => (
						<Card
							key={project.id}
							className='border-border bg-card hover:bg-accent/50 transition-colors'
						>
							<CardContent className='p-6'>
								<div className='space-y-4'>
									<div className='flex items-start justify-between'>
										<div className='space-y-2'>
											<div className='flex items-center gap-2'>
												<h3 className='text-lg font-semibold text-card-foreground'>
													{project.name}
												</h3>
												{project.url && (
													<Button variant='ghost' size='sm' asChild>
														<a
															href={project.url}
															target='_blank'
															rel='noopener noreferrer'
														>
															<ExternalLink className='h-4 w-4' />
														</a>
													</Button>
												)}
											</div>

											<div className='flex items-center gap-4 text-sm text-muted-foreground'>
												<div className='flex items-center gap-1'>
													<Calendar className='h-4 w-4' />
													<span>
														{new Date(
															project.startDate
														).toLocaleDateString('en-US', {
															month: 'short',
															year: 'numeric',
														})}
														{project.endDate
															? ` - ${new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
															: ' - Present'}
													</span>
												</div>
											</div>
										</div>
									</div>

									<p className='text-muted-foreground leading-relaxed'>
										{project.description}
									</p>

									{project.technologies.length > 0 && (
										<div className='space-y-2'>
											<div className='flex items-center gap-2'>
												<Code className='h-4 w-4 text-primary' />
												<span className='text-sm font-medium'>
													Technologies:
												</span>
											</div>
											<div className='flex flex-wrap gap-2'>
												{project.technologies.map((tech) => (
													<Badge
														key={tech}
														variant='outline'
														className='text-xs'
													>
														{tech}
													</Badge>
												))}
											</div>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{!isAddingNew && projects.length === 0 && (
				<EmptyState
					icon={<FolderOpen className='h-8 w-8' />}
					title='No Projects Added'
					description='Showcase your personal projects, open-source contributions, or side work. Projects help demonstrate your practical skills and passion for development.'
					actionLabel='Add Your First Project'
					onAction={handleAddNew}
				/>
			)}
		</div>
	);
}
