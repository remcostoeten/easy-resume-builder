#!/usr/bin/env bun

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync, unlinkSync, statSync } from 'fs';
import { join, relative } from 'path';
import { _ensure_clean_git, _make_backup } from './git-safety';

type TCandidate = {
  type: 'file' | 'dependency' | 'import' | 'function' | 'type';
  path: string;
  description: string;
  size?: number;
  mode?: 'files' | 'imports' | 'functions' | 'types' | 'packages';
};

type TRemovalStats = {
  filesDeleted: number;
  dependenciesRemoved: number;
  importsRemoved: number;
  functionsRemoved: number;
  typesRemoved: number;
  totalSize: number;
  recap: string[];
};

/**
 * Generates list of unused files and dependencies as candidates for removal
 */
function _generate_candidates(): TCandidate[] {
  const candidates: TCandidate[] = [];

  // Get unused files from knip
  try {
    console.log('🔍 Scanning for unused files...');
    const knipOutput = execSync('bun knip --reporter json', { 
      encoding: 'utf8', 
      stdio: 'pipe' 
    });
    
    const knipData = JSON.parse(knipOutput);
    const unusedFiles = knipData.files || [];
    
    for (const file of unusedFiles) {
      if (existsSync(file)) {
        const stats = statSync(file);
        candidates.push({
          type: 'file',
          path: file,
          description: `Unused file: ${file} (${_format_bytes(stats.size)})`,
          size: stats.size
        });
      }
    }
  } catch (error) {
    console.warn('⚠️  Could not analyze unused files with knip');
  }

  // Get unused dependencies from depcheck
  try {
    console.log('🔍 Scanning for unused dependencies...');
    const depcheckOutput = execSync('bun depcheck --json', { 
      encoding: 'utf8', 
      stdio: 'pipe' 
    });
    
    const depcheckData = JSON.parse(depcheckOutput);
    const unusedDeps = [
      ...(depcheckData.dependencies || []),
      ...(depcheckData.devDependencies || [])
    ];
    
    for (const dep of unusedDeps) {
      candidates.push({
        type: 'dependency',
        path: dep,
        description: `Unused dependency: ${dep}`,
        size: 0
      });
    }
  } catch (error) {
    console.warn('⚠️  Could not analyze unused dependencies with depcheck');
  }

  return candidates;
}

/**
 * Interactive selection UI using fzf with checkboxes
 */
function _interactive_selection(candidates: TCandidate[], skipInteraction: boolean = false): TCandidate[] {
  if (skipInteraction) {
    return candidates;
  }

  if (candidates.length === 0) {
    console.log('✅ No unused files or dependencies found!');
    return [];
  }

  console.log(`\n📋 Found ${candidates.length} candidates for removal:`);
  
  try {
    // Prepare candidate list for fzf
    const candidateStrings = candidates.map((candidate, index) => 
      `${index.toString().padStart(3, ' ')}: ${candidate.description}`
    );
    
    const input = candidateStrings.join('\n');
    
    // Run fzf with multi-select and ANSI colors
    const fzfCommand = [
      'fzf',
      '--multi',
      '--ansi',
      '--bind="space:toggle"',
      '--header="SPACE to select, ENTER to confirm, ESC to cancel"',
      '--preview-window="hidden"',
      '--height="80%"'
    ].join(' ');
    
    const selectedOutput = execSync(`printf "%s\\n" '${input.replace(/'/g, "'\\''")}' | ${fzfCommand}`, {
      encoding: 'utf8',
      stdio: ['inherit', 'pipe', 'inherit']
    }).trim();
    
    if (!selectedOutput) {
      console.log('❌ No items selected or cancelled. Aborting.');
      return [];
    }
    
    // Parse selected indices
    const selectedIndices = selectedOutput
      .split('\n')
      .map(line => parseInt(line.split(':')[0].trim()))
      .filter(index => !isNaN(index));
    
    const selectedCandidates = selectedIndices.map(index => candidates[index]);
    
    console.log(`\n✅ Selected ${selectedCandidates.length} items for removal`);
    return selectedCandidates;
    
  } catch (error) {
    if (error instanceof Error && error.message.includes('Command failed')) {
      console.log('❌ Selection cancelled or fzf not available');
      return [];
    }
    throw error;
  }
}

/**
 * Remove files by deleting selected paths
 */
function _remove_files(selectedPaths: string[], stats: TRemovalStats): void {
  console.log('\n📁 Removing selected file paths...');
  
  for (const filePath of selectedPaths) {
    try {
      if (existsSync(filePath)) {
        const fileStats = statSync(filePath);
        unlinkSync(filePath);
        console.log(`🗑️  Deleted: ${filePath}`);
        stats.filesDeleted++;
        stats.totalSize += fileStats.size;
        stats.recap.push(`Deleted file: ${filePath} (${_format_bytes(fileStats.size)})`);
      } else {
        console.warn(`⚠️  File not found: ${filePath}`);
      }
    } catch (error) {
      console.error(`❌ Failed to delete ${filePath}: ${error}`);
    }
  }
}

