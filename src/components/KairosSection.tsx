/**
 * KairosSection.tsx — Epistemic Prism research hub.
 * Axiom bento + Epistemic Gatekeeper (light glass) + LBR grid.
 * Gatekeeper models ETRA-v2 Figure 2: Gate 1 structural → Gate 2 calibrated
 * confidence → Gate 3 trajectory → provenance veto → risk-tier routing.
 * Outcomes: ACT / DEFER / ESCALATE, plus INVALID (back to Orient).
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';

/* ── GATE MODEL ─────────────────────────────────────────────────────────── */

type Tier = 0 | 1 | 2 | 3;

interface GateInputs {
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
  0: { name: 'Observe-only',         example: 'enrichment · read-only query', sink: 'READ_ONLY'    },
  1: { name: 'Reversible, local',    example: 'watch-list · revoke one session', sink: 'STATE_CHANGE' },
  2: { name: 'Reversible, impactful', example: 'isolate host · disable account', sink: 'STATE_CHANGE' },
  3: { name: 'Irreversible',         example: 'mass reset · external notice', sink: 'EGRESS'       },
};

type Outcome = 'ACT' | 'DEFER' | 'ESCALATE' | 'INVALID';
type GateKey = 'g1' | 'g2' | 'g3' | 'veto' | 'tier';
type GateState = 'pass' | 'fail' | 'skip' | 'na';

interface Verdict {
  outcome:   Outcome;
  stopAt:    GateKey | 'out';
  headline:  string;
  reasons:   string[];
  authority: string;
  gates:     Record<GateKey, GateState>;
}

function evaluateGates(i: GateInputs): Verdict {
  const tau = TAU[i.tier];
  const kap = KAPPA[i.tier];
  const gates: Record<GateKey, GateState> = { g1: 'skip', g2: 'skip', g3: 'skip', veto: 'skip', tier: 'skip' };

  // Gate 1 — structurally impossible hypotheses go back to Orient.
  if (!i.feasible) {
    gates.g1 = 'fail';
    return {
      outcome: 'INVALID', stopAt: 'g1', gates,
      headline: 'attack path impossible under topology / identity graph',
      reasons: ['returned to Orient as a negative constraint (bounded re-orient, max 2)'],
      authority: 'no action proposed',
    };
  }
  gates.g1 = 'pass';

  // Gate 2 — only meaningful with a certified calibration map.
  if (i.certified) {
    if (i.cHat < tau) {
      gates.g2 = 'fail';
      return {
        outcome: 'DEFER', stopAt: 'g2', gates,
        headline: `ĉ(h) ${i.cHat.toFixed(2)} < τ${sub(i.tier)} ${tau.toFixed(2)}`,
        reasons: ['evidence-gap report: what is missing, where to get it, which hypothesis it discriminates'],
        authority: 'no action · work item for an analyst',
      };
    }
    gates.g2 = 'pass';
  } else {
    gates.g2 = i.tier === 0 ? 'na' : 'fail';
  }

  // Everything below can only escalate. Collect every reason (KAIROS-006 §5.2).
  const reasons: string[] = [];
  let stopAt: GateKey | 'out' = 'out';
  const first = (k: GateKey) => { if (stopAt === 'out') stopAt = k; };

  if (i.uTraj > kap) {
    gates.g3 = 'fail'; first('g3');
    reasons.push(`U_traj ${i.uTraj.toFixed(2)} > κ${sub(i.tier)} ${kap.toFixed(2)} — upstream steps may have contaminated the conclusion`);
  } else gates.g3 = 'pass';

  if (i.tainted && i.tier > 0) {
    gates.veto = 'fail'; first('veto');
    reasons.push(`tainted justification reaches a ${TIER_INFO[i.tier].sink} sink — confidence cannot launder taint`);
  } else gates.veto = i.tainted ? 'na' : 'pass';

  if (!i.certified && i.tier > 0) {
    first('g2');
    reasons.push('no valid calibration certificate — Tier ≥ 1 autonomy falls back to ESCALATE');
  }

  if (i.tier === 3) {
    gates.tier = 'fail'; first('tier');
    reasons.push('Tier 3 is human-only — the agent may prepare, never execute');
  } else if (i.tier === 2) {
    gates.tier = 'fail'; first('tier');
    reasons.push('Tier 2 requires dual-key human approval');
  } else gates.tier = 'pass';

  if (reasons.length > 0) {
    return {
      outcome: 'ESCALATE', stopAt, gates,
      headline: reasons[0].split(' — ')[0],
      reasons,
      authority: i.tier === 2 ? 'dual-key approval → signed token'
               : i.tier === 3 ? 'human executes'
               : 'human review with trajectory trace',
    };
  }

  return {
    outcome: 'ACT', stopAt: 'out', gates,
    headline: i.tier === 0 ? 'every gate passed · no state change' : 'every gate passed · within tier',
    reasons: i.tainted ? ['taint permitted: Tier 0 reaches a READ_ONLY sink'] : [],
    authority: i.tier === 0 ? 'executes directly' : 'signed capability token · single use · ≤ 5 min',
  };
}

function sub(t: Tier) { return '₀₁₂₃'[t]; }

const SCENARIOS: Record<string, { label: string; tag: string; inputs: GateInputs }> = {
  earned:    { label: 'earned · watch-list',   tag: 'ACT',      inputs: { feasible: true,  cHat: 0.91, uTraj: 0.22, tainted: false, certified: true,  tier: 1 } },
  infeasible:{ label: 'air-gapped path',       tag: 'INVALID',  inputs: { feasible: false, cHat: 0.88, uTraj: 0.20, tainted: false, certified: true,  tier: 2 } },
  gap:       { label: 'telemetry gap',         tag: 'DEFER',    inputs: { feasible: true,  cHat: 0.71, uTraj: 0.31, tainted: false, certified: true,  tier: 1 } },
  injected:  { label: 'injected email',        tag: 'veto',     inputs: { feasible: true,  cHat: 0.96, uTraj: 0.18, tainted: true,  certified: true,  tier: 1 } },
  handoff:   { label: 'lost at hand-off',      tag: 'G3',       inputs: { feasible: true,  cHat: 0.90, uTraj: 0.46, tainted: false, certified: true,  tier: 1 } },
  isolate:   { label: 'isolate host',          tag: 'dual-key', inputs: { feasible: true,  cHat: 0.97, uTraj: 0.15, tainted: false, certified: true,  tier: 2 } },
  drift:     { label: 'model upgraded',        tag: 'uncertified', inputs: { feasible: true, cHat: 0.92, uTraj: 0.20, tainted: false, certified: false, tier: 1 } },
};

