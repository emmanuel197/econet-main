import React from "react";
import classNames from "../../../utils/classNames";

/**
 * GenreChipsRow — plain-text genre/tag pills under the search bar on the
 * landing state. Clicking a chip commits a search for that label.
 */
const GenreChipsRow = ({ items = [], onSelect, className = "" }) => (
  <div className={classNames("flex overflow-x-auto scrollbar-hide gap-[calc(10/1728*var(--vw))]", className)}>
    {items.map((label) => (
      <button
        key={label}
        type="button"
        onClick={() => onSelect?.(label)}
        className="shrink-0 cursor-pointer rounded-full border border-gray-1/15 bg-black/35 px-[calc(20/1728*var(--vw))] py-[calc(8/1728*var(--vw))] font-primary text-xl text-gray-1/56 transition-colors hover:bg-black/50 hover:text-gray-1"
      >
        {label}
      </button>
    ))}
  </div>
);

export default GenreChipsRow;
