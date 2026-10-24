/**
 * kairos.ts — React port of kairos-design-handoff/kairos.js:
 * theme toggle (light default, dark only on request, persisted), sticky-nav hairline, reveal on scroll.
 */

import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
const KEY = 'kairos-theme';

function currentTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

/** Theme state shared through the <html data-theme> attribute; storage can be blocked, so every access is guarded. */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() => (typeof document === 'undefined' ? 'light' : currentTheme()));

  useEffect(() => {
    const obs = new MutationObserver(() => setTheme(currentTheme()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
    if (next === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
    try { localStorage.setItem(KEY, next); } catch { /* storage blocked */ }
    setTheme(next);
  }, []);

  return [theme, toggle];
}

/** One passive scroll listener; true once the page has scrolled past 8 px. */
export function useScrolled(threshold = 8): boolean {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { setScrolled(window.scrollY > threshold); ticking = false; });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}

/**
 * Reveal [data-reveal] elements on scroll. Content is visible by default; only elements that start below the
 * fold are hidden, and only when IntersectionObserver exists and motion is allowed. Re-runs when `key` changes
 * (pass the route path so each page gets its own pass).
 */
export function useReveal(key: string): void {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    let cleanup = () => {};
    // Wait a frame so the new route has rendered.
    const raf = requestAnimationFrame(() => {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
      document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)').forEach((el) => {
        if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add('js-reveal'); io.observe(el); }
      });
      cleanup = () => io.disconnect();
    });
    return () => { cancelAnimationFrame(raf); cleanup(); };
  }, [key]);
}
