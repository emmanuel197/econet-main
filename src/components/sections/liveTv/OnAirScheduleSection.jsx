import React, { useState } from "react";
import classNames from "../../../utils/classNames";
import LiveChannelCard from "../../cards/LiveChannelCard";
import replayIcon from "../../../../assets/icons/epg-sport-on-air-today-schedule-replay-refresh.svg";
import bellIcon from "../../../../assets/icons/epg-sport-on-air-today-schedule-bell-notification.svg";

const TABS = [
  { id: "all", label: "All" },
  { id: "earlier", label: "Earlier Today" },
  { id: "upcoming", label: "Coming Up" },
];

const ScheduleRow = ({ item, striped, onSelect }) => (
  <div
    onClick={onSelect ? () => onSelect(item) : undefined}
    className={classNames(
      "flex items-center gap-[calc(20/1728*var(--vw))] rounded-xl px-[calc(16/1728*var(--vw))] py-[calc(14/1728*var(--vw))]",
      striped && "bg-gray-1/5",
      onSelect && "cursor-pointer transition-colors hover:bg-gray-1/10"
    )}
  >
    <span className="w-[calc(80/1728*var(--vw))] shrink-0 font-primary text-base text-gray-1/60">{item.time}</span>
    <img src={item.logo} alt="" className="size-[calc(52/1728*var(--vw))] shrink-0 rounded-lg object-cover" />
    <div className="flex min-w-0 flex-1 flex-col gap-[calc(4/1728*var(--vw))]">
      <span className="w-fit rounded-md bg-gray-1/10 px-[calc(8/1728*var(--vw))] py-[calc(2/1728*var(--vw))] font-primary text-xs text-gray-1/80">
        {item.category}
      </span>
      <span className="font-primary font-semibold text-base leading-tight text-gray-1">{item.title}</span>
      <span className="font-primary text-sm text-gray-1/60">{item.channel}</span>
    </div>
    {/* White-stroke icon assets go dark on the gold pill via brightness-0.
       stopPropagation so Replay/Remind doesn't also stage the channel. */}
    <button
      type="button"
      onClick={(e) => e.stopPropagation()}
      className="flex shrink-0 items-center gap-[calc(8/1728*var(--vw))] rounded-full bg-brand px-[calc(18/1728*var(--vw))] py-[calc(8/1728*var(--vw))] font-primary font-medium text-sm text-page cursor-pointer"
    >
      <img
        src={item.when === "earlier" ? replayIcon : bellIcon}
        alt=""
        aria-hidden="true"
        className="size-[calc(15/1728*var(--vw))] brightness-0"
      />
      {item.when === "earlier" ? "Replay" : "Remind"}
    </button>
  </div>
);

/**
 * OnAirScheduleSection — the day's schedule, chronological on the All tab:
 * Earlier Today rows (Replay) → live-now channel cards → Coming Up rows (Remind).
 */
const OnAirScheduleSection = ({ items = [], liveChannels = [], date, category = "All", onOpenChannel, className = "" }) => {
  const [tab, setTab] = useState("all");

  // API rows can belong to several categories (`categories` array); fixtures
  // carry a single `category` string — accept either.
  const matches = (row) =>
    category === "All" || row.category === category || row.categories?.includes(category);
  const earlier = items.filter((i) => i.when === "earlier" && matches(i));
  const upcoming = items.filter((i) => i.when === "upcoming" && matches(i));
  const live = liveChannels.filter(matches);

  const empty =
    (tab === "earlier" && earlier.length === 0) ||
    (tab === "upcoming" && upcoming.length === 0) ||
    (tab === "all" && earlier.length + upcoming.length + live.length === 0);

  return (
    <section className={classNames("flex flex-col gap-[calc(20/1728*var(--vw))]", className)}>
      <div className="flex items-center justify-between">
        <h2 className="font-primary font-semibold text-xl text-gray-1">On Air Today</h2>
        <span className="font-primary text-lg text-gray-1/60">{date}</span>
      </div>

      <div className="flex items-center gap-[calc(28/1728*var(--vw))] border-b border-gray-1/10">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={classNames(
              "-mb-px border-b-2 pb-[calc(10/1728*var(--vw))] font-primary text-lg cursor-pointer transition-colors",
              tab === t.id ? "border-brand text-brand" : "border-transparent text-gray-1/60 hover:text-gray-1"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-[calc(6/1728*var(--vw))]">
        {tab !== "upcoming" &&
          earlier.map((item, i) => (
            <ScheduleRow key={item.id} item={item} striped={i % 2 === 1} onSelect={onOpenChannel} />
          ))}

        {tab === "all" &&
          live.map((ch, i) => (
            <LiveChannelCard
              key={ch.id}
              data={ch}
              onClick={() => onOpenChannel?.(ch)}
              className={classNames(i % 2 === 1 && "bg-gray-1/5")}
            />
          ))}

        {tab !== "earlier" &&
          upcoming.map((item, i) => (
            <ScheduleRow key={item.id} item={item} striped={i % 2 === 1} onSelect={onOpenChannel} />
          ))}

        {empty && (
          <p className="py-[calc(24/1728*var(--vw))] text-center font-primary text-base text-gray-1/50">
            No {category === "All" ? "" : `${category.toLowerCase()} `}programming to show here.
          </p>
        )}
      </div>
    </section>
  );
};

export default OnAirScheduleSection;
