import { headers } from 'next/headers';
import { auth } from '@/features/auth/server/auth';
import { listUserResumes } from '@/features/resume/server/actions';
import { ResumeList } from './resume-list';

export async function ResumeListServer() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		throw new Error('Unauthorized: User session not found');
	}

	try {
		const resumes = await listUserResumes(session.user.id);

		return <ResumeList userId={session.user.id} initialResumes={resumes} />;
	} catch (error) {
		console.error('Failed to fetch resumes:', error);

		return (
			<div className='space-y-6'>
				<div className='flex justify-between items-center mb-4'>
					<h2 className='text-xl font-semibold'>Resume List</h2>
				</div>
				<div className='bg-card rounded-lg border p-12 text-center'>
					<h3 className='text-lg font-medium text-destructive mb-2'>
						Error loading resumes
					</h3>
					<p className='text-muted-foreground'>
						Unable to fetch your resumes. Please try again later.
					</p>
				</div>
			</div>
		);
	}
}
