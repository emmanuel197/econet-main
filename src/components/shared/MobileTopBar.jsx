import React from "react";
import { Link, useNavigate } from "react-router-dom";
import classNames from "../../utils/classNames";
import MobileNavActions from "./MobileNavActions";

import logo from "../../../assets/logos/wona-logo.svg";
import iconNotification from "../../../assets/icons/home-navbar-notification-bubble.svg";
import iconBack from "../../../assets/icons/shorts-play-back-arrow-back-arrow.svg";

/**
 * MobileTopBar — transparent overlay bar at the top of mobile app pages.
 *  - "app"    : logo (left) + the shared [[MobileNavActions]] cluster (right). Homepage etc.
 *  - "feed"   : AfriShorts title + Get Bundle / notification. Shorts feed.
 *  - "player" : back / title / more. Shorts player.
 * Sized against the 390 mobile comp via --mvw.
 *
 * The right-hand cluster lives in MobileNavActions so pages with their own mobile header
 * (Shorts feed, Live TV) share the identical working controls.
 */
const MobileTopBar = ({ variant = "app", title = "AfriShorts", onBack, onMore, className = "" }) => {
  const navigate = useNavigate();

  if (variant === "app") {
    // The comp reserves 60px for a DRAWN status bar, but in a browser the OS /
    // browser chrome already sits above the viewport — that reservation rendered
    // as dead space. Reserve only the device safe-area (notch, when installed as
    // a PWA) with a small breathing-room floor.
    return (
      <header
        className={classNames("relative z-10 flex flex-col", className)}
        style={{ paddingTop: "max(calc(14/390*var(--mvw)), env(safe-area-inset-top))" }}
      >
        <div className="flex h-[calc(32/390*var(--mvw))] items-center justify-between px-[calc(20/390*var(--mvw))]">
          {/* Figma logo frame is 84×32 (object-fill continues the wordmark's wide treatment,
             matching the old scale-x-2 look); left edge sits at the row padding. */}
          <Link to="/" aria-label="WONA home" className="shrink-0">
            <img src={logo} alt="WONA" className="h-[calc(20/390*var(--mvw))] w-auto object-contain" />
          </Link>

          <MobileNavActions />
        </div>
      </header>
    );
  }

  if (variant === "player") {
    return (
      <header
        className={classNames(
          "relative z-10 flex h-14 items-center justify-between px-4",
          className
        )}
      >
        <button
          type="button"
          onClick={onBack ?? (() => navigate(-1))}
          aria-label="Back"
          className="flex size-9 items-center justify-center rounded-full bg-gray-1/10 border border-brand/50 cursor-pointer"
        >
          <img src={iconBack} alt="" aria-hidden="true" className="size-4" />
        </button>

        <span className="font-primary font-semibold text-base text-brand">{title}</span>

        <button
          type="button"
          onClick={onMore}
          aria-label="More"
          className="flex size-9 items-center justify-center rounded-full bg-gray-1/10 cursor-pointer"
        >
          <svg viewBox="0 0 24 24" className="size-5 text-gray-1" fill="currentColor" aria-hidden="true">
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
        </button>
      </header>
    );
  }

  // variant === "feed"
  return (
    <header
      className={classNames(
        "relative z-10 flex h-14 items-center justify-between px-4",
        className
      )}
    >
      <Link to="/shorts" className="font-primary font-semibold text-xl text-brand">
        {title}
      </Link>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-8 items-center justify-center rounded-full border border-brand/70 px-4 cursor-pointer"
        >
          <span className="font-primary font-medium text-xs text-brand leading-none">Get Bundle</span>
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="flex size-8 items-center justify-center rounded-full bg-gray-1/10 cursor-pointer"
        >
          <img src={iconNotification} alt="" aria-hidden="true" className="size-4" />
        </button>
      </div>
    </header>
  );
};

export default MobileTopBar;
