import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const states = [
  {
    id: "act",
    name: "ACT",
    color: "bg-state-act",
    textColor: "text-state-act",
    borderColor: "border-state-act/30",
    when: "Every gate passed, the justification is untainted, and the action is Tier 0 or Tier 1. Tier 1 needs a valid calibration certificate.",
    example: "Watch-list a suspicious domain: ĉ = 0.91 ≥ τ₁, U_traj within bound, trusted justification. Executed through the tool gateway.",
    authority: "Signed capability token bound to action, target and hypothesis ID · single use · ≤ 5 min",
  },
  {
    id: "defer",
    name: "DEFER",
    color: "bg-state-defer",
    textColor: "text-state-defer",
    borderColor: "border-state-defer/30",
    when: "Evidence is insufficient. Gate 2 fails (ĉ < τ), aleatoric uncertainty persists after the retrieval budget, or no structurally feasible hypothesis survives re-orient.",
    example: "Admin login from an unusual geography. The models agree they don't know; the telemetry cannot separate travel from compromise.",
    authority: "Evidence-gap report: what is missing, where to get it, which hypothesis it discriminates",
  },
  {
    id: "escalate",
    name: "ESCALATE",
    color: "bg-state-escalate",
    textColor: "text-state-escalate",
    borderColor: "border-state-escalate/30",
    when: "The assessment is possible but autonomy is not earned: Gate 3 fails, the provenance veto fires, calibration is uncertified, hypotheses contradict, or the action is Tier 2–3.",
    example: "Isolate HOST-WS-042. Every gate passes, but isolation is Tier 2: it waits for dual-key approval, pre-filled with evidence and the trajectory trace.",
    authority: "Human review · Tier 2 dual-key approval · Tier 3 human executes",
  },
  {
    id: "fail-safe",
    name: "FAIL_SAFE",
    color: "bg-state-fail-safe",
    textColor: "text-state-fail-safe",
    borderColor: "border-state-fail-safe/30",
    when: "The system cannot trust its own reasoning: degenerate LLM output, missing required evidence fields, an invariant violation, or a forced fail.",
    example: "One agent loops (\"the the the …\", repetition ratio 0.64). No decision is trusted; LLM backend health check triggered.",
    authority: "All actions blocked · senior analyst and system admin review",
  },
];

const tiers = [
  { tier: 0, name: "Observe-only", examples: "Enrichment, read-only queries, ticket annotation", rev: "No state change", auth: "ACT" },
  { tier: 1, name: "Reversible, local", examples: "Tagging, watch-listing, sandbox detonation, single-session token revocation", rev: "Fully reversible, local", auth: "ACT with signed capability token" },
  { tier: 2, name: "Reversible, impactful", examples: "Host isolation, account disablement, firewall block", rev: "Reversible with business impact", auth: "ESCALATE — dual-key human approval with evidence and trajectory trace" },
  { tier: 3, name: "Irreversible", examples: "Mass credential reset, production deletion, external notification", rev: "Hard or impossible to reverse", auth: "Human-only — agent may prepare, never execute" },
];

const v2Rules = [
  { num: 1, rule: "FORCED_FAIL", condition: "force_fail = true", decision: "FAIL_SAFE", src: "v1" },
  { num: 2, rule: "CRITICAL_EPISTEMIC_FAILURE", condition: "DEGENERATE_OUTPUT or MISSING_EVIDENCE", decision: "FAIL_SAFE", src: "v1" },
  { num: 3, rule: "NO_FEASIBLE_HYPOTHESIS", condition: "Gate 1: nothing feasible after 2 re-orients", decision: "DEFER", src: "Gate 1" },
  { num: 4, rule: "NARRATIVE_ANCHORING", condition: "< k competing hypotheses, or no benign one", decision: "DEFER", src: "NCE" },
  { num: 5, rule: "HIGH_EPISTEMIC_RISK", condition: "heuristic epistemic_risk ≥ 0.60 (backstop)", decision: "DEFER", src: "v1" },
  { num: 6, rule: "LOW_EVIDENCE_CONFIDENCE", condition: "evidence_confidence < 0.40", decision: "DEFER", src: "v1" },
  { num: 7, rule: "EPISTEMIC_FAILURES_PRESENT", condition: "any non-critical failure → most restrictive declared override", decision: "DEFER / ESCALATE", src: "v1 (fixed 2.0.0)" },
  { num: 8, rule: "ALEATORIC_UNCERTAINTY_RESIDUAL", condition: "U_ale high after retrieval budget", decision: "DEFER", src: "Level 1" },
  { num: 9, rule: "CALIBRATED_CONFIDENCE_LOW", condition: "certificate valid and ĉ(h) < τ_r", decision: "DEFER", src: "Gate 2" },
  { num: 10, rule: "TRAJECTORY_UNCERTAINTY_EXCEEDED", condition: "U_traj > κ_r", decision: "ESCALATE", src: "Gate 3" },
  { num: 11, rule: "TAINTED_JUSTIFICATION", condition: "tainted justification reaches EXECUTION / EGRESS / STATE_CHANGE", decision: "ESCALATE", src: "Veto" },
  { num: 12, rule: "CALIBRATION_UNCERTIFIED", condition: "Tier ≥ 1 and no valid certificate", decision: "ESCALATE", src: "Level 2" },
  { num: 13, rule: "TIER_3_HUMAN_ONLY", condition: "r = 3", decision: "ESCALATE", src: "Tiers" },
  { num: 14, rule: "TIER_2_DUAL_KEY", condition: "r = 2", decision: "ESCALATE", src: "Tiers" },
  { num: 15, rule: "HIGH_RISK_ESCALATE", condition: "risk_score ≥ 0.60", decision: "ESCALATE", src: "v1" },
  { num: 16, rule: "ALL_GATES_PASSED", condition: "r ∈ {0, 1}, nothing above triggered", decision: "ACT", src: "—" },
];