/**
 * Handle imports/functions/types removal via knip --fix or TODO
 */
function _remove_imports_functions_types(type: 'imports' | 'functions' | 'types', stats: TRemovalStats): void {
  console.log(`\n🔧 Handling ${type} removal...`);
  
  try {
    // Check if knip --fix is stable
    const knipVersion = execSync('bun knip --version', { encoding: 'utf8', stdio: 'pipe' }).trim();
    console.log(`📦 Knip version: ${knipVersion}`);
    
    // For now, rely on TODO until knip --fix is confirmed stable
    console.log('⏳ TODO: Use knip --fix when stable');
    console.log(`   Currently would handle: unused ${type}`);
    
    // Log to recap
    stats.recap.push(`TODO: Remove unused ${type} via knip --fix when stable`);
    
  } catch (error) {
    console.error(`❌ Error checking knip for ${type}: ${error}`);
    stats.recap.push(`ERROR: Could not process ${type} removal`);
  }
}

/**
 * Remove packages using depcheck and bun install
 */
function _remove_packages(stats: TRemovalStats): void {
  console.log('\n📦 Removing unused packages...');
  
  try {
    // Run depcheck to get unused dependencies
    const depcheckOutput = execSync('bunx depcheck --json', { 
      encoding: 'utf8', 
      stdio: 'pipe' 
    });
    
    const depcheckData = JSON.parse(depcheckOutput);
    const unusedDeps = [
      ...(depcheckData.dependencies || []),
      ...(depcheckData.devDependencies || [])
    ];
    
    if (unusedDeps.length === 0) {
      console.log('✅ No unused dependencies found');
      stats.recap.push('No unused dependencies found');
      return;
    }
    
    console.log(`Found ${unusedDeps.length} unused dependencies:`);
    unusedDeps.forEach(dep => console.log(`  - ${dep}`));
    
    // Ask for confirmation (in real scenario, this would be interactive)
    console.log('\n🤔 Confirm removal of these dependencies? (proceeding with removal)');
    
    // Remove dependencies from package.json
    const packageJsonPath = './package.json';
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    
    for (const depName of unusedDeps) {
      let removed = false;
      
      if (packageJson.dependencies && packageJson.dependencies[depName]) {
        delete packageJson.dependencies[depName];
        console.log(`  ✓ Removed dependency: ${depName}`);
        removed = true;
      }
      
      if (packageJson.devDependencies && packageJson.devDependencies[depName]) {
        delete packageJson.devDependencies[depName];
        console.log(`  ✓ Removed devDependency: ${depName}`);
        removed = true;
      }
      
      if (removed) {
        stats.dependenciesRemoved++;
        stats.recap.push(`Removed dependency: ${depName}`);
      }
    }
    
    // Write updated package.json
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, '\t') + '\n');
    console.log('📝 Updated package.json');
    
    // Run bun install to prune
    console.log('🔄 Running bun install to prune unused packages...');
    execSync('bun install', { stdio: 'inherit' });
    
    stats.recap.push(`Updated package.json and ran bun install to prune ${unusedDeps.length} dependencies`);
    
  } catch (error) {
    console.error('❌ Failed to remove packages:', error);
    stats.recap.push('ERROR: Failed to remove packages');
  }
}

/**
 * Main interactive removal function that orchestrates the process
 */
