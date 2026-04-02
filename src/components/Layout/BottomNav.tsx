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
    // Intersection Observer for scroll detection (fires only when section enters viewport)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Throttled scroll listener for nav visibility (much lower frequency)
    let throttleTimer: NodeJS.Timeout;

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
    };

    const throttledScroll = () => {
      clearTimeout(throttleTimer);
      throttleTimer = setTimeout(handleScroll, 100);
    };

    window.addEventListener('scroll', throttledScroll);
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      clearTimeout(throttleTimer);
    };
  }, [lastScrollY]);

  const handleNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActive(sectionId);
    }
  };

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-[1000] h-20 bg-[rgba(10,14,39,0.95)] backdrop-blur-md border-t border-[var(--grid-color)] will-change-transform transition-transform duration-300 ease-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="h-full flex justify-center items-center gap-6 px-6 flex-wrap">
        {sections.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => handleNavClick(id)}
            className={`relative px-4 py-2 uppercase text-sm font-medium tracking-wider will-change-transform transition-colors duration-200 ${
              active === id
                ? 'text-[var(--act)] drop-shadow-[0_0_10px_rgba(0,255,65,0.3)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--act)]'
            }`}
          >
            {label}
            {active === id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--act)] rounded-t animate-in fade-in duration-300" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};
