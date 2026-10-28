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
  // "More" also covers the screens it opens (My Stuff, My Library)
  { label: "More", Icon: IconMore, to: "/more", also: ["/my-stuff", "/library"] },
];

const isActive = (tab, pathname) => {
  if (tab.to === "/home") return pathname === "/home" || pathname === "/";
  return [tab.to, ...(tab.also || [])].some((p) => pathname === p || pathname.startsWith(`${p}/`));
};

/**
 * MobileBottomNav — WONA Figma "Frame 171" (mobile home 4041:1518): 348×66 floating
 * pill, white/10 frosted glass, five tabs (20px icon over 11px label, gap 4); the
 * active tab is pink + semibold, the rest white at 90%.
 * Sized against the 390 mobile comp via --mvw so it scales with phone width.
 * Rendered only below md (MainLayout swaps it in for the desktop Navbar).
 */
const MobileBottomNav = ({ className = "" }) => {
  const { pathname } = useLocation();

  return (
    <nav
      className={classNames(
        "fixed inset-x-0 bottom-[calc(16/390*var(--mvw))] z-50 mx-auto flex h-[calc(66/390*var(--mvw))] w-[calc(348/390*var(--mvw))] items-center justify-between gap-[calc(12/390*var(--mvw))]",
        "rounded-full bg-gray-1/10 px-[calc(14/390*var(--mvw))] backdrop-blur-xl",
        className
      )}
    >
      {TABS.map((tab) => {
        const active = isActive(tab, pathname);
        return (
          <Link
            key={tab.label}
            to={tab.to}
            className={classNames(
              "flex flex-1 flex-col items-center justify-center gap-[calc(4/390*var(--mvw))] transition-colors",
              active ? "text-brand" : "text-gray-1/90"
            )}
          >
            <tab.Icon aria-hidden="true" className="size-[calc(20/390*var(--mvw))]" />
            <span
              className={classNames(
                "font-primary text-[calc(11/390*var(--mvw))] leading-[calc(13/390*var(--mvw))]",
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
