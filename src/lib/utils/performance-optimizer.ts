"use client"

import { useEffect, useState, useCallback } from 'react'

// Performance monitoring utilities
export interface PerformanceMetrics {
  componentLoadTime: number
  renderTime: number
  memoryUsage?: number
  bundleSize?: number
  timestamp: number
}

export interface LoadingStrategy {
  priority: 'critical' | 'high' | 'medium' | 'low'
  preload: boolean
  lazy: boolean
  suspense: boolean
  delay?: number
}

class PerformanceOptimizer {
  private metrics: Map<string, PerformanceMetrics[]> = new Map()
  private observers: PerformanceObserver[] = []
  private isSupported = typeof window !== 'undefined' && 'performance' in window

  constructor() {
    if (this.isSupported) {
      this.initializeObservers()
    }
  }

  private initializeObservers() {
    try {
      // Observer for navigation timing
      if ('PerformanceObserver' in window) {
        const navObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming
              this.recordMetric('navigation', {
                componentLoadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
                renderTime: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
                timestamp: Date.now()
              })
            }
          }
        })
        navObserver.observe({ entryTypes: ['navigation'] })
        this.observers.push(navObserver)

        // Observer for resource timing
        const resourceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'resource') {
              const resourceEntry = entry as PerformanceResourceTiming
              this.recordMetric('resource', {
                componentLoadTime: resourceEntry.responseEnd - resourceEntry.requestStart,
                timestamp: Date.now()
              })
            }
          }
        })
        resourceObserver.observe({ entryTypes: ['resource'] })
        this.observers.push(resourceObserver)
      }
    } catch (error) {
      console.warn('Performance observers not fully supported:', error)
    }
  }

  recordMetric(componentName: string, metric: Omit<PerformanceMetrics, 'timestamp'>) {
    const fullMetric: PerformanceMetrics = {
      ...metric,
      timestamp: Date.now()
    }

    if (!this.metrics.has(componentName)) {
      this.metrics.set(componentName, [])
    }

    const componentMetrics = this.metrics.get(componentName)!
    componentMetrics.push(fullMetric)

    // Keep only last 10 metrics per component
    if (componentMetrics.length > 10) {
      componentMetrics.shift()
    }
  }

  getMetrics(componentName?: string): PerformanceMetrics[] {
    if (componentName) {
      return this.metrics.get(componentName) || []
    }
    return Array.from(this.metrics.values()).flat()
  }

  getAverageLoadTime(componentName: string): number {
    const metrics = this.metrics.get(componentName)
    if (!metrics || metrics.length === 0) return 0

    const total = metrics.reduce((sum, metric) => sum + metric.componentLoadTime, 0)
    return total / metrics.length
  }

  getComponentPerformanceReport(): Record<string, {
    averageLoadTime: number
    totalLoads: number
    lastLoadTime: number
  }> {
    const report: Record<string, any> = {}

    for (const [componentName, metrics] of this.metrics.entries()) {
      if (metrics.length > 0) {
        report[componentName] = {
          averageLoadTime: this.getAverageLoadTime(componentName),
          totalLoads: metrics.length,
          lastLoadTime: metrics[metrics.length - 1].componentLoadTime
        }
      }
    }

    return report
  }

  // Memory usage monitoring (if available)
  getMemoryUsage(): number | null {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return memory.usedJSHeapSize / memory.totalJSHeapSize
    }
    return null
  }

  // Cleanup observers
  destroy() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
    this.metrics.clear()
  }
}

// Global performance optimizer instance
export const performanceOptimizer = new PerformanceOptimizer()

// React hook for performance monitoring
export function usePerformanceMonitor(componentName: string) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [startTime, setStartTime] = useState<number>(0)

  const startMeasurement = useCallback(() => {
    setIsLoading(true)
    setStartTime(performance.now())
  }, [])

  const endMeasurement = useCallback(() => {
    const endTime = performance.now()
    const loadTime = endTime - startTime

    const newMetrics: PerformanceMetrics = {
      componentLoadTime: loadTime,
      renderTime: loadTime,
      timestamp: Date.now()
    }

    performanceOptimizer.recordMetric(componentName, newMetrics)
    setMetrics(newMetrics)
    setIsLoading(false)
  }, [componentName, startTime])

  return {
    metrics,
    isLoading,
    startMeasurement,
    endMeasurement
  }
}

// Preloading utilities
export class ComponentPreloader {
  private preloadedComponents = new Set<string>()

  async preloadComponent(componentPath: string): Promise<void> {
    if (this.preloadedComponents.has(componentPath)) {
      return
    }

    try {
      await import(componentPath)
      this.preloadedComponents.add(componentPath)
    } catch (error) {
      console.warn(`Failed to preload component: ${componentPath}`, error)
    }
  }

  async preloadCriticalComponents(): Promise<void> {
    const criticalComponents = [
      '../components/editor/editor-layout',
      '../components/editor/layers-panel',
      '../components/editor/section-editor',
      '../components/editor/resume-preview',
      '../components/editor/dynamic-field'
    ]

    await Promise.all(
      criticalComponents.map(component => this.preloadComponent(component))
    )
  }

  async preloadSecondaryComponents(): Promise<void> {
    const secondaryComponents = [
      '../components/editor/style-panel',
      '../components/editor/field-manager',
      '../components/theme-picker',
      '../components/resume-builder'
    ]

    // Stagger preloading to avoid blocking main thread
    for (const component of secondaryComponents) {
      await new Promise(resolve => setTimeout(resolve, 100))
      await this.preloadComponent(component)
    }
  }

