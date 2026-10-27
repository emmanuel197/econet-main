import React from "react";
import { Link, useLocation } from "react-router-dom";
import classNames from "../../utils/classNames";

import IconHome from "../../../assets/icons/search-mobile-nav-home.svg?react";
import IconLiveTv from "../../../assets/icons/home-mobile-nav-live-tv.svg?react";
import IconShorts from "../../../assets/icons/home-mobile-nav-shorts.svg?react";
import IconSearch from "../../../assets/icons/search-mobile-nav-search.svg?react";
import IconMore from "../../../assets/icons/home-mobile-nav-menu.svg?react";

const TABS = [
  { label: "Home", Icon: IconHome, to: "/home" },
  { label: "Live Tv", Icon: IconLiveTv, to: "/live" },
  { label: "Shorts", Icon: IconShorts, to: "/shorts" },
  { label: "Search", Icon: IconSearch, to: "/search" },
  // No dedicated "More" screen in the designs yet — it shows the homepage too, tagged with
  // ?nav=more so it (not Home) highlights when the user arrived via this tab.
  { label: "More", Icon: IconMore, to: "/home?nav=more" },
];

const isHome = (pathname) => pathname === "/home" || pathname === "/";

const isActive = (tab, pathname, isMoreView) => {
  if (tab.label === "More") return isHome(pathname) && isMoreView;
  if (tab.to === "/home") return isHome(pathname) && !isMoreView;
  return pathname === tab.to || pathname.startsWith(`${tab.to}/`);
};

/**
 * MobileBottomNav — floating pill tab bar (fixed, bottom-anchored, horizontally
 * centred, glass background). The active tab gets a lighter rounded highlight.
 * Sized against the 390 mobile comp via --mvw so it scales with phone width.
 * Rendered only below md (MainLayout swaps it in for the desktop Navbar).
 */
const MobileBottomNav = ({ className = "" }) => {
  const { pathname, search } = useLocation();
  const isMoreView = new URLSearchParams(search).get("nav") === "more";

  return (
    <nav
      className={classNames(
        "fixed inset-x-0 bottom-[calc(16/390*var(--mvw))] z-50 mx-auto flex w-[calc(352/390*var(--mvw))] items-stretch justify-between gap-[calc(4/390*var(--mvw))]",
        "rounded-full border border-gray-1/10 bg-black/60 p-[calc(6/390*var(--mvw))] shadow-2xl backdrop-blur-xl",
        className
      )}
    >
      {TABS.map((tab) => {
        const active = isActive(tab, pathname, isMoreView);
        return (
          <Link
            key={tab.label}
            to={tab.to}
            className={classNames(
              "flex flex-1 flex-col items-center justify-center gap-[calc(3/390*var(--mvw))] rounded-full py-[calc(8/390*var(--mvw))] transition-colors",
              active ? "bg-gray-1/10 text-brand" : "text-gray-1/75"
            )}
          >
            <tab.Icon aria-hidden="true" className="size-[calc(22/390*var(--mvw))]" />
            <span
              className={classNames(
                "font-primary text-[calc(10/390*var(--mvw))] leading-none",
                active && "font-semibold"
              )}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;
