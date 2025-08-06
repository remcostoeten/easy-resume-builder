import { ensureDomMatrix } from '../src/utils/dom-matrix-polyfill';
import type { TExtractedResumeData } from '../src/types/extracted-data';
import {
	extractPersonalInfo,
	extractWorkExperience,
	extractEducation,
	extractSkills,
} from '../utils/text-extraction';

ensureDomMatrix();

async function parseWithPdfJs(buffer: Buffer): Promise<string> {
	const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.js');
	
	pdfjsLib.GlobalWorkerOptions.workerSrc = 'data:application/javascript;base64,Ly8gSW4tbWVtb3J5IFBERi5qcyB3b3JrZXI=';
	
	const loadingTask = pdfjsLib.getDocument({ 
		data: new Uint8Array(buffer)
	});
	const pdf = await loadingTask.promise;
	
	console.log(`PDF loaded with ${pdf.numPages} pages`);
	
	const textItems = [];
	for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
		const page = await pdf.getPage(pageNum);
		const textContent = await page.getTextContent();
		const pageText = textContent.items.map((item: any) => item.str).join(' ');
		textItems.push(pageText);
	}
	
	return textItems.join('\n').trim();
}

async function parseWithPdfParse(buffer: Buffer): Promise<string> {
	try {
		const pdfParse = require('pdf-parse');
		
		const pdfData = await pdfParse(buffer, {
			useSystemFonts: false,
			disableWorker: true,
			max: 0,
			normalizeWhitespace: false
		});
		
		return pdfData.text || '';
	} catch (error) {
		if (error instanceof Error && (error.message.includes('ENOENT') || (error as any).code === 'ENOENT')) {
			throw new Error('PDF parsing failed due to missing system dependencies. This is a known issue with the pdf-parse library configuration.');
		}
		throw error;
	}
}

async function parseWithPdfReader(buffer: Buffer): Promise<string> {
	return new Promise((resolve, reject) => {
		try {
			const PdfReader = require('pdfreader').PdfReader;
			const reader = new PdfReader();
			const textItems: string[] = [];
			
			reader.parseBuffer(buffer, (error: any, item: any) => {
				if (error) {
					reject(error);
					return;
				}
				
				if (!item) {
					const result = textItems.join(' ').trim();
					resolve(result);
					return;
				}
				
				if (item.text) {
					textItems.push(item.text);
				}
			});
		} catch (error) {
			reject(error);
		}
	});
}

function validatePdfBuffer(buffer: Buffer): void {
	if (buffer.length === 0) {
		throw new Error('Empty PDF buffer received');
	}
	
	const pdfHeader = buffer.toString('ascii', 0, 4);
	if (pdfHeader !== '%PDF') {
		throw new Error('Invalid PDF file format - missing PDF header');
	}
}

function hasValidText(text: string): boolean {
	return text && text.trim().length > 0;
}

async function tryParsingStrategy(buffer: Buffer, strategyName: string, parsingFunction: (buffer: Buffer) => Promise<string>): Promise<string> {
	try {
		console.log(`Trying ${strategyName} parser...`);
		const text = await parsingFunction(buffer);
		console.log(`${strategyName} parsing successful, text length:`, text.length);
		return text;
	} catch (error) {
		console.error(`${strategyName} failed:`, error);
		throw error;
	}
}

async function parseTextFromPdf(buffer: Buffer): Promise<string> {
	const parsingStrategies = [
		{ name: 'pdfjs-dist', parseFunction: parseWithPdfJs },
		{ name: 'pdf-parse', parseFunction: parseWithPdfParse },
		{ name: 'pdfreader', parseFunction: parseWithPdfReader }
	];
	
	for (const strategy of parsingStrategies) {
		try {
			const text = await tryParsingStrategy(buffer, strategy.name, strategy.parseFunction);
			if (hasValidText(text)) {
				return text;
			}
		} catch (error) {
			continue;
		}
	}
	
	throw new Error('PDF parsing failed with all available strategies - no parser could extract readable text from the document');
}

function extractResumeDataFromText(text: string): TExtractedResumeData {
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
}

async function parsePdfBuffer(buffer: Buffer): Promise<TExtractedResumeData> {
	try {
		console.log('Starting PDF parsing, buffer size:', buffer.length);
		
		validatePdfBuffer(buffer);
		console.log('PDF header validated, attempting to parse...');
		
		const text = await parseTextFromPdf(buffer);
		
		if (!hasValidText(text)) {
			throw new Error('PDF contains no extractable text content - it may be image-based or corrupted');
		}
		
		return extractResumeDataFromText(text);
		
	} catch (error) {
		console.error('Error in parsePdfBuffer:', {
			message: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			bufferSize: buffer?.length || 0
		});
		throw error;
	}
}

export { parsePdfBuffer, parseWithPdfParse, parseWithPdfReader };
