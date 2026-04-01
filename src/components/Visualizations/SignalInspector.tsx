import { useState } from 'react';
import { motion } from 'framer-motion';

interface Signal {
  confidence: number;
  grounding: number;
  contradiction: number;
  temporal: number;
  reversibility: string;
}

interface SignalInspectorProps {
  signals: Signal;
  onSignalsChange: (signals: Signal) => void;
}

export const SignalInspector: React.FC<SignalInspectorProps> = ({ signals, onSignalsChange }) => {
  const reversibilityOptions = ['reversible', 'irreversible', 'unknown'];

  const handleSliderChange = (key: string, value: number) => {
    onSignalsChange({
      ...signals,
      [key]: value,
    });
  };

  const handleSelectChange = (value: string) => {
    onSignalsChange({
      ...signals,
      reversibility: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Sliders */}
      {Object.entries(signals)
        .filter(([key]) => key !== 'reversibility')
        .map(([key, value]) => (
          <div key={key}>
            <div className="flex justify-between mb-3">
              <label className="text-sm font-medium capitalize text-[var(--text-secondary)]">
                {key}
              </label>
              <span className="text-sm font-bold text-[var(--act)]">
                {Math.round((value as number) * 100)}%
              </span>
            </div>
            <motion.input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={value}
              onChange={(e) => handleSliderChange(key, parseFloat(e.target.value))}
              className="w-full h-2 bg-[var(--secondary-bg)] rounded-full appearance-none cursor-pointer accent-[var(--act)]"
            />
          </div>
        ))}

      {/* Reversibility select */}
      <div>
        <label className="text-sm font-medium text-[var(--text-secondary)] block mb-3">
          Reversibility
        </label>
        <select
          value={signals.reversibility}
          onChange={(e) => handleSelectChange(e.target.value)}
          className="w-full p-3 rounded-lg bg-[var(--secondary-bg)] border border-[var(--grid-color)] text-[var(--text-primary)] font-medium cursor-pointer hover:border-[var(--act)] transition-colors"
        >
          {reversibilityOptions.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Reset button */}
      <motion.button
        onClick={() =>
          onSignalsChange({
            confidence: 0.75,
            grounding: 0.8,
            contradiction: 0.15,
            temporal: 0.9,
            reversibility: 'reversible',
          })
        }
        className="w-full px-4 py-2 rounded-lg border border-[var(--accent-cyan)] text-[var(--accent-cyan)] font-medium hover:bg-[rgba(6,182,212,0.1)] transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Reset to Default
      </motion.button>
    </div>
  );
};
