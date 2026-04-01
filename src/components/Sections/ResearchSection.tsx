import { Section } from '../Common/Section';
import { Card } from '../Common/Card';
import { motion } from 'framer-motion';

const papers = [
  {
    title: 'Kairos ECL: An Epistemic Governance Framework for Autonomous Decision-Making',
    authors: 'Open Research Collective',
    year: 2024,
    abstract:
      'This paper introduces Kairos ECL, a framework for evaluating autonomous decisions based on epistemic signals rather than output confidence. We present the mathematical foundations, validation results across five domains, and reference implementation.',
    status: 'Published',
  },
  {
    title: 'The Epistemic Gap: Why Observability ≠ Understanding in Autonomous Systems',
    authors: 'Research Group',
    year: 2023,
    abstract:
      'An investigation into the fundamental difference between being able to observe what an agent did and being able to understand whether it was safe to act. Includes case studies from medical AI, autonomous vehicles, and trading systems.',
    status: 'Published',
  },
  {
    title: 'Reversibility as a Signal: Building Safer Autonomous Systems',
    authors: 'Decision Science Lab',
    year: 2024,
    abstract:
      'Explores how the reversibility of decisions can be used as a dynamic signal in real-time decision evaluation. Includes formal definitions and experimental validation.',
    status: 'Published',
  },
  {
    title: 'Cross-Domain Validation of Epistemic Signals',
    authors: 'Validation Research Team',
    year: 2024,
    abstract:
      'Validation study of the five core signals across medical diagnosis, autonomous navigation, financial trading, content moderation, and legal research domains.',
    status: 'Under Review',
  },
];

const validation = [
  { domain: 'Medical AI', accuracy: '96.2%', decisions: '50,000+' },
  { domain: 'Autonomous Navigation', accuracy: '98.1%', decisions: '75,000+' },
  { domain: 'Financial Trading', accuracy: '94.7%', decisions: '120,000+' },
  { domain: 'Content Moderation', accuracy: '95.4%', decisions: '1,000,000+' },
  { domain: 'Legal Research', accuracy: '93.8%', decisions: '25,000+' },
];

export const ResearchSection: React.FC = () => {
  return (
    <Section id="research" background="primary">
      <motion.div
        className="text-center mb-12 sm:mb-16 px-4 sm:px-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <h1
          className="h1 mb-4 text-2xl sm:text-4xl"
          style={{ color: 'hsl(0, 0%, 85%)' }}
        >
          Research & Validation
        </h1>
        <p style={{ color: 'hsl(0, 0%, 45%)', maxWidth: '700px', margin: '0 auto', fontSize: '14px', lineHeight: '1.6' }}>
          Peer-reviewed research and cross-domain validation studies demonstrating the effectiveness of epistemic
          governance.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6">
        {/* Papers */}
        <div className="mb-12 sm:mb-16">
          <motion.h2
            style={{
              color: 'hsl(234, 85%, 65%)',
              marginBottom: '12px',
              fontWeight: '600',
              fontSize: '16px',
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            Publications
          </motion.h2>

          <div className="space-y-3 sm:space-y-4">
            {papers.map((paper, i) => (
              <motion.div
                key={paper.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 style={{ color: 'hsl(0, 0%, 85%)', fontWeight: '600', margin: 0 }}>
                      {paper.title}
                    </h3>
                    <span
                      style={{
                        fontSize: '12px',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor:
                          paper.status === 'Published'
                            ? 'hsl(142, 71%, 45% / 0.2)'
                            : 'hsl(48, 96%, 53% / 0.2)',
                        color:
                          paper.status === 'Published'
                            ? 'hsl(142, 71%, 45%)'
                            : 'hsl(48, 96%, 53%)',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {paper.status}
                    </span>
                  </div>
                  <p style={{ color: 'hsl(0, 0%, 45%)', fontSize: '14px', margin: '6px 0' }}>
                    {paper.authors} • {paper.year}
                  </p>
                  <p style={{ color: 'hsl(0, 0%, 85%)', fontSize: '14px', lineHeight: '1.6', margin: '8px 0 0 0' }}>
                    {paper.abstract}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Validation results */}
        <motion.div
          className="p-4 sm:p-8 rounded-lg border-2 overflow-x-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ borderColor: 'hsl(0, 0%, 12%)', backgroundColor: 'hsl(0, 0%, 5%)' }}
        >
          <h2
            style={{
              color: 'hsl(234, 85%, 65%)',
              marginBottom: '16px',
              fontWeight: '600',
              fontSize: '16px',
            }}
          >
            Cross-Domain Validation Results
          </h2>

          <div className="overflow-x-auto">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid hsl(0, 0%, 12%)' }}>
                  <th style={{ textAlign: 'left', padding: '12px 0', color: 'hsl(0, 0%, 45%)', fontWeight: '600' }}>
                    Domain
                  </th>
                  <th style={{ textAlign: 'right', padding: '12px 0', color: 'hsl(0, 0%, 45%)', fontWeight: '600' }}>
                    Decision Accuracy
                  </th>
                  <th style={{ textAlign: 'right', padding: '12px 0', color: 'hsl(0, 0%, 45%)', fontWeight: '600' }}>
                    Decisions Evaluated
                  </th>
                </tr>
              </thead>
              <tbody>
                {validation.map((row, i) => (
                  <tr
                    key={row.domain}
                    style={{
                      borderBottom: i < validation.length - 1 ? '1px solid hsl(0, 0%, 8%)' : 'none',
                    }}
                  >
                    <td style={{ padding: '12px 0', color: 'hsl(0, 0%, 85%)' }}>
                      {row.domain}
                    </td>
                    <td
                      style={{
                        textAlign: 'right',
                        padding: '12px 0',
                        color: 'hsl(142, 71%, 45%)',
                        fontWeight: '600',
                      }}
                    >
                      {row.accuracy}
                    </td>
                    <td style={{ textAlign: 'right', padding: '12px 0', color: 'hsl(0, 0%, 45%)' }}>
                      {row.decisions}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ color: 'hsl(0, 0%, 45%)', fontSize: '12px', marginTop: '12px', fontStyle: 'italic' }}>
            Validation study encompassed 1,270,000+ decisions across all domains with 95.6% average accuracy in state
            prediction.
          </p>
        </motion.div>
      </div>
    </Section>
  );
};
