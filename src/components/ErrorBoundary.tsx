/**
 * Error Boundary Component
 * Catches React component errors and displays fallback UI
 * Logs errors to monitoring service
 */

import React, { Component, ReactNode } from 'react';
import { handleComponentError } from '@/lib/errorTracking';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    handleComponentError(error, this.constructor.name, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
              padding: '2rem',
              textAlign: 'center',
              backgroundColor: 'hsl(0, 0%, 5%)',
              border: '1px solid hsl(0, 85%, 65%)',
              borderRadius: '0.5rem',
              margin: '1rem',
            }}
          >
            <h2 style={{ color: 'hsl(0, 85%, 65%)', marginBottom: '1rem' }}>
              ⚠️ Something went wrong
            </h2>
            <p style={{ color: 'hsl(0, 0%, 60%)', marginBottom: '1rem', maxWidth: '500px' }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={this.handleReset}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'hsl(0, 85%, 65%)',
                color: 'hsl(0, 0%, 5%)',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Try Again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
