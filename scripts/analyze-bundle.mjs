#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const NEXT_DIR = './.next';
const STATIC_DIR = `${NEXT_DIR}/static`;

function formatBytes(bytes) {
	if (bytes === 0) return '0 B';
	const k = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

function analyzeBundle() {
	console.log('📊 Analyzing bundle sizes...\n');
	
	try {
		// Get total .next size
		const nextSize = getDirectorySize(NEXT_DIR);
		console.log(`📦 Total .next directory: ${formatBytes(nextSize)}`);
		
		// Get static assets size
		const staticSize = getDirectorySize(STATIC_DIR);
		console.log(`🖼️  Static assets: ${formatBytes(staticSize)}`);
		
		// Check for chunks directory
		const chunksDir = `${STATIC_DIR}/chunks`;
		try {
			const chunksSize = getDirectorySize(chunksDir);
			console.log(`🧩 JavaScript chunks: ${formatBytes(chunksSize)}`);
			
			// List largest chunks
			const chunkFiles = readdirSync(chunksDir)
				.filter(file => file.endsWith('.js'))
				.map(file => {
					const filePath = join(chunksDir, file);
					const size = statSync(filePath).size;
					return { name: file, size };
				})
				.sort((a, b) => b.size - a.size)
				.slice(0, 10);
			
			console.log('\n🏆 Top 10 largest JavaScript chunks:');
			chunkFiles.forEach((chunk, index) => {
				console.log(`${index + 1}. ${chunk.name}: ${formatBytes(chunk.size)}`);
			});
			
		} catch (error) {
			console.log('❌ Could not analyze chunks directory');
		}
		
		// Bundle analysis recommendations
		console.log('\n💡 Optimization recommendations:');
		
		if (nextSize > 50 * 1024 * 1024) { // 50MB
			console.log('⚠️  Large bundle size detected - consider lazy loading more components');
		}
		
		if (staticSize > 10 * 1024 * 1024) { // 10MB
			console.log('⚠️  Large static assets - consider image optimization');
		}
		
		console.log('✅ Use lazy loading for heavy components');
		console.log('✅ Consider preloading critical resources');
		console.log('✅ Optimize images and fonts');
		console.log('✅ Enable compression in production');
		
	} catch (error) {
		console.error('❌ Error analyzing bundle:', error.message);
		console.log('\n💡 Make sure to run "next build" first');
	}
}

analyzeBundle();
