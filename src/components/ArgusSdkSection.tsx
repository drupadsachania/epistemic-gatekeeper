/**
 * ArgusSdkSection.tsx — Epistemic Prism SDK section.
 * ArgusSDK v1.2.0: Windows-first public beta shadow-AI visibility agent (Go, OCSF v1.3).
 * Terminal + feat cards + OcsfFlow.
 */

import React, { useState } from 'react';

/* ── OCSF FLOW ──────────────────────────────────────────────────────────── */

function OcsfFlow() {
  return (
    <div className="ocsf">
      <style>{`
        .ocsf {
          position: relative; padding: 28px 30px;
          background: var(--surface); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--hairline); border-radius: var(--r-lg); box-shadow: var(--shadow-card);
          overflow: hidden;
        }
        .ocsf::before {
          content: ""; position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 40% at 50% 100%, rgba(245,158,11,0.06), transparent 60%);
          pointer-events: none;
        }
        .ocsf-grid {
          position: relative; display: grid;
          grid-template-columns: 1fr auto 1fr; gap: 32px; align-items: center;
        }
        @media (max-width: 880px) { .ocsf-grid { grid-template-columns: 1fr; gap: 20px; } }
        .ocsf-col { display: flex; flex-direction: column; gap: 8px; }
        .ocsf-col .lbl {
          font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.16em;
          color: var(--ink-3); text-transform: uppercase; margin-bottom: 6px;
        }
        .ocsf-chip {
          display: flex; justify-content: space-between; align-items: center;
          padding: 10px 12px; font-family: var(--f-mono); font-size: 11.5px;
          background: #fff; border: 1px solid var(--hairline-strong);
          border-radius: var(--r-sm); color: var(--ink-1);
          box-shadow: 0 1px 2px rgba(15,13,27,0.03);
        }
        .ocsf-chip .tag {
          font-size: 9px; color: var(--amber); letter-spacing: 0.14em; font-weight: 500;
          padding: 2px 7px; background: rgba(245,158,11,0.10);
          border: 1px solid rgba(245,158,11,0.22); border-radius: 3px;
        }
        .ocsf-chip .tag.ok { color: var(--indigo); background: rgba(67,56,202,0.08); border-color: rgba(67,56,202,0.22); }

        .ocsf-core {
          position: relative; padding: 22px 26px; border-radius: var(--r-md);
          background: linear-gradient(180deg, rgba(245,158,11,0.12), rgba(245,158,11,0.04));
          border: 1px solid rgba(245,158,11,0.40); color: var(--ink-0);
          text-align: center; min-width: 220px;
          box-shadow: 0 0 30px rgba(245,158,11,0.18);
        }
        .ocsf-core .name {
          font-family: var(--f-sans); font-size: 24px; font-weight: 600;
          letter-spacing: -0.025em; line-height: 1;
        }
        .ocsf-core .name em { font-family: var(--f-serif); font-style: italic; font-weight: 400; color: var(--amber); }
        .ocsf-core .schema {
          font-family: var(--f-mono); font-size: 11px; color: var(--amber);
          letter-spacing: 0.14em; font-weight: 500; margin-top: 10px;
        }
        .ocsf-core .lang {
          font-family: var(--f-mono); font-size: 10px; color: var(--ink-3);
          margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(245,158,11,0.20); letter-spacing: 0.08em;
        }
        .ocsf-arrow {
          display: block; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(245,158,11,0.5), transparent);
          background-size: 30% 100%; animation: ocsf-flow 2s linear infinite; margin: 8px 0 2px;
        }
        @keyframes ocsf-flow { 0% { background-position: -30% 0; } 100% { background-position: 130% 0; } }
      `}</style>

      <div className="ocsf-grid">
        <div className="ocsf-col">
          <span className="lbl">// local llm signals</span>
          {[
            { name: 'ollama · llama3-70b', tag: 'SHADOW' },
            { name: 'lm-studio · mixtral', tag: 'SHADOW' },
            { name: 'vllm · qwen2.5',      tag: 'SHADOW' },
          ].map((s) => (
            <div className="ocsf-chip" key={s.name}>
              <span>{s.name}</span>
              <span className="tag">{s.tag}</span>
            </div>
          ))}
          <div className="ocsf-arrow" />
        </div>

        <div className="ocsf-core">
          <div className="name">Argus <em>SDK</em></div>
          <div className="schema">→ OCSF v1.3</div>
          <div className="lang">// go · windows service · msi</div>
        </div>

        <div className="ocsf-col">
          <span className="lbl">// SIEM / observability fanout</span>
          {['Kafka', 'Splunk', 'Elastic', 'Syslog', 'ArgusXDR'].map((s) => (
            <div className="ocsf-chip" key={s}>
              <span>{s}</span>
              <span className="tag ok">→</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── GO AGENT TERMINAL ──────────────────────────────────────────────────── */

function GoAgentTerminal() {
  const [copied, setCopied] = useState(false);
  const cmd = 'msiexec /i argus-agent_<version>_windows_amd64.msi /quiet';
  const copy = () => {
    navigator.clipboard?.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const lines: React.ReactNode[] = [
    <span className="com"># 1. Install the Windows service (silent, for Intune / MDM)</span>,
    <><span className="fn">msiexec</span> <span className="kw">/i</span> <span className="str">argus-agent_&lt;version&gt;_windows_amd64.msi</span> <span className="kw">/quiet</span></>,
    ' ',
    <span className="com"># 2. Point it at your SIEM: C:\ProgramData\argus-agent\agent.yaml</span>,
    <><span className="kw">outputs</span>:</>,
    <>  - <span className="kw">name</span>: <span className="str">"siem-kafka"</span></>,
    <>    <span className="kw">type</span>: <span className="str">"kafka"</span></>,
    <>    <span className="kw">endpoint</span>: <span className="str">"broker1:9092"</span></>,
    <>    <span className="kw">ocsf</span>: <span className="fn">true</span>   <span className="com"># translate to OCSF v1.3</span></>,
    ' ',
    <><span className="fn">Restart-Service</span> <span className="str">argus-agent</span></>,
    ' ',
    <span className="com"># claude.exe → api.anthropic.com  ⇒  euc.ai_access (OCSF)</span>,
  ];
  return (
    <div className="term sdk-term" aria-label="Argus SDK Windows agent install">
      <style>{`
        .sdk-term { min-height: 380px; display: flex; flex-direction: column; }
        .sdk-term .term-body { flex: 1; overflow-x: auto; }
        .sdk-term .gutter {
          display: inline-block; width: 28px;
          color: rgba(244,244,245,0.25); font-variant-numeric: tabular-nums;
          text-align: right; margin-right: 14px; user-select: none;
        }
        .sdk-term .line { display: flex; padding: 1px 0; }
        .sdk-term .line .code { flex: 1; white-space: pre; }
      `}</style>
      <div className="term-head">
        <div className="dots">
          <i style={{ background: '#FF5F57' }} />
          <i style={{ background: '#FEBC2E' }} />
          <i style={{ background: '#28C840' }} />
        </div>
        <span className="file">install · agent.yaml</span>
        <button className={`copy ${copied ? 'copied' : ''}`} onClick={copy}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          {copied ? 'COPIED' : 'COPY'}
        </button>
      </div>
      <div className="term-body">
        {lines.map((l, i) => (
          <div className="line" key={i}><span className="gutter">{i + 1}</span><span className="code">{l}</span></div>
        ))}
      </div>
    </div>
  );
}

/* ── ARGUS SDK SECTION ──────────────────────────────────────────────────── */

const ArgusSdkSection: React.FC = () => (
  <section id="argus-sdk" className="sdk-sec">
    <style>{`
      .sdk-sec {
        padding: 90px 0 110px; position: relative;
        border-top: 1px solid var(--hairline);
      }
      .sdk-sec .lead-grid {
        display: grid; grid-template-columns: 1fr 1.1fr;
        gap: 56px; align-items: center;
      }
      @media (max-width: 1100px) { .sdk-sec .lead-grid { grid-template-columns: 1fr; gap: 32px; } }

      .sdk-sec .tag {
        display: inline-flex; align-items: center; gap: 12px;
        padding: 6px 14px 6px 8px;
        background: var(--surface-strong); backdrop-filter: blur(8px);
        border: 1px solid var(--hairline-strong); border-radius: 999px;
        font-family: var(--f-mono); font-size: 11px; font-weight: 500;
        letter-spacing: 0.16em; color: var(--amber); text-transform: uppercase;
        margin-bottom: 24px;
      }
      .sdk-sec .tag img { height: 28px; width: 28px; object-fit: contain; border-radius: 50%; flex-shrink: 0; }
      .sdk-sec .tag .dot {
        width: 7px; height: 7px; border-radius: 50%;
        background: var(--amber); box-shadow: 0 0 0 3px rgba(245,158,11,0.20);
      }

      .sdk-sec h2 {
        font-size: clamp(40px, 7vw, 96px); font-weight: 600;
        letter-spacing: -0.045em; line-height: 0.92; margin: 0 0 24px; color: var(--ink-0);
      }
      .sdk-sec h2 .em {
        background: linear-gradient(120deg, var(--indigo), var(--amber));
        -webkit-background-clip: text; background-clip: text; color: transparent;
      }
      .sdk-sec h2 .ital { font-family: var(--f-serif); font-style: italic; font-weight: 400; }

      .sdk-sec .lede {
        color: var(--ink-2); font-size: 17px; line-height: 1.55;
        margin: 0 0 28px; text-wrap: pretty; max-width: 480px;
      }
      .sdk-sec .lede em { font-family: var(--f-serif); font-style: italic; color: var(--ink-0); font-weight: 400; }

      .sdk-sec .cta-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 32px; }

      .sdk-sec .feats { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; max-width: 540px; }
      @media (max-width: 540px) { .sdk-sec .feats { grid-template-columns: 1fr; } }

      .sdk-feat {
        padding: 18px 18px 16px;
        background: var(--surface); backdrop-filter: blur(12px);
        border: 1px solid var(--hairline); border-radius: var(--r-md); box-shadow: var(--shadow-card);
      }
      .sdk-feat .icon {
        width: 28px; height: 28px; border-radius: var(--r-xs);
        background: rgba(67,56,202,0.10); color: var(--indigo);
        display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px;
      }
      .sdk-feat .icon svg { width: 16px; height: 16px; }
      .sdk-feat .name { font-family: var(--f-sans); font-size: 15px; font-weight: 600; color: var(--ink-0); letter-spacing: -0.01em; margin-bottom: 4px; }
      .sdk-feat .desc { font-family: var(--f-sans); font-size: 13px; color: var(--ink-2); line-height: 1.45; }

      .sdk-sec .closing {
        margin-top: 80px; display: grid; grid-template-columns: 1.2fr 1fr;
        gap: 40px; align-items: end; padding-top: 36px; border-top: 1px solid var(--hairline);
      }
      @media (max-width: 880px) { .sdk-sec .closing { grid-template-columns: 1fr; align-items: start; } }
      .sdk-sec .closing .quote {
        font-family: var(--f-serif); font-style: italic; font-weight: 400;
        font-size: clamp(22px, 2.6vw, 32px); letter-spacing: -0.02em;
        color: var(--ink-0); line-height: 1.25; text-wrap: pretty;
      }
      .sdk-sec .closing .quote .a {
        background: linear-gradient(120deg, var(--indigo), var(--amber));
        -webkit-background-clip: text; background-clip: text; color: transparent;
      }
      .sdk-sec .closing form {
        display: flex; align-items: stretch;
        background: var(--surface-strong); border: 1px solid var(--hairline-strong);
        border-radius: var(--r-sm); overflow: hidden; backdrop-filter: blur(8px);
      }
      .sdk-sec .closing input {
        background: transparent; border: 0; outline: none;
        padding: 12px 16px; color: var(--ink-0);
        font-family: var(--f-sans); font-size: 14px; flex: 1; min-width: 220px;
      }
      .sdk-sec .closing input::placeholder { color: var(--ink-3); }
      .sdk-sec .closing button {
        appearance: none; border: 0; cursor: pointer;
        background: var(--indigo); color: #fff;
        font-family: var(--f-sans); font-size: 13px; font-weight: 600;
        letter-spacing: -0.005em; padding: 0 18px;
        display: flex; align-items: center; gap: 6px; transition: background 0.15s;
      }
      .sdk-sec .closing button:hover { background: var(--indigo-bright); }
      .sdk-sec .closing .form-meta {
        font-family: var(--f-mono); font-size: 11px;
        color: var(--ink-3); margin-top: 10px; letter-spacing: 0.04em;
      }
      .sdk-sec .closing .confirm {
        font-family: var(--f-mono); font-size: 13px; color: var(--indigo);
        padding: 14px 16px;
        background: rgba(67,56,202,0.06); border: 1px solid rgba(67,56,202,0.22); border-radius: var(--r-sm);
      }
    `}</style>

    <div className="wrap">
      <div className="section-meta">
        <span className="num">03 / 03</span>
        <div className="meta-kv">
          <div><span className="k">Pillar</span><span className="v">Argus SDK</span></div>
          <div><span className="k">Type</span><span className="v">Shadow-AI visibility agent</span></div>
          <div><span className="k">Stage</span><span className="v" style={{ color: 'var(--amber)' }}>Public beta · v1.2.0</span></div>
          <div><span className="k">Released</span><span className="v">Jun 2026 · Windows-first</span></div>
        </div>
      </div>

      <div className="lead-grid">
        <div>
          <span className="tag">
            <img src="/argus-logo.png" alt="Argus" />
            <span className="dot" />PUBLIC BETA · WINDOWS-FIRST · APACHE 2.0
          </span>
          <h2>
            Deploy<br />
            the Argus <span className="ital em">Observer.</span>
          </h2>
          <p className="lede">
            A lightweight endpoint agent that shows <em>which AI services</em> your endpoints talk to:
            cloud tools by DNS hostname, local models by port, with the originating process. Normalised
            to OCSF v1.3 for the SIEM you already run. Observe-only by design.
          </p>
          <div className="cta-row">
            <a className="btn btn-primary" href="https://github.com/kairos-dev-kairos-ecl/ArgusSDK/releases/tag/v1.2.0" target="_blank" rel="noopener noreferrer">
              Download v1.2.0
              <span style={{ fontSize: 16, lineHeight: '1' }}>→</span>
            </a>
            <a className="btn btn-ghost" href="https://github.com/kairos-dev-kairos-ecl/ArgusSDK" target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          </div>

          <div className="feats">
            <div className="sdk-feat">
              <span className="icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
                </svg>
              </span>
              <div className="name">Low-privilege Windows service</div>
              <div className="desc">One-click MSI or silent <code>msiexec</code>. No process enumeration, file monitoring or packet capture. Release artefacts are cosign-signed with SLSA provenance.</div>
            </div>
            <div className="sdk-feat">
              <span className="icon" style={{ background: 'rgba(245,158,11,0.10)', color: 'var(--amber)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
              </span>
              <div className="name">OCSF v1.3 to your SIEM</div>
              <div className="desc">Kafka verified live; Elastic and Splunk CI-tested; syslog and ArgusXDR unit-tested. WAL buffer rides out outages.</div>
            </div>
          </div>
        </div>

        <GoAgentTerminal />
      </div>

      <p className="beta-note" style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.04em', lineHeight: 1.7, margin: '28px 0 0', maxWidth: 820 }}>
        // Honest scope: cloud-AI detection is verified on Windows only. Linux and macOS are not yet published.
        Installers are unsigned (SmartScreen will prompt), only the Kafka output is proven end-to-end,
        and fleet-scale load has not been tested. Argus reports; your firewall, proxy, EDR or MDM enforces.
      </p>

      <div className="label-row" style={{ marginTop: 80 }}>SHADOW AI · LOCAL MODEL VISIBILITY</div>
      <OcsfFlow />

      <div className="closing">
        <p className="quote">
          &ldquo;Security teams shouldn't have to guess <span className="a">which</span> models
          are running on which laptops. Argus makes the unsanctioned visible —{' '}
          <span className="a">without breaking shipping speed.</span>&rdquo;
        </p>
      </div>
    </div>
  </section>
);

export default ArgusSdkSection;
