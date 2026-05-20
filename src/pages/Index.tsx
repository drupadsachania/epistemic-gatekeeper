/**
 * Index.tsx — Eclipse homepage.
 * EclipseHero → KairosSection → ArgusXdrSection → ArgusSdkSection → EclipseFooter
 */

import React from 'react';
import EclipseHero from '../components/EclipseHero';
import KairosSection from '../components/KairosSection';
import ArgusXdrSection from '../components/ArgusXdrSection';
import ArgusSdkSection from '../components/ArgusSdkSection';
import EclipseFooter from '../components/EclipseFooter';

const Index: React.FC = () => (
  <>
    <EclipseHero />
    <KairosSection />
    <ArgusXdrSection />
    <ArgusSdkSection />
    <EclipseFooter />
  </>
);

export default Index;
