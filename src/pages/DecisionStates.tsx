import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const states = [
  {
    id: "act",
    name: "ACT",
    color: "bg-state-act",
    textColor: "text-state-act",
    borderColor: "border-state-act/30",
    when: "All epistemic gates pass. Confidence is high, evidence is well-grounded, risk is acceptable, and the action is reversible or low-impact.",
    example: {
      scenario: "Malware signature detection",
      detail: "Known malware hash matched with 99% confidence across multiple EDR sources. Action: quarantine file. Reversible. No contradiction signals.",
    },
    conditions: [
      "Confidence ≥ 0.80",
      "No epistemic failures detected",
      "Risk score < 0.60",
      "Evidence confidence ≥ 0.40",
    ],
    policyRule: "Rule 8: ALL_GATES_PASSED → ACT",
  },
  {
    id: "escalate",
    name: "ESCALATE",
    color: "bg-state-escalate",
    textColor: "text-state-escalate",
    borderColor: "border-state-escalate/30",
    when: "The system has enough information to form an assessment but not enough certainty to act autonomously. Human judgment is needed.",
    example: {
      scenario: "Anomalous API access pattern",
      detail: "71% confidence — API calls from unusual geo at unusual hour. Non-reversible action (account suspension). Escalated to SOC analyst with full epistemic context.",
    },
    conditions: [
      "Confidence between 0.40 and 0.80",
      "Risk score ≥ 0.60 (high risk)",
      "No critical epistemic failures",
      "Evidence is partially grounded",
    ],
    policyRule: "Rule 6: HIGH_RISK_ESCALATE or Rule 7: INSUFFICIENT_CONFIDENCE_FOR_ACT → ESCALATE",
  },
  {
    id: "defer",
    name: "DEFER",
    color: "bg-state-defer",
    textColor: "text-state-defer",
    borderColor: "border-state-defer/30",
    when: "Information is insufficient to form a reliable assessment. The system needs more context before any decision — human or autonomous — can be made.",
    example: {
      scenario: "Unusual network pattern, missing baseline",
      detail: "New user account showing atypical traffic. No historical baseline exists. Evidence confidence 0.32. System defers and requests additional context gathering.",
    },
    conditions: [
      "Epistemic risk ≥ 0.60",
      "Evidence confidence < 0.40",
      "Any non-critical epistemic failure detected",
      "Processing error or timeout",
    ],
    policyRule: "Rules 3–5: HIGH_EPISTEMIC_RISK / LOW_EVIDENCE_CONFIDENCE / EPISTEMIC_FAILURES_PRESENT → DEFER",
  },
  {
    id: "fail-safe",
    name: "FAIL_SAFE",
    color: "bg-state-fail-safe",
    textColor: "text-state-fail-safe",
    borderColor: "border-state-fail-safe/30",
    when: "Fundamental epistemic breakdown. The system cannot trust its own reasoning. Processing must halt immediately.",
    example: {
      scenario: "Signal contradiction + degenerate output",
      detail: "Both LLM agents produced byte-identical outputs — zero independent reasoning. Simultaneously, evidence fields are missing. System enters FAIL_SAFE: halts processing, emits safe default, logs for forensic review.",
    },
    conditions: [
      "DEGENERATE_OUTPUT failure detected",
      "MISSING_EVIDENCE failure detected",
      "force_fail flag set",
      "Critical invariant violation",
    ],
    policyRule: "Rules 1–2: FORCED_FAIL / CRITICAL_EPISTEMIC_FAILURE → FAIL_SAFE",
  },
];

const policyRules = [
  { num: 1, rule: "FORCED_FAIL", condition: "force_fail=True", decision: "FAIL_SAFE" },
  { num: 2, rule: "CRITICAL_EPISTEMIC_FAILURE", condition: "DEGENERATE_OUTPUT or MISSING_EVIDENCE", decision: "FAIL_SAFE" },
  { num: 3, rule: "HIGH_EPISTEMIC_RISK", condition: "epistemic_risk ≥ 0.60", decision: "DEFER" },
  { num: 4, rule: "LOW_EVIDENCE_CONFIDENCE", condition: "evidence_confidence < 0.40", decision: "DEFER" },
  { num: 5, rule: "EPISTEMIC_FAILURES_PRESENT", condition: "any failure detected", decision: "DEFER" },
  { num: 6, rule: "HIGH_RISK_ESCALATE", condition: "risk_score ≥ 0.60", decision: "ESCALATE" },
  { num: 7, rule: "INSUFFICIENT_CONFIDENCE_FOR_ACT", condition: "confidence < 0.80", decision: "ESCALATE" },
  { num: 8, rule: "ALL_GATES_PASSED", condition: "—", decision: "ACT" },
];

const decisionColor = (d: string) =>
  d === "ACT" ? "text-state-act" : d === "ESCALATE" ? "text-state-escalate" : d === "DEFER" ? "text-state-defer" : "text-state-fail-safe";

const DecisionStates = () => (
  <div>
    {/* Hero */}
    <section className="px-6 pt-24 pb-16 md:pt-32 md:pb-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6 text-foreground">
          Decision States
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Every decision in the Kairos pipeline resolves to one of four terminal states. Each state represents
          a distinct epistemic conclusion about the system's ability to act.
        </p>
      </div>
    </section>

    {/* State Tabs */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <Tabs defaultValue="act">
          <TabsList className="grid grid-cols-4 w-full mb-8">
            {states.map((s) => (
              <TabsTrigger key={s.id} value={s.id} className="text-xs sm:text-sm font-mono">
                {s.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {states.map((s) => (
            <TabsContent key={s.id} value={s.id}>
              <div className={`border rounded-lg p-6 ${s.borderColor}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`inline-block w-3 h-3 rounded-full ${s.color}`} />
                  <h3 className={`text-xl font-mono font-semibold ${s.textColor}`}>{s.name}</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">When to use</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.when}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Example</p>
                    <div className="border border-border rounded-lg p-4 bg-secondary/20">
                      <p className="text-sm font-medium text-foreground mb-1">{s.example.scenario}</p>
                      <p className="text-sm text-muted-foreground">{s.example.detail}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Trigger conditions</p>
                    <ul className="space-y-1">
                      {s.conditions.map((c, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-muted-foreground/50 mt-0.5">•</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-mono text-muted-foreground">{s.policyRule}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>

    {/* Policy Table */}
    <section className="px-6 pb-24">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Decision Policy</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Ordered rules, first match wins. LLM output has zero path into this module.
        </p>
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Rule</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Decision</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policyRules.map((r) => (
                <TableRow key={r.num}>
                  <TableCell className="font-mono text-muted-foreground">{r.num}</TableCell>
                  <TableCell className="font-mono text-sm">{r.rule}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.condition}</TableCell>
                  <TableCell className={`font-mono font-medium ${decisionColor(r.decision)}`}>{r.decision}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-8 flex gap-6">
          <Link to="/framework/signal-reference" className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:gap-2 transition-all">
            Signal Reference <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link to="/problem" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Back to the Problem <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default DecisionStates;
