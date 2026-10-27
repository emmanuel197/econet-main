import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router keeps the scroll position across SPA navigations, so without
// this a user scrolled deep into one page lands mid-page on the next. Keyed on
// pathname only — query changes (e.g. Live TV's ?category=…) keep the scroll.
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default ScrollToTop;
