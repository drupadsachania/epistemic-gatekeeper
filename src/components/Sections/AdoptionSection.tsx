import { Section } from '../Common/Section';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { motion } from 'framer-motion';

const adoptionPath = [
  {
    step: 1,
    title: 'Understand the Framework',
    time: '2-4 hours',
    items: ['Read the problem statement', 'Study the five signals', 'Review decision states', 'Explore use cases'],
  },
  {
    step: 2,
    title: 'Install Argus Reference',
    time: '30 minutes',
    items: ['Clone the repository', 'Install dependencies', 'Run tests', 'Verify installation'],
  },
  {
    step: 3,
    title: 'Build Your First Gate',
    time: '1-2 days',
    items: ['Define signal evaluators', 'Implement decision logic', 'Integrate with your system', 'Test end-to-end'],
  },
  {
    step: 4,
    title: 'Deploy & Monitor',
    time: 'Ongoing',
    items: ['Set up logging', 'Configure alerts', 'Monitor signal quality', 'Iterate and improve'],
  },
];

const resources = [
  {
    title: 'GitHub Repository',
    description: 'Open source reference implementation',
    icon: '</>' ,
  },
  {
    title: 'Community Forum',
    description: 'Ask questions and share implementations',
    icon: '💬',
  },
  {
    title: 'Research Library',
    description: 'Papers, validation studies, and case studies',
    icon: '📚',
  },
  {
    title: 'Integration Guides',
    description: 'Step-by-step guides for popular frameworks',
    icon: '🔧',
  },
];

export const AdoptionSection: React.FC = () => {
  return (
    <Section id="adoption" background="primary">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <h1
          className="h1 mb-4"
          style={{ color: 'hsl(0, 0%, 85%)' }}
        >
          Getting Started with Kairos
        </h1>
        <p style={{ color: 'hsl(0, 0%, 45%)', maxWidth: '700px', margin: '0 auto' }}>
          Kairos is open source. Integrate epistemic governance into your autonomous systems in four steps.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto w-full">
        {/* Adoption path */}
        <div className="mb-16">
          <div className="grid md:grid-cols-4 gap-6">
            {adoptionPath.map((phase, i) => (
              <motion.div
                key={phase.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card hover={false}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'hsl(234, 85%, 65% / 0.2)',
                      color: 'hsl(234, 85%, 65%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      marginBottom: '12px',
                    }}
                  >
                    {phase.step}
                  </div>
                  <h3
                    style={{
                      color: 'hsl(0, 0%, 85%)',
                      fontWeight: '600',
                      marginBottom: '4px',
                      fontSize: '16px',
                    }}
                  >
                    {phase.title}
                  </h3>
                  <p style={{ color: 'hsl(0, 0%, 45%)', fontSize: '12px', marginBottom: '12px' }}>
                    {phase.time}
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {phase.items.map((item) => (
                      <li
                        key={item}
                        style={{
                          color: 'hsl(0, 0%, 85%)',
                          fontSize: '13px',
                          marginBottom: '6px',
                          paddingLeft: '16px',
                          position: 'relative',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            left: 0,
                            color: 'hsl(142, 71%, 45%)',
                          }}
                        >
                          ✓
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2
            style={{
              color: 'hsl(234, 85%, 65%)',
              marginBottom: '16px',
              fontWeight: '600',
              fontSize: '20px',
            }}
          >
            Resources
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {resources.map((resource, i) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
              >
                <Card>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>
                    {resource.icon}
                  </div>
                  <h3 style={{ color: 'hsl(0, 0%, 85%)', fontWeight: '600', marginBottom: '6px' }}>
                    {resource.title}
                  </h3>
                  <p style={{ color: 'hsl(0, 0%, 45%)', fontSize: '14px' }}>
                    {resource.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="p-8 rounded-lg border-2 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ borderColor: 'hsl(234, 85%, 65% / 0.3)', backgroundColor: 'hsl(0, 0%, 5%)' }}
        >
          <h2
            style={{
              color: 'hsl(0, 0%, 85%)',
              marginBottom: '8px',
              fontSize: '20px',
              fontWeight: '600',
            }}
          >
            Ready to Build Epistemic Governance?
          </h2>
          <p
            style={{
              color: 'hsl(0, 0%, 45%)',
              marginBottom: '20px',
              maxWidth: '500px',
              margin: '0 auto 20px',
            }}
          >
            Start with the reference implementation or integrate into your existing system.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button variant="primary" size="lg">
              View on GitHub
            </Button>
            <Button variant="outline" size="lg">
              Join Community
            </Button>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};
