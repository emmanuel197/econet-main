import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import classNames from "../utils/classNames";
import { searchFixtures } from "../data/searchFixtures";
import { genres } from "../data/homeFixtures";

import searchIcon from "../../assets/icons/search-bar-search.svg";
import clearIcon from "../../assets/icons/search-mobile-clear-cancel.svg";
import clockIcon from "../../assets/icons/search-edge-recent-searches-recent-search.svg";
import removeIcon from "../../assets/icons/search-edge-recent-searches-close-light.svg";
import chevronIcon from "../../assets/icons/search-trending-searches-sort.svg";
import seeMoreIcon from "../../assets/icons/search-edge-recent-searches-see-more-chevron.svg";
import trendArrow from "../../assets/icons/search-mobile-trending-row-arrow.svg";
import spinnerIcon from "../../assets/icons/search-edge-searching-loader-searching-spinner.svg";
import zeroIcon from "../../assets/icons/search-edge-zero-results-message-no-results-info.svg";
import wifiErrorIcon from "../../assets/icons/search-edge-connection-error-message-wifi-error.svg";
import bestResultBg from "../../assets/images/search-mobile-best-results-featured-backdrop.webp";
import ntaLogo from "../../assets/logos/search-mobile-nta-advertiser-logo.webp";

const RECENT_KEY = "afriplay:recentSearches";
const RECENT_VISIBLE = 5;
const DEBOUNCE_MS = 400;
const NETWORK_ERROR_DEMO = "offline";
const { MIN_QUERY_LENGTH: MIN, library, trendingSearches, browseCategories, bestResult } = searchFixtures;

// Browse By Categories (focus panel): Home genres (5) + search-only set (4) = 9.
const CATEGORIES = [...genres, ...browseCategories];

const RESULT_GROUPS = [
  { type: "movie", label: "Movies" },
  { type: "show", label: "Tv Shows" },
  { type: "channel", label: "TV Channels" },
];
const RESULT_TABS = [{ id: "all", label: "All" }, ...RESULT_GROUPS.map((g) => ({ id: g.type, label: g.label }))];
const pad2 = (n) => String(n).padStart(2, "0");

const MobilePosterTile = ({ item, onClick }) => (
  <button type="button" onClick={onClick} className="aspect-[2/3] overflow-clip rounded-[calc(10/390*var(--mvw))] border border-brand/70 cursor-pointer">
    <img src={item.image} alt={item.title} className="size-full object-cover" />
  </button>
);

const MobileChannelTile = ({ item, onClick }) => (
  <button type="button" onClick={onClick} className="aspect-[3/2] overflow-clip rounded-[calc(10/390*var(--mvw))] border border-brand/70 cursor-pointer">
    <img src={item.image} alt={item.title} className="size-full object-cover" />
  </button>
);

// Featured/sponsored card at the top of the All view (Advertisement + NTA logo).
const MobileBestResult = () => (
  <div className="relative aspect-[350/290] w-full overflow-clip rounded-2xl">
    <img src={bestResultBg} alt="" className="absolute inset-0 size-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
    <span className="absolute left-0 top-[calc(16/390*var(--mvw))] rounded-r-md bg-[#da1375] px-[calc(14/390*var(--mvw))] py-[calc(6/390*var(--mvw))] font-primary text-[calc(12/390*var(--mvw))] font-medium text-gray-1">
      Best Results
    </span>
    <img src={ntaLogo} alt="NTA" className="absolute bottom-[calc(20/390*var(--mvw))] right-[calc(18/390*var(--mvw))] h-[calc(34/390*var(--mvw))] w-auto object-contain" />
    <div className="absolute inset-x-0 bottom-0 flex flex-col gap-[calc(8/390*var(--mvw))] p-[calc(18/390*var(--mvw))]">
      {bestResult.titleArt ? (
        <img src={bestResult.titleArt} alt={bestResult.title} className="h-[calc(52/390*var(--mvw))] w-auto self-start object-contain" />
      ) : (
        <h3 className="font-primary text-[calc(24/390*var(--mvw))] font-bold text-gray-1">{bestResult.title}</h3>
      )}
      <span className="font-primary text-[calc(12/390*var(--mvw))] font-medium text-gray-1/80">Advertisement</span>
      <div className="flex items-center gap-[calc(8/390*var(--mvw))] font-primary text-[calc(12/390*var(--mvw))] text-gray-1/85">
        {bestResult.genres.map((g, i) => (
          <React.Fragment key={g}>
            {i > 0 && <span className="text-brand">•</span>}
            <span>{g}</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  </div>
);

const MobileResultsSkeleton = () => (
  <div className="flex flex-col gap-[calc(20/390*var(--mvw))]">
    <div className="flex gap-[calc(8/390*var(--mvw))]">
      {RESULT_TABS.map((t, i) => (
        <span key={t.id} className={classNames("rounded-full px-[calc(15/390*var(--mvw))] py-[calc(7/390*var(--mvw))] font-primary text-[calc(13/390*var(--mvw))] font-medium leading-none", i === 0 ? "bg-brand text-page" : "bg-gray-1/10 text-gray-1/70")}>{t.label}</span>
      ))}
    </div>
    <div className="h-[calc(16/390*var(--mvw))] w-[calc(90/390*var(--mvw))] animate-pulse rounded bg-gray-1/10" />
    <div className="aspect-[350/290] w-full animate-pulse rounded-2xl bg-gray-1/10" />
    <div className="h-[calc(16/390*var(--mvw))] w-[calc(90/390*var(--mvw))] animate-pulse rounded bg-gray-1/10" />
    <div className="grid grid-cols-3 gap-[calc(12/390*var(--mvw))]">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="aspect-[2/3] animate-pulse rounded-[calc(10/390*var(--mvw))] bg-gray-1/10" />
      ))}
    </div>
  </div>
);