const RGB = {
  ACT:      { r: 14,  g: 33,  b: 160 },
  DEFER:    { r: 243, g: 117, b: 194 },
  ESCALATE: { r: 225, g: 29,  b: 72  },
  INVALID:  { r: 82,  g: 76,  b: 154 },
  idle:     { r: 15,  g: 13,  b: 27  },
};

const OUTCOME_VAR: Record<Outcome, string> = {
  ACT: 'var(--indigo)', DEFER: 'var(--amber)', ESCALATE: 'var(--deny)', INVALID: 'var(--ink-2)',
};

/* ── GATEKEEPER CANVAS ──────────────────────────────────────────────────── */

const NODE_ORDER: Array<{ key: GateKey | 'h' | 'out'; label: string; sub: string }> = [
  { key: 'h',    label: 'h',     sub: 'hypothesis' },
  { key: 'g1',   label: 'G1',    sub: 'structural' },
  { key: 'g2',   label: 'G2',    sub: 'calibrated' },
  { key: 'g3',   label: 'G3',    sub: 'trajectory' },
  { key: 'veto', label: 'VETO',  sub: 'provenance' },
  { key: 'tier', label: 'TIER',  sub: 'routing' },
  { key: 'out',  label: 'ACT',   sub: 'tool gateway' },
];

const EXIT_LABEL: Record<Outcome, string> = {
  INVALID: '↺ ORIENT', DEFER: 'DEFER', ESCALATE: 'ESCALATE', ACT: '',
};

interface GatekeeperCanvasProps { verdict: Verdict; }

function GatekeeperCanvas({ verdict }: GatekeeperCanvasProps) {
  const ref    = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const r = canvas!.getBoundingClientRect();
      canvas!.width  = r.width  * dpr;
      canvas!.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const vc = RGB[verdict.outcome];
    const stopIdx = NODE_ORDER.findIndex((n) => n.key === verdict.stopAt);

    function draw(t: number) {
      const r = canvas!.getBoundingClientRect();
      const W = r.width, H = r.height;
      ctx.clearRect(0, 0, W, H);

      // Light hairline grid
      ctx.strokeStyle = 'rgba(15,13,27,0.04)';
      ctx.lineWidth   = 0.5;
      for (let x = 0; x < W; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      // Lay the pipeline out horizontally on wide canvases, vertically on narrow ones.
      const vertical = W < 520;
      const n = NODE_ORDER.length;
      const pts = NODE_ORDER.map((_, i) => {
        const f = i / (n - 1);
        return vertical
          ? { x: W * 0.5, y: 70 + (H - 110) * f }
          : { x: 44 + (W - 88) * f, y: H * 0.42 };
      });

      // Edges
      for (let i = 0; i < n - 1; i++) {
        const a = pts[i], b = pts[i + 1];
        const live = i < stopIdx;
        ctx.setLineDash(live ? [] : [3, 5]);
        ctx.strokeStyle = live ? `rgba(${vc.r},${vc.g},${vc.b},0.55)` : 'rgba(15,13,27,0.14)';
        ctx.lineWidth   = live ? 1.6 : 1;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      ctx.setLineDash([]);

      // Packets travel from h to the stopping node
      const travel = Math.max(stopIdx, 1);
      for (let p = 0; p < 5; p++) {
        const ph = ((t * 0.00018) + p / 5) % 1;
        const pos = ph * travel;
        const seg = Math.min(Math.floor(pos), travel - 1);
        const f = pos - seg;
        const a = pts[seg], b = pts[seg + 1];
        const x = a.x + (b.x - a.x) * f, y = a.y + (b.y - a.y) * f;
        const alpha = 0.25 + 0.6 * Math.sin(Math.PI * ph);
        ctx.fillStyle = `rgba(${vc.r},${vc.g},${vc.b},${alpha})`;
        ctx.beginPath(); ctx.arc(x, y, 2.6, 0, Math.PI * 2); ctx.fill();
      }

      // Nodes
      NODE_ORDER.forEach((node, i) => {
        const { x, y } = pts[i];
        const isStop  = i === stopIdx;
        const reached = i <= stopIdx;
        const state   = node.key === 'h' ? 'pass' : node.key === 'out' ? (verdict.outcome === 'ACT' ? 'pass' : 'skip') : verdict.gates[node.key as GateKey];
        const c = isStop ? vc : reached ? RGB.ACT : RGB.idle;
        const R = node.key === 'h' || node.key === 'out' ? 11 : 15;

        if (isStop) {
          const pulse = 1 + 0.12 * Math.sin(t * 0.004);
          const og = ctx.createRadialGradient(x, y, 0, x, y, R * 3.2 * pulse);
          og.addColorStop(0, `rgba(${c.r},${c.g},${c.b},0.30)`);
          og.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);
          ctx.fillStyle = og;
          ctx.beginPath(); ctx.arc(x, y, R * 3.2 * pulse, 0, Math.PI * 2); ctx.fill();
        }

        const path = new Path2D();
        if (node.key === 'h' || node.key === 'out') {
          path.arc(x, y, R, 0, Math.PI * 2);
        } else {
          // Prism triangle per gate
          for (let k = 0; k < 3; k++) {
            const ang = -Math.PI / 2 + (k * Math.PI * 2) / 3;
            const px = x + Math.cos(ang) * R, py = y + Math.sin(ang) * R + 2;
            if (k === 0) path.moveTo(px, py); else path.lineTo(px, py);
          }
          path.closePath();
        }
        const g = ctx.createLinearGradient(x, y - R, x, y + R);
        g.addColorStop(0, 'rgba(255,255,255,0.95)');
        g.addColorStop(1, `rgba(${c.r},${c.g},${c.b},${reached ? 0.20 : 0.06})`);
        ctx.fillStyle = g; ctx.fill(path);
        ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${reached ? 0.85 : 0.25})`;
        ctx.lineWidth = isStop ? 1.6 : 1;
        ctx.stroke(path);

        // Status mark
        ctx.font = '600 9px "JetBrains Mono", ui-monospace, monospace';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const mark = state === 'fail' ? '×' : state === 'pass' && reached ? '✓' : state === 'na' ? '–' : '';
        if (mark && node.key !== 'h') {
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},1)`;
          ctx.fillText(mark, x, y + 3);
        }

        // Labels
        ctx.fillStyle = reached ? 'rgba(9,9,11,0.88)' : 'rgba(113,113,122,0.7)';
        ctx.font = '600 10px "JetBrains Mono", ui-monospace, monospace';
        const lbl = node.key === 'out' ? 'ACT' : node.label;
        if (vertical) {
          ctx.textAlign = 'left';
          ctx.fillText(lbl, x + 24, y - 5);
          ctx.fillStyle = 'rgba(113,113,122,0.85)';
          ctx.font = '400 9px "JetBrains Mono", ui-monospace, monospace';
          ctx.fillText(node.sub, x + 24, y + 8);
        } else {
          ctx.fillText(lbl, x, y - R - 14);
          ctx.fillStyle = 'rgba(113,113,122,0.85)';
          ctx.font = '400 9px "JetBrains Mono", ui-monospace, monospace';
          ctx.fillText(node.sub, x, y + R + 14);
        }
      });

      // Exit branch from the stopping gate
      // Exit branch from the stopping gate: downward when horizontal, to the empty left side when vertical.
      if (verdict.outcome !== 'ACT' && stopIdx > 0) {
        const { x, y } = pts[stopIdx];
        ctx.strokeStyle = `rgba(${vc.r},${vc.g},${vc.b},0.8)`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        if (vertical) { ctx.moveTo(x - 20, y); ctx.lineTo(22, y); }
        else          { ctx.moveTo(x, y + 30); ctx.lineTo(x, y + 64); }
        ctx.stroke();
        ctx.fillStyle = `rgba(${vc.r},${vc.g},${vc.b},1)`;
        ctx.font = '600 11px "JetBrains Mono", ui-monospace, monospace';
        ctx.textAlign = vertical ? 'left' : 'center';
        if (vertical) ctx.fillText(EXIT_LABEL[verdict.outcome], 22, y - 10);
        else          ctx.fillText(EXIT_LABEL[verdict.outcome], x, y + 78);
      }

      rafRef.current = requestAnimationFrame(draw);
    }
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [verdict]);

  // Absolutely positioned so the canvas bitmap size never feeds back into layout.
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />;
}

