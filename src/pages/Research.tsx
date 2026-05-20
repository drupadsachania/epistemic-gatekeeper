import { Link } from "react-router-dom";
import { ArrowRight, FileText, ExternalLink, BookOpen } from "lucide-react";

const keyFindings = [
  {
    stat: "15–52% → 3%",
    title: "Hallucinated reasoning reduced by an order of magnitude",
    description: "The framework cut hallucinated reasoning from the 2026 industry baseline of 15–52% down to 3% in simulated SOC workflows — achieved through the combined effect of LLM constraint to hypothesis-only roles, CRAG active retrieval, and SSE structural validation.",
  },
  {
    stat: "ECE 37–57%",
    title: "Frontier models are critically miscalibrated",
    description: "All top-tier models assessed on Humanity's Last Exam (HLE, April 2026) exhibit Expected Calibration Error of 37–57% — far above the framework's operational threshold of ECE < 0.15 required before any autonomous ACT authorization. GPT-5.4 Pro: 0.37. Claude Opus 4.6: 0.46. Gemini 3.1: 0.50.",
  },
  {
    stat: "5% → 22%",
    title: "Deferral rate tripled — epistemic hesitation as a success metric",
    description: "Deferral rate rose from 5% to 22%, reflecting successful recalibration. Each deferral is accompanied by a structured epistemic gap report identifying precisely what evidence was missing — converting 'I don't know' from a throughput failure into a high-value operational signal.",
  },
  {
    stat: "30% → 85%",
    title: "Missing evidence surfaced in 85% of test cases",
    description: "The CRAG Judge Agent identified insufficient or internally contradictory retrieved context and triggered corrective retrieval before hypothesis generation — surfacing missing evidence in 85% of cases versus 30% for an unconstrained baseline LLM.",
  },
  {
    stat: "SSE",
    title: "Structural Simulation Engine eliminates logical hallucinations",
    description: "The SSE validates every hypothesis against the enterprise's physical network topology and identity privilege graph — flagging structurally impossible attack paths such as lateral movement requiring access to air-gapped servers, a class of error that high LLM confidence scores mask entirely.",
  },
  {
    stat: "Zero-Trust",
    title: "Adversarial injection in log telemetry neutralised at ingestion",
    description: "All telemetry — SIEM alerts, network logs, external CTI feeds — is treated as potentially hostile by default. A Semantic Firewall (Auditor Worker) combined with Neuro-Symbolic Taint Tracking and Cryptographic Provenance defends against Viral Agent Loop attacks embedded directly in log entries.",
  },
];

const relatedDocs = [
  { title: "KAIROS-003: Decision State Machine Specification", description: "Formal state diagram, transition table, runtime invariants", link: "/kairos/decision-states" },
  { title: "KAIROS-001: Epistemic Failure Modes", description: "Eight failure types with detection criteria and policy overrides", link: "/kairos/problem" },
  { title: "Epistemic Signal Reference", description: "Five core signals — confidence, grounding, contradiction, temporal, reversibility", link: "/kairos/signals" },
  { title: "Argus XDR: Architecture Overview", description: "OODA loop, module trust model, 10-layer signal taxonomy, installation", link: "/argus-xdr/overview" },
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
                  Security Operations Centers face a compounding twin crisis: unprecedented operational scale
                  and a measurable failure of AI epistemic reliability. Enterprise environments generate over
                  100,000 alerts daily; frontier models exhibit Expected Calibration Error of 37–57% on
                  expert benchmarks, and hallucination rates in complex multi-step reasoning range from 15–52%.
                  This paper introduces an Epistemic Decision Quality Framework that constrains LLMs to
                  hypothesis generation only, gates every decision through formal Uncertainty Quantification
                  (ECE, Brier Score, UProp), validates hypotheses against physical network topology via a
                  Structural Simulation Engine, and defends against adversarial Viral Agent Loop attacks with
                  Zero-Trust runtime architecture. A proof-of-concept demonstrates hallucinated reasoning
                  reduced from 15–52% to <strong>3%</strong>, deferral rates rising from 5% to <strong>22%</strong>,
                  and missing evidence surfaced in <strong>85%</strong> of cases — confirming successful epistemic recalibration.
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
            <div key={i} className="border border-border rounded-lg p-4 card-hover flex gap-4">
              <div className="flex-shrink-0 mt-0.5">
                <span className="inline-block font-mono text-xs font-semibold px-2 py-1 rounded"
                  style={{ background: 'rgba(14,33,160,0.08)', color: 'var(--indigo, #0E21A0)', border: '1px solid rgba(14,33,160,0.20)', whiteSpace: 'nowrap' }}>
                  {finding.stat}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">{finding.title}</p>
                <p className="text-sm text-muted-foreground">{finding.description}</p>
              </div>
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
