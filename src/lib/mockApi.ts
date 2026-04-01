/**
 * Mock API Server for Development
 * Provides realistic test data without requiring a backend
 * Can be swapped with real API by changing API_BASE_URL
 */

import { ValidationMetric, ResearchPaper, AdoptionStep } from './api';

// Mock validation metrics data
export const mockValidationMetrics: ValidationMetric[] = [
  {
    domain: 'Medical AI',
    accuracy: 96.2,
    decisionCount: 245000,
    status: 'completed',
  },
  {
    domain: 'Autonomous Navigation',
    accuracy: 94.8,
    decisionCount: 380000,
    status: 'active',
  },
  {
    domain: 'Financial Trading',
    accuracy: 95.1,
    decisionCount: 320000,
    status: 'active',
  },
  {
    domain: 'Content Moderation',
    accuracy: 93.7,
    decisionCount: 185000,
    status: 'active',
  },
  {
    domain: 'Legal Research',
    accuracy: 96.9,
    decisionCount: 140000,
    status: 'completed',
  },
];

// Mock research papers
export const mockResearchPapers: ResearchPaper[] = [
  {
    id: 'paper-001',
    title: 'Reversibility as a Signal: Building Safer Autonomous Systems',
    authors: ['Chen, L.', 'Patel, M.', 'Okonkwo, A.'],
    year: 2024,
    abstract:
      'Explores how the reversibility of decisions can be used as a dynamic signal in real-time decision evaluation. Includes formal definitions and experimental validation.',
    status: 'published',
    url: 'https://doi.org/example/paper-001',
  },
  {
    id: 'paper-002',
    title: 'Cross-Domain Validation of Epistemic Signals',
    authors: ['Validation Research Team'],
    year: 2024,
    abstract:
      'Validation study of the five core signals across medical diagnosis, autonomous navigation, financial trading, content moderation, and legal research domains.',
    status: 'under-review',
  },
  {
    id: 'paper-003',
    title: 'Epistemic Governance Frameworks for Autonomous Systems',
    authors: ['Kairos Team'],
    year: 2023,
    abstract:
      'Foundational work on epistemic governance as an approach to managing decision uncertainty in autonomous systems.',
    status: 'published',
    url: 'https://doi.org/example/paper-003',
  },
  {
    id: 'paper-004',
    title: 'Temporal Alignment in Autonomous Decision Making',
    authors: ['Time Series Research Group'],
    year: 2024,
    abstract:
      'Analysis of temporal alignment signal and its application to decisions where context changes over time.',
    status: 'under-review',
  },
];

// Mock adoption steps
export const mockAdoptionSteps: AdoptionStep[] = [
  {
    id: 1,
    title: 'Understand the Framework',
    description: 'Learn the epistemic decision framework and five core signals',
    timeEstimate: '2.5 hours',
    tasks: [
      'Read the problem statement',
      'Study the five signals (confidence, grounding, contradiction, temporal, reversibility)',
      'Review decision states (ACT, ESCALATE, DEFER, FAIL_SAFE)',
      'Explore use cases',
    ],
  },
  {
    id: 2,
    title: 'Install Argus Reference',
    description: 'Set up the Kairos Argus epistemic gatekeeper',
    timeEstimate: '30 minutes',
    tasks: [
      'Clone the repository',
      'Install dependencies',
      'Run tests',
      'Verify installation',
    ],
  },
  {
    id: 3,
    title: 'Build Your First Gate',
    description: 'Implement an epistemic gate in your autonomous system',
    timeEstimate: '1-2 days',
    tasks: [
      'Define signal evaluators',
      'Implement decision logic',
      'Integrate with your system',
      'Test end-to-end',
    ],
  },
  {
    id: 4,
    title: 'Deploy & Monitor',
    description: 'Deploy to production and monitor decision quality',
    timeEstimate: 'Ongoing',
    tasks: [
      'Set up logging',
      'Configure alerts',
      'Monitor signal quality',
      'Iterate and improve',
    ],
  },
];

// Mock decision states
export const mockDecisionStates = {
  ACT: {
    label: 'ACT',
    emoji: '✓',
    color: 'hsl(142, 71%, 45%)',
    description: 'Execute autonomously',
    details: 'When confidence and grounding signals align strongly. The agent has sufficient epistemic warrant for action.',
    when: 'Confidence >70% • Grounding >70% • No contradictions',
  },
  ESCALATE: {
    label: 'ESCALATE',
    emoji: '⚠',
    color: 'hsl(48, 96%, 53%)',
    description: 'Hand to human judgment',
    details: 'When signals conflict or confidence is insufficient. The decision requires human epistemic oversight.',
    when: 'Confidence <70% • Temporal misalignment • Mixed signals',
  },
  DEFER: {
    label: 'DEFER',
    emoji: '⏸',
    color: 'hsl(217, 91%, 60%)',
    description: 'Await more information',
    details: 'When action is reversible and context is incomplete. The agent should gather more epistemic warrant.',
    when: 'Reversible action • Incomplete context • Time available',
  },
  FAIL_SAFE: {
    label: 'FAIL_SAFE',
    emoji: '🛑',
    color: 'hsl(0, 84%, 60%)',
    description: 'Stop and alert',
    details: 'When contradictory signals emerge or decision space becomes uncertain. The system enters safe shutdown mode.',
    when: 'Contradiction >30% • Critical system • Ambiguity detected',
  },
};

// Mock epistemic signals
export const mockSignalsDefinition = {
  confidence: {
    name: 'Confidence',
    formula: 'p(outcome | context)',
    meaning: 'How sure is the model about its prediction?',
    range: '0-100%',
    description:
      'The probability that the model assigns to its chosen action being correct given the current context.',
  },
  grounding: {
    name: 'Grounding',
    formula: 'quality(evidence)',
    meaning: 'How well-anchored to reality is the decision?',
    range: '0-100%',
    description:
      'The degree to which the decision is supported by observable evidence and validated against real-world outcomes.',
  },
  contradiction: {
    name: 'Contradiction',
    formula: 'δ(signals)',
    meaning: 'Do signals conflict with each other?',
    range: '0-100%',
    description:
      'The presence of conflicting signals that suggest the decision space may not be well-understood.',
  },
  temporal: {
    name: 'Temporal Alignment',
    formula: 'validity(decision | time)',
    meaning: 'Is the decision still valid in the current context?',
    range: '0-100%',
    description:
      'Whether the decision remains valid given changes in the environment since the decision was made.',
  },
  reversibility: {
    name: 'Reversibility',
    formula: 'cost(undo | action)',
    meaning: 'Can we undo this action if needed?',
    range: 'boolean or cost',
    description:
      'Whether the consequences of the decision can be reversed or mitigated if it turns out to be wrong.',
  },
};

// Simulate API delay (remove in production)
const MOCK_DELAY_MS = 300;

export function delay(ms: number = MOCK_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Setup mock API
 * In a real application, this would be replaced with actual API calls
 */
export async function setupMockApi() {
  // Only setup mock API in development
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  // Create mock service worker setup here if needed
  // This could integrate with MSW (Mock Service Worker) in the future
  console.log('✅ Mock API ready (development mode)');
}
