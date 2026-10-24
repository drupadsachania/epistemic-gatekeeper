/**
 * Layout.tsx — Kairos design language shell: skip link + sticky nav, main, footer band.
 * Reveal-on-scroll runs once per route.
 */

import { Outlet, useLocation } from 'react-router-dom';
import SiteNav from './SiteNav';
import SiteFooter from './SiteFooter';
import { useReveal } from '@/lib/kairos';

const Layout = () => {
  const { pathname } = useLocation();
  useReveal(pathname);

  return (
    <>
      <SiteNav />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
};

export default Layout;
