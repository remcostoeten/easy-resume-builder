#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync, readFileSync, existsSync } from 'fs';

const LIGHTHOUSE_URL = 'http://localhost:3000';

function runCoverageAnalysis() {
	try {
		console.log('🔍 Running Chrome DevTools Coverage Analysis...\n');
		
		// Check if server is running
		try {
			execSync(`curl -s ${LIGHTHOUSE_URL} > /dev/null`);
		} catch {
			console.log('🚀 Starting development server for coverage analysis...');
			// Start server in background
			execSync('bun run dev &', { stdio: 'ignore' });
			
			// Wait for server to be ready
			let retries = 30;
			while (retries > 0) {
				try {
					execSync(`curl -s ${LIGHTHOUSE_URL} > /dev/null`);
					break;
				} catch {
					console.log('⏳ Waiting for server...');
					execSync('sleep 2');
					retries--;
				}
			}
			
			if (retries === 0) {
				throw new Error('Server failed to start');
			}
		}
		
		// Use Puppeteer for coverage analysis
		const coverageScript = `
const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch({ 
		headless: true,
		args: ['--no-sandbox', '--disable-dev-shm-usage']
	});
	
	const page = await browser.newPage();
	
	// Start JS and CSS coverage
	await Promise.all([
		page.coverage.startJSCoverage(),
		page.coverage.startCSSCoverage()
	]);
	
	// Navigate to main pages
	const pages = [
		'${LIGHTHOUSE_URL}',
		'${LIGHTHOUSE_URL}/dashboard',
		'${LIGHTHOUSE_URL}/login',
		'${LIGHTHOUSE_URL}/register'
	];
	
	const allJsCoverage = [];
	const allCssCoverage = [];
	
	for (const url of pages) {
		try {
			console.log(\`Analyzing: \${url}\`);
			await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
			
			// Interact with the page to load dynamic content
			await page.evaluate(() => {
				// Trigger any lazy-loaded content
				window.scrollTo(0, document.body.scrollHeight);
			});
			
			await page.waitForTimeout(2000);
		} catch (error) {
			console.log(\`⚠️  Could not analyze \${url}: \${error.message}\`);
		}
	}
	
	// Stop coverage and get results
	const [jsCoverage, cssCoverage] = await Promise.all([
		page.coverage.stopJSCoverage(),
		page.coverage.stopCSSCoverage(),
	]);
	
	// Analyze JS coverage
	let totalBytes = 0;
	let usedBytes = 0;
	const unusedFiles = [];
	
	for (const entry of jsCoverage) {
		totalBytes += entry.text.length;
		
		for (const range of entry.ranges) {
			usedBytes += range.end - range.start - 1;
		}
		
		const usedPercent = (usedBytes / entry.text.length) * 100;
		
		if (usedPercent < 50 && entry.text.length > 1000) {
			unusedFiles.push({
				url: entry.url,
				totalBytes: entry.text.length,
				usedBytes: usedBytes,
				usedPercent: usedPercent.toFixed(1)
			});
		}
	}
	
	// Generate report
	const report = {
		summary: {
			totalJSBytes: totalBytes,
			usedJSBytes: usedBytes,
			unusedJSBytes: totalBytes - usedBytes,
			unusedPercent: ((totalBytes - usedBytes) / totalBytes * 100).toFixed(1)
		},
		unusedFiles: unusedFiles.sort((a, b) => b.totalBytes - a.totalBytes)
	};
	
	console.log(JSON.stringify(report, null, 2));
	
	await browser.close();
})();
		`;
		
		// Write and execute the coverage script
		writeFileSync('./perf/coverage-script.js', coverageScript);
		
		try {
			// Install puppeteer if not available
			try {
				execSync('node -e "require.resolve(\'puppeteer\')"', { stdio: 'ignore' });
			} catch {
				console.log('📦 Installing puppeteer for coverage analysis...');
				execSync('bun add --dev puppeteer', { stdio: 'pipe' });
			}
			
			const coverageOutput = execSync('node ./perf/coverage-script.js', { encoding: 'utf8' });
			const coverageData = JSON.parse(coverageOutput.split('\n').find(line => line.startsWith('{')));
			
			// Clean up script
			execSync('rm ./perf/coverage-script.js');
			
			// Generate readable report
			generateCoverageReport(coverageData);
			
		} catch (error) {
			console.error('❌ Error running coverage analysis:', error.message);
			console.log('\n💡 Manual Coverage Analysis Steps:');
			console.log('1. Open Chrome DevTools (F12)');
			console.log('2. Go to Coverage tab (More tools > Coverage)');
			console.log('3. Click record and navigate through your app');
			console.log('4. Stop recording to see unused code');
			console.log('5. Focus on files with \u003c50% usage and \u003e1KB size');
		}
		
	} catch (error) {
		console.error('❌ Coverage analysis failed:', error.message);
	}
}

function generateCoverageReport(data) {
	const report = `# Coverage Analysis Report

Generated: ${new Date().toISOString()}

## Summary
- **Total JS Bytes**: ${formatBytes(data.summary.totalJSBytes)}
- **Used JS Bytes**: ${formatBytes(data.summary.usedJSBytes)}
- **Unused JS Bytes**: ${formatBytes(data.summary.unusedJSBytes)}
- **Unused Percentage**: ${data.summary.unusedPercent}%

## Files with Low Usage (\u003c50% used, \u003e1KB)

${data.unusedFiles.map(file => `
### ${file.url.split('/').pop()}
- **Size**: ${formatBytes(file.totalBytes)}
- **Used**: ${file.usedPercent}%
- **Unused**: ${formatBytes(file.totalBytes - file.usedBytes)}
`).join('')}

## Optimization Recommendations

1. **Dynamic Imports**: Convert large unused sections to dynamic imports
2. **Tree Shaking**: Ensure unused exports are properly tree-shaken
3. **Code Splitting**: Split large bundles into smaller chunks
4. **Lazy Loading**: Load components only when needed

## Next Steps

1. Review files with high unused percentages
2. Implement dynamic imports for heavy features
3. Remove unused dependencies and code
4. Re-run performance measurement: \`bun run perf:measure\`
`;
	
	writeFileSync('./perf/coverage-report.md', report);
	
	console.log('\n📊 Coverage Analysis Results:');
	console.log(`   Total JS: ${formatBytes(data.summary.totalJSBytes)}`);
	console.log(`   Unused: ${formatBytes(data.summary.unusedJSBytes)} (${data.summary.unusedPercent}%)`);
	console.log(`   Files to optimize: ${data.unusedFiles.length}`);
	
	if (data.unusedFiles.length > 0) {
		console.log('\n🎯 Top files to optimize:');
		data.unusedFiles.slice(0, 5).forEach((file, index) => {
			console.log(`   ${index + 1}. ${file.url.split('/').pop()}: ${formatBytes(file.totalBytes)} (${file.usedPercent}% used)`);
		});
	}
	
	console.log(`\n📝 Full report saved to: perf/coverage-report.md`);
}

function formatBytes(bytes) {
	if (bytes === 0) return '0 B';
	const k = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function main() {
	console.log('🔍 Starting Coverage Analysis...\n');
	runCoverageAnalysis();
}

main();
