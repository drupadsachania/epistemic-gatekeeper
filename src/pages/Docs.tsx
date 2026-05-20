/**
 * Docs.tsx — Kairos Foundation documentation hub.
 * Three-pillar structure: Kairos · Argus XDR · Argus SDK (coming soon).
 * Prism light design — glass cards, no dark backgrounds except .term blocks.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import EclipseFooter from '../components/EclipseFooter';
import '../styles/docs.css';

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
