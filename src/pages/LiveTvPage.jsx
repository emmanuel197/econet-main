import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchBar from "../components/shared/SearchBar";
import ChannelCategoryTabs from "../components/sections/liveTv/ChannelCategoryTabs";
import FeaturedLiveProgram from "../components/sections/liveTv/FeaturedLiveProgram";
import OnAirScheduleSection from "../components/sections/liveTv/OnAirScheduleSection";
import LiveChannelsSidebar from "../components/sections/liveTv/LiveChannelsSidebar";
import { fetchLiveTvContent } from "../api/liveTv";
import { selectLiveTv, selectLiveTvLoading } from "../store/slice/liveTvSlice";
import LiveTvSkeleton from "../components/sections/liveTv/LiveTvSkeleton";

import { liveTvFixtures } from "../data/liveTvFixtures";

// DATA: channels/categories/EPG from api/liveTv.js → liveTv slice; any piece the
// API leaves empty falls back to liveTvFixtures (same pattern as HomePage).
function LiveTvPage() {
  const api = useSelector(selectLiveTv);
  const loading = useSelector(selectLiveTvLoading);
  useEffect(() => {
    fetchLiveTvContent();
  }, []);

  const categories = api.categories.length ? api.categories : liveTvFixtures.categories;
  const scheduleDate = api.scheduleDate || liveTvFixtures.scheduleDate;
  const featuredProgram = api.featuredProgram || liveTvFixtures.featuredProgram;
  const onAirToday = api.onAirToday.length ? api.onAirToday : liveTvFixtures.onAirToday;
  const liveChannels = api.liveChannels.length ? api.liveChannels : liveTvFixtures.liveChannels;
  const liveChannelsTotal = api.liveChannels.length
    ? api.liveChannelsTotal
    : liveTvFixtures.liveChannelsTotal;

  const navigate = useNavigate();
  // Entering playback is explicit (Watch Now / schedule actions) — sidebar
  // clicks stage the channel in the featured panel instead of navigating.
  // Fixture channels carry no uid, so Watch Now is a no-op for them.
  const openChannel = (ch) => ch?.uid && navigate(`/watch/live/${ch.uid}`);

  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = categories.includes(searchParams.get("category")) ? searchParams.get("category") : "All";
  const [category, setCategoryState] = useState(initialCategory);
  const [activeChannelId, setActiveChannelId] = useState(liveChannels[0]?.id);
  const [query, setQuery] = useState("");

  // Selecting a channel retargets the featured panel at the TOP of the page —
  // when the user is scrolled deep in the sidebar/schedule that change is
  // invisible, so bring the panel back into view on every selection (parity
  // with MobileLiveTvPage's stageChannel).
  const featuredRef = useRef(null);
  const stageChannel = (ch) => {
    setActiveChannelId(ch.id);
    requestAnimationFrame(() =>
      featuredRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  };

  // The initial render happens while the skeleton shows (fixture data), so the
  // preselected channel id can go stale once API channels land — resync it.
  useEffect(() => {
    if (!liveChannels.some((c) => c.id === activeChannelId)) {
      setActiveChannelId(liveChannels[0]?.id);
    }
  }, [liveChannels]); // eslint-disable-line react-hooks/exhaustive-deps

  const setCategory = (next) => {
    setCategoryState(next);
    setSearchParams(next === "All" ? {} : { category: next }, { replace: true });
  };

  // Selecting a sidebar channel re-targets the featured panel (select-then-watch);
  // mapping mirrors api/liveTv.js's featuredProgram shape. Fixture channels lack
  // start/end timestamps, so those fields degrade to the base featured copy.
  const timeLabel = (ms) =>
    new Date(ms).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const selectedChannel = liveChannels.find((c) => c.id === activeChannelId);
  const featured = selectedChannel
    ? {
        id: `featured-${selectedChannel.id}`,
        uid: selectedChannel.uid,
        image: selectedChannel.image || selectedChannel.logo,
        status: "LIVE",
        watching: "",
        channelLogo: selectedChannel.logo,
        channelLabel: selectedChannel.lcn
          ? `${selectedChannel.channel} · Ch ${selectedChannel.lcn}`
          : selectedChannel.channel,
        category: selectedChannel.category,
        title: selectedChannel.title,
        subtitle: "",
        startTime: selectedChannel.start ? timeLabel(selectedChannel.start) : featuredProgram.startTime,
        endTime: selectedChannel.end ? timeLabel(selectedChannel.end) : featuredProgram.endTime,
        remaining: selectedChannel.end
          ? `${Math.max(0, Math.round((selectedChannel.end - Date.now()) / 60000))} min remaining`
          : featuredProgram.remaining,
        progress: selectedChannel.progress ?? 0,
      }
    : featuredProgram;

  // The search bar filters the live channel cards (sidebar + the schedule's live
  // segment) by channel or show name.
  const q = query.trim().toLowerCase();
  const visibleChannels = q
    ? liveChannels.filter((c) => c.channel.toLowerCase().includes(q) || c.title.toLowerCase().includes(q))
    : liveChannels;

  // While the API fetch is in flight, show the layout-matched skeleton instead
  // of flashing the fixture channels (HomePage pattern). (After all hooks:
  // rules of hooks.)
  if (loading) return <LiveTvSkeleton />;

  return (
    <div className="relative font-primary text-gray-1">
      <div className="flex flex-col gap-[calc(28/1728*var(--vw))] px-[calc(53/1728*var(--vw))] pt-[calc(146/1728*var(--vw))] pb-[calc(96/1728*var(--vw))]">
        <SearchBar
          value={query}
          onChange={setQuery}
          onClear={() => setQuery("")}
          placeholder="Search live channel..."
          className="w-full"
        />

        <ChannelCategoryTabs categories={categories} active={category} onChange={setCategory} />

        <div className="flex gap-[calc(40/1728*var(--vw))]">
          <div className="flex min-w-0 flex-1 flex-col gap-[calc(36/1728*var(--vw))]">
            {/* scroll-mt clears the fixed navbar when a selection scrolls the
                panel into view. */}
            <div ref={featuredRef} className="scroll-mt-[calc(120/1728*var(--vw))]">
              <FeaturedLiveProgram program={featured} onWatchNow={() => openChannel(featured)} onFullGuide={() => navigate("/tv-guide")} />
            </div>
            <OnAirScheduleSection
              items={onAirToday}
              liveChannels={visibleChannels}
              date={scheduleDate}
              category={category}
              // Any On Air Today row (live cards + Earlier/Coming Up schedule
              // rows) stages its channel in the featured panel and scrolls up.
              // Schedule rows carry channelUid/channel name, not the numeric id —
              // resolve to the live channel; fall back to direct playout.
              onOpenChannel={(row) => {
                const ch =
                  liveChannels.find(
                    (c) =>
                      c.id === row?.id ||
                      (row?.channelUid && c.uid === row.channelUid) ||
                      (row?.channel && c.channel === row.channel)
                  ) ?? (liveChannels.some((c) => c.id === row?.id) ? row : null);
                if (ch) stageChannel(ch);
                else openChannel(row);
              }}
            />
          </div>

          <LiveChannelsSidebar
            items={visibleChannels}
            totalCount={liveChannelsTotal}
            activeId={activeChannelId}
            onSelect={stageChannel}
            className="w-[calc(380/1728*var(--vw))] shrink-0"
          />
        </div>
      </div>
    </div>
  );
}

export default LiveTvPage;
