import { BottomNav } from '@/components/Layout/BottomNav';
import { HeroSection } from '@/components/Sections/HeroSection';
import { FrameworkSection } from '@/components/Sections/FrameworkSection';
import { ArgusSection } from '@/components/Sections/ArgusSection';
import { DocsSection } from '@/components/Sections/DocsSection';

/**
 * Interactive Page - Main landing page
 * Renders all core sections without API dependencies
 */
export default function InteractivePage() {
  return (
    <main className="w-full bg-[var(--primary-bg)] text-[var(--text-primary)] overflow-x-hidden">
      <HeroSection />
      <FrameworkSection />
      <ArgusSection />
      <DocsSection />
      <BottomNav />
    </main>
  );
}
