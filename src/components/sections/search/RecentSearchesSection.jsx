import React, { useState } from "react";
import classNames from "../../../utils/classNames";
import recentIcon from "../../../../assets/icons/search-edge-recent-searches-recent-search.svg";
import closeIcon from "../../../../assets/icons/search-edge-recent-searches-close-light.svg";
import seeMoreIcon from "../../../../assets/icons/search-edge-recent-searches-see-more-chevron.svg";

const VISIBLE_COUNT = 5;

// Persistence is 🔶 LIKELY localStorage (per wiki/pages/search.md) but lives in SearchPage —
// this component just renders + fires callbacks.
const RecentSearchesSection = ({ items = [], onSelect, onRemove, onClearAll, className = "" }) => {
  const [expanded, setExpanded] = useState(false);
  if (items.length === 0) return null;
  const visible = expanded ? items : items.slice(0, VISIBLE_COUNT);

  return (
    <section className={classNames("flex flex-col gap-[calc(16/1728*var(--vw))]", className)}>
      <div className="flex items-center justify-between">
        <h2 className="font-primary font-bold text-h6 text-gray-1">Recent Searches</h2>
        <button
          type="button"
          onClick={onClearAll}
          className="font-primary text-base text-gray-1/60 cursor-pointer hover:text-gray-1"
        >
          Clear all
        </button>
      </div>
      <div className="flex flex-col">
        {visible.map((label) => (
          <div
            key={label}
            className="flex w-full items-center gap-[calc(12/1728*var(--vw))] rounded-lg px-[calc(6/1728*var(--vw))] py-[calc(10/1728*var(--vw))] transition-colors hover:bg-gray-1/5"
          >
            <button
              type="button"
              onClick={() => onSelect?.(label)}
              className="flex flex-1 items-center gap-[calc(12/1728*var(--vw))] cursor-pointer text-left"
            >
              <img src={recentIcon} alt="" aria-hidden="true" className="size-[calc(16/1728*var(--vw))] opacity-60" />
              <span className="font-primary text-base text-gray-1">{label}</span>
            </button>
            <button
              type="button"
              onClick={() => onRemove?.(label)}
              aria-label={`Remove ${label} from recent searches`}
              className="shrink-0 cursor-pointer opacity-50 hover:opacity-100"
            >
              <img src={closeIcon} alt="" aria-hidden="true" className="size-[calc(14/1728*var(--vw))]" />
            </button>
          </div>
        ))}
      </div>
      {!expanded && items.length > VISIBLE_COUNT && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mx-auto flex items-center gap-[calc(4/1728*var(--vw))] cursor-pointer"
        >
          <span className="font-primary text-base font-medium text-brand">See More</span>
          <img src={seeMoreIcon} alt="" aria-hidden="true" className="size-[calc(14/1728*var(--vw))] rotate-90" />
        </button>
      )}
    </section>
  );
};

export default RecentSearchesSection;
