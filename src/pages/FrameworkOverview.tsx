import { Link } from "react-router-dom";
import { ArrowRight, FileText, Shield, Compass, Scale, Building2, HeartPulse, Landmark, Swords } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const decisionMatrix = [
  { state: "ACT", confidence: "> 85%", grounding: "Well-established", risk: "Low", when: "Autonomous execution", color: "text-state-act" },
  { state: "ESCALATE", confidence: "50–85%", grounding: "Partial", risk: "Medium", when: "Human judgment needed", color: "text-state-escalate" },
  { state: "DEFER", confidence: "Unknown", grounding: "Missing", risk: "N/A", when: "Gather more context", color: "text-state-defer" },
  { state: "FAIL_SAFE", confidence: "Can't assess", grounding: "Contradiction", risk: "N/A", when: "Stop and alert", color: "text-state-fail-safe" },
];

const principles = [
  {
    title: "Epistemic Humility",
    description: "No system earns the right to act without demonstrating it understands its own uncertainty.",
  },
  {
    title: "Observable Reasoning",
    description: "Every decision must produce an auditable trace — not just a result, but the epistemic path that led to it.",
  },
  {
    title: "Graduated Autonomy",
    description: "Autonomy is earned through confidence and grounding, not assumed by default.",
  },
  {
    title: "Fail-Safe by Default",
    description: "When in doubt, the system must choose safety over action. Silence is always an option.",
  },
];

const domains = [
  { icon: Shield, name: "Cybersecurity" },
  { icon: HeartPulse, name: "Healthcare" },
  { icon: Landmark, name: "Government" },
  { icon: Scale, name: "Legal / Compliance" },
  { icon: Building2, name: "Enterprise" },
  { icon: Swords, name: "Defense" },
];

const FrameworkOverview = () => (
  <div>
    {/* Hero */}
    <section className="px-6 pt-24 pb-16 md:pt-32 md:pb-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6 text-foreground">
          Kairos ECL Framework
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          An open epistemic control loop specification for autonomous decision-making in high-stakes domains.
          Not a product — a standard.
        </p>
      </div>
    </section>

    {/* What It Is */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-6">What It Is</h2>
        <div className="grid sm:grid-cols-2 gap-4 animate-stagger">
          <div className="border border-border rounded-lg p-4 card-hover">
            <p className="text-sm font-medium text-foreground mb-1">A specification</p>
            <p className="text-sm text-muted-foreground">Not a library or SaaS. A formal framework for epistemic governance.</p>
          </div>
          <div className="border border-border rounded-lg p-4 card-hover">
            <p className="text-sm font-medium text-foreground mb-1">Four decision states</p>
            <p className="text-sm text-muted-foreground">ACT, ESCALATE, DEFER, FAIL_SAFE — every decision resolves to one.</p>
          </div>
          <div className="border border-border rounded-lg p-4 card-hover">
            <p className="text-sm font-medium text-foreground mb-1">Open standard</p>
            <p className="text-sm text-muted-foreground">Licensed CC BY-SA 4.0. Free to adopt, extend, and build on.</p>
          </div>
          <div className="border border-border rounded-lg p-4 card-hover">
            <p className="text-sm font-medium text-foreground mb-1">Plugin model</p>
            <p className="text-sm text-muted-foreground">Integrates with your existing infrastructure through a plugin architecture.</p>
          </div>
        </div>
      </div>
    </section>

    {/* Pipeline */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-6">The Pipeline</h2>
        <div className="border border-border rounded-lg p-6 bg-secondary/20 font-mono text-sm space-y-2">
          <p><span className="text-muted-foreground">[OBSERVE]</span> → Extract signals from environment (logs, model output, evidence)</p>
          <p><span className="text-muted-foreground">[ORIENT]</span>{"  "} → Generate hypotheses, run meta-reasoning, detect failures</p>
          <p><span className="text-muted-foreground">[DECIDE]</span>{"  "} → Score uncertainty, evaluate policy, determine decision state</p>
          <p><span className="text-muted-foreground">[ACT]</span>{"    "} → Execute, escalate, defer, or fail-safe based on epistemic evidence</p>
        </div>
      </div>
    </section>

    {/* Decision Matrix */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Decision Matrix</h2>
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>State</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Grounding</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>When Used</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {decisionMatrix.map((row) => (
                <TableRow key={row.state}>
                  <TableCell className={`font-mono font-medium ${row.color}`}>{row.state}</TableCell>
                  <TableCell className="text-muted-foreground">{row.confidence}</TableCell>
                  <TableCell className="text-muted-foreground">{row.grounding}</TableCell>
                  <TableCell className="text-muted-foreground">{row.risk}</TableCell>
                  <TableCell className="text-muted-foreground">{row.when}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4">
          <Link
            to="/framework/decision-states"
            className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:gap-2 transition-all"
          >
            Deep dive into each state <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>

    {/* Principles */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Core Principles</h2>
        <div className="grid sm:grid-cols-2 gap-4 animate-stagger">
          {principles.map((p) => (
            <div key={p.title} className="border border-border rounded-lg p-4 card-hover">
              <p className="text-sm font-medium text-foreground mb-1">{p.title}</p>
              <p className="text-sm text-muted-foreground">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Domains */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Applicable Domains</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {domains.map((d) => (
            <div key={d.name} className="flex flex-col items-center gap-2 p-3">
              <d.icon className="h-8 w-8 text-muted-foreground" />
              <p className="text-xs text-muted-foreground text-center">{d.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Go Deeper */}
    <section className="px-6 pb-24">
      <div className="max-w-3xl mx-auto border-t border-border pt-10">
        <h2 className="text-xl font-semibold text-foreground mb-6">Go Deeper</h2>
        <div className="flex flex-col gap-3">
          <Link to="/framework/decision-states" className="group inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <FileText className="h-4 w-4" /> Decision States — the four terminal outcomes
            <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          <Link to="/framework/signal-reference" className="group inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <FileText className="h-4 w-4" /> Signal Reference — the five epistemic inputs
            <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          <Link to="/problem" className="group inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <FileText className="h-4 w-4" /> The Problem — why this framework exists
            <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default FrameworkOverview;
