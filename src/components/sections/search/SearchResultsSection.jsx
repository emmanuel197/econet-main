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
  { type: "show", label: "Tv Shows" },
  { type: "channel", label: "Tv Channels" },
];

// bestResult (the "Best Results" hero) only renders on the All tab of a real query.
// Order per the design: tabs directly under the search box → "Found N results" line
// → hero → grouped results.
const SearchResultsSection = ({ query, tab, onTabChange, results = [], bestResult, onAdd, className = "" }) => (
  <section className={classNames("flex flex-col", className)}>
    <div className="flex items-center gap-[calc(16/1728*var(--vw))]">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onTabChange?.(t.id)}
          className={classNames(
            "rounded-[20px] px-[calc(16/1728*var(--vw))] py-[calc(8/1728*var(--vw))] font-primary text-xl cursor-pointer transition-colors",
            tab === t.id ? "border-[0.5px] border-gray-1 bg-brand font-medium text-gray-1" : "bg-gray-1/10 text-gray-1/70 hover:text-gray-1"
          )}
        >
          {t.label}
        </button>
      ))}
    </div>

    <p className="mt-[calc(40/1728*var(--vw))] font-primary text-2xl font-semibold text-gray-1">
      Found {results.length} result{results.length === 1 ? "" : "s"} for ”{query}”
    </p>

    {tab === "all" && bestResult && (
      <div className="relative mx-[calc(56/1728*var(--vw))] mt-[calc(32/1728*var(--vw))] h-[calc(550/1728*var(--vw))] overflow-clip rounded-[calc(24/1728*var(--vw))] border-2 border-[#e1e7f8]">
        <img src={bestResult.backdrop} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-40% to-black" />

        <span className="absolute left-[calc(37/1728*var(--vw))] top-0 rounded-b-[calc(6/1728*var(--vw))] border border-t-0 border-brand bg-gradient-to-b from-[#0e152c] to-[#2a4086] px-[calc(12/1728*var(--vw))] py-[calc(10/1728*var(--vw))] font-primary text-lg font-medium text-gray-1">
          Best Results
        </span>
        <button
          type="button"
          onClick={onAdd}
          aria-label="Add to My Stuff"
          className="absolute right-[calc(10/1728*var(--vw))] top-[calc(10/1728*var(--vw))] flex size-[calc(50/1728*var(--vw))] items-center justify-center rounded-full bg-gray-1/50 font-primary text-3xl leading-none text-gray-1 cursor-pointer hover:bg-gray-1/60"
        >
          +
        </button>

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-[calc(21/1728*var(--vw))] p-[calc(30/1728*var(--vw))]">
          <img src={bestResult.titleArt} alt={bestResult.title} className="h-[calc(79/1728*var(--vw))] w-auto self-start object-contain" />
          <div className="flex items-center gap-[calc(20/1728*var(--vw))] font-primary text-2xl text-[#fafafa]">
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
                className="rounded-full border border-gray-1/15 bg-black/35 px-[calc(20/1728*var(--vw))] py-[calc(8/1728*var(--vw))] font-primary text-xl text-gray-1/56"
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Decorative — a single fixture hero, no real carousel behind it yet. */}
        <PaginationDots count={4} activeIndex={0} className="absolute bottom-[calc(30/1728*var(--vw))] right-[calc(30/1728*var(--vw))]" />
      </div>
    )}

    <div className="mt-[calc(60/1728*var(--vw))] flex flex-col gap-[calc(60/1728*var(--vw))]">
      {GROUPS.map(({ type, label }) => {
        const items = results.filter((item) => item.type === type);
        if (items.length === 0) return null;
        return (
          <div key={type} className="flex flex-col gap-[calc(30/1728*var(--vw))]">
            <h3 className="font-primary font-semibold text-5xl text-gray-1">
              {label} <span className="text-gray-1/50">({String(items.length).padStart(2, "0")})</span>
            </h3>
            {/* Tiles have no click action yet — they route to the Movie/Series Details
               page once it exists (per wiki/raw/api-docs.md). The "added" toast only
               belongs to the explicit My Stuff button on the hero above. */}
            <div
              className={
                type === "channel"
                  ? "flex gap-[calc(23/1728*var(--vw))] overflow-x-auto scrollbar-hide"
                  : "grid grid-cols-6 gap-x-[calc(20/1728*var(--vw))] gap-y-[calc(20/1728*var(--vw))]"
              }
            >
              {items.map((item) =>
                type === "channel" ? (
                  <ChannelCard key={item.id} image={item.image} title={item.title} />
                ) : (
                  <CompactPosterTile key={item.id} image={item.image} title={item.title} className="w-full!" />
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
