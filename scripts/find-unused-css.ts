#!/usr/bin/env bun

import { parseArgs } from "node:util";
import { readFile, writeFile, copyFile } from "node:fs/promises";
import { resolve, relative, basename } from "node:path";
import { existsSync } from "node:fs";
import postcss from "postcss";
import selectorParser from "postcss-selector-parser";
import { glob } from "glob";
import inquirer from "inquirer";

type ClassUsageMap = Map<string, string[]>;
type ClassesByFile = Map<string, Set<string>>;

const CSS_FILES = [
  "src/styles/global-transitions.css",
  "src/styles/globals.css",
  "src/styles/modal-transitions.css",
  "src/styles/theme.css",
  "src/styles/view-transitions.css",
];

// Colors for terminal output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

async function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      report: { type: "boolean", default: true },
      delete: { type: "boolean", default: false },
      yes: { type: "boolean", default: false },
    },
  });

  console.log(`${colors.cyan}🔍 Analyzing CSS classes in src/styles...${colors.reset}\n`);

  // Step 1: Collect all CSS classes
  const classesByFile = await collectCSSClasses();
  const allClasses = new Set<string>();
  for (const classes of classesByFile.values()) {
    for (const cls of classes) {
      allClasses.add(cls);
    }
  }

  console.log(`${colors.gray}Found ${allClasses.size} custom CSS classes across ${classesByFile.size} files${colors.reset}`);

  // Step 2: Scan source files for usage
  const usageMap = await scanSourceFiles(allClasses);

  // Step 3: Generate report
  const unusedByFile = generateReport(classesByFile, usageMap);

  // Step 4: Handle deletion if requested
  if (values.delete && unusedByFile.size > 0) {
    await handleDeletion(unusedByFile, values.yes);
  }
}

async function collectCSSClasses(): Promise<ClassesByFile> {
  const classesByFile = new Map<string, Set<string>>();

  for (const filePath of CSS_FILES) {
    const fullPath = resolve(filePath);
    if (!existsSync(fullPath)) {
      console.log(`${colors.yellow}⚠️  Skipping ${filePath} (file not found)${colors.reset}`);
      continue;
    }

    const content = await readFile(fullPath, "utf-8");
    const classes = new Set<string>();

    try {
      const ast = postcss.parse(content);
      
      ast.walkRules((rule) => {
        const extracted = extractClassesFromSelector(rule.selector);
        extracted.forEach(cls => classes.add(cls));
      });

      classesByFile.set(filePath, classes);
    } catch (error) {
      console.error(`${colors.red}❌ Error parsing ${filePath}: ${error}${colors.reset}`);
    }
  }

  return classesByFile;
}

function extractClassesFromSelector(selector: string): Set<string> {
  const classes = new Set<string>();
  
  try {
    const ast = selectorParser().astSync(selector);
    
    ast.walkClasses((classNode) => {
      const className = classNode.value;
      
      // Skip Tailwind utilities (basic check)
      if (isTailwindUtility(className)) return;
      
      // Skip pseudo-class selectors
      const parent = classNode.parent;
      if (parent && parent.type === "pseudo") return;
      
      classes.add(className);
    });
  } catch (error) {
    // Silently skip malformed selectors
  }
  
  return classes;
}

function isTailwindUtility(className: string): boolean {
  // Skip classes that look like Tailwind utilities
  // This is a basic heuristic - you can expand this
  
  // Classes with responsive/state prefixes (sm:, hover:, etc)
  if (/^[a-z]+:/.test(className)) return true;
  
  // Classes with arbitrary values (w-[100px], text-[#fff], etc)
  if (/\[.+\]/.test(className)) return true;
  
  // Classes with forward/back slashes (escaped chars)
  if (/[\/\\]/.test(className)) return true;
  
  // Common Tailwind patterns
  const tailwindPatterns = [
    /^(w|h|p|m|text|bg|border|rounded|flex|grid|gap|space)-/,
    /^(min|max)-(w|h)-/,
    /^(top|right|bottom|left|inset)-/,
    /^(opacity|z|order)-/,
  ];
  
  return tailwindPatterns.some(pattern => pattern.test(className));
}

async function scanSourceFiles(classes: Set<string>): Promise<ClassUsageMap> {
  const usageMap: ClassUsageMap = new Map();
  
  // Initialize map with empty arrays
  for (const cls of classes) {
    usageMap.set(cls, []);
  }
  
  // Find all source files
  const sourceFiles = await glob("src/**/*.{ts,tsx,js,jsx}", {
    ignore: ["**/node_modules/**", "**/.next/**"],
  });
  
  console.log(`${colors.gray}Scanning ${sourceFiles.length} source files...${colors.reset}`);
  
  for (const file of sourceFiles) {
    const content = await readFile(file, "utf-8");
    
    for (const cls of classes) {
      if (isClassUsedInContent(cls, content)) {
        usageMap.get(cls)!.push(file);
      }
    }
  }
  
  return usageMap;
}

function isClassUsedInContent(className: string, content: string): boolean {
  // Escape special regex characters in className
  const escaped = className.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Various patterns where classes might appear
  const patterns = [
    // className="..." or className={...}
    new RegExp(`className=["\'\`][^"\'\`]*\\b${escaped}\\b[^"\'\`]*["\'\`]`, 'g'),
    new RegExp(`className=\\{[^}]*["'\`][^"\'\`]*\\b${escaped}\\b[^"\'\`]*["'\`][^}]*\\}`, 'g'),
    
    // class="..." (for HTML)
    new RegExp(`class=["\'\`][^"\'\`]*\\b${escaped}\\b[^"\'\`]*["\'\`]`, 'g'),
    
    // Inside clsx, cn, or classNames function calls
    new RegExp(`(?:clsx|cn|classNames)\\s*\\([^)]*["'\`][^"\'\`]*\\b${escaped}\\b[^"\'\`]*["'\`]`, 'g'),
    
    // Inside template literals
    new RegExp(`\\\${[^}]*}[^"\'\`]*\\b${escaped}\\b`, 'g'),
    
    // Direct string references (for dynamic classes)
    new RegExp(`["'\`]${escaped}["'\`]`, 'g'),
  ];
  
  return patterns.some(pattern => pattern.test(content));
}

