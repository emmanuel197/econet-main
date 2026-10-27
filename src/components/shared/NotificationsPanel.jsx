import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import classNames from "../../utils/classNames";
import {
  selectInboxMessages,
  selectInboxLoading,
} from "../../store/slice/inboxSlice";
import { markNotificationRead, deleteNotification } from "../../api/inbox";

/**
 * NotificationsPanel — glass dropdown listing CRM inbox messages. No Figma frame
 * exists for the inbox (brief only names the endpoints), so styling mirrors the
 * navbar account dropdown. Unread rows carry a gold dot + brighter title; clicking
 * a row marks it read (optimistic), the × deletes it. The footer links to the full
 * /notifications page (legacy AfriPlay's account-details Messages tab equivalent).
 * Positioning comes from the caller via className (absolute anchor).
 *
 * Text scales with --mvw below md (390 comp) and fixed sizes at md+ — plain
 * text-sm/text-xs rendered oversized inside the mobile bar's scaled chrome.
 */
// Dropdown is a preview — the newest few rows only; the full list lives on
// /notifications ("View all"). Unread first so the badge count is explained.
const PREVIEW_COUNT = 3;

const NotificationsPanel = ({ onClose, className = "" }) => {
  const messages = useSelector(selectInboxMessages);
  const loading = useSelector(selectInboxLoading);
  const preview = [...messages]
    .sort((a, b) => (a.notification_status !== "read" ? 0 : 1) - (b.notification_status !== "read" ? 0 : 1))
    .slice(0, PREVIEW_COUNT);
  const moreCount = messages.length - preview.length;

  return (
    <>
      {/* Click-outside catcher (same pattern as the account dropdown) */}
      <button
        type="button"
        aria-label="Close notifications"
        onClick={onClose}
        className="fixed inset-0 z-40 cursor-default"
      />
      <div
        className={classNames(
          "absolute z-50 flex max-h-[60vh] w-[min(360px,90vw)] flex-col overflow-clip rounded-2xl border border-gray-1/10 bg-black/80 shadow-2xl backdrop-blur-2xl font-primary",
          className
        )}
      >
        <div className="flex items-center justify-between px-[calc(14/390*var(--mvw))] py-[calc(10/390*var(--mvw))] md:px-4 md:py-3">
          <span className="text-[calc(13/390*var(--mvw))] font-semibold text-gray-1 md:text-sm">
            Notifications
          </span>
        </div>
        <div className="h-px bg-gray-1/10" />

        <div className="overflow-y-auto">
          {loading && !messages.length && (
            <p className="px-4 py-6 text-center text-[calc(12/390*var(--mvw))] text-gray-1/50 md:text-sm">
              Loading…
            </p>
          )}

          {!loading && !messages.length && (
            <p className="px-4 py-6 text-center text-[calc(12/390*var(--mvw))] text-gray-1/50 md:text-sm">
              You're all caught up — no notifications.
            </p>
          )}

          {preview.map((m) => {
            const unread = m.notification_status !== "read";
            return (
              <div
                key={m.id}
                role="button"
                tabIndex={0}
                onClick={() => unread && markNotificationRead(m.id)}
                onKeyDown={(e) => e.key === "Enter" && unread && markNotificationRead(m.id)}
                className={classNames(
                  "group flex cursor-pointer items-start gap-[calc(10/390*var(--mvw))] px-[calc(14/390*var(--mvw))] py-[calc(10/390*var(--mvw))] hover:bg-gray-1/10 md:gap-3 md:px-4 md:py-3",
                  unread ? "bg-gray-1/5" : ""
                )}
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    "mt-[calc(5/390*var(--mvw))] size-[calc(7/390*var(--mvw))] shrink-0 rounded-full md:mt-1.5 md:size-2",
                    unread ? "bg-brand" : "bg-transparent"
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={classNames(
                      "truncate text-[calc(13/390*var(--mvw))] md:text-sm",
                      unread ? "font-semibold text-gray-1" : "text-gray-1/80"
                    )}
                  >
                    {m.title}
                  </p>
                  <p className="mt-0.5 line-clamp-3 text-[calc(11/390*var(--mvw))] text-gray-1/60 md:text-xs">
                    {m.message}
                  </p>
                  <p className="mt-1 text-[calc(10/390*var(--mvw))] text-gray-1/40 md:text-[11px]">
                    {[m.date, m.time].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Delete notification"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(m.id);
                  }}
                  className="mt-0.5 hidden shrink-0 cursor-pointer text-gray-1/40 hover:text-error-8 group-hover:block"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>

        <div className="h-px bg-gray-1/10" />
        <Link
          to="/notifications"
          onClick={onClose}
          className="block px-4 py-[calc(10/390*var(--mvw))] text-center text-[calc(12/390*var(--mvw))] font-medium text-brand hover:bg-gray-1/10 md:py-3 md:text-sm"
        >
          View all notifications{moreCount > 0 ? ` (${moreCount} more)` : ""}
        </Link>
      </div>
    </>
  );
};

export default NotificationsPanel;
