import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import classNames from "../utils/classNames";
import { fetchShortsContent, openAfrishortsPlayer } from "../api/shorts";
import { selectShorts, selectShortsLoading } from "../store/slice/shortsSlice";
import ShortsSkeleton from "../components/sections/shorts/ShortsSkeleton";
import SectionHeader from "../components/ui/SectionHeader";
import ShortsFilterChips from "../components/sections/shorts/ShortsFilterChips";
import ShortsAvatarRail from "../components/sections/shorts/ShortsAvatarRail";
import ShortGridTile from "../components/cards/ShortGridTile";
import LiveReelBanner from "../components/sections/shorts/LiveReelBanner";
import TrendingNowSidebar from "../components/sections/shorts/TrendingNowSidebar";
import seeMoreArrow from "../../assets/see_more.svg";

import { shortsFixtures } from "../data/shortsFixtures";

// DATA: rail categories/content from api/shorts.js → shorts slice; fixtures are the
// fallback (fixtures mode / signed-out). The banner and Trending Now used to be
// fixture-only "no endpoint in the brief" holdouts — resolved by live probe 2026-07-30
// (banner = rail heading_image_id, Trending Now = trending rail items).

// Column-brick grid (not a uniform aspect-ratio grid): height alternates per column
// between "tall" and "short", offset so a tile is tall exactly when
// (row parity === column parity) — gives the checkerboard/brick look in the design.
// Measured off Figma 4041:27263 (2026-07-30): 4 columns at x=0/261/522/783 → 245 wide with a
// 16 gap, tiles alternating 285 / 207 tall, also 16 apart vertically (0→301, 301→524, 524→825).
const GRID_COLUMNS = 4;
const TILE_WIDTH = 245;
const TILE_HEIGHT_TALL = 285;
const TILE_HEIGHT_SHORT = 207;
const GRID_GAP = 16;