/* ── EPISTEMIC GATEKEEPER ───────────────────────────────────────────────── */

function EpistemicGatekeeper() {
  const [inputs,   setInputs]   = useState<GateInputs>(SCENARIOS.earned.inputs);
  const [scenario, setScenario] = useState('earned');
  const verdict = useMemo(() => evaluateGates(inputs), [inputs]);

  const set = <K extends keyof GateInputs>(k: K, v: GateInputs[K]) => {
    setInputs((prev) => ({ ...prev, [k]: v }));
    setScenario('custom');
  };
  const loadScenario = (key: string) => {
    setScenario(key);
    setInputs(SCENARIOS[key].inputs);
  };

  const verdictColor = OUTCOME_VAR[verdict.outcome];
  const tau = TAU[inputs.tier], kap = KAPPA[inputs.tier];

  return (
    <div className="gk glass">
      <style>{`
        .gk {
          display: grid;
          grid-template-columns: 340px 1fr 300px;
          gap: 0;
          overflow: hidden;
        }
        @media (max-width: 1100px) {
          .gk { grid-template-columns: 1fr; }
          .gk-canvas-wrap { min-height: 420px !important; }
        }
        .gk-col { padding: 24px 22px; min-width: 0; }
        .gk-col + .gk-col { border-left: 1px solid var(--hairline); }
        @media (max-width: 1100px) {
          .gk-col + .gk-col { border-left: 0; border-top: 1px solid var(--hairline); }
        }
        .gk-col h4 {
          font-family: var(--f-mono); font-size: 10px; font-weight: 500;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--ink-3); margin: 0 0 18px;
        }
        .gk-sig { display: flex; flex-direction: column; gap: 16px; }
        .gk-sig-row { display: flex; flex-direction: column; gap: 6px; }
        .gk-sig-row .head {
          display: flex; justify-content: space-between; align-items: baseline; gap: 8px;
          font-family: var(--f-sans); font-size: 13px;
        }
        .gk-sig-row .head .lbl { color: var(--ink-0); font-weight: 600; letter-spacing: -0.005em; }
        .gk-sig-row .head .desc {
          color: var(--ink-3); font-size: 10px; font-family: var(--f-mono); letter-spacing: 0.04em;
        }
        .gk-sig-row .head .val {
          color: var(--ink-0); font-variant-numeric: tabular-nums;
          font-family: var(--f-mono); font-size: 12px; font-weight: 500; white-space: nowrap;
        }
        .gk-sig-row .bar {
          position: relative; height: 6px;
          background: rgba(15,13,27,0.06); border-radius: 999px; cursor: pointer;
        }
        .gk-sig-row .bar .fill {
          position: absolute; left: 0; top: 0; bottom: 0; border-radius: 999px;
          background: var(--c, var(--indigo));
          box-shadow: 0 0 12px color-mix(in oklab, var(--c, var(--indigo)) 50%, transparent);
          transition: width 0.18s var(--ease-out), background 0.2s;
        }
        .gk-sig-row .bar .fill.under {
          background: var(--deny);
          box-shadow: 0 0 12px color-mix(in oklab, var(--deny) 50%, transparent);
        }
        .gk-sig-row .bar .crit {
          position: absolute; top: -4px; bottom: -4px;
          width: 1px; background: rgba(15,13,27,0.40);
        }
        .gk-sig-row input[type=range] {
          appearance: none; -webkit-appearance: none;
          position: absolute; inset: -8px 0; width: 100%; height: 22px;
          background: transparent; cursor: ew-resize; margin: 0;
        }
        .gk-sig-row input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 16px; height: 16px;
          border-radius: 50%; background: #fff; cursor: ew-resize;
          box-shadow: 0 0 0 1px var(--c, var(--indigo)), 0 2px 6px rgba(15,13,27,0.18);
        }
        .gk-sig-row input[type=range]::-moz-range-thumb {
          width: 16px; height: 16px; border-radius: 50%;
          background: #fff; border: 0;
          box-shadow: 0 0 0 1px var(--c, var(--indigo)), 0 2px 6px rgba(15,13,27,0.18);
        }
        .gk-seg {
          display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 4px;
          padding: 3px; border-radius: var(--r-sm);
          background: rgba(15,13,27,0.04); border: 1px solid var(--hairline);
        }
        .gk-seg button {
          appearance: none; border: 0; cursor: pointer;
          font-family: var(--f-mono); font-size: 11px; letter-spacing: 0.02em;
          padding: 6px 6px; border-radius: 4px; color: var(--ink-2); background: transparent;
          transition: background 0.15s, color 0.15s;
        }
        .gk-seg button:hover { color: var(--ink-0); }
        .gk-seg button.on {
          background: #fff; color: var(--indigo);
          box-shadow: 0 1px 3px rgba(15,13,27,0.10), 0 0 0 1px rgba(14,33,160,0.18);
        }
        .gk-seg button.on.bad { color: var(--deny); box-shadow: 0 1px 3px rgba(15,13,27,0.10), 0 0 0 1px rgba(225,29,72,0.25); }
        .gk-tier-note { font-family: var(--f-mono); font-size: 10px; color: var(--ink-3); letter-spacing: 0.02em; }

        .gk-canvas-wrap {
          position: relative; min-height: 460px;
          background: radial-gradient(ellipse at center, rgba(14,33,160,0.04), transparent 70%);
        }
        .gk-canvas-overlay {
          position: absolute; inset: 0;
          display: flex; flex-direction: column; justify-content: space-between;
          padding: 22px; pointer-events: none;
        }
        .gk-canvas-overlay .top, .gk-canvas-overlay .bot {
          display: flex; justify-content: space-between; gap: 12px;
          font-family: var(--f-mono); font-size: 10px;
          color: var(--ink-3); letter-spacing: 0.14em; text-transform: uppercase;
        }
        .gk-canvas-overlay .top .right { color: var(--ink-2); text-align: right; }
        @media (max-width: 560px) {
          .gk-canvas-overlay .top .right, .gk-canvas-overlay .bot { display: none; }
        }

        .gk-verdict { display: flex; flex-direction: column; gap: 14px; }
        .gk-verdict .badge {
          font-family: var(--f-mono); font-size: 11px; font-weight: 500;
          letter-spacing: 0.18em; padding: 5px 11px;
          border-radius: var(--r-sm); align-self: flex-start;
          color: var(--bc);
          background: color-mix(in oklab, var(--bc) 12%, transparent);
          border: 1px solid color-mix(in oklab, var(--bc) 40%, transparent);
        }
        .gk-verdict .big {
          font-size: 48px; font-weight: 600;
          letter-spacing: -0.035em; line-height: 1;
          color: var(--ink-0); font-family: var(--f-sans);
        }
        .gk-verdict .big em {
          font-family: var(--f-serif); font-weight: 400; color: var(--bc);
        }
        .gk-verdict .score {
          font-family: var(--f-mono); font-size: 12px;
          color: var(--ink-3); line-height: 1.55;
        }
        .gk-verdict .score b { color: var(--ink-0); font-variant-numeric: tabular-nums; font-weight: 500; }
        .gk-verdict .reason {
          font-family: var(--f-sans); font-size: 13.5px; color: var(--ink-1);
          line-height: 1.5; padding-top: 14px;
          border-top: 1px solid var(--hairline); text-wrap: pretty;
        }
        .gk-verdict .reason ul { margin: 8px 0 0; padding-left: 16px; color: var(--ink-2); font-size: 12.5px; }
        .gk-verdict .reason li + li { margin-top: 4px; }
        .gk-scen {
          display: flex; flex-direction: column; gap: 2px;
          margin-top: auto; padding-top: 16px;
          border-top: 1px solid var(--hairline);
        }
        .gk-scen-title {
          font-family: var(--f-mono); font-size: 10px; color: var(--ink-3);
          letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 6px;
        }
        .gk-scen button {
          appearance: none; border: 0; background: transparent;
          color: var(--ink-1); text-align: left; cursor: pointer;
          font-family: var(--f-mono); font-size: 11px;
          padding: 6px 10px; border-radius: var(--r-sm);
          display: flex; justify-content: space-between; gap: 12px;
          transition: background 0.15s;
        }
        .gk-scen button:hover { background: rgba(15,13,27,0.04); color: var(--ink-0); }
        .gk-scen button.active { background: rgba(14,33,160,0.08); color: var(--indigo); }
        .gk-scen button .tag { color: var(--ink-4); font-size: 10px; }
      `}</style>

      {/* INPUTS */}
      <div className="gk-col">
        <h4>// candidate hypothesis · action</h4>
        <div className="gk-sig">
          <div className="gk-sig-row">
            <div className="head">
              <span className="lbl">Action risk tier</span>
              <span className="val">Tier {inputs.tier}</span>
            </div>
            <div className="gk-seg" role="group" aria-label="Action risk tier">
              {([0, 1, 2, 3] as Tier[]).map((t) => (
                <button key={t} className={inputs.tier === t ? 'on' : ''} onClick={() => set('tier', t)}>T{t}</button>
              ))}
            </div>
            <span className="gk-tier-note">{TIER_INFO[inputs.tier].name} · {TIER_INFO[inputs.tier].example}</span>
          </div>

          <div className="gk-sig-row">
            <div className="head">
              <div><span className="lbl">G1 · Structural</span><span className="desc" style={{ marginLeft: 10 }}>topology · identity graph</span></div>
            </div>
            <div className="gk-seg" role="group" aria-label="Gate 1 structural feasibility">
              <button className={inputs.feasible ? 'on' : ''} onClick={() => set('feasible', true)}>feasible</button>
              <button className={!inputs.feasible ? 'on bad' : ''} onClick={() => set('feasible', false)}>impossible</button>
            </div>
          </div>

          <div className="gk-sig-row">
            <div className="head">
              <div><span className="lbl">G2 · ĉ(h)</span><span className="desc" style={{ marginLeft: 10 }}>calibrated confidence</span></div>
              <span className="val" style={{ color: inputs.cHat < tau ? 'var(--deny)' : 'var(--indigo)' }}>
                {inputs.cHat.toFixed(2)} {inputs.cHat < tau ? '<' : '≥'} τ{sub(inputs.tier)}
              </span>
            </div>
            <div className="bar" style={{ '--c': 'var(--indigo)' } as React.CSSProperties}>
              <div className={inputs.cHat < tau ? 'fill under' : 'fill'} style={{ width: inputs.cHat * 100 + '%' }} />
              <div className="crit" style={{ left: tau * 100 + '%' }} title={`τ for tier ${inputs.tier}: ${tau}`} />
              <input type="range" min="0" max="1" step="0.01" value={inputs.cHat}
                     onChange={(e) => set('cHat', Number(e.target.value))}
                     aria-label="Calibrated confidence (0 to 1)" />
            </div>
          </div>

          <div className="gk-sig-row">
            <div className="head">
              <div><span className="lbl">G3 · U_traj</span><span className="desc" style={{ marginLeft: 10 }}>whole-investigation</span></div>
              <span className="val" style={{ color: inputs.uTraj > kap ? 'var(--deny)' : 'var(--indigo)' }}>
                {inputs.uTraj.toFixed(2)} {inputs.uTraj > kap ? '>' : '≤'} κ{sub(inputs.tier)}
              </span>
            </div>
            <div className="bar" style={{ '--c': 'var(--amber)' } as React.CSSProperties}>
              <div className={inputs.uTraj > kap ? 'fill under' : 'fill'} style={{ width: inputs.uTraj * 100 + '%' }} />
              <div className="crit" style={{ left: kap * 100 + '%' }} title={`κ for tier ${inputs.tier}: ${kap}`} />
              <input type="range" min="0" max="1" step="0.01" value={inputs.uTraj}
                     onChange={(e) => set('uTraj', Number(e.target.value))}
                     aria-label="Trajectory uncertainty (0 to 1)" />
            </div>
          </div>

          <div className="gk-sig-row">
            <div className="head">
              <div><span className="lbl">Provenance</span><span className="desc" style={{ marginLeft: 10 }}>justification depends on</span></div>
            </div>
            <div className="gk-seg" role="group" aria-label="Justification provenance">
              <button className={!inputs.tainted ? 'on' : ''} onClick={() => set('tainted', false)}>trusted only</button>
              <button className={inputs.tainted ? 'on bad' : ''} onClick={() => set('tainted', true)}>tainted input</button>
            </div>
          </div>

          <div className="gk-sig-row">
            <div className="head">
              <div><span className="lbl">Calibration</span><span className="desc" style={{ marginLeft: 10 }}>deployment certificate</span></div>
            </div>
            <div className="gk-seg" role="group" aria-label="Calibration certificate">
              <button className={inputs.certified ? 'on' : ''} onClick={() => set('certified', true)}>valid</button>
              <button className={!inputs.certified ? 'on bad' : ''} onClick={() => set('certified', false)}>revoked</button>
            </div>
          </div>
        </div>
      </div>

      {/* CANVAS */}
      <div className="gk-canvas-wrap">
        <GatekeeperCanvas verdict={verdict} />
        <div className="gk-canvas-overlay">
          <div className="top">
            <span>// decide · outside the llm</span>
            <span className="right">first failure routes · escalations accumulate</span>
          </div>
          <div className="bot">
            <span>thresholds illustrative</span>
            <span>τ, κ tighten with tier</span>
          </div>
        </div>
      </div>

      {/* VERDICT */}
      <div className="gk-col gk-verdict" style={{ '--bc': verdictColor } as React.CSSProperties}>
        <h4>// outcome</h4>
        <span className="badge">{verdict.outcome}</span>
        <div className="big">
          {verdict.outcome === 'ACT'      ? <>Act.</> :
           verdict.outcome === 'DEFER'    ? <><em>Defer.</em></> :
           verdict.outcome === 'ESCALATE' ? <><em>Escalate.</em></> :
                                            <><em>Re-orient.</em></>}
        </div>
        <div className="score">
          {verdict.headline}<br />
          authority · <b>{verdict.authority}</b>
        </div>
        {verdict.reasons.length > 0 && (
          <div className="reason">
            {verdict.outcome === 'ESCALATE' && verdict.reasons.length > 1 ? 'Every reason goes to the approver:' : 'Why:'}
            <ul>{verdict.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
          </div>
        )}
        <div className="gk-scen">
          <div className="gk-scen-title">// scenarios · KAIROS-SEC-004</div>
          {Object.entries(SCENARIOS).map(([key, s]) => (
            <button key={key}
                    className={scenario === key ? 'active' : ''}
                    onClick={() => loadScenario(key)}>
              <span>{s.label}</span><span className="tag">{s.tag}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── AXIOM BENTO ────────────────────────────────────────────────────────── */

function AxiomBento() {
  return (
    <div className="axioms-bento">
      <style>{`
        .axioms-bento {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        .axioms-bento > .axiom { padding: 30px 30px 26px; }

        .axiom {
          position: relative;
          background: var(--surface);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--hairline);
          border-radius: var(--r-lg);
          box-shadow: var(--shadow-card);
          overflow: hidden;
          transition: all 0.4s var(--ease-out);
          display: flex; flex-direction: column;
        }
        .axiom:hover {
          transform: translateY(-3px);
          background: var(--surface-strong);
          border-color: rgba(14,33,160,0.20);
          box-shadow: inset 0 0 28px rgba(14,33,160,0.06), 0 12px 40px rgba(15,13,27,0.06);
        }
        .axiom .num {
          font-family: var(--f-mono); font-size: 11px;
          color: var(--ink-3); letter-spacing: 0.14em; margin-bottom: 8px;
        }
        .axiom .glyph {
          position: absolute; top: 20px; right: 24px;
          font-family: var(--f-serif); font-size: 40px; line-height: 1;
          font-style: italic; color: var(--indigo); opacity: 0.45;
          pointer-events: none;
        }
        .axiom .ttl {
          font-family: var(--f-sans); font-size: 22px; font-weight: 600;
          letter-spacing: -0.02em; color: var(--ink-0);
          margin: 0 0 12px; line-height: 1.1; max-width: calc(100% - 44px);
        }
        .axiom .body {
          color: var(--ink-2); font-size: 14.5px; line-height: 1.55;
          margin: 0; text-wrap: pretty; max-width: 64ch;
        }
        .axiom .body em {
          color: var(--ink-0); font-style: italic;
          font-family: var(--f-serif); font-weight: 400; font-size: 1.08em;
        }
        .axiom .footnote {
          margin-top: auto; padding-top: 16px;
          border-top: 1px solid var(--hairline);
          font-family: var(--f-mono); font-size: 11px; color: var(--ink-3);
          letter-spacing: 0.04em; display: flex; justify-content: space-between; gap: 12px;
        }
        .axiom .footnote .ref { color: var(--indigo); }

        .axiom-extra {
          margin-top: 24px; padding: 16px 18px;
          background: rgba(14,33,160,0.04); border: 1px solid rgba(14,33,160,0.12);
          border-radius: var(--r-md);
          font-family: var(--f-mono); font-size: 11px; color: var(--ink-2); line-height: 1.7;
        }
        .axiom-extra code { color: var(--indigo); background: transparent; font-family: inherit; }
        .axiom-extra .v {
          font-family: var(--f-mono); font-size: 11px;
          padding: 1px 7px; border-radius: 4px;
          color: var(--indigo);
          background: rgba(14,33,160,0.08); border: 1px solid rgba(14,33,160,0.20);
        }
        .axiom-extra .v.deny  { color: var(--deny);  background: rgba(225,29,72,0.06);  border-color: rgba(225,29,72,0.22); }
        .axiom-extra .v.hold  { color: var(--amber); background: rgba(243,117,194,0.08); border-color: rgba(243,117,194,0.30); }
        .axiom-extra .v.inv   { color: var(--ink-2); background: rgba(82,76,154,0.06); border-color: rgba(82,76,154,0.22); }
        .axiom-extra .v.allow { color: var(--indigo); }
        .axiom-levels {
          margin-top: 20px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
        }
        @media (max-width: 760px) { .axiom-levels { grid-template-columns: 1fr; } }
        .axiom-levels > div {
          padding: 12px 14px; border-radius: var(--r-md);
          background: rgba(14,33,160,0.04); border: 1px solid rgba(14,33,160,0.10);
          font-size: 12.5px; color: var(--ink-2); line-height: 1.45;
        }
        .axiom-levels b {
          display: block; font-family: var(--f-mono); font-size: 10px; font-weight: 500;
          letter-spacing: 0.14em; color: var(--indigo); margin-bottom: 4px;
        }

        .telemetry-strip {
          margin-top: 18px; display: flex; gap: 0;
          background: var(--ink-dark-0); border-radius: var(--r-md);
          padding: 10px 14px;
          font-family: var(--f-mono); font-size: 10.5px;
          color: rgba(244,244,245,0.7); overflow: hidden; white-space: nowrap;
          align-items: center;
          mask-image: linear-gradient(90deg, #000 70%, transparent 100%);
          -webkit-mask-image: linear-gradient(90deg, #000 70%, transparent 100%);
        }
        .telemetry-strip .pulse-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--amber); margin-right: 12px; flex-shrink: 0;
          box-shadow: 0 0 0 3px rgba(243,117,194,0.20);
          animation: pulse-soft 1.5s ease-in-out infinite;
        }
        .telemetry-strip .entry { margin-right: 24px; }
        .telemetry-strip .entry .ts   { color: rgba(244,244,245,0.40); margin-right: 8px; }
        .telemetry-strip .entry .lvl-warn { color: #F9A8D4; }
        .telemetry-strip .entry .lvl-deny { color: #FCA5A5; }
        .telemetry-strip .entry .lvl-info { color: #C7D2FE; }
        .telemetry-strip .entry .msg  { color: rgba(244,244,245,0.9); }
      `}</style>

      <article className="axiom">
        <span className="num">AXIOM · 01</span>
        <span className="glyph">ψ</span>
        <h3 className="ttl">Hypothesis-Only</h3>
        <p className="body">
          LLMs generate <em>competing</em> hypotheses: at least <em>k</em>, grounded in MITRE ATT&amp;CK,
          including one benign explanation. They hold no tool authority and never a capability token.
          Machine-generated claims from either side, including the attacker's own agents, are hypotheses.
        </p>
        <div className="footnote"><span>// counters narrative hardening</span><span className="ref">KAIROS-000 §2.2 →</span></div>
      </article>

      <article className="axiom">
        <span className="num">AXIOM · 02</span>
        <span className="glyph">⊢</span>
        <h3 className="ttl">Earn the Right<br />to Act</h3>
        <p className="body">
          The default is DEFER. Autonomy needs positive evidence at three independent gates and a
          provenance check, all in deterministic code. Passing every gate makes an action eligible
          for autonomy <em>only up to its tier</em>.
        </p>
        <div className="axiom-extra">
          <div style={{ display: 'flex', gap: '8px 18px', flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              ['allow', 'ACT',      'tier 0–1 · signed token'],
              ['hold',  'DEFER',    'ĉ < τ · evidence-gap report'],
              ['deny',  'ESCALATE', 'G3 · veto · tier 2–3'],
              ['inv',   'INVALID',  'back to Orient'],
            ].map(([cls, name, note]) => (
              <span key={name} style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                <span className={`v ${cls}`}>{name}</span>
                <span style={{ color: 'var(--ink-4)', fontSize: 10 }}>{note}</span>
              </span>
            ))}
          </div>
        </div>
        <div className="footnote" style={{ marginTop: 18 }}><span>// least agency</span><span className="ref">KAIROS-000 §2.3 →</span></div>
      </article>

      <article className="axiom">
        <span className="num">AXIOM · 03</span>
        <span className="glyph">∂</span>
        <h3 className="ttl">Uncertainty is Structure</h3>
        <p className="body">
          Not one scalar but three levels. ECE and Brier score describe a <em>deployment</em> over many
          adjudicated outcomes; v1 applied them to a single hypothesis, which was a category error.
        </p>
        <div className="axiom-levels">
          <div><b>L1 · PER HYPOTHESIS</b>U_epi high → retrieve more. U_ale high after the budget → DEFER with a telemetry request.</div>
          <div><b>L2 · CERTIFICATION</b>ECE ≤ ε_cal on held-out incidents. Drift revokes the certificate; Tier 1 falls back to ESCALATE.</div>
          <div><b>L3 · TRAJECTORY</b>U_t = U_int + U_ext. Uncertainty and taint cross agent hand-offs as structured fields, not prose.</div>
        </div>
        <div className="footnote" style={{ marginTop: 18 }}><span>// three levels</span><span className="ref">KAIROS-004 →</span></div>
      </article>

      <article className="axiom">
        <span className="num">AXIOM · 04</span>
        <span className="glyph">⊘</span>
        <h3 className="ttl">Provenance Beats Confidence</h3>
        <p className="body">
          Every datum is labelled trusted or untrusted, and taint follows it into every hypothesis and
          proposed action. Untrusted telemetry may <em>inform</em> a hypothesis but never <em>authorise</em> an
          execution, egress or state-changing action. An attacker who can shape inputs can also shape the
          model's apparent certainty, so <em>confidence cannot launder taint</em>.
        </p>
        <div className="footnote"><span>// filters are detectors, not boundaries</span><span className="ref">KAIROS-007 §4 →</span></div>
      </article>

      <article className="axiom">
        <span className="num">AXIOM · 05</span>
        <span className="glyph">!</span>
        <h3 className="ttl">No Silent Failures</h3>
        <p className="body">
          A system that abstains <em>loudly</em> is preferable to one that hallucinates quietly. Every failure
          is named from a closed taxonomy, every DEFER carries an evidence-gap report, and every input,
          score, gate result and approval goes on a hash-chained audit trail.
        </p>
        <div className="telemetry-strip" aria-label="Sample audit trail">
          <span className="pulse-dot" />
          <span className="entry"><span className="ts">14:02:11.402</span><span className="lvl-deny">ESCALATE</span> <span className="msg">firewall.block · tier=2 · dual-key</span></span>
          <span className="entry"><span className="ts">14:02:11.501</span><span className="lvl-warn">DEFER</span> <span className="msg">ĉ=0.71 &lt; τ₁=0.85 · telemetry request</span></span>
          <span className="entry"><span className="ts">14:02:11.587</span><span className="lvl-info">INVALID</span> <span className="msg">H1 · path into air-gapped SEG-OT-07 · re-orient</span></span>
          <span className="entry"><span className="ts">14:02:11.612</span><span className="lvl-info">ACT</span> <span className="msg">watchlist.add · tier=1 · token CT-7f3a</span></span>
          <span className="entry"><span className="ts">14:02:11.733</span><span className="lvl-deny">ESCALATE</span> <span className="msg">taint T-107-04 → EGRESS · veto</span></span>
        </div>
        <div className="footnote" style={{ marginTop: 18 }}><span>// 13 named failure types</span><span className="ref">KAIROS-005 →</span></div>
      </article>
    </div>
  );
}

/* ── LEARN / BUILD / CONTRIBUTE ─────────────────────────────────────────── */

const LBR = [
  {
    eyebrow: '01 / LEARN', title: 'The research',
    body: 'Version 2 corrects its own statistics, separates calibration certification from per-decision gating, and maps documented 2025–2026 agentic incidents to controls. Preliminary proof of concept: hallucinated reasoning 12% → 3% against the same LLM unconstrained, at the cost of deferrals rising 5% → 22%.',
    items: ['Earning the Right to Act — preprint v2', 'What v2 corrects from v1', 'Evaluation protocol (KAIROS-009)'],
    cta: 'Read the research', accent: 'var(--indigo)', href: '/research',
  },
  {
    eyebrow: '02 / BUILD', title: 'Reference implementations',
    body: 'kairos-core holds the framework specs and templates; kairos-security is the SOC profile with a runnable engine and 68 passing tests. Every mechanism in the docs is labelled [Implemented] or [Specified v2].',
    items: ['kairos-core · KAIROS-000 … 009', 'kairos-security · SEC-001 … 005', 'Templates: capability token, calibration certificate'],
    cta: 'View on GitHub', accent: 'var(--indigo-bright)', href: 'https://github.com/kairos-dev-kairos-ecl',
  },
  {
    eyebrow: '03 / CONTRIBUTE', title: 'Get involved',
    body: 'The claims are written to be falsified. Run the evaluation protocol on public SOC datasets, red-team the gates with adaptive injections placed in telemetry, and publish what breaks.',
    items: ['Independent evaluation on LANL, BOTS, OTRF', 'Domain profiles: healthcare, finance, legal', 'Open issues on GitHub'],
    cta: 'Contribute on GitHub', accent: 'var(--amber)', href: 'https://github.com/kairos-dev-kairos-ecl',
  },
];

/* ── KAIROS SECTION ─────────────────────────────────────────────────────── */

const KairosSection: React.FC = () => (
  <section id="kairos" className="kairos-sec">
    <style>{`
      .kairos-sec {
        padding: 80px 0 100px;
        position: relative;
      }
      .kairos-sec .section-head {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: 60px;
        margin-bottom: 56px;
        align-items: end;
      }
      @media (max-width: 1100px) {
        .kairos-sec .section-head { grid-template-columns: 1fr; gap: 24px; }
      }
      .kairos-sec h2 {
        font-size: clamp(40px, 6vw, 84px);
        font-weight: 600; letter-spacing: -0.04em; line-height: 0.95;
        margin: 16px 0 0; color: var(--ink-0);
      }
      .kairos-sec h2 .em {
        font-family: var(--f-serif); font-style: italic; font-weight: 400;
        background: linear-gradient(120deg, var(--indigo), var(--amber));
        -webkit-background-clip: text; background-clip: text; color: transparent;
      }
      .kairos-sec .head-side p {
        color: var(--ink-2); font-size: 16px; line-height: 1.55;
        margin: 0; text-wrap: pretty;
      }
      .kairos-sec .head-side p em {
        font-family: var(--f-serif); font-style: italic;
        color: var(--ink-0); font-weight: 400;
      }
      .kairos-sec .head-side .signature {
        font-family: var(--f-mono); font-size: 11px;
        color: var(--ink-3); letter-spacing: 0.06em; margin-top: 14px;
      }

      .kairos-sec .lbr-row {
        margin-top: 56px; padding-top: 36px;
        border-top: 1px solid var(--hairline);
      }
      .kairos-sec .lbr {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
      }
      @media (max-width: 1000px) { .kairos-sec .lbr { grid-template-columns: 1fr; } }
      .kairos-sec .lbr .cell {
        padding: 30px 28px 26px;
        background: var(--surface); backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid var(--hairline); border-radius: var(--r-lg);
        box-shadow: var(--shadow-card);
        display: flex; flex-direction: column; gap: 14px;
        transition: all 0.3s var(--ease-out);
        position: relative; overflow: hidden;
      }
      .kairos-sec .lbr .cell::before {
        content: ""; position: absolute; left: 0; right: 0; top: 0; height: 2px;
        background: var(--accent); opacity: 0.7; transition: opacity 0.3s;
      }
      .kairos-sec .lbr .cell:hover {
        transform: translateY(-3px); background: var(--surface-strong);
        box-shadow: inset 0 0 28px color-mix(in oklab, var(--accent) 5%, transparent),
                    0 12px 40px rgba(15,13,27,0.06);
        border-color: color-mix(in oklab, var(--accent) 22%, var(--hairline));
      }
      .kairos-sec .lbr .eb { font-family: var(--f-mono); font-size: 11px; color: var(--ink-3); letter-spacing: 0.16em; }
      .kairos-sec .lbr .t {
        font-family: var(--f-sans); font-size: 28px; font-weight: 600;
        letter-spacing: -0.025em; color: var(--ink-0); margin: 0; line-height: 1.05;
      }
      .kairos-sec .lbr .b { color: var(--ink-2); font-size: 14px; line-height: 1.55; margin: 0; text-wrap: pretty; }
      .kairos-sec .lbr ul {
        list-style: none; padding: 0; margin: 4px 0 0;
        display: flex; flex-direction: column; gap: 8px;
        font-family: var(--f-mono); font-size: 12px; color: var(--ink-2);
      }
      .kairos-sec .lbr li::before { content: "→"; color: var(--ink-4); margin-right: 8px; }
      .kairos-sec .lbr .cta {
        margin-top: auto; font-family: var(--f-sans); font-size: 13px; font-weight: 600;
        color: var(--accent); text-decoration: none; align-self: flex-start;
        padding: 12px 0 0; border-top: 1px solid var(--hairline); width: 100%;
        letter-spacing: -0.005em; display: flex; align-items: center; gap: 6px;
      }
      .kairos-sec .lbr .cta:hover { color: var(--ink-0); }
      .kairos-sec .lbr .cta:hover .arr { transform: translateX(4px); }
      .kairos-sec .lbr .cta .arr { transition: transform 0.2s var(--ease-out); }
    `}</style>

    <div className="wrap">
      <div className="section-meta">
        <span className="num">01 / 03</span>
        <div className="meta-kv">
          <div><span className="k">Pillar</span><span className="v">Kairos</span></div>
          <div><span className="k">Type</span><span className="v">Research framework</span></div>
          <div><span className="k">Stage</span><span className="v">v2.0 · Oct 2026</span></div>
          <div><span className="k">Licence</span><span className="v">Apache 2.0</span></div>
        </div>
      </div>

      <div className="section-head">
        <div>
          <span className="t-eyebrow"><span className="dot" />EPISTEMIC CONTROL LOOP</span>
          <h2>
            An AI hypothesis<br />
            has to <span className="em">earn</span><br />
            the right to act.
          </h2>
        </div>
        <div className="head-side">
          <p>
            The problem isn't too little automation. It's too little <em>epistemic control</em>:
            the system's ability to know, measure and act on what it does not know. In Kairos, LLMs
            only propose competing hypotheses. Deterministic code checks each one for structural
            feasibility, calibrated confidence and trajectory uncertainty, then applies a provenance
            veto. Even then, autonomy stops at the action's risk tier.
          </p>
          <div className="signature">— <a href="/EARNING_THE_RIGHT_TO_ACT.pdf" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>Earning the Right to Act · preprint v2 · Oct 2026</a></div>
        </div>
      </div>

      <div className="label-row" style={{ marginTop: 0 }}>FOUNDATIONAL AXIOMS · KAIROS-000</div>
      <AxiomBento />

      <div className="label-row">THE DECISION GATE · INTERACTIVE</div>
      <EpistemicGatekeeper />

      <div className="lbr-row">
        <div className="lbr">
          {LBR.map((c) => (
            <div className="cell" key={c.title} style={{ '--accent': c.accent } as React.CSSProperties}>
              <span className="eb">{c.eyebrow}</span>
              <h3 className="t">{c.title}</h3>
              <p className="b">{c.body}</p>
              <ul>{c.items.map((item) => <li key={item}>{item}</li>)}</ul>
              <a className="cta" href={c.href}>
                {c.cta}
                <span className="arr">→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default KairosSection;
