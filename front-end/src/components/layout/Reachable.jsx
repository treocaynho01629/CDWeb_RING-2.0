import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router';

const ScrollToTop = () => {
  const { pathname } = useLocation(); // Extracts pathname

  // Automatically scrolls to top whenever pathname changes
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
}

export default ScrollToTop;