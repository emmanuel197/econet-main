import React from "react";
import classNames from "../../../utils/classNames";
import navUp from "../../../../assets/icons/shorts-play-nav-arrows-nav-up.svg";
import navDown from "../../../../assets/icons/shorts-play-nav-arrows-nav-down.svg";

/**
 * ReelNavArrows — up/down circular buttons that step through the reel queue.
 * Each arrow only renders when there's a reel in that direction: the first reel
 * shows just ↓, the last just ↑ (bounded queue, no wrap-around).
 */
const ReelNavArrows = ({ onUp, onDown, showUp = true, showDown = true, className = "" }) => (
  <div className={classNames("flex flex-col gap-[calc(16/1728*var(--vw))]", className)}>
    {showUp && (
      <button
        type="button"
        onClick={onUp}
        aria-label="Previous reel"
        className="flex size-[calc(48/1728*var(--vw))] items-center justify-center rounded-full bg-gray-1/15 cursor-pointer transition-colors hover:bg-gray-1/25"
      >
        <img src={navUp} alt="" aria-hidden="true" className="size-[calc(18/1728*var(--vw))]" />
      </button>
    )}
    {showDown && (
      <button
        type="button"
        onClick={onDown}
        aria-label="Next reel"
        className="flex size-[calc(48/1728*var(--vw))] items-center justify-center rounded-full bg-gray-1/15 cursor-pointer transition-colors hover:bg-gray-1/25"
      >
        <img src={navDown} alt="" aria-hidden="true" className="size-[calc(18/1728*var(--vw))]" />
      </button>
    )}
  </div>
);

export default ReelNavArrows;
