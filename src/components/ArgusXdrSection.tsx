/**
 * ArgusXdrSection.tsx — Epistemic Prism observability tool section.
 * 10-layer taxonomy (LayerStack) + performance cards + sidecar compare + install terminal.
 */

import React, { useEffect, useState } from 'react';

/* ── LAYERS & PILLARS ───────────────────────────────────────────────────── */

interface Layer { n: number; name: string; pillar: string; desc: string; }
const LAYERS: Layer[] = [
  { n: 1,  name: 'Hardware',        pillar: 'infra', desc: 'GPU temp, memory pressure, driver state' },
  { n: 2,  name: 'Runtime',         pillar: 'infra', desc: 'Container, scheduler, OS-level events' },
  { n: 3,  name: 'Model Loading',   pillar: 'infra', desc: 'Weights, quantization, checksum drift' },
  { n: 4,  name: 'Inference',       pillar: 'model', desc: 'Logits, attention, sampling temperature' },
  { n: 5,  name: 'Output Decoding', pillar: 'model', desc: 'Token confidence, entropy spikes' },
  { n: 6,  name: 'Integration',     pillar: 'integ', desc: 'API auth, sidecar contracts, transport' },
  { n: 7,  name: 'Tool Use',        pillar: 'integ', desc: 'Function calls, side-effects, retries' },
  { n: 8,  name: 'Data Access',     pillar: 'integ', desc: 'Retrieval queries, source provenance' },
  { n: 9,  name: 'Orchestration',   pillar: 'app',   desc: 'Multi-step plans, sub-agent handoffs' },
  { n: 10, name: 'Application',     pillar: 'app',   desc: 'User-facing surface, session context' },
];
const PILLARS: Record<string, { label: string; color: string; rows: number }> = {
  infra: { label: 'Infrastructure', color: 'var(--indigo)',        rows: 3 },
  model: { label: 'Model',          color: 'var(--indigo-bright)', rows: 2 },
  integ: { label: 'Integration',    color: 'var(--amber)',         rows: 3 },
  app:   { label: 'Application',    color: 'var(--indigo)',        rows: 2 },
};

/* ── LAYER STACK ────────────────────────────────────────────────────────── */

interface Shooter { id: number; lane: number; delay: number; duration: number; pillar: string; }

