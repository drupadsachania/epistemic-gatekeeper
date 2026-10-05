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
  check: string;
  name: string;
  severity: "CRITICAL" | "NON-CRITICAL" | "—";
  override: string;
  oodaPhase: string;
  where: string;
  owasp: string;
  status: "Implemented" | "Specified v2";
  description: string;
};

const entries: MapEntry[] = [
  { check: "Failure screen", name: "FALSE_AGREEMENT", severity: "NON-CRITICAL", override: "DEFER", oodaPhase: "ORIENT", where: "epistemic_failure_engine.py", owasp: "LLM09", status: "Implemented",
    description: "Template reproduction masquerading as independent agreement." },
  { check: "Failure screen", name: "LOW_INFORMATION_HYPOTHESIS", severity: "NON-CRITICAL", override: "DEFER", oodaPhase: "ORIENT", where: "epistemic_failure_engine.py", owasp: "LLM09", status: "Implemented",
    description: "Fewer than two concrete entities; vague hedges." },
  { check: "Failure screen", name: "EVIDENCE_MISMATCH", severity: "NON-CRITICAL", override: "DEFER", oodaPhase: "DECIDE", where: "epistemic_failure_engine.py", owasp: "LLM09 · ASI06", status: "Implemented",
    description: "Asserts a correlation the evidence records as absent." },
  { check: "Failure screen", name: "MISSING_EVIDENCE", severity: "CRITICAL", override: "FAIL_SAFE", oodaPhase: "OBSERVE", where: "epistemic_failure_engine.py", owasp: "—", status: "Implemented",
    description: "Required evidence fields absent." },
  { check: "Failure screen", name: "CONTRADICTORY_HYPOTHESES", severity: "NON-CRITICAL", override: "ESCALATE", oodaPhase: "ORIENT", where: "epistemic_failure_engine.py", owasp: "ASI09", status: "Implemented",
    description: "Mutually exclusive readings no evidence can discriminate." },
  { check: "Failure screen", name: "OVERCONFIDENT_OUTPUT", severity: "NON-CRITICAL", override: "DEFER", oodaPhase: "ORIENT", where: "epistemic_failure_engine.py", owasp: "LLM09 · ASI09", status: "Implemented",
    description: "Certainty language without evidence to back it." },
  { check: "Failure screen", name: "SUPERFICIAL_REASONING", severity: "NON-CRITICAL", override: "DEFER", oodaPhase: "ORIENT", where: "meta_reasoning.py", owasp: "LLM09", status: "Implemented",
    description: "Classification labels instead of causal mechanisms." },
  { check: "Failure screen", name: "DEGENERATE_OUTPUT", severity: "CRITICAL", override: "FAIL_SAFE", oodaPhase: "ORIENT", where: "epistemic_failure_engine.py", owasp: "—", status: "Implemented",
    description: "Repetition collapse or byte-identical agents." },
  { check: "NCE", name: "NARRATIVE_ANCHORING", severity: "NON-CRITICAL", override: "DEFER", oodaPhase: "ORIENT", where: "KAIROS-005 §4.9", owasp: "ASI09", status: "Specified v2",
    description: "Fewer than k competing hypotheses, or none benign." },
  { check: "Gate 1", name: "STRUCTURALLY_INFEASIBLE", severity: "NON-CRITICAL", override: "INVALID → re-orient", oodaPhase: "DECIDE", where: "Structural Simulation Engine", owasp: "ASI08", status: "Specified v2",
    description: "Attack path impossible under topology, identity graph or policy." },
  { check: "Gate 2", name: "CALIBRATED_CONFIDENCE_LOW", severity: "—", override: "DEFER", oodaPhase: "DECIDE", where: "Calibration service · policy rule 9", owasp: "ASI09", status: "Specified v2",
    description: "ĉ(h) = g(s(h)) below the tier threshold τ_r." },
  { check: "Level 1", name: "ALEATORIC_UNCERTAINTY_RESIDUAL", severity: "—", override: "DEFER", oodaPhase: "DECIDE", where: "Uncertainty engine · rule 8", owasp: "—", status: "Specified v2",
    description: "Telemetry insufficient after the retrieval budget: request telemetry." },
  { check: "Gate 3", name: "TRAJECTORY_UNCERTAINTY_EXCEEDED", severity: "NON-CRITICAL", override: "ESCALATE", oodaPhase: "DECIDE", where: "Uncertainty engine (UProp / RUPA)", owasp: "ASI08 · ASI07", status: "Specified v2",
    description: "Inherited uncertainty across the investigation above κ_r." },
  { check: "Veto", name: "TAINTED_JUSTIFICATION", severity: "CRITICAL", override: "ESCALATE", oodaPhase: "DECIDE", where: "Taint tracker · rule 11", owasp: "ASI01 · ASI02 · ASI05 · LLM01", status: "Specified v2",
    description: "Untrusted provenance reaching an execution, egress or state-change sink." },
  { check: "Level 2", name: "CALIBRATION_UNCERTIFIED", severity: "NON-CRITICAL", override: "ESCALATE", oodaPhase: "DECIDE", where: "Calibration service · rule 12", owasp: "ASI09", status: "Specified v2",
    description: "No valid certificate for the deployment tuple; Tier ≥ 1 only." },
  { check: "Tiers", name: "TIER_2_DUAL_KEY", severity: "—", override: "ESCALATE", oodaPhase: "ACT", where: "Policy rule 14 · gate service", owasp: "ASI02", status: "Specified v2",
    description: "Isolation, account disablement, firewall block need two approvers." },
  { check: "Tiers", name: "TIER_3_HUMAN_ONLY", severity: "—", override: "ESCALATE", oodaPhase: "ACT", where: "Policy rule 13", owasp: "ASI02 · ASI10", status: "Specified v2",
    description: "Irreversible actions: the agent may prepare, never execute." },
  { check: "Heuristic", name: "HIGH_EPISTEMIC_RISK", severity: "—", override: "DEFER", oodaPhase: "DECIDE", where: "uncertainty_engine.py", owasp: "—", status: "Implemented",
    description: "Uncalibrated 4D composite ≥ 0.60; a backstop once Gate 2 exists." },
  { check: "Heuristic", name: "HIGH_RISK_ESCALATE", severity: "—", override: "ESCALATE", oodaPhase: "DECIDE", where: "decision_policy_engine.py", owasp: "—", status: "Implemented",
    description: "Deterministic risk score ≥ 0.60." },
];

