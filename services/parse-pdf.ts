import type { TExtractedResumeData } from '../src/types/extracted-data';
import {
	extractPersonalInfo,
	extractWorkExperience,
	extractEducation,
	extractSkills,
} from '../utils/text-extraction';

async function parsePdfBuffer(buffer: Buffer): Promise<TExtractedResumeData> {
	const pdfParse = await import('pdf-parse');
	
	const pdfData = await pdfParse.default(buffer);
	const text = pdfData.text;
	
	if (!text || text.trim().length === 0) {
		throw new Error('PDF contains no extractable text content');
	}
	
	const personalInfo = extractPersonalInfo(text);
	const workExperience = extractWorkExperience(text);
	const education = extractEducation(text);
	const skills = extractSkills(text);
	
	return {
		personalInfo,
		workExperience,
		education,
		skills,
	};
}

export { parsePdfBuffer };
