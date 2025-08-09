# Interactive Unused Code Removal System

A comprehensive system for safely removing unused files and dependencies from your TypeScript/JavaScript project.

## Features

- 🔍 **Smart Detection**: Uses `knip` for unused files and `depcheck` for unused dependencies
- 🎯 **Interactive Selection**: Uses `fzf` for beautiful multi-select interface with checkboxes
- 🛡️ **Safety First**: Automatic git safety checks and backup system
- 📊 **Detailed Reports**: Shows file sizes and provides removal statistics
- ⚡ **Batch Operations**: Remove multiple files and dependencies in one go
- 🔄 **Easy Restoration**: Integrated backup system for quick recovery

## Usage

### Interactive Mode (Recommended)

```bash
# Interactive selection with fzf
bun run remove-unused

# Or directly
bun scripts/remove-unused.ts
```

### Non-Interactive Mode

```bash
# Skip interaction and remove all detected unused items
bun run remove-unused:yes

# Or with flag
bun scripts/remove-unused.ts --yes
```

## How It Works

### 1. Safety Checks
- Verifies you're in a git repository
- Ensures clean git working directory
- Confirms presence of `package.json`

### 2. Candidate Generation
- **Files**: Uses `knip --reporter json` to find unused files
- **Dependencies**: Uses `depcheck --json` to find unused packages
- Shows file sizes for better decision making

### 3. Interactive Selection
- Uses `fzf --multi --ansi --bind "space:toggle"` for checkbox interface
- Press `SPACE` to toggle selection
- Press `ENTER` to confirm
- Press `ESC` to cancel

### 4. Safe Removal Process
- Creates backup in `.git/unused-backups/{timestamp}/`
- Deletes selected files with `rm`
- Updates `package.json` and runs `bun install`
- Provides detailed statistics

### 5. Recovery Options
- Backups are automatically created before any deletion
- Use the git-safety system to restore files if needed

## Dependencies

- **fzf**: Interactive fuzzy finder (install with `brew install fzf` or equivalent)
- **knip**: JavaScript/TypeScript unused code detector
- **depcheck**: Unused dependency detector

## Key Features

### Safety Mechanisms
- Git repository validation
- Clean working directory requirement
- Automatic backup creation
- Error handling with graceful fallbacks

### User Experience
- Color-coded output with emojis
- File size information
- Progress indicators
- Clear error messages
- Detailed removal statistics

### Integration
- Works with existing git-safety system
- Uses Bun package manager (falls back to pnpm if needed)
- Preserves package.json formatting with tabs

## Examples

### Typical Workflow

```bash
# 1. Run the interactive removal tool
bun run remove-unused

# 2. Review detected unused files and dependencies
# 3. Use SPACE to select items you want to remove
# 4. Press ENTER to confirm
# 5. Review the removal statistics

# If you need to restore something:
bun scripts/git-safety.ts restore
```

### Output Example

```
🔍 Scanning for unused files...
🔍 Scanning for unused dependencies...

📋 Found 15 candidates for removal:
  001: Unused file: ./src/old-component.tsx (2.3 KB)
  002: Unused dependency: lodash
  ...

✅ Selected 8 items for removal

📦 Creating backup for 5 files...
✅ Backup created successfully: .git/unused-backups/1703123456

🗑️  Deleting: ./src/old-component.tsx
...

📦 Removing 3 dependencies from package.json...
  ✓ Removed dependency: lodash
  ...

==================================================
🎉 REMOVAL RECAP
==================================================
📁 Files deleted: 5
📦 Dependencies removed: 3
💾 Disk space freed: 45.2 KB
==================================================

💡 Tip: You can restore deleted files using:
   bun scripts/git-safety.ts restore
```

## Configuration

The script automatically detects unused code using:
- **knip**: Configure via `knip.json` or `package.json`
- **depcheck**: Configure via `.depcheckrc` or `package.json`

## Troubleshooting

### fzf not found
Install fzf: `brew install fzf` (macOS) or equivalent for your system

### knip/depcheck errors
These tools require proper project setup. Ensure your `package.json` and TypeScript configuration are valid.

### Backup restoration
Use the git-safety system: `bun scripts/git-safety.ts restore [timestamp]`

## Integration with Existing Tools

This system integrates with:
- `scripts/git-safety.ts` - Backup and restoration system  
- `scripts/cleanup-exports.mjs` - Unused exports cleanup
- Your project's git workflow and package manager setup
