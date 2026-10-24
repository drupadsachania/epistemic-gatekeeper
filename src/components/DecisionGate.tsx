/**
 * DecisionGate.tsx — interactive model of ETRA-v2 Figure 2:
 * Gate 1 structural → Gate 2 calibrated confidence → Gate 3 trajectory → provenance veto → risk-tier routing.
 * Outcomes: ACT / DEFER / ESCALATE, plus INVALID (back to Orient). Colours come from theme tokens, so the
 * canvas redraws for light and dark. Styles: src/styles/home.css (.dg-*).
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '@/lib/kairos';

type Tier = 0 | 1 | 2 | 3;

interface GateInputs {
  intact:    boolean;   // reasoning integrity: false = degenerate output or missing required evidence
  feasible:  boolean;   // Gate 1 — structural simulation engine
  cHat:      number;    // Gate 2 — calibrated confidence ĉ(h)
  uTraj:     number;    // Gate 3 — propagated trajectory uncertainty
  tainted:   boolean;   // justification depends on UNTRUSTED inputs
  certified: boolean;   // calibration certificate valid for this deployment
  tier:      Tier;      // action risk tier
}

/* Illustrative thresholds. In a deployment τ_r is derived by risk control
   on adjudicated incidents, not hand-set (KAIROS-004 §5.4). */
const TAU:   Record<Tier, number> = { 0: 0.70, 1: 0.85, 2: 0.90, 3: 0.95 };
const KAPPA: Record<Tier, number> = { 0: 0.50, 1: 0.35, 2: 0.25, 3: 0.20 };

const TIER_INFO: Record<Tier, { name: string; example: string; sink: string }> = {
  0: { name: 'Observe-only',          example: 'enrichment, read-only query',     sink: 'READ_ONLY'    },
  1: { name: 'Reversible, local',     example: 'watch-list, revoke one session',  sink: 'STATE_CHANGE' },
  2: { name: 'Reversible, impactful', example: 'isolate host, disable account',   sink: 'STATE_CHANGE' },
  3: { name: 'Irreversible',          example: 'mass reset, external notice',     sink: 'EGRESS'       },
};

type Outcome = 'ACT' | 'DEFER' | 'ESCALATE' | 'INVALID' | 'FAIL_SAFE';
type GateKey = 'g1' | 'g2' | 'g3' | 'veto' | 'tier';
type GateState = 'pass' | 'fail' | 'skip' | 'na';

interface Verdict {
  outcome:   Outcome;
  stopAt:    GateKey | 'h' | 'out';
  headline:  string;
  reasons:   string[];
  authority: string;
  gates:     Record<GateKey, GateState>;
}

function sub(t: Tier) { return '₀₁₂₃'[t]; }

