import { motion } from 'framer-motion';

interface Signal {
  confidence: number;
  grounding: number;
  contradiction: number;
  temporal: number;
  reversibility: string;
}

interface AgentSimulationProps {
  signals: Signal;
}

export const AgentSimulation: React.FC<AgentSimulationProps> = ({ signals }) => {
  const decision =
    signals.contradiction > 0.3
      ? 'FAIL_SAFE'
      : signals.confidence > 0.7 && signals.grounding > 0.7
        ? 'ACT'
        : signals.confidence < 0.5
          ? 'DEFER'
          : 'ESCALATE';

  const decisionColors = {
    ACT: '#00ff41',
    ESCALATE: '#ff6b35',
    DEFER: '#0099ff',
    FAIL_SAFE: '#ff1744',
  };

  return (
    <div className="space-y-8">
      {/* Signal bars */}
      <div className="space-y-4">
        {Object.entries(signals)
          .filter(([key]) => key !== 'reversibility')
          .map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium capitalize text-[var(--text-secondary)]">
                  {key}
                </label>
                <span className="text-sm font-bold text-[var(--act)]">
                  {Math.round((value as number) * 100)}%
                </span>
              </div>
              <motion.div
                className="h-2 bg-[var(--secondary-bg)] rounded-full overflow-hidden"
                style={{ borderColor: 'var(--grid-color)', borderWidth: '1px' }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-[var(--act)] to-[var(--accent-cyan)]"
                  animate={{ width: `${(value as number) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
            </div>
          ))}
      </div>

      {/* Current decision */}
      <motion.div
        className="p-6 rounded-lg border-2"
        style={{
          borderColor: decisionColors[decision as keyof typeof decisionColors],
          backgroundColor: `${decisionColors[decision as keyof typeof decisionColors]}20`,
          boxShadow: `0 0 20px ${decisionColors[decision as keyof typeof decisionColors]}40`,
        }}
        animate={{ boxShadow: [`0 0 20px ${decisionColors[decision as keyof typeof decisionColors]}40`, `0 0 30px ${decisionColors[decision as keyof typeof decisionColors]}80`, `0 0 20px ${decisionColors[decision as keyof typeof decisionColors]}40`] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <p className="text-sm text-[var(--text-secondary)] mb-2">Current Decision</p>
        <p className="text-2xl font-bold" style={{ color: decisionColors[decision as keyof typeof decisionColors] }}>
          {decision}
        </p>
      </motion.div>
    </div>
  );
};
