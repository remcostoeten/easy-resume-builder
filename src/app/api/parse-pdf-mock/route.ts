import { NextResponse } from 'next/server';

export async function POST() {
	// Always return mock data for testing
	const mockData = {
		personalInfo: {
			firstName: 'John',
			lastName: 'Doe',
			email: 'john.doe@example.com',
			phone: '(555) 123-4567',
			location: 'New York, NY',
			summary: 'Experienced software engineer with expertise in web development and team leadership'
		},
		workExperience: [
			{
				id: 'work-1',
				company: 'Tech Company Inc',
				position: 'Senior Software Engineer',
				startDate: '2020',
				endDate: '',
				isCurrent: true,
				description: 'Lead development of web applications using React, Node.js, and TypeScript. Managed a team of 5 developers and improved system performance by 40%.'
			},
			{
				id: 'work-2',
				company: 'StartupXYZ',
				position: 'Full Stack Developer',
				startDate: '2018',
				endDate: '2020',
				isCurrent: false,
				description: 'Built scalable web applications from scratch using modern JavaScript frameworks. Collaborated with designers and product managers to deliver user-focused solutions.'
			}
		],
		education: [
			{
				id: 'edu-1',
				institution: 'University of Technology',
				degree: 'Bachelor of Science',
				field: 'Computer Science',
				startDate: '2014',
				endDate: '2018',
				gpa: '3.8'
			}
		],
		skills: [
			{ id: 'skill-1', name: 'JavaScript', level: 'advanced' },
			{ id: 'skill-2', name: 'TypeScript', level: 'advanced' },
			{ id: 'skill-3', name: 'React', level: 'advanced' },
			{ id: 'skill-4', name: 'Node.js', level: 'advanced' },
			{ id: 'skill-5', name: 'Python', level: 'intermediate' },
			{ id: 'skill-6', name: 'PostgreSQL', level: 'intermediate' },
			{ id: 'skill-7', name: 'Docker', level: 'intermediate' },
			{ id: 'skill-8', name: 'AWS', level: 'beginner' }
		]
	};

	return NextResponse.json({
		success: true,
		data: mockData,
		isMockData: true
	});
}
