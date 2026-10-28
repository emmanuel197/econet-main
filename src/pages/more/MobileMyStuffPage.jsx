import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { USE_FIXTURES } from "../../utils/devFlags";
import { showPreviewNotice } from "../../utils/toast";
import { goToDetails } from "../../utils/contentNavigation";
import { fetchWatchlist } from "../../api/fetchMoviesApi";
import { m, PhoneColumn } from "../../components/sections/tvod/TvodUi";
import { ScreenHeader, FilterTabs, SortMenu, Section, PosterTile, EmptyState, usePreviewEmpty } from "../../components/sections/more/MoreUi";
import { savedPremiereIds } from "../../components/sections/premiere/PremiereUi";
import PremiereCard from "../../components/cards/PremiereCard";
import { getPremiereTitle } from "../../data/premiereFixtures";
import { myStuffSample, myStuffSamplePremieres } from "../../data/moreFixtures";

/**
 * MobileMyStuffPage (/my-stuff below md) — WONA comps More8–More13: back header, All /
 * Movies / Tv Shows / Premieres filter, "Sort by — Date Added" menu, then Movies, TV Shows
 * and Premieres rows with counts. A single filter shows that section as a 3-up grid.
 * Nothing saved → the "Your list is empty" state (More13).
 * Movies/shows come from the bookmarks API (sample titles in sample mode); premieres are
 * the ones saved on this device from the premiere pages.
 */
const TABS = [
  { id: "all", label: "All" },
  { id: "movie", label: "Movies" },
  { id: "series", label: "Tv Shows" },
  { id: "premiere", label: "Premieres" },
];

const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true" style={{ width: m(30), height: m(30) }}>
    <path d="M12 4v16M4 12h16" />
  </svg>
);

// Bookmarks API card → the shape this page sorts and renders
const fromWatchlist = (card, i) => ({
  id: String(card.id),
  title: card.title,
  type: (card.type || card.raw?.type || card.contentType) === "series" ? "series" : "movie",
  poster: card.image,
  addedAt: -i, // the API returns newest first
  card,
});

const sorters = {
  added: (a, b) => (b.addedAt ?? 0) - (a.addedAt ?? 0),
  title: (a, b) => a.title.localeCompare(b.title),
};

const MobileMyStuffPage = () => {
  const navigate = useNavigate();
  const previewEmpty = usePreviewEmpty();
  const [tab, setTab] = useState("all");
  const [sort, setSort] = useState("added");
  const [items, setItems] = useState(USE_FIXTURES ? myStuffSample : null); // null = loading
  const premiereIds = useMemo(
    () => [...new Set([...(USE_FIXTURES ? myStuffSamplePremieres : []), ...savedPremiereIds()])],
    []
  );

  useEffect(() => {
    if (USE_FIXTURES) return undefined;
    let alive = true;
    fetchWatchlist().then((cards) => alive && setItems(cards.map(fromWatchlist)));
    return () => {
      alive = false;
    };
  }, []);

  const open = (item) => {
    if (item.tvodId) navigate(`/tvod/${item.tvodId}`);
    else if (item.card) goToDetails(navigate, item.card);
    else showPreviewNotice();
  };

  const sorted = (list) => [...list].sort(sorters[sort]);
  const movies = sorted((items || []).filter((i) => i.type === "movie"));
  const shows = sorted((items || []).filter((i) => i.type === "series"));
  const premieres = premiereIds.map(getPremiereTitle).filter(Boolean);
  if (sort === "title") premieres.sort(sorters.title);

  const empty = previewEmpty || (items && !movies.length && !shows.length && !premieres.length);
  const single = tab !== "all";
  const sections = [
    { id: "movie", title: "Movies", list: movies },
    { id: "series", title: "TV Shows", list: shows },
    { id: "premiere", title: "Premieres", list: premieres },
  ].filter((s) => (single ? s.id === tab : s.list.length));

  return (
    <PhoneColumn style={{ paddingBottom: m(24) }}>
      <ScreenHeader title="My Stuff" />
      {empty ? (
        <EmptyState
          icon={<IconPlus />}
          title="Your list is empty"
          body="Tap the + button on any movie, show, or premiere to save it here for later."
          howToTitle="How to add to My Stuff"
          steps={[
            "Open any movie, Tv show, or premiere",
            <>
              Tap the <b className="text-[#c2b801]">+ My Stuff</b> button next to the play button
            </>,
            "It appears here and you can watch whenever you're ready",
          ]}
        />
      ) : (
        <>
          <div style={{ padding: `0 ${m(21)}` }}>
            <FilterTabs tabs={TABS} value={tab} onChange={setTab} />
            <div className="flex items-center justify-between" style={{ marginTop: m(12) }}>
              <span className="font-primary text-gray-1/80" style={{ fontSize: m(12) }}>Sort by</span>
              <SortMenu value={sort} onChange={setSort} />
            </div>
          </div>

          <div className="flex flex-col" style={{ gap: m(36), marginTop: m(28) }}>
            {items === null ? (
              <p className="text-center font-primary text-gray-1/50" style={{ fontSize: m(13) }}>Loading…</p>
            ) : (
              sections.map((s) => (
                <Section key={s.id} title={s.title} count={s.list.length} grid={single} onMore={single ? undefined : () => setTab(s.id)}>
                  {s.list.length === 0 ? (
                    <p className="col-span-3 font-primary text-gray-1/50" style={{ fontSize: m(13) }}>Nothing saved here yet.</p>
                  ) : s.id === "premiere" ? (
                    s.list.map((t) => <PremiereCard key={t.id} title={t} className={single ? "aspect-[118/182] !h-auto !w-full" : ""} />)
                  ) : (
                    s.list.map((i) => <PosterTile key={i.id} title={i.title} image={i.poster} fluid={single} onClick={() => open(i)} />)
                  )}
                </Section>
              ))
            )}
          </div>
        </>
      )}
    </PhoneColumn>
  );
};

export default MobileMyStuffPage;
