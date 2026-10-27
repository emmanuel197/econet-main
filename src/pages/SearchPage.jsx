import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import classNames from "../utils/classNames";
import SearchBar from "../components/shared/SearchBar";
import RecentSearchesSection from "../components/sections/search/RecentSearchesSection";
import TrendingSearchesSection from "../components/sections/search/TrendingSearchesSection";
import BrowseCategoriesSection from "../components/sections/search/BrowseCategoriesSection";
import GenreChipsRow from "../components/sections/search/GenreChipsRow";
import SearchResultsSection from "../components/sections/search/SearchResultsSection";
import {
  ShortQueryHint,
  SearchingLoader,
  ResultsSkeleton,
  ZeroResultsMessage,
  NetworkErrorMessage,
  AddedToast,
} from "../components/sections/search/SearchEdgeStates";
import SectionHeader from "../components/ui/SectionHeader";
import CompactPosterTile from "../components/cards/CompactPosterTile";
import searchRowIcon from "../../assets/icons/search-bar-search.svg";

import { searchFixtures } from "../data/searchFixtures";
import { genres } from "../data/homeFixtures";

const RECOMMENDED_PAGE_SIZE = 18; // three full rows of 6 (WONA comp)

const RECENT_STORAGE_KEY = "afriplay:recentSearches";
// Demo-only trigger for the network-error state (Figma 2883:11820) — there's no real
// network call to fail against yet, so typing this exact query simulates it. See
// wiki/pages/search-edge-cases.md.
const NETWORK_ERROR_DEMO_QUERY = "offline";
const SEARCH_DEBOUNCE_MS = 400;

