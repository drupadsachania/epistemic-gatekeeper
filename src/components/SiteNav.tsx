/**
 * SiteNav.tsx — Kairos design language top bar (kairos-design-handoff §7).
 * Sticky 64 px translucent paper, hairline after 8 px of scroll, text wordmark, mono links,
 * theme toggle. Below 768 px: a 44 px menu button opening a full-width sheet that traps focus,
 * closes on Escape and makes the page behind inert.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useScrolled, useTheme } from '@/lib/kairos';

interface NavItem { to: string; label: string; match: (path: string, hash: string) => boolean }

const NAV_ITEMS: NavItem[] = [
  { to: '/research',     label: 'Research',  match: (p) => p === '/research' },
  { to: '/kairos/gates', label: 'Framework', match: (p) => p.startsWith('/kairos') || p === '/adoption' },
  { to: '/#products',    label: 'Products',  match: (p, h) => (p === '/' && h === '#products') || p.startsWith('/argus') },
  { to: '/docs',         label: 'Docs',      match: (p) => p.startsWith('/docs') },
  { to: '/community',    label: 'Community', match: (p) => p === '/community' },
];

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);
const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const ThemeToggle: React.FC = () => {
  const [theme, toggle] = useTheme();
  const dark = theme === 'dark';
  return (
    <button className="k-theme-toggle" type="button" aria-pressed={dark} aria-label="Dark theme" onClick={toggle}>
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};

const Wordmark: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <Link className="k-wordmark" to="/" onClick={onClick}>Kairos <em>Foundation</em></Link>
);

const SiteNav: React.FC = () => {
  const { pathname, hash } = useLocation();
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  // Close the sheet on navigation.
  useEffect(() => { setOpen(false); }, [pathname, hash]);

  // While open: page behind is inert, focus is trapped, Escape closes, focus returns to the menu button.
  useEffect(() => {
    if (!open) return;
    const behind = [document.getElementById('main'), document.querySelector<HTMLElement>('.k-footer')]
      .filter((el): el is HTMLElement => !!el);
    behind.forEach((el) => el.setAttribute('inert', ''));
    document.body.style.overflow = 'hidden';
    const btn = menuBtnRef.current;

    const focusables = () => Array.from(
      sheetRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [],
    );
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); return; }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      behind.forEach((el) => el.removeAttribute('inert'));
      document.body.style.overflow = '';
      btn?.focus();
    };
  }, [open]);

  return (
    <>
      <a className="k-skip" href="#main">Skip to content</a>
      <header className="k-nav" data-scrolled={scrolled ? 'true' : 'false'}>
        <div className="k-container k-nav__inner">
          <Wordmark />
          <ul className="k-nav__links">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} aria-current={item.match(pathname, hash) ? 'page' : undefined}>{item.label}</Link>
              </li>
            ))}
          </ul>
          <div className="k-nav__actions">
            <ThemeToggle />
          </div>
          <button
            ref={menuBtnRef}
            className="k-menu-btn"
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="k-sheet"
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </button>
        </div>
      </header>

      {open && (
        <>
          <div className="k-sheet-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="k-sheet" id="k-sheet" ref={sheetRef} role="dialog" aria-modal="true" aria-label="Site menu">
            <div className="k-sheet__head">
              <Wordmark onClick={() => setOpen(false)} />
              <button className="k-menu-btn" style={{ display: 'inline-grid' }} type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            <ul>
              <li><Link className="k-sheet__link" to="/" aria-current={pathname === '/' && !hash ? 'page' : undefined}>Home</Link></li>
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <Link className="k-sheet__link" to={item.to} aria-current={item.match(pathname, hash) ? 'page' : undefined}>{item.label}</Link>
                </li>
              ))}
            </ul>
            <div className="k-sheet__foot">
              <span>Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SiteNav;
