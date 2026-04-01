import { Section } from '../Common/Section';
import { DecisionSpinner } from '../Visualizations/DecisionSpinner';
import { Card } from '../Common/Card';
import { motion } from 'framer-motion';

const decisionStates = [
  {
    id: 'act',
    label: 'ACT',
    color: 'hsl(142, 71%, 45%)',
    emoji: '✓',
    description: 'Execute autonomously',
    details: 'When confidence and grounding signals align strongly. The agent has sufficient epistemic warrant to act.',
    when: 'Confidence >70% • Grounding >70% • No contradictions',
  },
  {
    id: 'escalate',
    label: 'ESCALATE',
    color: 'hsl(48, 96%, 53%)',
    emoji: '⚠',
    description: 'Hand to human judgment',
    details: 'When signals conflict or confidence is insufficient. The decision requires human epistemic oversight.',
    when: 'Confidence <70% • Temporal misalignment • Mixed signals',
  },
  {
    id: 'defer',
    label: 'DEFER',
    color: 'hsl(217, 91%, 60%)',
    emoji: '⏸',
    description: 'Await more information',
    details: 'When action is reversible and context is incomplete. Wait for additional epistemic signals.',
    when: 'Reversible action • Incomplete context • Time available',
  },
  {
    id: 'fail-safe',
    label: 'FAIL_SAFE',
    color: 'hsl(0, 84%, 60%)',
    emoji: '⛔',
    description: 'Stop and alert',
    details: 'When contradictory signals emerge or the decision space becomes uncertain. Abort and escalate.',
    when: 'Contradiction >30% • Critical system • Ambiguity detected',
  },
];

export const FrameworkSection: React.FC = () => {
  return (
    <Section id="framework" background="primary">
      <motion.div
        className="text-center mb-12 sm:mb-16 px-4 sm:px-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <h1
          className="h1 mb-4 text-2xl sm:text-4xl"
          style={{ color: 'hsl(0, 0%, 85%)' }}
        >
          Kairos ECL: Four Decision States
        </h1>
        <p style={{ color: 'hsl(0, 0%, 45%)', maxWidth: '600px', margin: '0 auto', fontSize: '14px', lineHeight: '1.6' }}>
          Every autonomous decision maps to one of four epistemic states. Not based on what the model outputs,
          but on the quality of evidence supporting action.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6">
        {/* Central decision spinner */}
        <motion.div
          className="mb-20 flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <DecisionSpinner />
        </motion.div>

        {/* Decision state cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-12">
          {decisionStates.map((state, i) => (
            <motion.div
              key={state.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card>
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: `${state.color}20`, color: state.color }}
                  >
                    {state.emoji}
                  </div>
                  <div className="flex-1">
                    <h3
                      className="h3 mb-1"
                      style={{ color: state.color }}
                    >
                      {state.label}
                    </h3>
                    <p className="body-sm text-[var(--text-secondary)] mb-4">
                      {state.description}
                    </p>
                    <p style={{ color: 'hsl(0, 0%, 85%)', fontSize: '14px', lineHeight: '1.6', marginBottom: '8px' }}>
                      {state.details}
                    </p>
                    <div
                      style={{
                        paddingTop: '8px',
                        borderTop: '1px solid hsl(0, 0%, 12%)',
                      }}
                    >
                      <p style={{ color: 'hsl(0, 0%, 45%)', fontSize: '12px' }}>
                        <span style={{ fontWeight: 'bold' }}>When:</span> {state.when}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Framework explanation */}
        <motion.div
          className="p-4 sm:p-8 rounded-lg border-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ backgroundColor: 'hsl(0, 0%, 5%)', borderColor: 'hsl(0, 0%, 12%)' }}
        >
          <h3 style={{ color: 'hsl(234, 85%, 65%)', marginBottom: '12px', fontWeight: '600', fontSize: '16px' }}>
            How the Framework Works
          </h3>
          <p style={{ color: 'hsl(0, 0%, 85%)', lineHeight: '1.8', fontSize: '14px' }}>
            Kairos ECL evaluates five epistemic signals for every decision: <strong>confidence</strong> (how sure is the
            model?), <strong>grounding</strong> (how well-anchored to reality?), <strong>contradiction</strong> (do signals
            conflict?), <strong>temporal alignment</strong> (is the decision still valid?), and <strong>reversibility</strong>{' '}
            (can we undo it?). These signals drive the state machine—not output probabilities, not domain heuristics, but
            the actual epistemic warrant for action.
          </p>
        </motion.div>
      </div>
    </Section>
  );
};
