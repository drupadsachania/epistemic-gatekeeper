/**
 * KairosSection.tsx — Epistemic Prism research hub.
 * Axiom bento + Epistemic Gatekeeper (light glass) + LBR grid.
 * Verdict states: ACT / HOLD / DEFER / REFUSE
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';

/* ── SIGNALS & SCENARIOS ────────────────────────────────────────────────── */

interface Signal {
  key:      string;
  label:    string;
  desc:     string;
  color:    'indigo' | 'amber';
  critical: number;
  weight:   number;
}

const SIGNALS: Signal[] = [
  { key: 'confidence',    label: 'Confidence',    desc: 'P(self-belief correct)',       color: 'indigo', critical: 0.60, weight: 1.0 },
  { key: 'grounding',     label: 'Grounding',     desc: 'Evidence support score',       color: 'indigo', critical: 0.55, weight: 1.1 },
  { key: 'contradiction', label: 'Contradiction', desc: 'Cross-source conflict (inv)',  color: 'amber',  critical: 0.40, weight: 1.0 },
  { key: 'temporal',      label: 'Temporal',      desc: 'Knowledge recency score',      color: 'indigo', critical: 0.50, weight: 0.8 },
  { key: 'reversibility', label: 'Reversibility', desc: 'Action reversibility score',  color: 'amber',  critical: 0.50, weight: 1.2 },
];

interface SignalValues { confidence: number; grounding: number; contradiction: number; temporal: number; reversibility: number; }
const SCENARIOS: Record<string, SignalValues> = {
  steady:   { confidence: 0.82, grounding: 0.78, contradiction: 0.82, temporal: 0.74, reversibility: 0.71 },
  conflict: { confidence: 0.71, grounding: 0.45, contradiction: 0.28, temporal: 0.55, reversibility: 0.60 },
  irrev:    { confidence: 0.88, grounding: 0.71, contradiction: 0.75, temporal: 0.66, reversibility: 0.18 },
  stale:    { confidence: 0.74, grounding: 0.62, contradiction: 0.68, temporal: 0.25, reversibility: 0.62 },
};

/* ── GATE EVALUATION ────────────────────────────────────────────────────── */

interface Verdict {
  score:         number;
  verdict:       'ACT' | 'HOLD' | 'DEFER' | 'REFUSE';
  color:         'allow' | 'hold' | 'deny';
  reason:        string;
  criticalMisses: number;
  lowest:        { key: string | null; v: number };
}

function evaluateGate(signals: SignalValues): Verdict {
  let weighted = 0, totalW = 0, criticalMisses = 0;
  let lowest = { key: null as string | null, v: 1 };
  SIGNALS.forEach((s) => {
    const v = (signals as any)[s.key] as number;
    weighted += v * s.weight;
    totalW   += s.weight;
    if (v < s.critical) criticalMisses += 1;
    if (v < lowest.v)   lowest = { key: s.key, v };
  });
  const score           = weighted / totalW;
  const isTemporalWeak  = signals.temporal  < SIGNALS.find((s) => s.key === 'temporal')!.critical;
  const isGroundingWeak = signals.grounding < SIGNALS.find((s) => s.key === 'grounding')!.critical;

  let verdict: Verdict['verdict'], color: Verdict['color'], reason: string;

  if (criticalMisses >= 2 || score < 0.45) {
    verdict = 'REFUSE'; color = 'deny';
    reason  = criticalMisses >= 2
      ? `${criticalMisses} signals below critical floor — hard stop`
      : 'aggregate score below minimum action threshold';
  } else if (criticalMisses === 0 && (isTemporalWeak || isGroundingWeak) && score >= 0.55) {
    verdict = 'DEFER'; color = 'hold';
    const which = isTemporalWeak && isGroundingWeak ? 'temporal + grounding'
                : isTemporalWeak ? 'temporal' : 'grounding';
    reason = `${which} signal weak — evidence may be stale or incomplete, retry with refreshed context`;
  } else if (criticalMisses === 1 || score < 0.7) {
    verdict = 'HOLD'; color = 'hold';
    const sig = SIGNALS.find((s) => s.key === lowest.key)!;
    reason  = `${sig.label.toLowerCase()} below floor — clarify or seek corroboration before proceeding`;
  } else {
    verdict = 'ACT'; color = 'allow';
    reason  = 'all five signals above floor, aggregate score satisfies action threshold';
  }
  return { score, verdict, color, reason, criticalMisses, lowest };
}

