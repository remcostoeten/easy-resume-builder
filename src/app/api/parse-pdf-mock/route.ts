import { NextResponse } from 'next/server';

export async function POST() {
	// European names, locations, and companies for randomization
	const europeanNames = [
		{ first: 'Alessandro', last: 'Rossi' },
		{ first: 'Marie', last: 'Dubois' },
		{ first: 'Hans', last: 'Müller' },
		{ first: 'Ingrid', last: 'Larsson' },
		{ first: 'Pablo', last: 'García' },
		{ first: 'Elena', last: 'Popović' },
		{ first: 'Niels', last: 'Jensen' },
		{ first: 'Sofia', last: 'Kowalski' },
		{ first: 'Dimitri', last: 'Petrov' },
		{ first: 'Isabella', last: 'Silva' }
	];

	const europeanLocations = [
		'Amsterdam, Netherlands',
		'Berlin, Germany',
		'Barcelona, Spain',
		'Stockholm, Sweden',
		'Milan, Italy',
		'Copenhagen, Denmark',
		'Vienna, Austria',
		'Prague, Czech Republic',
		'Warsaw, Poland',
		'Zurich, Switzerland',
		'Paris, France',
		'Dublin, Ireland'
	];

	const europeanCompanies = [
		'TechNova Solutions',
		'Nordic Digital AB',
		'Alpine Software GmbH',
		'Mediterranean Tech',
		'Baltic Innovation Labs',
		'Iberian Systems',
		'Scandinavian Web Co',
		'Central European IT',
		'Benelux Technologies',
		'Helvetic Digital'
	];

	const europeanUniversities = [
		{ name: 'Technical University of Munich', country: 'Germany' },
		{ name: 'KTH Royal Institute of Technology', country: 'Sweden' },
		{ name: 'Politecnico di Milano', country: 'Italy' },
		{ name: 'ETH Zurich', country: 'Switzerland' },
		{ name: 'University of Amsterdam', country: 'Netherlands' },
		{ name: 'Technical University of Denmark', country: 'Denmark' },
		{ name: 'Charles University', country: 'Czech Republic' },
		{ name: 'Warsaw University of Technology', country: 'Poland' }
	];

	const positions = [
		'Senior Software Engineer',
		'Full Stack Developer',
		'Frontend Developer',
		'Backend Engineer',
		'DevOps Engineer',
		'Software Architect',
		'Lead Developer',
		'Technical Lead'
	];

	const summaries = [
		'Experienced software engineer with expertise in web development and system architecture',
		'Passionate full-stack developer specializing in modern JavaScript frameworks and cloud technologies',
		'Results-driven engineer with strong background in scalable web applications and team leadership',
		'Innovative developer focused on creating efficient, user-centric digital solutions',
		'Skilled software architect with experience in microservices and distributed systems'
	];

	// Random selection helpers
	function randomChoice<T>(arr: T[]): T {
		return arr[Math.floor(Math.random() * arr.length)];
	}
	
	function randomYear(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	function randomGpa(): string {
		return (Math.random() * (4.0 - 3.2) + 3.2).toFixed(1);
	}

	// Generate random data
	const selectedName = randomChoice(europeanNames);
	const selectedLocation = randomChoice(europeanLocations);
	const selectedUniversity = randomChoice(europeanUniversities);
	
	// Generate email based on name and add some European domains
	const emailDomains = ['example.com', 'techcorp.eu', 'digital.se', 'innovation.de', 'solutions.nl'];
	const email = `${selectedName.first.toLowerCase()}.${selectedName.last.toLowerCase()}@${randomChoice(emailDomains)}`;
	
	// Generate European phone number format
	const phoneFormats = ['+49 30 12345678', '+46 8 123 456 78', '+31 20 123 4567', '+33 1 23 45 67 89', '+39 02 1234 5678'];
	const phone = randomChoice(phoneFormats);

	// Fix the circular reference issue by pre-selecting companies and positions
	const currentCompany = randomChoice(europeanCompanies);
	const previousCompany = randomChoice(europeanCompanies.filter(c => c !== currentCompany));
	const currentPosition = randomChoice(positions);
	const previousPosition = randomChoice(positions.filter(p => p !== currentPosition));

	const mockData = {
		personalInfo: {
			firstName: selectedName.first,
			lastName: selectedName.last,
			email: email,
			phone: phone,
			location: selectedLocation,
			summary: randomChoice(summaries)
		},
		workExperience: [
			{
				id: 'work-1',
				company: currentCompany,
				position: currentPosition,
				startDate: randomYear(2020, 2022).toString(),
				endDate: '',
				isCurrent: true,
				description: 'Lead development of web applications using React, Node.js, and TypeScript. Managed cross-functional teams and improved system performance by 35-50%.'
			},
			{
				id: 'work-2',
				company: previousCompany,
				position: previousPosition,
				startDate: randomYear(2017, 2019).toString(),
				endDate: randomYear(2019, 2021).toString(),
				isCurrent: false,
				description: 'Built scalable web applications from scratch using modern JavaScript frameworks. Collaborated with international teams across multiple European offices.'
			}
		],
		education: [
			{
				id: 'edu-1',
				institution: selectedUniversity.name,
				degree: Math.random() > 0.5 ? 'Bachelor of Science' : 'Master of Science',
				field: randomChoice(['Computer Science', 'Software Engineering', 'Information Technology', 'Computer Engineering']),
				startDate: randomYear(2012, 2015).toString(),
				endDate: randomYear(2016, 2019).toString(),
				gpa: randomGpa()
			}
		],
		skills: [
			{ id: 'skill-1', name: 'JavaScript', level: randomChoice(['intermediate', 'advanced']) },
			{ id: 'skill-2', name: 'TypeScript', level: randomChoice(['intermediate', 'advanced']) },
			{ id: 'skill-3', name: 'React', level: randomChoice(['intermediate', 'advanced']) },
			{ id: 'skill-4', name: 'Node.js', level: randomChoice(['intermediate', 'advanced']) },
			{ id: 'skill-5', name: randomChoice(['Python', 'Java', 'C#', 'Go']), level: randomChoice(['beginner', 'intermediate']) },
			{ id: 'skill-6', name: randomChoice(['PostgreSQL', 'MySQL', 'MongoDB']), level: 'intermediate' },
			{ id: 'skill-7', name: 'Docker', level: randomChoice(['beginner', 'intermediate']) },
			{ id: 'skill-8', name: randomChoice(['AWS', 'Azure', 'Google Cloud']), level: randomChoice(['beginner', 'intermediate']) }
		]
	};

	return NextResponse.json({
		success: true,
		data: mockData,
		isMockData: true
	});
}