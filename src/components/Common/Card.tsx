import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
}) => {
  return (
    <motion.div
      className={`p-6 rounded-lg border border-[var(--grid-color)] bg-[rgba(21,25,50,0.5)] transition-all duration-300 ${hover ? 'hover:border-[var(--act)] hover:bg-[rgba(21,25,50,0.8)]' : ''} ${className}`}
      whileHover={hover ? { scale: 1.05, y: -5 } : {}}
    >
      {children}
    </motion.div>
  );
};
