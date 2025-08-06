import { type NextRequest, NextResponse } from 'next/server';
import { parsePdfBuffer } from '../../../../services/parse-pdf';

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get('pdf') as File;

		if (!file) {
			return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
		}

		if (file.type !== 'application/pdf') {
			return NextResponse.json(
				{ error: 'Invalid file type. Please upload a PDF file.' },
				{ status: 400 }
			);
		}

		console.log('Processing PDF file:', {
			name: file.name,
			size: file.size,
			type: file.type
		});

		const buffer = Buffer.from(await file.arrayBuffer());
		console.log('PDF buffer length:', buffer.length);

		const extractedData = await parsePdfBuffer(buffer);
		console.log('Successfully extracted data:', {
			personalInfo: extractedData.personalInfo,
			workExperience: extractedData.workExperience?.length || 0,
			education: extractedData.education?.length || 0,
			skills: extractedData.skills?.length || 0
		});

		return NextResponse.json({
			success: true,
			data: extractedData,
		});
	} catch (error) {
		console.error('PDF parsing error details:', {
			message: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			error: error
		});
		
		if (error instanceof Error && error.message.includes('PDF contains no extractable text')) {
			return NextResponse.json(
				{
					error: 'Could not extract text from PDF. The file might be image-based or corrupted.',
				},
				{ status: 400 }
			);
		}
		
		if (error instanceof Error && error.message.includes('Invalid PDF')) {
			return NextResponse.json(
				{
					error: 'Invalid PDF file format. Please try a different PDF.',
				},
				{ status: 400 }
			);
		}
		
	// For development/testing, provide option to return mock data
	if (process.env.NODE_ENV === 'development') {
		console.log('Development mode: offering mock data fallback');
		
		// Generate some realistic mock data with variation
		const names = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William'];
		const lastNames = ['Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller'];
		const cities = ['San Francisco', 'New York', 'Seattle', 'Austin', 'Boston', 'Denver'];
		const companies = ['TechCorp', 'InnovateSoft', 'DataFlow Inc', 'CloudTech', 'DevSolutions'];
		
		const randomChoice = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
		const firstName = randomChoice(names);
		const lastName = randomChoice(lastNames);
		
		return NextResponse.json({ 
			error: `Failed to parse PDF file: ${error instanceof Error ? error.message : 'Unknown error'}`,
			mockDataAvailable: true,
			mockData: {
				personalInfo: {
					firstName,
					lastName,
					email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
					phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
					location: `${randomChoice(cities)}, ${Math.random() > 0.5 ? 'CA' : 'NY'}`,
					summary: 'Experienced software engineer with expertise in web development and modern frameworks'
				},
				workExperience: [
					{
						id: 'work-1',
						company: randomChoice(companies),
						position: 'Senior Software Engineer',
						startDate: '2021',
						endDate: '',
						isCurrent: true,
						description: 'Lead development of web applications using React, TypeScript, and Node.js. Mentored junior developers and improved deployment processes.'
					},
					{
						id: 'work-2',
						company: randomChoice(companies.filter(c => c !== companies[0])),
						position: 'Full Stack Developer',
						startDate: '2018',
						endDate: '2021',
						isCurrent: false,
						description: 'Built scalable web applications from concept to deployment. Worked with REST APIs, databases, and cloud infrastructure.'
					}
				],
				education: [
					{
						id: 'edu-1',
						institution: 'University of Computer Science',
						degree: 'Bachelor of Science',
						field: 'Computer Science',
						startDate: '2014',
						endDate: '2018',
						gpa: (Math.random() * (4.0 - 3.2) + 3.2).toFixed(1)
					}
				],
				skills: [
					{ id: 'skill-1', name: 'JavaScript', level: 'advanced' },
					{ id: 'skill-2', name: 'TypeScript', level: 'advanced' },
					{ id: 'skill-3', name: 'React', level: 'advanced' },
					{ id: 'skill-4', name: 'Node.js', level: 'intermediate' },
					{ id: 'skill-5', name: 'Python', level: 'intermediate' },
					{ id: 'skill-6', name: 'PostgreSQL', level: 'intermediate' },
					{ id: 'skill-7', name: 'Docker', level: 'beginner' },
					{ id: 'skill-8', name: 'AWS', level: 'intermediate' }
				]
			}
		}, { status: 500 });
	}
		
		return NextResponse.json({ 
			error: `Failed to parse PDF file: ${error instanceof Error ? error.message : 'Unknown error'}` 
		}, { status: 500 });
	}
}
