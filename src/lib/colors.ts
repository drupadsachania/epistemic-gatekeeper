/**
 * Color definitions and utilities for Kairos interactive website
 */

export const colors = {
  // Decision states
  act: '#00ff41',           // Neon green
  escalate: '#ff6b35',      // Neon orange
  defer: '#0099ff',         // Cyan
  failSafe: '#ff1744',      // Neon red

  // Backgrounds
  primaryBg: '#0a0e27',     // Deep navy
  secondaryBg: '#151932',   // Lighter navy

  // Accents
  accentPurple: '#7c3aed',
  accentCyan: '#06b6d4',
  gridColor: '#1e40af',
  glitchRed: '#ff0055',
  glitchCyan: '#00ffff',

  // Text
  textPrimary: '#ffffff',
  textSecondary: '#a0aec0',
  textTertiary: '#718096',
};

/**
 * Get CSS variable value
 */
export const getCSSVar = (varName: string): string => {
  return `var(--${varName})`;
};

/**
 * Glow shadow definitions
 */
export const glows = {
  act: '0 0 10px rgba(0, 255, 65, 0.3)',
  failSafe: '0 0 15px rgba(255, 23, 68, 0.4)',
  cyan: '0 0 15px rgba(6, 182, 212, 0.3)',
  purple: '0 0 15px rgba(124, 58, 237, 0.3)',
};

/**
 * Gradient definitions
 */
export const gradients = {
  threat: 'linear-gradient(135deg, #ff1744, #ff6b35, #ffa000)',
  health: 'linear-gradient(135deg, #ef4444, #f59e0b, #10b981)',
  flow: 'linear-gradient(90deg, #06b6d4, #0099ff, #7c3aed)',
};
