import { Section } from '../Common/Section';
import { motion } from 'framer-motion';
import ReactiveTextOverlay from '../Common/ReactiveTextOverlay';

export const HeroSection: React.FC = () => {
  return (
    <Section id="problem" className="relative overflow-hidden">
      {/* Reactive LLM token text overlay */}
      <ReactiveTextOverlay />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
        {/* Logo/Branding */}
        <motion.div
          className="mb-8 sm:mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src="/kairos-logo.png"
            alt="Kairos"
            className="h-12 sm:h-16 mx-auto mb-4 sm:mb-6"
          />
        </motion.div>

        {/* Main heading */}
        <motion.h1
          className="h1 mb-6 sm:mb-8 text-2xl sm:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ color: 'var(--text-primary)' }}
        >
          The Autonomous Decision Problem
        </motion.h1>

        {/* Problem statement - focusing on the reality, not sales */}
        <motion.div
          className="space-y-4 sm:space-y-6 mb-8 sm:mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="body-lg text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
            When autonomous agents make decisions, you see logs. But logs don't tell you if the decision was safe.
          </p>

          <p className="body-lg text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
            You can observe <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>what happened</span>.
            But you cannot observe <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>why it was safe to act</span>.
          </p>

          <p className="body-lg text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
            This is the epistemic gap. The distance between action and understanding.
          </p>
        </motion.div>

        {/* Subheading */}
        <motion.p
          className="body-lg text-sm sm:text-base"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ color: 'var(--text-secondary)' }}
        >
          Kairos ECL makes that gap visible.
        </motion.p>
      </div>
    </Section>
  );
};
