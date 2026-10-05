import { Link } from "react-router-dom";
import { ArrowRight, AlertTriangle, Eye, Zap, ShieldAlert, Crosshair, BarChart3 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Failure = {
  id: string;
  name: string;
  severity: "CRITICAL" | "NON-CRITICAL";
  description: string;
  override: string;
  v2?: boolean;
};

const failureModes: Failure[] = [
  { id: "false-agreement", name: "FALSE_AGREEMENT", severity: "NON-CRITICAL", override: "DEFER",
    description: "Both agents reproduce the same template rather than reasoning independently (Jaccard ≥ 0.85, structural diversity < 0.30). The agreement only looks like confidence." },
  { id: "low-information", name: "LOW_INFORMATION_HYPOTHESIS", severity: "NON-CRITICAL", override: "DEFER",
    description: "Fewer than two concrete entities and vague hedges throughout. A hypothesis that cannot be checked against observable data tells you nothing." },
  { id: "evidence-mismatch", name: "EVIDENCE_MISMATCH", severity: "NON-CRITICAL", override: "DEFER",
    description: "The hypothesis asserts a correlation the evidence object explicitly records as absent: hallucinated evidentiary support (OWASP LLM09)." },
  { id: "missing-evidence", name: "MISSING_EVIDENCE", severity: "CRITICAL", override: "FAIL_SAFE",
    description: "Required evidence fields are absent, not false. Any hypothesis would be an unanchored inference that cannot be validated or audited." },
  { id: "contradictory", name: "CONTRADICTORY_HYPOTHESES", severity: "NON-CRITICAL", override: "ESCALATE",
    description: "Mutually exclusive interpretations that survive Gate 1 and that no available evidence can tell apart. Competing hypotheses are expected; contradictions nobody can resolve need a human." },
  { id: "overconfident", name: "OVERCONFIDENT_OUTPUT", severity: "NON-CRITICAL", override: "DEFER",
    description: "Two or more certainty markers (\"definitely\", \"confirmed\") without the evidence to back them. In v2, analyst-facing verbal certainty is replaced by calibrated confidence shown with evidence gaps." },
  { id: "superficial", name: "SUPERFICIAL_REASONING", severity: "NON-CRITICAL", override: "DEFER",
    description: "More than half the hypotheses are classification labels (\"suspicious activity\") rather than mechanisms that explain why, how and through what path." },
  { id: "degenerate", name: "DEGENERATE_OUTPUT", severity: "CRITICAL", override: "FAIL_SAFE",
    description: "Token repetition above 0.60 or byte-identical agent outputs. The reasoning component itself has failed, so nothing it produces can be trusted." },
  { id: "anchoring", name: "NARRATIVE_ANCHORING", severity: "NON-CRITICAL", override: "DEFER", v2: true,
    description: "Fewer than k competing hypotheses, or no benign explanation. This is the precondition for narrative hardening: the first AI hypothesis becomes the organisation's working truth." },
  { id: "infeasible", name: "STRUCTURALLY_INFEASIBLE", severity: "NON-CRITICAL", override: "INVALID → re-orient", v2: true,
    description: "Gate 1 found the attack path impossible under the topology, identity graph or policy. Unconstrained models present these fluently, with no sign that anything is wrong." },
  { id: "trajectory", name: "TRAJECTORY_UNCERTAINTY_EXCEEDED", severity: "NON-CRITICAL", override: "ESCALATE", v2: true,
    description: "Each step looked acceptable, but the conclusion inherited compounding uncertainty from earlier steps: the cascading-failure mechanism (OWASP ASI08)." },
  { id: "tainted", name: "TAINTED_JUSTIFICATION", severity: "CRITICAL", override: "ESCALATE", v2: true,
    description: "The justification depends on untrusted inputs and the action reaches an execution, egress or state-changing sink. Critical because it may be a compromise; ESCALATE because the reasoning is intact, only the provenance is not." },
  { id: "uncertified", name: "CALIBRATION_UNCERTIFIED", severity: "NON-CRITICAL", override: "ESCALATE (Tier ≥ 1)", v2: true,
    description: "No valid calibration certificate covers this deployment, or drift revoked it. Without certification, ĉ(h) has no guaranteed meaning." },
];

const governance = [
  { stat: "79% / 36%", label: "of SOCs use AI or ML / have integrated it into defined workflows", src: "SANS SOC Survey 2026" },
  { stat: "45% → 63%", label: "respondents reporting significant AI shortcomings in detection and response, in one year", src: "SANS AI Survey 2026" },
  { stat: "92%", label: "of organisations with an AI-related breach lacked proper AI access controls", src: "IBM Cost of a Data Breach 2026" },
  { stat: "38–57%", label: "RMS calibration error for most frontier models on Humanity's Last Exam", src: "Scale AI, accessed Oct 2026" },
];

const owasp = [
  { id: "ASI01", risk: "Agent Goal Hijack", mech: "Provenance labels and taint; LLM has no tool authority; semantic firewall as a detector" },
  { id: "ASI02", risk: "Tool Misuse & Exploitation", mech: "Signed, scope-bound capability tokens; risk tiers; dual-key for Tier 2" },
  { id: "ASI03", risk: "Identity & Privilege Abuse", mech: "Short-lived, per-agent non-human identities; least agency" },
  { id: "ASI04", risk: "Agentic Supply Chain", mech: "Allow-listed, pinned tool and MCP manifests; runtime monitoring" },
  { id: "ASI05", risk: "Unexpected Code Execution", mech: "Sandboxed execution; taint veto on shell, query and egress sinks" },
  { id: "ASI06", risk: "Memory & Context Poisoning", mech: "CRAG evaluator, FLARE retrieval; provenance of retrieved items" },
  { id: "ASI07", risk: "Insecure Inter-Agent Comms", mech: "Signed messages carrying uncertainty and taint as structured fields" },
  { id: "ASI08", risk: "Cascading Failures", mech: "Gate 3 trajectory uncertainty; Gate 1 invalidation returns to Orient", primary: true },
  { id: "ASI09", risk: "Human–Agent Trust Exploitation", mech: "Calibrated confidence shown with evidence gaps; DEFER as legitimate; dual-key overrides", primary: true },
  { id: "ASI10", risk: "Rogue Agents", mech: "Bounded outcomes; tamper-evident audit trail; continuous monitoring" },
];

const overrideClass = (o: string) =>
  o.startsWith("FAIL_SAFE") ? "text-state-fail-safe"
  : o.startsWith("ESCALATE") ? "text-state-escalate"
  : o.startsWith("INVALID") ? "text-muted-foreground"
  : "text-state-defer";

const Problem = () => (
  <div>
    {/* Hero */}
    <section className="px-6 pt-24 pb-16 md:pt-32 md:pb-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6 text-foreground">
          Unearned Confidence
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          The core challenge is not insufficient automation but insufficient <span className="text-foreground font-medium">epistemic control</span>:
          a system's ability to know, measure and act on what it does not know.
        </p>
      </div>
    </section>

    {/* The gap */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Eye className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">One root cause</h2>
        </div>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Zero-click injection against Microsoft 365 Copilot, exfiltration from Salesforce Agentforce, command
            injection across the MCP ecosystem and in-the-wild exploitation of AI gateways all failed the same way:
            <span className="text-foreground"> agents that treat untrusted context as instructions and act on it with unearned confidence.</span>
          </p>
          <div className="border border-border rounded-lg p-5 bg-secondary/20 font-mono text-sm space-y-1 overflow-x-auto">
            <p className="text-muted-foreground">// Typical agent loop</p>
            <p>1. Email body says "allow-list this sender" → <span className="text-foreground">read as an instruction</span></p>
            <p>2. Agent forms one narrative → <span className="text-foreground">no benign alternative considered</span></p>
            <p>3. Agent sounds certain → <span className="text-foreground">confidence never calibrated</span></p>
            <p>4. Agent acts with standing credentials → <span className="text-foreground">no tier, no token</span></p>
            <p>5. Incident review: "Why did it do that?" → <span className="text-state-fail-safe">no trace</span></p>
          </div>
          <p>
            Filters lowered how often these attacks succeeded but never removed the path from untrusted content
            to a sink. Adaptive attackers bypassed 12 published defenses with over 90% success for most. The
            boundary has to be architectural.
          </p>
        </div>
      </div>
    </section>

    {/* OODA */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">Narrative hardening</h2>
        </div>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Training and evaluation regimes reward confident guessing over admitting uncertainty, which produces
            fluent, assertive errors. People then overestimate what an LLM knows when its explanation sounds
            authoritative. Together these feed automation bias and <span className="text-foreground">narrative hardening</span>:
            the first AI-generated hypothesis becomes the organisation's working truth, and contradictory evidence
            stops being sought.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div className="border border-border rounded-lg p-4 card-hover">
              <p className="text-sm font-medium text-foreground mb-2">Agent without epistemic control</p>
              <p className="text-sm">Orient → one confident story → Act with whatever authority it holds → hope it's right</p>
            </div>
            <div className="border border-state-act/30 border-l-4 rounded-lg p-4 card-hover">
              <p className="text-sm font-medium text-foreground mb-2">With Kairos</p>
              <p className="text-sm">Orient → ≥ k competing hypotheses incl. a benign one → three gates + veto → act only within tier, or defer / escalate with a reason</p>
            </div>
          </div>
          <p>
            Offensive agents have the same flaw. In the GTG-1002 campaign, the attacker's own agent overstated
            findings and fabricated data. Machine-generated claims from either side are hypotheses.
          </p>
        </div>
      </div>
    </section>

    {/* Governance lag */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">Governance lags deployment</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {governance.map((g) => (
            <div key={g.stat} className="border border-border rounded-lg p-4">
              <p className="text-2xl font-semibold tracking-tight text-foreground font-mono">{g.stat}</p>
              <p className="text-sm text-muted-foreground mt-1">{g.label}</p>
              <p className="text-xs font-mono text-muted-foreground/70 mt-2">{g.src}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">Survey and vendor figures change quickly; treat them as context, not baselines.</p>
      </div>
    </section>

    {/* Threat model */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Crosshair className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">Threat model</h2>
        </div>
        <div className="border border-border rounded-lg divide-y divide-border text-sm">
          {[
            ["Assets", "Production hosts, identities, network controls and data reachable through response tools."],
            ["Adversary can", "Place arbitrary content in ingested telemetry (log fields, email bodies, file names, web forms, CTI); compromise or impersonate tools, plugins or MCP servers; adapt to observed defenses."],
            ["Adversary cannot", "Modify gate code, signing keys or the audit store, which are protected by conventional controls."],
            ["Adversary goals", "Induce harmful actions (isolate the wrong host, disable an account, exfiltrate data); suppress true detections; erode analyst trust."],
            ["Out of scope", "Malicious insiders with key custody; poisoning of model weights; compromise of the cloud provider."],
          ].map(([k, v]) => (
            <div key={k} className="grid sm:grid-cols-[160px_1fr] gap-1 sm:gap-4 p-4">
              <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground pt-0.5">{k}</p>
              <p className="text-muted-foreground leading-relaxed">{v}</p>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold text-foreground mt-10 mb-2">OWASP Top 10 for Agentic Applications</h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          Kairos is designed primarily around ASI08 and ASI09, the epistemic risks most product-level controls
          leave unaddressed. For the rest it relies on established security engineering.
        </p>
        <div className="border border-border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">ID</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Kairos mechanism</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {owasp.map((o) => (
                <TableRow key={o.id} className={o.primary ? "bg-primary/5" : undefined}>
                  <TableCell className="font-mono text-xs font-medium">{o.id}</TableCell>
                  <TableCell className={`text-sm ${o.primary ? "text-foreground font-medium" : ""}`}>{o.risk}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{o.mech}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>

    {/* Failure modes */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">Epistemic failure modes</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed mb-6">
          A closed taxonomy of thirteen named failures. Eight are implemented in the reference engine; five come
          from the v2 gates and provenance controls. An unnamed failure is a critical system defect, and each
          failure carries a mandatory override, applied regardless of confidence.
        </p>
        <Accordion type="multiple" className="space-y-2 animate-stagger">
          {failureModes.map((mode) => (
            <AccordionItem key={mode.id} value={mode.id} className={`border rounded-lg px-4 transition-all duration-300 hover:bg-secondary/20 ${
                      mode.severity === "CRITICAL"
                        ? "border-state-fail-safe/40 border-l-4"
                        : "border-border"
                    }`}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-left">
                  <code className="text-xs sm:text-sm font-mono text-foreground break-all">{mode.name}</code>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      mode.severity === "CRITICAL"
                        ? "bg-state-fail-safe/20 text-state-fail-safe"
                        : "bg-state-escalate/20 text-state-escalate"
                    }`}
                  >
                    {mode.severity}
                  </span>
                  {mode.v2 && <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-primary/30 text-primary">v2</span>}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{mode.description}</p>
                <p className="text-xs font-mono">
                  Policy override: <span className={overrideClass(mode.override)}>{mode.override}</span>
                  <span className="ml-3 text-muted-foreground/70">{mode.v2 ? "[Specified v2]" : "[Implemented]"}</span>
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
          When several failures are present, the most restrictive override wins. Release 2.0.0 fixed two
          mismatches between declared and effective overrides: CONTRADICTORY_HYPOTHESES now escalates, and
          MISSING_EVIDENCE is declared FAIL_SAFE.
        </p>
      </div>
    </section>

    {/* Cost */}
    <section className="px-6 pb-24">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <ShieldAlert className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">The cost of getting it wrong</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 animate-stagger text-muted-foreground">
          <div className="border border-border rounded-lg p-4 card-hover">
            <p className="text-sm font-medium text-foreground mb-2">Wrong containment</p>
            <p className="text-sm">Isolating the wrong host or blocking a partner's spoofed IP: the adversary's goal achieved with your own tooling.</p>
          </div>
          <div className="border border-border rounded-lg p-4 card-hover">
            <p className="text-sm font-medium text-foreground mb-2">No decision record</p>
            <p className="text-sm">ISO/IEC 42001 and the NIST AI RMF expect lifecycle and oversight evidence. "The AI decided" is not an audit trail.</p>
          </div>
          <div className="border border-border rounded-lg p-4 card-hover">
            <p className="text-sm font-medium text-foreground mb-2">Trust erosion</p>
            <p className="text-sm">Throughput KPIs push analysts to accept confident conclusions, so pressure to override is highest exactly when an injected narrative sounds most authoritative.</p>
          </div>
        </div>
        <div className="mt-10">
          <Link
            to="/kairos/gates"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            How Kairos earns the right to act <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default Problem;
