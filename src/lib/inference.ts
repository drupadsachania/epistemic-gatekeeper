export interface Signal {
  confidence: number;
  grounding: {
    sources: number;
    alignment: number;
  };
  contradiction: number;
  temporal: number;
  reversibility: 'reversible' | 'non_reversible' | 'unknown';
}

export interface InferenceEvent {
  id: string;
  timestamp: Date;
  input: string;
  signals: Signal;
  decision: 'ACT' | 'ESCALATE' | 'DEFER' | 'FAIL_SAFE';
  reasoning: string;
}

// Simulate real signal extraction
function extractSignals(input: string): Signal {
  // Risk keywords increase contradiction/lower confidence
  const riskKeywords = [
    'delete', 'disable', 'remove', 'drop', 'purge',
    'all', 'forever', 'immediately', 'without'
  ];

  const hasRiskKeyword = riskKeywords.some(kw =>
    input.toLowerCase().includes(kw)
  );

  // Reversibility check
  let reversibility: 'reversible' | 'non_reversible' | 'unknown' = 'unknown';
  if (input.toLowerCase().includes('delete') ||
      input.toLowerCase().includes('remove') ||
      input.toLowerCase().includes('disable')) {
    reversibility = 'non_reversible';
  } else if (input.toLowerCase().includes('create') ||
             input.toLowerCase().includes('add')) {
    reversibility = 'reversible';
  }

  // Calculate signals
  const baseConfidence = 0.5 + Math.random() * 0.4;
  const confidence = hasRiskKeyword ?
    baseConfidence * 0.7 :
    baseConfidence;

  const groundingSources = Math.floor(Math.random() * 4) + 1;
  const alignment = 0.6 + Math.random() * 0.4;

  const contradiction = hasRiskKeyword ?
    0.3 + Math.random() * 0.5 :
    Math.random() * 0.3;

  return {
    confidence: Math.min(1, Math.max(0, confidence)),
    grounding: {
      sources: groundingSources,
      alignment: Math.min(1, alignment)
    },
    contradiction: Math.min(1, contradiction),
    temporal: 0.8 + Math.random() * 0.2,
    reversibility
  };
}

// Evaluate decision based on signals
function evaluateDecision(signals: Signal): 'ACT' | 'ESCALATE' | 'DEFER' | 'FAIL_SAFE' {
  // FAIL_SAFE: High contradiction
  if (signals.contradiction > 0.5) {
    return 'FAIL_SAFE';
  }

  // ACT: High confidence + good grounding
  if (signals.confidence > 0.85 &&
      signals.grounding.sources >= 2 &&
      signals.grounding.alignment > 0.75) {
    return 'ACT';
  }

  // DEFER: Low confidence
  if (signals.confidence < 0.5) {
    return 'DEFER';
  }

  // ESCALATE: Everything else (moderate confidence)
  return 'ESCALATE';
}

// Generate reasoning
function generateReasoning(signals: Signal, decision: string): string {
  const explanations: Record<string, string> = {
    'ACT': `High confidence (${(signals.confidence * 100).toFixed(0)}%) with strong grounding (${signals.grounding.sources} sources, ${(signals.grounding.alignment * 100).toFixed(0)}% aligned). Low contradiction (${(signals.contradiction * 100).toFixed(0)}%). Safe to execute autonomously.`,

    'ESCALATE': `Moderate confidence (${(signals.confidence * 100).toFixed(0)}%) with ${signals.grounding.sources} source(s). Contradiction level: ${(signals.contradiction * 100).toFixed(0)}%. Reversibility: ${signals.reversibility === 'reversible' ? 'Can undo' : 'CANNOT undo'}. Requires human judgment.`,

    'DEFER': `Low confidence (${(signals.confidence * 100).toFixed(0)}%). Only ${signals.grounding.sources} grounding source(s). Need more context before proceeding.`,

    'FAIL_SAFE': `CRITICAL: High signal contradiction (${(signals.contradiction * 100).toFixed(0)}%). Request conflicts with core policies. Blocking execution and escalating to security team.`
  };

  return explanations[decision];
}

// Run complete inference
export async function runInference(input: string): Promise<InferenceEvent> {
  const signals = extractSignals(input);
  const decision = evaluateDecision(signals);
  const reasoning = generateReasoning(signals, decision);

  return {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    input,
    signals,
    decision,
    reasoning
  };
}

// Format for display
export function formatInferenceForDisplay(event: InferenceEvent): string {
  return `Agent receives: "${event.input}"

Extracting signals from model...

  Confidence: ${(event.signals.confidence * 100).toFixed(0)}%
  Grounding: ${event.signals.grounding.sources} source(s), ${(event.signals.grounding.alignment * 100).toFixed(0)}% aligned
  Contradiction: ${(event.signals.contradiction * 100).toFixed(0)}%
  Temporal: ${(event.signals.temporal * 100).toFixed(0)}%
  Reversibility: ${event.signals.reversibility === 'reversible' ? 'CAN undo' : event.signals.reversibility === 'non_reversible' ? 'CANNOT undo' : 'Unknown'}

Evaluating decision criteria...

  ACT (high conf + grounded)? ${event.signals.confidence > 0.85 && event.signals.grounding.sources >= 2 ? 'YES ✓' : 'NO'}
  FAIL_SAFE (high contradiction)? ${event.signals.contradiction > 0.5 ? 'YES ✓' : 'NO'}
  DEFER (low confidence)? ${event.signals.confidence < 0.5 ? 'YES ✓' : 'NO'}
  ESCALATE (moderate)? ${event.decision === 'ESCALATE' ? 'YES ✓' : 'NO'}

DECISION: ${event.decision}

Reasoning: ${event.reasoning}

${event.decision === 'ACT' ? 'Action: Execute immediately' :
  event.decision === 'ESCALATE' ? 'Action: Send to human reviewer' :
  event.decision === 'DEFER' ? 'Action: Request clarification' :
  'Action: BLOCK and alert security'}`;
}
