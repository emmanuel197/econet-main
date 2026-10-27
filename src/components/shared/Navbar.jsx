import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import classNames from "../../utils/classNames";
import { isAuthenticatedUser } from "../../utils/authConstants";
import { logout } from "../../api/account";
import { useHandleNavigation } from "../../utils/navigationHelpers";
import { fetchInbox } from "../../api/inbox";
import { selectInboxUnreadCount } from "../../store/slice/inboxSlice";
import NotificationsPanel from "./NotificationsPanel";

// Nav/search icons import as SVGR components (?react) so their stroke follows
// currentColor; the notification bubble keeps its own red dot, so it stays an <img>.
import logo from "../../../assets/logos/wona-logo.svg";
import IconHome from "../../../assets/icons/home-navbar-home-01.svg?react";
import IconLiveTv from "../../../assets/icons/home-navbar-live-streaming-03.svg?react";
import IconShorts from "../../../assets/icons/home-navbar-shorts.svg?react";
import IconSearch from "../../../assets/icons/home-navbar-search-01.svg?react";
import iconNotification from "../../../assets/icons/home-navbar-notification-bubble.svg";
import avatar from "../../../assets/images/home-navbar-avatar.webp";
import Button from "../ui/Button";

// Figma 2659:955 (updated nav): links sit LEFT beside the logo; Movies reuses
// the shorts glyph in the comp, so IconShorts is intentional here.
// "Tv Channels" dropped 2026-07-21 (redundant with Live Tv — UI-improvement ticket).
const NAV_ITEMS = [
  { label: "Home", Icon: IconHome, to: "/home" },
  { label: "Live Tv", Icon: IconLiveTv, to: "/live" },
  { label: "Movies", Icon: IconShorts, to: "/movies" },
  { label: "Shorts", Icon: IconShorts, to: "/shorts" },
];

