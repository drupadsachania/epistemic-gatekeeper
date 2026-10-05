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

type Item = { text: string; v2?: boolean };

const phases: Array<{
  phase: string; label: string; color: string; borderColor: string;
  description: string; controls: Item[]; rule: string; question: string;
}> = [
  {
    phase: "OBSERVE",
    label: "Zero-trust ingestion",
    color: "text-state-act",
    borderColor: "border-state-act/30",
    description: "Ingest alerts, SIEM logs, CTI and tool output, and label the provenance of every datum. Most log payloads are attacker-influenceable.",
    controls: [
      { text: "Provenance label on every datum: TRUSTED or UNTRUSTED (unlabelled = untrusted)", v2: true },
      { text: "Taint IDs propagate through retrieval, summarisation and hypothesis generation", v2: true },
      { text: "Semantic firewall flags instruction-like content — a detector, not a boundary" },
      { text: "Context resolution from SIEM, EDR, IAM, CTI and CMDB into an evidence object" },
    ],
    rule: "Ingested content is data, never instructions.",
    question: "What do we know, and which of it could an attacker have written?",
  },
  {
    phase: "ORIENT",
    label: "Constrained hypothesis generation",
    color: "text-state-escalate",
    borderColor: "border-state-escalate/30",
    description: "The LLM sees untrusted input but holds no tool authority and cannot communicate externally, so it satisfies the Rule of Two by construction.",
    controls: [
      { text: "Narrative Counterfactual Engine: ≥ k competing ATT&CK-grounded hypotheses, ≥ 1 benign", v2: true },
      { text: "CRAG evaluator scores retrieved evidence before generation; FLARE retrieves when U_epi is high", v2: true },
      { text: "Structured hypothesis objects with evidence links, missing evidence, taint record and proposed tier", v2: true },
      { text: "Output validation (8 structural gates) and meta-reasoning reflection" },
    ],
    rule: "LLM output never flows into decision logic.",
    question: "What else could explain this, including something benign?",
  },
  {
    phase: "DECIDE",
    label: "Triple epistemic gate",
    color: "text-state-defer",
    borderColor: "border-state-defer/30",
    description: "Deterministic code evaluates each candidate hypothesis and its proposed action. A failure routes to INVALID, DEFER or ESCALATE.",
    controls: [
      { text: "Gate 1 · structural feasibility against topology and identity graphs → INVALID, back to Orient", v2: true },
      { text: "Gate 2 · calibrated confidence ĉ(h) ≥ τ_r using a certified map → else DEFER", v2: true },
      { text: "Gate 3 · trajectory uncertainty U_traj ≤ κ_r → else ESCALATE", v2: true },
      { text: "Provenance veto · tainted justification at a sink → ESCALATE regardless of confidence", v2: true },
      { text: "Named failure screen and ordered policy rules, first match wins" },
    ],
    rule: "Gates are independent; no compensatory scoring.",
    question: "Has the system earned the right to act on this?",
  },
  {
    phase: "ACT",
    label: "Bounded, risk-tiered outcomes",
    color: "text-state-fail-safe",
    borderColor: "border-state-fail-safe/30",
    description: "Outcomes are limited to ACT, DEFER and ESCALATE. Autonomy is bounded by reversibility and blast radius, not by confidence.",
    controls: [
      { text: "Tier 0–1 ACT through the tool gateway with a signed, single-use capability token", v2: true },
      { text: "Tier 2 dual-key approval · Tier 3 human-only", v2: true },
      { text: "DEFER carries an evidence-gap report: retrieval request or telemetry request" },
      { text: "Hash-chained audit record of inputs, hypotheses, scores, gates and approvals", v2: true },
    ],
    rule: "The LLM never holds a token.",
    question: "Is this action within the tier the evidence allows?",
  },
];

const controlMap = [
  { ooda: "OBSERVE", control: "Provenance + taint tracking", output: "Evidence object, per-datum labels", status: "v2" },
  { ooda: "OBSERVE", control: "Semantic firewall (17-pattern detector)", output: "Flags, never decisions", status: "v1" },
  { ooda: "ORIENT", control: "NCE competing hypotheses", output: "≥ k structured hypotheses", status: "v2" },
  { ooda: "ORIENT", control: "CRAG / FLARE retrieval", output: "Scored, provenance-kept evidence", status: "v2" },
  { ooda: "DECIDE", control: "Gate 1 SSE", output: "PASS or INVALID → re-orient", status: "v2" },
  { ooda: "DECIDE", control: "Level 1 + 3 uncertainty", output: "U_tot, U_ale, U_epi, U_traj", status: "v2" },
  { ooda: "DECIDE", control: "Gates 2–3, veto, tier routing", output: "ACT / DEFER / ESCALATE", status: "v2" },
  { ooda: "DECIDE", control: "4D heuristic vector + 8 rules", output: "Backstop decision", status: "v1" },
  { ooda: "ACT", control: "Gate service + tool gateway", output: "Capability token, execution", status: "v2" },
  { ooda: "ACT", control: "Audit", output: "SHA-256 log hash → hash chain", status: "v1 / v2" },
  { ooda: "FEEDBACK", control: "Calibration service", output: "Recalibrate g, τ_r, κ_r; revoke on drift", status: "v2" },
];

