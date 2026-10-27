import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import classNames from "../utils/classNames";
import {
  selectInboxMessages,
  selectInboxLoading,
} from "../store/slice/inboxSlice";
import { fetchInbox, markNotificationRead, deleteNotification } from "../api/inbox";

/**
 * NotificationsPage (/notifications) — full CRM inbox list; the bell dropdown's
 * "View all" target. Equivalent of legacy AfriPlay's account-details Messages tab
 * (no Figma frame exists — styling follows the app's card/list conventions).
 */
const NotificationsPage = () => {
  const messages = useSelector(selectInboxMessages);
  const loading = useSelector(selectInboxLoading);
  // All | Unread — notification_status is the only filterable field the CRM
  // message shape carries (no category data), so tabs stay at two.
  const [filter, setFilter] = useState("All");
  const unread = messages.filter((m) => m.notification_status !== "read");
  const visible = filter === "Unread" ? unread : messages;

  useEffect(() => {
    fetchInbox();
  }, []);

  const markAllRead = () => unread.forEach((m) => markNotificationRead(m.id));

  return (
    <div className="relative min-h-screen font-primary text-gray-1">
      <div className="mx-auto flex w-full max-w-[calc(900/1728*var(--vw))] flex-col gap-[calc(20/390*var(--mvw))] px-[calc(20/390*var(--mvw))] pb-[calc(60/390*var(--mvw))] pt-[calc(70/390*var(--mvw))] md:gap-[calc(24/1728*var(--vw))] md:px-0 md:pb-[calc(96/1728*var(--vw))] md:pt-[calc(146/1728*var(--vw))]">
        <h1 className="text-[calc(22/390*var(--mvw))] font-bold md:text-h5">Notifications</h1>

        {/* Filter chips (ChannelCategoryTabs-style pills) + quiet mark-all action */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-[calc(8/390*var(--mvw))] md:gap-[calc(10/1728*var(--vw))]">
            {["All", "Unread"].map((tab) => {
              const active = filter === tab;
              const count = tab === "Unread" ? unread.length : messages.length;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilter(tab)}
                  className={classNames(
                    "cursor-pointer rounded-full px-[calc(14/390*var(--mvw))] py-[calc(6/390*var(--mvw))] text-[calc(12/390*var(--mvw))] font-medium md:px-[calc(18/1728*var(--vw))] md:py-[calc(8/1728*var(--vw))] md:text-base",
                    active
                      ? "bg-brand text-page"
                      : "border border-gray-1/20 text-gray-1/80 hover:bg-gray-1/10"
                  )}
                >
                  {tab}
                  {count > 0 ? ` (${count})` : ""}
                </button>
              );
            })}
          </div>
          {unread.length > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="shrink-0 cursor-pointer text-[calc(12/390*var(--mvw))] font-medium text-brand hover:underline md:text-sm"
            >
              Mark all as read
            </button>
          )}
        </div>

        {loading && !messages.length && (
          <p className="py-10 text-center text-sm text-gray-1/50">Loading…</p>
        )}

        {!loading && !messages.length && (
          <p className="py-10 text-center text-sm text-gray-1/50">
            You're all caught up — no notifications.
          </p>
        )}

        {!loading && messages.length > 0 && visible.length === 0 && (
          <p className="py-10 text-center text-sm text-gray-1/50">No unread notifications.</p>
        )}

        <div className="flex flex-col gap-[calc(12/390*var(--mvw))] md:gap-[calc(14/1728*var(--vw))]">
          {visible.map((m) => {
            const unread = m.notification_status !== "read";
            return (
              <div
                key={m.id}
                role="button"
                tabIndex={0}
                onClick={() => unread && markNotificationRead(m.id)}
                onKeyDown={(e) => e.key === "Enter" && unread && markNotificationRead(m.id)}
                className={classNames(
                  "group flex cursor-pointer items-start gap-[calc(12/390*var(--mvw))] rounded-2xl border border-gray-1/10 px-[calc(16/390*var(--mvw))] py-[calc(14/390*var(--mvw))] md:gap-[calc(14/1728*var(--vw))] md:px-[calc(24/1728*var(--vw))] md:py-[calc(18/1728*var(--vw))]",
                  unread ? "bg-gray-1/10" : "bg-gray-1/5 opacity-80"
                )}
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    "mt-[calc(6/390*var(--mvw))] size-[calc(8/390*var(--mvw))] shrink-0 rounded-full md:mt-2 md:size-[calc(9/1728*var(--vw))]",
                    unread ? "bg-brand" : "bg-transparent"
                  )}
                />
                <div className="min-w-0 flex-1">
                  <h3
                    className={classNames(
                      "text-[calc(14/390*var(--mvw))] md:text-lg",
                      unread ? "font-semibold" : "font-medium text-gray-1/85"
                    )}
                  >
                    {m.title}
                  </h3>
                  <p className="mt-1 text-[calc(12/390*var(--mvw))] text-gray-1/65 md:text-base">
                    {m.message}
                  </p>
                  <p className="mt-2 text-[calc(11/390*var(--mvw))] text-gray-1/40 md:text-sm">
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
                  className="mt-1 shrink-0 cursor-pointer text-gray-1/40 hover:text-error-8"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
