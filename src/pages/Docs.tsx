/**
 * Docs.tsx — Kairos Foundation documentation hub.
 * Three-pillar structure: Kairos · Argus XDR · Argus SDK (coming soon).
 * Prism light design — glass cards, no dark backgrounds except .term blocks.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import EclipseFooter from '../components/EclipseFooter';

/* ── DOC LINK ROW ───────────────────────────────────────────────────────── */

interface DocLink {
  label: string;
  desc: string;
  to: string;
  tag?: string;
  tagColor?: string;
  featured?: boolean;
}

function DocRow({ label, desc, to, tag, tagColor, featured }: DocLink) {
  return (
    <Link
      to={to}
      className={`doc-row${featured ? ' doc-row-featured' : ''}`}
    >
      <div className="doc-row-body">
        <span className="doc-row-label">{label}</span>
        <span className="doc-row-desc">{desc}</span>
      </div>
      <div className="doc-row-right">
        {tag && (
          <span
            className="doc-row-tag"
            style={{ '--tc': tagColor ?? 'var(--indigo)' } as React.CSSProperties}
          >
            {tag}
          </span>
        )}
        <span className="doc-row-arrow">→</span>
      </div>
    </Link>
  );
}

/* ── KAIROS DOCS ────────────────────────────────────────────────────────── */

const KAIROS_LINKS: DocLink[] = [
  {
    label: 'Research & Findings',
    desc: 'Preprint (April 2026) · Hallucination 15–52% → 3% · Deferral 5% → 22% · Evidence surfacing 30% → 85%',
    to: '/research',
    tag: 'WHITEPAPER',
    tagColor: 'var(--amber)',
    featured: true,
  },
  {
    label: 'Decision State Machine',
    desc: 'ACT · HOLD · DEFER · REFUSE — formal state diagram, transition table, runtime invariants',
    to: '/kairos/decision-states',
    tag: 'KAIROS-003',
  },
  {
    label: 'Epistemic Signal Reference',
    desc: 'Five core signals — confidence, grounding, contradiction, temporal, reversibility',
    to: '/kairos/signals',
    tag: 'KAIROS-002',
  },
  {
    label: 'OODA Mapping',
    desc: 'How the Observe → Orient → Decide → Act loop maps onto epistemic gates',
    to: '/kairos/ooda',
    tag: 'KAIROS-004',
  },
  {
    label: 'Problem Analysis',
    desc: 'Eight failure modes — FALSE_AGREEMENT, DEGENERATE_OUTPUT, and six more',
    to: '/kairos/problem',
    tag: 'KAIROS-001',
  },
  {
    label: 'Signal → Framework Map',
    desc: 'Cross-reference every signal, failure mode, and policy outcome in one table',
    to: '/argus-xdr/signal-map',
    tag: 'REFERENCE',
  },
];

/* ── ARGUS XDR DOCS ─────────────────────────────────────────────────────── */

const ARGUS_XDR_LINKS: DocLink[] = [
  {
    label: 'Architecture Overview',
    desc: 'Module breakdown — adapter, uncertainty engine, policy engine, state machine, spine',
    to: '/argus-xdr/overview',
    tag: 'ARCHITECTURE',
  },
];

/* ── PAGE ───────────────────────────────────────────────────────────────── */

