import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const signals = [
  {
    name: "Confidence",
    definition: "How certain the system is in its assessment. Derived from model agreement, evidence quality, and meta-reasoning quality flags.",
    whyItMatters: "Without confidence measurement, agents act on hunches. Low confidence + autonomous action = preventable incidents.",
    howToObserve: "Model output probabilities, cross-agent agreement scores, semantic similarity between independent hypotheses.",
    decisionImpact: "< 0.40 → DEFER or FAIL_SAFE. 0.40–0.80 → ESCALATE. ≥ 0.80 → eligible for ACT.",
    example: "Malware hash matched with 99% confidence across 3 EDR sources → high confidence → ACT.",
  },
  {
    name: "Grounding",
    definition: "How well hypotheses are anchored in actual evidence. Measures the fraction of claims that reference concrete evidence fields.",
    whyItMatters: "Ungrounded reasoning is hallucination. An agent that reasons without referencing evidence is confabulating, not analyzing.",
    howToObserve: "Evidence-to-hypothesis mapping, field reference counts, evidence confidence scoring.",
    decisionImpact: "Low grounding triggers EVIDENCE_MISMATCH failure → DEFER.",
    example: "Hypothesis claims 'brute force attack' but references no failed login counts → evidence mismatch → DEFER.",
  },
  {
    name: "Contradiction",
    definition: "Degree of logical conflict between independent reasoning sources. Detected via antonym pairs, opposing claims, or incompatible conclusions.",
    whyItMatters: "Contradiction means at least one source is wrong. Acting on contradictory signals means acting on known uncertainty.",
    howToObserve: "Antonymous claim detection across agent outputs, contradiction scoring in the uncertainty vector.",
    decisionImpact: "High contradiction raises epistemic risk. CONTRADICTORY_HYPOTHESES failure → DEFER.",
    example: "Agent A: 'This is a targeted attack.' Agent B: 'This is routine scanning.' → contradiction detected → DEFER.",
  },
  {
    name: "Temporal Alignment",
    definition: "Whether the timing of signals is consistent with the claimed scenario. Checks for temporal coherence across evidence sources.",
    whyItMatters: "Stale data produces stale decisions. An agent acting on yesterday's context for today's threat is epistemically unsound.",
    howToObserve: "Timestamp correlation across log sources, temporal gap analysis, evidence freshness scoring.",
    decisionImpact: "Temporal misalignment reduces confidence and may trigger DEFER.",
    example: "Alert timestamp is 3 hours old but references 'active session' — temporal misalignment reduces confidence.",
  },
  {
    name: "Reversibility",
    definition: "Whether the proposed action can be undone. Classifies actions as reversible, partially reversible, or irreversible.",
    whyItMatters: "Irreversible actions demand higher certainty. Blocking an IP is reversible; deleting data is not.",
    howToObserve: "Action classification in the decision policy, impact assessment, rollback capability check.",
    decisionImpact: "Irreversible + moderate confidence → ESCALATE instead of ACT.",
    example: "Account suspension (irreversible for user) with 71% confidence → ESCALATE to SOC analyst.",
  },
];

const compositeFormula = `epistemic_risk = 0.30 × disagreement
               + 0.20 × (1 - agreement)
               + 0.25 × (1 - evidence_confidence)
               + 0.25 × contradiction
               + meta_penalty  (max 0.35)`;

const SignalReference = () => (
  <div>
    {/* Hero */}
    <section className="px-6 pt-24 pb-16 md:pt-32 md:pb-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6 text-foreground">
          Signal Reference
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Five epistemic signals drive every decision in the Kairos pipeline. Each captures a distinct
          dimension of reasoning quality that determines whether an agent has earned the right to act.
        </p>
      </div>
    </section>

    {/* Signal Cards */}
    <section className="px-6 pb-16">
      <div className="max-w-4xl mx-auto space-y-6">
        {signals.map((signal, idx) => (
          <div key={signal.name} className="border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono text-muted-foreground">{String(idx + 1).padStart(2, "0")}</span>
              <h3 className="text-lg font-semibold text-foreground">{signal.name}</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Definition</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{signal.definition}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Why it matters</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{signal.whyItMatters}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">How to observe</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{signal.howToObserve}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Decision impact</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{signal.decisionImpact}</p>
              </div>
            </div>

            <div className="mt-4 border-t border-border pt-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Example</p>
              <p className="text-sm text-muted-foreground italic">{signal.example}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Composite Formula */}
    <section className="px-6 pb-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Composite: Epistemic Risk Score</h2>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          The five signals combine into a single epistemic risk score via the 4D uncertainty vector.
          When epistemic risk ≥ 0.60, the system defers automatically.
        </p>
        <pre className="border border-border rounded-lg p-5 bg-secondary/20 font-mono text-sm text-muted-foreground overflow-x-auto">
          {compositeFormula}
        </pre>
      </div>
    </section>

    {/* Signal Summary Table */}
    <section className="px-6 pb-24">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Quick Reference</h2>
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Signal</TableHead>
                <TableHead>Measures</TableHead>
                <TableHead>Low → Decision</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Confidence</TableCell>
                <TableCell className="text-muted-foreground">Certainty in assessment</TableCell>
                <TableCell className="font-mono text-sm text-state-escalate">ESCALATE / DEFER</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Grounding</TableCell>
                <TableCell className="text-muted-foreground">Evidence anchoring</TableCell>
                <TableCell className="font-mono text-sm text-state-defer">DEFER</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Contradiction</TableCell>
                <TableCell className="text-muted-foreground">Logical conflict</TableCell>
                <TableCell className="font-mono text-sm text-state-defer">DEFER</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Temporal Alignment</TableCell>
                <TableCell className="text-muted-foreground">Timing coherence</TableCell>
                <TableCell className="font-mono text-sm text-state-defer">DEFER</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Reversibility</TableCell>
                <TableCell className="text-muted-foreground">Action undo-ability</TableCell>
                <TableCell className="font-mono text-sm text-state-escalate">ESCALATE</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="mt-8">
          <Link to="/framework/decision-states" className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:gap-2 transition-all">
            See how signals drive Decision States <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default SignalReference;
