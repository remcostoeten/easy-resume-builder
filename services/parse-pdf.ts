import type { TExtractedResumeData } from '../src/types/extracted-data';
import {
	extractPersonalInfo,
	extractWorkExperience,
	extractEducation,
	extractSkills,
} from '../utils/text-extraction';

async function parsePdfBuffer(buffer: Buffer): Promise<TExtractedResumeData> {
	try {
		console.log('Starting PDF parsing, buffer size:', buffer.length);
		
		if (buffer.length === 0) {
			throw new Error('Empty PDF buffer received');
		}
		
		// Use require instead of import to avoid module loading issues
		const pdfParse = require('pdf-parse');
		console.log('pdf-parse imported successfully');
		
		const pdfData = await pdfParse(buffer, {
			// Add options to make parsing more reliable
			max: 0 // no page limit
		});
		console.log('PDF parsed, pages:', pdfData.numpages, 'text length:', pdfData.text?.length || 0);
		
		const text = pdfData.text;
		
		if (!text || text.trim().length === 0) {
			throw new Error('PDF contains no extractable text content');
		}
		
		console.log('Extracting resume sections from text...');
		console.log('First 200 characters:', text.substring(0, 200));
		
		const personalInfo = extractPersonalInfo(text);
		const workExperience = extractWorkExperience(text);
		const education = extractEducation(text);
		const skills = extractSkills(text);
		
		console.log('Extraction results:', {
			personalInfo: personalInfo,
			workCount: workExperience.length,
			educationCount: education.length,
			skillsCount: skills.length
		});
		
		return {
			personalInfo,
			workExperience,
			education,
			skills,
		};
	} catch (error) {
		console.error('Error in parsePdfBuffer:', error);
		throw error;
	}
}

export { parsePdfBuffer };
