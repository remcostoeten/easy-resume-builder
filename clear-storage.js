#!/usr/bin/env node

// Utility script to help with debugging localStorage issues
// This can be run in the browser console to clear all form data

console.log('🧹 Clearing all localStorage data for resume builder...');

// Clear all keys that start with 'resume-form-data'
const keysToRemove = [];
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && key.startsWith('resume-form-data')) {
    keysToRemove.push(key);
  }
}

keysToRemove.forEach(key => {
  console.log(`Removing: ${key}`);
  localStorage.removeItem(key);
});

console.log(`✅ Cleared ${keysToRemove.length} localStorage entries`);
console.log('You can now test the persistence fix!');
