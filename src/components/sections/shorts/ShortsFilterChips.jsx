import React, { useState } from "react";
import classNames from "../../../utils/classNames";

// Design fallback — API mode passes the real rail-category names via `filters`.
const FILTERS = ["For You", "Trending", "Sports", "Movies"];

// Controlled when `active` is passed (API mode — survives remounts); otherwise
// falls back to internal state for the fixture/design-review page.
const ShortsFilterChips = ({ filters = FILTERS, active: activeProp, initial, onChange, className = "" }) => {
  const [internalActive, setInternalActive] = useState(initial ?? filters[0]);
  const active = activeProp ?? internalActive;

  const handle = (label) => {
    setInternalActive(label);
    onChange?.(label);
  };

  return (
    <div className={classNames("flex items-center gap-[calc(12/1728*var(--vw))]", className)}>
      {filters.map((label) => {
        const isActive = label === active;
        return (
          <button
            key={label}
            type="button"
            onClick={() => handle(label)}
            className={classNames(
              "flex h-[calc(38/1728*var(--vw))] items-center justify-center rounded-full px-[calc(20/1728*var(--vw))]",
              "font-primary font-medium text-base cursor-pointer transition-colors",
              isActive
                ? "bg-brand text-page"
                : "bg-gray-1/10 text-gray-1 border border-gray-1/15 hover:bg-gray-1/15"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default ShortsFilterChips;
