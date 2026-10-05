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

const gates = [
  {
    id: "G1",
    name: "Structural feasibility",
    question: "Is it structurally possible?",
    how: "The Structural Simulation Engine checks the hypothesised attack path against the topology graph, the identity and privilege graph, and policy constraints.",
    fails: "INVALID → back to Orient with the contradiction annotated",
    blind: "Cannot detect hypotheses that are feasible but false.",
    example: "Lateral movement into air-gapped segment SEG-OT-07, using a domain account with no logon rights on OT hosts.",
    outcomeColor: "text-muted-foreground",
  },
  {
    id: "G2",
    name: "Calibrated confidence",
    question: "Is it calibrated-confident?",
    how: "A raw score s(h) passes through a calibration map g certified at population level: ĉ(h) = g(s(h)). Pass if ĉ(h) ≥ τ_r for the action's tier.",
    fails: "DEFER with an evidence-gap report",
    blind: "Cannot see contamination inherited from earlier steps.",
    example: "Calibrated confidence 0.71 against a Tier 1 threshold of 0.85: defer and request the EDR lineage that would discriminate.",
    outcomeColor: "text-state-defer",
  },
  {
    id: "G3",
    name: "Trajectory uncertainty",
    question: "Did errors creep in upstream?",
    how: "Uncertainty is propagated across the whole investigation (UProp for sequences, RUPA for branching sub-agents). Pass if U_traj ≤ κ_r.",
    fails: "ESCALATE with the trajectory trace",
    blind: "Cannot see provenance.",
    example: "A 40%-sampled DNS log fed a 'confirmed beaconing' summary. Each step looked fine; the conclusion did not.",
    outcomeColor: "text-state-escalate",
  },
  {
    id: "VETO",
    name: "Provenance veto",
    question: "Is the justification untrusted?",
    how: "If the justification depends on untrusted, tainted inputs and the action reaches an execution, egress or state-changing sink, the outcome is fixed.",
    fails: "ESCALATE regardless of confidence",
    blind: "Not overridden by any confidence score, by design.",
    example: "An email body tells 'the security assistant' to allow-list a sender. Whatever the model concludes, that action needs a human.",
    outcomeColor: "text-state-escalate",
  },
];

const sinks = [
  { sink: "READ_ONLY", def: "Queries and enrichment with no side effects", rule: "Tainted justification permitted" },
  { sink: "EXECUTION", def: "Shell, script, query execution, code evaluation", rule: "Tainted → ESCALATE" },
  { sink: "EGRESS", def: "Any external communication, including rendering links or images, webhooks and email", rule: "Tainted → ESCALATE" },
  { sink: "STATE_CHANGE", def: "Modifies identity, network, endpoint or data state", rule: "Tainted → ESCALATE" },
];

const level1 = `H[ p̄(c | x) ]  =  (1/K) Σ_k H[ p_k(c | x) ]  +  I(c ; k | x)
     U_tot      =            U_ale             +     U_epi

K scale-matched models × S samples, clustered by bidirectional
entailment into meaning classes c (semantic entropy).`;

const level2 = `ECE = Σ_m (|B_m| / n) · | acc(B_m) − conf(B_m) |   ≤  ε_cal
BS  = (1/n) Σ_i ( ĉ_i − y_i )²                       tracked alongside

Equal-mass bins, bootstrap CIs. ε_cal = 0.15 is an illustrative default.`;

const level3 = `U_t = U_t^int + U_t^ext

U_int  intrinsic uncertainty of step t (as in Level 1)
U_ext  inherited from earlier steps: mutual information
       between the current decision and the trajectory`;

const explanation = `Hypothesis H2 (T1021.002 SMB lateral movement WS-042 → FS-01)
  Calibrated confidence: 0.71  (Tier 1 threshold τ₁ = 0.85)  → DEFER
  Calibration: certificate CAL-2026-10-01, ECE 0.06 [0.04, 0.09], n = 1,240
  Uncertainty: U_tot 0.52 | U_epi 0.08 (models agree) | U_ale 0.44 (telemetry insufficient)
  Trajectory:  U_traj 0.31 (κ₁ = 0.40) — PASS
  Provenance:  depends on 2 untrusted inputs (T-17 SMB share name, T-19 ticket text)
  Missing evidence that would discriminate H2 from H4 (benign backup job):
    - EDR process lineage on FS-01, 02:00–02:20 UTC   [source: EDR API]
    - Backup scheduler run log for job BK-FS01         [source: backup server]`;

