import { Link } from "react-router-dom";
import { ArrowRight, Terminal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const modules = [
  { name: "llm_adapter.py", role: "Hypothesis generation + output validation", trust: "UNTRUSTED" },
  { name: "meta_reasoning.py", role: "Hypothesis quality reflection", trust: "Advisory only" },
  { name: "uncertainty_engine.py", role: "4D epistemic scoring", trust: "TRUSTED" },
  { name: "epistemic_failure_engine.py", role: "Failure detection + policy override", trust: "TRUSTED" },
  { name: "decision_policy_engine.py", role: "Policy evaluation (no LLM input)", trust: "TRUSTED" },
  { name: "state_machine.py", role: "Process integrity + audit trail", trust: "TRUSTED" },
  { name: "spine.py", role: "OODA orchestration layer", trust: "TRUSTED" },
  { name: "schemas.py", role: "Shared data structures", trust: "—" },
];

const trustColor = (trust: string) =>
  trust === "UNTRUSTED" ? "text-state-fail-safe" : trust === "TRUSTED" ? "text-state-act" : "text-muted-foreground";

const ArgusOverview = () => (
  <div>
    {/* Hero */}
    <section className="px-6 pt-24 pb-16 md:pt-32 md:pb-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6 text-foreground">
          Argus
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Reference architecture for epistemic governance. Self-hosted, auditable, and designed for
          researchers, students, and security teams who need to understand — not just observe — autonomous decisions.
        </p>
      </div>
    </section>

    {/* What Argus Does */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-6">What Argus Does</h2>
        <div className="grid sm:grid-cols-2 gap-4 animate-stagger">
          <div className="border border-border rounded-lg p-4 card-hover">
            <p className="text-sm font-medium text-foreground mb-1">Extracts epistemic signals</p>
            <p className="text-sm text-muted-foreground">Confidence, grounding, contradiction, temporal alignment, and reversibility from every decision.</p>
          </div>
          <div className="border border-border rounded-lg p-4 card-hover">
            <p className="text-sm font-medium text-foreground mb-1">Enforces decision gates</p>
            <p className="text-sm text-muted-foreground">8 ordered policy rules determine ACT / ESCALATE / DEFER / FAIL_SAFE. No LLM can bypass them.</p>
          </div>
          <div className="border border-border rounded-lg p-4 card-hover">
            <p className="text-sm font-medium text-foreground mb-1">Builds audit trails</p>
            <p className="text-sm text-muted-foreground">Every decision produces a full trace: signals, failures, policy evaluation, and terminal state.</p>
          </div>
          <div className="border border-border rounded-lg p-4 card-hover">
            <p className="text-sm font-medium text-foreground mb-1">Plugin architecture</p>
            <p className="text-sm text-muted-foreground">Kairos ECL integrates as a plugin. Extend with your own signal extractors and policy engines.</p>
          </div>
        </div>
      </div>
    </section>

    {/* Architecture */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Architecture</h2>
        <div className="border border-border rounded-lg p-6 bg-secondary/20 font-mono text-sm space-y-2">
          <p className="text-muted-foreground">Alert In</p>
          <p>{"   │"}</p>
          <p>{"   ▼"}</p>
          <p><span className="text-muted-foreground">[OBSERVE]</span>  resolve_context() → gather evidence from SIEM / EDR / IAM</p>
          <p>{"   │"}</p>
          <p>{"   ▼"}</p>
          <p><span className="text-muted-foreground">[ORIENT]</span>{"  "} generate_hypotheses() → dual-agent LLM (untrusted, sanitized)</p>
          <p>{"          "} run_meta_reasoning() → quality reflection layer</p>
          <p>{"   │"}</p>
          <p>{"   ▼"}</p>
          <p><span className="text-muted-foreground">[DECIDE]</span>{"  "} test_evidence() → correlate hypotheses with evidence</p>
          <p>{"          "} compute_uncertainty() → 4D epistemic vector</p>
          <p>{"          "} detect_failures() → 8 named failure modes</p>
          <p>{"          "} evaluate_policy() → 8 ordered rules, first match wins</p>
          <p>{"   │"}</p>
          <p>{"   ▼"}</p>
          <p><span className="text-muted-foreground">[ACT]</span>{"     "} finalize() → <span className="text-state-act">EXECUTED</span> / <span className="text-state-escalate">ESCALATED</span> / <span className="text-state-defer">DEFERRED</span> / <span className="text-state-fail-safe">FAILED_SAFE</span></p>
        </div>
      </div>
    </section>

    {/* Module Table */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Module Roles</h2>
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Trust Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules.map((m) => (
                <TableRow key={m.name}>
                  <TableCell className="font-mono text-sm">{m.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{m.role}</TableCell>
                  <TableCell className={`text-sm font-medium ${trustColor(m.trust)}`}>{m.trust}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>

    {/* Quick Start */}
    <section className="px-6 pb-24">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Quick Start</h2>
        <div className="border border-border rounded-lg p-5 bg-secondary/20">
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground">Terminal</span>
          </div>
          <pre className="font-mono text-sm text-muted-foreground overflow-x-auto space-y-1">
{`git clone https://github.com/kairos-dev-kairos-ecl/argus
cd argus && pip install -r requirements.txt
python -m argus.server`}
          </pre>
        </div>
        <div className="mt-8 flex gap-6">
          <a
            href="https://github.com/kairos-dev-kairos-ecl/argus"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:gap-2 transition-all"
          >
            View on GitHub <ArrowRight className="h-3.5 w-3.5" />
          </a>
          <Link to="/framework" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Back to Framework <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default ArgusOverview;
