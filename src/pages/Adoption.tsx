import { Link } from "react-router-dom";
import { ArrowRight, Eye, Settings, Award, CheckCircle2 } from "lucide-react";

const tiers = [
  {
    id: "aware",
    level: 1,
    name: "Aware",
    icon: Eye,
    color: "text-state-defer",
    borderColor: "border-state-defer/40",
    bgColor: "bg-state-defer/5",
    tagline: "Understand the framework",
    description: "Map your autonomous agents' decisions to the Kairos ECL model. Identify which decisions are epistemic and where your gaps are.",
    actions: [
      "Read the framework overview and decision states documentation",
      "Identify all autonomous decision points in your system",
      "Classify each decision: can you determine confidence, grounding, and risk?",
      "Map each decision to ACT / ESCALATE / DEFER / FAIL_SAFE",
      "Document which signals you currently measure (if any)",
    ],
    checkpoint: "Can I classify my agent's decisions into the four states?",
    outcome: "You understand the epistemic landscape of your autonomous systems.",
  },
  {
    id: "compliant",
    level: 2,
    name: "Compliant",
    icon: Settings,
    color: "text-state-escalate",
    borderColor: "border-state-escalate/40",
    bgColor: "bg-state-escalate/5",
    tagline: "Implement signal extraction and decision gates",
    description: "Instrument your agents with epistemic signal extraction and enforce decision gates. Build basic audit trails for every autonomous decision.",
    actions: [
      "Implement signal extraction for confidence and grounding (minimum)",
      "Add contradiction detection between reasoning sources",
      "Gate autonomous actions: require confidence ≥ 0.80 for ACT",
      "Implement ESCALATE path — hand to human when confidence is partial",
      "Build audit trails with decision traces (signal values + policy rule + outcome)",
      "Test failure modes: verify DEFER triggers on low evidence confidence",
    ],
    checkpoint: "Is my agent making decisions with confidence and grounding visible?",
    outcome: "Your agent's decisions are traceable and gated by epistemic evidence.",
  },
  {
    id: "certified",
    level: 3,
    name: "Certified",
    icon: Award,
    color: "text-state-act",
    borderColor: "border-state-act/40",
    bgColor: "bg-state-act/5",
    tagline: "Full framework implementation with compliance integration",
    description: "Complete Kairos ECL implementation with all five signals, eight failure modes, deterministic policy evaluation, and compliance-ready audit trails.",
    actions: [
      "Extract all five epistemic signals (confidence, grounding, contradiction, temporal, reversibility)",
      "Implement the full 8-failure detection engine with severity classification",
      "Deploy the ordered policy engine (8 rules, first match wins, zero LLM input)",
      "Enforce the state machine — no state skipping, no backward transitions",
      "Generate compliance-ready audit trails (SOC 2, ISO 42001 mapping)",
      "Run the full test suite — state transitions, policy evaluation, failure detection, invariants",
      "Document decision policy and failure response procedures",
    ],
    checkpoint: "Can I demonstrate to an auditor exactly why my agent made each decision?",
    outcome: "Your autonomous systems are epistemically governed, auditable, and compliance-ready.",
  },
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
          Three tiers of adoption — from understanding the framework to full compliance-ready implementation.
          Each tier builds on the last. Start where you are.
        </p>
      </div>
    </section>

    {/* Tier Progression */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-10 px-4">
          {tiers.map((tier, i) => (
            <div key={tier.id} className="flex items-center">
              <div className={`flex items-center gap-2 ${tier.color}`}>
                <span className="font-mono font-semibold text-lg">{tier.level}</span>
                <span className="text-sm font-medium hidden sm:inline">{tier.name}</span>
              </div>
              {i < tiers.length - 1 && (
                <div className="w-12 sm:w-24 h-px bg-border mx-3 sm:mx-6" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Tier Cards */}
    <section className="px-6 pb-24">
      <div className="max-w-3xl mx-auto space-y-8 animate-stagger">
        {tiers.map((tier) => (
          <div key={tier.id} className={`border rounded-lg overflow-hidden card-hover ${tier.borderColor}`}>
            {/* Header */}
            <div className={`px-6 py-4 ${tier.bgColor} border-b ${tier.borderColor}`}>
              <div className="flex items-center gap-3">
                <tier.icon className={`h-6 w-6 ${tier.color}`} />
                <div>
                  <p className={`font-mono font-semibold ${tier.color}`}>Tier {tier.level}: {tier.name}</p>
                  <p className="text-sm text-muted-foreground">{tier.tagline}</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              <p className="text-sm text-muted-foreground leading-relaxed">{tier.description}</p>

              {/* Actions */}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">What to do</p>
                <ul className="space-y-2">
                  {tier.actions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground/40 mt-0.5 flex-shrink-0" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Checkpoint */}
              <div className="border border-border rounded-lg p-4 bg-secondary/20">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Checkpoint</p>
                <p className="text-sm text-foreground italic">"{tier.checkpoint}"</p>
              </div>

              {/* Outcome */}
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Outcome:</span> {tier.outcome}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto mt-10 flex gap-6">
        <Link to="/framework" className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:gap-2 transition-all">
          Start with the Framework <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link to="/argus" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          Try Argus <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  </div>
);

export default Adoption;
