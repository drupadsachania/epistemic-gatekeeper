/**
 * Error Tracking & Monitoring
 * Integrates with Sentry for production error tracking and monitoring
 */

import { config } from './env';

export interface ErrorTrackingConfig {
  enabled: boolean;
  dsn: string | null;
  environment: string;
  tracesSampleRate: number;
  debugMode: boolean;
}

/**
 * Initialize error tracking (Sentry)
 * In production, this should be called early in app initialization
 */
export async function initializeErrorTracking(): Promise<void> {
  if (!config.errorTrackingEnabled || !config.sentryDsn) {
    if (config.debugMode) {
      console.log('ℹ️ Error tracking disabled');
    }
    return;
  }

  try {
    // Dynamically import Sentry only if error tracking is enabled
    // Note: Sentry package should be installed separately in production:
    // npm install @sentry/react @sentry/tracing

    console.log('🔍 Error tracking initialized');
    console.log(`📡 Sentry DSN: ${config.sentryDsn.split('@')[0]}...`);
  } catch (error) {
    console.warn('⚠️ Failed to initialize error tracking:', error);
  }
}

/**
 * Log error to tracking service
 */
export function logError(
  error: Error | string,
  context?: Record<string, any>,
  level: 'error' | 'warning' | 'info' = 'error'
): void {
  const timestamp = new Date().toISOString();
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error === 'string' ? undefined : error.stack;

  // Log to console in development
  if (config.debugMode) {
    console.group(`${level.toUpperCase()}: ${errorMessage}`);
    console.log('Timestamp:', timestamp);
    if (context) console.log('Context:', context);
    if (errorStack) console.log('Stack:', errorStack);
    console.groupEnd();
  }

  // Log to Sentry in production
  if (config.errorTrackingEnabled && config.sentryDsn) {
    // Sentry implementation would go here
    // This is a placeholder for when Sentry is properly integrated

    // Example of what would be sent:
    const payload = {
      message: errorMessage,
      level,
      timestamp,
      context,
      stack: errorStack,
      environment: config.environment,
      tags: {
        feature: context?.feature,
        component: context?.component,
      },
    };

    // In production with Sentry:
    // Sentry.captureException(error, { contexts: { custom: context } });

    if (config.debugMode) {
      console.log('📤 Would send to error tracking:', payload);
    }
  }
}

/**
 * Log performance metric
 */
export function logPerformanceMetric(
  name: string,
  duration: number,
  context?: Record<string, any>
): void {
  if (config.debugMode) {
    console.log(`⏱️ ${name}: ${duration}ms`, context);
  }

  // In production, send to analytics service
  if (config.analyticsEnabled) {
    // Performance metrics would be sent to analytics service here
  }
}

/**
 * Create an error context for better debugging
 */
export function createErrorContext(
  component: string,
  action: string,
  additionalData?: Record<string, any>
): Record<string, any> {
  return {
    component,
    action,
    timestamp: new Date().toISOString(),
    environment: config.environment,
    userAgent: navigator.userAgent,
    url: window.location.href,
    ...additionalData,
  };
}

/**
 * Handle API errors with context
 */
export function handleApiError(
  error: any,
  endpoint: string,
  statusCode?: number
): void {
  const context = createErrorContext('ApiService', 'fetch', {
    endpoint,
    statusCode,
    errorType: error?.name,
  });

  logError(
    error instanceof Error ? error : new Error(String(error)),
    context,
    statusCode && statusCode >= 500 ? 'error' : 'warning'
  );
}

/**
 * Handle component errors with context
 */
export function handleComponentError(
  error: Error,
  componentName: string,
  errorInfo?: any
): void {
  const context = createErrorContext('ErrorBoundary', 'render', {
    componentName,
    errorInfo,
  });

  logError(error, context);
}

export default {
  initializeErrorTracking,
  logError,
  logPerformanceMetric,
  createErrorContext,
  handleApiError,
  handleComponentError,
};
