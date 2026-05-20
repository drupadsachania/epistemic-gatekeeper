/**
 * Layout.tsx — Prism design shell.
 * PrismBackground (z-index 0, multiply blend) + EclipseNav + Outlet.
 * EclipseFooter is rendered per-page so sections can sit above it.
 */

import { Outlet } from 'react-router-dom';
import EclipseNav from './EclipseNav';
import PrismBackground from './PrismBackground';
import MobileBottomNav from './MobileBottomNav';

const Layout = () => (
  <>
    {/* Fixed prism beam canvas — behind all content, multiply blend */}
    <PrismBackground />

    {/* All visible content: nav + pages + footer */}
    <div className="shell">
      <EclipseNav />
      <main>
        <Outlet />
      </main>
    </div>

    {/* Fixed bottom nav — mobile only, rendered outside .shell so z-index is clean */}
    <MobileBottomNav />
  </>
);

export default Layout;
