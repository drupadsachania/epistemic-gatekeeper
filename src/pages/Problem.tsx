import { Link } from "react-router-dom";
import { ArrowRight, AlertTriangle, Eye, Zap, ShieldAlert } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const failureModes = [
  {
    id: "false-agreement",
    name: "FALSE_AGREEMENT",
    severity: "NON-CRITICAL",
    description:
      "Both agents produce superficially identical hypotheses. Apparent confidence is an illusion — they reproduced the same template, not independent analysis.",
    override: "DEFER",
  },
  {
    id: "low-information",
    name: "LOW_INFORMATION_HYPOTHESIS",
    severity: "NON-CRITICAL",
    description:
      "Hypotheses dominated by vague hedge words with no specific claims. The output reads like an answer but contains no actionable information.",
    override: "DEFER",
  },
  {
    id: "evidence-mismatch",
    name: "EVIDENCE_MISMATCH",
    severity: "NON-CRITICAL",
    description:
      "Hypotheses don't reference evidence fields. The agent reasoned without looking at the data — a classic hallucination pattern.",
    override: "DEFER",
  },
  {
    id: "missing-evidence",
    name: "MISSING_EVIDENCE",
    severity: "CRITICAL",
    description:
      "Required evidence fields are absent. The agent cannot ground any hypothesis because the input data is incomplete.",
    override: "FAIL_SAFE",
  },
  {
    id: "contradictory",
    name: "CONTRADICTORY_HYPOTHESES",
    severity: "NON-CRITICAL",
    description:
      "Antonym pairs detected across agent outputs. Two independent reasoners reached opposing conclusions — the truth is unclear.",
    override: "DEFER",
  },
  {
    id: "overconfident",
    name: "OVERCONFIDENT_OUTPUT",
    severity: "NON-CRITICAL",
    description:
      "Certainty language without caveats. The agent expresses absolute confidence without epistemic grounding — a sign of confabulation.",
    override: "DEFER",
  },
  {
    id: "superficial",
    name: "SUPERFICIAL_REASONING",
    severity: "NON-CRITICAL",
    description:
      "Analysis lacks depth. The agent identified the alert type but didn't reason about cause, impact, or context.",
    override: "ESCALATE",
  },
  {
    id: "degenerate",
    name: "DEGENERATE_OUTPUT",
    severity: "CRITICAL",
    description:
      "Byte-identical outputs from both agents. This is not agreement — it's a system failure. Independent reasoning produced zero divergence.",
    override: "FAIL_SAFE",
  },
];

