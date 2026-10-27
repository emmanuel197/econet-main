import React, { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import classNames from "../utils/classNames";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/ui/Footer";
import MobileTopBar from "../components/shared/MobileTopBar";
import MobileBottomNav from "../components/shared/MobileBottomNav";
import AmbientBackground from "../components/shared/AmbientBackground";

/**
 * `revealFooter` (only Shorts routes pass it, see App.jsx) implements the CSS
 * "reveal footer" trick: `main` gets a negative bottom margin equal to Footer's own
 * height (Footer.jsx's h-[calc(339/1728*var(--vw))]) plus a matching blank spacer at
 * its end, pulling Footer's flow position up underneath that spacer. Footer is then
 * `position: sticky` with top = (100vh - footerHeight), pinning its bottom to the
 * viewport bottom once scrolled that far — so it rides up over the tail of the
 * content instead of simply appearing below it.
 *
 * Responsive chrome: at md+ the desktop Navbar (top) + Footer render; below md they
 * are hidden and `mobileChrome` swaps in the MobileTopBar (top overlay) + floating
 * MobileBottomNav. Auth screens and the full-bleed Shorts player pass mobileChrome={false}.
 */
// Auto-hide nav: always visible at the top of the page; once scrolled down it
// shows while the user is actively scrolling and fades out ~1.5s after they stop.
const HIDE_DELAY_MS = 1500;
const TOP_THRESHOLD_PX = 40;

const useAutoHideNav = () => {
  const [visible, setVisible] = useState(true);
  // Past the top threshold — the mobile bar needs a backdrop there (it is
  // transparent by design and would be illegible over mid-page content).
  const [scrolled, setScrolled] = useState(false);
  const hideTimer = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setVisible(true);
      setScrolled(window.scrollY > TOP_THRESHOLD_PX);
      clearTimeout(hideTimer.current);
      if (window.scrollY > TOP_THRESHOLD_PX) {
        hideTimer.current = setTimeout(() => {
          if (window.scrollY > TOP_THRESHOLD_PX) setVisible(false);
        }, HIDE_DELAY_MS);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(hideTimer.current);
    };
  }, []);

  return { visible, scrolled };
};

const MainLayout = ({
  children,
  revealFooter = false,
  showFooter = true,
  showNavbar = true,
  mobileChrome = true,
  mobileTopBar = "app",
}) => {
  const reveal = revealFooter && showFooter;
  const { visible: navVisible, scrolled } = useAutoHideNav();
  return (
    <div className="min-h-screen flex flex-col bg-page font-primary">
      {/* Desktop: fixed pill nav, auto-hiding on scroll (md+ only).
          showNavbar={false}: full-bleed watch player — legacy watch.js had no
          header either, only the in-player Back button. */}
      {showNavbar && (
        <header
          className={classNames(
            "fixed inset-x-0 top-0 z-50 hidden transition-all duration-300 md:block",
            navVisible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0"
          )}
        >
          <Navbar />
        </header>
      )}

      {/* Mobile: transparent top overlay. "app" = logo row (home etc.); "status" pages
          (search/shorts/live) supply their own header, so no overlay is rendered. */}
      {/* Fixed + same auto-hide as desktop; transparent over the hero at the top,
          gradient backdrop once scrolled so the bar stays legible mid-page. */}
      {mobileChrome && mobileTopBar !== "status" && (
        <div
          className={classNames(
            "fixed inset-x-0 top-0 z-40 transition-all duration-300 md:hidden",
            navVisible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0",
            // Uniform glass band (no gradient tail); bottom padding mirrors
            // MobileTopBar's own 18px top reservation so the band is symmetric.
            scrolled && "bg-page/80 backdrop-blur-md pb-[max(calc(18/390*var(--mvw)),env(safe-area-inset-top))]"
          )}
        >
          <MobileTopBar variant="app" />
        </div>
      )}

      {/* `relative z-0` makes <main> its own stacking context, so the ambient blob
          field (absolute, -z-10, overflow-hidden — see AmbientBackground.jsx,
          ported from glotv-main's MainLayout) stays behind this page's content
          and can never bleed under the Footer's own glow. */}
      <main
        className={classNames(
          "relative z-0 flex-1",
          mobileChrome && "max-md:pb-[calc(110/390*var(--mvw))]",
          reveal && "md:-mb-[calc(339/1728*var(--vw))]"
        )}
      >
        <AmbientBackground />
        {children ?? <Outlet />}
        {reveal && <div className="hidden h-[calc(339/1728*var(--vw))] md:block" aria-hidden="true" />}
      </main>

      {showFooter && (
        <Footer
          className={classNames(
            "hidden md:block",
            reveal && "sticky top-[calc(100vh-calc(339/1728*var(--vw)))] z-10"
          )}
        />
      )}

      {/* Mobile: floating bottom tab bar (fixed, below md) */}
      {mobileChrome && <MobileBottomNav className="md:hidden" />}
    </div>
  );
};

export default MainLayout;
