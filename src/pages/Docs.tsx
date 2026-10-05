/**
 * Docs.tsx — Kairos Foundation documentation hub.
 * Three-pillar structure: Kairos · Argus XDR · Argus SDK.
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
  external?: boolean;
}

function DocRow({ label, desc, to, tag, tagColor, featured, external }: DocLink) {
  const className = `doc-row${featured ? ' doc-row-featured' : ''}`;
  const body = (
    <>
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
        <span className="doc-row-arrow">{external ? '↗' : '→'}</span>
      </div>
    </>
  );
  return external
    ? <a href={to} target="_blank" rel="noopener noreferrer" className={className}>{body}</a>
    : <Link to={to} className={className}>{body}</Link>;
}

/* ── KAIROS DOCS ────────────────────────────────────────────────────────── */

const KAIROS_LINKS: DocLink[] = [
  {
    label: 'Research & Findings',
    desc: 'Preprint v2 (Oct 2026) · what v2 corrects · 2025–26 incidents · preliminary PoC 12% → 3% vs. same LLM',
    to: '/research',
    tag: 'ETRA-v2',
    tagColor: 'var(--amber)',
    featured: true,
  },
  {
    label: 'Epistemic Control Loop',
    desc: 'Observe → Orient → Decide → Act, with the control each phase carries and what is implemented',
    to: '/kairos/ooda',
    tag: 'KAIROS-001',
  },
  {
    label: 'Gates & Uncertainty',
    desc: 'Triple gate + provenance veto · three-level uncertainty · calibration certification · sinks',
    to: '/kairos/gates',
    tag: 'KAIROS-004',
  },
  {
    label: 'Decision States & Risk Tiers',
    desc: 'ACT · DEFER · ESCALATE · Tier 0–3 · 16-rule v2 policy · state machine with bounded re-orient',
    to: '/kairos/decision-states',
    tag: 'KAIROS-003',
  },
  {
    label: 'Threat Model & Failure Modes',
    desc: 'OWASP Agentic Top 10 coverage · 13 named failure types with mandatory overrides',
    to: '/kairos/problem',
    tag: 'KAIROS-005',
  },
  {
    label: 'Adoption Guide',
    desc: 'Shadow → gated → certified · KPIs that replace throughput · governance alignment',
    to: '/adoption',
    tag: 'KAIROS-008',
  },
  {
    label: 'Framework Cross-Reference',
    desc: 'Every gate, failure and rule with its phase, OWASP risk, and implementation status',
    to: '/argus-xdr/signal-map',
    tag: 'REFERENCE',
  },
  {
    label: 'kairos-core on GitHub',
    desc: 'Full specs KAIROS-000 … 009, changelog and templates (capability token, calibration certificate, …)',
    to: 'https://github.com/kairos-dev-kairos-ecl/kairos-core',
    tag: 'SPEC v2.0.0',
    external: true,
  },
  {
    label: 'kairos-security on GitHub',
    desc: 'SOC profile SEC-001 … 005 · reference engine · ten worked use cases · 68 tests',
    to: 'https://github.com/kairos-dev-kairos-ecl/kairos-security',
    tag: 'SOC PROFILE',
    external: true,
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

const ARGUS_SDK_LINKS: DocLink[] = [
  {
    label: 'Install & capabilities',
    desc: 'MSI install, verified-vs-unverified platform matrix, what it does not do yet',
    to: 'https://github.com/kairos-dev-kairos-ecl/ArgusSDK#readme',
    tag: 'README',
    external: true,
  },
  {
    label: 'Configuration reference',
    desc: 'agent.yaml: ingest.euc, local_inference_ports, outputs[] (Kafka, Splunk, Elastic, syslog, ArgusXDR)',
    to: 'https://github.com/kairos-dev-kairos-ecl/ArgusSDK/blob/main/docs/CONFIGURATION.md',
    tag: 'CONFIG',
    external: true,
  },
  {
    label: 'Release v1.2.0',
    desc: 'Windows MSI + zip, cosign-signed checksums, SLSA provenance · changelog',
    to: 'https://github.com/kairos-dev-kairos-ecl/ArgusSDK/releases/tag/v1.2.0',
    tag: 'LATEST',
    tagColor: 'var(--amber)',
    external: true,
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
                Epistemic control loop v2.0 — gates, uncertainty, decision states, risk tiers and
                the research behind them. Each mechanism is marked implemented or specified.
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

          {/* ── 03 ARGUS SDK ── */}
          <div className="docs-card">
            <div className="docs-card-head" style={{ borderBottomColor: 'rgba(245,158,11,0.20)' }}>
              <div className="docs-card-brand">
                <img src="/argus-logo.png" alt="Argus SDK" width={36} height={36} style={{ height: 36, width: 36, objectFit: 'contain', borderRadius: '50%', flexShrink: 0 }} />
                <span className="num">03 / 03</span>
                <span className="pill amber">SDK · BETA</span>
              </div>
              <h2>Argus <em>SDK</em></h2>
              <p>
                Shadow-AI visibility agent. Detects cloud and local AI-tool use on endpoints and
                forwards OCSF v1.3 to your SIEM. v1.2.0, Windows-first public beta.
              </p>
            </div>
            <div className="docs-card-links">
              {ARGUS_SDK_LINKS.map((l) => (
                <DocRow key={l.to} {...l} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>

    <EclipseFooter />
  </>
);

export default Docs;
