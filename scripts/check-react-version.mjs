import { execSync } from 'child_process';

function checkReactVersion() {
  try {
    const output = execSync('npm ls react --depth=0 --json', { 
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    });
    
    const packageInfo = JSON.parse(output);
    const reactVersion = packageInfo.dependencies?.react?.version;
    
    if (!reactVersion) {
      console.error('❌ React not found in dependencies');
      process.exit(1);
    }
    
    if (reactVersion !== '18.2.0') {
      console.error(`❌ React version mismatch: expected 18.2.0, found ${reactVersion}`);
      console.error('This prevents multiple React copies in the bundle.');
      process.exit(1);
    }
    
    console.log(`✅ React version check passed: ${reactVersion}`);
  } catch (error) {
    console.error('❌ Failed to check React version:', error.message);
    process.exit(1);
  }
}

checkReactVersion();
