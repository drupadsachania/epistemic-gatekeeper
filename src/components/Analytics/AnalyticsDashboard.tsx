/**
 * Analytics Dashboard Component
 * Displays real-time user interaction and engagement metrics
 *
 * Development use only - shows current session analytics
 */

import React, { useState, useEffect } from 'react';
import { apiService } from '../../lib/api';

interface AnalyticsSummary {
  totalEvents: number;
  totalActivities: number;
  eventTypes: string[];
  sections: string[];
  lastUpdated: string;
}

export const AnalyticsDashboard: React.FC<{ dev?: boolean }> = ({ dev = false }) => {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(dev);

  // Fetch analytics summary periodically
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/analytics/summary').catch(
          () => null
        );
        if (response?.ok) {
          const data = await response.json();
          setAnalytics(data);
          setError(null);
        } else {
          setAnalytics(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
        setAnalytics(null);
      } finally {
        setLoading(false);
      }
    };

    if (isVisible) {
      fetchAnalytics();
      const interval = setInterval(fetchAnalytics, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  // Only show in development mode with explicit flag
  if (!dev) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '320px',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        border: '1px solid hsl(234, 85%, 65%)',
        borderRadius: '8px',
        padding: '16px',
        zIndex: 9999,
        fontFamily: 'monospace',
        fontSize: '12px',
        color: 'hsl(0, 0%, 85%)',
        boxShadow: '0 0 20px rgba(107, 114, 207, 0.3)',
        maxHeight: '80vh',
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
          paddingBottom: '8px',
          borderBottom: '1px solid hsl(234, 85%, 65%)',
        }}
      >
        <div style={{ color: 'hsl(234, 85%, 65%)', fontWeight: 'bold' }}>📊 Analytics</div>
        <button
          onClick={() => setIsVisible(!isVisible)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: 'hsl(0, 0%, 65%)',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          {isVisible ? '−' : '+'}
        </button>
      </div>

      {/* Content */}
      {loading && !analytics ? (
        <div style={{ color: 'hsl(0, 0%, 45%)' }}>Loading...</div>
      ) : error ? (
        <div style={{ color: 'hsl(0, 84%, 60%)', fontSize: '11px' }}>
          <div>⚠ API not responding</div>
          <div style={{ marginTop: '8px', fontSize: '10px', color: 'hsl(0, 0%, 45%)' }}>
            Run: npm run dev:api
          </div>
        </div>
      ) : analytics ? (
        <>
          {/* Session ID */}
          <div style={{ marginBottom: '12px', color: 'hsl(0, 0%, 65%)', fontSize: '11px' }}>
            <div>Session: {apiService.getSessionId().substring(0, 16)}...</div>
          </div>

          {/* Metrics */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                backgroundColor: 'hsl(234, 85%, 15%)',
                padding: '8px',
                borderRadius: '4px',
                borderLeft: '2px solid hsl(234, 85%, 65%)',
              }}
            >
              <div style={{ color: 'hsl(0, 0%, 45%)', fontSize: '10px' }}>Events</div>
              <div style={{ color: 'hsl(234, 85%, 65%)', fontWeight: 'bold' }}>
                {analytics.totalEvents}
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'hsl(142, 71%, 15%)',
                padding: '8px',
                borderRadius: '4px',
                borderLeft: '2px solid hsl(142, 71%, 65%)',
              }}
            >
              <div style={{ color: 'hsl(0, 0%, 45%)', fontSize: '10px' }}>Activities</div>
              <div style={{ color: 'hsl(142, 71%, 65%)', fontWeight: 'bold' }}>
                {analytics.totalActivities}
              </div>
            </div>
          </div>

          {/* Event Types */}
          {analytics.eventTypes.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ color: 'hsl(234, 85%, 65%)', marginBottom: '6px', fontSize: '11px' }}>
                Event Types:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {analytics.eventTypes.slice(0, 5).map((type) => (
                  <span
                    key={type}
                    style={{
                      backgroundColor: 'hsl(234, 85%, 25%)',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      fontSize: '10px',
                      color: 'hsl(234, 85%, 65%)',
                    }}
                  >
                    {type}
                  </span>
                ))}
                {analytics.eventTypes.length > 5 && (
                  <span
                    style={{
                      color: 'hsl(0, 0%, 45%)',
                      fontSize: '10px',
                    }}
                  >
                    +{analytics.eventTypes.length - 5}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Sections */}
          {analytics.sections.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ color: 'hsl(234, 85%, 65%)', marginBottom: '6px', fontSize: '11px' }}>
                Sections Visited:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {analytics.sections.map((section) => (
                  <span
                    key={section}
                    style={{
                      backgroundColor: 'hsl(142, 71%, 25%)',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      fontSize: '10px',
                      color: 'hsl(142, 71%, 65%)',
                    }}
                  >
                    {section}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Status */}
          <div
            style={{
              fontSize: '10px',
              color: 'hsl(0, 0%, 45%)',
              borderTop: '1px solid hsl(0, 0%, 12%)',
              paddingTop: '8px',
            }}
          >
            Last updated: {new Date(analytics.lastUpdated).toLocaleTimeString()}
          </div>
        </>
      ) : null}

      {/* Info */}
      <div
        style={{
          marginTop: '12px',
          padding: '8px',
          backgroundColor: 'hsl(0, 0%, 8%)',
          borderRadius: '4px',
          fontSize: '10px',
          color: 'hsl(0, 0%, 45%)',
          borderLeft: '2px solid hsl(0, 0%, 25%)',
        }}
      >
        Development mode analytics only. Requires API server running on port 3001.
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