function ShortsPage() {
  const api = useSelector(selectShorts);
  const loading = useSelector(selectShortsLoading);
  const navigate = useNavigate();
  useEffect(() => {
    fetchShortsContent();
  }, []);

  // API mode when rail categories resolved; every piece falls back to fixtures
  // (design-review / signed-out), where views labels stay per the design.
  const apiMode = api.categories.length > 0;
  const shortsForYou = api.shortsForYou.length ? api.shortsForYou : shortsFixtures.shortsForYou;
  const forYouGrid = api.forYouGrid.length ? api.forYouGrid : shortsFixtures.forYouGrid;
  // Banner = the rail category's heading_image_id; Trending Now = the trending rail's
  // items (see api/shorts.js — resolved by live probe 2026-07-30, the brief is silent
  // on both). Fixtures stay the design-review fallback.
  const liveReelPreview = api.liveReelPreview ?? shortsFixtures.liveReelPreview;
  const trendingNow = api.trendingNow.length ? api.trendingNow : shortsFixtures.trendingNow;

  const filterLabels = apiMode
    ? api.categories.map((c) => c.name || c.title).filter(Boolean)
    : undefined;
  // Active chip lives HERE, not in the chips component — the loading gate below
  // can unmount the chips (category refetch), which would reset internal state
  // back to the first chip and make tab clicks appear to do nothing.
  const [activeFilter, setActiveFilter] = useState(null);
  const handleFilter = (label) => {
    if (!apiMode) return; // fixture chips are display-only
    setActiveFilter(label);
    const cat = api.categories.find((c) => (c.name || c.title) === label);
    if (cat) fetchShortsContent(cat.id);
  };

  // Brief: selecting an item plays its vertical trailer, then continues through
  // the same category — so the queue is seeded from the list the item was clicked in.
  // (Seeding every click from forYouGrid would drop Trending items that aren't in it,
  // and the player redirects out when its id isn't in the queue.)
  const openFrom = (list, item) => openAfrishortsPlayer(list, String(item.id), navigate);
  const openReel = (item) => openFrom(forYouGrid, item);

  // Full-page skeleton only for the INITIAL load (no categories yet) — chip
  // refetches keep the page mounted (content swaps in place when data lands),
  // so the chips/scroll survive. Early-outs clear the loader so fixtures render
  // as final content in bypass/fixtures mode.
  if (loading && !apiMode) return <ShortsSkeleton />;

  // forYouGrid is authored row-major; re-bucket into columns so each renders
  // as its own vertical stack with its own tall/short alternation.
  const columns = Array.from({ length: GRID_COLUMNS }, (_, col) =>
    forYouGrid.filter((_, i) => i % GRID_COLUMNS === col)
  );

  return (
    <div className="relative min-h-screen font-primary text-gray-1">
      <div
        className={classNames(
          "flex justify-between gap-x-[calc(24/1728*var(--vw))]",
          "pl-[calc(53/1728*var(--vw))] pr-[calc(53/1728*var(--vw))]",
          "pt-[calc(171/1728*var(--vw))] pb-[calc(64/1728*var(--vw))]"
        )}
      >
        {/* Width is driven by the grid's real tile dimensions rather than a guess;
            with justify-between on the parent, leftover space collects in the gap
            before the sidebar, matching the Figma "space between" spacing. */}
        <div
          className="flex shrink-0 flex-col gap-[calc(32/1728*var(--vw))]"
          style={{ width: `calc(${GRID_COLUMNS * TILE_WIDTH + (GRID_COLUMNS - 1) * GRID_GAP} / 1728 * var(--vw))` }}
        >
          <div className="flex flex-col gap-[calc(8/1728*var(--vw))]">
            <h1 className="font-primary font-medium text-h6 text-gray-1">Shorts for You</h1>
            <p className="font-primary text-xl text-gray-1/80">
              Tap any shorts to start watching
            </p>
          </div>

          <ShortsFilterChips
            filters={filterLabels}
            active={apiMode ? activeFilter ?? filterLabels[0] : undefined}
            onChange={handleFilter}
          />

          {/* Deliberately narrower than the grid below (peeks the 9th circle at half)
             so the row's overflow-x-auto scroller stays discoverable. */}
          <ShortsAvatarRail items={shortsForYou} onSelect={apiMode ? openReel : undefined} />

          <section className="flex flex-col gap-[calc(24/1728*var(--vw))]">
            <SectionHeader title="For You" showArrow={false} />
            {/* Both gaps are GRID_GAP (16, per Figma) — they must stay in step with the
               container-width calc above, which derives the width from GRID_GAP. */}
            <div className="flex gap-x-[calc(16/1728*var(--vw))]">
              {columns.map((colItems, col) => (
                <div key={col} className="flex flex-col gap-[calc(16/1728*var(--vw))]">
                  {colItems.map((item, row) => {
                    const isTall = row % 2 === col % 2;
                    return (
                      <ShortGridTile
                        key={item.id}
                        id={item.id}
                        image={item.image}
                        title={item.title}
                        duration={item.duration}
                        views={item.views}
                        width={TILE_WIDTH}
                        height={isTall ? TILE_HEIGHT_TALL : TILE_HEIGHT_SHORT}
                        // API mode: seed the player queue before navigating
                        // (spread onto the Link, so preventDefault skips its nav).
                        onClick={
                          apiMode
                            ? (e) => {
                                e.preventDefault();
                                openReel(item);
                              }
                            : undefined
                        }
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            {/* seeMoreArrow is a single self-contained SVG, rendered as-is rather than
               decomposed, to match the exported asset exactly.
               TODO: missing API — no-op placeholder until pagination/more items exist. */}
            <button
              type="button"
              onClick={() => {}}
              aria-label="See more shorts"
              className="mx-auto mt-[calc(8/1728*var(--vw))] block cursor-pointer transition-opacity hover:opacity-80"
            >
              <img
                src={seeMoreArrow}
                alt="See more"
                className="h-[calc(54/1728*var(--vw))] w-[calc(133/1728*var(--vw))]"
              />
            </button>
          </section>
        </div>

        <aside className="flex w-[calc(380/1728*var(--vw))] shrink-0 flex-col gap-[calc(32/1728*var(--vw))]">
          {/* API mode: no LIVE flag exists on a rail heading image, so the badge is
             suppressed rather than invented; both cards seed the player queue. */}
          <LiveReelBanner
            data={liveReelPreview}
            showLive={!apiMode}
            onClick={
              apiMode
                ? (e) => {
                    e.preventDefault();
                    openFrom(forYouGrid, liveReelPreview);
                  }
                : undefined
            }
          />
          <TrendingNowSidebar
            items={trendingNow}
            onSelect={apiMode ? (item) => openFrom(trendingNow, item) : undefined}
          />
        </aside>
      </div>
    </div>
  );
}

export default ShortsPage;
