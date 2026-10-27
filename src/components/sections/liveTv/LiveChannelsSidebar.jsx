import React from "react";
import classNames from "../../../utils/classNames";
import LiveChannelCard from "../../cards/LiveChannelCard";
import seeAllArrow from "../../../../assets/icons/epg-sport-live-channels-sidebar-see-all-arrow.svg";

const LiveChannelsSidebar = ({ items = [], totalCount, activeId, onSelect, onSeeAll, className = "" }) => (
  <aside className={classNames("flex flex-col gap-[calc(33/1728*var(--vw))]", className)}>
    <div className="flex items-center gap-[calc(11/1728*var(--vw))] border-b border-gray-1/10 py-[calc(21/1728*var(--vw))]">
      <h3 className="font-primary font-semibold text-xl text-gray-1">All Live Channels</h3>
      {totalCount != null && (
        <span className="rounded-[calc(24/1728*var(--vw))] bg-black/32 px-[calc(12/1728*var(--vw))] py-[calc(5/1728*var(--vw))] font-primary text-lg font-medium text-gray-1/75">
          {totalCount}
        </span>
      )}
      <span className="flex-1" />
      <button
        type="button"
        onClick={onSeeAll}
        className="flex items-center gap-[calc(4/1728*var(--vw))] font-primary text-lg text-brand cursor-pointer hover:text-brand-light"
      >
        See All
        <img src={seeAllArrow} alt="" aria-hidden="true" className="size-[calc(24/1728*var(--vw))] -rotate-90" />
      </button>
    </div>

    <div className="flex flex-col gap-[calc(24/1728*var(--vw))]">
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
