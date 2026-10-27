import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import classNames from "../utils/classNames";
import { liveTvFixtures } from "../data/liveTvFixtures";
import { fetchLiveTvContent } from "../api/liveTv";
import { selectLiveTv, selectLiveTvLoading } from "../store/slice/liveTvSlice";
import { Pulse } from "../components/shared/PageSkeleton";
import Badge from "../components/ui/Badge";
import MobileNavActions from "../components/shared/MobileNavActions";

import playIcon from "../../assets/icons/home-hero-watch-now-play.svg";
import fullGuideIcon from "../../assets/icons/epg-sport-featured-live-program-full-guide-menu.svg";
import bellIcon from "../../assets/icons/epg-sport-on-air-today-schedule-bell-notification.svg";

// Per-category badge tint, mirroring the comps (News maroon, Kids/Entertainment purple,
// Movies pink, Sports neutral). Falls back to neutral for anything unmapped.
const CATEGORY_BADGE = {
  Sports: "bg-gray-1/12 text-gray-1/75",
  News: "bg-[#7f1d1d]/40 text-[#fca5a5]",
  Entertainment: "bg-[#5b21b6]/40 text-[#c4b5fd]",
  Movies: "bg-[#9d174d]/40 text-[#f9a8d4]",
  Kids: "bg-[#4338ca]/40 text-[#a5b4fc]",
};

// Mobile-scaled Live channel row (--mvw). Desktop LiveChannelCard is --vw-locked
// to a 768px minimum, so it can't scale down to the 390 comp.
const MobileLiveChannelRow = ({ data, active = false, onClick }) => {
  const { logo, channel, category, title, next, progress = 0 } = data;
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        "flex w-full items-start gap-[calc(12/390*var(--mvw))] rounded-xl p-[calc(10/390*var(--mvw))] text-left cursor-pointer transition-colors",
        active ? "border-l-[calc(3/390*var(--mvw))] border-brand bg-gray-1/[0.07]" : "hover:bg-gray-1/10"
      )}
    >
      <img src={logo} alt={channel} className="size-[calc(48/390*var(--mvw))] shrink-0 rounded-lg object-cover" />
      <div className="flex min-w-0 flex-1 flex-col gap-[calc(4/390*var(--mvw))]">
        <div className="flex items-center gap-[calc(8/390*var(--mvw))]">
          <span className="font-primary text-[calc(11/390*var(--mvw))] text-text-muted/75">{channel}</span>
          <span className={classNames("rounded-md px-[calc(6/390*var(--mvw))] py-[calc(1/390*var(--mvw))] font-primary text-[calc(7/390*var(--mvw))] font-medium", CATEGORY_BADGE[category] || CATEGORY_BADGE.Sports)}>{category}</span>
        </div>
        <div className="flex items-center gap-[calc(6/390*var(--mvw))]">
          <Badge variant="live">LIVE</Badge>
          <span className="min-w-0 truncate font-primary text-[calc(12/390*var(--mvw))] font-semibold leading-snug text-gray-1">{title}</span>
        </div>
        <span className="truncate font-primary text-[calc(10/390*var(--mvw))] text-text-muted/65">Next: {next}</span>
        <div className="mt-[calc(2/390*var(--mvw))] h-[calc(3/390*var(--mvw))] w-[calc(120/390*var(--mvw))] overflow-clip rounded-full bg-gray-1/15">
          <div className="h-full rounded-full bg-brand" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
      <img src={bellIcon} alt="" aria-hidden="true" className="size-[calc(16/390*var(--mvw))] shrink-0 opacity-70" />
    </button>
  );
};

/**
 * MobileLiveTvPage — mobile Live TV landing (below md). Afriplay Live Tv header +
 * category chips + featured live program + All Live Channels list (category-filtered).
 */