const Docs: React.FC = () => (
  <>
    <div className="docs-page">
      <style>{`
        .docs-page {
          min-height: 100vh;
        }

        /* ── hero ── */
        .docs-hero {
          padding: 88px 0 56px;
          border-bottom: 1px solid var(--hairline);
        }
        .docs-hero .eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--f-mono); font-size: 11px; font-weight: 500;
          letter-spacing: 0.18em; color: var(--ink-3); text-transform: uppercase;
          margin-bottom: 24px;
        }
        .docs-hero .eyebrow .dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--indigo); box-shadow: 0 0 0 3px rgba(67,56,202,0.18);
        }
        .docs-hero h1 {
          font-family: var(--f-sans); font-size: clamp(40px, 6vw, 72px);
          font-weight: 600; letter-spacing: -0.03em; line-height: 1.05;
          color: var(--ink-0); margin: 0 0 20px;
        }
        .docs-hero h1 em {
          font-family: var(--f-serif); font-style: italic; font-weight: 400;
          background: linear-gradient(120deg, var(--indigo) 0%, #6366F1 40%, var(--amber) 100%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .docs-hero .sub {
          font-family: var(--f-sans); font-size: 17px; color: var(--ink-2);
          line-height: 1.6; max-width: 540px; margin: 0;
        }

        /* ── pillars grid ── */
        .docs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 24px;
          padding: 56px 0 80px;
          align-items: start;
        }
        @media (max-width: 1100px) { .docs-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 700px)  {
          .docs-grid { grid-template-columns: 1fr; padding: 32px 0 60px; gap: 16px; }
          .docs-hero { padding: 56px 0 36px; }
          .docs-hero h1 { font-size: 36px; }
          .docs-card-head { padding: 20px 20px 16px; }
          .doc-row { padding: 12px 20px; gap: 12px; }
          .doc-row-label { font-size: 13px; }
          .doc-row-desc { font-size: 11px; }
          .doc-row-tag { display: none; }
        }

        /* ── pillar card ── */
        .docs-card {
          background: var(--surface); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--hairline); border-radius: var(--r-lg);
          box-shadow: var(--shadow-card); overflow: hidden;
        }
        .docs-card-head {
          padding: 28px 28px 22px;
          border-bottom: 1px solid var(--hairline);
        }
        .docs-card-brand {
          display: flex; align-items: center; gap: 12px; margin-bottom: 18px;
        }
        .docs-card-brand img {
          height: 36px; width: 36px; object-fit: contain;
          border-radius: 50%; flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(15,13,27,0.08);
        }
        .docs-card-brand .num {
          font-family: var(--f-mono); font-size: 10px; font-weight: 500;
          letter-spacing: 0.18em; color: var(--ink-4); text-transform: uppercase;
        }
        .docs-card-brand .pill {
          margin-left: auto; font-family: var(--f-mono); font-size: 9px; font-weight: 500;
          letter-spacing: 0.14em; text-transform: uppercase;
          padding: 3px 8px; border-radius: 3px;
          background: rgba(67,56,202,0.08); border: 1px solid rgba(67,56,202,0.22);
          color: var(--indigo);
        }
        .docs-card-brand .pill.amber {
          background: rgba(245,158,11,0.10); border-color: rgba(245,158,11,0.28);
          color: var(--amber);
        }
        .docs-card-head h2 {
          font-family: var(--f-sans); font-size: 22px; font-weight: 600;
          letter-spacing: -0.02em; color: var(--ink-0); margin: 0 0 6px;
        }
        .docs-card-head h2 em {
          font-family: var(--f-serif); font-style: italic; font-weight: 400;
          color: var(--ink-2);
        }
        .docs-card-head p {
          font-family: var(--f-sans); font-size: 13px; color: var(--ink-2);
          line-height: 1.55; margin: 0;
        }

        /* ── doc rows ── */
        .docs-card-links {
          padding: 8px 0;
        }
        .doc-row {
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; padding: 14px 28px;
          text-decoration: none; color: inherit;
          border-bottom: 1px solid var(--hairline);
          transition: background 0.12s;
        }
        .doc-row:last-child { border-bottom: 0; }
        .doc-row:hover { background: rgba(67,56,202,0.03); }
        .doc-row:hover .doc-row-arrow { color: var(--indigo); transform: translateX(3px); }
        .doc-row-featured {
          background: linear-gradient(90deg, rgba(243,117,194,0.06), rgba(243,117,194,0.02));
          border-left: 3px solid var(--amber);
          padding-left: 25px;
        }
        .doc-row-featured .doc-row-label { color: var(--ink-0); font-weight: 600; }
        .doc-row-featured .doc-row-arrow { color: var(--amber); }
        .doc-row-featured:hover { background: linear-gradient(90deg, rgba(243,117,194,0.10), rgba(243,117,194,0.04)); }
        .doc-row-featured:hover .doc-row-arrow { color: var(--amber); }
        .doc-row-body { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .doc-row-label {
          font-family: var(--f-sans); font-size: 14px; font-weight: 500;
          color: var(--ink-0); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .doc-row-desc {
          font-family: var(--f-sans); font-size: 12px; color: var(--ink-3); line-height: 1.4;
        }
        .doc-row-right {
          display: flex; align-items: center; gap: 10px; flex-shrink: 0;
        }
        .doc-row-tag {
          font-family: var(--f-mono); font-size: 9px; font-weight: 500;
          letter-spacing: 0.14em; text-transform: uppercase;
          padding: 2px 7px; border-radius: 3px;
          color: var(--tc, var(--indigo));
          background: color-mix(in oklab, var(--tc, var(--indigo)) 10%, transparent);
          border: 1px solid color-mix(in oklab, var(--tc, var(--indigo)) 25%, transparent);
        }
        .doc-row-arrow {
          font-family: var(--f-mono); font-size: 13px; color: var(--ink-4);
          transition: color 0.12s, transform 0.12s; flex-shrink: 0;
        }

        /* ── coming soon card ── */
        .docs-card.coming {
          border-style: dashed; border-color: rgba(245,158,11,0.30);
          background: rgba(245,158,11,0.02);
        }
        .coming-body {
          padding: 40px 28px;
          display: flex; flex-direction: column; align-items: flex-start; gap: 18px;
        }
        .coming-badge {
          font-family: var(--f-mono); font-size: 11px; font-weight: 500;
          letter-spacing: 0.18em; text-transform: uppercase;
          padding: 6px 14px; border-radius: 999px;
          color: var(--amber);
          background: rgba(245,158,11,0.10);
          border: 1px solid rgba(245,158,11,0.30);
          display: inline-flex; align-items: center; gap: 8px;
        }
        .coming-badge .dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--amber); box-shadow: 0 0 0 3px rgba(245,158,11,0.20);
          animation: pulse-soft 2s ease-in-out infinite;
        }
        .coming-body h3 {
          font-family: var(--f-sans); font-size: 20px; font-weight: 600;
          letter-spacing: -0.02em; color: var(--ink-0); margin: 0; line-height: 1.2;
        }
        .coming-body h3 em {
          font-family: var(--f-serif); font-style: italic; font-weight: 400;
          color: var(--amber);
        }
        .coming-body p {
          font-family: var(--f-sans); font-size: 13.5px; color: var(--ink-2);
          line-height: 1.6; margin: 0;
        }
        .coming-list {
          display: flex; flex-direction: column; gap: 8px;
          font-family: var(--f-mono); font-size: 11.5px; color: var(--ink-3);
          list-style: none; padding: 0; margin: 0;
        }
        .coming-list li::before {
          content: '// '; color: var(--amber); margin-right: 2px;
        }
        .coming-eta {
          font-family: var(--f-mono); font-size: 11px; letter-spacing: 0.1em;
          color: var(--ink-4); text-transform: uppercase;
          padding-top: 10px; border-top: 1px solid var(--hairline); width: 100%;
        }
      `}</style>

      <div className="docs-hero">
        <div className="wrap">
          <div className="eyebrow"><span className="dot" />KAIROS FOUNDATION · DOCUMENTATION</div>
          <h1>Every layer<br /><em>documented.</em></h1>
          <p className="sub">
            Reference material for the full Kairos epistemic stack — from decision state theory
            to Argus XDR deployment to the observer SDK.
          </p>
        </div>
      </div>

      <div className="wrap">
        <div className="docs-grid">

          {/* ── 01 KAIROS ── */}
          <div className="docs-card">
            <div className="docs-card-head">
              <div className="docs-card-brand">
                <img src="/kairos-logo.png" alt="Kairos" width={36} height={36} style={{ height: 36, width: 36, objectFit: 'contain', borderRadius: '50%', flexShrink: 0 }} />
                <span className="num">01 / 03</span>
                <span className="pill">FRAMEWORK</span>
              </div>
              <h2>Kairos <em>ECL</em></h2>
              <p>
                Epistemic control loop — decision states, signal taxonomy, signal-framework map,
                and research findings that underpin every gate.
              </p>
            </div>
            <div className="docs-card-links">
              {KAIROS_LINKS.map((l) => (
                <DocRow key={l.to} {...l} />
              ))}
            </div>
          </div>

          {/* ── 02 ARGUS XDR ── */}
          <div className="docs-card">
            <div className="docs-card-head">
              <div className="docs-card-brand">
                <img src="/argus-logo.png" alt="Argus" width={36} height={36} style={{ height: 36, width: 36, objectFit: 'contain', borderRadius: '50%', flexShrink: 0 }} />
                <span className="num">02 / 03</span>
                <span className="pill">XDR</span>
              </div>
              <h2>Argus <em>XDR</em></h2>
              <p>
                Extended detection & response for LLM stacks — reference architecture,
                deployment guides, and integration documentation.
              </p>
            </div>
            <div className="docs-card-links">
              {ARGUS_XDR_LINKS.map((l) => (
                <DocRow key={l.to} {...l} />
              ))}
            </div>
          </div>

          {/* ── 03 ARGUS SDK — COMING SOON ── */}
          <div className="docs-card coming">
            <div className="docs-card-head" style={{ borderBottomColor: 'rgba(245,158,11,0.20)' }}>
              <div className="docs-card-brand">
                <img src="/argus-logo.png" alt="Argus SDK" width={36} height={36} style={{ height: 36, width: 36, objectFit: 'contain', borderRadius: '50%', flexShrink: 0 }} />
                <span className="num">03 / 03</span>
                <span className="pill amber">SDK</span>
              </div>
              <h2>Argus <em>SDK</em></h2>
              <p>
                Lightweight Go agent for embedding epistemic observability directly into
                AI pipelines. OCSF v1.3 out of the box.
              </p>
            </div>
            <div className="coming-body">
              <span className="coming-badge">
                <span className="dot" />
                IN PROGRESS · Q3 2026
              </span>
              <h3>Docs are being<br /><em>written.</em></h3>
              <p>
                The SDK is under active v2 revamp. Documentation will cover the full
                integration surface — from single-binary installation to custom OCSF
                schema plugins.
              </p>
              <ul className="coming-list">
                <li>Getting started &amp; installation</li>
                <li>Agent integration patterns</li>
                <li>OCSF schema customisation</li>
                <li>API reference &amp; plugin SDK</li>
                <li>SIEM connector guides</li>
              </ul>
              <div className="coming-eta">ETA · Q3 2026 · APACHE 2.0</div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <EclipseFooter />
  </>
);

export default Docs;