function generateReport(classesByFile: ClassesByFile, usageMap: ClassUsageMap): Map<string, string[]> {
  const unusedByFile = new Map<string, string[]>();
  let totalUnused = 0;
  let totalUsed = 0;
  
  console.log(`\n${colors.cyan}📊 CSS Usage Report${colors.reset}`);
  console.log("=".repeat(50));
  
  for (const [file, classes] of classesByFile) {
    const unused: string[] = [];
    const used: string[] = [];
    
    for (const cls of classes) {
      const usages = usageMap.get(cls) || [];
      if (usages.length === 0) {
        unused.push(cls);
        totalUnused++;
      } else {
        used.push(cls);
        totalUsed++;
      }
    }
    
    console.log(`\n${colors.blue}${file}${colors.reset}`);
    console.log(`  Total classes: ${classes.size}`);
    console.log(`  ${colors.green}✓ Used: ${used.length}${colors.reset}`);
    console.log(`  ${colors.red}✗ Unused: ${unused.length}${colors.reset}`);
    
    if (unused.length > 0) {
      unusedByFile.set(file, unused);
      console.log(`\n  ${colors.gray}Unused classes:${colors.reset}`);
      unused.forEach(cls => {
        console.log(`    ${colors.red}- ${cls}${colors.reset}`);
      });
    }
  }
  
  console.log("\n" + "=".repeat(50));
  console.log(`${colors.cyan}Summary:${colors.reset}`);
  console.log(`  Total classes: ${totalUsed + totalUnused}`);
  console.log(`  ${colors.green}✓ Used: ${totalUsed}${colors.reset}`);
  console.log(`  ${colors.red}✗ Unused: ${totalUnused}${colors.reset}`);
  
  // Write JSON report
  const reportPath = "unused-css-report.json";
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalClasses: totalUsed + totalUnused,
      usedClasses: totalUsed,
      unusedClasses: totalUnused,
    },
    unused: Object.fromEntries(unusedByFile),
  };
  
  writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n${colors.gray}Report saved to ${reportPath}${colors.reset}`);
  
  return unusedByFile;
}

async function handleDeletion(unusedByFile: Map<string, string[]>, skipPrompt: boolean) {
  const totalUnused = Array.from(unusedByFile.values()).reduce((sum, arr) => sum + arr.length, 0);
  
  console.log(`\n${colors.yellow}⚠️  Found ${totalUnused} unused classes${colors.reset}`);
  
  if (!skipPrompt) {
    const { proceed } = await inquirer.prompt([{
      type: "confirm",
      name: "proceed",
      message: "Do you want to remove these unused classes from the CSS files?",
      default: false,
    }]);
    
    if (!proceed) {
      console.log(`${colors.gray}Operation cancelled${colors.reset}`);
      return;
    }
  }
  
  console.log(`\n${colors.cyan}🗑️  Removing unused classes...${colors.reset}`);
  
  for (const [file, unusedClasses] of unusedByFile) {
    const fullPath = resolve(file);
    const backupPath = `${fullPath}.bak`;
    
    // Create backup
    await copyFile(fullPath, backupPath);
    console.log(`${colors.gray}Created backup: ${basename(backupPath)}${colors.reset}`);
    
    // Read and process CSS
    const content = await readFile(fullPath, "utf-8");
    const processedCSS = await removeUnusedClasses(content, new Set(unusedClasses));
    
    // Write updated CSS
    await writeFile(fullPath, processedCSS);
    console.log(`${colors.green}✓ Updated ${file}${colors.reset}`);
  }
  
  console.log(`\n${colors.green}✅ Successfully removed ${totalUnused} unused classes${colors.reset}`);
  console.log(`${colors.gray}Backups created with .bak extension${colors.reset}`);
  
  // Re-run analysis to show new state
  console.log(`\n${colors.cyan}Re-analyzing to verify changes...${colors.reset}`);
  const updatedClassesByFile = await collectCSSClasses();
  const updatedAllClasses = new Set<string>();
  for (const classes of updatedClassesByFile.values()) {
    for (const cls of classes) {
      updatedAllClasses.add(cls);
    }
  }
  const updatedUsageMap = await scanSourceFiles(updatedAllClasses);
  generateReport(updatedClassesByFile, updatedUsageMap);
}

async function removeUnusedClasses(css: string, unusedClasses: Set<string>): Promise<string> {
  const ast = postcss.parse(css);
  const rulesToRemove: postcss.Rule[] = [];
  
  ast.walkRules((rule) => {
    const processed = selectorParser((selectors) => {
      selectors.walkClasses((classNode) => {
        if (unusedClasses.has(classNode.value)) {
          // Remove the class selector
          const selector = classNode.parent;
          if (selector && selector.type === "selector") {
            classNode.remove();
            
            // If selector is now empty, mark for removal
            if (selector.nodes.length === 0) {
              selector.remove();
            }
          }
        }
      });
    }).processSync(rule.selector);
    
    rule.selector = processed;
    
    // If rule has no selectors left, mark for removal
    if (rule.selector.trim() === "") {
      rulesToRemove.push(rule);
    }
  });
  
  // Remove empty rules
  rulesToRemove.forEach(rule => rule.remove());
  
  return ast.toString();
}

// Run the script
main().catch(console.error);