const v1Rules = [
  { num: 1, rule: "FORCED_FAIL", condition: "force_fail = true", decision: "FAIL_SAFE" },
  { num: 2, rule: "CRITICAL_EPISTEMIC_FAILURE", condition: "DEGENERATE_OUTPUT or MISSING_EVIDENCE", decision: "FAIL_SAFE" },
  { num: 3, rule: "HIGH_EPISTEMIC_RISK", condition: "epistemic_risk ≥ 0.60", decision: "DEFER" },
  { num: 4, rule: "LOW_EVIDENCE_CONFIDENCE", condition: "evidence_confidence < 0.40", decision: "DEFER" },
  { num: 5, rule: "EPISTEMIC_FAILURES_PRESENT", condition: "any non-critical failure → most restrictive declared override", decision: "DEFER / ESCALATE" },
  { num: 6, rule: "HIGH_RISK_ESCALATE", condition: "risk_score ≥ 0.60", decision: "ESCALATE" },
  { num: 7, rule: "INSUFFICIENT_CONFIDENCE", condition: "confidence < 0.80 (uncalibrated)", decision: "ESCALATE" },
  { num: 8, rule: "ALL_GATES_PASSED", condition: "—", decision: "ACT" },
];

const decisionColor = (d: string) =>
  d === "ACT" ? "text-state-act"
  : d.startsWith("ESCALATE") ? "text-state-escalate"
  : d.startsWith("DEFER") ? "text-state-defer"
  : "text-state-fail-safe";

const stateMachine = `ALERT_RECEIVED
  └─► CONTEXT_RESOLVED            provenance labels + taint IDs
        └─► HYPOTHESIS_GENERATED  ◄────────────────┐
              └─► META_REASONING_COMPLETE          │ re-orient on INVALID
                    └─► EVIDENCE_TESTED  (Gate 1) ─┘ bounded: max 2
                          └─► UNCERTAINTY_SCORED     L1 + L3
                                └─► POLICY_EVALUATED (Gate 2, Gate 3, veto, tiers)
                                      ├─► EXECUTED     [terminal]
                                      ├─► DEFERRED     [terminal]
                                      ├─► ESCALATED    [terminal]
                                      ├─► REJECTED     [terminal]
                                      └─► FAILED_SAFE  [terminal]

Any processing state may exit early to FAILED_SAFE or DEFERRED.`;

