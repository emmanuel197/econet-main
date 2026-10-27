import React from "react";
import classNames from "../../../utils/classNames";
import arrowIcon from "../../../../assets/icons/search-trending-searches-row-arrow-right.svg";
import sortIcon from "../../../../assets/icons/search-trending-searches-sort.svg";

const TrendingSearchesSection = ({ items = [], onSelect, title = "Trending Searches", className = "" }) => {
  if (items.length === 0) return null;

  return (
    <section className={classNames("flex flex-col gap-[calc(16/1728*var(--vw))]", className)}>
      <div className="flex items-center justify-between">
        <h2 className="font-primary font-bold text-h6 text-gray-1">{title}</h2>
        <img src={sortIcon} alt="" aria-hidden="true" className="size-[calc(16/1728*var(--vw))] rotate-90" />
      </div>
      <div className="flex flex-col">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect?.(item.label)}
            className="flex items-center gap-[calc(16/1728*var(--vw))] rounded-lg py-[calc(10/1728*var(--vw))] px-[calc(6/1728*var(--vw))] cursor-pointer transition-colors hover:bg-gray-1/5"
          >
            <span className="w-[calc(24/1728*var(--vw))] shrink-0 font-primary font-bold text-lg text-brand">
              {i + 1}
            </span>
            <span className="flex-1 text-left font-primary text-lg text-gray-1">{item.label}</span>
            <img src={arrowIcon} alt="" aria-hidden="true" className="size-[calc(16/1728*var(--vw))] shrink-0 opacity-50" />
          </button>
        ))}
      </div>
    </section>
  );
};

export default TrendingSearchesSection;