const overrideColor = (o: string) =>
  o === "ACT" ? "text-state-act"
  : o.startsWith("ESCALATE") ? "text-state-escalate"
  : o.startsWith("DEFER") ? "text-state-defer"
  : o.startsWith("INVALID") ? "text-muted-foreground"
  : "text-state-fail-safe";

const severityBadge = (s: MapEntry["severity"]) =>
  s === "CRITICAL" ? "bg-state-fail-safe/20 text-state-fail-safe"
  : s === "NON-CRITICAL" ? "bg-state-escalate/20 text-state-escalate"
  : "text-muted-foreground";

const SignalFrameworkMap = () => {
  const [filter, setFilter] = useState("");
  const q = filter.toLowerCase();

  const filtered = entries.filter((e) =>
    [e.check, e.name, e.override, e.oodaPhase, e.where, e.owasp, e.status, e.description]
      .some((field) => field.toLowerCase().includes(q))
  );

  return (
    <div>
      {/* Hero */}
      <section className="px-6 pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6 text-foreground">
            Framework Cross-Reference
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Every gate, named failure and policy outcome in one table, with its OODA phase, where it lives,
            the OWASP risk it addresses, and whether the reference code implements it yet. Filter by any column.
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
              placeholder="Filter: gate 3, ESCALATE, ASI08, implemented, taint…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="border border-border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Check</TableHead>
                  <TableHead>Failure / Rule</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Override</TableHead>
                  <TableHead>Phase</TableHead>
                  <TableHead>OWASP</TableHead>
                  <TableHead>Where · status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((e) => (
                  <TableRow key={e.name}>
                    <TableCell className="font-medium text-sm whitespace-nowrap">{e.check}</TableCell>
                    <TableCell>
                      <div>
                        <code className="text-xs font-mono">{e.name}</code>
                        <p className="text-xs text-muted-foreground mt-0.5 max-w-xs">{e.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {e.severity === "—" ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${severityBadge(e.severity)}`}>
                          {e.severity}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className={`font-mono text-sm font-medium whitespace-nowrap ${overrideColor(e.override)}`}>
                      {e.override}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{e.oodaPhase}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{e.owasp}</TableCell>
                    <TableCell className="text-xs">
                      <p className="font-mono text-muted-foreground">{e.where}</p>
                      <p className={`font-mono mt-0.5 ${e.status === "Implemented" ? "text-state-act" : "text-primary"}`}>[{e.status}]</p>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">
                      No matches found.
                    </TableCell>
                  </TableRow>
                )}
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
};

export default SignalFrameworkMap;
