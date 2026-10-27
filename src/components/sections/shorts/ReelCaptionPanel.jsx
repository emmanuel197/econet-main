import React from "react";
import classNames from "../../../utils/classNames";
import watchIcon from "../../../../assets/icons/comments-reel-player-play-small.svg";

/**
 * ReelCaptionPanel — bottom-left overlay on the video card: category badge,
 * creator handle, caption, "Watch full episode" CTA, hashtags, audio credit.
 */
const ReelCaptionPanel = ({ reel, onWatchFull, className = "" }) => (
  <div className={classNames("flex flex-col gap-[calc(10/1728*var(--vw))]", className)}>
    <div className="flex items-center gap-[calc(10/1728*var(--vw))]">
      <span className="rounded-full border border-brand px-[calc(12/1728*var(--vw))] py-[calc(4/1728*var(--vw))] font-primary text-xs font-semibold text-brand">
        {reel.badge}
      </span>
      <span className="flex size-[calc(24/1728*var(--vw))] items-center justify-center rounded-full bg-brand font-primary text-xs font-bold text-page">
        {reel.handle.replace("@", "").charAt(0)}
      </span>
      <span className="font-primary text-sm font-semibold text-gray-1">{reel.handle}</span>
    </div>

    <p className="max-w-[calc(280/1728*var(--vw))] font-primary text-base leading-snug text-gray-1">
      {reel.title}
    </p>

    {/* Brief: Watch → Movie/Series details page. Label follows the content type;
       fixture reels (no contentId) pass no handler and the CTA stays a no-op. */}
    <button
      type="button"
      onClick={onWatchFull || (() => {})}
      className="flex w-fit cursor-pointer items-center gap-[calc(6/1728*var(--vw))] rounded-full bg-brand px-[calc(14/1728*var(--vw))] py-[calc(6/1728*var(--vw))] font-primary text-sm font-semibold text-page"
    >
      <img src={watchIcon} alt="" aria-hidden="true" className="size-[calc(12/1728*var(--vw))]" />
      {reel.contentType === "series" ? "Watch full episode" : "Watch full movie"}
    </button>

    <p className="font-primary text-sm text-brand">{reel.hashtags.join(" ")}</p>
    <p className="font-primary text-xs text-gray-1/60">{reel.audio}</p>
  </div>
);

export default ReelCaptionPanel;
