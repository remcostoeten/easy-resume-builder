#!/usr/bin/env bun

import { 
  _execute_removal_by_mode, 
  _print_recap,
  _remove_packages 
} from './remove-unused';

/**
 * Demonstration of mode-specific removal functionality
 */
function demo_removal_modes() {
  console.log('🧪 DEMONSTRATION: Mode-specific removal functionality\n');
  
  // Demo 1: Files mode (would remove specific file paths)
  console.log('='.repeat(60));
  console.log('📁 DEMO: Files Mode');
  console.log('='.repeat(60));
  const fileStats = _execute_removal_by_mode('files', ['demo-file-1.txt', 'demo-file-2.txt']);
  _print_recap(fileStats);
  
  // Demo 2: Imports mode (shows TODO for knip --fix)
  console.log('\n' + '='.repeat(60));
  console.log('📦 DEMO: Imports Mode');
  console.log('='.repeat(60));
  const importStats = _execute_removal_by_mode('imports');
  _print_recap(importStats);
  
  // Demo 3: Functions mode (shows TODO for knip --fix)
  console.log('\n' + '='.repeat(60));
  console.log('⚙️ DEMO: Functions Mode');
  console.log('='.repeat(60));
  const functionStats = _execute_removal_by_mode('functions');
  _print_recap(functionStats);
  
  // Demo 4: Types mode (shows TODO for knip --fix)
  console.log('\n' + '='.repeat(60));
  console.log('🔧 DEMO: Types Mode');
  console.log('='.repeat(60));
  const typeStats = _execute_removal_by_mode('types');
  _print_recap(typeStats);
  
  // Demo 5: Packages mode (runs depcheck and would remove from package.json)
  console.log('\n' + '='.repeat(60));
  console.log('📦 DEMO: Packages Mode');
  console.log('='.repeat(60));
  const packageStats = _execute_removal_by_mode('packages');
  _print_recap(packageStats);
  
  console.log('\n🎯 SUMMARY:');
  console.log('✓ Files: Remove selected paths');
  console.log('✓ Imports/Functions/Types: TODO - Use knip --fix when stable');
  console.log('✓ Packages: Run depcheck, remove from package.json, run bun install');
  console.log('✓ All operations logged to recap array');
}

// Run demo if called directly
if (require.main === module || (import.meta as any).main) {
  demo_removal_modes();
}

export { demo_removal_modes };
