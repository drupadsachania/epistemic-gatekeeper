import { Section } from '../Common/Section';
import { LiveInferenceComponent } from '../Pretext/LiveInference';
import { motion } from 'framer-motion';

export const ArgusSection = () => {
  return (
    <Section id="argus">
      <div className="max-w-5xl mx-auto">
        <motion.h1
          className="h1 mb-4 text-center"
          style={{ color: 'hsl(0, 0%, 85%)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          See Real Inference Happening
        </motion.h1>

        <motion.p
          className="text-center text-lg"
          style={{ color: 'hsl(0, 0%, 45%)', maxWidth: '700px', margin: '0 auto 48px' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Click a scenario below to watch Argus extract signals, evaluate criteria,
          and make a real decision. Try your own in the input field.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <LiveInferenceComponent />
        </motion.div>
      </div>
    </Section>
  );
};
