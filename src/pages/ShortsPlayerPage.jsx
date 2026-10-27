import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectShorts } from "../store/slice/shortsSlice";
import { resolveReel, reels as fixtureReels } from "../data/shortsFixtures";
import ReelPlayerCard, { PLAYER_WIDTH } from "../components/sections/shorts/ReelPlayerCard";
import classNames from "../utils/classNames";
import fluid from "../utils/fluid";
import formatSeconds from "../utils/formatSeconds";
import ReelActionRail from "../components/sections/shorts/ReelActionRail";
import ReelCaptionPanel from "../components/sections/shorts/ReelCaptionPanel";
import ReelNavArrows from "../components/sections/shorts/ReelNavArrows";
import backArrow from "../../assets/icons/shorts-play-back-arrow-back-arrow.svg";
import { detailsPath } from "../utils/contentNavigation";

const parseSeconds = (label) => {
  const [m, s] = label.split(":").map(Number);
  return m * 60 + s;
};

/**
 * ShortsPlayerPage — DESKTOP reel player (/shorts/:id, Figma 2883:10145).
 * Only a still frame ships per reel — play/pause/scrub are UI-only until real
 * video exists (see ReelPlayerCard).
 */
function ShortsPlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  // Redux reels (seeded by openAfrishortsPlayer / fetchShortsContent) win over the
  // fixture queue; fixtures remain the design-mode/deep-link fallback.
  const reduxReels = useSelector(selectShorts).reels;
  const reels = reduxReels?.length ? reduxReels : fixtureReels;
  // resolveReel builds a fresh object per call — memoize on `id` so its reference
  // stays stable across renders (an unstable reference here would re-trigger the
  // reset effect below on every render, including the one from clicking Play).
  const reel = useMemo(
    () => reels.find((r) => String(r.id) === String(id)) ?? resolveReel(id),
    [id, reels]
  );

  // Real-media reels autoplay on entry (the user got here via a click gesture);
  // fixture reels keep the click-to-play still-frame behavior.
  const isRealMedia = Boolean(reel?.videoUrl);
  const [playing, setPlaying] = useState(isRealMedia);
  const [muted, setMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [progress, setProgress] = useState(reel?.progress ?? 0);
  // Actual media duration (seconds), reported by the <video> once metadata loads.
  const [mediaDuration, setMediaDuration] = useState(0);

  useEffect(() => {
    if (!reel) {
      navigate("/shorts", { replace: true });
      return;
    }
    setProgress(reel.videoUrl ? 0 : reel.progress);
    setMediaDuration(0);
    // Keep playing across reel changes (swipe = continuous session); real media
    // entering fresh also autoplays.
    if (reel.videoUrl) setPlaying(true);
    setLiked(false);
  }, [id, reel, navigate]);

  const currentIndex = reels.findIndex((r) => r.id === id);

  // Bounded queue (supersedes the earlier wrap-around behavior, per design): no up
  // from the first reel, no down from the last. Fallback reels (grid/trending ids
  // not in `reels`) sit "before" the queue — only down is available, entering at
  // the first reel.
  //
  // Continuous-stream hook: with a real API the queue is paginated, so "last reel"
  // only exists when the feed is exhausted. Integration should set hasMoreReels from
  // the API's pagination (and fetch the next page as currentIndex nears the end) —
  // the ↓ arrow then stays visible for as long as the stream can grow.
  const hasMoreReels = false; // TODO: missing API — drive from /api/shorts pagination
  const canGoUp = currentIndex > 0;
  const canGoDown = hasMoreReels || currentIndex === -1 || currentIndex < reels.length - 1;

  // YouTube-Shorts-style step transition: instead of hard-swapping on navigate,
  // the current card and the next reel's poster ride one track that slides a full
  // card height (down = track moves up, up = track moves down); the route swap
  // happens on transition end, so the freshly-mounted card lands exactly where
  // the poster settled. `slide` holds the target; `sliding` arms the transform a
  // frame later so the browser paints the start position first.
  const [slide, setSlide] = useState(null); // { reel, dir: 1 (next) | -1 (prev) }
  const [sliding, setSliding] = useState(false);

  const goToOffset = (offset) => {
    if (!reels.length || slide) return;
    if (offset < 0 && !canGoUp) return;
    if (offset > 0 && !canGoDown) return;
    const nextIndex = currentIndex === -1 ? 0 : currentIndex + offset;
    setSlide({ reel: reels[nextIndex], dir: offset > 0 ? 1 : -1 });
  };

  const finishSlide = () => {
    if (!slide) return;
    // Replace: stepping through reels is one viewing session, not separate visits —
    // pushing here made Back walk through every reel instead of leaving the player.
    navigate(`/shorts/${slide.reel.id}`, { replace: true });
    setSlide(null);
    setSliding(false);
  };

  useEffect(() => {
    if (!slide) return;
    // Double rAF: mount the track at rest, then flip the transform next frame so
    // the CSS transition actually runs (a same-frame flip would snap, no animation).
    let raf2;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setSliding(true));
    });
    // Safety net — if transitionend never fires (tab hidden, etc.), settle anyway.
    const settle = setTimeout(finishSlide, 500);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(settle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide]);

  // Real history back when there's an in-app entry to return to (feed, home, search…);
  // the /shorts fallback only covers deep links straight into the player.
  const goBack = () => {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate("/shorts", { replace: true });
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") goBack();
      if (e.key === "ArrowUp") goToOffset(-1);
      if (e.key === "ArrowDown") goToOffset(1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // A single scroll gesture fires many small wheel events — lock briefly after
  // stepping so one gesture advances exactly one reel, not several.
  const wheelLockedRef = useRef(false);
  const handleWheel = (e) => {
    if (wheelLockedRef.current || Math.abs(e.deltaY) < 10) return;
    wheelLockedRef.current = true;
    goToOffset(e.deltaY > 0 ? 1 : -1);
    setTimeout(() => {
      wheelLockedRef.current = false;
    }, 600);
  };

  if (!reel) return null;

  // Brief: "Watch full …" CTA and the avatar's "+" open the content's details
  // page. Only reels seeded from real API items carry contentId — fixture reels
  // keep the no-op/follow behaviors.
  const reelDetailsPath = reel.contentId != null ? detailsPath(reel) : null;
  const openDetails = reelDetailsPath ? () => navigate(reelDetailsPath) : undefined;

  // Real media reports its duration via loadedmetadata; fixtures use the label.
  const totalSeconds = mediaDuration || parseSeconds(reel.totalTime || "0:00");

  return (
    <div className="relative min-h-screen font-primary text-gray-1" onWheel={handleWheel}>
      <button
        type="button"
        onClick={goBack}
        aria-label="Back to Shorts"
        className="absolute left-[calc(53/1728*var(--vw))] top-[calc(146/1728*var(--vw))] z-10 flex size-[calc(40/1728*var(--vw))] items-center justify-center rounded-full bg-gray-1/10 cursor-pointer"
      >
        <img src={backArrow} alt="" aria-hidden="true" className="size-[calc(18/1728*var(--vw))]" />
      </button>

      <div className="flex items-center justify-center gap-[calc(40/1728*var(--vw))] pt-[calc(146/1728*var(--vw))] pb-[calc(64/1728*var(--vw))]">
        {/* Slide viewport: clips the moving track to one card frame. */}
        <div
          className="relative shrink-0 overflow-clip rounded-2xl"
          style={{ width: fluid(PLAYER_WIDTH), aspectRatio: "9 / 16" }}
        >
          <div
            className={classNames("absolute inset-0", slide && "transition-transform duration-300 ease-out")}
            style={{ transform: slide && sliding ? `translateY(${slide.dir * -100}%)` : "translateY(0)" }}
            onTransitionEnd={(e) => {
              // transitionend bubbles (e.g. the play button's opacity fade inside the
              // card) — only the track's own transform end may settle the slide.
              if (e.target === e.currentTarget && e.propertyName === "transform") finishSlide();
            }}
          >
            <ReelPlayerCard
              reel={reel}
              playing={playing}
              onTogglePlay={() => setPlaying((p) => !p)}
              onDoubleLike={() => setLiked((l) => !l)}
              muted={muted}
              onToggleMute={() => setMuted((m) => !m)}
              progress={progress}
              onScrub={setProgress}
              currentTimeLabel={formatSeconds(progress * totalSeconds)}
              totalTimeLabel={formatSeconds(totalSeconds)}
              onDuration={setMediaDuration}
              onEnded={() => goToOffset(1)}
            />
            {/* Incoming reel's still frame rides in with the track; the real card
                mounts in its place once the route swaps on transition end. */}
            {slide && (
              <img
                src={slide.reel.video}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 size-full rounded-2xl object-cover"
                style={{ transform: `translateY(${slide.dir * 100}%)` }}
              />
            )}
          </div>
        </div>
        {/* Rail/caption fade out during the slide (their content belongs to the outgoing reel). */}
        <div className={classNames("transition-opacity duration-200", slide && "opacity-0")}>
          <ReelActionRail
            reel={reel}
            liked={liked}
            onToggleLike={() => setLiked((l) => !l)}
            onOpenDetails={openDetails}
          />
        </div>
      </div>

      {/* Nav arrows sit near the page's right edge, well away from the action rail. */}
      <ReelNavArrows
        onUp={() => goToOffset(-1)}
        onDown={() => goToOffset(1)}
        showUp={canGoUp}
        showDown={canGoDown}
        className="absolute right-[calc(64/1728*var(--vw))] top-1/2 -translate-y-1/2"
      />

      {/* Caption block sits at the page's bottom-left, outside the video card (per design). */}
      <ReelCaptionPanel
        reel={reel}
        onWatchFull={openDetails}
        className={classNames(
          "absolute bottom-[calc(64/1728*var(--vw))] left-[calc(53/1728*var(--vw))] z-10 transition-opacity duration-200",
          slide && "opacity-0"
        )}
      />
    </div>
  );
}

export default ShortsPlayerPage;
