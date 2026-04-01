/**
 * Application Monitoring & Health Checks
 * Provides health status, performance metrics, and application state monitoring
 */

import { config } from './env';

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  checks: {
    api: boolean;
    serviceWorker: boolean;
    cache: boolean;
    performance: boolean;
  };
  metrics: {
    memoryUsage?: number;
    navigationTiming?: {
      dns: number;
      tcp: number;
      ttfb: number;
      contentLoad: number;
      totalLoad: number;
    };
  };
}

class ApplicationMonitor {
  private startTime: number = Date.now();
  private errorCount: number = 0;
  private requestCount: number = 0;

  /**
   * Check API health
   */
  async checkApiHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${config.apiUrl}/api/health`, {
        method: 'GET',
        timeout: 5000,
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Check Service Worker status
   */
  async checkServiceWorker(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      return false;
    }

    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      return registrations.length > 0 && registrations[0].active !== undefined;
    } catch {
      return false;
    }
  }

  /**
   * Check cache status
   */
  async checkCache(): Promise<boolean> {
    if (!('caches' in window)) {
      return false;
    }

    try {
      const cacheNames = await caches.keys();
      return cacheNames.length > 0;
    } catch {
      return false;
    }
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): HealthCheckResult['metrics'] {
    const metrics: HealthCheckResult['metrics'] = {};

    // Memory usage (if available)
    if ('memory' in performance) {
      metrics.memoryUsage = (performance as any).memory.usedJSHeapSize;
    }

    // Navigation timing
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      metrics.navigationTiming = {
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        tcp: timing.connectEnd - timing.connectStart,
        ttfb: timing.responseStart - timing.requestStart,
        contentLoad: timing.domInteractive - timing.domLoading,
        totalLoad: timing.loadEventEnd - timing.navigationStart,
      };
    }

    return metrics;
  }

  /**
   * Run full health check
   */
  async performHealthCheck(): Promise<HealthCheckResult> {
    const checks = {
      api: config.debugMode ? await this.checkApiHealth() : true,
      serviceWorker: config.serviceWorkerEnabled ? await this.checkServiceWorker() : true,
      cache: await this.checkCache(),
      performance: true, // Always true if we can measure
    };

    const allHealthy = Object.values(checks).every((check) => check);
    const status = allHealthy ? 'healthy' : 'degraded';

    return {
      status,
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      checks,
      metrics: this.getPerformanceMetrics(),
    };
  }

  /**
   * Record error occurrence
   */
  recordError(): void {
    this.errorCount++;
  }

  /**
   * Record API request
   */
  recordRequest(): void {
    this.requestCount++;
  }

  /**
   * Get application statistics
   */
  getStats(): {
    uptime: number;
    errorCount: number;
    requestCount: number;
    errorRate: number;
  } {
    return {
      uptime: Date.now() - this.startTime,
      errorCount: this.errorCount,
      requestCount: this.requestCount,
      errorRate: this.requestCount > 0 ? (this.errorCount / this.requestCount) * 100 : 0,
    };
  }

  /**
   * Reset monitoring statistics
   */
  reset(): void {
    this.startTime = Date.now();
    this.errorCount = 0;
    this.requestCount = 0;
  }
}

// Singleton instance
export const appMonitor = new ApplicationMonitor();

/**
 * Expose health check for external monitoring
 * This creates a global function that can be called from browser console or external monitors
 */
export function exposeHealthCheck(): void {
  (window as any).__kairosHealth = async () => {
    return appMonitor.performHealthCheck();
  };

  if (config.debugMode) {
    console.log('💚 Health check exposed at window.__kairosHealth()');
  }
}

/**
 * Setup performance monitoring
 */
export function setupPerformanceMonitoring(): void {
  // Monitor Core Web Vitals
  if ('PerformanceObserver' in window) {
    try {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];

        if (config.debugMode) {
          console.log(`⏱️ LCP: ${lastEntry.renderTime || lastEntry.loadTime}ms`);
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (config.debugMode) {
            console.log(`⏱️ FID: ${(entry as any).processingDuration}ms`);
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        let clsValue = 0;
        entries.forEach((entry) => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        });

        if (config.debugMode) {
          console.log(`⏱️ CLS: ${clsValue}`);
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('Performance monitoring not available:', error);
    }
  }
}

/**
 * Setup periodic health checks
 */
export function setupPeriodicHealthChecks(intervalMs: number = 60000): void {
  setInterval(async () => {
    const health = await appMonitor.performHealthCheck();

    if (config.debugMode) {
      console.log('📊 Health Check:', health);
    }

    // Alert if health is degraded
    if (health.status === 'degraded') {
      console.warn('⚠️ Application health is degraded:', health.checks);
    }
  }, intervalMs);
}

/**
 * Initialize all monitoring systems
 */
export function initializeMonitoring(): void {
  exposeHealthCheck();
  setupPerformanceMonitoring();

  if (!config.debugMode) {
    // Run less frequently in production
    setupPeriodicHealthChecks(300000); // 5 minutes
  } else {
    // More frequent in development
    setupPeriodicHealthChecks(30000); // 30 seconds
  }

  if (config.debugMode) {
    console.log('📡 Application monitoring initialized');
  }
}

export default {
  appMonitor,
  exposeHealthCheck,
  setupPerformanceMonitoring,
  setupPeriodicHealthChecks,
  initializeMonitoring,
};
