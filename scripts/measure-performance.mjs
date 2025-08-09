#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, appendFileSync, readdirSync, statSync, mkdirSync } from 'fs';
import { join } from 'path';

const TARGET_FIRST_LOAD_JS = 200; // KB
const TARGET_FPS = 55;
const LIGHTHOUSE_URL = 'http://localhost:3000';

function formatBytes(bytes) {
	if (bytes === 0) return 0;
	const k = 1024;
	return Math.round(bytes / k);
}

function getCommitHash() {
	try {
		return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
	} catch {
		return 'unknown';
	}
}

function getDirectorySize(dir) {
	try {
		const files = readdirSync(dir);
		let totalSize = 0;
		
		for (const file of files) {
			const filePath = join(dir, file);
			const stats = statSync(filePath);
			
			if (stats.isDirectory()) {
				totalSize += getDirectorySize(filePath);
			} else {
				totalSize += stats.size;
			}
		}
		
		return totalSize;
	} catch (error) {
		return 0;
	}
}

async function getBundleSize() {
	try {
		// Build first
		console.log('🔨 Building application...');
		const buildOutput = execSync('bun run build', { encoding: 'utf8' });
		
		// Extract First Load JS sizes from build output
		const lines = buildOutput.split('\n');
		let firstLoadJS = 0;
		let totalBundle = 0;
		
		for (const line of lines) {
			if (line.includes('First Load JS')) {
				const match = line.match(/(\d+(?:\.\d+)?)\s*kB/);
				if (match) {
					const size = parseFloat(match[1]);
					if (size > firstLoadJS) {
							firstLoadJS = size;
					}
				}
			}
		}
		
		// Get total .next directory size as fallback
		try {
			const nextSize = getDirectorySize('./.next');
			totalBundle = formatBytes(nextSize);
		} catch {
			totalBundle = Math.round(firstLoadJS * 1.5); // Rough estimate
		}
		
		return { firstLoadJS, totalBundle };
	} catch (error) {
		console.error('❌ Error building or analyzing bundle:', error.message);
		return { firstLoadJS: 0, totalBundle: 0 };
	}
}

function runLighthouse() {
	try {
		console.log('🔍 Running Lighthouse audit...');
		
		// Check if server is running
		try {
			execSync(`curl -s ${LIGHTHOUSE_URL} > /dev/null`);
		} catch {
			console.log('🚀 Starting development server...');
			// Start server in background
			const serverProcess = execSync('bun run dev &', { stdio: 'ignore' });
			
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
		
		// Run Lighthouse with specific metrics
		const lighthouseCmd = `
			bunx lighthouse ${LIGHTHOUSE_URL} \
			--only-categories=performance \
			--output=json \
			--output-path=./perf/lighthouse-temp.json \
			--chrome-flags="--headless --no-sandbox --disable-dev-shm-usage" \
			--quiet
		`;
		
		execSync(lighthouseCmd, { stdio: 'pipe' });
		
		// Parse Lighthouse results
		const lighthouseData = JSON.parse(readFileSync('./perf/lighthouse-temp.json', 'utf8'));
		const audits = lighthouseData.audits;
		
		const metrics = {
			performance: Math.round(lighthouseData.categories.performance.score * 100),
			fcp: Math.round(audits['first-contentful-paint'].numericValue),
			lcp: Math.round(audits['largest-contentful-paint'].numericValue),
			cls: parseFloat(audits['cumulative-layout-shift'].numericValue.toFixed(3)),
			fps: audits['mainthread-work-breakdown'] ? 
				Math.round(60 - (audits['mainthread-work-breakdown'].numericValue / 1000 * 0.6)) : 0
		};
		
		// Clean up temp file
		try {
			execSync('rm ./perf/lighthouse-temp.json');
		} catch {}
		
		return metrics;
	} catch (error) {
		console.error('❌ Error running Lighthouse:', error.message);
		return {
			performance: 0,
			fcp: 0,
			lcp: 0,
			cls: 0,
			fps: 0
		};
	}
}

function logToHistory(bundleData, lighthouseData, notes = '') {
	const timestamp = new Date().toISOString();
	const commitHash = getCommitHash();
	
	const csvLine = [
		timestamp,
		commitHash,
		bundleData.firstLoadJS,
		bundleData.totalBundle,
		lighthouseData.performance,
		lighthouseData.fcp,
		lighthouseData.lcp,
		lighthouseData.cls,
		lighthouseData.fps,
		notes
	].join(',');
	
	if (!existsSync('./perf')) { mkdirSync('./perf', { recursive: true }); }
	appendFileSync('./perf/history.csv', csvLine + '\n');
	
	console.log('\n📊 Performance metrics logged:');
	console.log(`   First Load JS: ${bundleData.firstLoadJS} KB`);
	console.log(`   Total Bundle: ${bundleData.totalBundle} KB`);
	console.log(`   Performance Score: ${lighthouseData.performance}`);
	console.log(`   FCP: ${lighthouseData.fcp} ms`);
	console.log(`   LCP: ${lighthouseData.lcp} ms`);
	console.log(`   CLS: ${lighthouseData.cls}`);
	console.log(`   Est. FPS: ${lighthouseData.fps}`);
}

function checkTargets(bundleData, lighthouseData) {
	const firstLoadOK = bundleData.firstLoadJS <= TARGET_FIRST_LOAD_JS;
	const fpsOK = lighthouseData.fps >= TARGET_FPS;
	
	console.log('\n🎯 Target Performance Check:');
	console.log(`   First Load JS: ${bundleData.firstLoadJS} KB ${firstLoadOK ? '✅' : '❌'} (target: ≤${TARGET_FIRST_LOAD_JS} KB)`);
	console.log(`   FPS (mid-tier): ${lighthouseData.fps} ${fpsOK ? '✅' : '❌'} (target: ≥${TARGET_FPS})`);
	
	if (!firstLoadOK || !fpsOK) {
		console.log('\n⚠️  Performance targets not met. Consider:');
		console.log('   • Running Chrome DevTools Coverage analysis');
		console.log('   • Removing unused code and dependencies');
		console.log('   • Implementing code splitting');
		console.log('   • Lazy loading heavy components');
		
		if (!firstLoadOK) {
			const excess = bundleData.firstLoadJS - TARGET_FIRST_LOAD_JS;
			console.log(`   • Need to reduce First Load JS by ${excess} KB`);
		}
		
		return false;
	}
	
	console.log('\n🎉 All performance targets met!');
	return true;
}

function suggestOptimizations(bundleData) {
	console.log('\n💡 Optimization suggestions:');
	
	if (bundleData.firstLoadJS > 150) {
		console.log('   • Consider dynamic imports for heavy features');
		console.log('   • Review and remove unused dependencies');
		console.log('   • Enable webpack bundle analysis');
	}
	
	console.log('   • Run: bun run build:analyze for detailed bundle breakdown');
	console.log('   • Use Chrome DevTools > Coverage to identify unused code');
	console.log('   • Consider preloading critical resources');
}

async function main() {
	console.log('🎯 Starting performance measurement...\n');
	
	// Get bundle size data
	const bundleData = await getBundleSize();
	
	// Run Lighthouse audit
	const lighthouseData = runLighthouse();
	
	// Log to history
	const notes = process.argv[2] || '';
	logToHistory(bundleData, lighthouseData, notes);
	
	// Check if targets are met
	const targetsOK = checkTargets(bundleData, lighthouseData);
	
	if (!targetsOK) {
		suggestOptimizations(bundleData);
		process.exit(1);
	}
	
	console.log('\n✅ Performance measurement complete!');
}

main().catch(console.error);