const isActive = (to, pathname) =>
  to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`);

// On auth screens the right side mirrors legacy Header: explicit Sign In / Sign Up
// buttons + Get Bundle (no search / log-in icon / notifications).
const AUTH_ROUTES = ["/signin", "/signup", "/select-network", "/otp-verification", "/reset-password", "/out-of-region"];
const isAuthRoute = (pathname) => AUTH_ROUTES.some((r) => pathname.startsWith(r));

// lucide:log-in (Figma 2659:647) — inlined so the stroke follows currentColor.
const IconLogIn = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);

/**
 * Navbar — Figma 2659:955 (updated design): floating full-rounded pill on black/40,
 * logo + nav links grouped left, right cluster = search, auth slot (log-in icon when
 * signed out / avatar + account dropdown when signed in), "Get Bundle" pill, and the
 * notification bubble in a 48px circle. isAuthenticatedUser honours VITE_BYPASS_AUTH.
 */
const Navbar = React.forwardRef(({ className, ...props }, ref) => {
  const { pathname } = useLocation();
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const user_info = isAuthenticatedUser(); // per render; honours VITE_BYPASS_AUTH dev flag
  const handleGatedNavigation = useHandleNavigation(); // authed → page; else → /signin (remembers destination)

  // CRM inbox: fetch once per mount when signed in; unread count badges the bell.
  const unreadCount = useSelector(selectInboxUnreadCount);
  useEffect(() => {
    if (user_info) fetchInbox();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getBundlePill = (
    <button
      type="button"
      onClick={() => handleGatedNavigation("/subscriptions")}
      className="flex cursor-pointer items-center justify-center rounded-full border border-brand/40 bg-[rgba(218,19,117,0.6)] px-[calc(18.5/1728*var(--vw))] py-[calc(10/1728*var(--vw))]"
    >
      <span className="text-[calc(18/1728*var(--vw))] font-medium leading-[calc(22/1728*var(--vw))] tracking-[-0.408px] text-gray-1/70">
        Get Bundle
      </span>
    </button>
  );

  return (
    <nav
      ref={ref}
      className={classNames(
        "mx-auto mt-[calc(16/1728*var(--vw))] flex w-[calc(1565/1728*var(--vw))] items-center justify-between rounded-full bg-black/40 px-[calc(53/1728*var(--vw))] py-[calc(16/1728*var(--vw))] backdrop-blur-[20px] font-primary ",
        className
      )}
      {...props}
    >
      {/* Left: logo + nav links (Figma 2659:616, gap 43) */}
      <div className="flex items-center gap-[calc(43/1728*var(--vw))]">
        <Link to="/" aria-label="WONA home" className="shrink-0">
          <img src={logo} alt="WONA" className="h-[calc(28/1728*var(--vw))] w-auto object-contain" />
        </Link>

        <div className="flex items-center gap-[calc(36/1728*var(--vw))]">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.to, pathname);
            return (
              <Link
                key={item.label}
                to={item.to}
                className={classNames(
                  "flex h-[calc(49/1728*var(--vw))] items-center justify-center gap-[calc(5/1728*var(--vw))] rounded-full",
                  active ? "" : "opacity-90"
                )}
              >
                <item.Icon
                  aria-hidden="true"
                  className={classNames("size-[calc(24/1728*var(--vw))]", active ? "text-brand" : "text-gray-1")}
                />
                <span
                  className={classNames(
                    "text-[calc(15/1728*var(--vw))] leading-[calc(22/1728*var(--vw))] tracking-[-0.5px]",
                    active ? "font-semibold text-brand" : "text-gray-1"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Right cluster (Figma 2659:639, gap 16) */}
      <div className="relative flex items-center gap-[calc(16/1728*var(--vw))] py-[calc(2/1728*var(--vw))]">
        {isAuthRoute(pathname) ? (
          <>
            <Link to="/signin">
              <Button variant="secondary" size="md">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="md">Sign Up</Button>
            </Link>
            {getBundlePill}
          </>
        ) : (
        <>
        <Link to="/search" aria-label="Search" className={isActive("/search", pathname) ? "" : "opacity-90"}>
          <IconSearch
            aria-hidden="true"
            className={classNames("size-[calc(24/1728*var(--vw))]", isActive("/search", pathname) ? "text-brand" : "text-gray-1")}
          />
        </Link>

        {user_info ? (
          <>
            <button
              type="button"
              aria-label="Account menu"
              onClick={() => setShowAccountDropdown((open) => !open)}
              className="size-[calc(36/1728*var(--vw))] cursor-pointer overflow-clip rounded-full bg-gray-1/20"
            >
              <img src={avatar} alt="Profile" className="size-full object-cover" />
            </button>
            {showAccountDropdown && (
              <>
                {/* Click-outside catcher */}
                <button
                  type="button"
                  aria-label="Close account menu"
                  onClick={() => setShowAccountDropdown(false)}
                  className="fixed inset-0 z-40 cursor-default"
                />
                {/* Compact glass menu anchored to the avatar: identity header +
                    flat menu rows; Log Out is a quiet destructive row, not a
                    filled CTA button. */}
                <div className="absolute right-0 top-[calc(56/1728*var(--vw))] z-50 w-[calc(232/1728*var(--vw))] overflow-clip rounded-2xl border border-gray-1/10 bg-black/70 shadow-2xl backdrop-blur-2xl">
                  <div className="flex items-center gap-[calc(10/1728*var(--vw))] px-[calc(14/1728*var(--vw))] py-[calc(12/1728*var(--vw))]">
                    <img src={avatar} alt="" className="size-[calc(32/1728*var(--vw))] rounded-full object-cover" />
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-semibold text-gray-1">My Account</span>
                      <span className="truncate text-xs text-gray-1/50">
                        {window.localStorage.getItem("afri_mobile_number") || ""}
                      </span>
                    </div>
                  </div>
                  <div className="h-px bg-gray-1/10" />
                  <Link
                    to="/profile"
                    onClick={() => setShowAccountDropdown(false)}
                    className="block px-[calc(14/1728*var(--vw))] py-[calc(9/1728*var(--vw))] text-sm text-gray-1/90 hover:bg-gray-1/10"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/my-stuff"
                    onClick={() => setShowAccountDropdown(false)}
                    className="block px-[calc(14/1728*var(--vw))] py-[calc(9/1728*var(--vw))] text-sm text-gray-1/90 hover:bg-gray-1/10"
                  >
                    My Stuff
                  </Link>
                  <Link
                    to="/subscription-history"
                    onClick={() => setShowAccountDropdown(false)}
                    className="block px-[calc(14/1728*var(--vw))] py-[calc(9/1728*var(--vw))] text-sm text-gray-1/90 hover:bg-gray-1/10"
                  >
                    Subscription History
                  </Link>
                  <div className="h-px bg-gray-1/10" />
                  <button
                    type="button"
                    onClick={() => logout()}
                    className="block w-full cursor-pointer px-[calc(14/1728*var(--vw))] py-[calc(9/1728*var(--vw))] text-left text-sm text-error-8 hover:bg-error-8/10"
                  >
                    Log Out
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <Link to="/signin" aria-label="Sign in" className="opacity-90">
            <IconLogIn aria-hidden="true" className="size-[calc(24/1728*var(--vw))] text-gray-1" />
          </Link>
        )}

        {/* Get Bundle pill (Figma 2659:649) — authed → /subscriptions, else → /signin */}
        {getBundlePill}

        <button
          type="button"
          aria-label={unreadCount ? `Notifications (${unreadCount} unread)` : "Notifications"}
          onClick={() => user_info && setShowNotifications((o) => !o)}
          className="relative flex size-[calc(48/1728*var(--vw))] cursor-pointer items-center justify-center rounded-full bg-gray-1/20"
        >
          <img src={iconNotification} alt="" aria-hidden="true" className="size-[calc(18/1728*var(--vw))]" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex min-w-[18px] items-center justify-center rounded-full bg-error-8 px-1 text-[11px] font-semibold leading-[18px] text-gray-1">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
        {showNotifications && (
          <NotificationsPanel
            onClose={() => setShowNotifications(false)}
            className="right-0 top-[calc(64/1728*var(--vw))]"
          />
        )}
        </>
        )}
      </div>
    </nav>
  );
});

Navbar.displayName = "Navbar";
export default Navbar;
