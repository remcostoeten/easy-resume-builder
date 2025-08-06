import { type NextRequest, NextResponse } from 'next/server';
import {
	extractPersonalInfo,
	extractWorkExperience,
	extractEducation,
	extractSkills,
} from '../../../../utils/text-extraction';
import type { TExtractedResumeData } from '../../../../types/extracted-data';


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

		const buffer = Buffer.from(await file.arrayBuffer());
		// Dynamically import pdf-parse to avoid build-time issues
		const pdfParse = (await import('pdf-parse')).default;
		const pdfData = await pdfParse(buffer);
		const text = pdfData.text;

		if (!text || text.trim().length === 0) {
			return NextResponse.json(
				{
					error: 'Could not extract text from PDF. The file might be image-based or corrupted.',
				},
				{ status: 400 }
			);
		}

		const extractedData: TExtractedResumeData = {
			personalInfo: extractPersonalInfo(text),
			workExperience: extractWorkExperience(text),
			education: extractEducation(text),
			skills: extractSkills(text),
		};

		return NextResponse.json({
			success: true,
			data: extractedData,
			rawText: text.substring(0, 500) + '...',
		});
	} catch (error) {
		console.error('PDF parsing error:', error);
		return NextResponse.json({ error: 'Failed to parse PDF file' }, { status: 500 });
	}
}
