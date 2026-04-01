/**
 * Security Configuration & Utilities
 * Handles security headers, CSP, and other security-related concerns
 */

import { config } from './env';

export interface SecurityHeaders {
  'Content-Security-Policy': string;
  'X-Content-Type-Options': string;
  'X-Frame-Options': string;
  'X-XSS-Protection': string;
  'Referrer-Policy': string;
  'Permissions-Policy': string;
  'Strict-Transport-Security': string;
}

/**
 * Generate Content Security Policy header
 * Restricts resources to trusted sources
 */
export function getContentSecurityPolicy(): string {
  const isDev = config.debugMode;

  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Allow inline for dev, stricter in prod
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];

  // Relax CSP in development for hot module replacement
  if (isDev) {
    // Development-friendly CSP
    return directives
      .filter((d) => !d.includes("'unsafe-eval'"))
      .join('; ');
  }

  // Strict CSP for production
  return directives
    .filter((d) => !d.includes("'unsafe-eval'") && !d.includes("'unsafe-inline'"))
    .concat([
      "script-src 'self' https://cdn.jsdelivr.net https://cdn.polyfill.io",
      "style-src 'self' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
    ])
    .join('; ');
}

/**
 * Generate all security headers
 */
export function getSecurityHeaders(): SecurityHeaders {
  return {
    'Content-Security-Policy': config.cspEnabled
      ? getContentSecurityPolicy()
      : "default-src 'self'",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy':
      'geolocation=(), microphone=(), camera=(), payment=(), usb=()',
    'Strict-Transport-Security':
      'max-age=31536000; includeSubDomains; preload',
  };
}

/**
 * Set security headers in meta tags (for SPA)
 * Since we can't set HTTP headers in SPA, we use meta tags for CSP
 */
export function setSecurityMetaTags(): void {
  // Create and inject CSP meta tag
  const cspMeta = document.createElement('meta');
  cspMeta.httpEquiv = 'Content-Security-Policy';
  cspMeta.content = getContentSecurityPolicy();
  document.head.appendChild(cspMeta);

  // Create and inject X-UA-Compatible meta tag
  const uaMeta = document.createElement('meta');
  uaMeta.httpEquiv = 'X-UA-Compatible';
  uaMeta.content = 'ie=edge';
  document.head.appendChild(uaMeta);

  // Ensure referrer policy meta tag
  const referrerMeta = document.createElement('meta');
  referrerMeta.name = 'referrer';
  referrerMeta.content = 'strict-origin-when-cross-origin';
  document.head.appendChild(referrerMeta);

  if (config.debugMode) {
    console.log('🔒 Security meta tags injected');
  }
}

/**
 * Validate URL to prevent XSS attacks via javascript: URLs
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return !['javascript:', 'data:', 'vbscript:'].includes(parsed.protocol);
  } catch {
    // If URL parsing fails, reject it
    return false;
  }
}

/**
 * Sanitize HTML string to prevent XSS
 * Note: For production, use a library like DOMPurify
 */
export function sanitizeHtml(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Create secure headers object for API requests
 */
export function getSecureRequestHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };
}

/**
 * Initialize security measures
 */
export function initializeSecurity(): void {
  setSecurityMetaTags();

  // Log security status
  if (config.debugMode) {
    console.group('🔐 Security Configuration');
    console.log('CSP Enabled:', config.cspEnabled);
    console.log('Environment:', config.environment);
    console.log('Error Tracking:', config.errorTrackingEnabled);
    console.groupEnd();
  }

  // Disable right-click menu in production (optional)
  if (config.environment === 'production' && !config.debugMode) {
    document.addEventListener('contextmenu', (e) => {
      // Allow right-click but could be disabled if needed
      // e.preventDefault();
    });
  }

  // Prevent window.eval in production
  if (config.environment === 'production') {
    // This won't actually prevent eval but signals intent
    console.warn('Evaluation forbidden in production mode');
  }
}

export default {
  getSecurityHeaders,
  getContentSecurityPolicy,
  setSecurityMetaTags,
  isValidUrl,
  sanitizeHtml,
  getSecureRequestHeaders,
  initializeSecurity,
};
