import React, { useEffect, useState } from 'react';
import { Pretext } from '@chenglou/pretext';

interface Signal {
  confidence: number;
  grounding: number;
  contradiction: number;
  temporal: number;
  reversibility: string;
}

interface InferenceVisualizationProps {
  signals: Signal;
}

const getDecisionState = (signals: Signal): string => {
  if (signals.confidence > 0.8 && signals.grounding > 0.8 && signals.contradiction < 0.2) {
    return 'ACT';
  }
  if (signals.contradiction > 0.5) {
    return 'FAIL_SAFE';
  }
  if (signals.temporal < 0.5) {
    return 'DEFER';
  }
  if (signals.confidence < 0.6 || signals.grounding < 0.6) {
    return 'ESCALATE';
  }
  return 'ACT';
};

const getDecisionColor = (decision: string): string => {
  switch (decision) {
    case 'ACT':
      return 'hsl(142, 71%, 45%)'; // Green
    case 'ESCALATE':
      return 'hsl(48, 96%, 53%)'; // Yellow
    case 'DEFER':
      return 'hsl(217, 91%, 60%)'; // Blue
    case 'FAIL_SAFE':
      return 'hsl(0, 84%, 60%)'; // Red
    default:
      return 'hsl(234, 85%, 65%)';
  }
};

export const InferenceVisualization: React.FC<InferenceVisualizationProps> = ({ signals }) => {
  const [decision, setDecision] = useState<string>(getDecisionState(signals));
  const [showMetrics, setShowMetrics] = useState(false);

  useEffect(() => {
    setDecision(getDecisionState(signals));
    setShowMetrics(true);
    const timer = setTimeout(() => setShowMetrics(true), 300);
    return () => clearTimeout(timer);
  }, [signals]);

  return (
    <div className="space-y-6 font-mono text-sm">
      {/* Header */}
      <div className="space-y-2">
        <div style={{ color: 'hsl(0, 0%, 45%)', fontSize: '12px' }}>
          &gt; AGENT PROCESSING
        </div>
        <div style={{ color: 'hsl(0, 0%, 70%)' }}>
          evaluating signals...
        </div>
      </div>

      {/* Signal Analysis (animated reveal) */}
      <div className="space-y-3 p-4 rounded border" style={{ borderColor: 'hsl(0, 0%, 12%)', backgroundColor: 'hsl(0, 0%, 3%)' }}>
        <div style={{ color: 'hsl(234, 85%, 65%)', fontWeight: '600' }}>
          Signal Analysis:
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span style={{ color: 'hsl(0, 0%, 60%)' }}>confidence</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-1 rounded" style={{ backgroundColor: 'hsl(0, 0%, 12%)', overflow: 'hidden' }}>
                <div
                  className="h-full transition-all duration-500 will-change-transform"
                  style={{
                    width: `${signals.confidence * 100}%`,
                    backgroundColor: signals.confidence > 0.7 ? 'hsl(142, 71%, 45%)' : 'hsl(48, 96%, 53%)',
                  }}
                />
              </div>
              <span style={{ color: 'hsl(0, 0%, 70%)', minWidth: '40px' }}>
                {(signals.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span style={{ color: 'hsl(0, 0%, 60%)' }}>grounding</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-1 rounded" style={{ backgroundColor: 'hsl(0, 0%, 12%)', overflow: 'hidden' }}>
                <div
                  className="h-full transition-all duration-500 will-change-transform"
                  style={{
                    width: `${signals.grounding * 100}%`,
                    backgroundColor: signals.grounding > 0.7 ? 'hsl(142, 71%, 45%)' : 'hsl(48, 96%, 53%)',
                  }}
                />
              </div>
              <span style={{ color: 'hsl(0, 0%, 70%)', minWidth: '40px' }}>
                {(signals.grounding * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span style={{ color: 'hsl(0, 0%, 60%)' }}>contradiction</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-1 rounded" style={{ backgroundColor: 'hsl(0, 0%, 12%)', overflow: 'hidden' }}>
                <div
                  className="h-full transition-all duration-500 will-change-transform"
                  style={{
                    width: `${signals.contradiction * 100}%`,
                    backgroundColor: signals.contradiction < 0.3 ? 'hsl(142, 71%, 45%)' : 'hsl(0, 84%, 60%)',
                  }}
                />
              </div>
              <span style={{ color: 'hsl(0, 0%, 70%)', minWidth: '40px' }}>
                {(signals.contradiction * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span style={{ color: 'hsl(0, 0%, 60%)' }}>temporal</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-1 rounded" style={{ backgroundColor: 'hsl(0, 0%, 12%)', overflow: 'hidden' }}>
                <div
                  className="h-full transition-all duration-500 will-change-transform"
                  style={{
                    width: `${signals.temporal * 100}%`,
                    backgroundColor: signals.temporal > 0.7 ? 'hsl(142, 71%, 45%)' : 'hsl(217, 91%, 60%)',
                  }}
                />
              </div>
              <span style={{ color: 'hsl(0, 0%, 70%)', minWidth: '40px' }}>
                {(signals.temporal * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Output */}
      <div
        className="p-6 rounded border-2 text-center will-change-colors transition-colors duration-300"
        style={{
          borderColor: getDecisionColor(decision),
          backgroundColor: 'hsl(0, 0%, 3%)',
        }}
      >
        <div style={{ color: 'hsl(0, 0%, 45%)', fontSize: '12px', marginBottom: '8px' }}>
          DECISION STATE:
        </div>
        <div
          style={{
            fontSize: '24px',
            fontWeight: '700',
            letterSpacing: '2px',
            color: getDecisionColor(decision),
            textShadow: `0 0 20px ${getDecisionColor(decision)}99`,
          }}
        >
          {decision}
        </div>
      </div>

      {/* Status */}
      <div style={{ color: 'hsl(0, 0%, 45%)', fontSize: '12px', textAlign: 'center' }}>
        &gt; Ready for next evaluation
      </div>
    </div>
  );
};