function evaluateGates(i: GateInputs): Verdict {
  const tau = TAU[i.tier];
  const kap = KAPPA[i.tier];
  const gates: Record<GateKey, GateState> = { g1: 'skip', g2: 'skip', g3: 'skip', veto: 'skip', tier: 'skip' };

  // Critical epistemic failure — evaluated before any gate (policy rules 1–2).
  if (!i.intact) {
    return {
      outcome: 'FAIL_SAFE', stopAt: 'h', gates,
      headline: 'The system cannot trust its own reasoning.',
      reasons: ['Degenerate model output or a missing required evidence field. Nothing downstream is evaluated.'],
      authority: 'All actions blocked; senior analyst and system-health review',
    };
  }

  // Gate 1 — structurally impossible hypotheses go back to Orient.
  if (!i.feasible) {
    gates.g1 = 'fail';
    return {
      outcome: 'INVALID', stopAt: 'g1', gates,
      headline: 'Attack path impossible under the topology or identity graph.',
      reasons: ['Returned to Orient as a negative constraint (bounded re-orient, at most twice).'],
      authority: 'No action proposed',
    };
  }
  gates.g1 = 'pass';

  // Gate 2 — only meaningful with a certified calibration map.
  if (i.certified) {
    if (i.cHat < tau) {
      gates.g2 = 'fail';
      return {
        outcome: 'DEFER', stopAt: 'g2', gates,
        headline: `ĉ(h) ${i.cHat.toFixed(2)} is below τ${sub(i.tier)} ${tau.toFixed(2)}.`,
        reasons: [],   // the evidence-gap report below carries the detail
        authority: 'No action; a work item for an analyst',
      };
    }
    gates.g2 = 'pass';
  } else {
    gates.g2 = i.tier === 0 ? 'na' : 'fail';
  }

  // Everything below can only escalate. Collect every reason for the approver (KAIROS-006 §5.2).
  const reasons: string[] = [];
  let stopAt: GateKey | 'out' = 'out';
  const first = (k: GateKey) => { if (stopAt === 'out') stopAt = k; };

  if (i.uTraj > kap) {
    gates.g3 = 'fail'; first('g3');
    reasons.push(`U_traj ${i.uTraj.toFixed(2)} exceeds κ${sub(i.tier)} ${kap.toFixed(2)}: upstream steps may have contaminated the conclusion.`);
  } else gates.g3 = 'pass';

  if (i.tainted && i.tier > 0) {
    gates.veto = 'fail'; first('veto');
    reasons.push(`A tainted justification reaches a ${TIER_INFO[i.tier].sink} sink: confidence cannot launder taint.`);
  } else gates.veto = i.tainted ? 'na' : 'pass';

  if (!i.certified && i.tier > 0) {
    first('g2');
    reasons.push('No valid calibration certificate: Tier 1 and above fall back to ESCALATE.');
  }

  if (i.tier === 3) {
    gates.tier = 'fail'; first('tier');
    reasons.push('Tier 3 is human-only: the agent may prepare, never execute.');
  } else if (i.tier === 2) {
    gates.tier = 'fail'; first('tier');
    reasons.push('Tier 2 needs dual-key human approval.');
  } else gates.tier = 'pass';

  if (reasons.length > 0) {
    return {
      outcome: 'ESCALATE', stopAt, gates,
      headline: reasons[0].split(':')[0] + '.',
      reasons,
      authority: i.tier === 2 ? 'Dual-key approval, then a signed token'
               : i.tier === 3 ? 'A person executes'
               : 'Human review with the trajectory trace',
    };
  }

  return {
    outcome: 'ACT', stopAt: 'out', gates,
    headline: i.tier === 0 ? 'Every gate passed; no state change.' : 'Every gate passed, within tier.',
    reasons: i.tainted ? ['Taint is permitted here: Tier 0 reaches a READ_ONLY sink.'] : [],
    authority: i.tier === 0 ? 'Executes directly' : 'Signed capability token, single use, five minutes',
  };
}

interface Scenario { label: string; tag: string; story: string; gap?: string[]; inputs: GateInputs }

/* Scenarios follow KAIROS-SEC-004 use cases. Values are illustrative. */
const SCENARIOS: Record<string, Scenario> = {
  earned: {
    label: 'Earned: watch-list', tag: 'ACT',
    story: 'Known-bad domain seen from one workstation. Trusted EDR evidence, a certified model, and a reversible Tier 1 action: watch-list the domain.',
    inputs: { intact: true, feasible: true, cHat: 0.91, uTraj: 0.22, tainted: false, certified: true, tier: 1 },
  },
  gap: {
    label: 'Telemetry gap', tag: 'DEFER',
    story: 'Admin login from an unusual country at 03:14. The models agree they cannot tell legitimate travel from a stolen credential; the telemetry does not separate the two.',
    gap: [
      'VPN connection history for the account over the last 30 days · source: VPN gateway',
      'Travel or leave record for the user · source: HR system',
      'Whether MFA was satisfied on this login · source: identity provider',
    ],
    inputs: { intact: true, feasible: true, cHat: 0.71, uTraj: 0.31, tainted: false, certified: true, tier: 1 },
  },
  injected: {
    label: 'Injected email', tag: 'veto',
    story: 'A reported phishing email hides text telling "the security assistant" to allow-list the sender. Confidence is high, but the justification rests on the untrusted email body.',
    inputs: { intact: true, feasible: true, cHat: 0.96, uTraj: 0.18, tainted: true, certified: true, tier: 1 },
  },
  infeasible: {
    label: 'Air-gapped path', tag: 'INVALID',
    story: 'The leading hypothesis needs lateral movement into an air-gapped OT segment with an account that has no logon rights there. The path cannot exist.',
    inputs: { intact: true, feasible: false, cHat: 0.88, uTraj: 0.20, tainted: false, certified: true, tier: 2 },
  },
  handoff: {
    label: 'Lost at a hand-off', tag: 'G3',
    story: 'Three sub-agents investigated DNS, proxy and EDR logs. A 40%-sampled DNS log became "confirmed beaconing" in the summary; each step looked fine, the conclusion did not.',
    inputs: { intact: true, feasible: true, cHat: 0.90, uTraj: 0.46, tainted: false, certified: true, tier: 1 },
  },
  isolate: {
    label: 'Isolate a host', tag: 'dual-key',
    story: 'Known malware confirmed on a workstation. Every gate passes, but host isolation is Tier 2: reversible, with business impact.',
    inputs: { intact: true, feasible: true, cHat: 0.97, uTraj: 0.15, tainted: false, certified: true, tier: 2 },
  },
  drift: {
    label: 'Model upgraded', tag: 'uncertified',
    story: 'One model in the ensemble was upgraded. The calibration certificate no longer covers the deployment, so confidence scores have no certified meaning.',
    inputs: { intact: true, feasible: true, cHat: 0.92, uTraj: 0.20, tainted: false, certified: false, tier: 1 },
  },
  degenerate: {
    label: 'Degenerate output', tag: 'FAIL_SAFE',
    story: 'One agent loops ("the the the …", repetition ratio 0.64) while analysing PowerShell on a domain controller. The reasoning component itself has failed.',
    inputs: { intact: false, feasible: true, cHat: 0.80, uTraj: 0.30, tainted: false, certified: true, tier: 2 },
  },
};

