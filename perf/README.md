# Performance Measurement Workflow

This directory contains tools and documentation for measuring and tracking application performance after each refactor.

## Quick Start

After any refactor, run the performance measurement:

```bash
bun run perf:measure "Added lazy loading to dashboard components"
```

## Performance Targets

- **First Load JS**: ≤ 200 KB
- **FPS (mid-tier device)**: ≥ 55 FPS
- **Lighthouse Performance Score**: ≥ 90

## Workflow

### 1. After Each Refactor

Run the comprehensive performance measurement:

```bash
bun run perf:measure "Your refactor description"
```

This will:
- Build the application
- Extract bundle size metrics
- Run Lighthouse audit
- Log results to `perf/history.csv`
- Check against performance targets
- Provide optimization suggestions if targets are missed

### 2. If Performance Targets Are Not Met

Run coverage analysis to identify unused code:

```bash
bun run perf:coverage
```

This will:
- Start the development server
- Use Chrome DevTools Coverage API
- Identify files with low usage (< 50% used, > 1KB)
- Generate detailed report in `perf/coverage-report.md`

### 3. Manual Chrome DevTools Coverage (Alternative)

If automated coverage fails:

1. Open Chrome DevTools (F12)
2. Go to Coverage tab (More tools > Coverage)
3. Click record and navigate through your app
4. Stop recording to see unused code
5. Focus on files with < 50% usage and > 1KB size

### 4. Bundle Analysis

For detailed bundle breakdown:

```bash
bun run build:analyze
```

## Files Structure

- `history.csv` - Performance metrics history
- `baseline.md` - Initial performance baseline
- `coverage-report.md` - Latest coverage analysis (generated)
- `lighthouse-temp.json` - Temporary Lighthouse results (auto-cleaned)
- `README.md` - This documentation

## Optimization Strategies

Based on coverage and performance analysis:

### Dynamic Imports
Convert heavy components to dynamic imports:

```javascript
// Before
import HeavyComponent from './HeavyComponent';

// After
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>
});
```

### Code Splitting
Split routes and features:

```javascript
// pages/heavy-feature.tsx
const HeavyFeature = dynamic(() => import('../components/HeavyFeature'));
```

### Tree Shaking
Remove unused exports and imports:

```javascript
// Instead of importing entire library
import _ from 'lodash';

// Import only what you need
import { debounce, throttle } from 'lodash';
```

### Lazy Loading
Use React.lazy for components:

```javascript
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// Wrap in Suspense
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
```

## Performance History Analysis

View performance trends in `history.csv`:

```bash
# View recent performance metrics
tail -10 perf/history.csv

# Check specific commits
grep "abc1234" perf/history.csv
```

## Troubleshooting

### Lighthouse Fails
- Ensure port 3000 is available
- Check if development server starts properly
- Verify Chrome/Chromium is installed for headless mode

### Coverage Analysis Fails
- Puppeteer installation issues: `bun add --dev puppeteer`
- Server startup issues: manually start with `bun run dev`
- Memory issues: close other applications

### Bundle Analysis Issues
- Run `next build` first
- Ensure `.next` directory exists
- Check for build errors in console

## CI/CD Integration

Add performance measurement to your CI pipeline:

```yaml
# Example GitHub Actions step
- name: Performance Measurement
  run: |
    bun run build
    bun run perf:measure "CI build ${{ github.sha }}"
    
    # Fail if targets not met
    if [ $? -ne 0 ]; then
      echo "Performance targets not met"
      exit 1
    fi
```

## Advanced Usage

### Custom Lighthouse Configuration

Modify the Lighthouse command in `scripts/measure-performance.mjs` for different audits:

```bash
lighthouse $URL --only-categories=performance,best-practices,seo
```

### Performance Budgets

Set stricter budgets by modifying targets in `measure-performance.mjs`:

```javascript
const TARGET_FIRST_LOAD_JS = 150; // Stricter 150KB
const TARGET_FPS = 60;           // Higher FPS target
```

### Historical Analysis

Use the CSV data for trend analysis:

```bash
# Performance over time
awk -F',' 'NR>1 {print $1, $3}' perf/history.csv

# Find regressions
awk -F',' 'NR>1 && $3>200 {print "Regression:", $1, $3"KB"}' perf/history.csv
```

## Next Steps

1. Set up automated performance monitoring in CI/CD
2. Create performance dashboards from CSV data  
3. Implement performance budgets in build process
4. Set up alerts for performance regressions
