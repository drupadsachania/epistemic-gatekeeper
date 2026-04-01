import { motion } from 'framer-motion';
import { useState } from 'react';

interface ThreatLandscapeProps {
  interactive?: boolean;
}

export const ThreatLandscape: React.FC<ThreatLandscapeProps> = ({ interactive = false }) => {
  const [hoveredThreat, setHoveredThreat] = useState<number | null>(null);

  const threats = [
    { label: 'Autonomous Drift', level: 75, description: 'Model behavior diverges from intended deployment' },
    { label: 'Trust Erosion', level: 60, description: 'Stakeholder confidence diminishes over time' },
    { label: 'Oversight Gap', level: 85, description: 'Decision rationale remains opaque to operators' },
    { label: 'Signal Noise', level: 45, description: 'Conflicting epistemic indicators confuse response' },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <motion.svg
        viewBox="0 0 500 320"
        className="w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Grid background */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(0, 0%, 12%)" strokeWidth="0.5" />
          </pattern>
          <linearGradient id="threatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(48, 96%, 53%)" />
            <stop offset="100%" stopColor="hsl(0, 84%, 60%)" />
          </linearGradient>
        </defs>
        <rect width="500" height="320" fill="url(#grid)" opacity="0.2" />

        {/* Axes */}
        <line x1="50" y1="270" x2="450" y2="270" stroke="hsl(0, 0%, 12%)" strokeWidth="1" />
        <line x1="50" y1="30" x2="50" y2="270" stroke="hsl(0, 0%, 12%)" strokeWidth="1" />

        {/* Axis labels */}
        <text x="475" y="285" fontSize="12" fill="hsl(0, 0%, 45%)" textAnchor="middle">
          Prevalence
        </text>
        <text x="25" y="150" fontSize="12" fill="hsl(0, 0%, 45%)" textAnchor="middle" transform="rotate(-90, 25, 150)">
          Risk Level
        </text>

        {/* Threat visualization */}
        {threats.map((threat, i) => {
          const x = 100 + i * 100;
          const y = 270 - threat.level * 1.5;
          const size = 15 + threat.level / 5;

          return (
            <motion.g
              key={i}
              onMouseEnter={() => interactive && setHoveredThreat(i)}
              onMouseLeave={() => interactive && setHoveredThreat(null)}
              style={{ cursor: interactive ? 'pointer' : 'default' }}
            >
              <motion.circle
                cx={x}
                cy={y}
                r={size}
                fill="none"
                stroke="url(#threatGradient)"
                strokeWidth="2"
                animate={
                  hoveredThreat === i
                    ? { r: size + 5, opacity: 1 }
                    : interactive
                      ? { r: size, opacity: 0.7 }
                      : {}
                }
                transition={{ duration: 0.3 }}
              />
              <motion.circle
                cx={x}
                cy={y}
                r={size}
                fill="url(#threatGradient)"
                opacity={0.1}
                animate={
                  hoveredThreat === i
                    ? { opacity: 0.2 }
                    : { opacity: 0.1 }
                }
                transition={{ duration: 0.3 }}
              />
              <text
                x={x}
                y={295}
                textAnchor="middle"
                fontSize="13"
                fill="hsl(0, 0%, 85%)"
                fontWeight="500"
              >
                {threat.label}
              </text>
              <text
                x={x}
                y={310}
                textAnchor="middle"
                fontSize="11"
                fill="hsl(0, 0%, 45%)"
              >
                Level: {threat.level}
              </text>
            </motion.g>
          );
        })}
      </motion.svg>

      {/* Tooltip */}
      {interactive && hoveredThreat !== null && (
        <motion.div
          className="mt-4 p-4 rounded-lg bg-hsl(0, 0%, 5%) border border-hsl(0, 0%, 12%)"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: '300px', borderColor: 'hsl(0, 0%, 12%)' }}
        >
          <p className="font-semibold" style={{ color: 'hsl(0, 0%, 85%)' }}>
            {threats[hoveredThreat].label}
          </p>
          <p className="text-sm" style={{ color: 'hsl(0, 0%, 45%)', marginTop: '8px' }}>
            {threats[hoveredThreat].description}
          </p>
        </motion.div>
      )}
    </div>
  );
};
