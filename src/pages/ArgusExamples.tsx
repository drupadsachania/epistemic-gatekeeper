import { Link } from "react-router-dom";
import { ArrowRight, Shield, ClipboardCheck, Siren } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const examples = [
  {
    id: "threat",
    icon: Shield,
    title: "Threat Detection",
    subtitle: "Autonomous agent detects anomalous SSH activity",
    scenario: "A SOC alert fires: 47 failed SSH login attempts from an external IP in 3 minutes, followed by one successful login. The agent must decide whether to block the IP, escalate, or gather more data.",
    signals: [
      { name: "Confidence", value: "0.92", note: "Known attack pattern, high model agreement" },
      { name: "Grounding", value: "0.88", note: "Hypotheses reference failed login count, geo, timing" },
      { name: "Contradiction", value: "0.05", note: "Both agents agree: brute force attack" },
      { name: "Temporal", value: "Aligned", note: "Alert is 12 seconds old, evidence is fresh" },
      { name: "Reversibility", value: "Reversible", note: "IP block can be lifted" },
    ],
    decision: "ACT",
    decisionColor: "text-state-act",
    policyRule: "Rule 8: ALL_GATES_PASSED → ACT",
    trace: `{
  "alert_id": "SSH-2026-0412",
  "decision": "EXECUTED",
  "confidence": 0.92,
  "epistemic_risk": 0.11,
  "failures_detected": [],
  "policy_rule": "ALL_GATES_PASSED",
  "action": "block_ip",
  "reversible": true,
  "audit_hash": "sha256:a4f2c8..."
}`,
    takeaway: "High confidence + well-grounded + reversible action = autonomous execution. The agent earned the right to act.",
  },
  {
    id: "compliance",
    icon: ClipboardCheck,
    title: "Compliance Audit",
    subtitle: "Agent evaluates data access policy violation",
    scenario: "An employee accessed a restricted dataset outside business hours. The agent must decide whether to revoke access (irreversible for the session), flag for review, or wait for more context.",
    signals: [
      { name: "Confidence", value: "0.68", note: "Pattern matches policy violation, but context is ambiguous" },
      { name: "Grounding", value: "0.72", note: "Access logs confirm time and dataset, but role context missing" },
      { name: "Contradiction", value: "0.15", note: "Agent A suggests insider threat; Agent B suggests legitimate overtime" },
      { name: "Temporal", value: "Aligned", note: "Access occurred 8 minutes ago" },
      { name: "Reversibility", value: "Irreversible", note: "Session revocation cannot be undone mid-session" },
    ],
    decision: "ESCALATE",
    decisionColor: "text-state-escalate",
    policyRule: "Rule 7: INSUFFICIENT_CONFIDENCE_FOR_ACT → ESCALATE",
    trace: `{
  "alert_id": "DLP-2026-0891",
  "decision": "ESCALATED",
  "confidence": 0.68,
  "epistemic_risk": 0.34,
  "failures_detected": [],
  "policy_rule": "INSUFFICIENT_CONFIDENCE_FOR_ACT",
  "action": "escalate_to_analyst",
  "context": "Role information missing from evidence",
  "audit_hash": "sha256:b7e1d3..."
}`,
    takeaway: "Moderate confidence + irreversible action + missing context = escalate to human. The agent knows it doesn't know enough.",
  },
  {
    id: "incident",
    icon: Siren,
    title: "Incident Response",
    subtitle: "Auto-response agent encounters contradictory signals",
    scenario: "Two monitoring systems report conflicting data: one shows a DDoS attack in progress, the other shows normal traffic with a CDN misconfiguration. The agent must decide whether to activate DDoS mitigation.",
    signals: [
      { name: "Confidence", value: "0.41", note: "Low — models disagree on root cause" },
      { name: "Grounding", value: "0.35", note: "Evidence supports both interpretations equally" },
      { name: "Contradiction", value: "0.78", note: "High — antonym pairs: 'attack' vs 'misconfiguration'" },
      { name: "Temporal", value: "Misaligned", note: "One source is 4 minutes stale" },
      { name: "Reversibility", value: "Partially", note: "DDoS mitigation may drop legitimate traffic" },
    ],
    decision: "DEFER",
    decisionColor: "text-state-defer",
    policyRule: "Rule 3: HIGH_EPISTEMIC_RISK → DEFER",
    trace: `{
  "alert_id": "NET-2026-1204",
  "decision": "DEFERRED",
  "confidence": 0.41,
  "epistemic_risk": 0.67,
  "failures_detected": ["CONTRADICTORY_HYPOTHESES"],
  "policy_rule": "HIGH_EPISTEMIC_RISK",
  "action": "defer_gather_context",
  "next_steps": "Re-evaluate after CDN status check",
  "audit_hash": "sha256:c9a4f1..."
}`,
    takeaway: "Contradictory signals + low confidence + high epistemic risk = defer. Acting on conflicting data is worse than waiting.",
  },
];

const ArgusExamples = () => (
  <div>
    {/* Hero */}
    <section className="px-6 pt-24 pb-16 md:pt-32 md:pb-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6 text-foreground">
          Argus Examples
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Three real-world scenarios showing how Argus extracts signals, evaluates policy, and produces
          auditable decision traces — each ending in a different decision state.
        </p>
      </div>
    </section>

    {/* Examples */}
    <section className="px-6 pb-24">
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="threat">
          <TabsList className="grid grid-cols-3 w-full mb-8">
            <TabsTrigger value="threat" className="text-xs sm:text-sm">Threat Detection</TabsTrigger>
            <TabsTrigger value="compliance" className="text-xs sm:text-sm">Compliance Audit</TabsTrigger>
            <TabsTrigger value="incident" className="text-xs sm:text-sm">Incident Response</TabsTrigger>
          </TabsList>

          {examples.map((ex) => (
            <TabsContent key={ex.id} value={ex.id}>
              <div className="space-y-8">
                {/* Scenario */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <ex.icon className="h-6 w-6 text-primary" />
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">{ex.title}</h2>
                      <p className="text-sm text-muted-foreground">{ex.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{ex.scenario}</p>
                </div>

                {/* Signals Extracted */}
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wide">Signals Extracted</h3>
                  <div className="space-y-2">
                    {ex.signals.map((s) => (
                      <div key={s.name} className="flex items-start gap-4 border border-border rounded-lg p-3 card-hover">
                        <div className="min-w-[120px]">
                          <p className="text-sm font-medium text-foreground">{s.name}</p>
                          <p className="text-sm font-mono text-primary">{s.value}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{s.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Decision */}
                <div className="border border-border rounded-lg p-5 bg-secondary/20">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Decision</span>
                    <span className={`font-mono font-semibold text-lg ${ex.decisionColor}`}>{ex.decision}</span>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground mb-3">{ex.policyRule}</p>
                  <p className="text-sm text-muted-foreground italic">{ex.takeaway}</p>
                </div>

                {/* Decision Trace */}
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wide">Decision Trace</h3>
                  <pre className="border border-border rounded-lg p-5 bg-secondary/20 font-mono text-xs text-muted-foreground overflow-x-auto">
                    {ex.trace}
                  </pre>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-10 flex gap-6">
          <Link to="/argus" className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:gap-2 transition-all">
            Argus Overview <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link to="/framework/decision-states" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Decision States <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default ArgusExamples;
