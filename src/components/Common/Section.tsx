import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SectionProps {
  id: string;
  children: ReactNode;
  background?: 'primary' | 'secondary';
  className?: string;
}

export const Section: React.FC<SectionProps> = ({
  id,
  children,
  background = 'primary',
  className = '',
}) => {
  const bgClass =
    background === 'secondary' ? 'bg-[var(--secondary-bg)]' : 'bg-[var(--primary-bg)]';

  return (
    <motion.section
      id={id}
      className={`min-h-screen w-full flex flex-col justify-center items-center px-6 py-20 ${bgClass} ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.section>
  );
};
