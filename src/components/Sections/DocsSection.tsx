import { Section } from '../Common/Section';
import { Card } from '../Common/Card';
import { motion } from 'framer-motion';

const docCategories = [
  {
    title: 'Getting Started',
    description: 'Quickstart guide for integrating Kairos ECL',
    items: ['Installation', 'Configuration', 'Your first decision gate', 'Troubleshooting'],
  },
  {
    title: 'Core Concepts',
    description: 'Understanding epistemic signals and decision states',
    items: ['The Five Signals', 'Decision State Machine', 'Risk Assessment', 'Reversibility Analysis'],
  },
  {
    title: 'API Reference',
    description: 'Complete API documentation',
    items: ['Signal Evaluator', 'Decision Gate', 'Agent Interface', 'Custom Extensions'],
  },
  {
    title: 'Examples & Recipes',
    description: 'Real-world implementation patterns',
    items: ['Autonomous Navigation', 'Medical Decision Support', 'Trading Systems', 'Content Moderation'],
  },
];

export const DocsSection: React.FC = () => {
  return (
    <Section id="docs" background="primary">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <h1
          className="h1 mb-4"
          style={{ color: 'hsl(0, 0%, 85%)' }}
        >
          Documentation & API Reference
        </h1>
        <p style={{ color: 'hsl(0, 0%, 45%)', maxWidth: '600px', margin: '0 auto' }}>
          Everything you need to understand and implement Kairos ECL in your system.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {docCategories.map((category, i) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card>
                <h3 style={{ color: 'hsl(234, 85%, 65%)', marginBottom: '6px', fontWeight: '600' }}>
                  {category.title}
                </h3>
                <p style={{ color: 'hsl(0, 0%, 45%)', fontSize: '14px', marginBottom: '12px' }}>
                  {category.description}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {category.items.map((item, j) => (
                    <li
                      key={item}
                      style={{
                        color: 'hsl(0, 0%, 85%)',
                        fontSize: '14px',
                        paddingLeft: '16px',
                        marginBottom: '6px',
                        position: 'relative',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          left: 0,
                          color: 'hsl(234, 85%, 65%)',
                        }}
                      >
                        →
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick reference */}
        <motion.div
          className="p-8 rounded-lg border-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ borderColor: 'hsl(0, 0%, 12%)', backgroundColor: 'hsl(0, 0%, 5%)' }}
        >
          <h2 style={{ color: 'hsl(234, 85%, 65%)', marginBottom: '16px', fontWeight: '600', fontSize: '18px' }}>
            Signal Evaluation Quick Reference
          </h2>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { name: 'Confidence', formula: '[0.0 - 1.0]', meaning: 'Model certainty' },
              { name: 'Grounding', formula: '[0.0 - 1.0]', meaning: 'Evidence strength' },
              { name: 'Contradiction', formula: '[0.0 - 1.0]', meaning: 'Signal conflict' },
              { name: 'Temporal', formula: '[0.0 - 1.0]', meaning: 'Time validity' },
              { name: 'Reversibility', formula: 'reversible | irreversible | unknown', meaning: 'Undo capacity' },
            ].map((sig) => (
              <div key={sig.name} style={{ padding: '12px', backgroundColor: 'hsl(0, 0%, 8%)', borderRadius: '6px' }}>
                <p style={{ color: 'hsl(234, 85%, 65%)', fontWeight: '600', fontSize: '13px', marginBottom: '4px' }}>
                  {sig.name}
                </p>
                <p style={{ color: 'hsl(0, 0%, 45%)', fontSize: '12px', marginBottom: '4px', fontFamily: 'monospace' }}>
                  {sig.formula}
                </p>
                <p style={{ color: 'hsl(0, 0%, 45%)', fontSize: '12px' }}>
                  {sig.meaning}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
};