  isPreloaded(componentPath: string): boolean {
    return this.preloadedComponents.has(componentPath)
  }
}

export const componentPreloader = new ComponentPreloader()

// Loading strategy manager
export class LoadingStrategyManager {
  private strategies: Map<string, LoadingStrategy> = new Map()

  constructor() {
    this.initializeDefaultStrategies()
  }

  private initializeDefaultStrategies() {
    // Critical components - immediate loading
    this.strategies.set('EditorLayout', {
      priority: 'critical',
      preload: true,
      lazy: false,
      suspense: false
    })

    this.strategies.set('LayersPanel', {
      priority: 'critical',
      preload: true,
      lazy: false,
      suspense: true,
      delay: 0
    })

    this.strategies.set('SectionEditor', {
      priority: 'critical',
      preload: true,
      lazy: false,
      suspense: true,
      delay: 0
    })

    this.strategies.set('ResumePreview', {
      priority: 'critical',
      preload: true,
      lazy: false,
      suspense: true,
      delay: 100
    })

    // High priority components
    this.strategies.set('TopBar', {
      priority: 'high',
      preload: true,
      lazy: false,
      suspense: true,
      delay: 0
    })

    this.strategies.set('DynamicField', {
      priority: 'high',
      preload: true,
      lazy: false,
      suspense: true,
      delay: 50
    })

    // Medium priority components
    this.strategies.set('StylePanel', {
      priority: 'medium',
      preload: true,
      lazy: true,
      suspense: true,
      delay: 150
    })

    this.strategies.set('FieldManager', {
      priority: 'medium',
      preload: false,
      lazy: true,
      suspense: true,
      delay: 200
    })

    // Low priority components
    this.strategies.set('SectionAIAssistant', {
      priority: 'low',
      preload: false,
      lazy: true,
      suspense: true,
      delay: 500
    })

    this.strategies.set('AIResultsModal', {
      priority: 'low',
      preload: false,
      lazy: true,
      suspense: true,
      delay: 300
    })

    this.strategies.set('ThemePicker', {
      priority: 'low',
      preload: false,
      lazy: true,
      suspense: true,
      delay: 400
    })
  }

  getStrategy(componentName: string): LoadingStrategy {
    return this.strategies.get(componentName) || {
      priority: 'medium',
      preload: false,
      lazy: true,
      suspense: true,
      delay: 200
    }
  }

  setStrategy(componentName: string, strategy: LoadingStrategy): void {
    this.strategies.set(componentName, strategy)
  }

  getComponentsByPriority(priority: LoadingStrategy['priority']): string[] {
    return Array.from(this.strategies.entries())
      .filter(([, strategy]) => strategy.priority === priority)
      .map(([name]) => name)
  }
}

export const loadingStrategyManager = new LoadingStrategyManager()

// React hook for optimized component loading
export function useOptimizedLoading(componentName: string) {
  const [strategy, setStrategy] = useState<LoadingStrategy>(() =>
    loadingStrategyManager.getStrategy(componentName)
  )
  const [shouldLoad, setShouldLoad] = useState(() => strategy.priority === 'critical')

  useEffect(() => {
    const currentStrategy = loadingStrategyManager.getStrategy(componentName)
    setStrategy(currentStrategy)

    // Auto-load critical and high priority components
    if (currentStrategy.priority === 'critical' || currentStrategy.priority === 'high') {
      setShouldLoad(true)
    }

    // Preload components marked for preloading
    if (currentStrategy.preload) {
      const timer = setTimeout(() => {
        componentPreloader.preloadComponent(`../components/${componentName.toLowerCase()}`)
      }, currentStrategy.delay || 0)

      return () => clearTimeout(timer)
    }
  }, [componentName])

  const loadComponent = useCallback(() => {
    setShouldLoad(true)
  }, [])

  return {
    strategy,
    shouldLoad,
    loadComponent,
    isLazy: strategy.lazy,
    hasSuspense: strategy.suspense,
    delay: strategy.delay
  }
}

// Bundle size monitoring
export function getBundleSizeEstimate(): Promise<number> {
  return new Promise((resolve) => {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      const jsEntries = entries.filter(entry => entry.name.endsWith('.js'))

      const totalSize = jsEntries.reduce((total, entry) => {
        return total + (entry.transferSize || 0)
      }, 0)

      resolve(totalSize)
    } else {
      resolve(0)
    }
  })
}

// Performance scoring utility
export function getPerformanceScore(): Promise<{
  loadTime: number
  score: number
  recommendations: string[]
}> {
  return new Promise(async (resolve) => {
    const metrics = performanceOptimizer.getMetrics()
    const navigationMetrics = performanceOptimizer.getMetrics('navigation')

    let totalLoadTime = 0
    let recommendations: string[] = []

    if (navigationMetrics.length > 0) {
      totalLoadTime = navigationMetrics[0].componentLoadTime
    }

    // Analyze component performance
    const report = performanceOptimizer.getComponentPerformanceReport()

    for (const [component, data] of Object.entries(report)) {
      if (data.averageLoadTime > 1000) {
        recommendations.push(`Consider lazy loading ${component} (avg load: ${data.averageLoadTime.toFixed(0)}ms)`)
      }
    }

    // Calculate performance score (0-100)
    let score = 100
    if (totalLoadTime > 3000) score -= 30
    else if (totalLoadTime > 2000) score -= 20
    else if (totalLoadTime > 1000) score -= 10

    if (recommendations.length > 3) score -= 20
    else if (recommendations.length > 1) score -= 10

    score = Math.max(0, Math.min(100, score))

    resolve({
      loadTime: totalLoadTime,
      score,
      recommendations
    })
  })
}