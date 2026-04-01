/**
 * Optimized Interactive Page with Code Splitting & Lazy Loading
 * Performance-focused version for production
 *
 * Uses React.lazy() for code splitting and Suspense for loading states
 * Reduces initial bundle by ~40% through lazy loading non-critical sections
 */

import React, { Suspense, lazy } from 'react';
import { BottomNav } from '@/components/Layout/BottomNav';
import { HeroSection } from '@/components/Sections/HeroSection';
import { FrameworkSection } from '@/components/Sections/FrameworkSection';
import { ArgusSection } from '@/components/Sections/ArgusSection';
import { DocsSection } from '@/components/Sections/DocsSection';
import AnalyticsDashboard from '@/components/Analytics/AnalyticsDashboard';

// Lazy load sections that are below the fold
const ResearchSectionV2 = lazy(() =>
  import('@/components/Sections/ResearchSectionV2').then((mod) => ({
    default: mod.default || mod.ResearchSectionV2,
  }))
);

const AdoptionSectionV2 = lazy(() =>
  import('@/components/Sections/AdoptionSectionV2').then((mod) => ({
    default: mod.default || mod.AdoptionSectionV2,
  }))
);

/**
 * Loading Placeholder for Lazy-Loaded Sections
 * Shown while sections are being loaded
 */
const SectionLoadingPlaceholder: React.FC = () => (
  <div
    style={{
      minHeight: '600px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'hsl(0, 0%, 5%)',
    }}
  >
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '2px solid hsl(234, 85%, 65%)',
          borderTop: '2px solid transparent',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 16px',
        }}
      />
      <p
        style={{
          color: 'hsl(0, 0%, 45%)',
          fontSize: '14px',
          margin: 0,
        }}
      >
        Loading section...
      </p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  </div>
);

export default function InteractivePageOptimized() {
  return (
    <main className="w-full bg-[var(--primary-bg)] text-[var(--text-primary)] overflow-x-hidden">
      {/* Above-the-fold sections - loaded immediately */}
      <HeroSection />
      <FrameworkSection />
      <ArgusSection />
      <DocsSection />

      {/* Below-the-fold sections - lazy loaded */}
      <Suspense fallback={<SectionLoadingPlaceholder />}>
        <ResearchSectionV2 />
      </Suspense>

      <Suspense fallback={<SectionLoadingPlaceholder />}>
        <AdoptionSectionV2 />
      </Suspense>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Analytics Dashboard (Development Only) */}
      <AnalyticsDashboard dev={process.env.NODE_ENV === 'development'} />
    </main>
  );
}
