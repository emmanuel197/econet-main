import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classNames from "../../utils/classNames";
import { fetchInbox } from "../../api/inbox";
import { selectInboxUnreadCount } from "../../store/slice/inboxSlice";
import { useSelector } from "react-redux";
import NotificationsPanel from "./NotificationsPanel";
import { isAuthenticatedUser } from "../../utils/authConstants";
import { logout } from "../../api/account";

import avatar from "../../../assets/images/home-navbar-avatar.webp";
import iconNotification from "../../../assets/icons/home-navbar-notification-bubble.svg";

// lucide:log-in — matches the desktop navbar's signed-out affordance.
const IconLogIn = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);

const menuItem =
  "block px-[calc(16/390*var(--mvw))] py-[calc(12/390*var(--mvw))] font-primary text-[calc(14/390*var(--mvw))] text-gray-1/90 hover:bg-gray-1/10";

/**
 * MobileNavActions — the mobile top bar's right-hand cluster: Get Bundle pill, the CRM
 * notification bell (unread badge + NotificationsPanel) and the avatar + account menu;
 * signed-out collapses to a log-in link, mirroring the desktop Navbar.
 *
 * Extracted from MobileTopBar so pages that render their OWN mobile header (the Shorts
 * feed's "AfriShorts" title, Live TV's "Afriplay Live Tv" title) get the identical,
 * working controls instead of hand-rolled dead buttons — that inconsistency was the bug:
 * those headers had a bell with no handler and no account menu at all.
 */
const MobileNavActions = ({ className = "" }) => {
  const authed = isAuthenticatedUser(); // honours VITE_BYPASS_AUTH
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = useSelector(selectInboxUnreadCount);

  useEffect(() => {
    if (authed) fetchInbox();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={classNames("relative flex items-center gap-[calc(10/390*var(--mvw))]", className)}>
      <Link
        to={authed ? "/subscriptions" : "/signin"}
        className="flex h-[calc(32/390*var(--mvw))] items-center rounded-full border border-brand/60 bg-[rgba(218,19,117,0.5)] px-[calc(14/390*var(--mvw))]"
      >
        <span className="font-primary text-[calc(13/390*var(--mvw))] font-medium leading-none text-gray-1/80">
          Get Bundle
        </span>
      </Link>

      {authed ? (
        <>
          <button
            type="button"
            aria-label={unreadCount ? `Notifications (${unreadCount} unread)` : "Notifications"}
            aria-expanded={notifOpen}
            onClick={() => {
              setMenuOpen(false);
              setNotifOpen((o) => !o);
            }}
            className="relative flex size-[calc(32/390*var(--mvw))] items-center justify-center rounded-full bg-gray-1/15 cursor-pointer"
          >
            <img src={iconNotification} alt="" aria-hidden="true" className="size-[calc(16/390*var(--mvw))]" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex min-w-[16px] items-center justify-center rounded-full bg-error-8 px-1 text-[10px] font-semibold leading-[16px] text-gray-1">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <NotificationsPanel onClose={() => setNotifOpen(false)} className="right-0 top-[calc(42/390*var(--mvw))]" />
          )}

          <button
            type="button"
            aria-label="Account menu"
            aria-expanded={menuOpen}
            onClick={() => {
              setNotifOpen(false);
              setMenuOpen((o) => !o);
            }}
            className="size-[calc(32/390*var(--mvw))] overflow-clip rounded-full bg-gray-1/20 cursor-pointer"
          >
            <img src={avatar} alt="Profile" className="size-full object-cover" />
          </button>

          {menuOpen && (
            <>
              <button
                type="button"
                aria-label="Close account menu"
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 z-40 cursor-default"
              />
              <div className="absolute right-0 top-[calc(42/390*var(--mvw))] z-50 w-[calc(200/390*var(--mvw))] overflow-clip rounded-2xl border border-gray-1/10 bg-black/80 shadow-2xl backdrop-blur-2xl">
                <Link to="/profile" onClick={() => setMenuOpen(false)} className={menuItem}>
                  Profile
                </Link>
                <Link to="/my-stuff" onClick={() => setMenuOpen(false)} className={menuItem}>
                  My Stuff
                </Link>
                <Link to="/subscription-history" onClick={() => setMenuOpen(false)} className={menuItem}>
                  Subscription History
                </Link>
                <div className="h-px bg-gray-1/10" />
                <button
                  type="button"
                  onClick={() => logout()}
                  className="block w-full px-[calc(16/390*var(--mvw))] py-[calc(12/390*var(--mvw))] text-left font-primary text-[calc(14/390*var(--mvw))] text-error-8 cursor-pointer hover:bg-error-8/10"
                >
                  Log Out
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <Link
          to="/signin"
          aria-label="Sign in"
          className="flex size-[calc(32/390*var(--mvw))] items-center justify-center rounded-full bg-gray-1/15"
        >
          <IconLogIn aria-hidden="true" className="size-[calc(16/390*var(--mvw))] text-gray-1" />
        </Link>
      )}
    </div>
  );
};

export default MobileNavActions;
