/**
 * Environment Configuration
 * Centralized configuration management with type safety
 * Loads and validates environment variables at runtime
 */

export interface EnvironmentConfig {
  // API Configuration
  apiUrl: string;
  apiTimeout: number;
  apiRetryAttempts: number;
  apiRetryDelay: number;

  // Feature Flags
  analyticsEnabled: boolean;
  errorTrackingEnabled: boolean;
  serviceWorkerEnabled: boolean;
  debugMode: boolean;
  offlineModeEnabled: boolean;

  // Analytics & Monitoring
  sentryDsn: string | null;
  analyticsId: string | null;
  sessionTimeout: number;

  // Feature Toggles
  features: {
    researchSection: boolean;
    adoptionSection: boolean;
    interactivePage: boolean;
    offlineMode: boolean;
  };

  // Security
  corsOrigin: string;
  cspEnabled: boolean;
  environment: 'development' | 'staging' | 'production';
}

/**
 * Get environment variable with type safety and defaults
 */
function getEnvVar(key: string, defaultValue?: string): string | undefined {
  const value = import.meta.env[`VITE_${key}`];
  return value !== undefined ? value : defaultValue;
}

/**
 * Parse boolean environment variable
 */
function parseBoolean(value: string | undefined, defaultValue = false): boolean {
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1' || value === 'yes';
}

/**
 * Parse number environment variable
 */
function parseNumber(value: string | undefined, defaultValue: number): number {
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Build configuration from environment variables
 */
function buildConfig(): EnvironmentConfig {
  const isDevelopment = import.meta.env.DEV;
  const environment = (getEnvVar('ENVIRONMENT') ||
    (isDevelopment ? 'development' : 'production')) as 'development' | 'staging' | 'production';

  return {
    // API Configuration
    apiUrl: getEnvVar('API_URL') || 'http://localhost:3001',
    apiTimeout: parseNumber(getEnvVar('API_TIMEOUT'), 30000),
    apiRetryAttempts: parseNumber(getEnvVar('API_RETRY_ATTEMPTS'), 3),
    apiRetryDelay: parseNumber(getEnvVar('API_RETRY_DELAY'), 1000),

    // Feature Flags
    analyticsEnabled: parseBoolean(getEnvVar('ANALYTICS_ENABLED'), !isDevelopment),
    errorTrackingEnabled: parseBoolean(getEnvVar('ERROR_TRACKING_ENABLED'), !isDevelopment),
    serviceWorkerEnabled: parseBoolean(getEnvVar('SERVICE_WORKER_ENABLED'), !isDevelopment),
    debugMode: parseBoolean(getEnvVar('DEBUG_MODE'), isDevelopment),
    offlineModeEnabled: parseBoolean(getEnvVar('OFFLINE_MODE_ENABLED'), true),

    // Analytics & Monitoring
    sentryDsn: getEnvVar('SENTRY_DSN') || null,
    analyticsId: getEnvVar('ANALYTICS_ID') || null,
    sessionTimeout: parseNumber(getEnvVar('SESSION_TIMEOUT'), 3600000),

    // Feature Toggles
    features: {
      researchSection: parseBoolean(getEnvVar('FEATURE_RESEARCH_SECTION'), true),
      adoptionSection: parseBoolean(getEnvVar('FEATURE_ADOPTION_SECTION'), true),
      interactivePage: parseBoolean(getEnvVar('FEATURE_INTERACTIVE_PAGE'), true),
      offlineMode: parseBoolean(getEnvVar('FEATURE_OFFLINE_MODE'), true),
    },

    // Security
    corsOrigin: getEnvVar('CORS_ORIGIN') || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'),
    cspEnabled: parseBoolean(getEnvVar('CSP_HEADER'), true),
    environment,
  };
}

/**
 * Global configuration instance
 */
export const config = buildConfig();

/**
 * Utility function to check if in production
 */
export function isProduction(): boolean {
  return config.environment === 'production';
}

/**
 * Utility function to check if in development
 */
export function isDevelopment(): boolean {
  return config.environment === 'development';
}

/**
 * Utility function to check if feature is enabled
 */
export function isFeatureEnabled(feature: keyof EnvironmentConfig['features']): boolean {
  return config.features[feature];
}

/**
 * Log configuration (development only)
 */
if (config.debugMode) {
  console.group('🔧 Environment Configuration');
  console.log('Environment:', config.environment);
  console.log('API URL:', config.apiUrl);
  console.log('Features:', config.features);
  console.log('Analytics:', {
    enabled: config.analyticsEnabled,
    id: config.analyticsId,
  });
  console.groupEnd();
}

export default config;
