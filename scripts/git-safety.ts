#!/usr/bin/env bun

import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname, relative } from 'path';

type TGitSafetyResult = {
  success: boolean;
  message: string;
};

type TBackupResult = {
  success: boolean;
  message: string;
  backupDir?: string;
};

type TRestoreResult = {
  success: boolean;
  message: string;
  restoredFiles?: string[];
};

/**
 * Ensures the repository is in a clean state before any modifications
 * 1. Verifies inside a git repo
 * 2. Ensures git status is clean (no uncommitted changes)
 * 3. Confirms ts/js project by locating nearest package.json
 */
function _ensure_clean_git(): TGitSafetyResult {
  try {
    // 1. Verify inside a git repo
    try {
      const result = execSync('git rev-parse --is-inside-work-tree', { 
        encoding: 'utf8', 
        stdio: 'pipe' 
      }).trim();
      
      if (result !== 'true') {
        return {
          success: false,
          message: '\x1b[31m❌ ERROR: Not inside a git repository. Please run this script from within a git repository.\x1b[0m'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: '\x1b[31m❌ ERROR: Not inside a git repository. Please run this script from within a git repository.\x1b[0m'
      };
    }

    // 2. Ensure git status --porcelain is empty
    try {
      const statusResult = execSync('git status --porcelain', { 
        encoding: 'utf8', 
        stdio: 'pipe' 
      }).trim();
      
      if (statusResult !== '') {
        return {
          success: false,
          message: '\x1b[31m❌ ERROR: Git working directory is not clean. Please commit or stash your changes before proceeding.\x1b[0m\n\n' +
                   'Uncommitted changes:\n' + 
                   statusResult.split('\n').map(line => `  ${line}`).join('\n')
        };
      }
    } catch (error) {
      return {
        success: false,
        message: '\x1b[31m❌ ERROR: Failed to check git status. Please ensure git is properly configured.\x1b[0m'
      };
    }

    // 3. Confirm ts/js project by locating nearest package.json
    let currentDir = process.cwd();
    let packageJsonFound = false;
    
    // Walk up the directory tree to find package.json
    while (currentDir !== '/' && currentDir !== '') {
      const packageJsonPath = join(currentDir, 'package.json');
      if (existsSync(packageJsonPath)) {
        packageJsonFound = true;
        break;
      }
      
      const parentDir = join(currentDir, '..');
      if (parentDir === currentDir) break; // Reached root
      currentDir = parentDir;
    }
    
    if (!packageJsonFound) {
      return {
        success: false,
        message: '\x1b[31m❌ ERROR: No package.json found. This script must be run from within a TypeScript/JavaScript project.\x1b[0m'
      };
    }

    return {
      success: true,
      message: '\x1b[32m✅ Repository safety checks passed. Ready to proceed.\x1b[0m'
    };

  } catch (error) {
    return {
      success: false,
      message: '\x1b[31m❌ ERROR: Unexpected error during safety checks: ' + (error instanceof Error ? error.message : String(error)) + '\x1b[0m'
    };
  }
}

/**
 * Creates a backup of specified files before deletion
 * Creates .git/unused-backups/{timestamp} directory and copies files preserving paths
 */
function _make_backup(candidateFiles: string[]): TBackupResult {
  try {
    // Get git root directory
    const gitRoot = execSync('git rev-parse --show-toplevel', { 
      encoding: 'utf8', 
      stdio: 'pipe' 
    }).trim();

    // Create backup directory with timestamp
    const timestamp = Math.floor(Date.now() / 1000);
    const backupDir = join(gitRoot, '.git', 'unused-backups', timestamp.toString());
    
    mkdirSync(backupDir, { recursive: true });

    const backedUpFiles: string[] = [];
    const manifest: string[] = [];

    for (const file of candidateFiles) {
      if (existsSync(file)) {
        // Get relative path from git root
        const relativePath = relative(gitRoot, file);
        const backupPath = join(backupDir, relativePath);
        
        // Create directory structure
        mkdirSync(dirname(backupPath), { recursive: true });
        
        // Copy file using cp with --parents equivalent
        try {
          execSync(`cp "${file}" "${backupPath}"`, { stdio: 'pipe' });
          backedUpFiles.push(file);
          manifest.push(relativePath);
        } catch (error) {
          console.warn(`\x1b[33m⚠️  Warning: Failed to backup ${file}\x1b[0m`);
        }
      }
    }

    // Write manifest file
    const manifestPath = join(backupDir, 'manifest.txt');
    writeFileSync(manifestPath, manifest.join('\n') + '\n');

    return {
      success: true,
      message: `\x1b[32m✅ Backup created successfully: ${backupDir}\x1b[0m\n` +
               `   Backed up ${backedUpFiles.length} files`,
      backupDir
    };

  } catch (error) {
    return {
      success: false,
      message: '\x1b[31m❌ ERROR: Failed to create backup: ' + (error instanceof Error ? error.message : String(error)) + '\x1b[0m'
    };
  }
}

/**
 * Restores files from a backup directory
 * Locates latest backup dir (or accepts timestamp arg) and restores files
 */
function _restore_backup(timestamp?: string): TRestoreResult {
  try {
    // Get git root directory
    const gitRoot = execSync('git rev-parse --show-toplevel', { 
      encoding: 'utf8', 
      stdio: 'pipe' 
    }).trim();

    const backupsDir = join(gitRoot, '.git', 'unused-backups');
    
    if (!existsSync(backupsDir)) {
      return {
        success: false,
        message: '\x1b[31m❌ ERROR: No backup directory found\x1b[0m'
      };
    }

    let backupDir: string;
    
    if (timestamp) {
      // Use specified timestamp
      backupDir = join(backupsDir, timestamp);
      if (!existsSync(backupDir)) {
        return {
          success: false,
          message: `\x1b[31m❌ ERROR: Backup directory not found: ${timestamp}\x1b[0m`
        };
      }
    } else {
      // Find latest backup directory
      const backupDirs = readdirSync(backupsDir)
        .filter(dir => {
          const fullPath = join(backupsDir, dir);
          return statSync(fullPath).isDirectory();
        })
        .sort((a, b) => parseInt(b) - parseInt(a)); // Sort by timestamp descending
      
      if (backupDirs.length === 0) {
        return {
          success: false,
          message: '\x1b[31m❌ ERROR: No backup directories found\x1b[0m'
        };
      }
      
      backupDir = join(backupsDir, backupDirs[0]);
    }

    // Read manifest to get list of files
    const manifestPath = join(backupDir, 'manifest.txt');
    if (!existsSync(manifestPath)) {
      return {
        success: false,
        message: '\x1b[31m❌ ERROR: Manifest file not found in backup\x1b[0m'
      };
    }

    const manifest = readFileSync(manifestPath, 'utf8')
      .split('\n')
      .filter(line => line.trim() !== '');

    const restoredFiles: string[] = [];
    
    // Restore files using cp -r
    for (const relativePath of manifest) {
      const backupFilePath = join(backupDir, relativePath);
      const targetPath = join(gitRoot, relativePath);
      
      if (existsSync(backupFilePath)) {
        try {
          // Create target directory if it doesn't exist
          mkdirSync(dirname(targetPath), { recursive: true });
          
          // Copy file back
          execSync(`cp "${backupFilePath}" "${targetPath}"`, { stdio: 'pipe' });
          restoredFiles.push(targetPath);
        } catch (error) {
          console.warn(`\x1b[33m⚠️  Warning: Failed to restore ${relativePath}\x1b[0m`);
        }
      }
    }

    return {
      success: true,
      message: `\x1b[32m✅ Backup restored successfully\x1b[0m\n` +
               `   Restored ${restoredFiles.length} files from backup: ${relative(gitRoot, backupDir)}`,
      restoredFiles
    };

  } catch (error) {
    return {
      success: false,
      message: '\x1b[31m❌ ERROR: Failed to restore backup: ' + (error instanceof Error ? error.message : String(error)) + '\x1b[0m'
    };
  }
}

/**
 * Cleans up old backup directories older than 5 minutes
 * Uses find equivalent to delete dirs older than 5 min
 */
function _cleanup_old_backups(): TGitSafetyResult {
  try {
    // Get git root directory
    const gitRoot = execSync('git rev-parse --show-toplevel', { 
      encoding: 'utf8', 
      stdio: 'pipe' 
    }).trim();

    const backupsDir = join(gitRoot, '.git', 'unused-backups');
    
    if (!existsSync(backupsDir)) {
      return {
        success: true,
        message: '\x1b[32m✅ No backup directory to clean up\x1b[0m'
      };
    }

    // Get current time
    const now = Date.now();
    const fiveMinutesAgo = now - (5 * 60 * 1000); // 5 minutes in milliseconds
    
    const backupDirs = readdirSync(backupsDir)
      .filter(dir => {
        const fullPath = join(backupsDir, dir);
        return statSync(fullPath).isDirectory();
      });

    let cleanedCount = 0;
    
    for (const dir of backupDirs) {
      const fullPath = join(backupsDir, dir);
      const stats = statSync(fullPath);
      
      // Check if directory is older than 5 minutes
      if (stats.mtime.getTime() < fiveMinutesAgo) {
        try {
          // Use rm -rf equivalent
          execSync(`rm -rf "${fullPath}"`, { stdio: 'pipe' });
          cleanedCount++;
        } catch (error) {
          console.warn(`\x1b[33m⚠️  Warning: Failed to remove old backup ${dir}\x1b[0m`);
        }
      }
    }

    return {
      success: true,
      message: cleanedCount > 0 
        ? `\x1b[32m✅ Cleaned up ${cleanedCount} old backup directories\x1b[0m`
        : '\x1b[32m✅ No old backup directories to clean up\x1b[0m'
    };

  } catch (error) {
    return {
      success: false,
      message: '\x1b[31m❌ ERROR: Failed to cleanup old backups: ' + (error instanceof Error ? error.message : String(error)) + '\x1b[0m'
    };
  }
}

// Export for use in other scripts
export { _ensure_clean_git, _make_backup, _restore_backup, _cleanup_old_backups };

// If run directly, execute the safety check and cleanup
if (require.main === module || (import.meta as any).main) {
  // Cleanup old backups at startup
  const cleanupResult = _cleanup_old_backups();
  console.log(cleanupResult.message);
  
  // Execute safety check
  const result = _ensure_clean_git();
  console.log(result.message);
  
  if (!result.success) {
    process.exit(1);
  }

  // Print usage examples
  console.log('\n\x1b[36mBackup & Revert System Usage:\x1b[0m');
  console.log('  To create backup:    _make_backup(["file1.ts", "file2.ts"])');
  console.log('  To restore latest:   _restore_backup()');
  console.log('  To restore specific: _restore_backup("1703123456")');
  console.log('  To cleanup old:      _cleanup_old_backups()');
}
