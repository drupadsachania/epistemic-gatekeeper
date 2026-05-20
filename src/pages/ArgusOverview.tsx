/**
 * ArgusOverview.tsx — Argus XDR technical documentation.
 * Prism light design. Source: github.com/kairos-dev-kairos-ecl/Argus/docs
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EclipseFooter from '../components/EclipseFooter';
import '../styles/argus-overview.css';

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
