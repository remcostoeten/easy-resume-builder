#!/usr/bin/env node

import { readFileSync, readdirSync, statSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
}

function getDirectorySize(dirPath) {
    let totalSize = 0;
    
    function calculateSize(currentPath) {
        const stats = statSync(currentPath);
        if (stats.isFile()) {
            totalSize += stats.size;
        } else if (stats.isDirectory()) {
            const items = readdirSync(currentPath);
            for (const item of items) {
                calculateSize(join(currentPath, item));
            }
        }
    }
    
    try {
        calculateSize(dirPath);
    } catch (error) {
        console.warn(`Warning: Could not access ${dirPath}`);
    }
    
    return totalSize;
}

function analyzeJavaScriptChunks(buildDir) {
    const staticDir = join(buildDir, 'static');
    const chunks = [];
    
    function findJsFiles(dir) {
        try {
            const items = readdirSync(dir);
            for (const item of items) {
                const fullPath = join(dir, item);
                const stats = statSync(fullPath);
                
                if (stats.isFile() && item.endsWith('.js')) {
                    chunks.push({
                        name: item,
                        size: stats.size,
                        path: fullPath
                    });
                } else if (stats.isDirectory()) {
                    findJsFiles(fullPath);
                }
            }
        } catch (error) {
            console.warn(`Warning: Could not access ${dir}`);
        }
    }
    
    if (statSync(staticDir).isDirectory()) {
        findJsFiles(staticDir);
    }
    
    function sortChunksBySize(a, b) {
        return b.size - a.size;
    }
    
    return chunks.sort(sortChunksBySize);
}

function getStaticAssetsSize(buildDir) {
    const staticDir = join(buildDir, 'static');
    let totalSize = 0;
    
    function calculateStaticSize(dir) {
        try {
            const items = readdirSync(dir);
            for (const item of items) {
                const fullPath = join(dir, item);
                const stats = statSync(fullPath);
                
                if (stats.isFile() && !item.endsWith('.js')) {
                    totalSize += stats.size;
                } else if (stats.isDirectory()) {
                    calculateStaticSize(fullPath);
                }
            }
        } catch (error) {
            console.warn(`Warning: Could not access ${dir}`);
        }
    }
    
    try {
        calculateStaticSize(staticDir);
    } catch (error) {
        console.warn('Warning: Could not access static directory');
    }
    
    return totalSize;
}

function sumChunkSizes(sum, chunk) {
    return sum + chunk.size;
}

function printChunkInfo(chunk, index) {
    console.log(`${index + 1}. ${chunk.name}: ${formatBytes(chunk.size)}`);
}

function formatDateForFilename() {
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleDateString('en-US', { month: 'short' }).toLowerCase();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${day}-${month}-${hours}:${minutes}`;
}

function ensureSnapshotDirectory() {
    const snapshotsDir = join(process.cwd(), 'scripts', 'snapshots');
    if (!existsSync(snapshotsDir)) {
        mkdirSync(snapshotsDir, { recursive: true });
    }
    return snapshotsDir;
}

function captureOutput(func) {
    const originalLog = console.log;
    let output = '';
    
    function logCapture(...args) {
        const message = args.join(' ');
        output += message + '\n';
        originalLog(...args);
    }
    
    console.log = logCapture;
    func();
    console.log = originalLog;
    return output;
}

function saveSnapshot(content) {
    const snapshotsDir = ensureSnapshotDirectory();
    const timestamp = formatDateForFilename();
    const filename = `build-analyze-${timestamp}.txt`;
    const filepath = join(snapshotsDir, filename);
    
    try {
        writeFileSync(filepath, content, 'utf8');
        console.log(`\n📸 Snapshot saved: scripts/snapshots/${filename}`);
    } catch (error) {
        console.warn(`Warning: Could not save snapshot: ${error.message}`);
    }
}

function analyzeBundle() {
    console.log('📊 Analyzing bundle sizes...\n');
    
    const buildDir = join(process.cwd(), '.next');
    
    try {
        const totalSize = getDirectorySize(buildDir);
        console.log(`📦 Total .next directory: ${formatBytes(totalSize)}`);
        
        const staticAssetsSize = getStaticAssetsSize(buildDir);
        console.log(`🖼️  Static assets: ${formatBytes(staticAssetsSize)}`);
        
        const jsChunks = analyzeJavaScriptChunks(buildDir);
        const totalJsSize = jsChunks.reduce(sumChunkSizes, 0);
        console.log(`🧩 JavaScript chunks: ${formatBytes(totalJsSize)}\n`);
        
        console.log('🏆 Top 10 largest JavaScript chunks:');
        jsChunks.slice(0, 10).forEach(printChunkInfo);
        
        console.log('\n💡 Optimization recommendations:');
        
        if (totalJsSize > 2 * 1024 * 1024) {
            console.log('⚠️  Large bundle size detected - consider lazy loading more components');
        }
        
        console.log('✅ Use lazy loading for heavy components');
        console.log('✅ Consider preloading critical resources');
        console.log('✅ Optimize images and fonts');
        console.log('✅ Enable compression in production');
        
    } catch (error) {
        console.error('Error analyzing bundle:', error.message);
        process.exit(1);
    }
}

// Run the analysis and capture output for snapshot
function runAnalysisWithSnapshot() {
    const output = captureOutput(analyzeBundle);
    saveSnapshot(output);
}

runAnalysisWithSnapshot();
