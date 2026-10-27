import React, { useState } from "react";
import classNames from "../../../utils/classNames";
import shareIcon from "../../../../assets/icons/comments-reel-action-rail-share.svg";
import saveIcon from "../../../../assets/icons/comments-reel-action-rail-save.svg";

// Same heart path as comments-reel-action-rail-like.svg, inlined so the fill can
// follow the liked state (the shipped asset hardcodes gold and <img> can't recolor).
const HeartIcon = ({ filled, className = "" }) => (
  <svg viewBox="0 0 22 22" className={className} aria-hidden="true">
    <path
      fill={filled ? "#da1375" : "none"}
      stroke={filled ? "#da1375" : "#ffffff"}
      strokeWidth="1.65"
      d="M19.103 4.226a5.04 5.04 0 0 0-7.131 0L11 5.197l-.972-.971a5.043 5.043 0 1 0-7.131 7.132l.971.971L11 19.461l7.132-7.132.971-.972a5.04 5.04 0 0 0 0-7.131Z"
    />
  </svg>
);

const shareReel = async (reel) => {
  const url = `${window.location.origin}/shorts/${reel.id}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: reel.title, url });
    } catch {
      /* user cancelled the native share sheet — not an error */
    }
    return false;
  }
  await navigator.clipboard?.writeText(url);
  return true;
};

/**
 * ReelActionRail — avatar (follow badge), like, share, add-to-My-List. Its own
 * column to the right of the video card, not overlaid on it. All toggles are
 * optimistic/local — no backend to persist against yet.
 */
const ReelActionRail = ({ reel, liked = false, onToggleLike, onOpenDetails, className = "" }) => {
  const [following, setFollowing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [justCopied, setJustCopied] = useState(false);

  const handleShare = async () => {
    const copied = await shareReel(reel);
    if (copied) {
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 1800);
    }
  };

  return (
    <div className={classNames("flex flex-col items-center gap-[calc(20/1728*var(--vw))]", className)}>
      {/* Brief: the avatar's "+" opens the content's details page (the avatar IS
          the movie/series poster). Follow-toggle remains for fixture reels with
          no linked content. */}
      <button
        type="button"
        onClick={onOpenDetails || (() => setFollowing((f) => !f))}
        aria-pressed={onOpenDetails ? undefined : following}
        aria-label={onOpenDetails ? "Open details" : following ? "Unfollow creator" : "Follow creator"}
        className="relative size-[calc(48/1728*var(--vw))] shrink-0 cursor-pointer"
      >
        <img src={reel.creatorAvatar} alt="" className="size-full rounded-full object-cover" />
        {!following && (
          <span className="absolute -bottom-[calc(2/1728*var(--vw))] -right-[calc(2/1728*var(--vw))] flex size-[calc(18/1728*var(--vw))] items-center justify-center rounded-full bg-brand text-xs font-bold leading-none text-page">
            +
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={onToggleLike}
        aria-pressed={liked}
        aria-label="Like"
        className="flex flex-col items-center gap-[calc(4/1728*var(--vw))] cursor-pointer"
      >
        {/* Circle stays neutral — only the heart itself colors gold when liked. */}
        <span className="flex size-[calc(40/1728*var(--vw))] items-center justify-center rounded-full bg-gray-1/15">
          <HeartIcon filled={liked} className="size-[calc(18/1728*var(--vw))]" />
        </span>
        <span className="font-primary text-base font-semibold text-brand">{reel.likes}</span>
      </button>

      <button
        type="button"
        onClick={handleShare}
        aria-label="Share"
        className="flex flex-col items-center gap-[calc(4/1728*var(--vw))] cursor-pointer"
      >
        <span className="flex size-[calc(40/1728*var(--vw))] items-center justify-center rounded-full bg-gray-1/15">
          <img src={shareIcon} alt="" aria-hidden="true" className="size-[calc(18/1728*var(--vw))]" />
        </span>
        <span className="font-primary text-base font-semibold text-brand">{justCopied ? "Copied!" : "Share"}</span>
      </button>

      <button
        type="button"
        onClick={() => setSaved((s) => !s)}
        aria-pressed={saved}
        aria-label="Add to My Stuff"
        className="flex flex-col items-center gap-[calc(4/1728*var(--vw))] cursor-pointer"
      >
        <span
          className={classNames(
            "flex size-[calc(40/1728*var(--vw))] items-center justify-center rounded-full transition-colors",
            saved ? "bg-brand" : "bg-gray-1/15"
          )}
        >
          <img src={saveIcon} alt="" aria-hidden="true" className="size-[calc(18/1728*var(--vw))]" />
        </span>
        <span className="font-primary text-base font-semibold text-brand">My List</span>
      </button>
    </div>
  );
};

export default ReelActionRail;
