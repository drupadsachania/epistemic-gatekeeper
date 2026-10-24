/**
 * SiteFooter.tsx — surface band with wordmark, link columns and the licence line (trust is visible).
 */

import React from 'react';
import { Link } from 'react-router-dom';

const SiteFooter: React.FC = () => (
  <footer className="k-footer">
    <div className="k-container">
      <div className="k-footer__grid">
        <div>
          <p><span className="k-wordmark" style={{ fontSize: '1.375rem' }}>Kairos <em>Foundation</em></span></p>
          <p>
            Open research on epistemic control for AI systems that act: know when to act,
            and know when not to.
          </p>
        </div>

        <nav aria-label="Kairos">
          <h2>Kairos</h2>
          <ul>
            <li><Link to="/research">Research paper</Link></li>
            <li><Link to="/kairos/gates">Gates &amp; uncertainty</Link></li>
            <li><Link to="/kairos/decision-states">Decision states</Link></li>
            <li><Link to="/kairos/problem">Threat model</Link></li>
            <li><Link to="/adoption">Adoption guide</Link></li>
          </ul>
        </nav>

        <nav aria-label="Products">
          <h2>Products</h2>
          <ul>
            <li><Link to="/argus">Argus XDR &amp; SDK</Link></li>
            <li><a href="https://aegis-skills.vercel.app" target="_blank" rel="noopener noreferrer">Aegis</a></li>
            <li><a href="https://aegis-skills.vercel.app/themis" target="_blank" rel="noopener noreferrer">Themis</a></li>
            <li><Link to="/docs">Documentation</Link></li>
          </ul>
        </nav>

        <nav aria-label="Community">
          <h2>Community</h2>
          <ul>
            <li><a href="https://github.com/kairos-dev-kairos-ecl" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            <li><a href="https://github.com/kairos-dev-kairos-ecl/discussions" target="_blank" rel="noopener noreferrer">Discussions</a></li>
            <li><a href="https://discord.gg/W6PkgexUU" target="_blank" rel="noopener noreferrer">Discord</a></li>
            <li><Link to="/community">Contribute</Link></li>
          </ul>
        </nav>
      </div>

      <div className="k-footer__legal">
        <p>© 2026 Kairos Foundation · Argus XDR and Argus SDK: Apache-2.0 · Kairos specifications: see each repository</p>
        <p>Typefaces: teimer-web, legitima (Adobe Fonts) · Red Hat Mono (SIL OFL)</p>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
