#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const BUDGET_CONFIG = {
  routes: {
    '/': { budget: 200 * 1024, name: 'Landing Page' }, // 200 KB
    '/dashboard': { budget: 180 * 1024, name: 'Resume Builder' }, // 180 KB
    '/dashboard/profile': { budget: 150 * 1024, name: 'Profile Page' }, // 150 KB
    '/login': { budget: 150 * 1024, name: 'Login Page' }, // 150 KB
    '/register': { budget: 150 * 1024, name: 'Register Page' }, // 150 KB
  },
  chunks: {
    maxIndividualChunk: 150 * 1024, // 150 KB
    maxTotalJS: 1.5 * 1024 * 1024, // 1.5 MB
  }
};

function parseNextBuildOutput(buildOutput) {
  const lines = buildOutput.split('\n');
  const routes = {};
  let parsingRoutes = false;

  for (const line of lines) {
    // Start parsing when we see the route table
    if (line.includes('Route (app)') && line.includes('Size') && line.includes('First Load JS')) {
      parsingRoutes = true;
      continue;
    }

    // Stop parsing at the shared chunk summary
    if (line.includes('+ First Load JS shared by all')) {
      parsingRoutes = false;
      continue;
    }

    if (parsingRoutes && line.trim()) {
      // Parse route lines like: "├ ○ /dashboard     14.1 kB    288 kB"
      const routeMatch = line.match(/[├└│]\s*[○ƒ]\s*(.+?)\s+(\d+(?:\.\d+)?)\s*([kKmM]B)\s+(\d+(?:\.\d+)?)\s*([kKmM]B)/);
      
      if (routeMatch) {
        const [, route, pageSize, pageSizeUnit, firstLoadSize, firstLoadUnit] = routeMatch;
        const routePath = route.trim();
        
        // Convert to bytes
        const pageSizeBytes = parseSize(pageSize, pageSizeUnit);
        const firstLoadSizeBytes = parseSize(firstLoadSize, firstLoadUnit);
        
        routes[routePath] = {
          pageSize: pageSizeBytes,
          firstLoadJS: firstLoadSizeBytes,
        };
      }
    }
  }

  return routes;
}

function parseSize(size, unit) {
  const value = parseFloat(size);
  const upperUnit = unit.toUpperCase();
  
  switch (upperUnit) {
    case 'B': return value;
    case 'KB': return value * 1024;
    case 'MB': return value * 1024 * 1024;
    default: return value * 1024; // assume KB if unclear
  }
}

function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i];
}

function checkBudgets(routes) {
  const results = {
    violations: [],
    warnings: [],
    passed: []
  };

  for (const [route, data] of Object.entries(routes)) {
    const budgetConfig = BUDGET_CONFIG.routes[route];
    if (!budgetConfig) {
      results.warnings.push({
        type: 'route',
        route,
        message: `No budget defined for route ${route}`,
        actual: data.firstLoadJS,
      });
      continue;
    }

    const { budget, name } = budgetConfig;
    const actual = data.firstLoadJS;
    const overBudget = actual > budget;
    const percentOver = ((actual - budget) / budget * 100).toFixed(1);

    if (overBudget) {
      results.violations.push({
        type: 'route',
        route,
        name,
        budget: formatSize(budget),
        actual: formatSize(actual),
        percentOver: `+${percentOver}%`,
        severity: actual > budget * 1.5 ? 'critical' : 'warning'
      });
    } else {
      results.passed.push({
        type: 'route',
        route,
        name,
        budget: formatSize(budget),
        actual: formatSize(actual),
        percentUnder: `${((budget - actual) / budget * 100).toFixed(1)}% under`
      });
    }
  }

  return results;
}

