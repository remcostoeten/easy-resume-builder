'use client'

import { ClientWrapper } from '@/components/client-wrapper';
import { HomeView } from '../views/home-view';
import { EmptyState } from '@/shared/components/ui';
import { GraduationCap, Code, FolderOpen, Briefcase } from 'lucide-react';

function handleAddEducation() {
	console.log('Add education functionality not implemented.');
}

function handleAddSkill() {
	console.log('Add skill functionality not implemented.');
}

function handleAddProject() {
	console.log('Add project functionality not implemented.');
}

function handleAddPosition() {
	console.log('Add position functionality not implemented.');
}

function handleSampleAction() {
	console.log('Sample action functionality not implemented.');
}

export default function Page() {
	return (
		<ClientWrapper>
			<div className='animated-bg'>
				{Array.from({ length: 20 }).map((_, i) => (
					<div key={i} className='dot' />
				))}
			</div>
			<EmptyState
				icon={<GraduationCap className='h-8 w-8' />}
				title='No Education Added'
				description='Add your educational background, degrees, and academic achievements to showcase your qualifications.'
				actionLabel='Add Education'
				onAction={handleAddEducation}
			/>
			<EmptyState
				icon={<Code className='h-8 w-8' />}
				title='No Skills Added'
				description='Add your technical and professional skills to highlight your expertise and capabilities.'
				actionLabel='Add Skill Category'
				onAction={handleAddSkill}
			/>
			<EmptyState
				icon={<GraduationCap className='h-8 w-8' />}
				title='This is some title'
				description='This is a bit longer descripption'
				actionLabel='Sample Action'
				onAction={handleSampleAction}
			/>
			<EmptyState
				title='Unknown Section'
				description='This section type is not supported yet.'
				actionLabel='Go Back'
				onAction={() => console.log('Unknown section type')}
				icon={undefined}
			/>
			<EmptyState
				icon={<FolderOpen className='h-8 w-8' />}
				title='No Projects Added'
				description='Showcase your personal projects, open-source contributions, or side work. Projects help demonstrate your practical skills and passion for development.'
				actionLabel='Add Your First Project'
				onAction={handleAddProject}
			/>
			<EmptyState
				icon={<Briefcase className='h-8 w-8' />}
				title='Ready to showcase your career journey?'
				description="Add your work experiences to create a compelling professional timeline. Include your roles, achievements, and the impact you've made."
				actionLabel='Add Your First Position'
				onAction={handleAddPosition}
			/>
			<HomeView />
		</ClientWrapper>
	);
}
