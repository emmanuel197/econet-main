import React from "react";
import classNames from "../../../utils/classNames";
import TrendingListItem from "../../cards/TrendingListItem";
import trendingArrow from "../../../../assets/icons/shorts-feed-trending-now-arrow-right.svg";

// onSelect (API mode) seeds the reel queue before navigating; without it the items
// are plain links to /shorts/:id (fixture/design mode).
const TrendingNowSidebar = ({ items = [], onSeeAll, onSelect, className = "" }) => (
  <section className={classNames("flex flex-col gap-[calc(12/1728*var(--vw))]", className)}>
    <div className="flex items-center gap-[calc(8/1728*var(--vw))]">
      <span
        className="h-[calc(16/1728*var(--vw))] w-[calc(3/1728*var(--vw))] rounded-full bg-brand"
        aria-hidden="true"
      />
      <h3 className="flex-1 font-primary font-bold text-xl text-gray-1">Trending Now</h3>
      <button
        type="button"
        onClick={onSeeAll}
        aria-label="See all trending"
        className="flex size-[calc(28/1728*var(--vw))] items-center justify-center cursor-pointer"
      >
        <img src={trendingArrow} alt="" aria-hidden="true" className="size-[calc(16/1728*var(--vw))]" />
      </button>
    </div>

    <div className="flex flex-col gap-[calc(14/1728*var(--vw))]">
      {items.map((item) => (
        <TrendingListItem
          key={item.id}
          id={item.id}
          rank={item.rank}
          image={item.image}
          title={item.title}
          views={item.views}
          onClick={
            onSelect
              ? (e) => {
                  e.preventDefault();
                  onSelect(item);
                }
              : undefined
          }
        />
      ))}
    </div>
  </section>
);

export default TrendingNowSidebar;
