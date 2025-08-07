#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, appendFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const TARGET_FIRST_LOAD_JS = 200; // KB

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

function getBundleSize() {
	try {
		console.log('🔨 Building application...');
		const buildOutput = execSync('bun run build', { encoding: 'utf8' });
		
		// Extract First Load JS sizes from build output
		const lines = buildOutput.split('\n');
		let maxFirstLoadJS = 0;
		let routes = [];
		
		for (const line of lines) {
			// Look for lines with route information and sizes
			if (line.match(/[├└]\s*[○ƒ]/)) {
				// Extract route name
				const routeMatch = line.match(/[├└]\s*[○ƒ]\s*([^\s]+)/);
				// Extract First Load JS size (rightmost number followed by kB)
				const sizeMatches = line.match(/(\d+(?:\.\d+)?)\s*kB/g);
				
				if (routeMatch && sizeMatches && sizeMatches.length > 0) {
					// The last kB value is typically the First Load JS
					const lastSizeMatch = sizeMatches[sizeMatches.length - 1].match(/(\d+(?:\.\d+)?)/);
					if (lastSizeMatch) {
						const size = parseFloat(lastSizeMatch[1]);
						if (size > maxFirstLoadJS) {
							maxFirstLoadJS = size;
						}
						routes.push({ route: routeMatch[1], size });
					}
				}
			}
		}
		
		// Get total .next directory size
		let totalBundle = 0;
		try {
			const nextSize = getDirectorySize('./.next');
			totalBundle = formatBytes(nextSize);
		} catch {
			totalBundle = Math.round(maxFirstLoadJS * 1.5); // Rough estimate
		}
		
		return { 
			firstLoadJS: maxFirstLoadJS, 
			totalBundle, 
			routes: routes.sort((a, b) => b.size - a.size)
		};
	} catch (error) {
		console.error('❌ Error building or analyzing bundle:', error.message);
		return { firstLoadJS: 0, totalBundle: 0, routes: [] };
	}
}

function logToHistory(bundleData, notes = '') {
	const timestamp = new Date().toISOString();
	const commitHash = getCommitHash();
	
	const csvLine = [
		timestamp,
		commitHash,
		bundleData.firstLoadJS,
		bundleData.totalBundle,
		notes
	].join(',');
	
	appendFileSync('./perf/history.csv', csvLine + '\n');
	
	console.log('\n📊 Bundle metrics logged:');
	console.log(`   Max First Load JS: ${bundleData.firstLoadJS} KB`);
	console.log(`   Total Bundle: ${bundleData.totalBundle} KB`);
	console.log(`   Commit: ${commitHash}`);
	
	if (bundleData.routes.length > 0) {
		console.log('\n📈 Top routes by bundle size:');
		bundleData.routes.slice(0, 5).forEach((route, index) => {
			console.log(`   ${index + 1}. ${route.route}: ${route.size} KB`);
		});
	}
}

function checkTargets(bundleData) {
	const firstLoadOK = bundleData.firstLoadJS <= TARGET_FIRST_LOAD_JS;
	
	console.log('\n🎯 Bundle Size Check:');
	console.log(`   Max First Load JS: ${bundleData.firstLoadJS} KB ${firstLoadOK ? '✅' : '❌'} (target: ≤${TARGET_FIRST_LOAD_JS} KB)`);
	
	if (!firstLoadOK) {
		const excess = Math.round(bundleData.firstLoadJS - TARGET_FIRST_LOAD_JS);
		console.log(`\n⚠️  Bundle size target not met!`);
		console.log(`   • Need to reduce First Load JS by ${excess} KB`);
		console.log(`   • Consider running: bun run perf:coverage`);
		console.log(`   • Large routes to optimize:`);
		
		bundleData.routes
			.filter(route => route.size > TARGET_FIRST_LOAD_JS)
			.forEach(route => {
				console.log(`     - ${route.route}: ${route.size} KB`);
			});
		
		return false;
	}
	
	console.log('\n🎉 Bundle size target met!');
	return true;
}

function suggestOptimizations(bundleData) {
	console.log('\n💡 Optimization suggestions:');
	
	if (bundleData.firstLoadJS > 150) {
		console.log('   • Consider dynamic imports for heavy features');
		console.log('   • Review and remove unused dependencies');
		console.log('   • Implement route-based code splitting');
	}
	
	console.log('   • Run: bun run build:analyze for detailed breakdown');
	console.log('   • Run: bun run perf:coverage for unused code analysis');
	console.log('   • Consider preloading critical resources');
}

function main() {
	console.log('📦 Starting bundle size measurement...\n');
	
	// Initialize CSV if it doesn't exist
	if (!existsSync('./perf/history.csv')) {
		const headers = 'timestamp,commit_hash,first_load_js_kb,total_bundle_kb,notes\n';
		writeFileSync('./perf/history.csv', headers);
	}
	
	// Get bundle size data
	const bundleData = getBundleSize();
	
	// Log to history
	const notes = process.argv[2] || '';
	logToHistory(bundleData, notes);
	
	// Check if targets are met
	const targetOK = checkTargets(bundleData);
	
	if (!targetOK) {
		suggestOptimizations(bundleData);
		console.log('\n❌ Bundle size targets not met');
		process.exit(1);
	}
	
	console.log('\n✅ Bundle size measurement complete!');
}

main();
