import React from "react";
import classNames from "../../../utils/classNames";
import CompactPosterTile from "../../cards/CompactPosterTile";
import ChannelCard from "../../cards/ChannelCard";
import PaginationDots from "../../ui/PaginationDots";

const TABS = [
  { id: "all", label: "All" },
  { id: "movie", label: "Movies" },
  { id: "show", label: "TV Shows" },
  { id: "channel", label: "TV Channels" },
];

// results are grouped by type into their own labeled section (Movies/TV Shows/TV
// Channels), each with its own count — matches the results reference even when a
// single tab is selected (that group just ends up the only one with items).
const GROUPS = [
  { type: "movie", label: "Movies" },
  { type: "show", label: "TV Shows" },
  { type: "channel", label: "TV Channels" },
];

// bestResult (the "Best Results" hero) only renders on the All tab of a real query.
// Order per the design: tabs directly under the search box → "Found N results" line
// → hero → grouped results.
const SearchResultsSection = ({ query, tab, onTabChange, results = [], bestResult, onAdd, className = "" }) => (
  <section className={classNames("flex flex-col gap-[calc(24/1728*var(--vw))]", className)}>
    <div className="flex items-center gap-[calc(8/1728*var(--vw))]">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onTabChange?.(t.id)}
          className={classNames(
            "rounded-full px-[calc(18/1728*var(--vw))] py-[calc(9/1728*var(--vw))] font-primary font-medium text-base cursor-pointer transition-colors",
            tab === t.id ? "bg-brand text-page" : "bg-gray-1/10 text-gray-1/70 hover:text-gray-1"
          )}
        >
          {t.label}
        </button>
      ))}
    </div>

    <p className="font-primary text-base text-gray-1/60">
      Found {results.length} result{results.length === 1 ? "" : "s"} for{" "}
      <span className="font-semibold text-gray-1">"{query}"</span>
    </p>

    {tab === "all" && bestResult && (
      <div className="relative h-[calc(420/1728*var(--vw))] w-full overflow-clip rounded-2xl">
        <img src={bestResult.backdrop} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-page via-page/30 to-transparent" />

        <span className="absolute left-[calc(24/1728*var(--vw))] top-[calc(24/1728*var(--vw))] rounded-md bg-navy-9/90 px-[calc(14/1728*var(--vw))] py-[calc(6/1728*var(--vw))] font-primary text-sm font-medium text-gray-1">
          Best Results
        </span>
        <button
          type="button"
          onClick={onAdd}
          aria-label="Add to My Stuff"
          className="absolute right-[calc(24/1728*var(--vw))] top-[calc(24/1728*var(--vw))] flex size-[calc(40/1728*var(--vw))] items-center justify-center rounded-full border border-gray-1/50 bg-black/40 font-primary text-xl leading-none text-gray-1 cursor-pointer hover:bg-black/60"
        >
          +
        </button>

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-[calc(14/1728*var(--vw))] p-[calc(32/1728*var(--vw))]">
          <img src={bestResult.titleArt} alt={bestResult.title} className="h-[calc(64/1728*var(--vw))] w-auto self-start object-contain" />
          <div className="flex items-center gap-[calc(12/1728*var(--vw))] font-primary text-lg text-gray-1/90">
            <span className="text-brand">★</span>
            <span>{bestResult.rating}</span>
            <span className="text-gray-1/40">|</span>
            <span>{bestResult.maturity}</span>
            <span className="text-gray-1/40">|</span>
            <span>{bestResult.year}</span>
          </div>
          <div className="flex items-center gap-[calc(10/1728*var(--vw))]">
            {bestResult.genres.map((g) => (
              <span
                key={g}
                className="rounded-full bg-black/40 px-[calc(14/1728*var(--vw))] py-[calc(6/1728*var(--vw))] font-primary text-sm text-gray-1/85"
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Decorative — a single fixture hero, no real carousel behind it yet. */}
        <PaginationDots count={4} activeIndex={0} className="absolute bottom-[calc(32/1728*var(--vw))] right-[calc(32/1728*var(--vw))]" />
      </div>
    )}

    <div className="flex flex-col gap-[calc(28/1728*var(--vw))]">
      {GROUPS.map(({ type, label }) => {
        const items = results.filter((item) => item.type === type);
        if (items.length === 0) return null;
        return (
          <div key={type} className="flex flex-col gap-[calc(16/1728*var(--vw))]">
            <h3 className="font-primary font-bold text-xl text-gray-1">
              {label} <span className="text-gray-1/50">({items.length})</span>
            </h3>
            {/* Tiles have no click action yet — they route to the Movie/Series Details
               page once it exists (per wiki/raw/api-docs.md). The "added" toast only
               belongs to the explicit My Stuff button on the hero above. */}
            <div className="flex flex-wrap gap-[calc(20/1728*var(--vw))]">
              {items.map((item) =>
                type === "channel" ? (
                  <ChannelCard key={item.id} image={item.image} title={item.title} />
                ) : (
                  <CompactPosterTile key={item.id} image={item.image} title={item.title} />
                )
              )}
            </div>
          </div>
        );
      })}
    </div>
  </section>
);

export default SearchResultsSection;
