/**
 * EclipseFooter.tsx — Prism design colophon footer.
 * Logo + wordmark, 4-column link grid, live UTC clock + status indicator.
 * All light Prism tokens — no dark surfaces.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Github, MessageCircle, Radio, MessageSquare } from 'lucide-react';

const EclipseFooter: React.FC = () => {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const fmt = time.toISOString().replace('T', ' · ').replace(/\..+/, ' UTC');

  return (
    <footer className="ft">
      <style>{`
        .ft {
          position: relative;
          padding: 80px 0 36px;
          border-top: 1px solid var(--hairline);
          background:
            radial-gradient(ellipse 80vw 40vh at 50% 100%, rgba(67,56,202,0.06), transparent 65%);
        }
        .ft-logo {
          display: flex;
          align-items: center;
          gap: 20px;
          margin: 0 0 56px;
        }
        .ft-logo-text {
          font-family: var(--f-mono);
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.18em;
          color: var(--ink-3);
          padding-left: 20px;
          border-left: 1px solid var(--hairline-strong);
        }
        .ft-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 32px;
          padding-top: 36px;
          border-top: 1px solid var(--hairline);
        }
        @media (max-width: 880px) {
          .ft-grid { grid-template-columns: 1fr 1fr; }
        }
        .ft-col h5 {
          font-family: var(--f-mono);
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin: 0 0 14px;
          font-weight: 500;
        }
        .ft-col ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 9px;
          font-family: var(--f-sans);
          font-size: 13px;
        }
        .ft-col a {
          color: var(--ink-1);
          text-decoration: none;
          transition: color 0.15s;
        }
        .ft-col a:hover { color: var(--indigo); }
        .ft-col p {
          color: var(--ink-2);
          font-size: 13.5px;
          line-height: 1.6;
          margin: 0 0 14px;
          max-width: 320px;
          text-wrap: pretty;
        }
        .ft-bot {
          margin-top: 56px;
          padding-top: 20px;
          border-top: 1px solid var(--hairline);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          font-family: var(--f-mono);
          font-size: 11px;
          color: var(--ink-3);
          letter-spacing: 0.04em;
          flex-wrap: wrap;
        }
        .ft-bot .status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--indigo);
        }
        .ft-bot .status .pulse {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--indigo);
          box-shadow: 0 0 0 3px rgba(67,56,202,0.20);
          animation: pulse-soft 2s ease-in-out infinite;
        }
      `}</style>

      <div className="wrap">
        <div className="ft-logo">
          <img
            src="/kairos-logo.png"
            alt="Kairos Foundation"
            style={{ height: 64, width: 'auto', opacity: 0.9 }}
          />
          <div className="ft-logo-text">KAIROS FOUNDATION</div>
        </div>

        <div className="ft-grid">
          <div className="ft-col">
            <h5>// the foundation</h5>
            <p>
              An open research foundation for epistemic control and reasoning observability
              in autonomous AI systems. Supported by independent grants.
            </p>
            <p style={{ color: 'var(--ink-3)', fontSize: 11, fontFamily: 'var(--f-mono)', letterSpacing: '0.04em' } as React.CSSProperties}>
              kairos-foundation.org
            </p>
          </div>

          <div className="ft-col">
            <h5>// pillars</h5>
            <ul>
              <li><a href="/#kairos">Kairos</a></li>
              <li><a href="/#argus-xdr">Argus XDR</a></li>
              <li><a href="/#argus-sdk">Argus SDK</a></li>
              <li><Link to="/docs">Documentation</Link></li>
            </ul>
          </div>

          <div className="ft-col">
            <h5>// research</h5>
            <ul>
              <li><Link to="/research">Research paper</Link></li>
              <li><Link to="/research">Signal taxonomy</Link></li>
              <li><Link to="/research">Field notes</Link></li>
              <li><Link to="/research">Open questions</Link></li>
            </ul>
          </div>

          <div className="ft-col">
            <h5>// connect</h5>
            <ul>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Github size={14} style={{ flexShrink: 0, color: 'var(--ink-3)' }} />
                <a href="https://github.com/kairos-dev-kairos-ecl" target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageCircle size={14} style={{ flexShrink: 0, color: 'var(--ink-3)' }} />
                <a href="https://discord.gg/kairos" target="_blank" rel="noreferrer">
                  Discord
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Radio size={14} style={{ flexShrink: 0, color: 'var(--ink-3)' }} />
                <a href="https://reddit.com/r/kairos" target="_blank" rel="noreferrer">
                  Reddit
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageSquare size={14} style={{ flexShrink: 0, color: 'var(--ink-3)' }} />
                <a href="https://github.com/kairos-dev-kairos-ecl/discussions" target="_blank" rel="noreferrer">
                  Discussions
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="ft-bot">
          <span>© 2026 KAIROS FOUNDATION · APACHE 2.0</span>
          <span className="status">
            <span className="pulse" />
            ALL SYSTEMS OPERATIONAL
          </span>
          <span>{fmt}</span>
        </div>
      </div>
    </footer>
  );
};

export default EclipseFooter;
