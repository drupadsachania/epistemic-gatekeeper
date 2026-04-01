/**
 * Development API Server for Kairos ECL
 * Provides mock endpoints for frontend development
 *
 * Run with: node server.js
 * Port: 3001
 * Base URL: http://localhost:3001/api
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Mock data
const mockValidationMetrics = [
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

const mockResearchPapers = [
  {
    id: 'paper-001',
    title: 'Reversibility as a Signal: Building Safer Autonomous Systems',
    authors: ['Chen, L.', 'Patel, M.', 'Okonkwo, A.'],
    year: 2024,
    abstract:
      'Explores how the reversibility of decisions can be used as a dynamic signal in real-time decision evaluation.',
    status: 'published',
    url: 'https://doi.org/example/paper-001',
  },
  {
    id: 'paper-002',
    title: 'Cross-Domain Validation of Epistemic Signals',
    authors: ['Validation Research Team'],
    year: 2024,
    abstract:
      'Validation study of the five core signals across multiple domains including medical, navigation, and finance.',
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
    abstract: 'Analysis of temporal alignment signal and its application to decisions where context changes over time.',
    status: 'under-review',
  },
];

const mockAdoptionSteps = [
  {
    id: 1,
    title: 'Understand the Framework',
    description: 'Learn the epistemic decision framework and five core signals',
    timeEstimate: '2.5 hours',
    tasks: [
      'Read the problem statement',
      'Study the five signals',
      'Review decision states',
      'Explore use cases',
    ],
  },
  {
    id: 2,
    title: 'Install Argus Reference',
    description: 'Set up the Kairos Argus epistemic gatekeeper',
    timeEstimate: '30 minutes',
    tasks: ['Clone the repository', 'Install dependencies', 'Run tests', 'Verify installation'],
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
    tasks: ['Set up logging', 'Configure alerts', 'Monitor signal quality', 'Iterate and improve'],
  },
];

// Store for analytics events
const analyticsStore = {
  events: [],
  activities: [],
};

// Helper: Add delay for realistic API response times
const withDelay = (fn) => async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 200));
  return fn(req, res);
};

// ============================================
// Health Check
// ============================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// Validation Metrics
// ============================================
app.get(
  '/api/metrics/validation',
  withDelay((req, res) => {
    res.json(mockValidationMetrics);
  })
);

// ============================================
// Research Papers
// ============================================
app.get(
  '/api/research/papers',
  withDelay((req, res) => {
    res.json(mockResearchPapers);
  })
);

// Get single paper
app.get(
  '/api/research/papers/:id',
  withDelay((req, res) => {
    const paper = mockResearchPapers.find((p) => p.id === req.params.id);
    if (paper) {
      res.json(paper);
    } else {
      res.status(404).json({ error: 'Paper not found' });
    }
  })
);

// ============================================
// Adoption Steps
// ============================================
app.get(
  '/api/adoption/steps',
  withDelay((req, res) => {
    res.json(mockAdoptionSteps);
  })
);

// ============================================
// Framework Decision States
// ============================================
app.get('/api/framework/states', (req, res) => {
  res.json({
    ACT: { emoji: '✓', color: 'hsl(142, 71%, 45%)', description: 'Execute autonomously' },
    ESCALATE: { emoji: '⚠', color: 'hsl(48, 96%, 53%)', description: 'Hand to human judgment' },
    DEFER: { emoji: '⏸', color: 'hsl(217, 91%, 60%)', description: 'Await more information' },
    FAIL_SAFE: { emoji: '🛑', color: 'hsl(0, 84%, 60%)', description: 'Stop and alert' },
  });
});

// ============================================
// Epistemic Signals
// ============================================
app.get('/api/signals/definitions', (req, res) => {
  res.json({
    confidence: {
      name: 'Confidence',
      formula: 'p(outcome | context)',
      meaning: 'How sure is the model about its prediction?',
    },
    grounding: {
      name: 'Grounding',
      formula: 'quality(evidence)',
      meaning: 'How well-anchored to reality is the decision?',
    },
    contradiction: {
      name: 'Contradiction',
      formula: 'δ(signals)',
      meaning: 'Do signals conflict with each other?',
    },
    temporal: {
      name: 'Temporal Alignment',
      formula: 'validity(decision | time)',
      meaning: 'Is the decision still valid?',
    },
    reversibility: {
      name: 'Reversibility',
      formula: 'cost(undo | action)',
      meaning: 'Can we undo this action if needed?',
    },
  });
});

// ============================================
// Analytics - Activity Tracking
// ============================================
app.post('/api/analytics/activity', (req, res) => {
  const activity = req.body;
  analyticsStore.activities.push({
    ...activity,
    receivedAt: new Date().toISOString(),
  });

  console.log(`  📊 Activity: ${activity.section} - ${activity.action}`);
  res.json({ success: true, id: analyticsStore.activities.length });
});

// ============================================
// Analytics - Event Tracking
// ============================================
app.post('/api/analytics/events', (req, res) => {
  const event = req.body;
  analyticsStore.events.push({
    ...event,
    receivedAt: new Date().toISOString(),
  });

  console.log(`  📈 Event: ${event.eventName}`);
  res.json({ success: true, id: analyticsStore.events.length });
});

// Get analytics summary
app.get('/api/analytics/summary', (req, res) => {
  res.json({
    totalEvents: analyticsStore.events.length,
    totalActivities: analyticsStore.activities.length,
    eventTypes: [...new Set(analyticsStore.events.map((e) => e.eventName))],
    sections: [...new Set(analyticsStore.activities.map((a) => a.section))],
    lastUpdated: new Date().toISOString(),
  });
});

// ============================================
// Error Handling
// ============================================
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// Start Server
// ============================================
app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   Kairos ECL API Server                ║');
  console.log('║   Development Mode                     ║');
  console.log('╚════════════════════════════════════════╝\n');
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
  console.log(`✅ Health Check: http://localhost:${PORT}/api/health\n`);
  console.log('Endpoints:');
  console.log('  GET    /api/health');
  console.log('  GET    /api/metrics/validation');
  console.log('  GET    /api/research/papers');
  console.log('  GET    /api/adoption/steps');
  console.log('  GET    /api/framework/states');
  console.log('  GET    /api/signals/definitions');
  console.log('  POST   /api/analytics/activity');
  console.log('  POST   /api/analytics/events');
  console.log('  GET    /api/analytics/summary\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Server shutting down...');
  process.exit(0);
});
