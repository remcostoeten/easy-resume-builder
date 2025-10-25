// Performance monitoring utilities for input optimization

export interface PerformanceMetrics {
  inputLatency: number
  renderTime: number
  memoryUsage: number
  localStorageSize: number
  timestamp: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = []
  private readonly MAX_METRICS = 100

  measureInputLatency(callback: () => void): number {
    const start = performance.now()
    callback()
    const end = performance.now()
    return end - start
  }

  measureRenderTime(componentName: string) {
    const start = performance.now()
    return () => {
      const end = performance.now()
      const renderTime = end - start

      if (renderTime > 16) { // Log slow renders (> 60fps threshold)
        console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`)
      }

      return renderTime
    }
  }

  getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize
    }
    return 0
  }

  getLocalStorageSize(): number {
    try {
      let total = 0
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length
        }
      }
      return total
    } catch {
      return 0
    }
  }

  recordMetric(metric: Partial<PerformanceMetrics>) {
    const fullMetric: PerformanceMetrics = {
      inputLatency: metric.inputLatency || 0,
      renderTime: metric.renderTime || 0,
      memoryUsage: this.getMemoryUsage(),
      localStorageSize: this.getLocalStorageSize(),
      timestamp: Date.now(),
      ...metric
    }

    this.metrics.push(fullMetric)

    // Keep only recent metrics
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS)
    }
  }

  getAverageMetrics(): Partial<PerformanceMetrics> {
    if (this.metrics.length === 0) return {}

    const sum = this.metrics.reduce((acc, metric) => ({
      inputLatency: acc.inputLatency + metric.inputLatency,
      renderTime: acc.renderTime + metric.renderTime,
      memoryUsage: acc.memoryUsage + metric.memoryUsage,
      localStorageSize: acc.localStorageSize + metric.localStorageSize
    }), { inputLatency: 0, renderTime: 0, memoryUsage: 0, localStorageSize: 0 })

    return {
      inputLatency: sum.inputLatency / this.metrics.length,
      renderTime: sum.renderTime / this.metrics.length,
      memoryUsage: sum.memoryUsage / this.metrics.length,
      localStorageSize: sum.localStorageSize / this.metrics.length
    }
  }

  getRecentMetrics(count = 10): PerformanceMetrics[] {
    return this.metrics.slice(-count)
  }

  clearMetrics() {
    this.metrics = []
  }

  // Check if performance is degrading
  isPerformanceDegrading(): boolean {
    const recent = this.getRecentMetrics(5)
    const older = this.metrics.slice(-10, -5)

    if (recent.length < 5 || older.length < 5) return false

    const recentAvg = recent.reduce((sum, m) => sum + m.inputLatency, 0) / recent.length
    const olderAvg = older.reduce((sum, m) => sum + m.inputLatency, 0) / older.length

    return recentAvg > olderAvg * 1.5 // 50% increase in latency
  }
}

export const performanceMonitor = new PerformanceMonitor()

// React hook for performance monitoring
export function usePerformanceMonitor(componentName: string) {
  const measureInputLatency = (callback: () => void) => {
    const latency = performanceMonitor.measureInputLatency(callback)
    performanceMonitor.recordMetric({ inputLatency: latency })
    return latency
  }

  const startRenderMeasure = () => {
    return performanceMonitor.measureRenderTime(componentName)
  }

  return {
    measureInputLatency,
    startRenderMeasure,
    recordMetric: performanceMonitor.recordMetric.bind(performanceMonitor),
    getMetrics: performanceMonitor.getAverageMetrics.bind(performanceMonitor),
    isPerformanceDegrading: performanceMonitor.isPerformanceDegrading.bind(performanceMonitor)
  }
}