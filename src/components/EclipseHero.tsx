/**
 * EclipseHero.tsx — Epistemic Prism hero section.
 * HeroPrism canvas (refracted beam fan + glass triangle) + centered copy + pillar cards.
 */

import React, { useEffect, useRef } from 'react';

/* ── HERO PRISM CANVAS ────────────────────────────────────────────────── */

function HeroPrism() {
  const ref    = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let tMouseX = 0.5, mouseX = 0.5;
    let tMouseY = 0.5, mouseY = 0.5;

    function resize() {
      const r = canvas!.getBoundingClientRect();
      canvas!.width  = r.width  * dpr;
      canvas!.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function onMove(e: MouseEvent) {
      const r = canvas!.getBoundingClientRect();
      tMouseX = (e.clientX - r.left) / r.width;
      tMouseY = (e.clientY - r.top)  / r.height;
    }
    function onLeave() { tMouseX = 0.5; tMouseY = 0.5; }
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    function draw(t: number) {
      const r = canvas!.getBoundingClientRect();
      const W = r.width, H = r.height;
      ctx.clearRect(0, 0, W, H);

      mouseX += (tMouseX - mouseX) * 0.06;
      mouseY += (tMouseY - mouseY) * 0.06;

      const cx   = W * 0.5;
      const cy   = H * 0.5;
      const time = t * 0.0006;

      // 1) Refracted beam fan from center
      const beamCount = 7;
      const baseAngle = -Math.PI / 4 + (mouseX - 0.5) * 0.3;
      const spread    = 0.45 + Math.abs(mouseY - 0.5) * 0.2;
      const hues      = [252, 245, 230, 200, 38, 28, 8];

      for (let i = 0; i < beamCount; i++) {
        const f   = i / (beamCount - 1);
        const a   = baseAngle + (f - 0.5) * spread;
        const len = Math.max(W, H) * 0.9;
        const wid = 60 + 30 * Math.sin(time * 0.5 + i);

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(a);
        const g = ctx.createLinearGradient(0, 0, len, 0);
        const h = hues[i];
        g.addColorStop(0,    `hsla(${h},85%,60%,0.18)`);
        g.addColorStop(0.25, `hsla(${h},85%,60%,0.10)`);
        g.addColorStop(1,    `hsla(${h},85%,60%,0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(len * 0.5, 0, len * 0.5, wid, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 2) Central glass triangle
      const triR    = Math.min(W, H) * 0.16;
      const triPath = new Path2D();
      const apex    = -Math.PI / 2;
      const pts     = [0, 1, 2].map((k) => {
        const angle = apex + (k * Math.PI * 2) / 3;
        return { x: cx + Math.cos(angle) * triR, y: cy + Math.sin(angle) * triR };
      });
      triPath.moveTo(pts[0].x, pts[0].y);
      triPath.lineTo(pts[1].x, pts[1].y);
      triPath.lineTo(pts[2].x, pts[2].y);
      triPath.closePath();

      const triGrad = ctx.createLinearGradient(cx, cy - triR, cx, cy + triR);
      triGrad.addColorStop(0,   'rgba(255,255,255,0.55)');
      triGrad.addColorStop(0.5, 'rgba(255,255,255,0.32)');
      triGrad.addColorStop(1,   'rgba(255,255,255,0.18)');
      ctx.fillStyle = triGrad;
      ctx.fill(triPath);

      ctx.strokeStyle = 'rgba(67,56,202,0.45)';
      ctx.lineWidth   = 1;
      ctx.stroke(triPath);

      ctx.save();
      ctx.clip(triPath);
      const innerG = ctx.createRadialGradient(cx, cy, 0, cx, cy, triR);
      innerG.addColorStop(0, 'rgba(245,158,11,0.18)');
      innerG.addColorStop(1, 'rgba(67,56,202,0.10)');
      ctx.fillStyle = innerG;
      ctx.fillRect(cx - triR, cy - triR, triR * 2, triR * 2);
      ctx.restore();

      // 3) Ambient incoming beam
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.PI);
      const incoming = ctx.createLinearGradient(0, 0, W * 0.4, 0);
      incoming.addColorStop(0,   'rgba(255,255,255,0)');
      incoming.addColorStop(0.8, 'rgba(255,255,255,0.45)');
      incoming.addColorStop(1,   'rgba(255,255,255,0.8)');
      ctx.fillStyle = incoming;
      ctx.beginPath();
      ctx.ellipse(W * 0.2, 0, W * 0.2, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      rafRef.current = requestAnimationFrame(draw);
    }
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvas.removeEventListener('mousemove',  onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <canvas ref={ref} className="hero-prism-canvas" aria-hidden="true" />;
}

/* ── HERO SECTION ─────────────────────────────────────────────────────── */

const EclipseHero: React.FC = () => (
  <section id="top" className="hero">
    <style>{`
      .hero {
        position: relative;
        padding: 56px 0 100px;
        overflow: hidden;
      }
      .hero-prism-canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: auto;
        opacity: 0.85;
      }
      .hero-inner {
        position: relative;
        z-index: 2;
        padding: 80px 0 0;
        text-align: center;
        pointer-events: none;
      }
      .hero-inner > * { pointer-events: auto; }

      .hero-tag {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 6px 14px;
        background: var(--surface-strong);
        backdrop-filter: blur(8px);
        border: 1px solid var(--hairline-strong);
        border-radius: 999px;
        font-family: var(--f-mono);
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.16em;
        color: var(--ink-2);
        text-transform: uppercase;
        margin-bottom: 28px;
      }
      .hero-tag .pulse {
        width: 7px; height: 7px;
        border-radius: 50%;
        background: var(--indigo);
        box-shadow: 0 0 0 3px rgba(67,56,202,0.20);
        animation: pulse-soft 2s ease-in-out infinite;
      }

      .hero-h1 {
        font-family: var(--f-sans);
        font-size: clamp(56px, 11vw, 160px);
        font-weight: 600;
        letter-spacing: -0.045em;
        line-height: 0.9;
        margin: 0 0 24px;
        color: var(--ink-0);
      }
      .hero-h1 .word { display: inline-block; }
      .hero-h1 .obs {
        background: linear-gradient(120deg, #4338CA 0%, #6366F1 35%, #F59E0B 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        font-style: italic;
        font-family: var(--f-serif);
        font-weight: 400;
      }

      .hero-lede {
        font-size: clamp(17px, 1.4vw, 20px);
        line-height: 1.55;
        color: var(--ink-2);
        max-width: 640px;
        margin: 0 auto 40px;
        text-wrap: pretty;
      }

      .hero-cta-row {
        display: inline-flex;
        gap: 12px;
        flex-wrap: wrap;
        justify-content: center;
      }

      .hero-coords {
        position: relative;
        z-index: 2;
        margin: 120px 0 0;
        padding: 28px 0 0;
        border-top: var(--rule);
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 32px;
      }
      @media (max-width: 880px) {
        .hero-coords { grid-template-columns: repeat(2, 1fr); gap: 20px; }
      }
      .hero-coords .cell .k {
        font-family: var(--f-mono); font-size: 10px;
        letter-spacing: 0.16em; text-transform: uppercase;
        color: var(--ink-4); margin-bottom: 6px;
      }
      .hero-coords .cell .v {
        font-family: var(--f-sans); font-size: 26px;
        font-weight: 600; letter-spacing: -0.03em;
        color: var(--ink-0); line-height: 1.05;
      }
      .hero-coords .cell .v .unit {
        font-family: var(--f-mono); font-size: 13px;
        font-weight: 400; color: var(--ink-3);
        margin-left: 6px; letter-spacing: 0;
      }
      .hero-coords .cell .vs {
        font-family: var(--f-mono); font-size: 11px;
        color: var(--ink-3); margin-top: 4px; letter-spacing: 0;
      }

      .pillar-grid {
        margin-top: 80px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        position: relative;
        z-index: 2;
      }
      @media (max-width: 1000px) { .pillar-grid { grid-template-columns: 1fr; } }

      .pillar {
        padding: 28px 28px 24px;
        background: var(--surface);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid var(--hairline);
        border-radius: var(--r-lg);
        box-shadow: var(--shadow-card);
        text-decoration: none;
        color: inherit;
        display: flex; flex-direction: column;
        min-height: 220px;
        transition: all 0.4s var(--ease-out);
        position: relative;
        overflow: hidden;
      }
      .pillar::before {
        content: ""; position: absolute;
        left: 0; right: 0; top: 0; height: 2px;
        background: var(--accent, var(--indigo));
        opacity: 0.85;
        transform-origin: left;
        transition: transform 0.4s var(--ease-out);
      }
      .pillar:hover {
        transform: translateY(-4px);
        background: var(--surface-strong);
        box-shadow: inset 0 0 24px color-mix(in oklab, var(--accent, var(--indigo)) 6%, transparent),
                    0 12px 40px rgba(15,13,27,0.06);
        border-color: color-mix(in oklab, var(--accent, var(--indigo)) 22%, var(--hairline));
      }
      .pillar .num {
        font-family: var(--f-mono); font-size: 11px;
        color: var(--ink-3); letter-spacing: 0.14em; margin-bottom: 20px;
      }
      .pillar .ttl {
        font-family: var(--f-sans); font-size: 24px;
        font-weight: 600; letter-spacing: -0.02em;
        color: var(--ink-0); margin: 0 0 10px; line-height: 1.1;
      }
      .pillar .ttl .badge {
        font-family: var(--f-mono); font-size: 10px;
        font-weight: 500; letter-spacing: 0.16em;
        color: var(--amber); margin-left: 10px;
        vertical-align: middle;
        background: rgba(245,158,11,0.10);
        padding: 3px 7px; border-radius: 4px;
        border: 1px solid rgba(245,158,11,0.25);
      }
      .pillar .sub {
        font-family: var(--f-sans); font-size: 14px;
        color: var(--ink-2); line-height: 1.5; margin: 0 0 20px; text-wrap: pretty;
      }
      .pillar .meta {
        margin-top: auto;
        padding-top: 16px;
        border-top: var(--rule);
        display: flex; justify-content: space-between; align-items: center;
        font-family: var(--f-mono); font-size: 11px;
        color: var(--ink-3); letter-spacing: 0.04em;
      }
      .pillar .meta .arrow {
        color: var(--accent, var(--indigo));
        font-size: 16px;
        transition: transform 0.2s var(--ease-out);
      }
      .pillar:hover .meta .arrow { transform: translateX(4px); }
    `}</style>

    <HeroPrism />

    <div className="wrap">
      <div className="hero-inner">
        <div className="hero-tag">
          <span className="pulse" />
          KAIROS FOUNDATION · OPEN RESEARCH · APACHE 2.0
        </div>
        <h1 className="hero-h1">
          <span className="word">Know when to act.</span><br />
          <span className="word obs">Know when not to.</span>
        </h1>
        <p className="hero-lede">
          An open epistemic decision framework for autonomous systems in high-stakes domains.
          Four decision states. Five epistemic signals. Zero LLM influence on policy.
        </p>
        <div className="hero-cta-row">
          <a className="btn btn-primary" href="/docs">
            Read the Research
            <span style={{ fontSize: 16, lineHeight: '1' }}>→</span>
          </a>
          <a className="btn btn-ghost" href="#argus-sdk">
            Install Argus
          </a>
        </div>
      </div>

      <div className="hero-coords">
        <div className="cell">
          <div className="k">// scope</div>
          <div className="v">Agentic AI</div>
          <div className="vs">LLM systems · tools · orchestrators</div>
        </div>
        <div className="cell">
          <div className="k">// signals</div>
          <div className="v">5 <span className="unit">orthogonal</span></div>
          <div className="vs">confidence · grounding · contradiction · temporal · reversibility</div>
        </div>
        <div className="cell">
          <div className="k">// throughput</div>
          <div className="v">10K+ <span className="unit">signals/sec</span></div>
          <div className="vs">at &lt;100ms detection latency</div>
        </div>
        <div className="cell">
          <div className="k">// posture</div>
          <div className="v">Hypothesis-only</div>
          <div className="vs">earn the right to act</div>
        </div>
      </div>

      <div className="pillar-grid">
        <a href="#kairos" className="pillar"
           style={{ '--accent': 'var(--indigo)' } as React.CSSProperties}>
          <span className="num">01 · RESEARCH</span>
          <h3 className="ttl">Kairos</h3>
          <p className="sub">
            The taxonomy &amp; framework. Five orthogonal uncertainty signals, four foundational
            axioms, one gating function.
          </p>
          <div className="meta">
            <span>4 axioms · 5 signals · v0.4</span>
            <span className="arrow">→</span>
          </div>
        </a>

        <a href="#argus-xdr" className="pillar"
           style={{ '--accent': 'var(--indigo-bright)' } as React.CSSProperties}>
          <span className="num">02 · OBSERVABILITY</span>
          <h3 className="ttl">Argus XDR</h3>
          <p className="sub">
            Every signal, every layer, fully correlated. Open-source XDR for LLM systems —
            10-layer signal taxonomy, 4-tier detection.
          </p>
          <div className="meta">
            <span>OSS · Apache 2.0 · v0.4.2</span>
            <span className="arrow">→</span>
          </div>
        </a>

        <a href="#argus-sdk" className="pillar"
           style={{ '--accent': 'var(--amber)' } as React.CSSProperties}>
          <span className="num">03 · INTEGRATION</span>
          <h3 className="ttl">Argus SDK <span className="badge">SOON</span></h3>
          <p className="sub">
            Lightweight Go telemetry agent. OCSF-native out of the box. Forwards to your
            existing SIEM and observability stack.
          </p>
          <div className="meta">
            <span>Go · OCSF v1.3 · Q3 2026</span>
            <span className="arrow">→</span>
          </div>
        </a>
      </div>
    </div>
  </section>
);

export default EclipseHero;
