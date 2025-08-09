#!/usr/bin/env bun

import { _make_backup, _restore_backup, _cleanup_old_backups } from './git-safety';

/**
 * Example usage of the backup & revert subsystem
 */
function demonstrateBackupSystem() {
  console.log('\n🔄 Backup & Revert System Demo\n');

  // Example 1: Create a backup of specific files
  console.log('1. Creating backup of example files...');
  const backupResult = _make_backup([
    'src/shared/utilities/preload.ts',
    'src/shared/components/ui/index.ts'
  ]);
  console.log(backupResult.message);

  if (backupResult.success && backupResult.backupDir) {
    console.log('\n2. Listing available backups...');
    
    // Example 2: Restore the backup we just created
    console.log('\n3. Restoring from latest backup...');
    const restoreResult = _restore_backup();
    console.log(restoreResult.message);

    // Example 3: Cleanup old backups (won't clean the one we just made since it's fresh)
    console.log('\n4. Cleaning up old backups...');
    const cleanupResult = _cleanup_old_backups();
    console.log(cleanupResult.message);
  }

  console.log('\n✅ Backup system demonstration complete!');
}

// Run if executed directly
if (require.main === module || (import.meta as any).main) {
  demonstrateBackupSystem();
}

export { demonstrateBackupSystem };
