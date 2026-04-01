import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const sections = [
  { id: 'problem', label: 'Problem' },
  { id: 'framework', label: 'Framework' },
  { id: 'argus', label: 'Argus' },
  { id: 'docs', label: 'Docs' },
  { id: 'research', label: 'Research' },
  { id: 'adoption', label: 'Adoption' },
];

export const BottomNav: React.FC = () => {
  const [active, setActive] = useState('problem');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide on scroll down (>50px)
      if (currentScrollY > lastScrollY + 50) {
        setIsVisible(false);
      }
      // Show on scroll up (<50px)
      else if (currentScrollY < lastScrollY - 50) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);

      // Update active based on scroll position
      sections.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top < window.innerHeight / 2) {
            setActive(id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActive(sectionId);
    }
  };

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-[1000] h-20 bg-[rgba(10,14,39,0.95)] backdrop-blur-md border-t border-[var(--grid-color)]"
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="h-full flex justify-center items-center gap-6 px-6 flex-wrap">
        {sections.map(({ id, label }) => (
          <motion.button
            key={id}
            onClick={() => handleNavClick(id)}
            className={`relative px-4 py-2 uppercase text-sm font-medium tracking-wider transition-all duration-200 ${
              active === id
                ? 'text-[var(--act)] drop-shadow-[0_0_10px_rgba(0,255,65,0.3)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--act)]'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {label}
            {active === id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--act)] rounded-t"
                layoutId="active-nav-indicator"
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.nav>
  );
};