const Problem = () => (
  <div>
    {/* Hero */}
    <section className="px-6 pt-24 pb-16 md:pt-32 md:pb-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6 text-foreground">
          Why Observable Isn't Trustworthy
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Autonomous agents make high-stakes decisions every second. You have dashboards, logs, and alerts.
          But none of them answer the only question that matters: <span className="text-foreground font-medium">was it safe to act?</span>
        </p>
      </div>
    </section>

    {/* Section 1: The Gap */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Eye className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">The Gap</h2>
        </div>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Modern systems have enormous observability. Metrics, traces, structured logs — you can see
            <em> everything</em> an agent does. But observability measures <span className="text-foreground">what happened</span>,
            not <span className="text-foreground">whether it should have</span>.
          </p>
          <div className="border border-border rounded-lg p-5 bg-secondary/20 font-mono text-sm space-y-1">
            <p className="text-muted-foreground">// Typical agent loop</p>
            <p>1. Anomaly detected → <span className="text-foreground">confidence unknown</span></p>
            <p>2. Agent matches pattern → <span className="text-foreground">grounding unchecked</span></p>
            <p>3. Agent disables user account → <span className="text-foreground">irreversible</span></p>
            <p>4. Incident review: "Why did it do that?" → <span className="text-state-fail-safe">no answer</span></p>
          </div>
          <p>
            The gap isn't technical — it's epistemic. The agent had no way to assess whether its own
            reasoning was sound before acting.
          </p>
        </div>
      </div>
    </section>

    {/* Section 2: The OODA Problem */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">The OODA Loop Problem</h2>
        </div>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            The OODA loop (Observe → Orient → Decide → Act) is the dominant model for autonomous decision-making.
            But it was designed for humans, who naturally ask: <em>"Am I confident enough to act?"</em>
          </p>
          <p>
            LLM-based agents skip that question. They move from Orient to Act without evaluating whether
            their own reasoning is trustworthy. The <span className="text-foreground">Decide</span> phase
            collapses into pattern matching.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div className="border border-border rounded-lg p-4 card-hover">
              <p className="text-sm font-medium text-foreground mb-2">Human OODA</p>
              <p className="text-sm">Orient → "Do I understand this?" → Decide with judgment → Act or wait</p>
            </div>
            <div className="border border-state-fail-safe/30 border-l-4 rounded-lg p-4 card-hover">
              <p className="text-sm font-medium text-foreground mb-2">Agent OODA (no ECL)</p>
              <p className="text-sm">Orient → pattern match → Act immediately → hope it's right</p>
            </div>
          </div>
          <p>
            Kairos ECL inserts the missing epistemic check: five signals evaluated against decision criteria
            before any action is taken.
          </p>
        </div>
      </div>
    </section>

    {/* Section 3: Epistemic Failure Points */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">Epistemic Failure Modes</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed mb-6">
          The Kairos failure engine detects eight distinct ways LLM-generated reasoning can be epistemically
          unsound. Each triggers a mandatory policy override — no exceptions.
        </p>
        <Accordion type="multiple" className="space-y-2 animate-stagger">
          {failureModes.map((mode) => (
            <AccordionItem key={mode.id} value={mode.id} className={`border rounded-lg px-4 transition-all duration-300 hover:bg-secondary/20 ${
                      mode.severity === "CRITICAL"
                        ? "border-state-fail-safe/40 border-l-4"
                        : "border-border"
                    }`}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 text-left">
                  <code className="text-sm font-mono text-foreground">{mode.name}</code>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      mode.severity === "CRITICAL"
                        ? "bg-state-fail-safe/20 text-state-fail-safe"
                        : "bg-state-escalate/20 text-state-escalate"
                    }`}
                  >
                    {mode.severity}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{mode.description}</p>
                <p className="text-xs font-mono">
                  Policy override:{" "}
                  <span
                    className={
                      mode.override === "FAIL_SAFE"
                        ? "text-state-fail-safe"
                        : mode.override === "ESCALATE"
                        ? "text-state-escalate"
                        : "text-state-defer"
                    }
                  >
                    {mode.override}
                  </span>
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>

    {/* Section 4: The Cost */}
    <section className="px-6 pb-24">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <ShieldAlert className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">The Cost of Getting It Wrong</h2>
        </div>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <div className="grid sm:grid-cols-3 gap-4 animate-stagger">
            <div className="border border-border rounded-lg p-4 card-hover">
              <p className="text-sm font-medium text-foreground mb-2">Security Incidents</p>
              <p className="text-sm">Autonomous over-confidence leads to false positives that disrupt operations, or false negatives that miss real threats.</p>
            </div>
            <div className="border border-border rounded-lg p-4 card-hover">
              <p className="text-sm font-medium text-foreground mb-2">Compliance Gaps</p>
              <p className="text-sm">SOC 2 and ISO 42001 require demonstrable decision accountability. "The AI decided" is not an audit trail.</p>
            </div>
            <div className="border border-border rounded-lg p-4 card-hover">
              <p className="text-sm font-medium text-foreground mb-2">Operational Drift</p>
              <p className="text-sm">When agents act without epistemic grounding, humans stop trusting them — and start ignoring alerts entirely.</p>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <Link
            to="/framework"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            See how Kairos ECL solves this <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default Problem;
