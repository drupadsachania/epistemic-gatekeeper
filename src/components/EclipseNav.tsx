/**
 * EclipseNav.tsx — Epistemic Prism navigation.
 * Light frosted-glass bar, kairos-logo.png brand, indigo CTA.
 */

import React from 'react';
import { Link } from 'react-router-dom';

const EclipseNav: React.FC = () => (
  <nav className="nav">
    <div className="wrap nav-inner">
      {/* Brand */}
      <Link to="/" className="nav-brand">
        <img
          src="/kairos-logo.png"
          alt="Kairos"
          style={{ height: 32, width: 'auto', display: 'block' }}
        />
        <span className="tag">FOUNDATION</span>
      </Link>

      {/* Section links */}
      <div className="nav-links">
        <a href="/#kairos">Kairos</a>
        <a href="/#argus-xdr">Argus XDR</a>
        <a href="/#argus-sdk">Argus SDK</a>
        <Link to="/docs">Documentation</Link>
      </div>

      {/* CTA */}
      <a
        className="nav-cta"
        href="/#argus-sdk"
      >
        Initialize Argus
        <span style={{ fontSize: 16, lineHeight: 1 }}>→</span>
      </a>
    </div>
  </nav>
);

export default EclipseNav;