const PALETTE_RGB = {
  indigo: { r: 67,  g: 56,  b: 202 },
  amber:  { r: 245, g: 158, b: 11 },
  deny:   { r: 225, g: 29,  b: 72 },
  allow:  { r: 67,  g: 56,  b: 202 },
  hold:   { r: 245, g: 158, b: 11 },
};

function bezierAt(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const it = 1 - t;
  return it * it * it * p0 + 3 * it * it * t * p1 + 3 * it * t * t * p2 + t * t * t * p3;
}

/* ── GATEKEEPER CANVAS ──────────────────────────────────────────────────── */

interface GatekeeperCanvasProps { signals: SignalValues; verdict: Verdict; }

function GatekeeperCanvas({ signals, verdict }: GatekeeperCanvasProps) {
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

    function draw(t: number) {
      const r = canvas!.getBoundingClientRect();
      const W = r.width, H = r.height;
      ctx.clearRect(0, 0, W, H);

      const gx = W * 0.74, gy = H * 0.5;
      const padY = 36, n = SIGNALS.length;
      const inputs = SIGNALS.map((s, i) => ({
        ...s,
        x: 28,
        y: padY + ((H - padY * 2) * i) / (n - 1),
        v: (signals as any)[s.key] as number,
      }));

      // Light hairline grid
      ctx.strokeStyle = 'rgba(15,13,27,0.04)';
      ctx.lineWidth   = 0.5;
      for (let x = 0; x < W; x += 32) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 32) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Bezier connection curves + packet animation
      inputs.forEach((inp, i) => {
        const c       = PALETTE_RGB[inp.color];
        const strength = inp.v;
        const path    = new Path2D();
        const c1x = W * 0.4, c1y = inp.y, c2x = W * 0.55, c2y = gy;
        path.moveTo(inp.x, inp.y);
        path.bezierCurveTo(c1x, c1y, c2x, c2y, gx - 22, gy);

        ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${0.12 + 0.32 * strength})`;
        ctx.lineWidth   = 0.5 + strength * 1.5;
        ctx.stroke(path);

        const speed = 0.0008 + 0.0008 * strength;
        const phase = (t * speed + i * 0.2) % 1;
        const pts   = 6;
        for (let p = 0; p < pts; p++) {
          const pp  = (phase + p / pts) % 1;
          const ptx = bezierAt(inp.x, c1x, c2x, gx - 22, pp);
          const pty = bezierAt(inp.y, c1y, c2y, gy, pp);
          const alpha = (1 - Math.abs(pp - 0.5) * 2) * 0.7 * strength;
          if (alpha < 0.02) continue;
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`;
          ctx.beginPath();
          ctx.arc(ptx, pty, 1.6 + strength * 1.2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${0.65 + 0.35 * strength})`;
        ctx.beginPath();
        ctx.arc(inp.x, inp.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Gate node — glass triangle with verdict glow
      const vc     = PALETTE_RGB[verdict.color];
      const gateR  = 36;

      // Outer glow
      const og = ctx.createRadialGradient(gx, gy, 0, gx, gy, gateR * 2.6);
      og.addColorStop(0,    `rgba(${vc.r},${vc.g},${vc.b},0.32)`);
      og.addColorStop(0.45, `rgba(${vc.r},${vc.g},${vc.b},0.10)`);
      og.addColorStop(1,    `rgba(${vc.r},${vc.g},${vc.b},0)`);
      ctx.fillStyle = og;
      ctx.beginPath();
      ctx.arc(gx, gy, gateR * 2.6, 0, Math.PI * 2);
      ctx.fill();

      // Prism triangle
      const apex = -Math.PI / 2 + Math.sin(t * 0.0005) * 0.04;
      const pts3 = [0, 1, 2].map((k) => {
        const a = apex + (k * Math.PI * 2) / 3;
        return { x: gx + Math.cos(a) * gateR, y: gy + Math.sin(a) * gateR };
      });
      const triPath = new Path2D();
      triPath.moveTo(pts3[0].x, pts3[0].y);
      triPath.lineTo(pts3[1].x, pts3[1].y);
      triPath.lineTo(pts3[2].x, pts3[2].y);
      triPath.closePath();

      const tg = ctx.createLinearGradient(gx, gy - gateR, gx, gy + gateR);
      tg.addColorStop(0, 'rgba(255,255,255,0.95)');
      tg.addColorStop(1, `rgba(${vc.r},${vc.g},${vc.b},0.18)`);
      ctx.fillStyle   = tg;
      ctx.fill(triPath);
      ctx.strokeStyle = `rgba(${vc.r},${vc.g},${vc.b},0.85)`;
      ctx.lineWidth   = 1.2;
      ctx.stroke(triPath);
      ctx.fillStyle   = `rgba(${vc.r},${vc.g},${vc.b},1)`;
      ctx.beginPath();
      ctx.arc(gx, gy + 4, 3, 0, Math.PI * 2);
      ctx.fill();

      // Output line
      const outX    = W - 16;
      const refused = verdict.verdict === 'REFUSE';
      ctx.setLineDash(refused ? [4, 5] : []);
      ctx.strokeStyle = `rgba(${vc.r},${vc.g},${vc.b},${refused ? 0.32 : 0.85})`;
      ctx.lineWidth   = verdict.verdict === 'ACT' ? 2 : 1.2;
      ctx.beginPath();
      ctx.moveTo(gx + gateR, gy);
      ctx.lineTo(outX, gy);
      ctx.stroke();
      ctx.setLineDash([]);

      if (!refused) {
        ctx.fillStyle = `rgba(${vc.r},${vc.g},${vc.b},1)`;
        ctx.beginPath();
        ctx.moveTo(outX, gy);
        ctx.lineTo(outX - 8, gy - 5);
        ctx.lineTo(outX - 8, gy + 5);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.strokeStyle = `rgba(${vc.r},${vc.g},${vc.b},0.9)`;
        ctx.lineWidth   = 1.5;
        ctx.beginPath();
        ctx.moveTo(outX - 7, gy - 7); ctx.lineTo(outX, gy);
        ctx.moveTo(outX, gy - 7);     ctx.lineTo(outX - 7, gy);
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(draw);
    }
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [signals, verdict]);

  return <canvas ref={ref} style={{ width: '100%', height: '100%', display: 'block' }} />;
}

/* ── EPISTEMIC GATEKEEPER ───────────────────────────────────────────────── */

function EpistemicGatekeeper() {
  const [signals,  setSignals]  = useState<SignalValues>(SCENARIOS.steady);
  const [scenario, setScenario] = useState('steady');
  const verdict = useMemo(() => evaluateGate(signals), [signals]);

  const setSig = (k: string, v: number) => {
    setSignals((prev) => ({ ...prev, [k]: v }));
    setScenario('custom');
  };
  const loadScenario = (key: string) => {
    setScenario(key);
    setSignals(SCENARIOS[key]);
  };

  const verdictColor = verdict.color === 'allow' ? 'var(--indigo)'
                     : verdict.color === 'hold'   ? 'var(--amber)'
                     : 'var(--deny)';

  return (
    <div className="gk glass">
      <style>{`
        .gk {
          display: grid;
          grid-template-columns: 360px 1fr 280px;
          gap: 0;
          overflow: hidden;
        }
        @media (max-width: 1100px) {
          .gk { grid-template-columns: 1fr; }
          .gk-canvas-wrap { min-height: 320px !important; }
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
        .gk-sig { display: flex; flex-direction: column; gap: 18px; }
        .gk-sig-row { display: flex; flex-direction: column; gap: 6px; }
        .gk-sig-row .head {
          display: flex; justify-content: space-between; align-items: baseline;
          font-family: var(--f-sans); font-size: 13px;
        }
        .gk-sig-row .head .lbl { color: var(--ink-0); font-weight: 600; letter-spacing: -0.005em; }
        .gk-sig-row .head .desc {
          color: var(--ink-3); font-size: 10px; font-family: var(--f-mono); letter-spacing: 0.04em;
        }
        .gk-sig-row .head .val {
          color: var(--ink-0); font-variant-numeric: tabular-nums;
          font-family: var(--f-mono); font-size: 12px; font-weight: 500;
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
          width: 1px; background: rgba(15,13,27,0.30);
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

        .gk-canvas-wrap {
          position: relative; min-height: 440px;
          background: radial-gradient(ellipse at center, rgba(67,56,202,0.04), transparent 70%);
        }
        .gk-canvas-overlay {
          position: absolute; inset: 0;
          display: flex; flex-direction: column; justify-content: space-between;
          padding: 22px; pointer-events: none;
        }
        .gk-canvas-overlay .top, .gk-canvas-overlay .bot {
          display: flex; justify-content: space-between;
          font-family: var(--f-mono); font-size: 10px;
          color: var(--ink-3); letter-spacing: 0.14em; text-transform: uppercase;
        }
        .gk-canvas-overlay .top .right { color: var(--ink-2); }

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
          font-size: 52px; font-weight: 600;
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
        .gk-scen button.active { background: rgba(67,56,202,0.08); color: var(--indigo); }
        .gk-scen button .tag { color: var(--ink-4); font-size: 10px; }
      `}</style>

      {/* INPUTS */}
      <div className="gk-col">
        <h4>// inputs · 05 signals</h4>
        <div className="gk-sig">
          {SIGNALS.map((s) => {
            const v     = (signals as any)[s.key] as number;
            const pct   = Math.round(v * 100);
            const under = v < s.critical;
            const c     = `var(--${s.color})`;
            return (
              <div className="gk-sig-row" key={s.key}>
                <div className="head">
                  <div>
                    <span className="lbl">{s.label}</span>
                    <span className="desc" style={{ marginLeft: 10 }}>{s.desc}</span>
                  </div>
                  <span className="val" style={{ color: under ? 'var(--deny)' : c }}>
                    {pct.toString().padStart(2, '0')}%
                  </span>
                </div>
                <div className="bar" style={{ '--c': c } as React.CSSProperties}>
                  <div className={under ? 'fill under' : 'fill'} style={{ width: pct + '%' }} />
                  <div className="crit" style={{ left: (s.critical * 100) + '%' }}
                       title={`critical floor: ${Math.round(s.critical * 100)}%`} />
                  <input type="range" min="0" max="1" step="0.01" value={v}
                         onChange={(e) => setSig(s.key, Number(e.target.value))}
                         aria-label={`${s.label} (0 to 100)`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CANVAS */}
      <div className="gk-canvas-wrap">
        <GatekeeperCanvas signals={signals} verdict={verdict} />
        <div className="gk-canvas-overlay">
          <div className="top">
            <span>// epistemic-gate · live</span>
            <span className="right">decision-fn: weighted + critical-floor</span>
          </div>
          <div className="bot">
            <span>signals → prism</span>
            <span>→ action</span>
          </div>
        </div>
      </div>

      {/* VERDICT */}
      <div className="gk-col gk-verdict" style={{ '--bc': verdictColor } as React.CSSProperties}>
        <h4>// verdict</h4>
        <span className="badge">{verdict.verdict}</span>
        <div className="big">
          {verdict.verdict === 'ACT'   ? <>Act.</> :
           verdict.verdict === 'HOLD'  ? <><em>Hold.</em></> :
           verdict.verdict === 'DEFER' ? <><em>Defer.</em></> :
                                         <><em>Refuse.</em></>}
        </div>
        <div className="score">
          aggregate score · <b>{verdict.score.toFixed(2)}</b><br />
          critical misses · <b>{verdict.criticalMisses}</b>/5
        </div>
        <div className="reason">{verdict.reason}.</div>
        <div className="gk-scen">
          <div className="gk-scen-title">// scenarios</div>
          {[
            { key: 'steady',   label: 'steady state',       tag: '5/5' },
            { key: 'conflict', label: 'source conflict',     tag: 'contradiction↓' },
            { key: 'irrev',    label: 'irreversible action', tag: 'reversibility↓' },
            { key: 'stale',    label: 'stale knowledge',     tag: 'temporal↓' },
          ].map((s) => (
            <button key={s.key}
                    className={scenario === s.key ? 'active' : ''}
                    onClick={() => loadScenario(s.key)}>
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
          border-color: rgba(67,56,202,0.20);
          box-shadow: inset 0 0 28px rgba(67,56,202,0.06), 0 12px 40px rgba(15,13,27,0.06);
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
          margin: 0; text-wrap: pretty; max-width: 60ch;
        }
        .axiom .body em {
          color: var(--ink-0); font-style: italic;
          font-family: var(--f-serif); font-weight: 400; font-size: 1.08em;
        }
        .axiom .footnote {
          margin-top: auto; padding-top: 16px;
          border-top: 1px solid var(--hairline);
          font-family: var(--f-mono); font-size: 11px; color: var(--ink-3);
          letter-spacing: 0.04em; display: flex; justify-content: space-between;
        }
        .axiom .footnote .ref { color: var(--indigo); }

        .axiom-extra {
          margin-top: 24px; padding: 16px 18px;
          background: rgba(67,56,202,0.04); border: 1px solid rgba(67,56,202,0.12);
          border-radius: var(--r-md);
          font-family: var(--f-mono); font-size: 11px; color: var(--ink-2); line-height: 1.7;
        }
        .axiom-extra code { color: var(--indigo); background: transparent; font-family: inherit; }
        .axiom-extra .v {
          font-family: var(--f-mono); font-size: 11px;
          padding: 1px 7px; border-radius: 4px;
          color: var(--indigo);
          background: rgba(67,56,202,0.08); border: 1px solid rgba(67,56,202,0.20);
        }
        .axiom-extra .v.deny  { color: var(--deny);  background: rgba(225,29,72,0.06);  border-color: rgba(225,29,72,0.22); }
        .axiom-extra .v.hold  { color: var(--amber); background: rgba(245,158,11,0.08); border-color: rgba(245,158,11,0.22); }
        .axiom-extra .v.allow { color: var(--indigo); }

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
          background: var(--amber); margin-right: 12px;
          box-shadow: 0 0 0 3px rgba(245,158,11,0.20);
          animation: pulse-soft 1.5s ease-in-out infinite;
        }
        .telemetry-strip .entry { margin-right: 24px; }
        .telemetry-strip .entry .ts   { color: rgba(244,244,245,0.40); margin-right: 8px; }
        .telemetry-strip .entry .lvl-warn { color: #FDBA74; }
        .telemetry-strip .entry .lvl-deny { color: #FCA5A5; }
        .telemetry-strip .entry .lvl-info { color: #C7D2FE; }
        .telemetry-strip .entry .msg  { color: rgba(244,244,245,0.9); }
      `}</style>

      <article className="axiom">
        <span className="num">AXIOM · 01</span>
        <span className="glyph">ψ</span>
        <h3 className="ttl">Hypothesis-Only</h3>
        <p className="body">Every model output is a hypothesis, not a fact. Confidence is a property of the <em>claim</em>, not the claimant.</p>
        <div className="footnote"><span>// taxonomy v0.4</span><span className="ref">§1.1 →</span></div>
      </article>

      <article className="axiom">
        <span className="num">AXIOM · 02</span>
        <span className="glyph">⊢</span>
        <h3 className="ttl">Earn the Right<br />to Act</h3>
        <p className="body">Action requires evidence proportional to its consequence. High-stakes moves demand cross-signal corroboration <em>before</em> the gate releases the agent.</p>
        <div className="axiom-extra">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="v allow">ACT</span>
            <span style={{ color: 'var(--ink-4)', fontSize: 10 }}>score≥0.70 · 0 misses</span>
            <span style={{ color: 'var(--ink-4)', margin: '0 2px' }}>·</span>
            <span className="v hold">HOLD</span>
            <span style={{ color: 'var(--ink-4)', fontSize: 10 }}>1 miss</span>
            <span style={{ color: 'var(--ink-4)', margin: '0 2px' }}>·</span>
            <span className="v hold">DEFER</span>
            <span style={{ color: 'var(--ink-4)', fontSize: 10 }}>stale evidence</span>
            <span style={{ color: 'var(--ink-4)', margin: '0 2px' }}>·</span>
            <span className="v deny">REFUSE</span>
            <span style={{ color: 'var(--ink-4)', fontSize: 10 }}>misses≥2</span>
          </div>
        </div>
        <div className="footnote" style={{ marginTop: 18 }}><span>// proof obligation</span><span className="ref">§2.3 →</span></div>
      </article>

      <article className="axiom">
        <span className="num">AXIOM · 03</span>
        <span className="glyph">∂</span>
        <h3 className="ttl">Uncertainty as Structure</h3>
        <p className="body">Uncertainty is <em>decomposable</em> and routable — not a single scalar. Treat it as a first-class data type, with shape.</p>
        <div className="footnote"><span>// 5-vector</span><span className="ref">§3.0 →</span></div>
      </article>

      <article className="axiom">
        <span className="num">AXIOM · 04</span>
        <span className="glyph">!</span>
        <h3 className="ttl">No Silent Failures</h3>
        <p className="body">A system that abstains <em>loudly</em> is preferable to one that hallucinates quietly. Every refusal carries telemetry — every hold, every deny, every uncertainty above threshold becomes a first-class event on the bus.</p>
        <div className="telemetry-strip" aria-label="Live telemetry sample">
          <span className="pulse-dot" />
          <span className="entry"><span className="ts">14:02:11.402</span><span className="lvl-deny">REFUSE</span> <span className="msg">tool.delete · reversibility=0.18</span></span>
          <span className="entry"><span className="ts">14:02:11.501</span><span className="lvl-warn">HOLD</span> <span className="msg">grounding=0.45 · awaiting retrieval</span></span>
          <span className="entry"><span className="ts">14:02:11.612</span><span className="lvl-info">ACT</span> <span className="msg">summary.respond · score=0.81</span></span>
          <span className="entry"><span className="ts">14:02:11.733</span><span className="lvl-warn">DEFER</span> <span className="msg">temporal=0.25 · stale source, retry</span></span>
        </div>
        <div className="footnote" style={{ marginTop: 18 }}><span>// circuit-breaker</span><span className="ref">§4.2 →</span></div>
      </article>
    </div>
  );
}

/* ── LEARN / BUILD / CONTRIBUTE ─────────────────────────────────────────── */

const LBR = [
  {
    eyebrow: '01 / LEARN', title: 'The research',
    body: 'Frontier models exhibit ECE of 37–57% on expert benchmarks. Hallucination rates reach 52% in multi-step reasoning. This paper measures why — and how epistemic gating cuts that to 3%.',
    items: ['Earning the Right to Act — preprint', 'Signal taxonomy reference', 'Uncertainty quantification framework'],
    cta: 'Read the research', accent: 'var(--indigo)', href: '/docs',
  },
  {
    eyebrow: '02 / BUILD', title: 'Reference implementations',
    body: 'Drop-in evaluators for confidence, grounding, contradiction. Compose them into a gate. Wire the gate into your agent loop.',
    items: ['Evaluator primitives', 'Gate composition kit', 'Argus XDR integration'],
    cta: 'View on GitHub', accent: 'var(--indigo-bright)', href: 'https://github.com/kairos-dev-kairos-ecl',
  },
  {
    eyebrow: '03 / CONTRIBUTE', title: 'Get involved',
    body: 'The framework is open. Open issues, open PRs, open questions. If you run autonomous systems in high-stakes domains, we want your telemetry.',
    items: ['Open issues on GitHub', 'Join the mailing list', 'Propose a signal extension'],
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
          <div><span className="k">Stage</span><span className="v">Active · v0.4</span></div>
          <div><span className="k">Licence</span><span className="v">Apache 2.0</span></div>
        </div>
      </div>

      <div className="section-head">
        <div>
          <span className="t-eyebrow"><span className="dot" />RESEARCH &amp; TAXONOMY HUB</span>
          <h2>
            A framework for<br />
            what an agent <span className="em">should</span><br />
            be allowed to do.
          </h2>
        </div>
        <div className="head-side">
          <p>
            Kairos formalises agentic uncertainty into five orthogonal signals — confidence,
            grounding, contradiction, temporal alignment, reversibility — and a gating
            function that converts them into one of four verdicts: <em>act</em>, <em>hold</em>,{' '}
            <em>defer</em>, or <em>refuse</em>. Think MITRE&nbsp;ATLAS, but the threat is the
            model's own conviction.
          </p>
          <div className="signature">— <a href="/EARNING_THE_RIGHT_TO_ACT.pdf" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>kairos-foundation.org/whitepaper</a></div>
        </div>
      </div>

      <div className="label-row" style={{ marginTop: 0 }}>FOUR FOUNDATIONAL AXIOMS</div>
      <AxiomBento />

      <div className="label-row">EPISTEMIC GATEKEEPER · INTERACTIVE</div>
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