const MobileLiveTvPage = () => {
  // Same data flow as the desktop LiveTvPage: liveTv slice (channels V2 + EPG)
  // with liveTvFixtures as the design/offline fallback, and the same
  // select-then-watch behavior — a row click stages the channel in the featured
  // panel; Watch Now enters playback (/watch/live/{uid}, watch page owns the
  // premiumSub gate). Fixture channels carry no uid → Watch Now no-ops.
  const api = useSelector(selectLiveTv);
  const loading = useSelector(selectLiveTvLoading);
  const navigate = useNavigate();
  useEffect(() => {
    fetchLiveTvContent();
  }, []);

  const categories = api.categories.length ? api.categories : liveTvFixtures.categories;
  const featuredProgram = api.featuredProgram || liveTvFixtures.featuredProgram;
  const liveChannels = api.liveChannels.length ? api.liveChannels : liveTvFixtures.liveChannels;
  const liveChannelsTotal = api.liveChannels.length
    ? api.liveChannelsTotal
    : liveTvFixtures.liveChannelsTotal;

  const [searchParams, setSearchParams] = useSearchParams();
  const initial = categories.includes(searchParams.get("category")) ? searchParams.get("category") : "All";
  const [category, setCategory] = useState(initial);
  const [activeChannelId, setActiveChannelId] = useState(null);
  // Selecting a row retargets the featured panel at the TOP of the page — when
  // the user is scrolled deep in the channel list that change is invisible, so
  // bring the panel back into view on every selection.
  const featuredRef = useRef(null);
  const stageChannel = (ch) => {
    setActiveChannelId(ch.id);
    requestAnimationFrame(() =>
      featuredRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  };

  const openChannel = (ch) => ch?.uid && navigate(`/watch/live/${ch.uid}`);

  const selectCategory = (c) => {
    setCategory(c);
    setSearchParams(c === "All" ? {} : { category: c }, { replace: true });
  };

  // API channels can belong to several categories (`categories` array); fixtures
  // carry a single `category` string — accept either (desktop matches() pattern).
  const channels =
    category === "All"
      ? liveChannels
      : liveChannels.filter((c) => c.category === category || c.categories?.includes(category));

  // Staged channel drives the featured panel (mirrors desktop's mapping of a
  // selected channel into the featuredProgram shape).
  const timeLabel = (ms) =>
    new Date(ms).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const selected = liveChannels.find((c) => c.id === activeChannelId);
  const p = selected
    ? {
        ...featuredProgram,
        uid: selected.uid,
        image: selected.image || selected.logo,
        channelLogo: selected.logo,
        channelLabel: selected.lcn ? `${selected.channel} · Ch ${selected.lcn}` : selected.channel,
        category: selected.category,
        title: selected.title,
        subtitle: "",
        startTime: selected.start ? timeLabel(selected.start) : featuredProgram.startTime,
        endTime: selected.end ? timeLabel(selected.end) : featuredProgram.endTime,
        remaining: selected.end
          ? `${Math.max(0, Math.round((selected.end - Date.now()) / 60000))} min remaining`
          : featuredProgram.remaining,
        progress: selected.progress ?? 0,
      }
    : featuredProgram;
  // The featured live program is a Sports fixture, so it only headlines the All and
  // Sports views (comps); other categories drop straight to their titled channel list.
  const showFeatured = category === "All" || category === p.category;
  const listTitle = showFeatured ? "All Live Channels" : category;

  // Skeleton while the API fetch is in flight (fixtures-flash guard, HomePage
  // pattern) — mvw-scaled pulses, the desktop LiveTvSkeleton is --vw-locked.
  if (loading)
    return (
      <div className="min-h-screen px-[calc(16/390*var(--mvw))] pt-[calc(60/390*var(--mvw))]">
        <Pulse className="mb-[calc(16/390*var(--mvw))] h-[calc(28/390*var(--mvw))] w-[calc(180/390*var(--mvw))]" />
        <Pulse className="mb-[calc(16/390*var(--mvw))] h-[calc(220/390*var(--mvw))] w-full rounded-2xl" />
        {Array.from({ length: 5 }, (_, i) => (
          <Pulse key={i} className="mb-[calc(10/390*var(--mvw))] h-[calc(72/390*var(--mvw))] w-full" />
        ))}
      </div>
    );

  return (
    <div className="min-h-screen font-primary text-gray-1">
      <div className="flex flex-col gap-[calc(18/390*var(--mvw))] px-[calc(16/390*var(--mvw))] pt-[calc(44/390*var(--mvw))] pb-[calc(120/390*var(--mvw))]">
        {/* Header — the design's "Afriplay Live Tv" title replaces the logo, so this route
           runs with mobileTopBar="status" and MainLayout renders no bar. The right-hand
           controls come from the SHARED cluster; they were hand-rolled here before, with a
           Get Bundle button that navigated nowhere and a bell with no handler. */}
        <div className="flex items-center justify-between">
          <span className="font-primary text-[calc(16/390*var(--mvw))] font-semibold text-brand">Wona Live Tv</span>
          <MobileNavActions />
        </div>

        {/* Category chips */}
        <div className="flex gap-[calc(8/390*var(--mvw))] overflow-x-auto scrollbar-hide">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => selectCategory(c)}
              className={classNames(
                "shrink-0 rounded-full px-[calc(16/390*var(--mvw))] py-[calc(7/390*var(--mvw))] font-primary text-[calc(12/390*var(--mvw))] leading-none transition-colors",
                category === c ? "bg-brand font-semibold text-gray-1" : "border border-gray-1/20 bg-gray-1/10 text-gray-1/70"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Featured live program — All + Sports only */}
        {showFeatured && (
        <div ref={featuredRef} className="scroll-mt-[calc(12/390*var(--mvw))] flex flex-col gap-[calc(14/390*var(--mvw))] overflow-clip rounded-2xl bg-gradient-to-br from-[#1a2548] to-[#0e152c] p-[calc(16/390*var(--mvw))]">
          <div className="flex items-start justify-between gap-[calc(12/390*var(--mvw))]">
            <div className="flex min-w-0 flex-col gap-[calc(8/390*var(--mvw))]">
              <div className="flex items-center gap-[calc(8/390*var(--mvw))]">
                {p.status === "LIVE" && <Badge variant="live">LIVE</Badge>}
                <span className="font-primary text-[calc(10/390*var(--mvw))] text-gray-6">{p.watching}</span>
              </div>
              <div className="flex items-center gap-[calc(8/390*var(--mvw))]">
                <img src={p.channelLogo} alt="" className="h-[calc(20/390*var(--mvw))] w-auto rounded object-contain" />
                {/* "SuperSport · Ch 5": channel name 12px semibold, channel number 10px at 60% */}
                <span className="font-primary text-[calc(12/390*var(--mvw))] font-semibold text-text-muted">
                  {p.channelLabel?.split(" · ")[0]}
                  {p.channelLabel?.includes(" · ") && (
                    <span className="text-[calc(10/390*var(--mvw))] font-normal text-text-muted/60"> · {p.channelLabel.split(" · ").slice(1).join(" · ")}</span>
                  )}
                </span>
              </div>
              <h2 className="font-primary text-[calc(18/390*var(--mvw))] font-semibold leading-tight text-brand">
                {p.title}<br />
                <span className="text-brand">{p.subtitle}</span>
              </h2>
            </div>
            <img src={p.image} alt="" className="size-[calc(120/390*var(--mvw))] shrink-0 rounded-lg object-cover" />
          </div>

          <div className="flex flex-col gap-[calc(6/390*var(--mvw))]">
            <div className="flex items-center justify-between font-primary text-[calc(10/390*var(--mvw))] text-gray-6">
              <span>{p.startTime}</span>
              <span>{p.remaining}</span>
              <span>{p.endTime}</span>
            </div>
            <div className="h-[calc(4/390*var(--mvw))] w-full overflow-clip rounded-full bg-gray-1/20">
              <div className="h-full rounded-full bg-brand" style={{ width: `${p.progress * 100}%` }} />
            </div>
          </div>

          <div className="flex items-center gap-[calc(10/390*var(--mvw))]">
            <button type="button" onClick={() => openChannel(p)} className="flex items-center gap-[calc(6/390*var(--mvw))] rounded-full bg-brand px-[calc(20/390*var(--mvw))] py-[calc(9/390*var(--mvw))] font-primary text-[calc(11/390*var(--mvw))] font-semibold text-gray-1 cursor-pointer">
              <img src={playIcon} alt="" aria-hidden="true" className="size-[calc(14/390*var(--mvw))]" /> Watch Now
            </button>
            <button type="button" onClick={() => navigate("/tv-guide")} className="flex items-center gap-[calc(6/390*var(--mvw))] rounded-full bg-gray-1/30 px-[calc(18/390*var(--mvw))] py-[calc(9/390*var(--mvw))] font-primary text-[calc(12/390*var(--mvw))] font-medium text-gray-1 backdrop-blur-md cursor-pointer">
              <img src={fullGuideIcon} alt="" aria-hidden="true" className="size-[calc(14/390*var(--mvw))]" /> Full Guide
            </button>
          </div>
        </div>
        )}

        {/* Channel list — title switches to the active category when featured is hidden */}
        <div className="flex items-center justify-between">
          <h2 className="font-primary text-[calc(14/390*var(--mvw))] font-semibold text-gray-1">{listTitle}</h2>
          <span className="font-primary text-[calc(10/390*var(--mvw))] text-gray-6">{liveChannelsTotal} channels</span>
        </div>
        <div className="flex flex-col gap-[calc(10/390*var(--mvw))]">
          {channels.length ? (
            channels.map((ch, i) => (
              <MobileLiveChannelRow
                key={ch.id}
                data={ch}
                active={activeChannelId != null ? ch.id === activeChannelId : showFeatured && i === 0}
                onClick={() => stageChannel(ch)}
              />
            ))
          ) : (
            <p className="py-[calc(24/390*var(--mvw))] text-center font-primary text-[calc(13/390*var(--mvw))] text-gray-1/50">
              No {category.toLowerCase()} channels live right now.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileLiveTvPage;
