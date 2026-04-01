import { motion } from 'framer-motion';

interface GlitchTextProps {
  children: string;
  delay?: number;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ children, delay = 0 }) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay }}
      className="relative inline-block"
      style={{
        animation: `glitch 0.3s ease-in-out ${delay}s`,
      }}
    >
      {children}
      {/* Glitch layers */}
      <span
        className="absolute inset-0 opacity-0"
        style={{
          color: 'var(--glitch-red)',
          textShadow: '2px 2px 0 var(--glitch-red)',
        }}
      >
        {children}
      </span>
      <span
        className="absolute inset-0 opacity-0"
        style={{
          color: 'var(--glitch-cyan)',
          textShadow: '-2px -2px 0 var(--glitch-cyan)',
        }}
      >
        {children}
      </span>
    </motion.span>
  );
};