const OodaMapping = () => (
  <div>
    {/* Hero */}
    <section className="px-6 pt-24 pb-16 md:pt-32 md:pb-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6 text-foreground">
          The Epistemic Control Loop
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Kairos puts Boyd's Observe–Orient–Decide–Act loop into operation with a measurable epistemic control in
          every phase. Outcomes from closed incidents feed back into calibration.
        </p>
      </div>
    </section>

    {/* Pipeline visual */}
    <section className="px-6 pb-16">
      <div className="max-w-4xl mx-auto">
        <div className="border border-border rounded-lg p-6 bg-secondary/20 font-mono text-sm overflow-x-auto">
          <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 items-start min-w-[520px]">
            <p className="text-state-act font-medium">OBSERVE</p>
            <p>Zero-trust ingestion · provenance labels · taint IDs</p>
            <p className="text-state-escalate font-medium">ORIENT</p>
            <p>≥ k competing hypotheses (≥ 1 benign) · CRAG / FLARE · no tool authority</p>
            <p className="text-muted-foreground/60">──────</p>
            <p className="text-muted-foreground/60">─ ─ trust boundary: structured hypotheses only ─ ─</p>
            <p className="text-state-defer font-medium">DECIDE</p>
            <p>G1 structural → G2 calibrated → G3 trajectory → provenance veto</p>
            <p className="text-state-fail-safe font-medium">ACT</p>
            <p>
              <span className="text-state-act">ACT</span> tier 0–1 + token · <span className="text-state-defer">DEFER</span> evidence gap ·{" "}
              <span className="text-state-escalate">ESCALATE</span> dual-key / human
            </p>
            <p className="text-muted-foreground">↺</p>
            <p className="text-muted-foreground">closed-incident outcomes → recalibrate g, τ_r, κ_r · drift monitoring</p>
          </div>
        </div>
      </div>
    </section>

    {/* Phase deep dives */}
    <section className="px-6 pb-16">
      <div className="max-w-4xl mx-auto space-y-6 animate-stagger">
        {phases.map((p) => (
          <div key={p.phase} className={`border rounded-lg p-6 card-hover ${p.borderColor}`}>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4">
              <span className={`font-mono font-semibold text-lg ${p.color}`}>{p.phase}</span>
              <span className="text-muted-foreground">—</span>
              <span className="text-foreground font-medium">{p.label}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.description}</p>
            <div className="grid md:grid-cols-[3fr_2fr] gap-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Controls</p>
                <ul className="space-y-1.5">
                  {p.controls.map((item) => (
                    <li key={item.text} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-muted-foreground/50 mt-0.5">•</span>
                      <span>
                        {item.text}
                        {item.v2 && <span className="ml-2 text-[10px] font-mono text-primary/80">v2</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Rule</p>
                  <p className="text-sm text-foreground">{p.rule}</p>
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

    {/* Control map */}
    <section className="px-6 pb-24">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Where each control sits</h2>
        <p className="text-sm text-muted-foreground mb-6">
          <span className="font-mono text-xs">v1</span> = in the reference code (release 2.0.0).{" "}
          <span className="font-mono text-xs text-primary">v2</span> = specified by the paper, not yet implemented.
        </p>
        <div className="border border-border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phase</TableHead>
                <TableHead>Control</TableHead>
                <TableHead>Produces</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {controlMap.map((row) => (
                <TableRow key={row.control}>
                  <TableCell className="font-mono text-xs font-medium">{row.ooda}</TableCell>
                  <TableCell className="text-sm">{row.control}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.output}</TableCell>
                  <TableCell className={`font-mono text-xs ${row.status === "v2" ? "text-primary" : "text-muted-foreground"}`}>{row.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-8 flex flex-wrap gap-6">
          <Link to="/kairos/gates" className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:gap-2 transition-all">
            Gates &amp; Uncertainty <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link to="/kairos/decision-states" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Decision States <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default OodaMapping;
