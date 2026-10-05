import { Link } from "react-router-dom";
import { ArrowRight, FileText, ExternalLink, BookOpen, AlertTriangle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* ETRA-v2 Table 6 — preliminary, static synthetic scenarios, same LLM with and without the framework. */
const pocResults = [
  { indicator: "Hallucinated reasoning (analyst-labelled)", baseline: "12%", framework: "3%" },
  { indicator: "Deferral rate (DEFER + ESCALATE)", baseline: "5%", framework: "22%" },
  { indicator: "Missing evidence explicitly surfaced", baseline: "30%", framework: "85%" },
  { indicator: "Structurally infeasible hypotheses reaching the analyst", baseline: "not checked", framework: "0 (removed by SSE)" },
];

/* ETRA-v2 Table 3 — documented agentic incidents mapped to controls. */
const incidents = [
  { name: "EchoLeak", id: "CVE-2025-32711 · CVSS 9.3", what: "One crafted email, zero clicks: Microsoft 365 Copilot could be made to leak data through an allow-listed proxy.", control: "Untrusted provenance cannot authorise egress; taint veto", gap: "Rendering and egress paths must be controlled outside the LLM" },
  { name: "ForcedLeak", id: "CVSS 9.4", what: "Injection via a web-form field in Salesforce Agentforce; exfiltration to an expired, re-registered allow-listed domain.", control: "Taint tracking to communication sinks; signed capabilities", gap: "Allow-list hygiene (domain expiry)" },
  { name: "MCP STDIO command injection", id: "10 CVEs incl. CVE-2026-30615", what: "Unvalidated command and arguments in MCP server configuration led to remote code execution.", control: "Tool allow-listing; LLM holds no tool authority", gap: "Supply-chain review of tool servers" },
  { name: "Git MCP server", id: "CVE-2025-68143 / -68144 / -68145", what: "Path traversal and argument injection, reachable through prompt injection.", control: "Taint veto on execution sinks", gap: "Patch management" },
  { name: "AI-gateway exploitation", id: "CVE-2026-59822 + CVE-2026-42271", what: "Authentication bypass chained with command injection, observed in the wild; cryptominers deployed.", control: "Short-lived per-agent identities; sinks gated by provenance", gap: "Conventional exposure management" },
  { name: "GTG-1002", id: "AI-orchestrated campaign", what: "Agentic tooling did most of the tactical work; the attacker's own agent overstated findings and fabricated data.", control: "Machine-speed DEFER / ESCALATE; adversary-agent claims treated as untrusted", gap: "Attribution contested; no public IOCs" },
];

/* ETRA-v2 Appendix A — changes from Version 1. */
const corrections = [
  { topic: "Workforce gap", v1: "4.8M unfilled roles (ISC2 2025)", v2: "4.8M is the ISC2 2024 estimate. ISC2 2025 published no headcount gap: 59% report critical or significant skills gaps." },
  { topic: "Calibration figures", v1: "ECE 37–57% on HLE (text-only board)", v2: "These are RMS calibration error, now from the full multimodal leaderboard (Oct 2026): 38–57% for most models, one at 20%." },
  { topic: "Hallucination rates", v1: "15–52% aggregate; \"up to 99%\" for code", v2: "Withdrawn (secondary statistics site). Primary measurements: ≈3–20% grounded summarisation; 19.7% of code samples cite non-existent packages." },
  { topic: "Calibration design", v1: "ECE used as a per-hypothesis gate", v2: "A category error. ECE and Brier certify a deployment; each decision is gated on calibrated confidence with risk-controlled thresholds." },
  { topic: "Proof-of-concept framing", v1: "15–52% → 3%, compared with industry-wide statistics", v2: "12% → 3% against the same LLM unconstrained. Labelled preliminary; deferral precision and analyst time were not measured." },
  { topic: "Alert volume and trust", v1: "100,000 alerts/day, 70% abandoned, 94% / 92% AI adoption and trust", v2: "Replaced with SANS 2026: 79% of SOCs use AI or ML, 36% have integrated it into defined workflows." },
  { topic: "New in v2", v1: "—", v2: "Threat model; 2025–2026 incident analysis; OWASP Agentic Top 10 mapping; action risk tiers; provenance veto; evaluation protocol." },
];

/* ETRA-v2 Table 1 — HLE leaderboard, accessed October 2026. Values change over time. */
const calibration = [
  { model: "GPT 6 Astra", acc: "54.80", rms: "39" },
  { model: "Fable 5.1 (xhigh)", acc: "46.50", rms: "20" },
  { model: "gemini-3.1-pro-preview (thinking high)", acc: "46.44", rms: "51" },
  { model: "Gemini 3.8 Flash", acc: "44.52", rms: "51" },
  { model: "gpt-5.4-pro-2026-03-05", acc: "44.32", rms: "38" },
  { model: "Muse Spark", acc: "40.56", rms: "50" },
  { model: "gemini-3-pro-preview", acc: "37.52", rms: "57" },
  { model: "gpt-5.4 (xhigh)", acc: "36.24", rms: "42" },
  { model: "claude-opus-4-7", acc: "36.20", rms: "47" },
  { model: "kimi-k2.5", acc: "24.37", rms: "67" },
];

const protocol = [
  { n: "01", title: "Data", body: "Public SOC datasets (LANL authentication, Splunk Boss-of-the-SOC, OTRF Security-Datasets) plus held-out synthetic scenarios with ground-truth attack graphs." },
  { n: "02", title: "Models", body: "Exact model versions, decoding parameters, ensemble composition (K, S), prompts and a retrieval-corpus snapshot." },
  { n: "03", title: "Labelling", body: "At least two independent analysts, a written rubric, and reported inter-rater agreement (Cohen's or Fleiss' κ)." },
  { n: "04", title: "Calibration", body: "ECE with equal-mass bins and bootstrap intervals; Brier reliability and resolution; AUROC; risk–coverage curves for Gate 2." },
  { n: "05", title: "Operations", body: "Deferral precision, escalation precision, analyst minutes per incident, time-to-containment, end-to-end latency." },
  { n: "06", title: "Security", body: "Attack success under AgentDojo-style injections placed in telemetry, including adaptive attacks — measured separately for exfiltration, unauthorised action and suppressed detections." },
  { n: "07", title: "Ablations", body: "Remove each gate, the taint veto and each retrieval component in turn; compare trajectory gating with a step-level-only baseline." },
  { n: "08", title: "Drift", body: "Recertification across at least one model-version change and one retrieval-corpus refresh." },
];

const relatedDocs = [
  { title: "Decision States & Policy", description: "ACT / DEFER / ESCALATE, risk tiers 0–3, and the 16-rule v2 policy table", link: "/kairos/decision-states" },
  { title: "Gates & Uncertainty", description: "Triple gate, provenance veto, and the three-level uncertainty model", link: "/kairos/gates" },
  { title: "Threat Model & Failure Modes", description: "2025–2026 incidents, OWASP Agentic Top 10, and the 13 named failure types", link: "/kairos/problem" },
  { title: "Framework specs on GitHub", description: "KAIROS-000 … 009 and the security profile KAIROS-SEC-001 … 005", link: "https://github.com/kairos-dev-kairos-ecl/kairos-core", external: true },
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
          Version 2 of the paper behind Kairos. Between April and October 2026 the risks it
          anticipated became incident reports, and the paper corrected itself where v1 was wrong.
        </p>
      </div>
    </section>

    {/* Primary Paper */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <div className="border border-border rounded-lg p-6 card-hover">
          <div className="flex items-start gap-4">
            <FileText className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono text-muted-foreground mb-2">Preprint · Version 2 · October 2026 (Version 1: April 2026)</p>
              <h2 className="text-xl font-semibold text-foreground mb-2 leading-snug">
                Earning the Right to Act: Epistemic Control Loops for Trustworthy Agentic Security Operations
              </h2>
              <p className="text-sm text-muted-foreground mb-4">Drupad H. Sachania · Independent Researcher, Bengaluru</p>
              <blockquote className="border-l-2 border-primary/40 pl-4 my-4 text-sm italic text-foreground/80">
                "The question is not whether an LLM can generate a hypothesis. The question is whether the
                system knows when not to believe it."
              </blockquote>
              <div className="border-t border-border pt-4">
                <h3 className="text-sm font-medium text-foreground mb-2">Abstract</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  SOCs are adopting agentic AI faster than they are learning to govern it: 79% use AI or
                  machine learning, but only 36% have integrated it into defined workflows (SANS 2026).
                  Between mid-2025 and late 2026, zero-click prompt injection against Microsoft 365 Copilot,
                  data exfiltration from Salesforce Agentforce, a systemic command-injection flaw across the
                  Model Context Protocol ecosystem, and in-the-wild exploitation of AI gateways showed the
                  same root cause: agents that treat untrusted context as instructions and act on it with
                  unearned confidence.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The paper argues the central problem is insufficient <span className="text-foreground">epistemic control</span>,
                  not insufficient automation. It embeds measurable controls in an OODA loop: zero-trust
                  ingestion with provenance and taint tracking; LLMs restricted to competing, ATT&amp;CK-grounded
                  hypotheses; a triple decision gate with a provenance veto; and bounded outcomes routed by
                  action risk tier, with signed capability tokens and a tamper-evident audit trail aligned
                  with ISO/IEC 42001 and the NIST AI RMF.
                </p>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5">
                <a
                  href="/EARNING_THE_RIGHT_TO_ACT.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:gap-2.5 transition-all"
                >
                  Read preprint v2 <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a
                  href="/EARNING_THE_RIGHT_TO_ACT_v1.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Version 1 (archived) <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Contributions */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Five contributions</h2>
        <p className="text-sm text-muted-foreground mb-6">
          The thesis: a system must be able to know, measure and act on what it does not know.
        </p>
        <ol className="space-y-3 text-sm text-muted-foreground leading-relaxed list-none">
          {[
            ["An OODA-structured epistemic control loop", "LLMs only generate hypotheses; the authority to act is earned through explicit gates."],
            ["A two-level uncertainty design", "Population-level calibration certification (ECE, Brier) kept separate from per-decision gating on calibrated confidence and trajectory-level uncertainty."],
            ["A risk-tiered action model", "Signed capability tokens and a taint veto, so confidence can never override untrusted provenance."],
            ["An incident-grounded threat analysis", "Documented 2025–2026 agentic incidents and the OWASP Agentic Top 10 mapped to controls, including residual gaps."],
            ["Preliminary results and a full evaluation protocol", "Stated as preliminary, with the study that would confirm or refute them specified in advance."],
          ].map(([t, b], i) => (
            <li key={t} className="flex gap-4">
              <span className="font-mono text-xs text-muted-foreground/70 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
              <span><span className="text-foreground font-medium">{t}.</span> {b}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>

    {/* Preliminary results */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Preliminary results</h2>
        <div className="flex items-start gap-3 border border-state-escalate/30 bg-state-escalate/5 rounded-lg p-4 mb-6">
          <AlertTriangle className="h-4 w-4 text-state-escalate flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            A small, single-author proof of concept on static, synthetic SOC scenarios. It shows the design
            is feasible and indicates the direction of the effect. It is <span className="text-foreground">not a benchmark</span>:
            scenarios, baseline and labels were not independently constructed, and no confidence intervals
            are reported. The baseline is the same LLM given the same scenarios without the framework.
          </p>
        </div>
        <div className="border border-border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Indicator</TableHead>
                <TableHead className="text-right">Unconstrained</TableHead>
                <TableHead className="text-right">Kairos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pocResults.map((r) => (
                <TableRow key={r.indicator}>
                  <TableCell className="text-sm">{r.indicator}</TableCell>
                  <TableCell className="text-right font-mono text-sm text-muted-foreground whitespace-nowrap">{r.baseline}</TableCell>
                  <TableCell className="text-right font-mono text-sm text-foreground whitespace-nowrap">{r.framework}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <div className="border border-border rounded-lg p-4">
            <p className="text-sm font-medium text-foreground mb-1">Deferral as signal</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Each DEFER carried an evidence-gap report: what is missing, where to get it, and which
              hypothesis it would discriminate. "I don't know" becomes a work item, not a dead end.
            </p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <p className="text-sm font-medium text-foreground mb-1">The cost of deferral</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Deferrals rising from 5% to 22% is a cost as well as a safeguard. Whether it pays off depends
              on deferral precision and analyst time per deferral, which this study did not measure.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Incidents */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-mono uppercase tracking-wider text-primary mb-2">Between v1 and v2</p>
        <h2 className="text-2xl font-semibold text-foreground mb-2">The risks in the paper became incident reports</h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Every input-borne incident below succeeded because untrusted content reached a sink: an egress
          channel, a shell, a tool configuration. Filters reduced how often the attacks worked but never
          removed the path. Several were zero-click, so approval at the final action alone would not have helped.
        </p>
        <div className="space-y-3">
          {incidents.map((inc) => (
            <div key={inc.name} className="border border-border rounded-lg p-4 card-hover">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                <p className="text-sm font-semibold text-foreground">{inc.name}</p>
                <code className="text-xs font-mono text-muted-foreground">{inc.id}</code>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{inc.what}</p>
              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <p><span className="font-mono uppercase tracking-wide text-muted-foreground/70">Control · </span><span className="text-foreground/80">{inc.control}</span></p>
                <p><span className="font-mono uppercase tracking-wide text-muted-foreground/70">Residual gap · </span><span className="text-muted-foreground">{inc.gap}</span></p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">Sources: Aim Security · Noma · OX Security · Cyata · Wiz · Anthropic. Independent researchers have questioned the scope of the GTG-1002 report.</p>
      </div>
    </section>

    {/* Corrections */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-mono uppercase tracking-wider text-primary mb-2">Correcting my own paper</p>
        <h2 className="text-2xl font-semibold text-foreground mb-6">What v1 got wrong, and what v2 says instead</h2>
        <div className="space-y-3">
          {corrections.map((c) => (
            <div key={c.topic} className="border border-border rounded-lg p-4">
              <p className="text-xs font-mono uppercase tracking-wide text-muted-foreground mb-2">{c.topic}</p>
              <div className="grid sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3 text-sm">
                <p className="text-muted-foreground/70"><span className="font-mono text-xs mr-2">v1</span><span className={c.v1 !== "—" ? "line-through decoration-muted-foreground/40" : ""}>{c.v1}</span></p>
                <p className="text-foreground/90"><span className="font-mono text-xs mr-2 text-primary">v2</span>{c.v2}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">Sources: ISC2 2024/2025 · Scale AI HLE · Spracklen et al., USENIX Security '25 · Vectara HHEM · SANS 2026.</p>
      </div>
    </section>

    {/* Calibration context */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Capability is not calibration</h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Accuracy on Humanity's Last Exam has risen substantially since April 2026; calibration error mostly
          has not. One model reaches 20%, so good calibration is achievable, but it does not come
          automatically with capability. The benchmark's own labels are noisy too, which is why the
          evaluation protocol makes label quality a first-class requirement.
        </p>
        <div className="border border-border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model (as listed)</TableHead>
                <TableHead className="text-right">Accuracy %</TableHead>
                <TableHead className="text-right">RMS calib. error %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calibration.map((m) => (
                <TableRow key={m.model}>
                  <TableCell className="font-mono text-xs">{m.model}</TableCell>
                  <TableCell className="text-right font-mono text-sm text-muted-foreground">{m.acc}</TableCell>
                  <TableCell className="text-right font-mono text-sm text-foreground">{m.rms}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Scale AI HLE leaderboard (full, multimodal), accessed October 2026 after the September HLE-Rolling
          update. Leaderboard values change; treat them as context, not baselines.
        </p>
      </div>
    </section>

    {/* Evaluation protocol */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Evaluation protocol for independent validation</h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          To make the claims falsifiable, the paper specifies what a full study must report (KAIROS-009).
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {protocol.map((p) => (
            <div key={p.n} className="border border-border rounded-lg p-4">
              <p className="text-sm font-medium text-foreground mb-1"><span className="font-mono text-xs text-muted-foreground mr-2">{p.n}</span>{p.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-border mt-8 pt-6">
          <h3 className="text-sm font-medium text-foreground mb-3">Known limitations</h3>
          <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
            <li>• Adjudicated outcomes lag by days and are themselves noisy; certification is sensitive to label quality.</li>
            <li>• Risk-controlled thresholds assume exchangeability, which campaign-driven distribution shift violates.</li>
            <li>• An attacker who shapes inputs can also shape model agreement; the uncertainty estimators need adaptive red-teaming.</li>
            <li>• Ensemble sampling and trajectory propagation multiply inference cost and latency.</li>
            <li>• Gate 1 is only as accurate as the topology and identity graphs, which drift.</li>
          </ul>
        </div>
      </div>
    </section>

    {/* Related */}
    <section className="px-6 pb-24">
      <div className="max-w-3xl mx-auto border-t border-border pt-10">
        <h2 className="text-xl font-semibold text-foreground mb-6">Related Documentation</h2>
        <div className="space-y-3">
          {relatedDocs.map((doc) => {
            const inner = (
              <>
                <BookOpen className="h-4 w-4 text-muted-foreground mt-0.5 group-hover:text-primary transition-colors" />
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">{doc.description}</p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground ml-auto mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </>
            );
            const cls = "group flex items-start gap-3 p-3 -mx-3 rounded-lg hover:bg-secondary/20 transition-colors";
            return doc.external ? (
              <a key={doc.title} href={doc.link} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
            ) : (
              <Link key={doc.title} to={doc.link} className={cls}>{inner}</Link>
            );
          })}
        </div>
      </div>
    </section>
  </div>
);

export default Research;
