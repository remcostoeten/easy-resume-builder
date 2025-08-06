import { listUserResumes } from '@/features/resume/server/actions';
import { ResumeList } from './resume-list';

type TProps = {
	userId: string;
};

export async function ResumeListServer({ userId }: TProps) {
	try {
		const resumes = await listUserResumes(userId);

		return <ResumeList userId={userId} initialResumes={resumes} />;
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
