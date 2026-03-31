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

const phases = [
  {
    phase: "OBSERVE",
    label: "Extract Signals",
    color: "text-state-act",
    borderColor: "border-state-act/30",
    description: "Gather raw evidence from the environment — logs, model output, telemetry, threat feeds. This is data collection, not interpretation.",
    kairosIntegration: [
      "Confidence score extraction from model output probabilities",
      "Source count and evidence field enumeration",
      "Contradiction signal detection between data sources",
      "Temporal alignment check across log timestamps",
    ],
    signal: "Confidence, Grounding, Temporal Alignment",
    question: "Do we have enough data to reason?",
  },
  {
    phase: "ORIENT",
    label: "Evaluate Signals",
    color: "text-state-escalate",
    borderColor: "border-state-escalate/30",
    description: "Generate hypotheses, reflect on reasoning quality, and detect epistemic failures. This is where understanding is built — or where it breaks down.",
    kairosIntegration: [
      "Dual-agent LLM hypothesis generation (untrusted, sanitized)",
      "Meta-reasoning reflection on hypothesis quality",
      "Epistemic failure engine — 8 named failure modes",
      "Structural diversity and agreement analysis",
    ],
    signal: "Contradiction, Confidence",
    question: "Is our reasoning trustworthy?",
  },
  {
    phase: "DECIDE",
    label: "Determine Decision State",
    color: "text-state-defer",
    borderColor: "border-state-defer/30",
    description: "Score uncertainty, evaluate policy rules, and determine the terminal decision state. This is the epistemic gate — where the system earns (or doesn't earn) the right to act.",
    kairosIntegration: [
      "4D uncertainty vector computation (disagreement, agreement, evidence, contradiction)",
      "Epistemic risk score calculation (threshold ≥ 0.60 → DEFER)",
      "8 ordered policy rules evaluated — first match wins",
      "Decision state assignment: ACT / ESCALATE / DEFER / FAIL_SAFE",
    ],
    signal: "All five signals",
    question: "Which state: ACT, ESCALATE, DEFER, or FAIL_SAFE?",
  },
  {
    phase: "ACT",
    label: "Execute or Gate",
    color: "text-state-fail-safe",
    borderColor: "border-state-fail-safe/30",
    description: "Execute the decision, hand to a human, wait for more context, or halt and alert. The action is determined by epistemic evidence, not model preference.",
    kairosIntegration: [
      "Autonomous execution (ACT) — all gates passed, confidence high",
      "Human escalation (ESCALATE) — partial confidence, human judgment needed",
      "Context gathering (DEFER) — insufficient information, retry with more data",
      "Safe halt (FAIL_SAFE) — epistemic breakdown, stop and alert",
    ],
    signal: "Reversibility",
    question: "Is autonomy earned for this action?",
  },
];

const signalPhaseMap = [
  { ooda: "OBSERVE", signal: "Confidence", how: "Model output probabilities, cross-agent scores", impact: "Can we evaluate?" },
  { ooda: "OBSERVE", signal: "Grounding", how: "Evidence field enumeration, source counts", impact: "Is there data to reason from?" },
  { ooda: "OBSERVE", signal: "Temporal Alignment", how: "Timestamp correlation, freshness scoring", impact: "Is the data current?" },
  { ooda: "ORIENT", signal: "Contradiction", how: "Antonym detection, structural divergence", impact: "Is the data trustworthy?" },
  { ooda: "ORIENT", signal: "Confidence", how: "Agreement scoring, meta-reasoning flags", impact: "Do the hypotheses hold up?" },
  { ooda: "DECIDE", signal: "All five", how: "Aggregate uncertainty vector", impact: "Which state? (ACT/ESCALATE/DEFER/FAIL_SAFE)" },
  { ooda: "ACT", signal: "Reversibility", how: "Action classification, impact assessment", impact: "Is autonomy allowed?" },
];

const OodaMapping = () => (
  <div>
    {/* Hero */}
    <section className="px-6 pt-24 pb-16 md:pt-32 md:pb-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6 text-foreground">
          OODA + Kairos Overlay
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          The OODA loop is the decision backbone. Kairos ECL integrates at every phase — injecting
          epistemic signals, failure detection, and policy gates where autonomous systems need them most.
        </p>
      </div>
    </section>

    {/* Pipeline Visual */}
    <section className="px-6 pb-16">
      <div className="max-w-4xl mx-auto">
        <div className="border border-border rounded-lg p-6 bg-secondary/20 font-mono text-sm">
          <div className="grid grid-cols-[auto_1fr_auto_1fr] gap-x-6 gap-y-1 items-start">
            <p className="text-muted-foreground font-semibold col-span-2">OODA Loop</p>
            <p className="text-muted-foreground font-semibold col-span-2">Kairos ECL Integration</p>

            <div className="col-span-4 border-t border-border my-2" />

            <p className="text-state-act font-medium">OBSERVE</p>
            <p className="text-muted-foreground">Detect, gather, correlate</p>
            <p className="text-state-act">→</p>
            <p>Extract signals (confidence, grounding, temporal)</p>

            <p className="text-state-escalate font-medium">ORIENT</p>
            <p className="text-muted-foreground">Assess context, understand risk</p>
            <p className="text-state-escalate">→</p>
            <p>Evaluate signals against decision criteria</p>

            <p className="text-state-defer font-medium">DECIDE</p>
            <p className="text-muted-foreground">Choose course of action</p>
            <p className="text-state-defer">←</p>
            <p>Determine state: <span className="text-state-act">ACT</span> / <span className="text-state-escalate">ESCALATE</span> / <span className="text-state-defer">DEFER</span> / <span className="text-state-fail-safe">FAIL_SAFE</span></p>

            <p className="text-state-fail-safe font-medium">ACT</p>
            <p className="text-muted-foreground">Execute or gate</p>
            <p className="text-state-fail-safe">←</p>
            <p>Execute, escalate, defer, or halt based on epistemic evidence</p>
          </div>
        </div>
      </div>
    </section>

    {/* Phase Deep Dives */}
    <section className="px-6 pb-16">
      <div className="max-w-4xl mx-auto space-y-6 animate-stagger">
        {phases.map((p) => (
          <div key={p.phase} className={`border rounded-lg p-6 card-hover ${p.borderColor}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className={`font-mono font-semibold text-lg ${p.color}`}>{p.phase}</span>
              <span className="text-muted-foreground">—</span>
              <span className="text-foreground font-medium">{p.label}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.description}</p>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Kairos integration</p>
                <ul className="space-y-1.5">
                  {p.kairosIntegration.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-muted-foreground/50 mt-0.5">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Signals active</p>
                  <p className="text-sm text-foreground">{p.signal}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Key question</p>
                  <p className="text-sm text-foreground italic">{p.question}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Signal × Phase Table */}
    <section className="px-6 pb-24">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Where Each Signal Fits</h2>
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>OODA Phase</TableHead>
                <TableHead>Signal</TableHead>
                <TableHead>How Observed</TableHead>
                <TableHead>Decision Impact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {signalPhaseMap.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="font-mono text-sm font-medium">{row.ooda}</TableCell>
                  <TableCell className="text-sm">{row.signal}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.how}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.impact}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-8 flex gap-6">
          <Link to="/framework/signal-reference" className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:gap-2 transition-all">
            Signal Reference <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link to="/framework/decision-states" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Decision States <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default OodaMapping;
