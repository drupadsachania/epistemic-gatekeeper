/**
 * Index.tsx — Kairos Foundation homepage: a research-led engineering site.
 * Kairos is the thesis; the products are how the ecosystem addresses parts of the problem.
 *   01 Hero: the central question → 02 How Kairos works (checks + simulator) → 03 Products
 *   → 04 Research, evidence and limitations → 05 Documentation and community.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import DecisionGate from '../components/DecisionGate';
import ArgusMark from '../components/brand/ArgusMark';
import '../styles/home.css';

const CHECKS = [
  { id: 'Gate 1', q: 'Is it structurally possible?',    how: 'topology · identity graph',                   fail: 'INVALID → back to Orient' },
  { id: 'Gate 2', q: 'Is it calibrated-confident?',     how: 'certified calibration · risk-tier threshold', fail: 'fails → DEFER' },
  { id: 'Gate 3', q: 'Did errors creep in upstream?',   how: 'uncertainty across the whole investigation',  fail: 'fails → ESCALATE' },
  { id: 'Veto',   q: 'Is the justification untrusted?', how: 'confidence cannot launder taint',             fail: 'tainted → ESCALATE', veto: true },
];

const PRINCIPLES = [
  { n: '01', t: 'Hypothesis-only', b: <>Language models propose competing explanations, at least one of them benign. They hold no tool authority.</> },
  { n: '02', t: 'Earn the right to act', b: <>The default is to defer. Autonomy needs positive evidence at every check, and only <em>up to the action's risk tier</em>.</> },
  { n: '03', t: 'Uncertainty is structure', b: <>Decomposed per hypothesis, certified per deployment, and tracked across the whole investigation.</> },
  { n: '04', t: 'Provenance beats confidence', b: <>Untrusted input may inform a hypothesis but never authorise an action that executes, sends or changes state.</> },
  { n: '05', t: 'No silent failures', b: <>Every failure is named, every deferral says what evidence is missing, every decision is recorded.</> },
];

/* Preliminary proof-of-concept figures, each with its limitation beside it (paper §5). */
const EVIDENCE = [
  { v: '12% → 3%',  k: 'hallucinated reasoning, against the same LLM unconstrained', lim: 'Labelled by the author; no inter-rater agreement reported.' },
  { v: '5% → 22%',  k: 'deferral rate (DEFER + ESCALATE)',                          lim: 'The cost side. Deferral precision and analyst time were not measured.' },
  { v: '30% → 85%', k: 'missing evidence explicitly surfaced',                     lim: 'Static, synthetic scenarios, not independently constructed.' },
  { v: '0',         k: 'structurally impossible hypotheses reaching an analyst',   lim: 'Only as accurate as the synthetic topology graph it was checked against.' },
];

const UNPROVEN = [
  'Whether deferrals are precise enough to be worth their cost in analyst time.',
  'Resistance to adaptive prompt-injection attacks placed in real telemetry.',
  'Calibration certification on adjudicated incidents in a live deployment.',
  'Trajectory-level gating against a step-level-only baseline.',
  'Behaviour across a model-version change and a retrieval-corpus refresh.',
];