/**
 * MobileSearchPage (below md). DEFAULT landing = browse view: filter tabs + Best Results
 * hero + Movies/Tv Shows/TV Channels grids (all catalog content). FOCUS (tap the box) =
 * Recent Searches + Top 5 Trending + Browse By Categories. Typing → spinner → autocomplete
 * → committed results (same tabbed view, query-filtered). Recent persists to the shared key.
 */
const MobileSearchPage = () => {
  const [searchParams] = useSearchParams();
  const forcedLoading = searchParams.get("loading") === "1";

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [committed, setCommitted] = useState(false);
  const [tab, setTab] = useState("all");
  const [focused, setFocused] = useState(false);
  const [recent, setRecent] = useState(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      return stored ? JSON.parse(stored) : searchFixtures.recentSearches;
    } catch {
      return searchFixtures.recentSearches;
    }
  });
  const [recentExpanded, setRecentExpanded] = useState(false);
  const [trendingOpen, setTrendingOpen] = useState(true);
  const [resultsLoading, setResultsLoading] = useState(false);
  const loadTimer = useRef(null);
  useEffect(() => () => clearTimeout(loadTimer.current), []);

  const trimmed = query.trim();
  const isNetworkError = trimmed.toLowerCase() === NETWORK_ERROR_DEMO;
  const longEnough = trimmed.length >= MIN;
  const debouncePending = longEnough && !isNetworkError && debouncedQuery !== trimmed;

  useEffect(() => {
    if (!longEnough) {
      setDebouncedQuery("");
      return;
    }
    const t = setTimeout(() => setDebouncedQuery(trimmed), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [trimmed, longEnough]);

  const matches = useMemo(() => {
    if (!longEnough || isNetworkError) return [];
    const needle = trimmed.toLowerCase();
    return library.filter((i) => i.title.toLowerCase().includes(needle));
  }, [trimmed, longEnough, isNetworkError]);

  const suggestions = useMemo(() => {
    const seen = new Set();
    return matches
      .map((m) => m.title)
      .filter((t) => (seen.has(t.toLowerCase()) ? false : seen.add(t.toLowerCase())))
      .slice(0, 3);
  }, [matches]);

  const persist = (next) => {
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* non-fatal */
    }
  };
  const rememberSearch = (label) => persist([label, ...recent.filter((l) => l !== label)].slice(0, 12));

  const onType = (v) => {
    setQuery(v);
    setCommitted(false);
  };
  const commit = (label) => {
    setQuery(label);
    setDebouncedQuery(label.trim());
    setCommitted(true);
    setTab("all");
    if (label.trim().length >= MIN) rememberSearch(label);
    setResultsLoading(true);
    clearTimeout(loadTimer.current);
    loadTimer.current = setTimeout(() => setResultsLoading(false), 600);
  };
  const clearQuery = () => {
    setQuery("");
    setCommitted(false);
  };
  const removeRecent = (label) => persist(recent.filter((l) => l !== label));
  const clearAllRecent = () => persist([]);

  const trending = trendingSearches.slice(0, 5);
  const visibleRecent = recentExpanded ? recent : recent.slice(0, RECENT_VISIBLE);

  // Tabbed browse/results view (shared by the default landing and committed results).
  // queryLabel truthy → show the "Found N results for …" line; null → plain browse.
  const renderTabbedContent = (items, queryLabel) => {
    const activeLabel = RESULT_TABS.find((t) => t.id === tab)?.label ?? "All";
    const filtered = tab === "all" ? items : items.filter((m) => m.type === tab);
    const renderGroup = (type, label, list) => (
      <section key={type} className="flex flex-col gap-[calc(12/390*var(--mvw))]">
        <h2 className="font-primary text-[calc(16/390*var(--mvw))] font-bold text-gray-1">
          {label} <span className="text-gray-1/50">({pad2(list.length)})</span>
        </h2>
        <div className={classNames("grid gap-[calc(12/390*var(--mvw))]", type === "channel" ? "grid-cols-2" : "grid-cols-3")}>
          {list.map((item) => (type === "channel" ? <MobileChannelTile key={item.id} item={item} /> : <MobilePosterTile key={item.id} item={item} />))}
        </div>
      </section>
    );
    return (
      <div className="flex flex-col gap-[calc(20/390*var(--mvw))]">
        <div className="flex gap-[calc(8/390*var(--mvw))]">
          {RESULT_TABS.map((t) => (
            <button key={t.id} type="button" onClick={() => setTab(t.id)} className={classNames("rounded-full px-[calc(15/390*var(--mvw))] py-[calc(7/390*var(--mvw))] font-primary text-[calc(13/390*var(--mvw))] font-medium leading-none transition-colors", tab === t.id ? "bg-brand text-page" : "bg-gray-1/10 text-gray-1/70")}>
              {t.label}
            </button>
          ))}
        </div>
        {queryLabel && (
          <p className="font-primary text-[calc(13/390*var(--mvw))] text-gray-1/55">
            Found {pad2(filtered.length)} results for <span className="text-gray-1">"{queryLabel}"</span>
            {tab !== "all" && <> in {activeLabel}</>}
          </p>
        )}
        {filtered.length === 0 ? (
          <p className="py-[calc(60/390*var(--mvw))] text-center font-primary text-[calc(13/390*var(--mvw))] text-gray-1/50">
            No {tab === "all" ? "" : `${activeLabel} `}results{queryLabel ? ` for "${queryLabel}"` : ""}.
          </p>
        ) : tab === "all" ? (
          <>
            <MobileBestResult />
            {RESULT_GROUPS.map(({ type, label }) => {
              const list = items.filter((m) => m.type === type);
              return list.length ? renderGroup(type, label, list) : null;
            })}
          </>
        ) : (
          renderGroup(tab, activeLabel, filtered)
        )}
      </div>
    );
  };

  const trendingSection = (
    <section className="flex flex-col gap-[calc(4/390*var(--mvw))]">
      <div className="flex items-center justify-between">
        <h2 className="font-primary text-[calc(17/390*var(--mvw))] font-bold text-gray-1">Top 5 Trending Searches</h2>
        <button type="button" onClick={() => setTrendingOpen((v) => !v)} aria-label={trendingOpen ? "Hide trending searches" : "Show trending searches"} aria-expanded={trendingOpen} className="flex size-[calc(28/390*var(--mvw))] items-center justify-center cursor-pointer">
          <img src={chevronIcon} alt="" aria-hidden="true" className={classNames("size-[calc(16/390*var(--mvw))]", trendingOpen ? "rotate-90" : "-rotate-90")} />
        </button>
      </div>
      {trendingOpen && (
        <div className="flex flex-col">
          {trending.map((item, i) => (
            <button key={item.id} type="button" onClick={() => commit(item.label)} className="flex items-center gap-[calc(16/390*var(--mvw))] border-b border-gray-1/10 py-[calc(13/390*var(--mvw))] cursor-pointer">
              <span
                className="w-[calc(26/390*var(--mvw))] shrink-0 text-left font-primary text-[calc(28/390*var(--mvw))] font-bold leading-none"
                style={{ color: "transparent", WebkitTextStroke: "1.4px var(--color-brand)", paintOrder: "stroke" }}
              >
                {i + 1}
              </span>
              <span className="min-w-0 flex-1 truncate text-left font-primary text-[calc(14/390*var(--mvw))] text-gray-1">{item.label}</span>
              <img src={trendArrow} alt="" aria-hidden="true" className="size-[calc(16/390*var(--mvw))] shrink-0 opacity-70" />
            </button>
          ))}
        </div>
      )}
    </section>
  );

  // Focus panel — shown only while the box is focused + empty. mousedown-preventDefault
  // keeps the input focused so item clicks register (commit) instead of blurring first.
  const focusPanel = (
    <div onMouseDown={(e) => e.preventDefault()} className="flex flex-col gap-[calc(24/390*var(--mvw))]">
      {recent.length > 0 && (
        <section className="flex flex-col gap-[calc(4/390*var(--mvw))]">
          <div className="flex items-center justify-between">
            <h2 className="font-primary text-[calc(17/390*var(--mvw))] font-bold text-gray-1">Recent Searches</h2>
            <button type="button" onClick={clearAllRecent} className="font-primary text-[calc(13/390*var(--mvw))] font-medium text-brand cursor-pointer">Clear All</button>
          </div>
          <div className="flex flex-col">
            {visibleRecent.map((label) => (
              <div key={label} className="flex items-center gap-[calc(12/390*var(--mvw))] py-[calc(11/390*var(--mvw))]">
                <img src={clockIcon} alt="" aria-hidden="true" className="size-[calc(16/390*var(--mvw))] opacity-60" />
                <button type="button" onClick={() => commit(label)} className="min-w-0 flex-1 truncate text-left font-primary text-[calc(14/390*var(--mvw))] text-gray-1 cursor-pointer">{label}</button>
                <button type="button" onClick={() => removeRecent(label)} aria-label={`Remove ${label} from recent searches`} className="shrink-0 cursor-pointer opacity-50 hover:opacity-100">
                  <img src={removeIcon} alt="" aria-hidden="true" className="size-[calc(14/390*var(--mvw))]" />
                </button>
              </div>
            ))}
          </div>
          {recent.length > RECENT_VISIBLE && (
            <button type="button" onClick={() => setRecentExpanded((v) => !v)} className="mx-auto flex items-center gap-[calc(5/390*var(--mvw))] py-[calc(6/390*var(--mvw))] font-primary text-[calc(13/390*var(--mvw))] font-medium text-brand cursor-pointer">
              {recentExpanded ? "See Less" : "See More"}
              <img src={seeMoreIcon} alt="" aria-hidden="true" className={classNames("size-[calc(13/390*var(--mvw))]", recentExpanded && "rotate-180")} />
            </button>
          )}
          <div className="mt-[calc(6/390*var(--mvw))] h-px w-full bg-gray-1/12" />
        </section>
      )}

      {trendingSection}

      <section className="flex flex-col gap-[calc(14/390*var(--mvw))]">
        <h2 className="font-primary text-[calc(17/390*var(--mvw))] font-bold text-gray-1">Browse By Categories</h2>
        <div className="grid grid-cols-3 gap-[calc(10/390*var(--mvw))]">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} type="button" onClick={() => commit(cat.label)} className="relative aspect-[105/84] overflow-clip rounded-[calc(10/390*var(--mvw))] cursor-pointer">
              <img src={cat.image} alt={cat.label} className="absolute inset-0 size-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <span className="absolute bottom-[calc(8/390*var(--mvw))] left-[calc(8/390*var(--mvw))] font-primary text-[calc(12/390*var(--mvw))] font-semibold text-gray-1">{cat.label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );

  // ── body state ───────────────────────────────────────────────────────────
  let body;
  if (forcedLoading) {
    body = <MobileResultsSkeleton />;
  } else if (isNetworkError && longEnough) {
    body = (
      <div className="flex flex-col items-center gap-[calc(12/390*var(--mvw))] py-[calc(80/390*var(--mvw))] text-center">
        <img src={wifiErrorIcon} alt="" aria-hidden="true" className="size-[calc(40/390*var(--mvw))]" />
        <h3 className="font-primary text-[calc(16/390*var(--mvw))] font-semibold text-gray-1">Connection Error</h3>
        <p className="max-w-[calc(260/390*var(--mvw))] font-primary text-[calc(13/390*var(--mvw))] text-gray-1/60">We couldn't reach the server. Check your connection and try again.</p>
        <button type="button" onClick={clearQuery} className="mt-[calc(4/390*var(--mvw))] flex items-center gap-[calc(6/390*var(--mvw))] rounded-full bg-brand px-[calc(22/390*var(--mvw))] py-[calc(9/390*var(--mvw))] font-primary text-[calc(13/390*var(--mvw))] font-medium text-page cursor-pointer">
          <span aria-hidden="true">⟳</span> Try Again
        </button>
      </div>
    );
  } else if (trimmed === "") {
    // empty: focused → recent/trending/categories; otherwise → default browse
    body = focused ? focusPanel : renderTabbedContent(library, null);
  } else if (trimmed.length < MIN) {
    body = null;
  } else if (committed && resultsLoading) {
    body = <MobileResultsSkeleton />;
  } else if (debouncePending) {
    body = (
      <div className="flex flex-col items-center gap-[calc(14/390*var(--mvw))] py-[calc(90/390*var(--mvw))]">
        <img src={spinnerIcon} alt="" aria-hidden="true" className="size-[calc(36/390*var(--mvw))] animate-spin" />
        <p className="font-primary text-[calc(13/390*var(--mvw))] text-gray-1/60">Searching…</p>
      </div>
    );
  } else if (matches.length === 0) {
    const suggestion = trending[0]?.label;
    body = (
      <div className="flex flex-col gap-[calc(28/390*var(--mvw))]">
        <div className="flex flex-col items-center gap-[calc(12/390*var(--mvw))] pt-[calc(30/390*var(--mvw))] text-center">
          <img src={zeroIcon} alt="" aria-hidden="true" className="size-[calc(40/390*var(--mvw))]" />
          <p className="font-primary text-[calc(14/390*var(--mvw))] text-gray-1/60">
            No results for<br /><span className="font-semibold text-brand">"{trimmed}"</span>
          </p>
          {suggestion && (
            <button type="button" onClick={() => commit(suggestion)} className="rounded-md bg-gray-1/12 px-[calc(14/390*var(--mvw))] py-[calc(7/390*var(--mvw))] font-primary text-[calc(12/390*var(--mvw))] text-gray-1/80 cursor-pointer">
              Did you mean: <span className="font-semibold text-gray-1 underline">"{suggestion}?"</span>
            </button>
          )}
        </div>
        <div className="h-px w-full bg-gray-1/12" />
        {trendingSection}
      </div>
    );
  } else if (committed) {
    body = renderTabbedContent(matches, trimmed);
  } else {
    body = (
      <div className="flex flex-col gap-[calc(18/390*var(--mvw))]">
        <div className="flex flex-col">
          {suggestions.map((s) => (
            <button key={s} type="button" onClick={() => commit(s)} className="flex items-center gap-[calc(12/390*var(--mvw))] border-b border-gray-1/10 py-[calc(12/390*var(--mvw))] cursor-pointer">
              <img src={searchIcon} alt="" aria-hidden="true" className="size-[calc(15/390*var(--mvw))] opacity-60" />
              <span className="min-w-0 flex-1 truncate text-left font-primary text-[calc(14/390*var(--mvw))] text-gray-1">{s}</span>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-[calc(12/390*var(--mvw))]">
          {matches.map((item) => <MobilePosterTile key={item.id} item={item} onClick={() => commit(item.title)} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-primary text-gray-1">
      {/* pt clears MainLayout's fixed MobileTopBar (14px reservation + 32px row); the
         search field is this page's own top control, not a header, so the app bar sits
         above it. */}
      <div className="flex flex-col gap-[calc(24/390*var(--mvw))] px-[calc(20/390*var(--mvw))] pt-[calc(62/390*var(--mvw))] pb-[calc(120/390*var(--mvw))]">
        <div className="flex h-[calc(52/390*var(--mvw))] items-center gap-[calc(12/390*var(--mvw))] rounded-full border border-gray-1/15 bg-gray-1/10 px-[calc(20/390*var(--mvw))] transition-colors focus-within:border-brand">
          <img src={searchIcon} alt="" aria-hidden="true" className="size-[calc(18/390*var(--mvw))] opacity-70" />
          <input
            value={query}
            onChange={(e) => onType(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") e.currentTarget.blur();
              if (e.key === "Enter" && trimmed.length >= MIN) {
                commit(trimmed);
                e.currentTarget.blur();
              }
            }}
            placeholder="Search for movies, shows, genres"
            className="min-w-0 flex-1 bg-transparent font-primary text-[calc(14/390*var(--mvw))] text-gray-1 placeholder:text-gray-1/50 outline-none"
          />
          {query && (
            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={clearQuery} aria-label="Clear search" className="shrink-0 cursor-pointer opacity-70">
              <img src={clearIcon} alt="" aria-hidden="true" className="size-[calc(16/390*var(--mvw))]" />
            </button>
          )}
        </div>

        {body}
      </div>
    </div>
  );
};

export default MobileSearchPage;
