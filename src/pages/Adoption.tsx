import { Link } from "react-router-dom";
import { ArrowRight, Eye, Settings, Award, CheckCircle2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* Adoption stages follow KAIROS-008. Called "stages" so they are not confused with action risk tiers. */
const stages = [
  {
    id: "shadow",
    level: 1,
    name: "Shadow",
    icon: Eye,
    color: "text-state-defer",
    borderColor: "border-state-defer/40",
    bgColor: "bg-state-defer/5",
    tagline: "Map, label and observe — no autonomous action",
    description: "Map your workflow onto the control loop and run Kairos with every outcome forced to DEFER or ESCALATE, while you collect adjudicated outcomes.",
    actions: [
      "Map each decision point onto Observe, Orient, Decide and Act",
      "Define the evidence schema, with a provenance column: TRUSTED or UNTRUSTED for every field",
      "Build the action risk tier register; any action not listed is Tier 3",
      "Inventory standing automation credentials: SOAR playbooks, platform agents, MCP servers",
      "Run in shadow mode and adjudicate closed cases with a written rubric",
    ],
    checkpoint: "Does every action we can take have a tier, and every field a provenance label?",
    outcome: "You know which actions could ever be autonomous, and you are building the data to prove it.",
  },
  {
    id: "gated",
    level: 2,
    name: "Gated",
    icon: Settings,
    color: "text-state-escalate",
    borderColor: "border-state-escalate/40",
    bgColor: "bg-state-escalate/5",
    tagline: "Gates, tokens and dual-key in place; Tier 0 acts",
    description: "Put the boundary in place before any state-changing autonomy: the tool gateway, capability tokens, the provenance veto and the dual-key workflow.",
    actions: [
      "Route every state-changing step through a tool gateway that only accepts signed, short-lived tokens",
      "Give each agent its own short-lived non-human identity; no inherited privileges",
      "Wire Gate 1 to your topology and identity graphs; enable the provenance veto",
      "Implement dual-key approval for Tier 2, with evidence gaps and trajectory trace on screen",
      "Red-team with AgentDojo-style injections placed in telemetry, including adaptive attacks",
      "Enable Tier 0 ACT (no state change)",
    ],
    checkpoint: "Can any untrusted input reach an execution, egress or state-changing sink without a human?",
    outcome: "Untrusted content can inform hypotheses but cannot authorise actions.",
  },
  {
    id: "certified",
    level: 3,
    name: "Certified",
    icon: Award,
    color: "text-state-act",
    borderColor: "border-state-act/40",
    bgColor: "bg-state-act/5",
    tagline: "Calibration certified; Tier 1 earns autonomy",
    description: "No Tier 1 autonomy without a valid calibration certificate for the exact deployment: model ensemble, prompts, retrieval corpus, raw score and calibration map.",
    actions: [
      "Fit the calibration map on adjudicated incidents; certify on held-out data (ECE ≤ ε_cal, with CIs)",
      "Set a target selective risk α_r per tier and derive τ_r by risk control instead of hand-setting it",
      "Set trajectory bounds κ_r per tier; carry uncertainty and taint across agent hand-offs as fields",
      "Enable Tier 1 ACT; monitor rolling ECE and Brier, and revoke on drift",
      "Recertify after every model, prompt or retrieval-corpus change",
    ],
    checkpoint: "Can I show an auditor the certificate, gate results and approvals behind each action?",
    outcome: "Autonomy is earned, bounded by tier, and every decision leaves a hash-chained record.",
  },
];

const kpis = [
  { kpi: "Deferral precision", def: "Share of DEFERs that were genuinely ambiguous or would otherwise have produced an error", why: "A deferral is only worth its cost if it is precise" },
  { kpi: "Escalation precision", def: "Share of ESCALATEs where human review changed or materially informed the outcome", why: "Detects over-escalation" },
  { kpi: "False-containment rate", def: "Share of executed state-changing actions later judged wrong", why: "The harm Kairos exists to prevent" },
  { kpi: "Time-to-containment (TPs)", def: "Detection to effective containment for confirmed incidents", why: "Guards against safety by paralysis" },
  { kpi: "Analyst minutes per deferral", def: "Human cost of each DEFER", why: "The cost side of the trade-off" },
  { kpi: "Calibration health", def: "Rolling ECE and Brier score against the certificate", why: "Early warning before revocation" },
];

const governance = [
  { fw: "ISO/IEC 42001:2023", evidence: "Recertification records → lifecycle monitoring; tier and dual-key records → human oversight; hash-chained audit → decision traceability" },
  { fw: "NIST AI RMF 1.0 · IR 8596 (draft)", evidence: "Calibration certificates support Measure; agent identity, tool authority and audit controls for the AI-agent archetype" },
  { fw: "EU AI Act, as amended by the Digital Omnibus", evidence: "Annex III obligations deferred to December 2027. An internal SOC triage agent is generally not Annex III; relevance is mostly indirect (logging, transparency, oversight)" },
  { fw: "India: MeitY guidelines · CERT-In", evidence: "Decision-level audit records for incident reporting; AI-system and integration inventory (CISG-2026-02)" },
];

const Adoption = () => (
  <div>
    {/* Hero */}
    <section className="px-6 pt-24 pb-16 md:pt-32 md:pb-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6 text-foreground">
          Adoption Guide
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Three stages, from shadow mode to certified autonomy. Each one is a precondition for the next:
          no state-changing autonomy without the boundary, and no Tier 1 autonomy without a calibration certificate.
        </p>
      </div>
    </section>

    {/* Stage progression */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-10 px-4">
          {stages.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className={`flex items-center gap-2 ${s.color}`}>
                <span className="font-mono font-semibold text-lg">{s.level}</span>
                <span className="text-sm font-medium hidden sm:inline">{s.name}</span>
              </div>
              {i < stages.length - 1 && (
                <div className="w-12 sm:w-24 h-px bg-border mx-3 sm:mx-6" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Stage cards */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto space-y-8 animate-stagger">
        {stages.map((s) => (
          <div key={s.id} className={`border rounded-lg overflow-hidden card-hover ${s.borderColor}`}>
            <div className={`px-6 py-4 ${s.bgColor} border-b ${s.borderColor}`}>
              <div className="flex items-center gap-3">
                <s.icon className={`h-6 w-6 ${s.color}`} />
                <div>
                  <p className={`font-mono font-semibold ${s.color}`}>Stage {s.level}: {s.name}</p>
                  <p className="text-sm text-muted-foreground">{s.tagline}</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-5 space-y-5">
              <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">What to do</p>
                <ul className="space-y-2">
                  {s.actions.map((action) => (
                    <li key={action} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground/40 mt-0.5 flex-shrink-0" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border border-border rounded-lg p-4 bg-secondary/20">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Checkpoint</p>
                <p className="text-sm text-foreground italic">"{s.checkpoint}"</p>
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Outcome:</span> {s.outcome}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* KPIs */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Manage by the right KPIs</h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Throughput KPIs such as alerts closed per hour push analysts toward accepting confident AI
          conclusions, which is the mechanism behind human–agent trust exploitation (OWASP ASI09). Deferral
          rate on its own is context, not a target.
        </p>
        <div className="border border-border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>KPI</TableHead>
                <TableHead>Definition</TableHead>
                <TableHead className="hidden sm:table-cell">Why</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kpis.map((k) => (
                <TableRow key={k.kpi}>
                  <TableCell className="text-sm font-medium whitespace-nowrap">{k.kpi}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{k.def}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{k.why}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>

    {/* Governance */}
    <section className="px-6 pb-24">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Governance alignment</h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Kairos mechanisms produce evidence that supports conformity; they do not make a deployment compliant
          on their own. ISO/IEC 42001 does not prescribe ECE thresholds, cryptographic audit trails or particular
          threat models. Verify current obligations for your jurisdiction and domain.
        </p>
        <div className="space-y-3">
          {governance.map((g) => (
            <div key={g.fw} className="border border-border rounded-lg p-4">
              <p className="text-sm font-medium text-foreground mb-1">{g.fw}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{g.evidence}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-6">
          <a href="https://github.com/kairos-dev-kairos-ecl/kairos-core/blob/main/Docs/KAIROS-008-adoption-guide.md" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:gap-2 transition-all">
            Full 9-step guide (KAIROS-008) <ArrowRight className="h-3.5 w-3.5" />
          </a>
          <Link to="/kairos/decision-states" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Risk tiers <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default Adoption;
