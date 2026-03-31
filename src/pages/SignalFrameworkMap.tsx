import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type MapEntry = {
  signal: string;
  failureMode: string;
  severity: "CRITICAL" | "NON-CRITICAL";
  policyOverride: string;
  oodaPhase: string;
  module: string;
  description: string;
};

const entries: MapEntry[] = [
  {
    signal: "Confidence",
    failureMode: "OVERCONFIDENT_OUTPUT",
    severity: "NON-CRITICAL",
    policyOverride: "DEFER",
    oodaPhase: "ORIENT",
    module: "epistemic_failure_engine.py",
    description: "Certainty language without caveats — agent expresses absolute confidence without epistemic grounding.",
  },
  {
    signal: "Confidence",
    failureMode: "LOW_INFORMATION_HYPOTHESIS",
    severity: "NON-CRITICAL",
    policyOverride: "DEFER",
    oodaPhase: "ORIENT",
    module: "epistemic_failure_engine.py",
    description: "Vague hedge words dominate output — no specific or actionable claims.",
  },
  {
    signal: "Grounding",
    failureMode: "EVIDENCE_MISMATCH",
    severity: "NON-CRITICAL",
    policyOverride: "DEFER",
    oodaPhase: "DECIDE",
    module: "epistemic_failure_engine.py",
    description: "Hypotheses don't reference evidence fields — reasoning without data.",
  },
  {
    signal: "Grounding",
    failureMode: "MISSING_EVIDENCE",
    severity: "CRITICAL",
    policyOverride: "FAIL_SAFE",
    oodaPhase: "OBSERVE",
    module: "epistemic_failure_engine.py",
    description: "Required evidence fields absent — cannot ground any hypothesis.",
  },
  {
    signal: "Contradiction",
    failureMode: "CONTRADICTORY_HYPOTHESES",
    severity: "NON-CRITICAL",
    policyOverride: "DEFER",
    oodaPhase: "ORIENT",
    module: "epistemic_failure_engine.py",
    description: "Antonym pairs detected across agent outputs — opposing conclusions.",
  },
  {
    signal: "Contradiction",
    failureMode: "FALSE_AGREEMENT",
    severity: "NON-CRITICAL",
    policyOverride: "DEFER",
    oodaPhase: "ORIENT",
    module: "epistemic_failure_engine.py",
    description: "High lexical similarity masks lack of independent reasoning.",
  },
  {
    signal: "Confidence",
    failureMode: "DEGENERATE_OUTPUT",
    severity: "CRITICAL",
    policyOverride: "FAIL_SAFE",
    oodaPhase: "ORIENT",
    module: "epistemic_failure_engine.py",
    description: "Byte-identical outputs from both agents — zero independent reasoning.",
  },
  {
    signal: "Grounding",
    failureMode: "SUPERFICIAL_REASONING",
    severity: "NON-CRITICAL",
    policyOverride: "ESCALATE",
    oodaPhase: "ORIENT",
    module: "meta_reasoning.py",
    description: "Analysis lacks depth — alert type identified but no reasoning about cause or impact.",
  },
  {
    signal: "Confidence",
    failureMode: "HIGH_EPISTEMIC_RISK",
    severity: "NON-CRITICAL",
    policyOverride: "DEFER",
    oodaPhase: "DECIDE",
    module: "uncertainty_engine.py",
    description: "Composite epistemic risk score ≥ 0.60 — uncertainty too high to act.",
  },
  {
    signal: "Confidence",
    failureMode: "INSUFFICIENT_CONFIDENCE_FOR_ACT",
    severity: "NON-CRITICAL",
    policyOverride: "ESCALATE",
    oodaPhase: "DECIDE",
    module: "decision_policy_engine.py",
    description: "Confidence < 0.80 — not enough certainty for autonomous execution.",
  },
  {
    signal: "Reversibility",
    failureMode: "HIGH_RISK_ESCALATE",
    severity: "NON-CRITICAL",
    policyOverride: "ESCALATE",
    oodaPhase: "DECIDE",
    module: "decision_policy_engine.py",
    description: "Risk score ≥ 0.60 — action impact too high for autonomous handling.",
  },
];

const overrideColor = (o: string) =>
  o === "ACT" ? "text-state-act" : o === "ESCALATE" ? "text-state-escalate" : o === "DEFER" ? "text-state-defer" : "text-state-fail-safe";

const severityBadge = (s: "CRITICAL" | "NON-CRITICAL") =>
  s === "CRITICAL"
    ? "bg-state-fail-safe/20 text-state-fail-safe"
    : "bg-state-escalate/20 text-state-escalate";

const SignalFrameworkMap = () => {
  const [filter, setFilter] = useState("");

  const filtered = entries.filter(
    (e) =>
      e.signal.toLowerCase().includes(filter.toLowerCase()) ||
      e.failureMode.toLowerCase().includes(filter.toLowerCase()) ||
      e.policyOverride.toLowerCase().includes(filter.toLowerCase()) ||
      e.oodaPhase.toLowerCase().includes(filter.toLowerCase()) ||
      e.module.toLowerCase().includes(filter.toLowerCase()) ||
      e.description.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      {/* Hero */}
      <section className="px-6 pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6 text-foreground">
            Signal → Framework Map
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A cross-reference of every epistemic signal, failure mode, and policy outcome in the Kairos pipeline.
            Filter by signal, failure, OODA phase, or module.
          </p>
        </div>
      </section>

      {/* Filter + Table */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter by signal, failure mode, OODA phase, module..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="border border-border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Signal</TableHead>
                  <TableHead>Failure / Rule</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Override</TableHead>
                  <TableHead>OODA Phase</TableHead>
                  <TableHead>Module</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((e, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium text-sm">{e.signal}</TableCell>
                    <TableCell>
                      <div>
                        <code className="text-xs font-mono">{e.failureMode}</code>
                        <p className="text-xs text-muted-foreground mt-0.5 max-w-xs">{e.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${severityBadge(e.severity)}`}>
                        {e.severity}
                      </span>
                    </TableCell>
                    <TableCell className={`font-mono text-sm font-medium ${overrideColor(e.policyOverride)}`}>
                      {e.policyOverride}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{e.oodaPhase}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{e.module}</TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">
                      No matches found.
                    </TableCell>
                  </TableRow>
                )}
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
};

export default SignalFrameworkMap;
