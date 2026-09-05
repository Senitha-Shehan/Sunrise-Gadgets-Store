import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop ensures that every time the route or page changes,
 * the window automatically scrolls to the top (position 0,0) before
 * the new page content is painted to the user.
 */
function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Prevent browser from trying to restore obsolete scroll positions on route changes
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView();
        return;
      }
    }

    // Temporarily disable smooth scrolling so scroll jump is instantaneous before repaint
    const originalScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    document.documentElement.style.scrollBehavior = originalScrollBehavior;
  }, [pathname, search, hash]);

  return null;
}

export default ScrollToTop;
