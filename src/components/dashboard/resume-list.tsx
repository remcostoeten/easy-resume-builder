'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { deleteUserResume } from '@/features/resume/server/actions';
import type { TResume } from '@/features/resume/server/schemas';

type TProps = {
	initialResumes: TResume[];
};

export function ResumeList({ initialResumes }: TProps) {
	const [resumes, setResumes] = useState(initialResumes);
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	function handleCreateResume() {
		router.push('/dashboard/resume/create');
	}

	function handleEditResume(resumeId: number) {
		router.push(`/dashboard/resume/edit/${resumeId}`);
	}

	function handleDeleteResume(resumeId: number) {
		if (!confirm('Are you sure you want to delete this resume?')) {
			return;
		}

		startTransition(async () => {
			try {
				await deleteUserResume(resumeId);
				setResumes((prev) => prev.filter((resume) => resume.id !== resumeId));
			} catch (error) {
				console.error('Failed to delete resume:', error);
			}
		});
	}

	function formatDate(date: Date | string | null) {
		if (!date) return 'Never';
		const dateObj = typeof date === 'string' ? new Date(date) : date;
		return dateObj.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	}

	if (resumes.length === 0) {
		return (
			<div className='space-y-6'>
				<div className='flex justify-between items-center mb-4'>
					<h2 className='text-xl font-semibold'>Resume List</h2>
					<button
						type='button'
						onClick={handleCreateResume}
						disabled={isPending}
						className='px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50'
					>
						Create New Resume
					</button>
				</div>
				<div className='bg-card rounded-lg border p-12 text-center'>
					<h3 className='text-lg font-medium text-muted-foreground mb-2'>
						No resumes found
					</h3>
					<p className='text-muted-foreground mb-4'>
						Get started by creating your first resume
					</p>
					<button
						type='button'
						onClick={handleCreateResume}
						disabled={isPending}
						className='px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50'
					>
						Create New Resume
					</button>
				</div>
			</div>
		);
	}

	return (
		<section className='space-y-6' aria-labelledby='resume-list-heading'>
			<div className='flex justify-between items-center mb-4'>
				<h2 id='resume-list-heading' className='text-xl font-semibold'>
					Resume List ({resumes.length})
				</h2>
				<button
					type='button'
					onClick={handleCreateResume}
					disabled={isPending}
					className='px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50'
				>
					Create New Resume
				</button>
			</div>

			<div className='bg-card rounded-lg border overflow-hidden'>
				<div className='overflow-x-auto'>
					<table className='w-full'>
						<caption className='sr-only'>A list of your resumes</caption>
						<thead className='bg-muted/50 border-b'>
							<tr>
								<th scope='col' className='text-left p-4 font-medium'>
									Name
								</th>
								<th scope='col' className='text-left p-4 font-medium'>
									Template
								</th>
								<th scope='col' className='text-left p-4 font-medium'>
									Last Modified
								</th>
								<th scope='col' className='text-left p-4 font-medium'>
									Status
								</th>
								<th scope='col' className='text-right p-4 font-medium'>
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{resumes.map((resume) => (
								<tr key={resume.id} className='border-b hover:bg-muted/25'>
									<td className='p-4'>
										<div>
											<p className='font-medium'>{resume.title}</p>
											<p className='text-sm text-muted-foreground'>
												ID: {resume.id}
											</p>
										</div>
									</td>
									<td className='p-4 text-muted-foreground capitalize'>
										{resume.template}
									</td>
									<td className='p-4 text-muted-foreground'>
										{formatDate(resume.lastModified)}
									</td>
									<td className='p-4'>
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium ${
												resume.isActive
													? 'bg-green-100 text-green-800'
													: 'bg-gray-100 text-gray-800'
											}`}
										>
											{resume.isActive ? 'Active' : 'Inactive'}
										</span>
									</td>
									<td className='p-4'>
										<div className='flex justify-end space-x-2'>
											<button
												type='button'
												onClick={() => handleEditResume(resume.id)}
												disabled={isPending}
												className='text-sm text-primary hover:underline disabled:opacity-50'
											>
												Edit
											</button>
											<button
												type='button'
												onClick={() => handleDeleteResume(resume.id)}
												disabled={isPending}
												className='text-sm text-destructive hover:underline disabled:opacity-50'
											>
												Delete
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</section>
	);
}
