import React, { useEffect, useState } from 'react';

interface Signal {
  confidence: number;
  grounding: number;
  contradiction: number;
  temporal: number;
  reversibility: string;
}

interface PretextInferenceFlowProps {
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

/**
 * PretextInferenceFlow: Text-based visualization of AI inference
 * Makes Pretext the STAR by using character reveals, morphing, and glitch effects
 * to show the decision-making process as animated text transformation
 */
export const PretextInferenceFlow: React.FC<PretextInferenceFlowProps> = ({ signals }) => {
  const [decision, setDecision] = useState<string>(getDecisionState(signals));
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const newDecision = getDecisionState(signals);
    setDecision(newDecision);
    setAnimationPhase(0);

    // Trigger animation phases sequentially
    const phase1 = setTimeout(() => setAnimationPhase(1), 300);
    const phase2 = setTimeout(() => setAnimationPhase(2), 800);
    const phase3 = setTimeout(() => setAnimationPhase(3), 1300);

    return () => {
      clearTimeout(phase1);
      clearTimeout(phase2);
      clearTimeout(phase3);
    };
  }, [signals]);

  // Animate characters one by one
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

  // Morphing text effect (fade between states)
  const MorphText = ({ from, to, active }: { from: string; to: string; active: boolean }) => {
    return (
      <span
        style={{
          display: 'inline-block',
          opacity: active ? 1 : 0.3,
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: active ? 'scale(1) rotateX(0deg)' : 'scale(0.95) rotateX(10deg)',
        }}
      >
        {active ? to : from}
      </span>
    );
  };

  return (
    <div className="space-y-8 font-mono text-sm">
      {/* Styles for animations */}
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

        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }

        @keyframes pulse-color {
          0%, 100% { color: hsl(0, 84%, 60%); }
          50% { color: hsl(0, 84%, 75%); }
        }

        @keyframes signal-rise {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .glitch-effect {
          animation: glitch 0.3s infinite;
        }

        .pulse-effect {
          animation: pulse-color 0.8s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <div className="space-y-2">
        <div style={{ color: 'hsl(0, 0%, 45%)', fontSize: '11px', letterSpacing: '1px' }}>
          &gt; AGENT INFERENCE PIPELINE
        </div>
      </div>

      {/* Phase 1: Observing */}
      {animationPhase >= 0 && (
        <div className="space-y-3 p-4 rounded border" style={{ borderColor: 'hsl(0, 0%, 12%)', backgroundColor: 'hsl(0, 0%, 3%)' }}>
          <div style={{ color: 'hsl(234, 85%, 65%)' }}>
            <AnimatedText text="OBSERVING INPUT:" delay={0} />
          </div>
          <div style={{ color: 'hsl(0, 0%, 70%)', opacity: animationPhase >= 1 ? 1 : 0.3 }}>
            <span style={{ color: 'hsl(0, 0%, 50%)' }}>&quot;</span>
            <AnimatedText text="user wants to delete database" delay={0.3} />
            <span style={{ color: 'hsl(0, 0%, 50%)' }}>&quot;</span>
          </div>
        </div>
      )}

      {/* Phase 2: Signal Analysis */}
      {animationPhase >= 1 && (
        <div className="space-y-3 p-4 rounded border" style={{ borderColor: 'hsl(0, 0%, 12%)', backgroundColor: 'hsl(0, 0%, 3%)' }}>
          <div style={{ color: 'hsl(234, 85%, 65%)' }}>
            <AnimatedText text="ANALYZING SIGNALS:" delay={0.5} />
          </div>

          <div className="space-y-2 text-xs" style={{ opacity: animationPhase >= 2 ? 1 : 0.3 }}>
            {/* Confidence */}
            <div className="flex justify-between items-center" style={{ animation: 'signal-rise 0.6s ease-out 0.6s both' }}>
              <span style={{ color: 'hsl(0, 0%, 60%)' }}>confidence</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-1 rounded" style={{ backgroundColor: 'hsl(0, 0%, 12%)', overflow: 'hidden' }}>
                  <div
                    className="h-full will-change-transform"
                    style={{
                      width: `${signals.confidence * 100}%`,
                      backgroundColor: signals.confidence > 0.7 ? 'hsl(142, 71%, 45%)' : 'hsl(48, 96%, 53%)',
                      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                </div>
                <span style={{ color: 'hsl(0, 0%, 70%)', minWidth: '40px' }}>
                  <MorphText from="--" to={`${(signals.confidence * 100).toFixed(0)}%`} active={animationPhase >= 2} />
                </span>
              </div>
            </div>

            {/* Grounding */}
            <div className="flex justify-between items-center" style={{ animation: 'signal-rise 0.6s ease-out 0.8s both' }}>
              <span style={{ color: 'hsl(0, 0%, 60%)' }}>grounding</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-1 rounded" style={{ backgroundColor: 'hsl(0, 0%, 12%)', overflow: 'hidden' }}>
                  <div
                    className="h-full will-change-transform"
                    style={{
                      width: `${signals.grounding * 100}%`,
                      backgroundColor: signals.grounding > 0.7 ? 'hsl(142, 71%, 45%)' : 'hsl(48, 96%, 53%)',
                      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                </div>
                <span style={{ color: 'hsl(0, 0%, 70%)', minWidth: '40px' }}>
                  <MorphText from="--" to={`${(signals.grounding * 100).toFixed(0)}%`} active={animationPhase >= 2} />
                </span>
              </div>
            </div>

            {/* Contradiction */}
            <div className="flex justify-between items-center" style={{ animation: 'signal-rise 0.6s ease-out 1s both' }}>
              <span style={{ color: 'hsl(0, 0%, 60%)' }}>contradiction</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-1 rounded" style={{ backgroundColor: 'hsl(0, 0%, 12%)', overflow: 'hidden' }}>
                  <div
                    className="h-full will-change-transform"
                    style={{
                      width: `${signals.contradiction * 100}%`,
                      backgroundColor: signals.contradiction < 0.3 ? 'hsl(142, 71%, 45%)' : 'hsl(0, 84%, 60%)',
                      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                </div>
                <span style={{ color: 'hsl(0, 0%, 70%)', minWidth: '40px' }}>
                  <MorphText from="--" to={`${(signals.contradiction * 100).toFixed(0)}%`} active={animationPhase >= 2} />
                </span>
              </div>
            </div>

            {/* Temporal */}
            <div className="flex justify-between items-center" style={{ animation: 'signal-rise 0.6s ease-out 1.2s both' }}>
              <span style={{ color: 'hsl(0, 0%, 60%)' }}>temporal</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-1 rounded" style={{ backgroundColor: 'hsl(0, 0%, 12%)', overflow: 'hidden' }}>
                  <div
                    className="h-full will-change-transform"
                    style={{
                      width: `${signals.temporal * 100}%`,
                      backgroundColor: signals.temporal > 0.7 ? 'hsl(142, 71%, 45%)' : 'hsl(217, 91%, 60%)',
                      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                </div>
                <span style={{ color: 'hsl(0, 0%, 70%)', minWidth: '40px' }}>
                  <MorphText from="--" to={`${(signals.temporal * 100).toFixed(0)}%`} active={animationPhase >= 2} />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phase 3: Decision */}
      {animationPhase >= 2 && (
        <div
          className="p-6 rounded border-2 text-center will-change-colors"
          style={{
            borderColor: getDecisionColor(decision),
            backgroundColor: 'hsl(0, 0%, 3%)',
            animation: 'signal-rise 0.6s ease-out 1.4s both',
          }}
        >
          <div style={{ color: 'hsl(0, 0%, 45%)', fontSize: '11px', marginBottom: '8px', letterSpacing: '1px' }}>
            DECISION GATE EVALUATING...
          </div>
          <div
            style={{
              fontSize: '32px',
              fontWeight: '700',
              letterSpacing: '3px',
              color: getDecisionColor(decision),
              textShadow: `0 0 30px ${getDecisionColor(decision)}88`,
              animation: decision === 'FAIL_SAFE' ? 'pulse-color 0.8s ease-in-out infinite' : 'none',
            }}
          >
            {decision === 'FAIL_SAFE' && <span className="glitch-effect">{decision}</span>}
            {decision !== 'FAIL_SAFE' && <AnimatedText text={decision} delay={1.5} />}
          </div>
        </div>
      )}

      {/* Footer */}
      {animationPhase >= 3 && (
        <div style={{ color: 'hsl(0, 0%, 45%)', fontSize: '11px', textAlign: 'center', opacity: 0.7 }}>
          &gt; Inference complete. Ready for next evaluation.
        </div>
      )}
    </div>
  );
};