const GENERIC_GAP = [
  'The observation that would discriminate the leading hypothesis from the benign one',
  'Where it can be obtained, and which system owns it',
];

/** The single input worth changing next, so the visitor learns by flipping it. */
function nextStep(i: GateInputs, v: Verdict): string {
  switch (v.outcome) {
    case 'FAIL_SAFE': return 'Set reasoning integrity back to intact. Until the reasoning itself is sound, no gate is evaluated.';
    case 'INVALID':   return 'Switch G1 to feasible. A hypothesis has to be possible under the topology before confidence counts for anything.';
    case 'DEFER':     return `Raise ĉ(h) to ${TAU[i.tier].toFixed(2)} or more, which in practice means gathering the missing evidence, not lowering the threshold.`;
    case 'ESCALATE':
      if (i.tier >= 2) return `No input makes a Tier ${i.tier} action autonomous: that is the point. Try Tier 1 to see the same evidence earn an ACT.`;
      if (i.tainted) return 'Switch provenance to trusted only. Re-deriving the justification from trusted evidence lifts the veto; more confidence never does.';
      if (!i.certified) return 'Set calibration to valid. Recertifying the deployment restores Tier 1 autonomy.';
      return `Lower U_traj to ${KAPPA[i.tier].toFixed(2)} or less by re-running the step that added the most inherited uncertainty.`;
    case 'ACT':       return 'Now switch to Tier 2: the same evidence no longer makes the action autonomous.';
  }
}



const OUTCOME_CLASS: Record<Outcome, string> = {
  ACT: 'k-outcome--act', DEFER: 'k-outcome--defer', ESCALATE: 'k-outcome--escalate', INVALID: 'k-outcome--invalid', FAIL_SAFE: 'k-outcome--failsafe',
};
const OUTCOME_TOKEN: Record<Outcome, string> = {
  ACT: '--k-outcome-act', DEFER: '--k-outcome-defer', ESCALATE: '--k-outcome-escalate', INVALID: '--k-outcome-invalid', FAIL_SAFE: '--k-outcome-failsafe',
};
const OUTCOME_WORD: Record<Outcome, string> = { ACT: 'Act.', DEFER: 'Defer.', ESCALATE: 'Escalate.', INVALID: 'Re-orient.', FAIL_SAFE: 'Halt.' };
const EXIT_LABEL: Record<Outcome, string> = { INVALID: '↺ ORIENT', DEFER: 'DEFER', ESCALATE: 'ESCALATE', ACT: '', FAIL_SAFE: 'FAIL-SAFE' };

/* ── CANVAS ─────────────────────────────────────────────────────────────── */

const NODE_ORDER: Array<{ key: GateKey | 'h' | 'out'; label: string; sub: string }> = [
  { key: 'h',    label: 'h',    sub: 'hypothesis' },
  { key: 'g1',   label: 'G1',   sub: 'structural' },
  { key: 'g2',   label: 'G2',   sub: 'calibrated' },
  { key: 'g3',   label: 'G3',   sub: 'trajectory' },
  { key: 'veto', label: 'VETO', sub: 'provenance' },
  { key: 'tier', label: 'TIER', sub: 'routing' },
  { key: 'out',  label: 'ACT',  sub: 'tool gateway' },
];

