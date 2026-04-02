import React, { useEffect, useState } from 'react';

/**
 * PretextThreatAnalysis: Animated threat visualization showing how Kairos detects unsafe decisions
 * Uses character reveals, signal morphing, and glitch effects to show real-time analysis
 */
export const PretextThreatAnalysis: React.FC = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const phases = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
      setTimeout(() => setPhase(4), 3500),
    ];
    return () => phases.forEach(t => clearTimeout(t));
  }, []);

  const AnimatedText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
    return (
      <span style={{ display: 'inline-block' }}>
        {text.split('').map((char, i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              animation: `charReveal 0.05s ease-out ${delay + i * 0.05}s both`,
              opacity: 0,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    );
  };

  const Signal = ({
    label,
    value,
    targetValue,
    color,
    isActive
  }: {
    label: string;
    value: number;
    targetValue: number;
    color: string;
    isActive: boolean
  }) => {
    const displayValue = isActive ? targetValue : value;
    const isRising = targetValue > value;

    return (
      <div className="flex justify-between items-center text-xs mb-2">
        <span style={{ color: 'hsl(0, 0%, 60%)' }}>{label}</span>
        <div className="flex items-center gap-2">
          <div className="w-32 h-1 rounded" style={{ backgroundColor: 'hsl(0, 0%, 12%)' }}>
            <div
              className="h-full will-change-transform"
              style={{
                width: `${displayValue * 100}%`,
                backgroundColor: color,
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          </div>
          <span style={{ color: 'hsl(0, 0%, 70%)', minWidth: '50px', textAlign: 'right' }}>
            <span style={{ animation: isRising ? 'pulse-rise 0.6s ease-out' : 'pulse-drop 0.6s ease-out' }}>
              {(displayValue * 100).toFixed(0)}%
              <span style={{ color: isRising ? 'hsl(0, 84%, 60%)' : 'hsl(0, 84%, 60%)', marginLeft: '4px' }}>
                {isRising ? '↑' : '↓'}
              </span>
            </span>
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 font-mono text-sm">
      <style>{`
        @keyframes charReveal {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes pulse-rise {
          0% { transform: scale(0.8); color: hsl(48, 96%, 53%); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); color: hsl(0, 84%, 60%); }
        }

        @keyframes pulse-drop {
          0% { transform: scale(1); }
          50% { transform: scale(0.9); color: hsl(0, 84%, 60%); }
          100% { transform: scale(1); color: hsl(217, 91%, 60%); }
        }

        @keyframes threat-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        .threat-indicator {
          animation: threat-pulse 0.5s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <div style={{ color: 'hsl(0, 0%, 45%)', fontSize: '11px', letterSpacing: '1px' }}>
        &gt; THREAT DETECTION PIPELINE
      </div>

      {/* Phase 1: Input */}
      {phase >= 1 && (
        <div className="p-4 rounded border" style={{ borderColor: 'hsl(0, 0%, 12%)', backgroundColor: 'hsl(0, 0%, 3%)' }}>
          <div style={{ color: 'hsl(0, 84%, 60%)', marginBottom: '8px', fontSize: '12px' }}>
            ⚠ THREAT DETECTED
          </div>
          <div style={{ color: 'hsl(0, 0%, 50%)' }}>Agent input:</div>
          <div style={{ color: 'hsl(0, 0%, 70%)' }}>
            <span style={{ color: 'hsl(0, 0%, 50%)' }}>&quot;</span>
            <AnimatedText text="Delete all logs without audit trail" delay={0} />
            <span style={{ color: 'hsl(0, 0%, 50%)' }}>&quot;</span>
          </div>
        </div>
      )}

      {/* Phase 2: Signal Analysis */}
      {phase >= 2 && (
        <div className="p-4 rounded border" style={{ borderColor: 'hsl(0, 0%, 12%)', backgroundColor: 'hsl(0, 0%, 3%)' }}>
          <div style={{ color: 'hsl(234, 85%, 65%)', marginBottom: '10px', fontSize: '12px' }}>
            SIGNAL ANALYSIS:
          </div>

          <Signal
            label="confidence"
            value={0.85}
            targetValue={0.45}
            color="hsl(48, 96%, 53%)"
            isActive={phase >= 2}
          />

          <Signal
            label="grounding"
            value={0.80}
            targetValue={0.2}
            color="hsl(0, 84%, 60%)"
            isActive={phase >= 2}
          />

          <Signal
            label="contradiction"
            value={0.15}
            targetValue={0.8}
            color="hsl(0, 84%, 60%)"
            isActive={phase >= 2}
          />

          <div style={{ color: 'hsl(0, 0%, 50%)', fontSize: '10px', marginTop: '8px', opacity: 0.7 }}>
            ↓ Signal confidence drops significantly
          </div>
        </div>
      )}

      {/* Phase 3: Reasoning */}
      {phase >= 3 && (
        <div className="p-4 rounded border" style={{ borderColor: 'hsl(0, 84%, 60%)', backgroundColor: 'hsl(0, 0%, 3%)' }}>
          <div style={{ color: 'hsl(0, 84%, 60%)', marginBottom: '8px', fontSize: '12px' }}>
            EPISTEMIC ASSESSMENT:
          </div>
          <div style={{ color: 'hsl(0, 0%, 70%)', fontSize: '12px', lineHeight: '1.6' }}>
            <div>✗ Confidence collapsed (0.85 → 0.45)</div>
            <div>✗ Grounding missing (0.80 → 0.2)</div>
            <div>✗ High contradiction (0.8)</div>
            <div style={{ marginTop: '8px', color: 'hsl(0, 0%, 50%)' }}>
              Decision cannot be justified with observable evidence.
            </div>
          </div>
        </div>
      )}

      {/* Phase 4: Decision */}
      {phase >= 4 && (
        <div
          className="p-6 rounded border-2 text-center"
          style={{
            borderColor: 'hsl(0, 84%, 60%)',
            backgroundColor: 'hsl(0, 0%, 3%)',
          }}
        >
          <div style={{ color: 'hsl(0, 0%, 45%)', fontSize: '10px', marginBottom: '12px', letterSpacing: '2px' }}>
            DECISION GATE
          </div>
          <div
            className="threat-indicator"
            style={{
              fontSize: '28px',
              fontWeight: '700',
              letterSpacing: '2px',
              color: 'hsl(0, 84%, 60%)',
              textShadow: '0 0 20px hsl(0, 84%, 60%)88',
            }}
          >
            FAIL_SAFE
          </div>
          <div style={{ color: 'hsl(0, 0%, 50%)', fontSize: '11px', marginTop: '8px' }}>
            Action blocked. Escalating to human review.
          </div>
        </div>
      )}

      {/* Status */}
      {phase >= 4 && (
        <div style={{ color: 'hsl(0, 0%, 45%)', fontSize: '10px', textAlign: 'center', marginTop: '12px' }}>
          &gt; Kairos made the gap visible. Decision is now observable.
        </div>
      )}
    </div>
  );
};
