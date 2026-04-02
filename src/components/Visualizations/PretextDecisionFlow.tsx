import React, { useEffect, useState } from 'react';

/**
 * PretextDecisionFlow: Animated decision framework visualization
 * Shows OODA loop (Observe, Orient, Decide, Act) with Kairos epistemic evaluation
 * Uses text sliding, morphing, and color transitions instead of SVG arrows
 */
export const PretextDecisionFlow: React.FC = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const phases = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1700),
      setTimeout(() => setPhase(4), 2400),
      setTimeout(() => setPhase(5), 3100),
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

  const StepBox = ({
    label,
    description,
    isActive,
    color,
    number
  }: {
    label: string;
    description: string;
    isActive: boolean;
    color: string;
    number: number
  }) => {
    return (
      <div
        className="p-4 rounded border-2 will-change-colors transition-all duration-500"
        style={{
          borderColor: isActive ? color : 'hsl(0, 0%, 12%)',
          backgroundColor: isActive ? `${color}11` : 'hsl(0, 0%, 3%)',
          opacity: isActive ? 1 : 0.4,
          transform: isActive ? 'scale(1)' : 'scale(0.95)',
        }}
      >
        <div style={{ color: 'hsl(0, 0%, 45%)', fontSize: '10px', marginBottom: '6px' }}>
          STEP {number}
        </div>
        <div style={{ color: color, fontSize: '16px', fontWeight: '700', marginBottom: '6px', letterSpacing: '1px' }}>
          {label}
        </div>
        <div style={{ color: 'hsl(0, 0%, 60%)', fontSize: '12px' }}>
          {description}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 font-mono">
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

        @keyframes arrow-pulse {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(4px); }
        }

        @keyframes signal-flow {
          0% { opacity: 0; transform: translateX(-20px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        .flow-arrow {
          animation: arrow-pulse 1s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <div style={{ color: 'hsl(0, 0%, 45%)', fontSize: '11px', letterSpacing: '1px' }}>
        &gt; EPISTEMIC DECISION FRAMEWORK (OODA LOOP + KAIROS)
      </div>

      {/* OBSERVE */}
      {phase >= 1 && (
        <div className="space-y-4">
          <StepBox
            number={1}
            label="OBSERVE"
            description="Collect input and context"
            isActive={phase >= 1}
            color="hsl(217, 91%, 60%)"
          />

          {phase >= 1 && (
            <div className="text-center" style={{ color: 'hsl(217, 91%, 60%)', height: '20px' }}>
              <div className="flow-arrow">↓</div>
            </div>
          )}
        </div>
      )}

      {/* ORIENT */}
      {phase >= 2 && (
        <div className="space-y-4">
          <StepBox
            number={2}
            label="ORIENT"
            description="Analyze and interpret signals"
            isActive={phase >= 2}
            color="hsl(48, 96%, 53%)"
          />

          {phase >= 2 && (
            <div className="text-center" style={{ color: 'hsl(48, 96%, 53%)', height: '20px' }}>
              <div className="flow-arrow">↓</div>
            </div>
          )}
        </div>
      )}

      {/* KAIROS GATE */}
      {phase >= 3 && (
        <div className="space-y-4 p-6 rounded border-2" style={{ borderColor: 'hsl(234, 85%, 65%)', backgroundColor: 'hsl(234, 85%, 5%)' }}>
          <div style={{ color: 'hsl(234, 85%, 65%)', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', marginBottom: '8px' }}>
            ⚡ KAIROS EPISTEMIC GATE
          </div>

          <div className="space-y-2 text-xs">
            <div style={{ color: 'hsl(0, 0%, 60%)', animation: 'signal-flow 0.6s ease-out both' }}>
              ✓ confidence: <span style={{ color: 'hsl(142, 71%, 45%)' }}>0.85</span>
            </div>
            <div style={{ color: 'hsl(0, 0%, 60%)', animation: 'signal-flow 0.6s ease-out 0.1s both' }}>
              ✓ grounding: <span style={{ color: 'hsl(142, 71%, 45%)' }}>0.90</span>
            </div>
            <div style={{ color: 'hsl(0, 0%, 60%)', animation: 'signal-flow 0.6s ease-out 0.2s both' }}>
              ✓ contradiction: <span style={{ color: 'hsl(142, 71%, 45%)' }}>0.10</span>
            </div>
            <div style={{ color: 'hsl(0, 0%, 60%)', animation: 'signal-flow 0.6s ease-out 0.3s both' }}>
              ✓ temporal: <span style={{ color: 'hsl(142, 71%, 45%)' }}>0.95</span>
            </div>
          </div>

          <div style={{ color: 'hsl(0, 0%, 50%)', fontSize: '10px', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid hsl(234, 85%, 15%)' }}>
            Evaluation: Signals aligned. Decision is observable and justified.
          </div>
        </div>
      )}

      {phase >= 3 && (
        <div className="text-center" style={{ color: 'hsl(234, 85%, 65%)', height: '20px' }}>
          <div className="flow-arrow">↓</div>
        </div>
      )}

      {/* DECIDE */}
      {phase >= 4 && (
        <div className="space-y-4">
          <StepBox
            number={3}
            label="DECIDE"
            description="Map to decision state with confidence"
            isActive={phase >= 4}
            color="hsl(142, 71%, 45%)"
          />

          {phase >= 4 && (
            <div className="text-center" style={{ color: 'hsl(142, 71%, 45%)', height: '20px' }}>
              <div className="flow-arrow">↓</div>
            </div>
          )}
        </div>
      )}

      {/* ACT */}
      {phase >= 5 && (
        <div className="space-y-4">
          <StepBox
            number={4}
            label="ACT"
            description="Execute decision with full epistemic transparency"
            isActive={phase >= 5}
            color="hsl(142, 71%, 45%)"
          />

          {phase >= 5 && (
            <div className="p-4 rounded" style={{ backgroundColor: 'hsl(0, 0%, 3%)', borderTop: '2px solid hsl(142, 71%, 45%)', marginTop: '12px' }}>
              <div style={{ color: 'hsl(0, 0%, 50%)', fontSize: '11px', marginBottom: '6px' }}>
                OUTCOME:
              </div>
              <div style={{ color: 'hsl(142, 71%, 45%)', fontSize: '14px', fontWeight: '700' }}>
                ✓ Action executed
              </div>
              <div style={{ color: 'hsl(0, 0%, 50%)', fontSize: '10px', marginTop: '6px' }}>
                Decision logged with full signal audit trail. Gap between action and understanding: CLOSED.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      {phase >= 5 && (
        <div className="p-4 rounded border" style={{ borderColor: 'hsl(234, 85%, 65%)', backgroundColor: 'hsl(0, 0%, 3%)' }}>
          <div style={{ color: 'hsl(0, 0%, 45%)', fontSize: '10px', letterSpacing: '1px', marginBottom: '8px' }}>
            KEY INSIGHT
          </div>
          <div style={{ color: 'hsl(234, 85%, 65%)', fontSize: '12px', lineHeight: '1.6' }}>
            Traditional agents optimize for outcomes. <span style={{ color: 'hsl(142, 71%, 45%)', fontWeight: '700' }}>Kairos adds epistemic accountability.</span>
          </div>
          <div style={{ color: 'hsl(0, 0%, 50%)', fontSize: '11px', marginTop: '8px' }}>
            Every decision is observable. The gap between what happened and why it was safe to act is gone.
          </div>
        </div>
      )}
    </div>
  );
};
