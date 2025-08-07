#!/usr/bin/env node

import { readFileSync } from 'fs'
import { execSync } from 'child_process'

// Get list of staged files
let stagedFiles
try {
  stagedFiles = execSync('git diff --cached --name-only --diff-filter=ACMR', { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(file => file.match(/\.(ts|tsx|js|jsx)$/))
} catch (error) {
  // No staged files
  process.exit(0)
}

if (stagedFiles.length === 0 || stagedFiles[0] === '') {
  process.exit(0)
}

let hasError = false
const errors = []

for (const file of stagedFiles) {
  try {
    const content = readFileSync(file, 'utf8')
    
    // Check for direct motion import from framer-motion (not /dom)
    const directMotionImport = /import\s*\{[^}]*\bmotion\b[^}]*\}\s*from\s*['"]framer-motion['"]/
    const isAliasedImport = /import\s*\{[^}]*\bm\s+as\s+motion\b[^}]*\}\s*from\s*['"]framer-motion['"]/
    
    if (directMotionImport.test(content) && !isAliasedImport.test(content)) {
      hasError = true
      errors.push({
        file,
        matches: 1
      })
    }
  } catch (error) {
    // File might be deleted, skip
    continue
  }
}

if (hasError) {
  console.error('\n❌ Pre-commit check failed: Incorrect Framer Motion import detected!\n')
  
  errors.forEach(({ file, matches }) => {
    console.error(`📁 ${file}`)
    console.error(`   Found ${matches} incorrect import${matches > 1 ? 's' : ''}`)
  })
  
  console.error('\n🔧 Fix required:')
  console.error('   Replace: import { motion } from \'framer-motion\'')
  console.error('   With one of:')
  console.error('     • import { motion } from \'framer-motion/dom\'    (preferred)')
  console.error('     • import { m as motion } from \'framer-motion\'   (acceptable)')
  console.error('')
  console.error('   This ensures tree-shaking and reduces bundle size.')
  console.error('   See docs/animation-guidelines.md for more details.\n')
  
  process.exit(1)
}

console.log('✅ Framer Motion imports check passed')
process.exit(0)
