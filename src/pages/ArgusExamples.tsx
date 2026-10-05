import { Link } from "react-router-dom";
import { ArrowRight, Shield, MailWarning, Siren } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/* Scenarios follow KAIROS-SEC-004 (use cases 1, 7 and 2/3), read under the v2 design. */
const examples = [
  {
    id: "threat",
    icon: Shield,
    title: "Brute force",
    subtitle: "Clear evidence, but the obvious response is Tier 2",
    scenario: "47 failed SSH logins from an external IP in three minutes, then one success on admin@corp.local. The evidence is strong and the hypotheses agree. The candidate responses are to watch-list the IP, revoke the admin's sessions, or block the IP at the firewall.",
    checks: [
      { name: "G1 · Structural", value: "PASS", note: "Path from the internet-facing bastion to the admin host exists in the topology graph" },
      { name: "G2 · ĉ(h)", value: "0.93 ≥ τ₁", note: "Calibrated against certificate CAL-2026-10-01 (ECE 0.06)" },
      { name: "G3 · U_traj", value: "0.18 ≤ κ", note: "Two-step investigation, low inherited uncertainty" },
      { name: "Provenance", value: "TAINTED", note: "Justification depends on `ip` and `user`, both attacker-influenceable fields" },
      { name: "Tier", value: "1 · 1 · 2", note: "Watch-list (T1), revoke sessions (T1), firewall block (T2, STATE_CHANGE)" },
    ],
    decision: "ACT + ESCALATE",
    decisionColor: "text-state-escalate",
    policyRule: "Tier 1 steps: ALL_GATES_PASSED → ACT with token · Firewall block: TAINTED_JUSTIFICATION + TIER_2_DUAL_KEY → ESCALATE",
    trace: `{
  "schema_version": "2.0.0",
  "hypothesis_id": "H-2026-10-05-0412-1",
  "action": { "type": "firewall_block", "target": "ip:185.22.11.9", "tier": 2, "sink": "STATE_CHANGE" },
  "gates": {
    "g1_structural":            { "result": "PASS" },
    "g2_calibrated_confidence": { "c_hat": 0.93, "tau_r": 0.90, "result": "PASS" },
    "g3_trajectory":            { "u_traj": 0.18, "kappa_r": 0.25, "result": "PASS" },
    "provenance_veto":          { "taint_ids": ["T-0412-01", "T-0412-02"], "result": "VETO" }
  },
  "escalation_reasons": ["TAINTED_JUSTIFICATION", "TIER_2_DUAL_KEY"],
  "decision": "ESCALATE",
  "related_actions": [
    { "type": "watchlist_add",  "tier": 1, "decision": "ACT", "capability_token_id": "CT-7f3a…" },
    { "type": "revoke_sessions","tier": 1, "decision": "ACT", "capability_token_id": "CT-91c2…" }
  ]
}`,
    takeaway: "High confidence does not buy a Tier 2 action. The reversible steps contain the threat right away, while the block waits for two approvers who can see why the justification is tainted.",
  },
  {
    id: "injection",
    icon: MailWarning,
    title: "Injected email",
    subtitle: "Indirect prompt injection in telemetry",
    scenario: "A reported phishing email contains hidden text addressed to 'the security assistant', asking it to allow-list the sender domain and forward the original to an outside address. In v1 nothing matched the injection patterns.",
    checks: [
      { name: "NCE", value: "k = 3", note: "H1 credential phishing · H2 benign IT notice · H3 injection attempt against the triage agent" },
      { name: "Semantic firewall", value: "FLAGGED", note: "Instruction-like content addressed to an assistant. A detector, not a boundary" },
      { name: "Provenance", value: "TAINTED", note: "Allow-list and forward are justified only by the email body (taint T-107-04)" },
      { name: "Tier / sink", value: "2 · 3", note: "Allow-list: Tier 2, STATE_CHANGE · Forward: Tier 3, EGRESS" },
      { name: "Alternative", value: "UNTAINTED", note: "Quarantine for all recipients rests on the TRUSTED mail-gateway verdict (Tier 1)" },
    ],
    decision: "ESCALATE",
    decisionColor: "text-state-escalate",
    policyRule: "Allow-list, forward: TAINTED_JUSTIFICATION → ESCALATE · Quarantine: ALL_GATES_PASSED → ACT",
    trace: `{
  "alert_id": "ALERT-2026-107",
  "actions": [
    { "type": "allowlist_domain", "tier": 2, "sink": "STATE_CHANGE",
      "taint_ids": ["T-107-04"], "decision": "ESCALATE", "rule": "TAINTED_JUSTIFICATION" },
    { "type": "forward_email",    "tier": 3, "sink": "EGRESS",
      "taint_ids": ["T-107-04"], "decision": "ESCALATE", "rule": "TAINTED_JUSTIFICATION" },
    { "type": "quarantine_msg",   "tier": 1, "sink": "STATE_CHANGE",
      "taint_ids": [], "decision": "ACT", "capability_token_id": "CT-a0d4…" }
  ],
  "semantic_firewall_flags": ["instruction_addressed_to_agent"],
  "audit": { "record_hash": "sha256:4be1…", "prev_hash": "sha256:9c07…" }
}`,
    takeaway: "The injection never had to be detected for the attack to fail. An action whose justification depends on the email body cannot reach a sink without a human: the lesson of EchoLeak and ForcedLeak.",
  },
  {
    id: "incident",
    icon: Siren,
    title: "Conflicting telemetry",
    subtitle: "DDoS, or a CDN misconfiguration?",
    scenario: "One monitor shows a DDoS in progress; another shows normal traffic with a CDN misconfiguration. Mitigation would drop some legitimate traffic. The models agree they cannot tell which it is.",
    checks: [
      { name: "NCE", value: "k = 3", note: "H1 volumetric DDoS · H2 CDN misconfiguration (benign) · H3 both" },
      { name: "Level 1", value: "U_epi low · U_ale high", note: "Models agree; the telemetry itself can't separate H1 from H2" },
      { name: "Retrieval", value: "budget spent", note: "CRAG corrective retrieval did not reduce aleatoric uncertainty" },
      { name: "G2 · ĉ(h)", value: "0.48 < τ₂", note: "Calibrated confidence for the leading hypothesis is well below threshold" },
      { name: "Tier", value: "2", note: "DDoS mitigation profile: reversible, with business impact" },
    ],
    decision: "DEFER",
    decisionColor: "text-state-defer",
    policyRule: "ALEATORIC_UNCERTAINTY_RESIDUAL → DEFER with telemetry request",
    trace: `{
  "alert_id": "NET-2026-1204",
  "decision": "DEFER",
  "triggered_rule": "ALEATORIC_UNCERTAINTY_RESIDUAL",
  "uncertainty": { "u_tot": 0.71, "u_epi": 0.09, "u_ale": 0.62 },
  "evidence_gap_report": {
    "what_is_missing": "CDN edge logs for the affected POPs, 14:00–14:10 UTC",
    "where_to_obtain": "CDN provider log API",
    "discriminates":   ["H1 volumetric DDoS", "H2 CDN misconfiguration"],
    "request_type":    "telemetry"
  }
}`,
    takeaway: "\"I don't know\" becomes a work item. The deferral names the one log source that would separate the two stories, instead of mitigating on a guess.",
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
          Three SOC scenarios run through the Kairos v2 gates, each with its auditable decision trace.
          Several end in more than one outcome, because each proposed action is gated separately.
        </p>
      </div>
    </section>

    {/* Examples */}
    <section className="px-6 pb-24">
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="threat">
          <TabsList className="grid grid-cols-3 w-full mb-8">
            {examples.map((ex) => (
              <TabsTrigger key={ex.id} value={ex.id} className="text-xs sm:text-sm">{ex.title}</TabsTrigger>
            ))}
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

                {/* Gate checks */}
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wide">Gate checks</h3>
                  <div className="space-y-2">
                    {ex.checks.map((s) => (
                      <div key={s.name} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 border border-border rounded-lg p-3 card-hover">
                        <div className="sm:min-w-[150px]">
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
                  <h3 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wide">Policy trace</h3>
                  <pre className="border border-border rounded-lg p-5 bg-secondary/20 font-mono text-xs text-muted-foreground overflow-x-auto">
                    {ex.trace}
                  </pre>
                  <p className="text-xs text-muted-foreground mt-2">Illustrative values. v2 trace format; see Templates/policy-trace.template.json in kairos-core.</p>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-10 flex flex-wrap gap-6">
          <Link to="/argus-xdr/overview" className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:gap-2 transition-all">
            Argus Overview <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link to="/kairos/decision-states" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Decision States <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default ArgusExamples;
