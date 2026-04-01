/**
 * API Service Layer
 * Handles all backend communication for the Kairos ECL platform
 */

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const API_TIMEOUT = 10000; // 10 seconds

// Data Types
export interface ValidationMetric {
  domain: string;
  accuracy: number;
  decisionCount: number;
  status: 'active' | 'testing' | 'completed';
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  status: 'published' | 'under-review' | 'preprint';
  url?: string;
}

export interface AdoptionStep {
  id: number;
  title: string;
  description: string;
  timeEstimate: string;
  tasks: string[];
}

export interface UserActivity {
  section: string;
  action: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface AnalyticsEvent {
  eventName: string;
  userId?: string;
  sessionId: string;
  timestamp: number;
  properties: Record<string, unknown>;
}

// API Service Class
class APIService {
  private baseUrl: string;
  private timeout: number;
  private sessionId: string;

  constructor(baseUrl: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
    this.sessionId = this.generateSessionId();
  }

  /**
   * Generate a unique session ID for this user session
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Fetch with timeout
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeoutMs: number = this.timeout
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await this.fetchWithTimeout(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await this.fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get validation metrics across domains
   */
  async getValidationMetrics(): Promise<ValidationMetric[]> {
    return this.get<ValidationMetric[]>('/metrics/validation');
  }

  /**
   * Get research papers
   */
  async getResearchPapers(): Promise<ResearchPaper[]> {
    return this.get<ResearchPaper[]>('/research/papers');
  }

  /**
   * Get adoption pathway
   */
  async getAdoptionSteps(): Promise<AdoptionStep[]> {
    return this.get<AdoptionStep[]>('/adoption/steps');
  }

  /**
   * Get framework decision states
   */
  async getDecisionStates(): Promise<Record<string, unknown>> {
    return this.get('/framework/states');
  }

  /**
   * Get epistemic signals definitions
   */
  async getSignalsDefinition(): Promise<Record<string, unknown>> {
    return this.get('/signals/definitions');
  }

  /**
   * Track user activity
   */
  async trackActivity(activity: Omit<UserActivity, 'timestamp'>): Promise<void> {
    return this.post('/analytics/activity', {
      ...activity,
      timestamp: Date.now(),
    });
  }

  /**
   * Send analytics event
   */
  async trackEvent(eventName: string, properties: Record<string, unknown> = {}): Promise<void> {
    const event: AnalyticsEvent = {
      eventName,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      properties,
    };

    return this.post('/analytics/events', event).catch((error) => {
      // Don't throw on analytics errors - they shouldn't break the app
      console.warn('Analytics event failed:', error);
    });
  }

  /**
   * Track section view
   */
  async trackSectionView(sectionId: string, timeSpent: number): Promise<void> {
    return this.trackActivity({
      section: sectionId,
      action: 'view',
      metadata: { timeSpent },
    });
  }

  /**
   * Track interaction
   */
  async trackInteraction(sectionId: string, elementId: string): Promise<void> {
    return this.trackActivity({
      section: sectionId,
      action: 'interact',
      metadata: { elementId },
    });
  }

  /**
   * Get session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get('/health');
      return response !== null;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const apiService = new APIService();

// Export class for testing
export default APIService;