const DecisionStates = () => (
  <div>
    {/* Hero */}
    <section className="px-6 pt-24 pb-16 md:pt-32 md:pb-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6 text-foreground">
          Decision States
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Outcomes are bounded: ACT, DEFER or ESCALATE, with FAIL_SAFE reserved for corruption of the
          system's own reasoning. Autonomy is bounded by the reversibility and blast radius of the
          action, not by confidence alone.
        </p>
      </div>
    </section>

    {/* State Grid */}
    <section className="px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {states.map((s) => (
            <div key={s.id} className={`border rounded-lg p-4 ${s.borderColor} hover:bg-secondary/10 transition-colors`}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-block w-2 h-2 rounded-full ${s.color}`} />
                <h3 className={`text-lg font-mono font-semibold ${s.textColor}`}>{s.name}</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-foreground/80 mb-1">When</p>
                  <p className="text-muted-foreground">{s.when}</p>
                </div>
                <div className="pt-2 border-t border-border/50">
                  <p className="font-medium text-foreground/80 mb-1">Example</p>
                  <p className="text-muted-foreground text-xs">{s.example}</p>
                </div>
                <div className="pt-2 border-t border-border/50">
                  <p className="text-xs font-mono text-muted-foreground/80">{s.authority}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="max-w-3xl mx-auto mt-6 border border-border border-dashed rounded-lg p-4 text-sm text-muted-foreground">
          <span className="font-mono font-semibold text-foreground/80 mr-2">INVALID</span>
          is a gate result, not a terminal state. When Gate 1 finds a hypothesis structurally impossible,
          it goes back to Orient with the contradiction annotated, as a negative constraint. Re-orient is
          bounded at two rounds; if nothing feasible remains, the outcome is DEFER.
        </div>
      </div>
    </section>

    {/* Risk tiers */}
    <section className="px-6 pb-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Action risk tiers</h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Passing every gate makes an action eligible for autonomy only up to its tier. Thresholds tighten
          with tier. Tier 3 is never autonomous, and any action without a tier assignment is treated as Tier 3.
          <span className="ml-2 font-mono text-xs text-state-escalate">[Specified v2]</span>
        </p>
        <div className="border border-border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Tier</TableHead>
                <TableHead>Examples (SOC)</TableHead>
                <TableHead>Reversibility</TableHead>
                <TableHead>If all gates pass</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tiers.map((t) => (
                <TableRow key={t.tier}>
                  <TableCell className="font-mono font-semibold">{t.tier}</TableCell>
                  <TableCell className="text-sm"><span className="text-foreground font-medium">{t.name}.</span> <span className="text-muted-foreground">{t.examples}</span></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{t.rev}</TableCell>
                  <TableCell className={`text-sm font-mono ${t.tier < 2 ? "text-state-act" : "text-state-escalate"}`}>{t.auth}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <div className="border border-border rounded-lg p-4">
            <p className="text-sm font-medium text-foreground mb-1">Dual-key approval (Tier 2)</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Two distinct authorised approvers, at least one the on-call incident commander. The screen shows
              calibrated confidence with its evidence gaps, every gate result, the trajectory trace, the taint
              record and the competing hypotheses. Approvals are signed and appended to the audit chain.
            </p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <p className="text-sm font-medium text-foreground mb-1">Overrides are deliberate, not impossible</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Humans keep final authority. Overriding a DEFER or a taint veto is permitted, but it is itself a
              dual-key decision with a written rationale. Exercising authority always leaves a record.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Policy Table */}
    <section className="px-6 pb-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Decision policy</h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Ordered rules, first match wins, and the rule order is the security policy. No LLM output reaches
          this layer. When several ESCALATE rules fire, all of them are listed for the approver, so a Tier 2
          action that is also taint-dependent shows both reasons.
        </p>
        <Tabs defaultValue="v2">
          <TabsList>
            <TabsTrigger value="v2">v2 spec · 16 rules</TabsTrigger>
            <TabsTrigger value="v1">Code · 8 rules</TabsTrigger>
          </TabsList>
          <TabsContent value="v2">
            <div className="border border-border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">#</TableHead>
                    <TableHead>Rule</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Decision</TableHead>
                    <TableHead className="hidden sm:table-cell">Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {v2Rules.map((r) => (
                    <TableRow key={r.num}>
                      <TableCell className="font-mono text-muted-foreground">{r.num}</TableCell>
                      <TableCell className="font-mono text-xs">{r.rule}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.condition}</TableCell>
                      <TableCell className={`font-mono text-sm font-medium whitespace-nowrap ${decisionColor(r.decision)}`}>{r.decision}</TableCell>
                      <TableCell className="hidden sm:table-cell text-xs font-mono text-muted-foreground">{r.src}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              The v1 uncalibrated rule <code className="font-mono">confidence &lt; 0.80 → ESCALATE</code> is retired once Gate 2 is enabled.
              Until a certificate exists it stays in force between rules 15 and 16. Thresholds τ_r are derived by
              conformal risk control on adjudicated incidents, not hand-set.
            </p>
          </TabsContent>
          <TabsContent value="v1">
            <div className="border border-border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">#</TableHead>
                    <TableHead>Rule</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Decision</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {v1Rules.map((r) => (
                    <TableRow key={r.num}>
                      <TableCell className="font-mono text-muted-foreground">{r.num}</TableCell>
                      <TableCell className="font-mono text-xs">{r.rule}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.condition}</TableCell>
                      <TableCell className={`font-mono text-sm font-medium whitespace-nowrap ${decisionColor(r.decision)}`}>{r.decision}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              <span className="font-mono text-state-act">[Implemented]</span> in <code className="font-mono">decision_policy_engine.py</code>, release 2.0.0.
              Since 2.0.0, rule 5 honours each failure's declared override, so CONTRADICTORY_HYPOTHESES alone now
              escalates (it deferred in 1.0.0). These thresholds are hand-set heuristics on uncalibrated scores:
              0.80 does not mean "80% likely correct".
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </section>

    {/* State machine */}
    <section className="px-6 pb-24">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-2">State machine</h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Twelve states, five terminal. v2 adds exactly one backward edge, the bounded re-orient, with its own
          invariant (RT-6). No state skipping, no transitions out of a terminal state, and every transition is
          logged with a sequence number on an append-only, hash-chained history.
        </p>
        <pre className="border border-border rounded-lg p-5 bg-secondary/20 font-mono text-xs sm:text-sm text-muted-foreground overflow-x-auto leading-relaxed">
          {stateMachine}
        </pre>
        <div className="mt-8 flex flex-wrap gap-6">
          <Link to="/kairos/gates" className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:gap-2 transition-all">
            Gates &amp; Uncertainty <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link to="/kairos/problem" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Threat model &amp; failure modes <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default DecisionStates;