const v1Formula = `epistemic_risk = 0.30 × disagreement
               + 0.20 × (1 − agreement)
               + 0.25 × (1 − evidence_confidence)
               + 0.25 × contradiction
               + meta_penalty  (max 0.35)          ≥ 0.60 → DEFER`;

const Gates = () => (
  <div>
    {/* Hero */}
    <section className="px-6 pt-24 pb-16 md:pt-32 md:pb-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6 text-foreground">
          Gates &amp; Uncertainty
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Every hypothesis meets the same four checks, in deterministic code outside the LLM. No AI-generated
          hypothesis reaches Act without passing structural validation, a calibrated-confidence threshold,
          a trajectory-uncertainty threshold and a provenance check.
        </p>
      </div>
    </section>

    {/* Gate cards */}
    <section className="px-6 pb-12">
      <div className="max-w-4xl mx-auto space-y-4">
        {gates.map((g) => (
          <div key={g.id} className="border border-border rounded-lg p-6">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-4">
              <span className="text-xs font-mono font-semibold text-primary">{g.id}</span>
              <h3 className="text-lg font-semibold text-foreground">{g.question}</h3>
              <span className="text-xs font-mono text-muted-foreground">{g.name}</span>
            </div>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">How</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{g.how}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">On failure</p>
                <p className={`text-sm font-mono ${g.outcomeColor}`}>{g.fails}</p>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 mt-3">Blind spot</p>
                <p className="text-sm text-muted-foreground">{g.blind}</p>
              </div>
            </div>
            <div className="mt-4 border-t border-border pt-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Example</p>
              <p className="text-sm text-muted-foreground italic">{g.example}</p>
            </div>
          </div>
        ))}
        <div className="border border-border border-dashed rounded-lg p-4 text-sm text-muted-foreground leading-relaxed">
          <span className="text-foreground font-medium">Gates are independent.</span> There is no compensatory
          scoring: strength at one gate cannot mask weakness at another. Passing all four makes an action eligible
          for autonomy only up to its risk tier (Tier 0–1 ACT, Tier 2 dual-key, Tier 3 human-only).
          <span className="ml-2 font-mono text-xs text-state-escalate">[Specified v2]</span>
        </div>
      </div>
    </section>

    {/* Three-level UQ */}
    <section className="px-6 pb-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Uncertainty in three levels</h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          v1 applied Expected Calibration Error as a per-hypothesis gate. That was a category error: ECE and the
          Brier score are statistics over many predictions with known outcomes and cannot be computed for one
          unresolved hypothesis. v2 separates three levels.
        </p>

        <div className="space-y-6">
          <div className="border border-border rounded-lg p-5">
            <p className="text-xs font-mono text-primary mb-1">LEVEL 1 · PER HYPOTHESIS · ONLINE</p>
            <h3 className="text-base font-semibold text-foreground mb-3">Decompose: is the uncertainty reducible?</h3>
            <pre className="border border-border rounded-md p-4 bg-secondary/20 font-mono text-xs text-muted-foreground overflow-x-auto mb-4">{level1}</pre>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="border border-border rounded-md p-3">
                <p className="font-medium text-foreground mb-1">High U_epi: the models disagree</p>
                <p className="text-muted-foreground">More evidence can help. Trigger corrective (CRAG) or active (FLARE) retrieval and recompute.</p>
              </div>
              <div className="border border-border rounded-md p-3">
                <p className="font-medium text-foreground mb-1">High U_ale after the retrieval budget</p>
                <p className="text-muted-foreground">The telemetry itself is insufficient. DEFER with a specific telemetry request.</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Single-model self-consistency is not enough: a model can repeat the same error confidently (43% of hallucinated package names recurred in all ten reruns).</p>
          </div>

          <div className="border border-border rounded-lg p-5">
            <p className="text-xs font-mono text-primary mb-1">LEVEL 2 · POPULATION · OFFLINE, ROLLING</p>
            <h3 className="text-base font-semibold text-foreground mb-3">Certify: do this deployment's scores mean what they say?</h3>
            <pre className="border border-border rounded-md p-4 bg-secondary/20 font-mono text-xs text-muted-foreground overflow-x-auto mb-4">{level2}</pre>
            <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
              <li>• A <span className="text-foreground">deployment</span> is the tuple (model ensemble, prompts, retrieval corpus, s, g). It is certified on held-out adjudicated incidents, not per model family.</li>
              <li>• Gate 2's threshold τ_r is chosen by distribution-free risk control so the error rate among auto-accepted hypotheses stays at most α_r.</li>
              <li>• A significant rise in ECE or Brier score <span className="text-foreground">revokes the certificate</span>. Tier 1 autonomy falls back to ESCALATE until recalibration; any model, prompt or corpus change requires recertification.</li>
            </ul>
          </div>

          <div className="border border-border rounded-lg p-5">
            <p className="text-xs font-mono text-primary mb-1">LEVEL 3 · TRAJECTORY · ONLINE</p>
            <h3 className="text-base font-semibold text-foreground mb-3">Propagate: has uncertainty accumulated across the investigation?</h3>
            <pre className="border border-border rounded-md p-4 bg-secondary/20 font-mono text-xs text-muted-foreground overflow-x-auto mb-4">{level3}</pre>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Uncertainty can vanish at agent hand-offs: orchestrator and sub-agent uncertainty correlate only weakly
              even when the relayed content is fixed. So every inter-agent message carries its sender's uncertainty
              and taint record as <span className="text-foreground">structured fields, not prose</span>. Gate 3 fails
              to ESCALATE rather than DEFER, because the problem is possible contamination, not missing evidence (OWASP ASI08).
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Analyst view */}
    <section className="px-6 pb-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-2">What the analyst sees</h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Calibrated confidence is never shown alone, only with the evidence gaps. People overestimate what an
          LLM knows when its explanation sounds authoritative, and that is how analysts end up rubber-stamping
          (OWASP ASI09).
        </p>
        <pre className="border border-border rounded-lg p-5 bg-secondary/20 font-mono text-xs text-muted-foreground overflow-x-auto leading-relaxed">{explanation}</pre>
      </div>
    </section>

    {/* Provenance */}
    <section className="px-6 pb-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Provenance, taint and sinks</h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Every datum is labelled <code className="font-mono text-foreground">TRUSTED</code> (generated by authenticated
          internal systems with integrity protection) or <code className="font-mono text-foreground">UNTRUSTED</code>, which
          in practice covers most log payloads, command lines, file names, email bodies, CTI text, tool and MCP
          output, and all LLM output. Unlabelled means untrusted. Taint IDs propagate through retrieval,
          summarisation and hypothesis generation, so every proposed action records which untrusted inputs it
          depends on.
        </p>
        <div className="border border-border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sink</TableHead>
                <TableHead>Definition</TableHead>
                <TableHead>Taint rule</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sinks.map((s) => (
                <TableRow key={s.sink}>
                  <TableCell className="font-mono text-xs font-medium">{s.sink}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{s.def}</TableCell>
                  <TableCell className={`text-sm font-mono whitespace-nowrap ${s.sink === "READ_ONLY" ? "text-state-act" : "text-state-escalate"}`}>{s.rule}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
          The semantic firewall that flags instruction-like content is a <span className="text-foreground">detector, not a boundary</span>.
          Adaptive attacks bypassed 12 published defenses with over 90% success for most. The boundary is the veto
          and the capability tokens.
        </p>
      </div>
    </section>

    {/* v1 heuristics */}
    <section className="px-6 pb-24">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          The v1 heuristic vector <span className="ml-2 align-middle font-mono text-xs text-state-act">[Implemented]</span>
        </h2>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          The reference code computes four interpretable signals from two agents' outputs: model disagreement,
          lexical agreement, evidence grounding and antonym contradiction. They are not calibrated probabilities.
          In v2 they serve as analyst explanation, as candidate features of s(h), and as a conservative backstop
          (policy rule 5) until a calibration certificate exists.
        </p>
        <pre className="border border-border rounded-lg p-5 bg-secondary/20 font-mono text-xs sm:text-sm text-muted-foreground overflow-x-auto">{v1Formula}</pre>
        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
          Known limits: lexical overlap is not semantic agreement; two runs of the same model are closer to
          self-consistency than corroboration; antonym matching (whole-word since 2.0.0) does not understand negation.
        </p>
        <div className="mt-8 flex flex-wrap gap-6">
          <Link to="/kairos/decision-states" className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:gap-2 transition-all">
            Decision states &amp; risk tiers <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link to="/kairos/ooda" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            OODA mapping <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default Gates;