const Index: React.FC = () => (
  <>
    {/* ── 01 Hero: the central question ────────────────────────────────── */}
    <section className="k-section k-hero-calm">
      <div className="k-container">
        <div className="k-hero-mark">
          <img className="k-theme-light-only" src="/brand/kairos-mark-320.png" width="77" height="72" alt="Kairos mark" />
          <img className="k-theme-dark-only" src="/brand/kairos-mark-dark-320.png" width="77" height="72" alt="Kairos mark" />
        </div>
        <span className="k-eyebrow k-accent-kairos">Kairos Foundation · Research</span>
        <h1>AI should <em>earn the right</em> to act.</h1>
        <p className="k-lede">
          Kairos is an open framework for AI systems that take action. A language model may propose what is
          happening; it never decides what to do. Deterministic checks, outside the model, decide whether the
          evidence has earned an action, and how far that action may reach.
        </p>
        <div className="k-row">
          <a className="k-btn k-btn--primary" href="/EARNING_THE_RIGHT_TO_ACT.pdf" target="_blank" rel="noopener noreferrer">
            Read the paper <span className="k-arrow" aria-hidden="true">→</span>
          </a>
          <a className="k-btn k-btn--secondary" href="#how">Try the framework</a>
        </div>

        <nav className="k-onpage" aria-label="On this page">
          <a href="#how"><span>01</span> How Kairos works</a>
          <a href="#products"><span>02</span> Products</a>
          <a href="#research"><span>03</span> Research &amp; evidence</a>
          <a href="#build"><span>04</span> Docs &amp; community</a>
        </nav>
      </div>
    </section>

    {/* ── 02 How Kairos works: checks, then the simulator ──────────────── */}
    <section className="k-section k-section--band" id="how" aria-labelledby="how-h">
      <div className="k-container">
        <div className="k-head">
          <span className="k-eyebrow k-accent-kairos">01 · How Kairos works</span>
          <h2 id="how-h">Three gates and a veto, <em>outside the model</em></h2>
          <p>
            Every hypothesis meets the same four checks in deterministic code. The first failure decides the
            outcome; passing them all makes an action eligible for autonomy only up to its risk tier.
          </p>
        </div>

        <ol className="k-checks k-checks--row k-checks--flow">
          {CHECKS.map((c, i) => (
            <li key={c.id} className={`k-check${c.veto ? ' k-check--veto' : ''}`} data-reveal style={{ '--i': i } as React.CSSProperties}>
              <span className="k-check__id">{c.id}</span>
              <span className="k-check__q">{c.q}</span>
              <span className="k-check__how">{c.how}</span>
              <span className="k-check__fail">{c.fail}</span>
            </li>
          ))}
        </ol>

        <div className="k-head k-gate-intro">
          <h3>Try the decision gate</h3>
          <p>
            Pick a scenario, read why it lands where it does, then change the input that matters. Start with
            <em> Telemetry gap</em> to see a deferral and the evidence it asks for, or <em>Injected email</em> to
            see untrusted provenance veto a high-confidence hypothesis.
          </p>
        </div>
        <DecisionGate />

        <div className="k-principles-block">
          <h3>Five principles behind the gates</h3>
          <p className="k-myth">
            <span className="k-greek">Kairos</span> (καιρός) was the Greek spirit of the opportune moment: a forelock
            to seize as he approached, bald behind once he had passed.
          </p>
          <ul className="k-principles k-principles--compact">
            {PRINCIPLES.map((p) => (
              <li key={p.n} className="k-principle">
                <span className="k-principle__n">{p.n}</span>
                <h4>{p.t}</h4>
                <p>{p.b}</p>
              </li>
            ))}
          </ul>
          <p className="k-note"><Link className="k-link" to="/kairos/gates">Read the full framework: gates, uncertainty and decision states</Link></p>
        </div>
      </div>
    </section>

    {/* ── 03 Products: three distinct jobs ─────────────────────────────── */}
    <section className="k-section" id="products" aria-labelledby="products-h">
      <div className="k-container">
        <div className="k-head">
          <span className="k-eyebrow">02 · Products</span>
          <h2 id="products-h">Three tools, <em>three distinct jobs</em></h2>
          <p>
            Kairos is the thesis. These open security-engineering projects each take on a different part of the
            problem. They are independent tools; where one connects to the framework today, its card says so.
          </p>
        </div>

        <ul className="k-products k-stagger">
          <li className="k-card k-card--accent k-accent-argus k-product" data-reveal style={{ '--i': 0 } as React.CSSProperties}>
            <div className="k-product__top">
              <div className="k-card__mark"><ArgusMark size={80} title="Argus mark" /></div>
              <span className="k-pill k-pill--argus">XDR 1.0 · SDK 1.2 beta</span>
            </div>
            <p className="k-product__name">Argus <span>XDR / SDK</span></p>
            <h3 className="k-product__job">See what is happening.</h3>
            <p>LLM-system observability, cross-layer signal correlation, and visibility into shadow AI on endpoints.</p>
            <p className="k-product__link-note">Argus XDR has an optional hook that sends detections to a Kairos policy endpoint and records the decision (off by default).</p>
            <span className="k-product__verbs">Observe · Trace · Understand</span>
            <Link className="k-btn k-btn--argus k-product__cta" to="/argus">Explore Argus <span className="k-arrow" aria-hidden="true">→</span></Link>
          </li>

          <li className="k-card k-card--accent k-accent-aegis k-product" data-reveal style={{ '--i': 1 } as React.CSSProperties}>
            <div className="k-product__top">
              <div className="k-card__mark">
                <img className="k-theme-light-only" src="/brand/aegis-mark-320.webp" width="92" height="80" alt="Aegis mark" loading="lazy" />
                <img className="k-theme-dark-only" src="/brand/aegis-mark-dark-320.webp" width="91" height="80" alt="Aegis mark" loading="lazy" />
              </div>
              <span className="k-pill k-pill--live">Live</span>
            </div>
            <p className="k-product__name">Aegis</p>
            <h3 className="k-product__job">Give AI assistants defensive expertise.</h3>
            <p>An open library of defensive security skills that practitioners can inspect, download, and use across supported AI environments.</p>
            <span className="k-product__verbs">Defend · Adapt · Contain</span>
            <a className="k-btn k-btn--aegis k-product__cta" href="https://aegis-skills.vercel.app" target="_blank" rel="noopener noreferrer">Browse the skills <span className="k-arrow" aria-hidden="true">→</span></a>
          </li>

          <li className="k-card k-card--accent k-accent-themis k-product" data-reveal style={{ '--i': 2 } as React.CSSProperties}>
            <div className="k-product__top">
              <div className="k-card__mark">
                <img className="k-theme-light-only" src="/brand/themis-mark-320.webp" width="91" height="80" alt="Themis mark" loading="lazy" />
                <img className="k-theme-dark-only" src="/brand/themis-mark-dark-320.webp" width="91" height="80" alt="Themis mark" loading="lazy" />
              </div>
              <span className="k-pill k-pill--building">In development</span>
            </div>
            <p className="k-product__name">Themis</p>
            <h3 className="k-product__job">Govern what the agent can do.</h3>
            <p>A security-operations agent that plans tasks, uses specialist skills, applies guardrails, and keeps human approval in the execution workflow.</p>
            <span className="k-product__verbs">Govern · Enforce · Execute</span>
            <a className="k-btn k-btn--themis k-product__cta" href="https://aegis-skills.vercel.app/themis" target="_blank" rel="noopener noreferrer">Follow Themis <span className="k-arrow" aria-hidden="true">→</span></a>
          </li>
        </ul>
      </div>
    </section>

    {/* ── 04 Research, evidence and limitations ────────────────────────── */}
    <section className="k-section k-section--band" id="research" aria-labelledby="research-h">
      <div className="k-container">
        <div className="k-head">
          <span className="k-eyebrow k-accent-kairos">03 · Research &amp; evidence</span>
          <h2 id="research-h">An explicit, testable approach, <em>not a finished proof</em></h2>
          <p>
            <cite>Earning the Right to Act</cite> sets out the framework, maps documented 2025–2026 agentic incidents
            to its controls, and publishes the evaluation that would confirm or refute it.
          </p>
        </div>

        <div className="k-callout k-callout--warning k-evidence-status">
          <strong>Preliminary</strong>
          <span>
            A small, single-author proof of concept on static, synthetic scenarios, compared with the same LLM
            without the framework. It indicates the direction of the effect. It is not a benchmark, and no
            confidence intervals are reported.
          </span>
        </div>

        <ul className="k-evidence">
          {EVIDENCE.map((e) => (
            <li key={e.v} className="k-stat">
              <div className="k-stat__v">{e.v}</div>
              <div className="k-stat__k">{e.k}</div>
              <p className="k-stat__lim"><span>Limitation</span>{e.lim}</p>
            </li>
          ))}
        </ul>

        <div className="k-research-grid">
          <div className="k-panel">
            <h3>What remains unproven</h3>
            <ul className="k-list">{UNPROVEN.map((u) => <li key={u}>{u}</li>)}</ul>
          </div>
          <div className="k-panel">
            <h3>What exists today</h3>
            <p>
              The reference engine (<code>kairos-security</code>) implements an earlier design: two LLM agents,
              heuristic uncertainty scoring and an 8-rule policy, with 68 passing tests. The three gates, the
              provenance veto, risk tiers and calibration certification are <strong>specified, not yet implemented</strong>.
            </p>
            <p>
              The evaluation protocol fixes the datasets, labelling, calibration metrics, adaptive attacks,
              ablations and drift checks a full study must report.
            </p>
          </div>
        </div>

        <div className="k-row">
          <Link className="k-btn k-btn--primary" to="/research">Methodology and results <span className="k-arrow" aria-hidden="true">→</span></Link>
          <a className="k-btn k-btn--secondary" href="https://github.com/kairos-dev-kairos-ecl/kairos-core/blob/main/Docs/KAIROS-009-evaluation-protocol.md" target="_blank" rel="noopener noreferrer">Evaluation protocol</a>
          <a className="k-btn k-btn--secondary" href="/EARNING_THE_RIGHT_TO_ACT.pdf" target="_blank" rel="noopener noreferrer">Paper (PDF)</a>
        </div>
      </div>
    </section>

    {/* ── 05 Documentation and community ───────────────────────────────── */}
    <section className="k-section" id="build" aria-labelledby="build-h">
      <div className="k-container">
        <div className="k-head">
          <span className="k-eyebrow">04 · Docs &amp; community</span>
          <h2 id="build-h">Test it, <em>break it, publish what you find</em></h2>
          <p>Everything needed to examine the framework or try it in a real environment.</p>
        </div>

        <div className="k-routes">
          <div className="k-panel">
            <span className="k-panel__eyebrow">For researchers</span>
            <h3>Run the evaluation independently</h3>
            <p>Use public SOC datasets, two independent labellers and adaptive injections in telemetry, then report deferral precision and calibration with confidence intervals.</p>
            <a className="k-link" href="https://github.com/kairos-dev-kairos-ecl/kairos-core/blob/main/Docs/KAIROS-009-evaluation-protocol.md" target="_blank" rel="noopener noreferrer">KAIROS-009 evaluation protocol</a>
          </div>
          <div className="k-panel">
            <span className="k-panel__eyebrow">For practitioners</span>
            <h3>Start in shadow mode</h3>
            <p>Label provenance, build an action risk-tier register and collect adjudicated outcomes before any action runs without a person.</p>
            <Link className="k-link" to="/adoption">Adoption guide</Link>
          </div>
        </div>

        <ul className="k-resources">
          <li><a href="https://github.com/kairos-dev-kairos-ecl/kairos-core" target="_blank" rel="noopener noreferrer"><span>Specifications</span>kairos-core · KAIROS-000 to 009 and templates</a></li>
          <li><a href="https://github.com/kairos-dev-kairos-ecl/kairos-security" target="_blank" rel="noopener noreferrer"><span>Reference engine</span>kairos-security · security-operations profile and tests</a></li>
          <li><Link to="/docs"><span>Documentation</span>Framework pages, Argus docs and cross-reference</Link></li>
          <li><Link to="/community"><span>Contribute</span>Issues, discussions and domain profiles</Link></li>
        </ul>
      </div>
    </section>
  </>
);

export default Index;
