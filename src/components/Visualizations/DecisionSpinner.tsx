import { motion } from 'framer-motion';
import { useState } from 'react';

interface DecisionInfo {
  label: string;
  color: string;
  angle: number;
  description: string;
  trigger: string;
}

export const DecisionSpinner: React.FC = () => {
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);

  const decisions: DecisionInfo[] = [
    {
      label: 'ACT',
      color: 'hsl(142, 71%, 45%)',
      angle: 0,
      description: 'High confidence, well-grounded. Execute autonomously.',
      trigger: 'Confidence > 70% & Grounding > 70% & No contradictions',
    },
    {
      label: 'ESCALATE',
      color: 'hsl(48, 96%, 53%)',
      angle: 90,
      description: 'Uncertain signals. Hand to human judgment.',
      trigger: 'Confidence < 70% OR Temporal misalignment detected',
    },
    {
      label: 'DEFER',
      color: 'hsl(217, 91%, 60%)',
      angle: 180,
      description: 'Missing context. Await more information.',
      trigger: 'Reversible action & context incomplete',
    },
    {
      label: 'FAIL_SAFE',
      color: 'hsl(0, 84%, 60%)',
      angle: 270,
      description: 'Contradictory signals. Stop and alert.',
      trigger: 'Contradiction score > 30% OR critical system detected',
    },
  ];

  return (
    <div className="relative w-full flex flex-col items-center justify-center gap-8">
      {/* Spinner */}
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Center circle - rotating */}
        <motion.div
          className="absolute w-16 h-16 rounded-full border-2"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{
            borderColor: 'hsl(234, 85%, 65%)',
            boxShadow: 'var(--glow-accent)',
          }}
        />

        {/* Center text */}
        <div className="absolute z-10 text-center">
          <p style={{ color: 'hsl(0, 0%, 45%)', fontSize: '12px' }}>DECISION</p>
          <p style={{ color: 'hsl(234, 85%, 65%)', fontSize: '14px', fontWeight: 'bold' }}>
            {selectedDecision || 'STATE'}
          </p>
        </div>

        {/* Decision states around circle */}
        {decisions.map((decision, i) => {
          const radius = 120;
          const x = radius * Math.cos((decision.angle * Math.PI) / 180);
          const y = radius * Math.sin((decision.angle * Math.PI) / 180);
          const isSelected = selectedDecision === decision.label;

          return (
            <motion.button
              key={decision.label}
              className="absolute w-24 h-24 rounded-lg border-2 flex items-center justify-center font-bold cursor-pointer transition-all"
              style={{
                borderColor: decision.color,
                backgroundColor: isSelected ? `${decision.color}30` : `${decision.color}15`,
                color: decision.color,
                x,
                y,
              }}
              animate={{
                scale: isSelected ? 1.2 : 1,
                opacity: isSelected ? 1 : 0.8,
              }}
              whileHover={{
                scale: 1.15,
              }}
              onClick={() => setSelectedDecision(isSelected ? null : decision.label)}
              transition={{ duration: 0.3 }}
            >
              <span className="text-2xl">{decision.label[0]}</span>
            </motion.button>
          );
        })}

        {/* Connecting lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(234, 85%, 65%)" />
              <stop offset="100%" stopColor="hsl(234, 85%, 65%)" />
            </linearGradient>
          </defs>
          {decisions.map((_, i) => {
            const next = (i + 1) % decisions.length;
            const angle1 = (decisions[i].angle * Math.PI) / 180;
            const angle2 = (decisions[next].angle * Math.PI) / 180;
            const r = 120;
            const x1 = 160 + r * Math.cos(angle1);
            const y1 = 160 + r * Math.sin(angle1);
            const x2 = 160 + r * Math.cos(angle2);
            const y2 = 160 + r * Math.sin(angle2);

            return (
              <line
                key={`line-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="url(#lineGrad)"
                strokeWidth="1"
                opacity="0.3"
              />
            );
          })}
        </svg>
      </div>

      {/* Info panel */}
      {selectedDecision && (
        <motion.div
          className="w-full max-w-md p-6 rounded-lg border-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            borderColor: decisions.find((d) => d.label === selectedDecision)?.color,
            backgroundColor: 'hsl(0, 0%, 5%)',
          }}
        >
          <div
            className="font-bold text-lg mb-3"
            style={{ color: decisions.find((d) => d.label === selectedDecision)?.color }}
          >
            {selectedDecision}
          </div>
          <p style={{ color: 'hsl(0, 0%, 85%)', marginBottom: '12px', lineHeight: '1.6' }}>
            {decisions.find((d) => d.label === selectedDecision)?.description}
          </p>
          <div className="pt-3 border-t border-hsl(0, 0%, 12%)">
            <p style={{ color: 'hsl(0, 0%, 45%)', fontSize: '12px' }}>Triggers:</p>
            <p style={{ color: 'hsl(0, 0%, 45%)', fontSize: '13px', marginTop: '6px' }}>
              {decisions.find((d) => d.label === selectedDecision)?.trigger}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
