/**
 * ArgusOverview.tsx — Argus XDR technical documentation.
 * Prism light design. Source: github.com/kairos-dev-kairos-ecl/Argus/docs
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EclipseFooter from '../components/EclipseFooter';

/* ── DATA ────────────────────────────────────────────────────────────────── */

const MODULES = [
  { file: 'llm_adapter.py',             role: 'Hypothesis generation + output validation',    trust: 'UNTRUSTED' },
  { file: 'meta_reasoning.py',          role: 'Hypothesis quality reflection layer',          trust: 'ADVISORY'  },
  { file: 'uncertainty_engine.py',      role: '4D epistemic scoring (4 signal vectors)',      trust: 'TRUSTED'   },
  { file: 'epistemic_failure_engine.py',role: 'Failure detection + policy override',          trust: 'TRUSTED'   },
  { file: 'decision_policy_engine.py',  role: 'Policy evaluation — no LLM input permitted',  trust: 'TRUSTED'   },
  { file: 'state_machine.py',           role: 'Process integrity + per-token audit trail',    trust: 'TRUSTED'   },
  { file: 'spine.py',                   role: 'OODA orchestration and bus routing',           trust: 'TRUSTED'   },
  { file: 'schemas.py',                 role: 'Shared OCSF-compatible data structures',       trust: '—'         },
];

const FAILURE_MODES = [
  { id: 'FM-01', name: 'FALSE_AGREEMENT',        desc: 'Model concurs with contradicted evidence' },
  { id: 'FM-02', name: 'DEGENERATE_OUTPUT',       desc: 'Response entropy collapses — repetition, hallucinated structure' },
  { id: 'FM-03', name: 'GROUNDLESS_CONFIDENCE',   desc: 'High confidence score, zero retrieval support' },
  { id: 'FM-04', name: 'TEMPORAL_DRIFT',          desc: 'Claim references stale or future-dated information' },
  { id: 'FM-05', name: 'IRREVERSIBLE_SIDE_EFFECT',desc: 'Tool call cannot be undone; reversibility ≤ threshold' },
  { id: 'FM-06', name: 'CONTRADICTION_CASCADE',   desc: 'Contradictions across multi-step plan nodes' },
  { id: 'FM-07', name: 'ORCHESTRATOR_HIJACK',     desc: 'Sub-agent handoff bypasses policy gate' },
  { id: 'FM-08', name: 'CONTEXT_OVERFLOW_DRIFT',  desc: 'Long-context causes belief drift without grounding update' },
];

const TIERS = [
  { n: 'T1', name: 'Deterministic',  color: 'var(--indigo)',        desc: 'Rule-based · signatures · regex · constant-time evaluation' },
  { n: 'T2', name: 'Statistical',    color: 'var(--indigo-bright)', desc: 'Distributional drift · z-scores · IQR outlier detection' },
  { n: 'T3', name: 'Temporal',       color: 'var(--magenta)',       desc: 'Sequence anomalies · rate-of-change · belief decay' },
  { n: 'T4', name: 'Semantic',       color: 'var(--amber)',         desc: 'Embedding similarity · cross-source coherence scoring' },
];

const LAYERS = [
  { n: 1,  name: 'Hardware',        pillar: 'Infrastructure', desc: 'GPU temp, memory pressure, driver state' },
  { n: 2,  name: 'Runtime',         pillar: 'Infrastructure', desc: 'Container, scheduler, OS-level events' },
  { n: 3,  name: 'Model Loading',   pillar: 'Infrastructure', desc: 'Weights, quantization, checksum drift' },
  { n: 4,  name: 'Inference',       pillar: 'Model',          desc: 'Logits, attention, sampling temperature' },
  { n: 5,  name: 'Output Decoding', pillar: 'Model',          desc: 'Token confidence, entropy spikes' },
  { n: 6,  name: 'Integration',     pillar: 'Integration',    desc: 'API auth, sidecar contracts, transport' },
  { n: 7,  name: 'Tool Use',        pillar: 'Integration',    desc: 'Function calls, side-effects, retries' },
  { n: 8,  name: 'Data Access',     pillar: 'Integration',    desc: 'Retrieval queries, source provenance' },
  { n: 9,  name: 'Orchestration',   pillar: 'Application',    desc: 'Multi-step plans, sub-agent handoffs' },
  { n: 10, name: 'Application',     pillar: 'Application',    desc: 'User-facing surface, session context' },
];

/* ── PAGE ────────────────────────────────────────────────────────────────── */