// One stateful screen rather than separate routes — the Figma sheet is one continuous
// input → results flow, not distinct pages.
// DATA: no /api/search endpoint yet — filters searchFixtures.library client-side. Recent
// searches persist to localStorage (🔶 LIKELY per wiki, confirm with API contract once it
// exists).
function SearchPage() {
  const { trendingSearches, genreChips, library, recommended, bestResult, MIN_QUERY_LENGTH } = searchFixtures;

  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("q") || "");
  const [debouncedQuery, setDebouncedQuery] = useState(() => searchParams.get("q") || "");
  const [tab, setTab] = useState("all");
  const [recent, setRecent] = useState(() => {
    try {
      const stored = localStorage.getItem(RECENT_STORAGE_KEY);
      return stored ? JSON.parse(stored) : searchFixtures.recentSearches;
    } catch {
      return searchFixtures.recentSearches;
    }
  });
  const [toastVisible, setToastVisible] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [recommendedCount, setRecommendedCount] = useState(RECOMMENDED_PAGE_SIZE);

  const trimmed = query.trim();
  const isShortQuery = trimmed.length > 0 && trimmed.length < MIN_QUERY_LENGTH;
  const isNetworkError = trimmed.toLowerCase() === NETWORK_ERROR_DEMO_QUERY;
  // /search?loading=1 forces the skeleton so it can be viewed/demoed directly —
  // otherwise it only flashes during the 400ms debounce (or on a slow network once
  // a real API exists).
  const forcedLoading = searchParams.get("loading") === "1";
  const isSearching = forcedLoading || (trimmed.length >= MIN_QUERY_LENGTH && !isNetworkError && debouncedQuery !== trimmed);

  // Live matches for the autocomplete panel (uses the un-debounced query so
  // suggestions track every keystroke).
  const autocomplete = useMemo(() => {
    if (trimmed.length < MIN_QUERY_LENGTH) return { titles: [], items: [] };
    const needle = trimmed.toLowerCase();
    const items = library.filter((item) => item.title.toLowerCase().includes(needle));
    return { titles: items.slice(0, 3).map((i) => i.title), items: items.slice(0, 14) };
  }, [trimmed, library, MIN_QUERY_LENGTH]);

  // Debounce so the "Searching…" loader (Figma 2883:11587) has something to show.
  useEffect(() => {
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setDebouncedQuery("");
      return;
    }
    const t = setTimeout(() => setDebouncedQuery(trimmed), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [trimmed, MIN_QUERY_LENGTH]);

  useEffect(() => setTab("all"), [debouncedQuery]);

  // Keep the URL's ?q= in sync (documented route — see wiki/pages/search-results.md).
  // Landing → results (empty → query) is a real navigation, so it PUSHES — Back must
  // return to the search landing, not skip past it to the previous page. Subsequent
  // query edits replace so typing doesn't spam one history entry per keystroke.
  useEffect(() => {
    const current = searchParams.get("q") || "";
    if (debouncedQuery !== current) {
      const enteringResults = debouncedQuery && !current;
      setSearchParams(debouncedQuery ? { q: debouncedQuery } : {}, { replace: !enteringResults });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  // URL → state (browser back/forward): adopt the URL's q when it changes out from
  // under us, otherwise the state→URL effect above would immediately re-write the old
  // query and undo the Back.
  useEffect(() => {
    const urlQ = searchParams.get("q") || "";
    if (urlQ !== debouncedQuery) {
      setQuery(urlQ);
      setDebouncedQuery(urlQ);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const results = useMemo(() => {
    if (!debouncedQuery || isNetworkError) return [];
    const needle = debouncedQuery.toLowerCase();
    const matches = library.filter((item) => item.title.toLowerCase().includes(needle));
    return tab === "all" ? matches : matches.filter((item) => item.type === tab);
  }, [debouncedQuery, tab, isNetworkError, library]);

  const commitSearch = (label) => {
    setQuery(label);
    setRecent((prev) => {
      const next = [label, ...prev.filter((l) => l !== label)].slice(0, 6);
      try {
        localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* localStorage unavailable — non-fatal, recent list just won't persist */
      }
      return next;
    });
  };

  const removeRecent = (label) => {
    setRecent((prev) => {
      const next = prev.filter((l) => l !== label);
      try {
        localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* non-fatal */
      }
      return next;
    });
  };

  const clearAllRecent = () => {
    setRecent([]);
    try {
      localStorage.removeItem(RECENT_STORAGE_KEY);
    } catch {
      /* non-fatal */
    }
  };

  const showToast = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2200);
  };

  return (
    <div className="relative font-primary text-gray-1">
      <div className="flex flex-col gap-[calc(36/1728*var(--vw))] px-[calc(53/1728*var(--vw))] pt-[calc(160/1728*var(--vw))] pb-[calc(96/1728*var(--vw))]">
        <div
          className="relative flex flex-col gap-[calc(16/1728*var(--vw))]"
          onFocus={() => setInputFocused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setInputFocused(false);
          }}
        >
          {/* WONA comp has no "Search" page title — the bar is the first element. */}
          <SearchBar
            value={query}
            onChange={setQuery}
            onClear={() => setQuery("")}
            active={inputFocused}
            className="w-full"
            placeholder="Search movie by title, category or genre…"
            onKeyDown={(e) => {
              if (e.key === "Escape") setInputFocused(false);
              // Enter commits immediately: close the panel and skip the debounce so
              // results (or the skeleton, on a slow network) show right away.
              if (e.key === "Enter" && trimmed.length >= MIN_QUERY_LENGTH) {
                commitSearch(trimmed);
                setDebouncedQuery(trimmed);
                setInputFocused(false);
                e.currentTarget.blur();
              }
            }}
          />

          {/* Panel opens on every focus and hosts the whole in-panel flow: empty query →
             Recent/Trending · short query → hint · debounce pending → spinner · network
             error → Connection Error · no matches → zero results · else → autocomplete
             (title suggestions + matching posters). Flush under the bar, one black card. */}
          {inputFocused && (
            <>
              <div
                className="fixed inset-0 z-10 bg-black/60"
                aria-hidden="true"
                onClick={() => setInputFocused(false)}
              />
              {/* Glass panel — translucent + heavy blur so dimmed page content shows
                 through, matching the design's glassmorphism. Same surface as the
                 active SearchBar above it. */}
              <div className="absolute left-0 right-0 top-full z-20 flex flex-col gap-[calc(32/1728*var(--vw))] rounded-b-[calc(40/1728*var(--vw))] bg-black/70 backdrop-blur-2xl px-[calc(40/1728*var(--vw))] pt-[calc(32/1728*var(--vw))] pb-[calc(48/1728*var(--vw))] shadow-2xl">
                {trimmed === "" ? (
                  <>
                    <RecentSearchesSection
                      items={recent}
                      onSelect={(label) => {
                        commitSearch(label);
                        setInputFocused(false);
                      }}
                      onRemove={removeRecent}
                      onClearAll={clearAllRecent}
                    />
                    <TrendingSearchesSection
                      items={trendingSearches.slice(0, 5)}
                      title="Top 5 Trending Searches"
                      onSelect={(label) => {
                        commitSearch(label);
                        setInputFocused(false);
                      }}
                    />
                  </>
                ) : isShortQuery ? (
                  <ShortQueryHint minLength={MIN_QUERY_LENGTH} />
                ) : isNetworkError ? (
                  <NetworkErrorMessage onRetry={() => setQuery("")} />
                ) : debouncedQuery !== trimmed ? (
                  <SearchingLoader />
                ) : autocomplete.items.length === 0 ? (
                  <ZeroResultsMessage query={trimmed} />
                ) : (
                  <>
                    <div className="flex flex-col">
                      {[trimmed, ...autocomplete.titles.filter((t) => t.toLowerCase() !== trimmed.toLowerCase())].map((label) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => {
                            commitSearch(label);
                            setDebouncedQuery(label);
                            setInputFocused(false);
                          }}
                          className="flex items-center gap-[calc(12/1728*var(--vw))] rounded-lg px-[calc(6/1728*var(--vw))] py-[calc(10/1728*var(--vw))] cursor-pointer text-left transition-colors hover:bg-gray-1/5"
                        >
                          <img src={searchRowIcon} alt="" aria-hidden="true" className="size-[calc(16/1728*var(--vw))] opacity-60" />
                          <span className="font-primary text-base text-gray-1">{label}</span>
                        </button>
                      ))}
                    </div>
                    {autocomplete.items.length > 0 && (
                      <div className="flex flex-wrap gap-[calc(16/1728*var(--vw))]">
                        {autocomplete.items.map((item) => (
                          <CompactPosterTile
                            key={item.id}
                            image={item.image}
                            title={item.title}
                            className="w-[calc(200/1728*var(--vw))]"
                            onClick={() => {
                              commitSearch(item.title);
                              setDebouncedQuery(item.title);
                              setInputFocused(false);
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* ── Landing state (no query) ─────────────────────────────────── */}
        {trimmed === "" && !forcedLoading && (
          <div className="flex flex-col gap-[calc(40/1728*var(--vw))]">
              <GenreChipsRow items={genreChips} onSelect={commitSearch} />

              <BrowseCategoriesSection
                items={genres}
                onSelect={(cat) => commitSearch(cat.label)}
              />

              {/* Recommended TV Shows & Movies — compact tiles, 6 per row */}
              <section className="mt-[calc(20/1728*var(--vw))] flex flex-col gap-[calc(30/1728*var(--vw))]">
                <h2 className="font-primary font-semibold text-5xl text-gray-1">Recommended TV Shows & Movies</h2>
                {/* 6-column grid (not fixed widths): the page scrollbar eats ~15px, so six
                    fixed 253px tiles wrapped to five per row. */}
                <div className="grid grid-cols-6 gap-x-[calc(20/1728*var(--vw))] gap-y-[calc(30/1728*var(--vw))]">
                  {/* No click action yet — tiles route to the Movie/Series Details page
                     once it exists (per wiki/raw/api-docs.md); a fake "added" toast here
                     was misleading. */}
                  {recommended.slice(0, recommendedCount).map((item) => (
                    <CompactPosterTile key={item.id} image={item.image} title={item.title} className="w-full!" />
                  ))}
                </div>
                {recommendedCount < recommended.length ? (
                  <button
                    type="button"
                    onClick={() => setRecommendedCount((c) => Math.min(c + RECOMMENDED_PAGE_SIZE, recommended.length))}
                    className="mx-auto flex items-center gap-[calc(6/1728*var(--vw))] rounded-full bg-gray-1/30 px-[calc(20/1728*var(--vw))] py-[calc(16/1728*var(--vw))] font-primary text-xl font-medium text-gray-1 backdrop-blur-md cursor-pointer transition-colors hover:bg-gray-1/40"
                  >
                    <span aria-hidden="true">↓</span>
                    See More
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setRecommendedCount(RECOMMENDED_PAGE_SIZE)}
                    className="mx-auto flex items-center gap-[calc(6/1728*var(--vw))] rounded-full bg-gray-1/30 px-[calc(20/1728*var(--vw))] py-[calc(16/1728*var(--vw))] font-primary text-xl font-medium text-gray-1 backdrop-blur-md cursor-pointer transition-colors hover:bg-gray-1/40"
                  >
                    <span aria-hidden="true">↑</span>
                    See Less
                  </button>
                )}
              </section>

          </div>
        )}

        {/* ── Page-level edge states — suppressed while the panel is open, which
           shows the same states inline (screenshots: search-in-progress / zero
           results / network error all live in the panel). ─────────────────── */}
        {!inputFocused && isShortQuery && <ShortQueryHint minLength={MIN_QUERY_LENGTH} />}

        {!inputFocused && trimmed.length >= MIN_QUERY_LENGTH && isNetworkError && (
          <NetworkErrorMessage onRetry={() => setQuery("")} />
        )}

        {/* Slow-network results skeleton (also forced via /search?loading=1). */}
        {!inputFocused && isSearching && <ResultsSkeleton />}

        {/* ── Results / zero results ───────────────────────────────────── */}
        {trimmed.length >= MIN_QUERY_LENGTH && !isNetworkError && !isSearching && debouncedQuery && (
          results.length > 0 ? (
            <SearchResultsSection
              query={debouncedQuery}
              tab={tab}
              onTabChange={setTab}
              results={results}
              bestResult={bestResult}
              onAdd={showToast}
            />
          ) : (
            <ZeroResultsMessage
              query={debouncedQuery}
              suggestion={trendingSearches[0]?.label}
              onSuggestionClick={commitSearch}
            />
          )
        )}
      </div>

      <AddedToast visible={toastVisible} />
    </div>
  );
}

export default SearchPage;
