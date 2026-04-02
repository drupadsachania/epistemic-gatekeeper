import { useState } from 'react';
import { runInference, formatInferenceForDisplay, InferenceEvent } from '@/lib/inference';
import { motion } from 'framer-motion';

const PRESET_TRIGGERS = [
  'Delete all database logs from Q1 2023',
  'Create a new read-only QA user account',
  'Update pricing for all EU customers',
  'Disable security monitoring for production',
  'Grant admin access to new contractor',
  'Backup critical system files',
  'Compress old archived data',
  'Export customer contact list'
];

export const LiveInferenceComponent = () => {
  const [event, setEvent] = useState<InferenceEvent | null>(null);
  const [displayedText, setDisplayedText] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [stage, setStage] = useState<'idle' | 'running' | 'complete'>('idle');
  const [customInput, setCustomInput] = useState('');

  const runInferenceEvent = async (input: string) => {
    setIsRunning(true);
    setStage('running');
    setDisplayedText('');
    setCustomInput('');

    // Run inference (simulates real computation)
    const inference = await runInference(input);
    setEvent(inference);

    // Get formatted output
    const formatted = formatInferenceForDisplay(inference);

    // Stream character by character (Pretext effect)
    let index = 0;
    const streamInterval = setInterval(() => {
      if (index < formatted.length) {
        setDisplayedText(formatted.substring(0, index + 1));
        index++;
      } else {
        clearInterval(streamInterval);
        setStage('complete');
        setIsRunning(false);
      }
    }, 15); // 15ms per character = natural reading speed
  };

  const getDecisionColor = (decision: string) => {
    const colors: Record<string, string> = {
      'ACT': '#10b981',           // Green
      'ESCALATE': '#ff6b35',      // Orange
      'DEFER': '#0099ff',         // Blue
      'FAIL_SAFE': '#ff1744'      // Red
    };
    return colors[decision] || '#ffffff';
  };

  const getDecisionBg = (decision: string) => {
    const bgs: Record<string, string> = {
      'ACT': 'rgba(16, 185, 129, 0.1)',
      'ESCALATE': 'rgba(255, 107, 53, 0.1)',
      'DEFER': 'rgba(0, 153, 255, 0.1)',
      'FAIL_SAFE': 'rgba(255, 23, 68, 0.1)'
    };
    return bgs[decision] || 'transparent';
  };

  return (
    <div className="space-y-6">
      {/* Preset triggers */}
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'hsl(0, 0%, 85%)' }}>Try These Scenarios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {PRESET_TRIGGERS.map((trigger, i) => (
            <motion.button
              key={i}
              onClick={() => runInferenceEvent(trigger)}
              disabled={isRunning}
              className="p-3 text-left text-xs border rounded hover:transition-all disabled:opacity-50 disabled:cursor-wait"
              style={{
                borderColor: isRunning ? 'hsl(0, 0%, 12%)' : 'hsl(234, 85%, 65%)',
                backgroundColor: isRunning ? 'transparent' : 'transparent',
                color: 'hsl(0, 0%, 70%)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              "{trigger}"
            </motion.button>
          ))}
        </div>
      </div>

      {/* Custom input */}
      <div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'hsl(0, 0%, 85%)' }}>Or Create Your Own</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && customInput.trim()) {
                runInferenceEvent(customInput);
              }
            }}
            placeholder="What should the agent do?"
            disabled={isRunning}
            className="flex-1 px-4 py-2 rounded text-sm outline-none"
            style={{
              backgroundColor: 'hsl(0, 0%, 8%)',
              borderColor: 'hsl(234, 85%, 65%)',
              border: '1px solid hsl(234, 85%, 65%)',
              color: 'hsl(0, 0%, 85%)',
            }}
          />
          <motion.button
            onClick={() => {
              if (customInput.trim()) {
                runInferenceEvent(customInput);
              }
            }}
            disabled={isRunning}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 font-bold rounded transition-all disabled:opacity-50"
            style={{
              backgroundColor: '#10b981',
              color: 'hsl(0, 0%, 10%)',
              boxShadow: isRunning ? 'none' : '0 0 20px rgba(16, 185, 129, 0.5)',
            }}
          >
            Run
          </motion.button>
        </div>
      </div>

      {/* Inference output */}
      {event && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Status */}
          <div className="flex items-center gap-2 text-sm">
            <motion.div
              animate={{ scale: stage === 'running' ? [1, 1.2, 1] : 1 }}
              transition={{ repeat: stage === 'running' ? Infinity : 0, duration: 1 }}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: stage === 'running' ? '#f59e0b' : '#10b981',
              }}
            />
            <span style={{ color: 'hsl(0, 0%, 50%)' }}>
              {stage === 'running' ? 'Inference running...' : 'Complete'}
            </span>
          </div>

          {/* Pretext streaming output */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 rounded border font-mono text-sm leading-relaxed"
            style={{
              backgroundColor: 'hsl(0, 0%, 3%)',
              borderColor: 'hsl(0, 0%, 12%)',
            }}
          >
            <pre className="whitespace-pre-wrap break-words" style={{ color: 'hsl(234, 85%, 65%)' }}>
              {displayedText}
              {stage === 'running' && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  |
                </motion.span>
              )}
            </pre>
          </motion.div>

          {/* Decision highlight */}
          {stage === 'complete' && event && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded border-l-4"
              style={{
                backgroundColor: getDecisionBg(event.decision),
                borderLeftColor: getDecisionColor(event.decision)
              }}
            >
              <div
                className="text-lg font-bold mb-2"
                style={{ color: getDecisionColor(event.decision) }}
              >
                → {event.decision}
              </div>
              <div className="text-sm" style={{ color: 'hsl(0, 0%, 50%)' }}>
                {event.reasoning}
              </div>
            </motion.div>
          )}

          {/* Signal metrics */}
          {stage === 'complete' && event && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-5 gap-2 text-center text-sm"
            >
              {[
                {
                  label: 'Confidence',
                  value: (event.signals.confidence * 100).toFixed(0),
                  unit: '%'
                },
                {
                  label: 'Grounding',
                  value: event.signals.grounding.sources,
                  unit: 'src'
                },
                {
                  label: 'Contradiction',
                  value: (event.signals.contradiction * 100).toFixed(0),
                  unit: '%'
                },
                {
                  label: 'Temporal',
                  value: (event.signals.temporal * 100).toFixed(0),
                  unit: '%'
                },
                {
                  label: 'Reversible',
                  value: event.signals.reversibility === 'reversible' ? '✓' : '✗',
                  unit: ''
                }
              ].map((metric) => (
                <motion.div
                  key={metric.label}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="p-2 rounded border"
                  style={{
                    backgroundColor: 'hsl(0, 0%, 5%)',
                    borderColor: 'hsl(0, 0%, 12%)',
                  }}
                >
                  <div style={{ color: '#10b981', fontWeight: 'bold' }}>
                    {metric.value}
                  </div>
                  <div style={{ color: 'hsl(0, 0%, 50%)', fontSize: '12px' }}>
                    {metric.label}
                  </div>
                  {metric.unit && (
                    <div style={{ color: 'hsl(0, 0%, 40%)', fontSize: '10px' }}>
                      {metric.unit}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Empty state */}
      {!event && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
          style={{ color: 'hsl(0, 0%, 50%)' }}
        >
          <p className="mb-2">Click a scenario or enter your own</p>
          <p className="text-xs">Watch real inference happen with actual signals</p>
        </motion.div>
      )}
    </div>
  );
};
