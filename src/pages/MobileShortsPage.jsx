import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import classNames from "../utils/classNames";
import { fetchShortsContent, openAfrishortsPlayer } from "../api/shorts";
import { selectShorts, selectShortsLoading } from "../store/slice/shortsSlice";
import { shortsFixtures } from "../data/shortsFixtures";
import MobileNavActions from "../components/shared/MobileNavActions";

import arrowIcon from "../../assets/icons/home-afriplay-shorts-arrow-right.svg";

const CHIPS = ["For You", "Trending", "Sports", "Movies"];

// The page supplies its own header (the design's "WonaShorts" title replaces the logo),
// so the route runs with mobileTopBar="status" and MainLayout renders no bar here. The
// right-hand controls come from the SHARED cluster — this header used to hand-roll them,
// with a bell-labelled button that actually showed the avatar and did nothing on tap.
const WonaShortsHeader = () => (
  <div className="flex items-center justify-between">
    <span className="font-primary text-[calc(16/390*var(--mvw))] font-semibold text-brand">WonaShorts</span>
    <MobileNavActions />
  </div>
);

const skel = "animate-pulse rounded bg-gray-1/10";
const MobileShortsSkeleton = () => (
  <div className="flex flex-col gap-[calc(20/390*var(--mvw))]">
    <div className="flex items-center justify-between">
      <div className={classNames(skel, "h-[calc(20/390*var(--mvw))] w-[calc(110/390*var(--mvw))]")} />
      <div className={classNames(skel, "h-[calc(30/390*var(--mvw))] w-[calc(120/390*var(--mvw))] rounded-full")} />
    </div>
    <div className="flex gap-[calc(10/390*var(--mvw))]">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className={classNames("h-[calc(32/390*var(--mvw))] w-[calc(74/390*var(--mvw))] rounded-full", i === 0 ? "animate-pulse bg-brand/40" : skel)} />
      ))}
    </div>
    <div className="flex gap-[calc(12/390*var(--mvw))]">
      {[0, 1, 2, 3, 4].map((i) => <div key={i} className={classNames(skel, "size-[calc(62/390*var(--mvw))] rounded-full")} />)}
    </div>
    <div className={classNames(skel, "aspect-[16/9] w-full rounded-2xl")} />
    <div className={classNames(skel, "h-[calc(16/390*var(--mvw))] w-[calc(120/390*var(--mvw))]")} />
    <div className="flex gap-[calc(12/390*var(--mvw))]">
      {[0, 1, 2].map((i) => <div key={i} className={classNames(skel, "aspect-[3/4] flex-1 rounded-xl")} />)}
    </div>
    <div className={classNames(skel, "h-[calc(16/390*var(--mvw))] w-[calc(90/390*var(--mvw))]")} />
    <div className="grid grid-cols-2 gap-[calc(12/390*var(--mvw))]">
      {Array.from({ length: 4 }).map((_, i) => <div key={i} className={classNames(skel, "aspect-[4/3] rounded-xl")} />)}
    </div>
  </div>
);

// For You masonry tile — full column width (flex-1 ≈ 172 on the 390 comp), height
// alternates tall (200) / short (145) to form the brick layout; title overlaid on poster.
const ForYouTile = ({ item, tall, onOpen }) => (
  <button
    type="button"
    onClick={onOpen}
    className={classNames(
      "relative block w-full cursor-pointer overflow-clip rounded-xl text-left",
      tall ? "h-[calc(200/390*var(--mvw))]" : "h-[calc(145/390*var(--mvw))]"
    )}
  >
    <img src={item.image} alt={item.title} className="absolute inset-0 size-full object-cover" />
    {/* API content carries neither a duration nor a view count (the brief ignores counts),
       so both labels are conditional — otherwise they render as an empty pill / " views". */}
    {item.duration && (
      <span className="absolute right-[calc(8/390*var(--mvw))] top-[calc(8/390*var(--mvw))] rounded bg-black/60 px-[calc(6/390*var(--mvw))] py-[calc(2/390*var(--mvw))] font-primary text-[calc(8/390*var(--mvw))] font-semibold text-gray-1">
        {item.duration}
      </span>
    )}
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent px-[calc(10/390*var(--mvw))] pb-[calc(9/390*var(--mvw))] pt-[calc(26/390*var(--mvw))]">
      <p className="line-clamp-2 font-primary text-[calc(10/390*var(--mvw))] font-semibold text-gray-1/95">{item.title}</p>
      {item.views && (
        <p className="font-primary text-[calc(10/390*var(--mvw))] text-gray-4">{item.views} views</p>
      )}
    </div>
  </button>
);