function generateReport(routes, budgetResults) {
  const now = new Date().toISOString();
  
  let report = `# Bundle Size Report\n`;
  report += `*Generated: ${now}*\n\n`;

  // Summary
  const totalViolations = budgetResults.violations.length;
  const totalWarnings = budgetResults.warnings.length;
  const totalPassed = budgetResults.passed.length;

  report += `## Summary\n`;
  report += `- ✅ **Passed**: ${totalPassed} routes within budget\n`;
  report += `- ⚠️  **Warnings**: ${totalWarnings} routes with warnings\n`;
  report += `- ❌ **Violations**: ${totalViolations} routes over budget\n\n`;

  if (totalViolations > 0) {
    report += `## ❌ Budget Violations\n\n`;
    report += `| Route | Name | Budget | Actual | Over Budget | Severity |\n`;
    report += `|-------|------|--------|--------|-------------|----------|\n`;
    
    for (const violation of budgetResults.violations) {
      const severity = violation.severity === 'critical' ? '🔴 Critical' : '🟡 Warning';
      report += `| ${violation.route} | ${violation.name} | ${violation.budget} | ${violation.actual} | ${violation.percentOver} | ${severity} |\n`;
    }
    report += `\n`;
  }

  if (totalPassed > 0) {
    report += `## ✅ Routes Within Budget\n\n`;
    report += `| Route | Name | Budget | Actual | Margin |\n`;
    report += `|-------|------|--------|--------|---------|\n`;
    
    for (const passed of budgetResults.passed) {
      report += `| ${passed.route} | ${passed.name} | ${passed.budget} | ${passed.actual} | ${passed.percentUnder} |\n`;
    }
    report += `\n`;
  }

  if (totalWarnings > 0) {
    report += `## ⚠️ Warnings\n\n`;
    for (const warning of budgetResults.warnings) {
      report += `- ${warning.message}\n`;
    }
    report += `\n`;
  }

  // Route details
  report += `## Route Details\n\n`;
  for (const [route, data] of Object.entries(routes)) {
    report += `### ${route}\n`;
    report += `- **Page Size**: ${formatSize(data.pageSize)}\n`;
    report += `- **First Load JS**: ${formatSize(data.firstLoadJS)}\n\n`;
  }

  return report;
}

function saveBudgetHistory(routes, budgetResults) {
  const historyFile = join(process.cwd(), 'scripts', 'snapshots', 'bundle-history.json');
  let history = [];

  if (existsSync(historyFile)) {
    try {
      const content = readFileSync(historyFile, 'utf8');
      history = JSON.parse(content);
    } catch (error) {
      console.warn('Could not read bundle history:', error.message);
    }
  }

  const entry = {
    timestamp: new Date().toISOString(),
    routes,
    summary: {
      passed: budgetResults.passed.length,
      warnings: budgetResults.warnings.length,
      violations: budgetResults.violations.length,
    }
  };

  history.push(entry);
  
  // Keep only last 50 entries
  if (history.length > 50) {
    history = history.slice(-50);
  }

  try {
    writeFileSync(historyFile, JSON.stringify(history, null, 2));
    console.log(`📊 Bundle history saved to ${historyFile}`);
  } catch (error) {
    console.warn('Could not save bundle history:', error.message);
  }
}

function main() {
  // This script expects to be run after `next build`
  // It reads the build output from a file or stdin
  
  const buildOutputFile = process.argv[2];
  let buildOutput = '';

  if (buildOutputFile && existsSync(buildOutputFile)) {
    buildOutput = readFileSync(buildOutputFile, 'utf8');
  } else {
    console.log('📏 Bundle size tracking requires build output.');
    console.log('Usage: bun run track-bundle-size [build-output-file]');
    console.log('Or pipe build output: next build | bun scripts/track-bundle-size.mjs');
    return;
  }

  if (!buildOutput.trim()) {
    console.warn('⚠️ No build output provided');
    return;
  }

  const routes = parseNextBuildOutput(buildOutput);
  
  if (Object.keys(routes).length === 0) {
    console.warn('⚠️ Could not parse any routes from build output');
    return;
  }

  const budgetResults = checkBudgets(routes);
  const report = generateReport(routes, budgetResults);
  
  console.log(report);
  
  // Save report
  const reportFile = join(process.cwd(), 'scripts', 'snapshots', `bundle-report-${Date.now()}.md`);
  try {
    writeFileSync(reportFile, report);
    console.log(`📊 Report saved to ${reportFile}`);
  } catch (error) {
    console.warn('Could not save report:', error.message);
  }

  // Save history
  saveBudgetHistory(routes, budgetResults);

  // Exit with error code if there are violations for CI/CD
  const criticalViolations = budgetResults.violations.filter(v => v.severity === 'critical');
  if (criticalViolations.length > 0) {
    console.error(`\n🚨 ${criticalViolations.length} critical budget violation(s) found!`);
    process.exit(1);
  } else if (budgetResults.violations.length > 0) {
    console.warn(`\n⚠️  ${budgetResults.violations.length} budget violation(s) found.`);
    process.exit(0); // Don't fail CI for warnings, just alert
  }
  
  console.log('\n✅ All routes within budget!');
}

main();
