/**
 * Adoption Section with Real-Time Data Fetching
 * Enhanced version that loads adoption steps from API
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Section } from '../Common/Section';
import { Card } from '../Common/Card';
import { useAdoptionSteps, useTrackSection, useAnalytics } from '../../lib/useApi';

export const AdoptionSectionV2: React.FC = () => {
  // Track section view time
  useTrackSection('adoption');

  // Analytics tracking
  const analytics = useAnalytics();

  // Fetch adoption steps from API
  const { data: steps, loading, error } = useAdoptionSteps();

  const handleCTAClick = (ctaType: string) => {
    analytics.trackButtonClick('adoption', ctaType);
  };

  return (
    <Section id="adoption" background="primary">
      <motion.div
        className="text-center mb-12 sm:mb-16 px-4 sm:px-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <h1
          className="h1 mb-4 text-2xl sm:text-4xl"
          style={{ color: 'hsl(0, 0%, 85%)' }}
        >
          Getting Started with Kairos
        </h1>
        <p style={{ color: 'hsl(0, 0%, 45%)', maxWidth: '700px', margin: '0 auto', fontSize: '14px', lineHeight: '1.6' }}>
          Kairos is open source. Integrate epistemic governance into your autonomous systems in four steps.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6">
        {/* Loading State */}
        {loading && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="inline-block mb-4">
              <div className="w-8 h-8 border-2 border-hsl(234, 85%, 65%) border-t-transparent rounded-full animate-spin" />
            </div>
            <p style={{ color: 'hsl(0, 0%, 45%)', fontSize: '14px' }}>Loading adoption steps...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            className="p-4 rounded-lg mb-8"
            style={{ backgroundColor: 'hsl(0, 84%, 20%)', borderColor: 'hsl(0, 84%, 60%)', border: '1px solid' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p style={{ color: 'hsl(0, 84%, 60%)', fontSize: '14px' }}>
              Error loading adoption steps. Using default pathway.
            </p>
          </motion.div>
        )}

        {/* Adoption Steps */}
        {steps && (
          <div className="mb-12 sm:mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
              {steps.map((step, i) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'hsl(234, 85%, 30%)',
                        color: 'hsl(234, 85%, 65%)',
                        fontWeight: '700',
                        fontSize: '18px',
                        marginBottom: '12px',
                      }}
                    >
                      {step.id}
                    </div>

                    <h3
                      style={{
                        color: 'hsl(234, 85%, 65%)',
                        fontWeight: '600',
                        fontSize: '16px',
                        marginBottom: '8px',
                      }}
                    >
                      {step.title}
                    </h3>

                    <p
                      style={{
                        color: 'hsl(0, 0%, 45%)',
                        fontSize: '13px',
                        marginBottom: '12px',
                      }}
                    >
                      {step.timeEstimate}
                    </p>

                    <p
                      style={{
                        color: 'hsl(0, 0%, 85%)',
                        fontSize: '13px',
                        lineHeight: '1.6',
                        marginBottom: '12px',
                      }}
                    >
                      {step.description}
                    </p>

                    <ul
                      style={{
                        color: 'hsl(0, 0%, 65%)',
                        fontSize: '12px',
                        lineHeight: '1.8',
                        paddingLeft: '20px',
                      }}
                    >
                      {step.tasks.map((task, j) => (
                        <li key={j} style={{ marginBottom: '4px' }}>
                          ✓ {task}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Resources */}
        <motion.div
          className="mb-12 sm:mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2
            style={{
              color: 'hsl(234, 85%, 65%)',
              fontWeight: '600',
              fontSize: '18px',
              marginBottom: '16px',
            }}
          >
            Resources
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[
              {
                icon: '</> ',
                title: 'GitHub Repository',
                description: 'Open source reference implementation',
              },
              {
                icon: '💬',
                title: 'Community Forum',
                description: 'Ask questions and share implementations',
              },
              {
                icon: '📚',
                title: 'Research Library',
                description: 'Papers, validation studies, and case studies',
              },
              {
                icon: '🔧',
                title: 'Integration Guides',
                description: 'Step-by-step guides for popular frameworks',
              },
            ].map((resource, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card>
                  <div style={{ fontSize: '24px', marginBottom: '12px' }}>{resource.icon}</div>
                  <h3
                    style={{
                      color: 'hsl(234, 85%, 65%)',
                      fontWeight: '600',
                      fontSize: '16px',
                      marginBottom: '8px',
                    }}
                  >
                    {resource.title}
                  </h3>
                  <p
                    style={{
                      color: 'hsl(0, 0%, 45%)',
                      fontSize: '13px',
                    }}
                  >
                    {resource.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="p-4 sm:p-8 rounded-lg border-2 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ borderColor: 'hsl(0, 0%, 12%)', backgroundColor: 'hsl(0, 0%, 5%)' }}
        >
          <h3
            style={{
              color: 'hsl(0, 0%, 85%)',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '12px',
            }}
          >
            Ready to Build Epistemic Governance?
          </h3>
          <p
            style={{
              color: 'hsl(0, 0%, 45%)',
              fontSize: '14px',
              marginBottom: '20px',
            }}
          >
            Start with the reference implementation or integrate into your existing system.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCTAClick('github')}
              style={{
                padding: '12px 24px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'hsl(142, 71%, 45%)',
                color: 'hsl(0, 0%, 10%)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              View on GitHub
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCTAClick('community')}
              style={{
                padding: '12px 24px',
                borderRadius: '6px',
                border: '2px solid hsl(142, 71%, 45%)',
                backgroundColor: 'transparent',
                color: 'hsl(142, 71%, 65%)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Join Community
            </motion.button>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export default AdoptionSectionV2;
