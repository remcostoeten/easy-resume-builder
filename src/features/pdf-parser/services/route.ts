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

		const buffer = Buffer.from(await file.arrayBuffer());
		const extractedData = await parsePdfBuffer(buffer);

		return NextResponse.json({
			success: true,
			data: extractedData,
		});
	} catch (error) {
		console.error('PDF parsing error:', error);
		if (error instanceof Error && error.message.includes('PDF contains no extractable text')) {
			return NextResponse.json(
				{
					error: 'Could not extract text from PDF. The file might be image-based or corrupted.',
				},
				{ status: 400 }
			);
		}
		return NextResponse.json({ error: 'Failed to parse PDF file' }, { status: 500 });
	}
}
