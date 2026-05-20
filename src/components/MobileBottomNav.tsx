/**
 * MobileBottomNav.tsx — Fixed glassmorphic bottom navigation for mobile.
 * Only renders on screens ≤ 768px (CSS handles visibility).
 * Active state is derived from the current pathname:
 *   Home      → /
 *   Docs      → /docs, /kairos/*, /argus-xdr/*, /argus-sdk/*
 *   Research  → /research
 *   Community → /community, /adoption
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/mobile-nav.css';

/* ── ICONS ───────────────────────────────────────────────────────────────── */

const HomeIcon = ({ filled }: { filled: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    {filled ? (
      <>
        <path d="M11 2.5L2.5 9.5V19.5H8.5V14H13.5V19.5H19.5V9.5L11 2.5Z" fill="currentColor" />
        <path d="M11 2.5L2.5 9.5V19.5H8.5V14H13.5V19.5H19.5V9.5L11 2.5Z" fill="currentColor" />
      </>
    ) : (
      <path
        d="M11 2.5L2.5 9.5V19.5H8.5V13.5H13.5V19.5H19.5V9.5L11 2.5Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"
      />
    )}
  </svg>
);

const DocsIcon = ({ filled }: { filled: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    {filled ? (
      <path
        d="M5 3H14L18 7V19H5V3Z M14 3V7H18"
        fill="currentColor" opacity="0.15"
      />
    ) : null}
    <path
      d="M5 3H14L18 7V19H5V3Z"
      stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"
      fill={filled ? 'rgba(67,56,202,0.10)' : 'none'}
    />
    <path d="M14 3V7H18" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    <line x1="8" y1="11" x2="15" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="8" y1="14.5" x2="13" y2="14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ResearchIcon = ({ filled }: { filled: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <circle
      cx="10" cy="10" r="6"
      stroke="currentColor" strokeWidth="1.5"
      fill={filled ? 'rgba(67,56,202,0.10)' : 'none'}
    />
    <line x1="14.5" y1="14.5" x2="19" y2="19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    {filled && (
      <line x1="7.5" y1="10" x2="12.5" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    )}
    {!filled && (
      <>
        <line x1="7.5" y1="10" x2="12.5" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="10" y1="7.5" x2="10" y2="12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    )}
  </svg>
);

const CommunityIcon = ({ filled }: { filled: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" fill={filled ? 'rgba(67,56,202,0.12)' : 'none'} />
    <circle cx="15" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.4" fill={filled ? 'rgba(67,56,202,0.08)' : 'none'} />
    <path d="M2 18C2 15.2386 4.68629 13 8 13C11.3137 13 14 15.2386 14 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M15 12C17.2091 12 19 13.567 19 15.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

/* ── NAV ITEMS ───────────────────────────────────────────────────────────── */

interface NavItem {
  to: string;
  label: string;
  Icon: React.FC<{ filled: boolean }>;
  isActive: (pathname: string) => boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    to: '/',
    label: 'Home',
    Icon: HomeIcon,
    isActive: (p) => p === '/',
  },
  {
    to: '/docs',
    label: 'Docs',
    Icon: DocsIcon,
    isActive: (p) =>
      p.startsWith('/docs') ||
      p.startsWith('/kairos') ||
      p.startsWith('/argus'),
  },
  {
    to: '/research',
    label: 'Research',
    Icon: ResearchIcon,
    isActive: (p) => p === '/research',
  },
  {
    to: '/community',
    label: 'Community',
    Icon: CommunityIcon,
    isActive: (p) => p === '/community' || p === '/adoption',
  },
];

/* ── COMPONENT ───────────────────────────────────────────────────────────── */

const MobileBottomNav: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {NAV_ITEMS.map(({ to, label, Icon, isActive }) => {
        const active = isActive(pathname);
        return (
          <Link
            key={to}
            to={to}
            className={`mobile-nav-item${active ? ' active' : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            <span className="mobile-nav-icon">
              <Icon filled={active} />
            </span>
            <span className="mobile-nav-label">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;