const ArgusOverview: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  return (
    <>
      <div className="argus-doc">
        <style>{`
          .argus-doc { min-height: 100vh; }

          /* breadcrumb */
          .argus-doc .bc {
            padding: 20px 0 0;
            font-family: var(--f-mono); font-size: 11px; letter-spacing: 0.1em;
            color: var(--ink-3); display: flex; align-items: center; gap: 8px;
          }
          .argus-doc .bc a { color: inherit; text-decoration: none; transition: color 0.15s; }
          .argus-doc .bc a:hover { color: var(--indigo); }

          /* hero */
          .argus-doc-hero { padding: 56px 0 48px; border-bottom: 1px solid var(--hairline); }
          .argus-doc-hero .eyebrow {
            display: inline-flex; align-items: center; gap: 10px;
            padding: 5px 14px 5px 8px;
            background: var(--surface-strong); backdrop-filter: blur(8px);
            border: 1px solid var(--hairline-strong); border-radius: 999px;
            font-family: var(--f-mono); font-size: 11px; font-weight: 500;
            letter-spacing: 0.16em; color: var(--indigo); text-transform: uppercase;
            margin-bottom: 24px;
          }
          .argus-doc-hero .eyebrow img {
            height: 22px; width: 22px; object-fit: contain; border-radius: 50%;
          }
          .argus-doc-hero .eyebrow .dot {
            width: 6px; height: 6px; border-radius: 50%;
            background: var(--indigo-bright); box-shadow: 0 0 0 3px rgba(77,47,178,0.20);
          }
          .argus-doc-hero h1 {
            font-family: var(--f-sans); font-size: clamp(36px, 5vw, 64px);
            font-weight: 600; letter-spacing: -0.04em; line-height: 1.0;
            color: var(--ink-0); margin: 0 0 20px;
          }
          .argus-doc-hero h1 em {
            font-family: var(--f-serif); font-style: italic; font-weight: 400;
            background: linear-gradient(120deg, var(--indigo-bright) 0%, var(--magenta) 100%);
            -webkit-background-clip: text; background-clip: text; color: transparent;
          }
          .argus-doc-hero .sub {
            font-size: 16px; color: var(--ink-2); line-height: 1.6; max-width: 600px; margin: 0;
          }
          .argus-doc-hero .meta-row {
            margin-top: 28px; display: flex; gap: 32px; flex-wrap: wrap;
            font-family: var(--f-mono); font-size: 11px;
          }
          .argus-doc-hero .meta-row .kv .k { color: var(--ink-3); letter-spacing: 0.1em; }
          .argus-doc-hero .meta-row .kv .v { color: var(--ink-0); font-weight: 500; margin-top: 3px; }

          /* doc sections */
          .argus-doc .sec { padding: 56px 0; border-bottom: 1px solid var(--hairline); }
          .argus-doc .sec:last-child { border-bottom: 0; }
          .argus-doc .sec-label {
            font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.20em;
            text-transform: uppercase; color: var(--indigo); margin-bottom: 12px;
          }
          .argus-doc .sec-title {
            font-family: var(--f-sans); font-size: clamp(24px, 3vw, 36px);
            font-weight: 600; letter-spacing: -0.03em; color: var(--ink-0);
            margin: 0 0 16px; line-height: 1.1;
          }
          .argus-doc .sec-body {
            font-family: var(--f-sans); font-size: 15px; color: var(--ink-2);
            line-height: 1.65; max-width: 680px; margin: 0 0 32px;
          }

          /* architecture diagram */
          .arch-diagram {
            background: var(--surface); backdrop-filter: blur(12px);
            border: 1px solid var(--hairline); border-radius: var(--r-lg);
            box-shadow: var(--shadow-card); padding: 32px 40px; overflow-x: auto;
          }
          .arch-diagram pre {
            font-family: var(--f-mono); font-size: 13px; line-height: 1.8;
            color: var(--ink-1); white-space: pre; margin: 0;
          }
          .arch-diagram pre .phase { color: var(--indigo); font-weight: 600; }
          .arch-diagram pre .fn    { color: var(--indigo-bright); }
          .arch-diagram pre .com   { color: var(--ink-4); font-style: italic; }
          .arch-diagram pre .state-act    { color: var(--state-act); font-weight: 600; }
          .arch-diagram pre .state-hold   { color: var(--state-hold); font-weight: 600; }
          .arch-diagram pre .state-defer  { color: var(--state-defer); font-weight: 600; }
          .arch-diagram pre .state-refuse { color: var(--state-refuse); font-weight: 600; }
          @media (max-width: 640px) {
            .arch-diagram { padding: 20px; }
            .arch-diagram pre { font-size: 11px; }
          }

          /* module table */
          .module-table {
            width: 100%; border-collapse: collapse; border-spacing: 0;
            background: var(--surface); backdrop-filter: blur(12px);
            border: 1px solid var(--hairline); border-radius: var(--r-lg);
            box-shadow: var(--shadow-card); overflow: hidden;
          }
          .module-table th {
            font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.16em;
            text-transform: uppercase; color: var(--ink-3); text-align: left;
            padding: 12px 20px; background: rgba(15,13,27,0.02);
            border-bottom: 1px solid var(--hairline);
          }
          .module-table td {
            font-family: var(--f-mono); font-size: 12.5px; color: var(--ink-1);
            padding: 14px 20px; border-bottom: 1px solid var(--hairline);
            vertical-align: top;
          }
          .module-table tr:last-child td { border-bottom: 0; }
          .module-table tr { transition: background 0.12s; cursor: default; }
          .module-table tr:hover td { background: rgba(67,56,202,0.025); }
          .module-table td.file { color: var(--ink-0); font-weight: 500; }
          .module-table td.role { color: var(--ink-2); font-size: 12px; }
          .trust-pill {
            display: inline-block; font-size: 9px; letter-spacing: 0.14em;
            font-weight: 600; padding: 2px 8px; border-radius: 3px;
          }
          .trust-untrusted { color: var(--state-refuse); background: rgba(225,29,72,0.08); border: 1px solid rgba(225,29,72,0.22); }
          .trust-trusted   { color: var(--state-act);    background: rgba(14,33,160,0.08);  border: 1px solid rgba(14,33,160,0.22); }
          .trust-advisory  { color: var(--ink-2);        background: rgba(15,13,27,0.04);   border: 1px solid var(--hairline-strong); }
          @media (max-width: 640px) {
            .module-table th:nth-child(2), .module-table td:nth-child(2) { display: none; }
            .module-table td, .module-table th { padding: 12px 14px; }
          }

          /* failure modes */
          .failure-grid {
            display: grid; grid-template-columns: 1fr 1fr;
            gap: 12px;
          }
          @media (max-width: 700px) { .failure-grid { grid-template-columns: 1fr; } }
          .failure-card {
            background: var(--surface); backdrop-filter: blur(12px);
            border: 1px solid var(--hairline); border-radius: var(--r-md);
            box-shadow: var(--shadow-card); padding: 18px 20px;
            display: flex; flex-direction: column; gap: 6px;
          }
          .failure-card .fid {
            font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.16em;
            color: var(--state-refuse); text-transform: uppercase; font-weight: 600;
          }
          .failure-card .fname {
            font-family: var(--f-mono); font-size: 12px; font-weight: 600;
            color: var(--ink-0); letter-spacing: 0.03em;
          }
          .failure-card .fdesc {
            font-family: var(--f-sans); font-size: 12.5px; color: var(--ink-2); line-height: 1.5;
          }

          /* detection tiers */
          .tier-list { display: flex; flex-direction: column; gap: 10px; }
          .tier-row {
            display: grid; grid-template-columns: 40px 130px 1fr;
            gap: 16px; align-items: center;
            background: var(--surface); backdrop-filter: blur(12px);
            border: 1px solid var(--hairline); border-radius: var(--r-md);
            padding: 16px 20px; box-shadow: var(--shadow-card);
          }
          @media (max-width: 560px) { .tier-row { grid-template-columns: 36px 1fr; } .tier-row .tdesc { display: none; } }
          .tier-row .tn {
            font-family: var(--f-mono); font-size: 11px; font-weight: 600;
            letter-spacing: 0.1em; color: var(--c);
          }
          .tier-row .tname {
            font-family: var(--f-sans); font-size: 14px; font-weight: 600;
            color: var(--ink-0); letter-spacing: -0.01em;
          }
          .tier-row .tdesc {
            font-family: var(--f-mono); font-size: 11px; color: var(--ink-3);
          }

          /* layers mini table */
          .layers-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .layers-table {
            width: 100%; border-collapse: collapse;
            background: var(--surface); backdrop-filter: blur(12px);
            border: 1px solid var(--hairline); border-radius: var(--r-lg);
            box-shadow: var(--shadow-card); overflow: hidden; min-width: 480px;
          }
          .layers-table th {
            font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.16em;
            text-transform: uppercase; color: var(--ink-3); text-align: left;
            padding: 10px 16px; background: rgba(15,13,27,0.02);
            border-bottom: 1px solid var(--hairline);
          }
          .layers-table td {
            font-family: var(--f-mono); font-size: 12px; color: var(--ink-1);
            padding: 12px 16px; border-bottom: 1px solid var(--hairline);
          }
          .layers-table tr:last-child td { border-bottom: 0; }
          .layers-table td.lnum { color: var(--indigo); font-weight: 600; width: 56px; }
          .layers-table td.lname { color: var(--ink-0); font-weight: 500; }
          .layers-table td.ldesc { color: var(--ink-3); font-size: 11px; }

          /* install block */
          .install-wrap {
            display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px; align-items: start;
          }
          @media (max-width: 900px) { .install-wrap { grid-template-columns: 1fr; } }
          .install-card {
            background: var(--surface); backdrop-filter: blur(12px);
            border: 1px solid var(--hairline); border-radius: var(--r-lg);
            padding: 24px 28px; box-shadow: var(--shadow-card);
          }
          .install-card h4 {
            font-family: var(--f-sans); font-size: 18px; font-weight: 600;
            letter-spacing: -0.02em; color: var(--ink-0); margin: 0 0 14px;
          }
          .install-card p {
            font-family: var(--f-sans); font-size: 14px; color: var(--ink-2);
            line-height: 1.55; margin: 0 0 16px;
          }
          .install-card .links { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--hairline); }
          .install-card .links a {
            font-family: var(--f-mono); font-size: 12px; color: var(--indigo);
            text-decoration: none; letter-spacing: 0.04em; display: flex; align-items: center; gap: 6px;
            transition: gap 0.15s, opacity 0.15s;
          }
          .install-card .links a:hover { gap: 10px; opacity: 0.75; }
        `}</style>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <div className="argus-doc-hero">
          <div className="wrap">
            <div className="bc">
              <Link to="/docs">docs</Link>
              <span>·</span>
              <span style={{ color: 'var(--ink-1)' }}>argus-xdr</span>
              <span>·</span>
              <span>architecture-overview</span>
            </div>

            <div style={{ marginTop: 28 }}>
              <div className="eyebrow">
                <img src="/argus-logo.png" alt="Argus" width={22} height={22} style={{ height: 22, width: 22, objectFit: 'contain', borderRadius: '50%' }} />
                <span className="dot" />
                ARGUS XDR · TECHNICAL DOCUMENTATION
              </div>
              <h1>Architecture<br /><em>Overview</em></h1>
              <p className="sub">
                Reference architecture for epistemic governance. Self-hosted, auditable, and
                designed for teams who need to understand — not just observe — autonomous decisions.
              </p>
              <div className="meta-row">
                {[
                  { k: '// version',  v: 'v0.4.2-beta' },
                  { k: '// language', v: 'Python · Rust · Go' },
                  { k: '// licence',  v: 'Apache 2.0' },
                  { k: '// source',   v: 'kairos-dev-kairos-ecl/Argus' },
                ].map((m) => (
                  <div className="kv" key={m.k}>
                    <div className="k">{m.k}</div>
                    <div className="v">{m.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="wrap">

          {/* ── OODA ARCHITECTURE ──────────────────────────────────────────── */}
          <div className="sec">
            <div className="sec-label">// 01 · architecture</div>
            <h2 className="sec-title">OODA Processing Loop</h2>
            <p className="sec-body">
              Every decision passes through four sequenced phases. The LLM is confined to
              hypothesis generation in the ORIENT phase; it cannot influence policy evaluation.
              All policy and epistemic scoring runs in trusted, LLM-isolated modules.
            </p>
            <div className="arch-diagram">
              <pre>
<span className="com">  # Alert / user input arrives at the bus</span>{'\n'}
{'       Alert In\n'}
{'           │\n'}
{'           ▼\n'}
<span className="phase">  [OBSERVE]  </span><span className="fn">resolve_context()</span>{'\n'}
{'             └─ gather evidence from SIEM · EDR · IAM · retrieval\n'}
{'           │\n'}
{'           ▼\n'}
<span className="phase">  [ORIENT]   </span><span className="fn">generate_hypotheses()</span>{' '}<span className="com"># LLM — UNTRUSTED, output sanitized</span>{'\n'}
{'             └─ '}<span className="fn">run_meta_reasoning()</span>{' '}<span className="com"># quality reflection — ADVISORY only</span>{'\n'}
{'           │\n'}
{'           ▼\n'}
<span className="phase">  [DECIDE]   </span><span className="fn">test_evidence()</span>{' '}<span className="com"># correlate hypotheses ↔ evidence</span>{'\n'}
{'             ├─ '}<span className="fn">compute_uncertainty()</span>{'  '}<span className="com"># 5-signal epistemic vector</span>{'\n'}
{'             ├─ '}<span className="fn">detect_failures()</span>{'     '}<span className="com"># 8 named failure modes</span>{'\n'}
{'             └─ '}<span className="fn">evaluate_policy()</span>{'     '}<span className="com"># ordered rules — first match wins</span>{'\n'}
{'           │\n'}
{'           ▼\n'}
<span className="phase">  [ACT]      </span><span className="fn">finalize()</span>{' → '}<span className="state-act">ACT</span>{' · '}<span className="state-hold">HOLD</span>{' · '}<span className="state-defer">DEFER</span>{' · '}<span className="state-refuse">REFUSE</span>
              </pre>
            </div>
          </div>

          {/* ── MODULE TRUST TABLE ─────────────────────────────────────────── */}
          <div className="sec">
            <div className="sec-label">// 02 · trust model</div>
            <h2 className="sec-title">Module Roles & Trust Levels</h2>
            <p className="sec-body">
              The core invariant: only TRUSTED modules influence the policy decision. The LLM
              adapter is intentionally kept UNTRUSTED — its outputs are hypotheses, never verdicts.
            </p>
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table className="module-table">
                <thead>
                  <tr>
                    <th>Module</th>
                    <th>Role</th>
                    <th>Trust</th>
                  </tr>
                </thead>
                <tbody>
                  {MODULES.map((m) => (
                    <tr key={m.file}
                        onMouseEnter={() => setActiveModule(m.file)}
                        onMouseLeave={() => setActiveModule(null)}
                        style={{ background: activeModule === m.file ? 'rgba(14,33,160,0.025)' : undefined }}>
                      <td className="file">{m.file}</td>
                      <td className="role">{m.role}</td>
                      <td>
                        <span className={`trust-pill trust-${m.trust.toLowerCase()}`}>
                          {m.trust}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── FAILURE MODES ──────────────────────────────────────────────── */}
          <div className="sec">
            <div className="sec-label">// 03 · failure modes</div>
            <h2 className="sec-title">8 Named Failure Modes</h2>
            <p className="sec-body">
              The epistemic failure engine detects these conditions before policy evaluation.
              Any detected failure can trigger a policy override — regardless of confidence score.
            </p>
            <div className="failure-grid">
              {FAILURE_MODES.map((f) => (
                <div className="failure-card" key={f.id}>
                  <span className="fid">{f.id}</span>
                  <span className="fname">{f.name}</span>
                  <span className="fdesc">{f.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── 4-TIER DETECTION ───────────────────────────────────────────── */}
          <div className="sec">
            <div className="sec-label">// 04 · detection engine</div>
            <h2 className="sec-title">4-Tier Detection Pipeline</h2>
            <p className="sec-body">
              Signals pass through four detection tiers in sequence. Each tier feeds results
              upward; higher tiers can downgrade verdicts from lower tiers.
            </p>
            <div className="tier-list">
              {TIERS.map((t) => (
                <div className="tier-row" key={t.n}
                     style={{ '--c': t.color, borderLeft: `3px solid ${t.color}` } as React.CSSProperties}>
                  <span className="tn">{t.n}</span>
                  <span className="tname">{t.name}</span>
                  <span className="tdesc">{t.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── 10-LAYER TAXONOMY ──────────────────────────────────────────── */}
          <div className="sec">
            <div className="sec-label">// 05 · signal taxonomy</div>
            <h2 className="sec-title">10-Layer Signal Taxonomy</h2>
            <p className="sec-body">
              Argus instruments the full vertical stack — from hardware thermal events up to
              the orchestrator's plan. Each layer emits typed signals into the spine.
            </p>
            <div className="layers-scroll">
              <table className="layers-table">
                <thead>
                  <tr>
                    <th>Layer</th>
                    <th>Name</th>
                    <th>Pillar</th>
                    <th>Signals</th>
                  </tr>
                </thead>
                <tbody>
                  {LAYERS.map((l) => (
                    <tr key={l.n}>
                      <td className="lnum">L{String(l.n).padStart(2, '0')}</td>
                      <td className="lname">{l.name}</td>
                      <td style={{ color: 'var(--ink-3)', fontSize: 11 }}>{l.pillar}</td>
                      <td className="ldesc">{l.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── INSTALL ────────────────────────────────────────────────────── */}
          <div className="sec">
            <div className="sec-label">// 06 · quick start</div>
            <h2 className="sec-title">Installation</h2>
            <p className="sec-body">
              Argus ships as a single binary with no runtime dependencies. The quickest path
              is the install script — or clone and build from source.
            </p>
            <div className="install-wrap">
              <div className="term" aria-label="Install Argus XDR">
                <div className="term-head">
                  <div className="dots">
                    <i style={{ background: '#FF5F57' }} />
                    <i style={{ background: '#FEBC2E' }} />
                    <i style={{ background: '#28C840' }} />
                  </div>
                  <span className="file">install.sh</span>
                </div>
                <div className="term-body">
                  <div className="com"># macOS / Linux — root not required for user install</div>
                  <div>
                    <span className="prompt">$</span>{' '}
                    <span className="fn">curl</span>{' '}
                    <span className="kw">-fsSL</span>{' '}
                    <span className="str">https://raw.githubusercontent.com/<br />&nbsp;&nbsp;kairos-dev-kairos-ecl/Argus/main/install.sh</span>{' '}
                    <span className="kw">|</span>{' '}
                    <span className="fn">bash</span>
                  </div>
                  <div style={{ marginTop: 12 }} className="com"># or clone and run directly</div>
                  <div>
                    <span className="prompt">$</span>{' '}
                    <span className="fn">git</span> clone{' '}
                    <span className="str">https://github.com/kairos-dev-kairos-ecl/Argus</span>
                  </div>
                  <div>
                    <span className="prompt">$</span>{' '}
                    <span className="kw">cd</span> Argus{' '}
                    <span className="kw">&&</span>{' '}
                    <span className="fn">pip</span> install{' '}
                    <span className="kw">-r</span> requirements.txt
                  </div>
                  <div>
                    <span className="prompt">$</span>{' '}
                    <span className="fn">python</span>{' '}
                    <span className="kw">-m</span> argus.server
                  </div>
                  <div style={{ marginTop: 12 }} className="com"># or pin to a release</div>
                  <div>
                    <span className="prompt">$</span>{' '}
                    <span className="fn">argus</span> install{' '}
                    <span className="kw">--version</span>{' '}
                    <span className="str">v0.4.2-beta</span>
                  </div>
                </div>
              </div>

              <div className="install-card">
                <h4>Single binary.<br />Zero runtime deps.</h4>
                <p>
                  Argus runs as a sidecar — point it at your LLM service and verdicts
                  land in whatever bus you already have (Kafka, HTTP, stdout).
                </p>
                <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>
                  The full source, deployment guides, and configuration reference live
                  in the GitHub repository.
                </p>
                <div className="links">
                  <a href="https://github.com/kairos-dev-kairos-ecl/Argus" target="_blank" rel="noreferrer">
                    → GitHub repository
                  </a>
                  <a href="https://github.com/kairos-dev-kairos-ecl/Argus/tree/main/docs" target="_blank" rel="noreferrer">
                    → /docs on GitHub
                  </a>
                  <a href="https://github.com/kairos-dev-kairos-ecl/Argus/blob/main/docs/architecture.md" target="_blank" rel="noreferrer">
                    → architecture.md
                  </a>
                  <a href="https://github.com/kairos-dev-kairos-ecl/Argus/blob/main/docs/deployment.md" target="_blank" rel="noreferrer">
                    → deployment.md
                  </a>
                  <a href="https://github.com/kairos-dev-kairos-ecl/Argus/blob/main/docs/configuration.md" target="_blank" rel="noreferrer">
                    → configuration.md
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ── NAV FOOTER ─────────────────────────────────────────────────── */}
          <div style={{ padding: '32px 0 56px', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <Link to="/docs" className="btn btn-ghost" style={{ fontSize: 13 }}>
              ← Back to Docs
            </Link>
            <a
              href="https://github.com/kairos-dev-kairos-ecl/Argus/tree/main/docs"
              target="_blank" rel="noreferrer"
              className="btn btn-primary" style={{ fontSize: 13 }}
            >
              View full docs on GitHub →
            </a>
          </div>

        </div>
      </div>
      <EclipseFooter />
    </>
  );
};

export default ArgusOverview;
