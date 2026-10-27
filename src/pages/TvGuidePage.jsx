import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "../utils/classNames";
import Badge from "../components/ui/Badge";
import { Pulse } from "../components/shared/PageSkeleton";
import { fetchChannels, fetchEpgGrid } from "../api/liveTv";

/**
 * TvGuidePage (/tv-guide) — the desktop "Full Guide" the Live TV hero links to.
 * MangoTV LiveShowDetailPage schedule pattern against the same EPG endpoint
 * (v2/{ouid}/shows/grid + start_date/end_date):
 *  - 7 date tabs (Today / Tomorrow / weekday+date), each fetching one
 *    midnight→midnight day
 *  - channel rail (left on desktop, horizontal chips on mobile)
 *  - shows list with the current show highlighted (ON NOW → Watch)
 *  - backend pads unscheduled channels with literal "No EPG" placeholder shows —
 *    filtered out (Mango's sentinel check), leaving a real empty state.
 */
const dateTabs = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const label =
      i === 0
        ? "Today"
        : i === 1
          ? "Tomorrow"
          : date.toLocaleDateString("en-US", { weekday: "short" });
    const sub = date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });
    return { label, sub, date };
  });
};

const timeLabel = (iso) =>
  new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

const TvGuidePage = () => {
  const navigate = useNavigate();
  const tabs = useMemo(dateTabs, []);
  const [channels, setChannels] = useState(null); // null = loading
  const [channelId, setChannelId] = useState(null);
  const [dayIndex, setDayIndex] = useState(0);
  const [shows, setShows] = useState(null); // null = loading
  const now = Date.now();

  useEffect(() => {
    fetchChannels()
      .then((rows) => {
        const sorted = [...rows].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
        setChannels(sorted);
        setChannelId((id) => id ?? sorted[0]?.id ?? null);
      })
      .catch(() => setChannels([]));
  }, []);

  // One channel + one day per fetch (Mango tab pattern); cancelled guard so a
  // slow response can't overwrite a newer tab's result.
  useEffect(() => {
    if (channelId == null) return;
    let cancelled = false;
    setShows(null);
    const startDate = new Date(tabs[dayIndex].date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    fetchEpgGrid(channelId, { startDate, endDate })
      .then((blocks) => {
        if (cancelled) return;
        if (import.meta.env.DEV) {
          const b0 = (blocks || [])[0];
          console.log(
            "[guide] grid response — blocks:", blocks?.length,
            "block ids:", (blocks || []).map((b) => b.id),
            "requested channel:", channelId,
            "| first block keys:", b0 && Object.keys(b0),
            "| shows:", b0?.shows?.length,
            "| show sample:", JSON.stringify(b0?.shows?.[0])
          );
        }
        // String-coerce the id match — the grid returns channel ids as strings.
        const block =
          (blocks || []).find((b) => String(b.id) === String(channelId)) ||
          (blocks?.length === 1 ? blocks[0] : null);
        const real = (block?.shows || []).filter((s) => {
          const t = (s.title || "").trim().toLowerCase();
          return t && t !== "no epg";
        });
        real.sort((a, b) => new Date(a.start) - new Date(b.start));
        setShows(real);
      })
      .catch(() => !cancelled && setShows([]));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId, dayIndex]);

  const channel = channels?.find((c) => c.id === channelId);

  return (
    <div className="min-h-screen font-primary text-gray-1">
      <div className="flex flex-col gap-[calc(24/1728*var(--vw))] px-[calc(53/1728*var(--vw))] pt-[calc(146/1728*var(--vw))] pb-[calc(96/1728*var(--vw))] max-md:gap-[calc(16/390*var(--mvw))] max-md:px-[calc(16/390*var(--mvw))] max-md:pt-[calc(70/390*var(--mvw))] max-md:pb-[calc(120/390*var(--mvw))]">
        <h1 className="text-h6 font-bold max-md:text-[calc(20/390*var(--mvw))]">TV Guide</h1>

        {/* Date tabs */}
        <div className="flex gap-[calc(28/1728*var(--vw))] border-b border-gray-1/10 max-md:gap-[calc(18/390*var(--mvw))] max-md:overflow-x-auto max-md:scrollbar-hide">
          {tabs.map((t, i) => (
            <button
              key={t.sub}
              type="button"
              onClick={() => setDayIndex(i)}
              className={classNames(
                "-mb-px flex shrink-0 cursor-pointer flex-col items-center border-b-2 pb-[calc(10/1728*var(--vw))] transition-colors max-md:pb-[calc(8/390*var(--mvw))]",
                i === dayIndex
                  ? "border-brand text-gray-1"
                  : "border-transparent text-gray-1/50 hover:text-gray-1"
              )}
            >
              <span className="text-xl font-semibold max-md:text-[calc(14/390*var(--mvw))]">{t.label}</span>
              <span className="text-sm text-gray-1/50 max-md:text-[calc(11/390*var(--mvw))]">{t.sub}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-[calc(40/1728*var(--vw))] max-md:flex-col max-md:gap-[calc(14/390*var(--mvw))]">
          {/* Channel rail — sidebar at md+, horizontal chips below */}
          {channels === null ? (
            <div className="flex w-[calc(300/1728*var(--vw))] flex-col gap-[calc(8/1728*var(--vw))] max-md:w-full">
              {Array.from({ length: 8 }, (_, i) => (
                <Pulse key={i} className="h-[calc(44/1728*var(--vw))] w-full max-md:h-[calc(34/390*var(--mvw))]" />
              ))}
            </div>
          ) : (
            <div className="flex w-[calc(300/1728*var(--vw))] shrink-0 flex-col gap-[calc(4/1728*var(--vw))] max-md:w-full max-md:flex-row max-md:gap-[calc(8/390*var(--mvw))] max-md:overflow-x-auto max-md:scrollbar-hide">
              {channels.map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setChannelId(ch.id)}
                  className={classNames(
                    "cursor-pointer rounded-xl px-[calc(16/1728*var(--vw))] py-[calc(10/1728*var(--vw))] text-left text-lg transition-colors",
                    "max-md:shrink-0 max-md:rounded-full max-md:px-[calc(14/390*var(--mvw))] max-md:py-[calc(7/390*var(--mvw))] max-md:text-[calc(12/390*var(--mvw))]",
                    ch.id === channelId
                      ? "bg-brand font-semibold text-gray-1"
                      : "bg-gray-1/5 text-gray-1/80 hover:bg-gray-1/10"
                  )}
                >
                  {ch.name || ch.short_name || ch.uid}
                </button>
              ))}
            </div>
          )}

          {/* Schedule for the selected channel + day */}
          <div className="flex min-w-0 flex-1 flex-col gap-[calc(8/1728*var(--vw))] max-md:gap-[calc(6/390*var(--mvw))]">
            {shows === null ? (
              Array.from({ length: 8 }, (_, i) => (
                <Pulse key={i} className="h-[calc(64/1728*var(--vw))] w-full max-md:h-[calc(52/390*var(--mvw))]" />
              ))
            ) : shows.length === 0 ? (
              <p className="py-[calc(32/1728*var(--vw))] text-center text-lg text-gray-1/50 max-md:text-[calc(13/390*var(--mvw))]">
                No programme guide available for {channel?.name || "this channel"} on{" "}
                {tabs[dayIndex].label.toLowerCase() === "today" ? "today" : tabs[dayIndex].sub}.
              </p>
            ) : (
              shows.map((s, i) => {
                const onNow =
                  dayIndex === 0 &&
                  new Date(s.start).getTime() <= now &&
                  new Date(s.end).getTime() >= now;
                return (
                  <div
                    key={s.id ?? `${s.start}-${i}`}
                    className={classNames(
                      "flex items-center gap-[calc(20/1728*var(--vw))] rounded-xl px-[calc(20/1728*var(--vw))] py-[calc(14/1728*var(--vw))]",
                      "max-md:gap-[calc(10/390*var(--mvw))] max-md:px-[calc(12/390*var(--mvw))] max-md:py-[calc(10/390*var(--mvw))]",
                      onNow ? "border border-brand/60 bg-gray-1/[0.07]" : i % 2 === 1 && "bg-gray-1/5"
                    )}
                  >
                    <span className="w-[calc(150/1728*var(--vw))] shrink-0 text-base text-gray-1/60 max-md:w-[calc(92/390*var(--mvw))] max-md:text-[calc(11/390*var(--mvw))]">
                      {timeLabel(s.start)} – {timeLabel(s.end)}
                    </span>
                    <div className="flex min-w-0 flex-1 items-center gap-[calc(10/1728*var(--vw))] max-md:gap-[calc(6/390*var(--mvw))]">
                      {onNow && <Badge variant="live">LIVE</Badge>}
                      <span className="truncate text-lg font-medium max-md:text-[calc(13/390*var(--mvw))]">{s.title}</span>
                    </div>
                    {onNow && channel?.uid && (
                      <button
                        type="button"
                        onClick={() => navigate(`/watch/live/${channel.uid}`)}
                        className="shrink-0 cursor-pointer rounded-full bg-brand px-[calc(18/1728*var(--vw))] py-[calc(8/1728*var(--vw))] text-base font-semibold text-gray-1 max-md:px-[calc(12/390*var(--mvw))] max-md:py-[calc(6/390*var(--mvw))] max-md:text-[calc(12/390*var(--mvw))]"
                      >
                        Watch
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TvGuidePage;
