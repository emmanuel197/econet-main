import React from "react";
import classNames from "../../../utils/classNames";
import watchIcon from "../../../../assets/icons/comments-reel-player-play-small.svg";

/**
 * ReelCaptionPanel — bottom-left overlay on the video card: category badge,
 * creator handle, caption, "Watch full episode" CTA, hashtags, audio credit.
 */
const ReelCaptionPanel = ({ reel, onWatchFull, className = "" }) => (
  <div className={classNames("flex flex-col gap-[calc(12/1728*var(--vw))]", className)}>
    <div className="flex items-center gap-[calc(8/1728*var(--vw))]">
      <span className="rounded-full border border-brand px-[calc(12/1728*var(--vw))] py-[calc(6/1728*var(--vw))] font-primary text-lg font-bold text-brand">
        {reel.badge}
      </span>
      <span className="flex size-[calc(28/1728*var(--vw))] items-center justify-center rounded-full bg-brand font-primary text-lg font-bold text-gray-1">
        {reel.handle.replace("@", "").charAt(0)}
      </span>
      <span className="font-primary text-xl font-bold text-gray-1">{reel.handle}</span>
    </div>

    <p className="max-w-[calc(400/1728*var(--vw))] font-primary text-lg leading-snug text-gray-1/90">
      {reel.title}
    </p>

    {/* Brief: Watch → Movie/Series details page. Label follows the content type;
       fixture reels (no contentId) pass no handler and the CTA stays a no-op. */}
    <button
      type="button"
      onClick={onWatchFull || (() => {})}
      className="flex w-fit cursor-pointer items-center gap-[calc(4/1728*var(--vw))] rounded-[20px] border-[0.5px] border-gray-1 bg-brand px-[calc(12/1728*var(--vw))] py-[calc(10/1728*var(--vw))] font-primary text-sm font-semibold text-gray-1"
    >
      <img src={watchIcon} alt="" aria-hidden="true" className="size-[calc(16/1728*var(--vw))]" />
      {reel.contentType === "series" ? "Watch full episode" : "Watch full movie"}
    </button>

    <p className="font-primary text-base font-bold text-brand/85">{reel.hashtags.join(" ")}</p>
    <p className="font-primary text-base text-gray-1/80">{reel.audio}</p>
  </div>
);

export default ReelCaptionPanel;
