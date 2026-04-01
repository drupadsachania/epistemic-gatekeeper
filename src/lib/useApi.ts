/**
 * Custom React Hooks for API Integration
 * Provides data fetching, caching, and error handling
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from './api';

// Generic hook for fetching data
export function useApi<T>(
  fetcher: () => Promise<T>,
  dependencies: unknown[] = []
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const cacheRef = useRef<T | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use cached data if available
      if (cacheRef.current) {
        setData(cacheRef.current);
        setLoading(false);
        return;
      }

      const result = await fetcher();
      cacheRef.current = result;
      setData(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    fetch();
  }, dependencies);

  const refetch = useCallback(async () => {
    cacheRef.current = null;
    await fetch();
  }, [fetch]);

  return { data, loading, error, refetch };
}

// Hook for validation metrics
export function useValidationMetrics() {
  return useApi(
    () => apiService.getValidationMetrics(),
    []
  );
}

// Hook for research papers
export function useResearchPapers() {
  return useApi(
    () => apiService.getResearchPapers(),
    []
  );
}

// Hook for adoption steps
export function useAdoptionSteps() {
  return useApi(
    () => apiService.getAdoptionSteps(),
    []
  );
}

// Hook for decision states
export function useDecisionStates() {
  return useApi(
    () => apiService.getDecisionStates(),
    []
  );
}

// Hook for signals definition
export function useSignalsDefinition() {
  return useApi(
    () => apiService.getSignalsDefinition(),
    []
  );
}

// Hook for tracking section views
export function useTrackSection(sectionId: string) {
  const viewStartTime = useRef(Date.now());

  useEffect(() => {
    return () => {
      const timeSpent = Date.now() - viewStartTime.current;
      apiService.trackSectionView(sectionId, timeSpent).catch(console.warn);
    };
  }, [sectionId]);
}

// Hook for tracking interactions
export function useTrackInteraction() {
  return useCallback((sectionId: string, elementId: string) => {
    apiService.trackInteraction(sectionId, elementId).catch(console.warn);
  }, []);
}

// Hook for tracking generic events
export function useTrackEvent() {
  return useCallback((eventName: string, properties?: Record<string, unknown>) => {
    apiService.trackEvent(eventName, properties).catch(console.warn);
  }, []);
}

// Hook for API health check
export function useApiHealth() {
  const [isHealthy, setIsHealthy] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const healthy = await apiService.healthCheck();
        setIsHealthy(healthy);
      } catch {
        setIsHealthy(false);
      } finally {
        setChecking(false);
      }
    };

    checkHealth();

    // Periodically check health (every 30 seconds)
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return { isHealthy, checking };
}

// Hook for batch tracking (multiple events)
export function useAnalytics() {
  const trackEvent = useTrackEvent();
  const trackInteraction = useTrackInteraction();

  return {
    trackEvent,
    trackInteraction,
    trackPageView: (pageName: string) => trackEvent('page_view', { pageName }),
    trackButtonClick: (sectionId: string, buttonName: string) =>
      trackEvent('button_click', { sectionId, buttonName }),
    trackScroll: (sectionId: string, scrollPosition: number) =>
      trackEvent('scroll', { sectionId, scrollPosition }),
  };
}
