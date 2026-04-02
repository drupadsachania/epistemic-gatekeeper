import { Section } from '../Common/Section';
import { PretextInferenceFlow } from '../Visualizations/PretextInferenceFlow';
import { SignalInspector } from '../Visualizations/SignalInspector';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card } from '../Common/Card';

interface Signal {
  confidence: number;
  grounding: number;
  contradiction: number;
  temporal: number;
  reversibility: string;
}

export const ArgusSection: React.FC = () => {
  const [signals, setSignals] = useState<Signal>({
    confidence: 0.75,
    grounding: 0.8,
    contradiction: 0.15,
    temporal: 0.9,
    reversibility: 'reversible',
  });

  const signalExplanations = [
    {
      name: 'Confidence',
      description: 'How certain is the model about its decision?',
      range: 'High = well-calibrated uncertainty',
    },
    {
      name: 'Grounding',
      description: 'Is the decision anchored to observable reality?',
      range: 'High = anchored in real evidence',
    },
    {
      name: 'Contradiction',
      description: 'Do internal signals conflict with each other?',
      range: 'Low = coherent signals',
    },
    {
      name: 'Temporal Alignment',
      description: 'Is the decision still valid given time constraints?',
      range: 'High = decision remains valid',
    },
  ];

  return (
    <Section id="argus">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <h1
          className="h1 mb-4"
          style={{ color: 'hsl(0, 0%, 85%)' }}
        >
          Argus: The Reference Implementation
        </h1>
        <p style={{ color: 'hsl(0, 0%, 45%)', maxWidth: '700px', margin: '0 auto' }}>
          Argus is the open reference architecture for epistemic governance. It evaluates every decision against five core
          signals. Change them below to see how the decision state shifts.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto w-full">
        {/* Signal explanations */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {signalExplanations.map((signal, i) => (
            <motion.div
              key={signal.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card hover={false}>
                <p style={{ color: 'hsl(234, 85%, 65%)', fontWeight: '600', marginBottom: '6px' }}>
                  {signal.name}
                </p>
                <p style={{ color: 'hsl(0, 0%, 85%)', fontSize: '14px', marginBottom: '8px' }}>
                  {signal.description}
                </p>
                <p style={{ color: 'hsl(0, 0%, 45%)', fontSize: '12px' }}>
                  {signal.range}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Live simulation */}
        <motion.div
          className="mb-12 p-8 rounded-lg border-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ borderColor: 'hsl(0, 0%, 12%)', backgroundColor: 'hsl(0, 0%, 5%)' }}
        >
          <h2
            style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '16px',
              color: 'hsl(0, 0%, 85%)',
            }}
          >
            Live Agent Simulation
          </h2>
          <p
            style={{
              color: 'hsl(0, 0%, 45%)',
              fontSize: '14px',
              marginBottom: '16px',
            }}
          >
            This agent evaluates a decision by checking all five signals. See the decision state update in real-time as
            signals change.
          </p>
          <div style={{ borderTop: '1px solid hsl(0, 0%, 12%)', paddingTop: '16px' }}>
            <PretextInferenceFlow signals={signals} />
          </div>
        </motion.div>

        {/* Interactive signal adjuster */}
        <motion.div
          className="p-8 rounded-lg border-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ borderColor: 'hsl(0, 0%, 12%)', backgroundColor: 'hsl(0, 0%, 5%)' }}
        >
          <h2
            style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '8px',
              color: 'hsl(0, 0%, 85%)',
            }}
          >
            Adjust Signals in Real-Time
          </h2>
          <p
            style={{
              color: 'hsl(0, 0%, 45%)',
              fontSize: '14px',
              marginBottom: '20px',
            }}
          >
            Experiment with different signal combinations. Notice how small changes can cascade into different decision
            states.
          </p>
          <SignalInspector signals={signals} onSignalsChange={setSignals} />
        </motion.div>

        {/* Example scenarios */}
        <motion.div
          className="mt-12 p-8 rounded-lg border-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ borderColor: 'hsl(0, 0%, 12%)', backgroundColor: 'hsl(0, 0%, 5%)' }}
        >
          <h3 style={{ color: 'hsl(234, 85%, 65%)', marginBottom: '12px', fontWeight: '600' }}>
            Try These Scenarios
          </h3>
          <div className="space-y-3">
            <button
              onClick={() =>
                setSignals({
                  confidence: 0.95,
                  grounding: 0.92,
                  contradiction: 0.05,
                  temporal: 0.98,
                  reversibility: 'reversible',
                })
              }
              className="text-left w-full p-3 rounded hover:bg-hsl(0, 0%, 8%) transition-colors"
              style={{ border: '1px solid hsl(0, 0%, 12%)' }}
            >
              <p style={{ color: 'hsl(142, 71%, 45%)', fontWeight: '600', fontSize: '14px' }}>
                Ideal conditions → ACT
              </p>
              <p style={{ color: 'hsl(0, 0%, 45%)', fontSize: '12px' }}>High confidence, strong grounding, no conflicts</p>
            </button>
            <button
              onClick={() =>
                setSignals({
                  confidence: 0.4,
                  grounding: 0.5,
                  contradiction: 0.2,
                  temporal: 0.8,
                  reversibility: 'reversible',
                })
              }
              className="text-left w-full p-3 rounded hover:bg-hsl(0, 0%, 8%) transition-colors"
              style={{ border: '1px solid hsl(0, 0%, 12%)' }}
            >
              <p style={{ color: 'hsl(48, 96%, 53%)', fontWeight: '600', fontSize: '14px' }}>
                Uncertain signals → ESCALATE
              </p>
              <p style={{ color: 'hsl(0, 0%, 45%)', fontSize: '12px' }}>Low confidence and grounding</p>
            </button>
            <button
              onClick={() =>
                setSignals({
                  confidence: 0.6,
                  grounding: 0.65,
                  contradiction: 0.55,
                  temporal: 0.4,
                  reversibility: 'reversible',
                })
              }
              className="text-left w-full p-3 rounded hover:bg-hsl(0, 0%, 8%) transition-colors"
              style={{ border: '1px solid hsl(0, 0%, 12%)' }}
            >
              <p style={{ color: 'hsl(0, 84%, 60%)', fontWeight: '600', fontSize: '14px' }}>
                High contradiction → FAIL_SAFE
              </p>
              <p style={{ color: 'hsl(0, 0%, 45%)', fontSize: '12px' }}>Conflicting signals detected</p>
            </button>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};