/**
 * MobileShortsPage — mobile Wona Shorts feed (below md). WonaShorts header + filter chips +
 * circular rail + LIVE hero + Trending Now (ranked, horizontal) + For You 2-col grid.
 * Tiles/hero link to /shorts/:id (the player). The loading skeleton only shows on a slow
 * connection (Network Information API) or the /shorts?loading=1 demo — NOT on every visit.
 */
const isSlowConnection = () => {
  if (typeof navigator === "undefined") return false;
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!conn) return false;
  return conn.saveData === true || /(^|\b)(slow-2g|2g)$/.test(conn.effectiveType || "");
};

const MobileShortsPage = () => {
  const [searchParams] = useSearchParams();
  const forcedLoading = searchParams.get("loading") === "1";
  const navigate = useNavigate();

  // Same data flow as the desktop ShortsPage: rails categories/content from the
  // shorts slice (api/shorts.js), fixtures as the design/offline fallback.
  const api = useSelector(selectShorts);
  const apiLoading = useSelector(selectShortsLoading);
  useEffect(() => {
    fetchShortsContent();
  }, []);

  const apiMode = api.categories.length > 0;
  const shortsForYou = api.shortsForYou.length ? api.shortsForYou : shortsFixtures.shortsForYou;
  const forYouGrid = api.forYouGrid.length ? api.forYouGrid : shortsFixtures.forYouGrid;
  // Banner = the selected rail category's heading_image_id; Trending Now = the trending
  // rail's items (both resolved by live probe 2026-07-30 — the brief is silent on them;
  // see api/shorts.js). Fixtures stay the design-review fallback.
  const liveReelPreview = api.liveReelPreview ?? shortsFixtures.liveReelPreview;
  const trendingNow = api.trendingNow.length ? api.trendingNow : shortsFixtures.trendingNow;

  // Chips: API rail category names when resolved; fixture labels display-only.
  const chipLabels = apiMode
    ? api.categories.map((c) => c.name || c.title).filter(Boolean)
    : CHIPS;
  const [chip, setChip] = useState(null);
  const activeChip = chip ?? chipLabels[0];
  const handleChip = (label) => {
    setChip(label);
    if (!apiMode) return;
    const cat = api.categories.find((c) => (c.name || c.title) === label);
    if (cat) fetchShortsContent(cat.id);
  };

  // Brief: selecting an item plays its vertical trailer then continues through the same
  // category — so the queue is seeded from the list the item was clicked in. (Seeding
  // every click from forYouGrid would drop Trending items that aren't in it, and the
  // player redirects back out when its id isn't in the queue.)
  const openFrom = (list, item) => openAfrishortsPlayer(list, String(item.id), navigate);
  const openReel = (item) => openFrom(forYouGrid, item);

  // Skeleton for the INITIAL api load only (chip refetches keep the page
  // mounted, desktop pattern) + the ?loading=1 demo.
  const showSkeleton = forcedLoading || (apiLoading && !apiMode);

  return (
    <div className="min-h-screen font-primary text-gray-1">
      <div className="flex flex-col gap-[calc(20/390*var(--mvw))] px-[calc(16/390*var(--mvw))] pt-[calc(44/390*var(--mvw))] pb-[calc(120/390*var(--mvw))]">
        {showSkeleton ? (
          <MobileShortsSkeleton />
        ) : (
          <>
            <WonaShortsHeader />

            {/* Filter chips */}
            <div className="flex gap-[calc(10/390*var(--mvw))] overflow-x-auto scrollbar-hide">
              {chipLabels.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleChip(c)}
                  className={classNames(
                    "shrink-0 rounded-full px-[calc(16/390*var(--mvw))] py-[calc(8/390*var(--mvw))] font-primary text-[calc(12/390*var(--mvw))] leading-none transition-colors",
                    activeChip === c ? "bg-brand font-semibold text-gray-1" : "border border-gray-1/20 bg-gray-1/10 text-gray-1/70"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Circular rail */}
            <div className="flex gap-[calc(12/390*var(--mvw))] overflow-x-auto scrollbar-hide">
              {shortsForYou.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => openAfrishortsPlayer(shortsForYou, String(item.id), navigate)}
                  aria-label={`Play ${item.title || "short"}`}
                  className="size-[calc(62/390*var(--mvw))] shrink-0 cursor-pointer overflow-clip rounded-full border-2 border-brand/80"
                >
                  <img src={item.image} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>

            {/* Category cover banner. In API mode the image is the rail's
               heading_image_id, which carries no live/stream flag, no creator handle and
               no view count — so that chrome is suppressed rather than invented (matches
               the production app, which shows this card clean). Fixture mode keeps the
               full designed overlay for design review. See wiki open-questions #23. */}
            <button
              type="button"
              onClick={() => openFrom(forYouGrid, liveReelPreview)}
              aria-label={`Play ${liveReelPreview.title || "featured short"}`}
              className="relative block aspect-[16/9] w-full cursor-pointer overflow-clip rounded-2xl text-left"
            >
              <img src={liveReelPreview.image} alt={liveReelPreview.title} className="absolute inset-0 size-full object-cover" />
              {!apiMode && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute left-[calc(12/390*var(--mvw))] top-[calc(12/390*var(--mvw))] flex items-center gap-[calc(5/390*var(--mvw))] rounded-full bg-error-9 px-[calc(8/390*var(--mvw))] py-[calc(3/390*var(--mvw))] font-primary text-[calc(8/390*var(--mvw))] font-semibold text-gray-1">
                    <span className="size-[calc(4/390*var(--mvw))] rounded-full bg-gray-1" /> Live
                  </span>
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-[calc(8/390*var(--mvw))] p-[calc(12/390*var(--mvw))]">
                    <div className="flex min-w-0 flex-col gap-[calc(4/390*var(--mvw))]">
                      <span className="font-primary text-[calc(10/390*var(--mvw))] font-bold text-brand">{liveReelPreview.handle}</span>
                      <span className="font-primary text-[calc(12/390*var(--mvw))] font-semibold text-[#eef0f7]">{liveReelPreview.title}</span>
                    </div>
                    <span className="shrink-0 font-primary text-[calc(10/390*var(--mvw))] text-gray-4">{liveReelPreview.views}</span>
                  </div>
                </>
              )}
            </button>

            {/* Trending Now */}
            <section className="flex flex-col gap-[calc(12/390*var(--mvw))]">
              <div className="flex items-center gap-[calc(8/390*var(--mvw))]">
                <span className="h-[calc(16/390*var(--mvw))] w-[calc(3/390*var(--mvw))] rounded-full bg-brand" />
                <h2 className="flex-1 font-primary text-[calc(14/390*var(--mvw))] font-medium text-gray-1">Trending Now</h2>
                <img src={arrowIcon} alt="" aria-hidden="true" className="size-[calc(16/390*var(--mvw))]" />
              </div>
              <div className="flex gap-[calc(12/390*var(--mvw))] overflow-x-auto scrollbar-hide">
                {trendingNow.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openFrom(trendingNow, item)}
                    aria-label={`Play ${item.title || "short"}`}
                    className="relative block h-[calc(130/390*var(--mvw))] w-[calc(110/390*var(--mvw))] shrink-0 cursor-pointer overflow-clip rounded-xl text-left"
                  >
                    <img src={item.image} alt={item.title} className="absolute inset-0 size-full object-cover" />
                    <span className="absolute left-[calc(8/390*var(--mvw))] top-[calc(8/390*var(--mvw))] flex size-[calc(22/390*var(--mvw))] items-center justify-center rounded-full bg-[#ec1882] font-primary text-[calc(12/390*var(--mvw))] font-semibold text-[#060a16]">
                      {item.rank}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-[calc(8/390*var(--mvw))] pb-[calc(8/390*var(--mvw))] pt-[calc(20/390*var(--mvw))]">
                      <p className="line-clamp-2 font-primary text-[calc(10/390*var(--mvw))] font-semibold leading-tight text-gray-1">{item.title}</p>
                      {/* Brief: view counts are ignored for API content — `views` is ""
                         there, so the label only renders for fixtures. */}
                      {item.views && (
                        <p className="mt-[calc(2/390*var(--mvw))] font-primary text-[calc(9/390*var(--mvw))] text-gray-1">{item.views}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* For You — 2-column brick masonry. Left column starts tall (200), right
               column starts short (145); each alternates, so tall/short checkerboard and
               both columns end level. */}
            <section className="flex flex-col gap-[calc(12/390*var(--mvw))]">
              <h2 className="font-primary text-[calc(16/390*var(--mvw))] font-semibold text-gray-1">For You</h2>
              <div className="flex gap-[calc(12/390*var(--mvw))]">
                <div className="flex flex-1 flex-col gap-[calc(12/390*var(--mvw))]">
                  {forYouGrid.filter((_, i) => i % 2 === 0).map((item, j) => (
                    <ForYouTile key={item.id} item={item} tall={j % 2 === 0} onOpen={() => openReel(item)} />
                  ))}
                </div>
                <div className="flex flex-1 flex-col gap-[calc(12/390*var(--mvw))]">
                  {forYouGrid.filter((_, i) => i % 2 === 1).map((item, j) => (
                    <ForYouTile key={item.id} item={item} tall={j % 2 === 1} onOpen={() => openReel(item)} />
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileShortsPage;
