import React from "react";
import classNames from "../../../utils/classNames";
import LiveChannelCard from "../../cards/LiveChannelCard";
import seeAllArrow from "../../../../assets/icons/epg-sport-live-channels-sidebar-see-all-arrow.svg";

const LiveChannelsSidebar = ({ items = [], totalCount, activeId, onSelect, onSeeAll, className = "" }) => (
  <aside className={classNames("flex flex-col gap-[calc(16/1728*var(--vw))]", className)}>
    <div className="flex items-center gap-[calc(10/1728*var(--vw))]">
      <h3 className="font-primary font-bold text-xl text-gray-1">All Live Channels</h3>
      {totalCount != null && (
        <span className="rounded-full bg-gray-1/10 px-[calc(10/1728*var(--vw))] py-[calc(2/1728*var(--vw))] font-primary text-sm text-gray-1/70">
          {totalCount}
        </span>
      )}
      <span className="flex-1" />
      <button
        type="button"
        onClick={onSeeAll}
        className="flex items-center gap-[calc(6/1728*var(--vw))] font-primary text-sm text-gray-1/70 cursor-pointer hover:text-gray-1"
      >
        See All
        <img src={seeAllArrow} alt="" aria-hidden="true" className="size-[calc(14/1728*var(--vw))]" />
      </button>
    </div>

    <div className="flex flex-col gap-[calc(10/1728*var(--vw))]">
      {items.map((ch, i) => (
        <LiveChannelCard
          key={ch.id}
          data={ch}
          active={ch.id === activeId}
          onClick={() => onSelect?.(ch)}
          className={classNames(i % 2 === 1 && ch.id !== activeId && "bg-gray-1/5")}
        />
      ))}
    </div>
  </aside>
);

export default LiveChannelsSidebar;
