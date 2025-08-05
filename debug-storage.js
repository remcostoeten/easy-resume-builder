// Simple script to test localStorage functionality
// Run this in browser console to debug

console.log('=== Testing localStorage functionality ===');

// Test basic localStorage
console.log('1. Testing basic localStorage...');
localStorage.setItem('test-key', 'test-value');
console.log('Set test-key:', localStorage.getItem('test-key'));
localStorage.removeItem('test-key');

// Test the expected key format
console.log('2. Testing expected key format...');
const testData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com'
};

// This mimics what the saveFormData function should do
const storageKey = 'resume-form-data-personal-info';
const wrappedData = {
  data: testData,
  timestamp: new Date().toISOString()
};

localStorage.setItem(storageKey, JSON.stringify(wrappedData));
console.log('Set data with key:', storageKey);
console.log('Retrieved data:', JSON.parse(localStorage.getItem(storageKey) || '{}'));

// Check all localStorage keys
console.log('3. All localStorage keys:');
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(`  ${key}: ${localStorage.getItem(key)}`);
}

console.log('=== End debug ===');