function LayerStack() {
  const [active, setActive] = useState(4);
  const [shooters, setShooters] = useState<Shooter[]>(() =>
    Array.from({ length: 5 }, (_, i) => ({
      id: i, lane: Math.floor(Math.random() * 6),
      delay: i * 0.8, duration: 4 + Math.random() * 2.5,
      pillar: Object.keys(PILLARS)[i % 4],
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setShooters((prev) => prev.map((s, i) => ({
        ...s, lane: Math.floor(Math.random() * 6), delay: 0,
        duration: 4 + Math.random() * 2.5,
        pillar: ['infra', 'model', 'integ', 'app'][Math.floor(Math.random() * 4)],
        id: Date.now() + i,
      })));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="layer-stack">
      <style>{`
        .layer-stack {
          position: relative; display: grid;
          grid-template-columns: 160px 1fr; gap: 0;
          background: var(--surface); backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--hairline); border-radius: var(--r-lg);
          box-shadow: var(--shadow-card); overflow: hidden;
        }
        @media (max-width: 880px) { .layer-stack { grid-template-columns: 110px 1fr; } }
        .ls-pillars { display: flex; flex-direction: column; border-right: 1px solid var(--hairline); background: rgba(15,13,27,0.015); }
        .ls-pillar {
          flex: var(--rows, 1); padding: 16px 18px;
          display: flex; flex-direction: column; justify-content: space-between;
          border-bottom: 1px solid var(--hairline); position: relative;
        }
        .ls-pillar:last-child { border-bottom: 0; }
        .ls-pillar::before {
          content: ""; position: absolute; left: 0; top: 14px; bottom: 14px; width: 2px;
          background: var(--c); opacity: 0.85;
        }
        .ls-pillar .name { font-family: var(--f-sans); font-size: 14px; font-weight: 600; letter-spacing: -0.01em; color: var(--ink-0); }
        .ls-pillar .meta { font-family: var(--f-mono); font-size: 10px; color: var(--ink-3); letter-spacing: 0.06em; }
        .ls-rows { position: relative; display: flex; flex-direction: column; }
        .ls-row {
          position: relative; display: grid; grid-template-columns: 56px 1fr auto;
          gap: 16px; padding: 18px 24px; border-bottom: 1px solid var(--hairline);
          align-items: center; cursor: pointer;
          transition: background 0.18s var(--ease-out); z-index: 1;
        }
        .ls-row:last-child { border-bottom: 0; }
        .ls-row:hover, .ls-row.active { background: rgba(67,56,202,0.04); }
        .ls-row.active { box-shadow: inset 3px 0 0 var(--c); }
        .ls-row .n { font-family: var(--f-mono); font-size: 11px; color: var(--ink-3); letter-spacing: 0.06em; font-variant-numeric: tabular-nums; }
        .ls-row .body { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
        .ls-row .body .name { font-family: var(--f-sans); font-size: 15px; font-weight: 600; letter-spacing: -0.01em; color: var(--ink-0); }
        .ls-row .body .desc { font-family: var(--f-mono); font-size: 11px; color: var(--ink-2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ls-row .pill {
          font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
          padding: 4px 9px; border-radius: var(--r-xs);
          color: var(--c); background: color-mix(in oklab, var(--c) 8%, transparent);
          border: 1px solid color-mix(in oklab, var(--c) 28%, transparent);
        }
        .ls-lanes {
          position: absolute; left: 84px; right: 84px; top: 0; bottom: 76px;
          pointer-events: none; display: grid; grid-template-columns: repeat(6, 1fr); z-index: 0;
        }
        @media (max-width: 880px) { .ls-lanes { left: 60px; right: 60px; } }
        .ls-lane { position: relative; overflow: hidden; }
        .ls-shooter {
          position: absolute; left: 50%; top: -8px;
          width: 5px; height: 5px; margin-left: -2.5px; border-radius: 50%;
          background: var(--c); box-shadow: 0 0 12px var(--c), 0 0 4px var(--c);
          animation: shoot var(--dur, 4s) linear var(--delay, 0s) infinite; opacity: 0.6;
        }
        .ls-shooter::after {
          content: ""; position: absolute; left: 50%; bottom: 4px;
          width: 1px; height: 80px; margin-left: -0.5px;
          background: linear-gradient(to top, var(--c), transparent); opacity: 0.5;
        }
        @keyframes shoot {
          0%   { transform: translateY(0); opacity: 0; }
          8%   { opacity: 0.6; }
          92%  { opacity: 0.6; }
          100% { transform: translateY(calc(100% + 60px)); opacity: 0; }
        }
        .ls-decision {
          position: relative; padding: 22px 24px;
          background: linear-gradient(90deg, rgba(67,56,202,0.10), rgba(99,102,241,0.10), rgba(245,158,11,0.08));
          border-top: 1px solid rgba(67,56,202,0.30);
          display: grid; grid-template-columns: 56px 1fr auto; gap: 16px; align-items: center;
          z-index: 2; overflow: hidden;
        }
        .ls-decision::before {
          content: ""; position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(67,56,202,0.10), transparent 60%),
                      radial-gradient(ellipse 50% 80% at 100% 50%, rgba(245,158,11,0.10), transparent 60%);
          pointer-events: none;
        }
        .ls-decision .n { font-family: var(--f-mono); font-size: 11px; color: var(--indigo); letter-spacing: 0.10em; font-weight: 500; }
        .ls-decision .name { font-family: var(--f-sans); font-size: 22px; font-weight: 600; letter-spacing: -0.025em; color: var(--ink-0); }
        .ls-decision .desc { font-family: var(--f-mono); font-size: 11px; color: var(--ink-2); }
        .ls-decision .actions { display: flex; gap: 6px; }
        .ls-decision .actions .a {
          font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.14em; padding: 5px 11px;
          border-radius: var(--r-xs); font-weight: 500;
          border: 1px solid color-mix(in oklab, var(--c) 38%, transparent);
          color: var(--c); background: color-mix(in oklab, var(--c) 10%, transparent);
        }
      `}</style>

      <div className="ls-pillars">
        {Object.entries(PILLARS).map(([key, p]) => (
          <div key={key} className="ls-pillar"
               style={{ '--rows': p.rows, '--c': p.color } as React.CSSProperties}>
            <div className="name">{p.label}</div>
            <div className="meta">{p.rows} layer{p.rows > 1 ? 's' : ''}</div>
          </div>
        ))}
      </div>

      <div className="ls-rows">
        <div className="ls-lanes" aria-hidden="true">
          {[0,1,2,3,4,5].map((i) => (
            <div className="ls-lane" key={i}>
              {shooters.filter((s) => s.lane === i).map((s) => (
                <div key={s.id} className="ls-shooter"
                     style={{ '--c': PILLARS[s.pillar].color, '--dur': `${s.duration}s`, '--delay': `${s.delay}s` } as React.CSSProperties} />
              ))}
            </div>
          ))}
        </div>

        {LAYERS.map((l) => {
          const p = PILLARS[l.pillar];
          return (
            <div key={l.n} className={`ls-row${active === l.n ? ' active' : ''}`}
                 style={{ '--c': p.color } as React.CSSProperties}
                 onMouseEnter={() => setActive(l.n)}>
              <span className="n">L{String(l.n).padStart(2, '0')}</span>
              <div className="body">
                <span className="name">{l.name}</span>
                <span className="desc">{l.desc}</span>
              </div>
              <span className="pill">{p.label.slice(0, 5).toUpperCase()}</span>
            </div>
          );
        })}

        <div className="ls-decision">
          <span className="n">L11 ★</span>
          <div>
            <div className="name">Decision Layer</div>
            <div className="desc">// policy · alerts · response · feedback into the gate</div>
          </div>
          <div className="actions">
            <span className="a" style={{ '--c': 'var(--indigo)' } as React.CSSProperties}>ACT</span>
            <span className="a" style={{ '--c': 'var(--amber)'  } as React.CSSProperties}>HOLD</span>
            <span className="a" style={{ '--c': 'var(--amber)'  } as React.CSSProperties}>DEFER</span>
            <span className="a" style={{ '--c': 'var(--deny)'   } as React.CSSProperties}>REFUSE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── PERFORMANCE CARDS ──────────────────────────────────────────────────── */

function PerfCards() {
  const tiers = [
    { name: 'Deterministic', color: 'var(--indigo)',        desc: 'Rule-based · signatures · regex · constant-time' },
    { name: 'Statistical',   color: 'var(--indigo-bright)', desc: 'Distributional drift · z-scores · IQR' },
    { name: 'Temporal',      color: 'var(--amber)',          desc: 'Sequence anomalies · rate-of-change' },
    { name: 'Semantic',      color: 'var(--indigo)',         desc: 'Embedding · cross-source coherence' },
  ];
  return (
    <div className="perf">
      <style>{`
        .perf { display: grid; grid-template-columns: 1fr 1fr 1.5fr; gap: 16px; }
        @media (max-width: 1000px) { .perf { grid-template-columns: 1fr; } }
        .perf-card {
          background: var(--surface); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--hairline); border-radius: var(--r-lg); box-shadow: var(--shadow-card);
          padding: 28px 26px; position: relative; overflow: hidden;
          display: flex; flex-direction: column; min-height: 180px;
        }
        .perf-card .eb { font-family: var(--f-mono); font-size: 10px; color: var(--ink-3); letter-spacing: 0.16em; text-transform: uppercase; }
        .perf-card .big {
          font-family: var(--f-sans); font-weight: 600;
          font-size: clamp(48px, 5.5vw, 72px); line-height: 0.95; letter-spacing: -0.045em;
          color: var(--ink-0); margin: 14px 0 6px;
        }
        .perf-card .big sub { font-family: var(--f-mono); font-size: 14px; color: var(--ink-3); letter-spacing: 0; font-weight: 400; vertical-align: middle; margin-left: 8px; }
        .perf-card .sub { font-family: var(--f-sans); font-size: 14px; color: var(--ink-2); line-height: 1.5; margin-top: auto; }
        .perf-card .progress {
          margin-top: 18px; height: 4px; border-radius: 999px;
          background: rgba(15,13,27,0.06); overflow: hidden; position: relative;
        }
        .perf-card .progress .fill {
          position: absolute; left: 0; top: 0; bottom: 0;
          background: linear-gradient(90deg, var(--indigo), var(--indigo-bright));
          border-radius: 999px; width: var(--w, 70%);
        }
        .perf-card.amber .progress .fill { background: linear-gradient(90deg, var(--amber), #FCD34D); }
        .perf-card .scan {
          position: absolute; left: 0; right: 0; top: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(67,56,202,0.5), transparent);
          animation: scan-line 4s var(--ease-in-out) infinite;
        }
        @keyframes scan-line {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .perf-bars { display: grid; gap: 10px; margin-top: 14px; }
        .perf-bar {
          display: grid; grid-template-columns: 14px 110px 1fr auto;
          gap: 10px; align-items: center;
          font-family: var(--f-mono); font-size: 11.5px; color: var(--ink-1);
        }
        .perf-bar .dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--c); box-shadow: 0 0 0 3px color-mix(in oklab, var(--c) 14%, transparent);
          margin-left: 3px;
        }
        .perf-bar .name  { color: var(--ink-0); font-weight: 500; }
        .perf-bar .desc  { color: var(--ink-3); font-size: 10.5px; }
        .perf-bar .tier  { color: var(--ink-3); font-size: 10px; letter-spacing: 0.16em; }
      `}</style>

      <article className="perf-card">
        <span className="scan" />
        <span className="eb">// throughput</span>
        <div className="big">10K+<sub>signals/sec</sub></div>
        <div className="sub">Sustained ingest throughput per node. Horizontally sharded; queue back-pressured.</div>
        <div className="progress"><div className="fill" style={{ '--w': '92%' } as React.CSSProperties} /></div>
      </article>

      <article className="perf-card amber">
        <span className="scan" style={{ background: 'linear-gradient(90deg,transparent,rgba(245,158,11,0.5),transparent)' }} />
        <span className="eb">// latency</span>
        <div className="big">&lt;100<sub>ms</sub></div>
        <div className="sub">Detection latency, p99 — from signal arrival to verdict at the decision layer.</div>
        <div className="progress"><div className="fill" style={{ '--w': '82%' } as React.CSSProperties} /></div>
      </article>

      <article className="perf-card">
        <span className="eb">// engine · 4-tier detection</span>
        <div className="perf-bars">
          {tiers.map((t, i) => (
            <div className="perf-bar" key={t.name} style={{ '--c': t.color } as React.CSSProperties}>
              <span className="dot" />
              <span className="name">{t.name}</span>
              <span className="desc">{t.desc}</span>
              <span className="tier">T{i + 1}</span>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

/* ── SIDECAR COMPARISON ─────────────────────────────────────────────────── */

const PROMPT_TEXT = '> delete the production indexes that contain stale embeddings.';
const RESP_WITHOUT = '~ ok. deleting indexes: emb_prod_v1, emb_legacy, retrieval_cache_*…';
const RESP_WITH    = '~ refused. "delete" requires reversibility ≥ 0.6; current 0.18 (no undo path).';

function Stream({ variant, p }: { variant: 'without' | 'with'; p: number }) {
  let promptStr = '', respStr = '';
  if (variant === 'without') {
    const promptT = Math.min(1, p / 0.3);
    promptStr = PROMPT_TEXT.slice(0, Math.floor(PROMPT_TEXT.length * promptT));
    if (p >= 0.3) {
      const respT = Math.min(1, (p - 0.3) / 0.6);
      respStr = RESP_WITHOUT.slice(0, Math.floor(RESP_WITHOUT.length * respT));
    }
  } else {
    const phase = (p * 3) % 1;
    const promptT = Math.min(1, phase / 0.3);
    promptStr = PROMPT_TEXT.slice(0, Math.floor(PROMPT_TEXT.length * promptT));
    if (phase >= 0.4) {
      const respT = Math.min(1, (phase - 0.4) / 0.5);
      respStr = RESP_WITH.slice(0, Math.floor(RESP_WITH.length * respT));
    }
  }
  const respColor = variant === 'without' ? '#FCA5A5' : '#86EFAC';
  const fullResp  = variant === 'without' ? RESP_WITHOUT : RESP_WITH;
  return (
    <div className="sc-stream">
      <div className="lbl">// transcript</div>
      <code>
        <span style={{ color: 'rgba(244,244,245,0.55)' }}>{promptStr}</span>
        {promptStr.length < PROMPT_TEXT.length && <span className="caret" style={{ color: 'rgba(244,244,245,0.55)' }} />}
        {respStr && <><br /><span style={{ color: respColor }}>{respStr}</span>{respStr.length < fullResp.length && <span className="caret" style={{ color: respColor }} />}</>}
      </code>
    </div>
  );
}

function SidecarFlow({ variant, p }: { variant: 'without' | 'with'; p: number }) {
  if (variant === 'without') {
    const stage1 = p < 0.5, stage2 = p >= 0.5;
    return (
      <>
        <div className={`sc-edge ${stage1 ? 'active' : ''}`} style={{ left: '18%', width: '34%', '--nc': 'var(--ink-3)' } as React.CSSProperties} />
        <div className={`sc-edge ${stage2 ? 'active' : ''}`} style={{ left: '52%', width: '30%', '--nc': 'var(--deny)' } as React.CSSProperties} />
        <div className={`sc-node ${stage1 ? 'active' : ''}`} style={{ left: '18%', '--nc': 'var(--ink-2)' } as React.CSSProperties}>PROMPT<span className="sub">user input</span></div>
        <div className={`sc-node ${(p > 0.25 && p < 0.75) ? 'active' : ''}`} style={{ left: '52%', '--nc': 'var(--ink-2)' } as React.CSSProperties}>LLM<span className="sub">no gate</span></div>
        <div className={`sc-node ${stage2 ? 'active' : ''}`} style={{ left: '82%', '--nc': 'var(--deny)' } as React.CSSProperties}>OUTPUT<span className="sub">unchecked</span></div>
      </>
    );
  }
  const refuseCycle = Math.floor(p * 3) % 3 === 2;
  const phase = (p * 3) % 1;
  const stagePrompt = phase < 0.25, stageGate = phase >= 0.2 && phase < 0.55;
  const stageLLM = !refuseCycle && phase >= 0.5 && phase < 0.85;
  const stageOut = !refuseCycle && phase >= 0.75;
  const stageRefuse = refuseCycle && phase >= 0.5;
  return (
    <>
      <div className={`sc-edge ${stagePrompt ? 'active' : ''}`} style={{ left: '12%', width: '20%', '--nc': 'var(--indigo)' } as React.CSSProperties} />
      <div className={`sc-edge ${stageGate && !refuseCycle ? 'active' : ''}`} style={{ left: '40%', width: '20%', '--nc': 'var(--indigo)' } as React.CSSProperties} />
      <div className={`sc-edge ${stageLLM ? 'active' : ''}`} style={{ left: '60%', width: '24%', '--nc': 'var(--indigo)' } as React.CSSProperties} />
      <div className={`sc-node ${stagePrompt ? 'active' : ''}`} style={{ left: '12%', '--nc': 'var(--ink-2)' } as React.CSSProperties}>PROMPT<span className="sub">user input</span></div>
      <div className={`sc-node ${stageGate ? 'active' : ''}`} style={{ left: '40%', '--nc': refuseCycle ? 'var(--deny)' : 'var(--indigo)' } as React.CSSProperties}>GATE<span className="sub">{stageGate ? (refuseCycle ? 'reversibility ↓' : 'evaluating · 5 signals') : 'idle'}</span></div>
      <div className={`sc-node ${stageLLM ? 'active' : ''}`} style={{ left: '64%', opacity: refuseCycle ? 0.42 : 1, '--nc': 'var(--indigo)' } as React.CSSProperties}>LLM<span className="sub">scoped exec</span></div>
      <div className={`sc-node ${stageOut || stageRefuse ? 'active' : ''}`} style={{ left: '86%', '--nc': stageRefuse ? 'var(--deny)' : 'var(--indigo)' } as React.CSSProperties}>{stageRefuse ? 'REFUSE' : 'ACT'}<span className="sub">{stageRefuse ? 'logged · escalated' : 'gated'}</span></div>
    </>
  );
}

function SidecarCompare() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % 240), 50);
    return () => clearInterval(id);
  }, []);
  const p = tick / 240;

  return (
    <div className="sc">
      <style>{`
        .sc { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 1000px) { .sc { grid-template-columns: 1fr; } }
        .sc-panel {
          position: relative;
          background: var(--surface); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--hairline); border-radius: var(--r-lg); box-shadow: var(--shadow-card);
          padding: 26px; overflow: hidden;
        }
        .sc-panel.bad  { border-color: rgba(225,29,72,0.25);  box-shadow: var(--shadow-card), inset 0 0 30px rgba(225,29,72,0.04); }
        .sc-panel.good { border-color: rgba(67,56,202,0.25);  box-shadow: var(--shadow-card), inset 0 0 30px rgba(67,56,202,0.05); }
        .sc-panel .head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 22px; }
        .sc-panel .head .ttl { font-family: var(--f-sans); font-size: 18px; font-weight: 600; letter-spacing: -0.02em; color: var(--ink-0); }
        .sc-panel .head .ttl em { font-family: var(--f-serif); font-style: italic; font-weight: 400; color: var(--c); }
        .sc-panel .head .badge {
          font-family: var(--f-mono); font-size: 10px; font-weight: 500; letter-spacing: 0.16em;
          padding: 4px 10px; color: var(--c);
          background: color-mix(in oklab, var(--c) 10%, transparent);
          border: 1px solid color-mix(in oklab, var(--c) 35%, transparent);
          border-radius: var(--r-xs);
        }
        .sc-flow {
          position: relative; height: 200px;
          background: radial-gradient(ellipse at 50% 50%, rgba(67,56,202,0.03), transparent 70%);
          border-radius: var(--r-md); border: 1px solid var(--hairline); overflow: hidden;
        }
        .sc-node {
          position: absolute; top: 50%; transform: translate(-50%, -50%);
          padding: 10px 14px; border-radius: var(--r-sm);
          background: #FFFFFF;
          border: 1px solid color-mix(in oklab, var(--nc, var(--ink-3)) 30%, var(--hairline-strong));
          font-family: var(--f-mono); font-size: 11px; font-weight: 500;
          color: var(--ink-0); white-space: nowrap;
          box-shadow: 0 2px 8px rgba(15,13,27,0.06); z-index: 2;
          transition: all 0.2s var(--ease-out);
        }
        .sc-node .sub { font-size: 9px; color: var(--ink-3); letter-spacing: 0.1em; display: block; margin-top: 2px; font-weight: 400; }
        .sc-node.active { box-shadow: 0 0 0 1px var(--nc), 0 0 20px color-mix(in oklab, var(--nc) 35%, transparent); border-color: var(--nc); }
        .sc-edge { position: absolute; height: 1px; background: var(--hairline-strong); top: 50%; transform-origin: left center; z-index: 1; }
        .sc-edge.active { background: linear-gradient(90deg, transparent, var(--nc), transparent); background-size: 40% 100%; animation: edge-flow 1.5s linear infinite; height: 1.5px; }
        @keyframes edge-flow { 0% { background-position: -40% 0; } 100% { background-position: 140% 0; } }
        .sc-stream { margin-top: 18px; font-family: var(--f-mono); font-size: 11px; color: var(--ink-3); }
        .sc-stream .lbl { font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 6px; }
        .sc-stream code {
          display: block; background: var(--ink-dark-0); color: var(--on-dark);
          padding: 10px 12px; border-radius: var(--r-sm);
          font-family: var(--f-mono); font-size: 11.5px; min-height: 50px;
          border: 1px solid var(--ink-dark-2);
        }
        .sc-stream code .caret { display: inline-block; width: 7px; height: 11px; background: currentColor; vertical-align: middle; margin-left: 2px; animation: blink 0.9s steps(2) infinite; }
        @keyframes blink { 50% { opacity: 0; } }
        .sc-list { margin-top: 14px; display: flex; flex-direction: column; gap: 6px; font-family: var(--f-mono); font-size: 11px; }
        .sc-list .row { display: grid; grid-template-columns: 110px 1fr auto; gap: 12px; padding: 6px 0; border-bottom: 1px solid var(--hairline); color: var(--ink-1); }
        .sc-list .row:last-child { border-bottom: 0; }
        .sc-list .row .k { color: var(--ink-3); letter-spacing: 0.06em; }
        .sc-list .row .v { color: var(--ink-0); text-align: right; font-weight: 500; }
        .sc-list .row .v.bad  { color: var(--deny); }
        .sc-list .row .v.good { color: var(--indigo); }
      `}</style>

      <article className="sc-panel bad" style={{ '--c': 'var(--deny)' } as React.CSSProperties}>
        <div className="head">
          <span className="ttl">Without <em>governance</em></span>
          <span className="badge">UNGATED</span>
        </div>
        <div className="sc-flow"><SidecarFlow variant="without" p={p} /></div>
        <Stream variant="without" p={p} />
        <div className="sc-list">
          <div className="row"><span className="k">// gate</span><span className="v bad">— absent</span></div>
          <div className="row"><span className="k">// hallucination</span><span className="v bad">silent · downstream</span></div>
          <div className="row"><span className="k">// tool calls</span><span className="v bad">all unconditional</span></div>
          <div className="row"><span className="k">// audit trail</span><span className="v bad">partial · post-hoc</span></div>
        </div>
      </article>

      <article className="sc-panel good" style={{ '--c': 'var(--indigo)' } as React.CSSProperties}>
        <div className="head">
          <span className="ttl">With <em>Kairos governance</em></span>
          <span className="badge">SIDECAR · ACTIVE</span>
        </div>
        <div className="sc-flow"><SidecarFlow variant="with" p={p} /></div>
        <Stream variant="with" p={p} />
        <div className="sc-list">
          <div className="row"><span className="k">// gate</span><span className="v good">live · 5-signal</span></div>
          <div className="row"><span className="k">// refusals</span><span className="v good">loud · telemetered</span></div>
          <div className="row"><span className="k">// tool calls</span><span className="v good">scoped by verdict</span></div>
          <div className="row"><span className="k">// audit trail</span><span className="v good">per-token · indexed</span></div>
        </div>
      </article>
    </div>
  );
}

/* ── INSTALL TERMINAL ───────────────────────────────────────────────────── */

function InstallTerminal() {
  const [copied, setCopied] = useState(false);
  const cmd = 'curl -fsSL https://raw.githubusercontent.com/kairos-dev-kairos-ecl/Argus/main/install.sh | bash';
  const copy = () => {
    navigator.clipboard?.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="term" aria-label="Install Argus XDR">
      <div className="term-head">
        <div className="dots">
          <i style={{ background: '#FF5F57' }} />
          <i style={{ background: '#FEBC2E' }} />
          <i style={{ background: '#28C840' }} />
        </div>
        <span className="file">install.sh</span>
        <button className={`copy ${copied ? 'copied' : ''}`} onClick={copy}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          {copied ? 'COPIED' : 'COPY'}
        </button>
      </div>
      <div className="term-body">
        <div className="com"># macOS / Linux · root not required for user install</div>
        <div>
          <span className="prompt">$</span>{' '}
          <span className="fn">curl</span>{' '}
          <span className="kw">-fsSL</span>{' '}
          <span className="str">https://raw.githubusercontent.com/<br />&nbsp;&nbsp;kairos-dev-kairos-ecl/Argus/main/install.sh</span>{' '}
          <span className="kw">|</span>{' '}
          <span className="fn">bash</span>
        </div>
        <div style={{ marginTop: 10 }} className="com"># or pin to a specific release</div>
        <div>
          <span className="prompt">$</span>{' '}
          <span className="fn">argus</span> install <span className="kw">--version</span> <span className="str">v0.4.2-beta</span>
        </div>
      </div>
    </div>
  );
}

/* ── ARGUS XDR SECTION ──────────────────────────────────────────────────── */

const ArgusXdrSection: React.FC = () => (
  <section id="argus-xdr" className="argus-sec">
    <style>{`
      .argus-sec {
        padding: 90px 0 100px; position: relative;
        border-top: 1px solid var(--hairline);
      }
      .argus-sec .section-head {
        display: grid; grid-template-columns: 1.2fr 1fr;
        gap: 60px; align-items: end; margin-bottom: 48px;
      }
      @media (max-width: 1100px) { .argus-sec .section-head { grid-template-columns: 1fr; gap: 24px; } }
      .argus-sec .argus-brand-tag {
        display: inline-flex; align-items: center; gap: 12px;
        padding: 6px 14px 6px 8px;
        background: var(--surface-strong); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
        border: 1px solid var(--hairline-strong); border-radius: 999px;
        font-family: var(--f-mono); font-size: 11px; font-weight: 500;
        letter-spacing: 0.16em; color: var(--indigo); text-transform: uppercase;
        margin-bottom: 24px;
      }
      .argus-sec .argus-brand-tag img {
        height: 28px; width: 28px; object-fit: contain; border-radius: 50%; flex-shrink: 0;
      }
      .argus-sec .argus-brand-tag .dot {
        width: 7px; height: 7px; border-radius: 50%;
        background: var(--indigo-bright); box-shadow: 0 0 0 3px rgba(67,56,202,0.20);
      }
      .argus-sec h2 {
        font-size: clamp(40px, 6vw, 84px); font-weight: 600;
        letter-spacing: -0.04em; line-height: 0.95; margin: 16px 0 0; color: var(--ink-0);
      }
      .argus-sec h2 .em {
        font-family: var(--f-serif); font-style: italic; font-weight: 400;
        background: linear-gradient(120deg, var(--indigo-bright), var(--amber));
        -webkit-background-clip: text; background-clip: text; color: transparent;
      }
      .argus-sec .tagline {
        font-family: var(--f-serif); font-style: italic;
        font-size: 24px; color: var(--ink-1); margin: 0 0 12px; line-height: 1.3;
      }
      .argus-sec .lede { color: var(--ink-2); font-size: 15.5px; line-height: 1.55; margin: 0; text-wrap: pretty; }
      .argus-sec .lede em { font-family: var(--f-serif); font-style: italic; color: var(--ink-0); font-weight: 400; }
      .argus-sec .install-row {
        margin-top: 24px; display: grid;
        grid-template-columns: 1.4fr 1fr; gap: 24px; align-items: stretch;
      }
      @media (max-width: 1000px) { .argus-sec .install-row { grid-template-columns: 1fr; } }
      .argus-sec .install-side {
        padding: 24px 26px; background: var(--surface); backdrop-filter: blur(12px);
        border: 1px solid var(--hairline); border-radius: var(--r-lg);
        box-shadow: var(--shadow-card); display: flex; flex-direction: column; gap: 14px;
      }
      .argus-sec .install-side h4 {
        font-family: var(--f-sans); font-size: 22px; font-weight: 600;
        letter-spacing: -0.02em; margin: 0; color: var(--ink-0); line-height: 1.1;
      }
      .argus-sec .install-side p {
        font-family: var(--f-sans); font-size: 14px; color: var(--ink-2); line-height: 1.55; margin: 0;
      }
      .argus-sec .install-side .cta-row {
        display: flex; gap: 10px; flex-wrap: wrap;
        margin-top: auto; padding-top: 14px; border-top: 1px solid var(--hairline);
      }
    `}</style>

    <div className="wrap">
      <div className="section-meta">
        <span className="num">02 / 03</span>
        <div className="meta-kv">
          <div><span className="k">Pillar</span><span className="v">Argus XDR</span></div>
          <div><span className="k">Type</span><span className="v">Observability tool</span></div>
          <div><span className="k">Lang</span><span className="v">Rust · Python · Go</span></div>
          <div><span className="k">Licence</span><span className="v">Apache 2.0</span></div>
        </div>
      </div>

      <div className="section-head">
        <div>
          <span className="argus-brand-tag">
            <img src="/argus-logo.png" alt="Argus" />
            <span className="dot" />
            ARGUS XDR · LLM OBSERVABILITY
          </span>
          <h2>
            Every signal.<br />
            Every layer.<br />
            <span className="em">Fully correlated.</span>
          </h2>
        </div>
        <div>
          <p className="tagline">Extended detection &amp; response, restated for the era of agentic systems.</p>
          <p className="lede">
            Argus instruments the full vertical stack — from GPU thermal events up to the
            orchestrator's plan — and correlates them against the Kairos epistemic gate.
            Detection runs in <em>four tiers</em>; verdicts ride the same bus as the signals.
          </p>
        </div>
      </div>

      <div className="label-row" style={{ marginTop: 24 }}>10-LAYER SIGNAL TAXONOMY</div>
      <LayerStack />

      <div className="label-row">PERFORMANCE</div>
      <PerfCards />

      <div className="label-row">THE KAIROS SIDECAR · LLM CALL, INSTRUMENTED</div>
      <SidecarCompare />

      <div className="label-row">INSTALL</div>
      <div className="install-row">
        <InstallTerminal />
        <div className="install-side">
          <h4>Single-line install.<br />Zero runtime deps.</h4>
          <p>Argus ships as a single binary. Pull it down, point it at your LLM service, watch verdicts land in the bus you already have.</p>
          <div className="cta-row">
            <a className="btn btn-primary" href="https://github.com/kairos-dev-kairos-ecl/Argus" target="_blank" rel="noreferrer">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.08 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.31-.54-1.53.12-3.19 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.19.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.83.58C20.56 21.79 24 17.3 24 12 24 5.37 18.63 0 12 0z" />
              </svg>
              GitHub
            </a>
            <a className="btn btn-ghost" href="/docs">Read /docs →</a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ArgusXdrSection;
