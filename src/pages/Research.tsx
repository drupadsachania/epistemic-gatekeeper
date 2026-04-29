import { Link } from "react-router-dom";
import { ArrowRight, FileText, ExternalLink, BookOpen } from "lucide-react";

const keyFindings = [
  {
    title: "Epistemic humility is enforceable",
    description: "By decomposing LLM output into five measurable signals, the framework makes uncertainty a first-class system property — not a human judgment call.",
  },
  {
    title: "Dual-agent divergence detects confabulation",
    description: "Running two independent LLM agents and measuring structural diversity reliably catches false agreement, template reproduction, and degenerate outputs.",
  },
  {
    title: "Eight failure modes cover the epistemic attack surface",
    description: "From FALSE_AGREEMENT to DEGENERATE_OUTPUT, the failure taxonomy captures the ways LLM reasoning breaks down in high-stakes domains.",
  },
  {
    title: "Policy gates eliminate LLM influence on decisions",
    description: "The decision policy engine has zero path from LLM output. Eight ordered rules evaluate epistemic evidence only — no model can argue its way past a gate.",
  },
  {
    title: "57/57 tests passing in reference implementation",
    description: "The kairos-security reference implementation validates every state transition, policy rule, failure mode, and invariant specified in the framework.",
  },
];

const relatedDocs = [
  { title: "KAIROS-003: Decision State Machine Specification", description: "Formal state diagram, transition table, runtime invariants", link: "/framework/decision-states" },
  { title: "KAIROS-005: Epistemic Failure Modes", description: "Eight failure types with detection criteria and policy overrides", link: "/problem" },
  { title: "Signal Reference", description: "Five core signals — definition, observation, decision impact", link: "/framework/signal-reference" },
  { title: "Signal → Framework Map", description: "Cross-reference of every signal, failure, and policy outcome", link: "/docs/signal-framework-map" },
];

const Research = () => (
  <div>
    {/* Hero */}
    <section className="px-6 pt-24 pb-16 md:pt-32 md:pb-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6 text-foreground">
          Research & Papers
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          The theoretical foundation behind Kairos ECL — from epistemic control loops to
          the formal specification of trustworthy autonomous decision-making.
        </p>
      </div>
    </section>

    {/* Primary Paper */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <div className="border border-border rounded-lg p-6 card-hover">
          <div className="flex items-start gap-4">
            <FileText className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="text-xs font-mono text-muted-foreground mb-2">arXiv preprint · 2026</p>
              <h2 className="text-xl font-semibold text-foreground mb-2 leading-snug">
                Earning the Right to Act: Epistemic Control Loops for Trustworthy LLM-Based Security Automation
              </h2>
              <p className="text-sm text-muted-foreground mb-4">Drupad Sachania</p>
              <div className="border-t border-border pt-4">
                <h3 className="text-sm font-medium text-foreground mb-2">Abstract</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This paper introduces Epistemic Control Loops (ECL), a framework for governing autonomous
                  LLM-based agents in high-stakes domains. We propose that autonomous systems must <em>earn the
                  right to act</em> by demonstrating epistemic soundness — measurable confidence, evidence
                  grounding, absence of contradiction, temporal coherence, and action reversibility — before
                  any autonomous execution is permitted. The framework defines four terminal decision states
                  (ACT, ESCALATE, DEFER, FAIL_SAFE), eight epistemic failure modes, and a deterministic
                  policy engine that eliminates LLM influence from decision paths. We validate the approach
                  through a reference implementation (kairos-security) with 57 passing tests covering state
                  machine integrity, policy evaluation, and failure detection.
                </p>
              </div>
              <div className="flex gap-4 mt-5">
                <a
                  href="/EARNING_THE_RIGHT_TO_ACT.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:gap-2.5 transition-all"
                >
                  Read Preprint <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Key Findings */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Key Findings</h2>
        <div className="space-y-4 animate-stagger">
          {keyFindings.map((finding, i) => (
            <div key={i} className="border border-border rounded-lg p-4 card-hover">
              <p className="text-sm font-medium text-foreground mb-1">{finding.title}</p>
              <p className="text-sm text-muted-foreground">{finding.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* How It Relates */}
    <section className="px-6 pb-24">
      <div className="max-w-3xl mx-auto border-t border-border pt-10">
        <h2 className="text-xl font-semibold text-foreground mb-6">Related Documentation</h2>
        <div className="space-y-3">
          {relatedDocs.map((doc) => (
            <Link key={doc.title} to={doc.link} className="group flex items-start gap-3 p-3 -mx-3 rounded-lg hover:bg-secondary/20 transition-colors">
              <BookOpen className="h-4 w-4 text-muted-foreground mt-0.5 group-hover:text-primary transition-colors" />
              <div>
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{doc.title}</p>
                <p className="text-xs text-muted-foreground">{doc.description}</p>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground ml-auto mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Research;
