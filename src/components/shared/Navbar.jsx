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
import IconUser from "../../../assets/icons/home-navbar-user.svg?react";
import IconSearch from "../../../assets/icons/home-navbar-search-01.svg?react";
import iconNotification from "../../../assets/icons/home-navbar-notification-bubble.svg";
import avatar from "../../../assets/images/home-navbar-avatar.webp";
import Button from "../ui/Button";

// WONA Figma nav bar (instance 4041:21741 in desktop home 4041:21538): six links
// centred between logo and the right cluster. The comp reuses the shorts glyph for
// Tv Channels and Movies, so IconShorts is intentional. Tv Channels → /tv-guide
// (the channel guide) is our mapping; the design doesn't name a route.
const NAV_ITEMS = [
  { label: "Home", Icon: IconHome, to: "/home" },
  { label: "Live Tv", Icon: IconLiveTv, to: "/live" },
  { label: "Shorts", Icon: IconShorts, to: "/shorts" },
  { label: "Tv Channels", Icon: IconShorts, to: "/tv-guide" },
  { label: "Movies", Icon: IconShorts, to: "/movies" },
  { label: "My stuff", Icon: IconUser, to: "/my-stuff" },
];

const isActive = (to, pathname) =>
  to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`);

// On auth screens the right side shows explicit Sign In / Sign Up buttons
// (no search / log-in icon / notifications).
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
 * Navbar — WONA Figma "Wona/Nav bar": full-width 98px glass bar (black/40 + blur),
 * logo left, links centred, right cluster = search, notification bubble, then the
 * 48px avatar (account dropdown) or a log-in icon when signed out. WONA has no
 * "Get Bundle" pill, so Subscriptions lives in the account dropdown.
 * isAuthenticatedUser honours VITE_BYPASS_AUTH.
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

  return (
    <nav
      ref={ref}
      className={classNames(
        "relative flex h-[calc(98/1728*var(--vw))] w-full items-center justify-between bg-black/40 px-[calc(53/1728*var(--vw))] backdrop-blur-[20px] font-primary",
        className
      )}
      {...props}
    >
      <Link to="/" aria-label="WONA home" className="shrink-0">
        <img src={logo} alt="WONA" className="h-[calc(28/1728*var(--vw))] w-auto object-contain" />
      </Link>

      {/* Links, centred on the bar (Figma "Frame 120", gap 36) */}
      <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-[calc(36/1728*var(--vw))]">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.to, pathname);
            const gated = item.to === "/my-stuff";
            return (
              <Link
                key={item.label}
                to={item.to}
                onClick={gated ? (e) => { e.preventDefault(); handleGatedNavigation(item.to); } : undefined}
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

      {/* Right cluster (Figma "Frame 94"): search + bell gap 10, then avatar */}
      <div className="relative flex items-center gap-[calc(10/1728*var(--vw))]">
        {isAuthRoute(pathname) ? (
          <>
            <Link to="/signin">
              <Button variant="secondary" size="md">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="md">Sign Up</Button>
            </Link>
          </>
        ) : (
        <>
        <Link to="/search" aria-label="Search" className={isActive("/search", pathname) ? "" : "opacity-90"}>
          <IconSearch
            aria-hidden="true"
            className={classNames("size-[calc(28/1728*var(--vw))]", isActive("/search", pathname) ? "text-brand" : "text-gray-1")}
          />
        </Link>

        <button
          type="button"
          aria-label={unreadCount ? `Notifications (${unreadCount} unread)` : "Notifications"}
          onClick={() => user_info && setShowNotifications((o) => !o)}
          className="relative flex size-[calc(48/1728*var(--vw))] cursor-pointer items-center justify-center rounded-full"
        >
          <img src={iconNotification} alt="" aria-hidden="true" className="size-[calc(28/1728*var(--vw))]" />
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

        <div className="ml-[calc(7/1728*var(--vw))]">
        {user_info ? (
          <>
            <button
              type="button"
              aria-label="Account menu"
              onClick={() => setShowAccountDropdown((open) => !open)}
              className="block size-[calc(48/1728*var(--vw))] cursor-pointer overflow-clip rounded-full bg-gray-1/20"
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
                    to="/subscriptions"
                    onClick={() => setShowAccountDropdown(false)}
                    className="block px-[calc(14/1728*var(--vw))] py-[calc(9/1728*var(--vw))] text-sm text-gray-1/90 hover:bg-gray-1/10"
                  >
                    Subscriptions
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
        </div>
        </>
        )}
      </div>
    </nav>
  );
});

Navbar.displayName = "Navbar";
export default Navbar;
