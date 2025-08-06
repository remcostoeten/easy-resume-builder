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
			return NextResponse.json({ 
				error: `Failed to parse PDF file: ${error instanceof Error ? error.message : 'Unknown error'}`,
				mockDataAvailable: true,
				mockData: {
					personalInfo: {
						firstName: 'John',
						lastName: 'Doe',
						email: 'john.doe@example.com',
						phone: '(555) 123-4567',
						location: 'New York, NY',
						summary: 'Experienced software engineer with expertise in web development'
					},
					workExperience: [
						{
							id: 'work-1',
							company: 'Tech Company Inc',
							position: 'Senior Developer',
							startDate: '2020',
							endDate: '',
							isCurrent: true,
							description: 'Developed web applications using React and Node.js'
						}
					],
					education: [
						{
							id: 'edu-1',
							institution: 'University of Technology',
							degree: 'Bachelor of Science',
							field: 'Computer Science',
							startDate: '2016',
							endDate: '2020',
							gpa: '3.8'
						}
					],
					skills: [
						{ id: 'skill-1', name: 'JavaScript', level: 'advanced' },
						{ id: 'skill-2', name: 'React', level: 'advanced' },
						{ id: 'skill-3', name: 'Node.js', level: 'intermediate' },
						{ id: 'skill-4', name: 'Python', level: 'intermediate' }
					]
				}
			}, { status: 500 });
		}
		
		return NextResponse.json({ 
			error: `Failed to parse PDF file: ${error instanceof Error ? error.message : 'Unknown error'}` 
		}, { status: 500 });
	}
}
