/**
 * Argus.tsx — the Argus family page (peacock teal scope): Argus XDR and Argus SDK.
 */

import React from 'react';
import ArgusXdrSection from '../components/ArgusXdrSection';
import ArgusSdkSection from '../components/ArgusSdkSection';
import ArgusMark from '../components/brand/ArgusMark';
import '../styles/argus.css';

const Argus: React.FC = () => (
  <div className="k-scope-argus">
    <section className="k-section">
      <div className="k-container k-head">
        <ArgusMark size={104} title="Argus mark" className="k-page-mark" />
        <span className="k-eyebrow k-accent-argus">Products · Argus</span>
        <h1>Argus, <em>the hundred-eyed watchman</em></h1>
        <p className="k-myth">
          Argus Panoptes never closed all his eyes at once. When he fell, Hera set them in the peacock's tail.
        </p>
        <p className="k-lede">
          Two observability projects for LLM systems. Argus XDR captures and correlates signals across every
          layer of an LLM stack. Argus SDK is an endpoint agent that shows which AI services your machines talk to.
        </p>
        <div className="k-row">
          <a className="k-btn k-btn--argus" href="#argus-xdr">Argus XDR <span className="k-arrow" aria-hidden="true">→</span></a>
          <a className="k-btn k-btn--secondary" href="#argus-sdk">Argus SDK</a>
        </div>
      </div>
    </section>
    <ArgusXdrSection />
    <ArgusSdkSection />
  </div>
);

export default Argus;
