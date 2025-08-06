#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Test the PDF upload endpoint
async function testPdfUpload() {
  try {
    // First check if the API endpoint responds
    const response = await fetch('http://localhost:3001/api/parse-pdf', {
      method: 'GET'
    });
    
    console.log('✓ API endpoint reachable');
    
    // Test with a simple test case
    const formData = new FormData();
    
    // Create a minimal test file
    const testData = Buffer.from('Test PDF content');
    formData.append('pdf', testData, {
      filename: 'test.pdf',
      contentType: 'application/pdf'
    });
    
    const uploadResponse = await fetch('http://localhost:3001/api/parse-pdf', {
      method: 'POST',
      body: formData
    });
    
    const result = await uploadResponse.json();
    console.log('API Response:', result);
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3001');
    if (response.ok) {
      console.log('✓ Server is running on port 3001');
      return true;
    }
  } catch (error) {
    console.log('✗ Server not responding on port 3001');
    return false;
  }
}

async function main() {
  console.log('🧪 Testing PDF Upload Functionality...\n');
  
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.log('Please start the dev server first: npm run dev');
    return;
  }
  
  await testPdfUpload();
}

main();
