import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Hls from "hls.js";
import classNames from "../../../utils/classNames";
import fluid from "../../../utils/fluid";
import speakerIcon from "../../../../assets/icons/comments-reel-player-control-speaker.svg";
import fullscreenIcon from "../../../../assets/icons/comments-reel-player-control-fullscreen.svg";
import moreIcon from "../../../../assets/icons/comments-reel-player-control-more.svg";
import playCenter from "../../../../assets/icons/comments-reel-player-play-center.svg";
import likeIcon from "../../../../assets/icons/comments-reel-action-rail-like.svg";

// 1728-comp px — exact Figma value isn't in the wiki dump; matches a standard 9:16 reel card.
// Exported so the player page can size the slide-transition viewport to match.
export const PLAYER_WIDTH = 420;

/**
 * ReelPlayerCard — the portrait video box. Only a still frame ships per reel
 * (shortsFixtures.js), so play/pause/scrub are UI-only until real media exists.
 */
const ReelPlayerCard = ({
  reel,
  playing,
  onTogglePlay,
  onDoubleLike,
  muted,
  onToggleMute,
  progress,
  onScrub,
  currentTimeLabel,
  totalTimeLabel,
  onDuration,
  onEnded,
  className = "",
}) => {
  const containerRef = useRef(null);
  const clickTimerRef = useRef(null);
  const [likeBurst, setLikeBurst] = useState(false);

  // Real-video plumbing (only active when reel.videoUrl exists).
  const videoRef = useRef(null);
  const seekingRef = useRef(false);

  // Trailer URLs are HLS (.m3u8) — Chrome/Edge <video> has no native HLS, so
  // attach hls.js; Safari plays it natively.
  useEffect(() => {
    const v = videoRef.current;
    const url = reel.videoUrl;
    if (!v || !url) return;
    if (v.canPlayType("application/vnd.apple.mpegurl")) {
      v.src = url;
      if (playingRef.current) v.play().catch(() => {});
      return;
    }
    if (Hls.isSupported()) {
      // Trailers are short — always render the top rendition instead of letting
      // ABR start low and step up (the small card size would otherwise cap it).
      // autoStartLoad off: otherwise the first fragment is already requested at
      // a low ABR-estimated level before MANIFEST_PARSED can pin the quality.
      const hls = new Hls({ capLevelToPlayerSize: false, autoStartLoad: false });
      hls.loadSource(url);
      hls.attachMedia(v);
      // The play() from the playing effect can fire before the source attaches —
      // retry once the manifest is ready so swiping keeps playback rolling.
      hls.on(Hls.Events.MANIFEST_PARSED, (_evt, data) => {
        // Setting currentLevel disables auto ABR and locks to this rendition.
        if (data.levels?.length) hls.currentLevel = data.levels.length - 1;
        hls.startLoad();
        if (playingRef.current) v.play().catch(() => {});
      });
      return () => hls.destroy();
    }
  }, [reel.videoUrl]);
  const playingRef = useRef(playing);
  playingRef.current = playing;
  useLayoutEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing, reel.videoUrl]);

  // The icon always mirrors the state (▶ paused, ⏸ playing) and swaps the instant
  // it's clicked — standard player behavior. This hold only controls VISIBILITY:
  // when playback starts, the ⏸ stays on screen for a beat, then fades out (hover
  // reveals it again). useLayoutEffect so the hold is set before the playing=true
  // frame paints.
  const [holdVisible, setHoldVisible] = useState(false);
  useLayoutEffect(() => {
    if (!playing) {
      setHoldVisible(false);
      return;
    }
    setHoldVisible(true);
    const t = setTimeout(() => setHoldVisible(false), 900);
    return () => clearTimeout(t);
  }, [playing]);

  // Single click on the video toggles play/pause; double click likes. The timer
  // holds the single-click action back long enough to see if a second click lands.
  const handleVideoClick = () => {
    if (clickTimerRef.current) return;
    clickTimerRef.current = setTimeout(() => {
      clickTimerRef.current = null;
      onTogglePlay?.();
    }, 250);
  };
  const handleVideoDoubleClick = () => {
    clearTimeout(clickTimerRef.current);
    clickTimerRef.current = null;
    onDoubleLike?.();
    setLikeBurst(true);
    setTimeout(() => setLikeBurst(false), 700);
  };

  const handleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen?.();
    }
  };

  return (
    <div
      ref={containerRef}
      className={classNames("relative shrink-0 overflow-clip rounded-2xl bg-navy-9", className)}
      style={{ width: fluid(PLAYER_WIDTH), aspectRatio: "9 / 16" }}
    >
      {reel.videoUrl ? (
        // Real vertical trailer (Afrishorts API flow) — play/pause/mute/seek are
        // driven by the same props the still-frame UI uses.
        <video
          ref={videoRef}
          poster={reel.video}
          muted={muted}
          playsInline
          onClick={handleVideoClick}
          onDoubleClick={handleVideoDoubleClick}
          onLoadedMetadata={(e) => onDuration?.(e.currentTarget.duration || 0)}
          onEnded={() => onEnded?.()}
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (v.duration && !seekingRef.current) onScrub?.(v.currentTime / v.duration);
          }}
          className="absolute inset-0 size-full cursor-pointer object-cover"
        />
      ) : (
        <img
          src={reel.video}
          alt={reel.title}
          onClick={handleVideoClick}
          onDoubleClick={handleVideoDoubleClick}
          className="absolute inset-0 size-full cursor-pointer object-cover"
        />
      )}

      <div className="absolute inset-x-0 top-0 h-[calc(120/1728*var(--vw))] bg-gradient-to-b from-black/50 to-transparent" />
      {/* All three controls share ONE pill container (per design), not separate circles. */}
      <div className="absolute right-[calc(16/1728*var(--vw))] top-[calc(16/1728*var(--vw))] flex items-center gap-[calc(14/1728*var(--vw))] rounded-full bg-black/40 px-[calc(14/1728*var(--vw))] py-[calc(8/1728*var(--vw))]">
        <button
          type="button"
          onClick={onToggleMute}
          aria-pressed={muted}
          aria-label={muted ? "Unmute" : "Mute"}
          className="flex items-center justify-center cursor-pointer"
        >
          <img
            src={speakerIcon}
            alt=""
            aria-hidden="true"
            className={classNames("size-[calc(16/1728*var(--vw))]", muted && "opacity-40")}
          />
        </button>
        <button
          type="button"
          onClick={handleFullscreen}
          aria-label="Fullscreen"
          className="flex items-center justify-center cursor-pointer"
        >
          <img src={fullscreenIcon} alt="" aria-hidden="true" className="size-[calc(16/1728*var(--vw))]" />
        </button>
        {/* No overflow menu built yet — no-op placeholder, matches the CTA below. */}
        <button
          type="button"
          onClick={() => {}}
          aria-label="More options"
          className="flex items-center justify-center cursor-pointer"
        >
          <img src={moreIcon} alt="" aria-hidden="true" className="size-[calc(16/1728*var(--vw))]" />
        </button>
      </div>

      <button
        type="button"
        onClick={onTogglePlay}
        aria-label={playing ? "Pause" : "Play"}
        className={classNames(
          "absolute left-1/2 top-1/2 flex size-[calc(72/1728*var(--vw))] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 backdrop-blur-sm cursor-pointer transition-opacity duration-500",
          playing && !holdVisible && "opacity-0 hover:opacity-100"
        )}
      >
        {playing ? (
          <span className="flex items-center gap-[calc(6/1728*var(--vw))]" aria-hidden="true">
            <span className="h-[calc(24/1728*var(--vw))] w-[calc(7/1728*var(--vw))] rounded-sm bg-gray-1" />
            <span className="h-[calc(24/1728*var(--vw))] w-[calc(7/1728*var(--vw))] rounded-sm bg-gray-1" />
          </span>
        ) : (
          <img src={playCenter} alt="" aria-hidden="true" className="size-[calc(28/1728*var(--vw))]" />
        )}
      </button>

      {/* Double-tap like burst — heart in expanding rings, fades after ~0.7s. */}
      {likeBurst && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          <span className="absolute size-[calc(110/1728*var(--vw))] animate-ping rounded-full border-2 border-brand/60" />
          <span className="absolute size-[calc(80/1728*var(--vw))] rounded-full border border-brand/40" />
          <img src={likeIcon} alt="" aria-hidden="true" className="relative size-[calc(44/1728*var(--vw))]" />
        </div>
      )}

      {!playing && (
        <span className="pointer-events-none absolute left-1/2 top-[64%] -translate-x-1/2 whitespace-nowrap font-primary text-xs text-gray-1/70">
          ♥ Double tap anywhere to like
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 flex flex-col bg-gradient-to-t from-black/70 to-transparent px-[calc(16/1728*var(--vw))] pb-[calc(14/1728*var(--vw))] pt-[calc(40/1728*var(--vw))]">
        <div className="flex items-center gap-[calc(8/1728*var(--vw))]">
          <span className="font-primary text-base text-gray-1/70">{currentTimeLabel}</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={progress}
            onChange={(e) => {
              const next = Number(e.target.value);
              const v = videoRef.current;
              if (v?.duration) {
                seekingRef.current = true;
                v.currentTime = next * v.duration;
                setTimeout(() => (seekingRef.current = false), 150);
              }
              onScrub(next);
            }}
            aria-label="Seek"
            className="h-[calc(4/1728*var(--vw))] flex-1 cursor-pointer accent-brand"
          />
          <span className="font-primary text-base text-gray-1/90">{totalTimeLabel ?? reel.totalTime}</span>
        </div>
      </div>
    </div>
  );
};

export default ReelPlayerCard;