function _interactive_remove(skipInteraction: boolean = false): TRemovalStats {
  const stats: TRemovalStats = {
    filesDeleted: 0,
    dependenciesRemoved: 0,
    importsRemoved: 0,
    functionsRemoved: 0,
    typesRemoved: 0,
    totalSize: 0,
    recap: []
  };

  // 1. Generate candidates
  const candidates = _generate_candidates();
  
  if (candidates.length === 0) {
    console.log('✅ No unused files or dependencies found!');
    return stats;
  }

  // 2. Interactive selection
  const selectedCandidates = _interactive_selection(candidates, skipInteraction);
  
  if (selectedCandidates.length === 0) {
    return stats;
  }

  // 3. Separate files and dependencies
  const filesToDelete = selectedCandidates.filter(c => c.type === 'file');
  const depsToRemove = selectedCandidates.filter(c => c.type === 'dependency');

  // 4. Create backup for selected files
  if (filesToDelete.length > 0) {
    console.log(`\n📦 Creating backup for ${filesToDelete.length} files...`);
    const backupResult = _make_backup(filesToDelete.map(f => f.path));
    
    if (!backupResult.success) {
      console.error('❌ Backup failed, aborting removal');
      console.error(backupResult.message);
      return stats;
    }
    
    console.log(backupResult.message);
  }

  // 5. Delete files
  for (const fileCandidate of filesToDelete) {
    try {
      console.log(`🗑️  Deleting: ${fileCandidate.path}`);
      unlinkSync(fileCandidate.path);
      stats.filesDeleted++;
      stats.totalSize += fileCandidate.size || 0;
    } catch (error) {
      console.warn(`⚠️  Failed to delete ${fileCandidate.path}: ${error}`);
    }
  }

  // 6. Remove dependencies from package.json
  if (depsToRemove.length > 0) {
    try {
      console.log(`\n📦 Removing ${depsToRemove.length} dependencies from package.json...`);
      
      const packageJsonPath = './package.json';
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      
      for (const depCandidate of depsToRemove) {
        const depName = depCandidate.path;
        
        if (packageJson.dependencies && packageJson.dependencies[depName]) {
          delete packageJson.dependencies[depName];
          console.log(`  ✓ Removed dependency: ${depName}`);
          stats.dependenciesRemoved++;
        }
        
        if (packageJson.devDependencies && packageJson.devDependencies[depName]) {
          delete packageJson.devDependencies[depName];
          console.log(`  ✓ Removed devDependency: ${depName}`);
          stats.dependenciesRemoved++;
        }
      }
      
      // Write updated package.json
      writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, '\t') + '\n');
      
      // Run bun install to update lockfile
      console.log('🔄 Running bun install to update lockfile...');
      execSync('bun install', { stdio: 'inherit' });
      
    } catch (error) {
      console.error('❌ Failed to update package.json:', error);
    }
  }

  return stats;
}

/**
 * Formats bytes into human readable format
 */
function _format_bytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Execute removal based on mode
 */
function _execute_removal_by_mode(mode: string, selectedPaths?: string[]): TRemovalStats {
  const stats: TRemovalStats = {
    filesDeleted: 0,
    dependenciesRemoved: 0,
    importsRemoved: 0,
    functionsRemoved: 0,
    typesRemoved: 0,
    totalSize: 0,
    recap: []
  };
  
  switch (mode) {
    case 'files':
      if (selectedPaths && selectedPaths.length > 0) {
        _remove_files(selectedPaths, stats);
      } else {
        console.log('❌ No file paths provided for removal');
      }
      break;
      
    case 'imports':
      _remove_imports_functions_types('imports', stats);
      break;
      
    case 'functions':
      _remove_imports_functions_types('functions', stats);
      break;
      
    case 'types':
      _remove_imports_functions_types('types', stats);
      break;
      
    case 'packages':
      _remove_packages(stats);
      break;
      
    default:
      console.log('❌ Unknown mode:', mode);
      console.log('Valid modes: files, imports, functions, types, packages');
      break;
  }
  
  return stats;
}

/**
 * Prints removal statistics recap
 */
function _print_recap(stats: TRemovalStats): void {
  console.log('\n' + '='.repeat(50));
  console.log('🎉 REMOVAL RECAP');
  console.log('='.repeat(50));
  console.log(`📁 Files deleted: ${stats.filesDeleted}`);
  console.log(`📦 Dependencies removed: ${stats.dependenciesRemoved}`);
  console.log(`🔧 Imports/Functions/Types processed: ${stats.importsRemoved + stats.functionsRemoved + stats.typesRemoved}`);
  console.log(`💾 Disk space freed: ${_format_bytes(stats.totalSize)}`);
  
  if (stats.recap.length > 0) {
    console.log('\n📝 Operation Log:');
    stats.recap.forEach((entry, index) => {
      console.log(`  ${(index + 1).toString().padStart(2, ' ')}. ${entry}`);
    });
  }
  
  console.log('='.repeat(50));
}

// Main execution
if (require.main === module || (import.meta as any).main) {
  const args = process.argv.slice(2);
  const yesFlag = args.includes('--yes') || args.includes('-y');
  
  // Perform safety checks
  const safetyResult = _ensure_clean_git();
  console.log(safetyResult.message);
  
  if (!safetyResult.success) {
    process.exit(1);
  }
  
  try {
    // Run interactive removal
    const stats = _interactive_remove(yesFlag);
    
    // Print recap
    _print_recap(stats);
    
    if (stats.filesDeleted > 0 || stats.dependenciesRemoved > 0) {
      console.log('\n💡 Tip: You can restore deleted files using:');
      console.log('   bun scripts/git-safety.ts restore');
    }
    
  } catch (error) {
    console.error('❌ Error during removal process:', error);
    process.exit(1);
  }
}

export { 
  _interactive_remove, 
  _generate_candidates, 
  _interactive_selection,
  _execute_removal_by_mode,
  _remove_files,
  _remove_imports_functions_types,
  _remove_packages,
  _print_recap
};
