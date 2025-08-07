#!/usr/bin/env bun

import { _ensure_clean_git } from './git-safety.js';

/**
 * Example script showing how to use _ensure_clean_git
 * Call this at script start before any modification
 */
function exampleScript() {
  // Call safety checks at the very beginning of the script
  const safetyResult = _ensure_clean_git();
  
  if (!safetyResult.success) {
    console.log(safetyResult.message);
    process.exit(1);
  }
  
  // Safety checks passed - proceed with script logic
  console.log(safetyResult.message);
  console.log('🚀 Proceeding with script execution...');
  
  // Your script logic here
  console.log('✨ Script completed successfully!');
}

// Run the example
if (require.main === module || (import.meta as any).main) {
  exampleScript();
}
