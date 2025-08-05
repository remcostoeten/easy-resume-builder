import { z } from 'zod';

// Test our updated schema
const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  location: z.string().min(1, 'Location is required'),
  website: z.string().optional().refine(
    (val) => !val || val === '' || z.string().url().safeParse(val).success,
    { message: 'Invalid URL format' }
  ),
  linkedin: z.string().optional().refine(
    (val) => !val || val === '' || z.string().url().safeParse(val).success || val.includes('linkedin.com'),
    { message: 'Invalid LinkedIn URL format' }
  ),
  github: z.string().optional().refine(
    (val) => !val || val === '' || z.string().url().safeParse(val).success || val.includes('github.com'),
    { message: 'Invalid GitHub URL format' }
  ),
  summary: z.string().optional(),
});

// Test case: Valid form data that should now pass validation
const validFormData = {
  firstName: 'John',
  lastName: 'Doe', 
  email: 'john.doe@example.com',
  phone: '+31 6 26 36 39 19',
  location: 'New York, NY',
  website: 'https://johndoe.com',
  linkedin: 'https://linkedin.com/in/johndoe',
  github: 'github.com/johndoe', // Partial URL should work now
  summary: 'Software developer with 5 years of experience'
};

console.log('Testing updated schema...');
const result = personalInfoSchema.safeParse(validFormData);

if (result.success) {
  console.log('✅ Validation passed! Form data is valid.');
  console.log('Parsed data:', result.data);
} else {
  console.log('❌ Validation failed!');
  console.log('Errors:', result.error.issues.map(issue => 
    `${issue.path.join('.')}: ${issue.message}`
  ));
}

// Test edge case: Empty optional fields should still pass
const minimalData = {
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane@example.com', 
  phone: '123-456-7890',
  location: 'San Francisco, CA',
  website: '',
  linkedin: '',
  github: '',
  summary: ''
};

console.log('\nTesting minimal data...');
const minimalResult = personalInfoSchema.safeParse(minimalData);

if (minimalResult.success) {
  console.log('✅ Minimal data validation passed!');
} else {
  console.log('❌ Minimal data validation failed!');
  console.log('Errors:', minimalResult.error.issues.map(issue => 
    `${issue.path.join('.')}: ${issue.message}`
  ));
}
