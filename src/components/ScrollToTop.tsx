import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Scroll to the top on route change, or to the #anchor when the URL has one (e.g. /#products). */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Wait a frame so the target section has rendered; scroll-padding-top keeps it clear of the sticky nav.
      const raf = requestAnimationFrame(() => {
        document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
      });
      return () => cancelAnimationFrame(raf);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