function rgba(hex: string, a: number): string {
  const h = hex.trim().replace('#', '');
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const v = parseInt(n, 16);
  if (Number.isNaN(v)) return hex;
  return `rgba(${(v >> 16) & 255},${(v >> 8) & 255},${v & 255},${a})`;
}

function GateCanvas({ verdict }: { verdict: Verdict }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const [theme] = useTheme();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const css = getComputedStyle(canvas);
    const tok = (name: string) => css.getPropertyValue(name).trim();
    const C = {
      line:   tok('--k-color-line'),
      text:   tok('--k-color-text'),
      subtle: tok('--k-color-text-subtle'),
      bg:     tok('--k-color-bg'),
      out:    tok(OUTCOME_TOKEN[verdict.outcome]),
    };
    const mono = (w: number, s: number) => `${w} ${s}px "Red Hat Mono", ui-monospace, monospace`;

    function resize() {
      const r = canvas!.getBoundingClientRect();
      canvas!.width = r.width * dpr;
      canvas!.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const stopIdx = NODE_ORDER.findIndex((n) => n.key === verdict.stopAt);

    function draw(t: number) {
      const r = canvas!.getBoundingClientRect();
      const W = r.width, H = r.height;
      ctx.clearRect(0, 0, W, H);

      // Horizontal pipeline on wide canvases, vertical on narrow ones.
      const vertical = W < 520;
      const n = NODE_ORDER.length;
      const pts = NODE_ORDER.map((_, i) => {
        const f = i / (n - 1);
        return vertical ? { x: W * 0.5, y: 48 + (H - 88) * f } : { x: 44 + (W - 88) * f, y: H * 0.42 };
      });

      // Edges: 1.5 px strokes; the travelled path takes the outcome colour (the one point the diagram makes).
      for (let i = 0; i < n - 1; i++) {
        const a = pts[i], b = pts[i + 1];
        const live = i < stopIdx;
        ctx.setLineDash(live ? [] : [3, 5]);
        ctx.strokeStyle = live ? C.out : C.line;
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      ctx.setLineDash([]);

      // Packets along the travelled path (static dots under reduced motion).
      const travel = Math.max(stopIdx, 1);
      for (let p = 0; p < (stopIdx > 0 ? 4 : 0); p++) {
        const ph = reduced ? (p + 0.5) / 4 : ((t * 0.00016) + p / 4) % 1;
        const pos = ph * travel;
        const seg = Math.min(Math.floor(pos), travel - 1);
        const f = pos - seg;
        const a = pts[seg], b = pts[seg + 1];
        ctx.fillStyle = rgba(C.out, reduced ? 0.7 : 0.25 + 0.6 * Math.sin(Math.PI * ph));
        ctx.beginPath(); ctx.arc(a.x + (b.x - a.x) * f, a.y + (b.y - a.y) * f, 2.5, 0, Math.PI * 2); ctx.fill();
      }

      // Nodes: discs for h and the tool gateway, diamonds for checks (the eyebrow motif).
      NODE_ORDER.forEach((node, i) => {
        const { x, y } = pts[i];
        const isStop = i === stopIdx;
        const reached = i <= stopIdx;
        const state = node.key === 'h' ? 'pass'
          : node.key === 'out' ? (verdict.outcome === 'ACT' ? 'pass' : 'skip')
          : verdict.gates[node.key as GateKey];
        const stroke = isStop ? C.out : reached ? C.text : C.line;
        const R = node.key === 'h' || node.key === 'out' ? 10 : 13;

        const path = new Path2D();
        if (node.key === 'h' || node.key === 'out') path.arc(x, y, R, 0, Math.PI * 2);
        else { path.moveTo(x, y - R); path.lineTo(x + R, y); path.lineTo(x, y + R); path.lineTo(x - R, y); path.closePath(); }
        ctx.fillStyle = isStop ? rgba(C.out, 0.16) : C.bg;
        ctx.fill(path);
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1.5;
        ctx.stroke(path);

        const mark = state === 'fail' ? '×' : state === 'pass' && reached && node.key !== 'h' ? '✓' : state === 'na' ? '–' : '';
        if (mark) {
          ctx.font = mono(500, 10); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillStyle = isStop ? C.out : C.text;
          ctx.fillText(mark, x, y + 1);
        }

        ctx.textBaseline = 'middle';
        ctx.fillStyle = reached ? C.text : C.subtle;
        ctx.font = mono(500, 11);
        if (vertical) {
          ctx.textAlign = 'left';
          ctx.fillText(node.label, x + 24, y - 6);
          ctx.fillStyle = C.subtle; ctx.font = mono(400, 10);
          ctx.fillText(node.sub, x + 24, y + 8);
        } else {
          ctx.textAlign = 'center';
          ctx.fillText(node.label, x, y - R - 14);
          ctx.fillStyle = C.subtle; ctx.font = mono(400, 10);
          ctx.fillText(node.sub, x, y + R + 14);
        }
      });

      // Exit branch: downward when horizontal, to the empty left side when vertical.
      if (verdict.outcome !== 'ACT' && stopIdx >= 0) {
        const { x, y } = pts[stopIdx];
        ctx.strokeStyle = C.out; ctx.lineWidth = 1.5;
        ctx.beginPath();
        if (vertical) { ctx.moveTo(x - 18, y); ctx.lineTo(18, y); }
        else          { ctx.moveTo(x, y + 30); ctx.lineTo(x, y + 62); }
        ctx.stroke();
        ctx.fillStyle = C.out; ctx.font = mono(500, 11);
        ctx.textAlign = vertical ? 'left' : 'center';
        if (vertical) ctx.fillText(EXIT_LABEL[verdict.outcome], 18, y - 11);
        else          ctx.fillText(EXIT_LABEL[verdict.outcome], x, y + 76);
      }

      if (!reduced) rafRef.current = requestAnimationFrame(draw);
    }
    rafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, [verdict, theme]);

  // Absolutely positioned so the bitmap size never feeds back into layout.
  return <canvas ref={ref} className="dg-canvas" aria-hidden="true" />;
}

/* ── COMPONENT ──────────────────────────────────────────────────────────── */

/** Two-option toggle; the second option is the failing one and is styled as such when pressed. */
const Seg: React.FC<{ label: string; value: boolean; on: string; off: string; onChange: (v: boolean) => void }> =
  ({ label, value, on, off, onChange }) => (
    <div className="dg-seg" role="group" aria-label={label}>
      <button type="button" aria-pressed={value} onClick={() => onChange(true)}>{on}</button>
      <button type="button" aria-pressed={!value} data-bad onClick={() => onChange(false)}>{off}</button>
    </div>
  );

const DecisionGate: React.FC = () => {
  const [inputs, setInputs] = useState<GateInputs>(SCENARIOS.gap.inputs);
  const [scenario, setScenario] = useState('gap');
  const verdict = useMemo(() => evaluateGates(inputs), [inputs]);

  const set = <K extends keyof GateInputs>(k: K, v: GateInputs[K]) => {
    setInputs((prev) => ({ ...prev, [k]: v }));
    setScenario('custom');
  };
  const tau = TAU[inputs.tier], kap = KAPPA[inputs.tier];
  const g2Fail = inputs.cHat < tau, g3Fail = inputs.uTraj > kap;

  return (
    <div className="dg">
      {/* Inputs */}
      <div className="dg-col">
        <h3 className="dg-h">Candidate hypothesis and action</h3>

        <div className="dg-field">
          <div className="dg-row"><span className="dg-lbl">Action risk tier</span><span className="dg-val">Tier {inputs.tier}</span></div>
          <div className="dg-seg dg-seg--4" role="group" aria-label="Action risk tier">
            {([0, 1, 2, 3] as Tier[]).map((t) => (
              <button key={t} type="button" aria-pressed={inputs.tier === t} onClick={() => set('tier', t)}>T{t}</button>
            ))}
          </div>
          <span className="dg-note">{TIER_INFO[inputs.tier].name}: {TIER_INFO[inputs.tier].example}</span>
        </div>

        <div className="dg-field">
          <div className="dg-row"><span className="dg-lbl">Reasoning integrity</span><span className="dg-note">model output, required evidence</span></div>
          <Seg label="Reasoning integrity" value={inputs.intact} on="Intact" off="Degenerate" onChange={(v) => set('intact', v)} />
        </div>

        <div className="dg-field">
          <div className="dg-row"><span className="dg-lbl">G1 · Structural</span><span className="dg-note">topology, identity graph</span></div>
          <Seg label="Gate 1 structural feasibility" value={inputs.feasible} on="Feasible" off="Impossible" onChange={(v) => set('feasible', v)} />
        </div>

        <div className="dg-field">
          <div className="dg-row">
            <label className="dg-lbl" htmlFor="dg-chat">G2 · ĉ(h) calibrated confidence</label>
            <span className="dg-val" data-bad={g2Fail || undefined}>{inputs.cHat.toFixed(2)} {g2Fail ? '<' : '≥'} τ{sub(inputs.tier)}</span>
          </div>
          <div className="dg-range" style={{ '--mark': `${tau * 100}%` } as React.CSSProperties}>
            <input id="dg-chat" type="range" min="0" max="1" step="0.01" value={inputs.cHat}
                   onChange={(e) => set('cHat', Number(e.target.value))} />
          </div>
        </div>

        <div className="dg-field">
          <div className="dg-row">
            <label className="dg-lbl" htmlFor="dg-utraj">G3 · U_traj trajectory uncertainty</label>
            <span className="dg-val" data-bad={g3Fail || undefined}>{inputs.uTraj.toFixed(2)} {g3Fail ? '>' : '≤'} κ{sub(inputs.tier)}</span>
          </div>
          <div className="dg-range" style={{ '--mark': `${kap * 100}%` } as React.CSSProperties}>
            <input id="dg-utraj" type="range" min="0" max="1" step="0.01" value={inputs.uTraj}
                   onChange={(e) => set('uTraj', Number(e.target.value))} />
          </div>
        </div>

        <div className="dg-field">
          <div className="dg-row"><span className="dg-lbl">Provenance</span><span className="dg-note">the justification depends on</span></div>
          <Seg label="Justification provenance" value={!inputs.tainted} on="Trusted only" off="Tainted input" onChange={(v) => set('tainted', !v)} />
        </div>

        <div className="dg-field">
          <div className="dg-row"><span className="dg-lbl">Calibration</span><span className="dg-note">deployment certificate</span></div>
          <Seg label="Calibration certificate" value={inputs.certified} on="Valid" off="Revoked" onChange={(v) => set('certified', v)} />
        </div>
      </div>

      {/* Diagram */}
      <div className="dg-stage">
        <GateCanvas verdict={verdict} />
        <p className="dg-caption">Decide, outside the LLM. The first failure routes; escalation reasons accumulate. Thresholds are illustrative and tighten with tier.</p>
      </div>

      {/* Outcome */}
      <div className="dg-col dg-out" aria-live="polite">
        <h3 className="dg-h">Outcome</h3>
        {SCENARIOS[scenario] && <p className="dg-story"><span>Scenario</span>{SCENARIOS[scenario].story}</p>}
        <span className={`k-outcome ${OUTCOME_CLASS[verdict.outcome]}`}>{verdict.outcome.replace('_', '-')}</span>
        <p className="dg-word">{OUTCOME_WORD[verdict.outcome]}</p>
        <p className="dg-headline">{verdict.headline}</p>
        <p className="dg-auth"><span>Authority</span> {verdict.authority}</p>
        {verdict.reasons.length > 0 && (
          <div className="dg-reasons">
            <p>{verdict.outcome === 'ESCALATE' && verdict.reasons.length > 1 ? 'Every reason goes to the approver:' : 'Why:'}</p>
            <ul>{verdict.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
          </div>
        )}
        {verdict.outcome === 'DEFER' && (
          <div className="dg-gap">
            <p>Evidence-gap report: what would resolve it</p>
            <ul>{(SCENARIOS[scenario]?.gap ?? GENERIC_GAP).map((g) => <li key={g}>{g}</li>)}</ul>
          </div>
        )}
        <p className="dg-next"><span>Try this</span>{nextStep(inputs, verdict)}</p>
        <div className="dg-scen">
          <h4 className="dg-h">Scenarios · KAIROS-SEC-004</h4>
          {Object.entries(SCENARIOS).map(([key, s]) => (
            <button key={key} type="button" aria-pressed={scenario === key}
                    onClick={() => { setScenario(key); setInputs(s.inputs); }}>
              <span>{s.label}</span><span className="dg-tag">{s.tag}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DecisionGate;
