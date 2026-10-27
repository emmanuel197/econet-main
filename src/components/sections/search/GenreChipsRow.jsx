import React from "react";
import classNames from "../../../utils/classNames";

/**
 * GenreChipsRow — plain-text genre/tag pills under the search bar on the
 * landing state. Clicking a chip commits a search for that label.
 */
const GenreChipsRow = ({ items = [], onSelect, className = "" }) => (
  <div className={classNames("flex overflow-x-auto scrollbar-hide gap-[calc(16/1728*var(--vw))]", className)}>
    {items.map((label) => (
      <button
        key={label}
        type="button"
        onClick={() => onSelect?.(label)}
        className="shrink-0 cursor-pointer rounded-full border border-gray-1/15 bg-gray-1/10 px-[calc(24/1728*var(--vw))] py-[calc(12/1728*var(--vw))] font-primary text-xl text-gray-1 transition-colors hover:bg-gray-1/15"
      >
        {label}
      </button>
    ))}
  </div>
);

export default GenreChipsRow;
