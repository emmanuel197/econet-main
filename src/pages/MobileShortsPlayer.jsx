import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectShorts } from "../store/slice/shortsSlice";
import classNames from "../utils/classNames";
import { resolveReel, reels as fixtureReels } from "../data/shortsFixtures";
import { detailsPath } from "../utils/contentNavigation";
import formatSeconds from "../utils/formatSeconds";
import MobileBottomNav from "../components/shared/MobileBottomNav";

import backArrow from "../../assets/icons/shorts-play-back-arrow-back-arrow.svg";
import moreIcon from "../../assets/icons/comments-reel-player-control-more.svg";
import shareIcon from "../../assets/icons/comments-reel-action-rail-share.svg";
import saveIcon from "../../assets/icons/reels-mobile-reel-add-mylist.svg";
import watchIcon from "../../assets/icons/reels-mobile-watch-episode-play.svg";
import swipeArrow from "../../assets/icons/reels-mobile-swipe-gesture-arrow.svg";
import waIcon from "../../assets/icons/reels-mobile-share-whatsapp.svg";
import fbIcon from "../../assets/icons/reels-mobile-share-facebook.svg";
import xIcon from "../../assets/icons/reels-mobile-share-twitter.svg";
import igIcon from "../../assets/icons/reels-mobile-share-instagram.svg";
import copyLinkIcon from "../../assets/icons/reels-mobile-share-copy-link.svg";

const SHARE_TARGETS = [
  { key: "WhatsApp", icon: waIcon, bg: "#25D366" },
  { key: "Facebook", icon: fbIcon, bg: "#1877F2" },
  { key: "Twitter/X", icon: xIcon, bg: "#000000" },
  { key: "Instagram", icon: igIcon, bg: "#E4405F" },
  { key: "Copy Link", icon: copyLinkIcon, bg: "var(--color-brand)", active: true },
];

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const CHIPS = ["For You", "Trending", "Sports", "Movies"];

const HeartIcon = ({ filled, className }) => (
  <svg viewBox="0 0 22 22" className={className} aria-hidden="true">
    <path
      fill={filled ? "#da1375" : "none"}
      stroke={filled ? "#da1375" : "#ffffff"}
      strokeWidth="1.65"
      d="M19.103 4.226a5.04 5.04 0 0 0-7.131 0L11 5.197l-.972-.971a5.043 5.043 0 1 0-7.131 7.132l.971.971L11 19.461l7.132-7.132.971-.972a5.04 5.04 0 0 0 0-7.131Z"
    />
  </svg>
);

const railBtn = "flex flex-col items-center gap-[calc(4/390*var(--mvw))] cursor-pointer";
const railCircle = "flex size-[calc(46/390*var(--mvw))] items-center justify-center rounded-full border border-brand/70 bg-black/30";
const railLabel = "font-primary text-[calc(10/390*var(--mvw))] font-semibold text-brand";

/**
 * MobileShortsPlayer — full-bleed vertical reel player (below md). Self-renders its chrome
 * (status bar + bottom nav) so the video fills the screen behind the overlays. Vertical
 * swipe (up=next, down=prev, bounded) + wheel; follow toggle with toast + unfollow confirm;
 * like via the rail or double-tap. Video is a still frame (no media files) — scrub is UI-only.
 */
const MobileShortsPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Redux reels (seeded by openAfrishortsPlayer / fetchShortsContent) win over the
  // fixture queue — same precedence as the desktop ShortsPlayerPage; fixtures remain
  // the design-mode/deep-link fallback.
  const reduxReels = useSelector(selectShorts).reels;
  const reels = reduxReels?.length ? reduxReels : fixtureReels;
  const reel = useMemo(
    () => reels.find((r) => String(r.id) === String(id)) ?? resolveReel(id),
    [id, reels]
  );

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const [toast, setToast] = useState(null);
  const [unfollowAsk, setUnfollowAsk] = useState(false);
  const [burst, setBurst] = useState(false);
  const [chip, setChip] = useState("For You");
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  // Drag: `y` is the live finger offset (px); `settling` turns the slide easing on
  // for commit/snap-back and off while the finger is tracking 1:1.
  const [y, setY] = useState(0);
  const [settling, setSettling] = useState(false);
  // Real-media playback progress (no scrubber on mobile — the bar tracks the video).
  const [mediaProgress, setMediaProgress] = useState(0);
  const [mediaDuration, setMediaDuration] = useState(0);

  const toastTimer = useRef(null);
  const burstTimer = useRef(null);
  const lastTap = useRef(0);
  const dragRef = useRef(null);
  const movedRef = useRef(false);
  const wheelLock = useRef(false);
  const videoRef = useRef(null);

  // Chrome (top bar, chips, caption/CTA/progress, swipe hint) auto-hides after a
  // few idle seconds for an immersive view; the right action rail + video stay.
  // Any interaction (tap/swipe/wheel) or reel change reveals it and restarts the
  // timer.
  const [chromeVisible, setChromeVisible] = useState(true);
  const hideTimer = useRef(null);
  const revealChrome = () => {
    setChromeVisible(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setChromeVisible(false), 3500);
  };

  useEffect(() => {
    if (!reel) {
      navigate("/shorts", { replace: true });
      return;
    }
    setLiked(false);
    setSaved(false);
    setFollowing(false);
    setUnfollowAsk(false);
    setMediaProgress(0);
    setMediaDuration(0);
  }, [id, reel, navigate]);

  useEffect(() => () => {
    clearTimeout(toastTimer.current);
    clearTimeout(burstTimer.current);
    clearTimeout(hideTimer.current);
  }, []);

  // Autoplay the reel's trailer on entry and on every swipe-to-next. iOS blocks
  // unmuted autoplay outside a user gesture (the slide animation's setTimeout
  // breaks the gesture chain), so retry muted — the video always plays; sound
  // comes through where the browser allows it.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !reel?.videoUrl) return;
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
    });
  }, [reel?.id, reel?.videoUrl]);

  // Reveal chrome (then auto-hide) whenever the reel changes.
  useEffect(() => {
    revealChrome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const currentIndex = reels.findIndex((r) => String(r.id) === String(id));
  const canGoUp = currentIndex > 0;
  const canGoDown = currentIndex === -1 || currentIndex < reels.length - 1;
  // Frames that peek in as you drag (up-drag reveals `next`, down-drag reveals `prev`).
  const nextReel = canGoDown ? reels[currentIndex === -1 ? 0 : currentIndex + 1] : null;
  const prevReel = canGoUp ? reels[currentIndex - 1] : null;

  const goToOffset = (offset) => {
    if (!reels.length) return;
    if (offset < 0 && !canGoUp) return;
    if (offset > 0 && !canGoDown) return;
    const nextIndex = currentIndex === -1 ? 0 : currentIndex + offset;
    navigate(`/shorts/${reels[nextIndex].id}`, { replace: true });
  };
  const goBack = () => (window.history.state?.idx > 0 ? navigate(-1) : navigate("/shorts", { replace: true }));

  const showToast = (text, sub) => {
    setToast({ text, sub });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };
  const handleFollow = () => {
    if (following) {
      setUnfollowAsk(true);
      return;
    }
    setFollowing(true);
    showToast(`Following ${reel.handle}`, "You'll see their reels in feed");
  };
  const handleSave = () => {
    const next = !saved;
    setSaved(next);
    if (next) showToast("Added to My Stuff", `Saved ${reel.handle}'s reel to your list`);
  };
  // Toggles like both ways; the heart burst only plays when it becomes liked.
  const toggleLike = () => {
    setLiked((l) => {
      const next = !l;
      if (next) {
        setBurst(true);
        clearTimeout(burstTimer.current);
        burstTimer.current = setTimeout(() => setBurst(false), 700);
      }
      return next;
    });
  };
  // Double-tap detection. Mobile browsers don't fire a reliable `dblclick` on touch, so
  // taps are timed here (in onTouchEnd); onDoubleClick covers desktop mouse.
  const registerTap = (ts) => {
    if (ts - lastTap.current < 300) {
      lastTap.current = 0;
      toggleLike();
    } else {
      lastTap.current = ts;
    }
  };
  const handleVideoDouble = () => {
    if (movedRef.current) return; // ignore taps that were really drags
    toggleLike();
  };

  const shareUrl = `wona.com/r/${slugify(reel?.title || reel?.id || "reel")}`;
  const copyLink = () => {
    navigator.clipboard?.writeText(`https://${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const closeShare = () => {
    setShareOpen(false);
    setCopied(false);
  };

  const onWheel = (e) => {
    revealChrome();
    if (wheelLock.current || Math.abs(e.deltaY) < 10) return;
    wheelLock.current = true;
    goToOffset(e.deltaY > 0 ? 1 : -1);
    setTimeout(() => (wheelLock.current = false), 600);
  };

  // Finger-tracking swipe. While dragging, the track follows the finger 1:1 (rubber-
  // banded at the ends); on release we commit if past 60px or flicked >400px/s, else
  // snap back. Commit slides the current frame fully out, then navigates.
  const SLIDE_MS = 200;
  const onTouchStart = (e) => {
    revealChrome(); // any touch brings the chrome back and restarts the idle timer
    dragRef.current = { startY: e.touches[0].clientY, startT: e.timeStamp };
    movedRef.current = false;
    setSettling(false);
  };
  const onTouchMove = (e) => {
    const st = dragRef.current;
    if (!st) return;
    let dy = e.touches[0].clientY - st.startY;
    if ((dy < 0 && !canGoDown) || (dy > 0 && !canGoUp)) dy *= 0.22; // rubber-band
    if (Math.abs(dy) > 6) movedRef.current = true;
    setY(dy);
  };
  const onTouchEnd = (e) => {
    const st = dragRef.current;
    if (!st) return;
    dragRef.current = null;
    const dy = e.changedTouches[0].clientY - st.startY;
    const v = (dy / Math.max(16, e.timeStamp - st.startT)) * 1000; // px/s
    const goDown = (dy < -60 || v < -400) && canGoDown;
    const goUp = (dy > 60 || v > 400) && canGoUp;
    setSettling(true);
    if (goDown) {
      setY(-window.innerHeight);
      setTimeout(() => goToOffset(1), SLIDE_MS);
    } else if (goUp) {
      setY(window.innerHeight);
      setTimeout(() => goToOffset(-1), SLIDE_MS);
    } else {
      setY(0); // snap back
      if (!movedRef.current) registerTap(e.timeStamp); // it was a tap → double-tap check
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") goBack();
      if (e.key === "ArrowUp") goToOffset(-1);
      if (e.key === "ArrowDown") goToOffset(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!reel) return null;

  // Brief: "Watch full episode" opens the content's details page. Only reels seeded
  // from real API items carry contentId — fixture reels keep the no-op behavior.
  const reelDetailsPath = reel.contentId != null ? detailsPath(reel) : null;
  const openDetails = reelDetailsPath ? () => navigate(reelDetailsPath) : undefined;

  // Real media drives the bar/labels from playback; fixtures use their static labels.
  const progress = reel.videoUrl ? mediaProgress : reel.progress ?? 0;
  const currentTimeLabel = reel.videoUrl ? formatSeconds(mediaProgress * mediaDuration) : reel.currentTime;
  const totalTimeLabel = reel.videoUrl ? formatSeconds(mediaDuration) : reel.totalTime;

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden bg-black"
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Media track — prev/current/next stacked; translated by the drag offset so the
         adjacent reel peeks in as you drag, then eases out on commit. */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: `translate3d(0, ${y}px, 0)`,
          transition: settling ? `transform ${SLIDE_MS}ms cubic-bezier(0.32, 0, 0.67, 0)` : "none",
        }}
      >
        {prevReel && (
          <img src={prevReel.video} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover" style={{ transform: "translateY(-100%)" }} />
        )}
        {reel.videoUrl ? (
          // Real vertical trailer (Afrishorts API flow) — autoplays on entry (the user
          // arrived via a tap gesture); ended → next reel, mirroring the desktop player.
          <video
            key={reel.id}
            ref={videoRef}
            src={reel.videoUrl}
            poster={reel.video}
            autoPlay
            playsInline
            onDoubleClick={handleVideoDouble}
            onLoadedMetadata={(e) => setMediaDuration(e.currentTarget.duration || 0)}
            onTimeUpdate={(e) => {
              const d = e.currentTarget.duration;
              if (d) setMediaProgress(e.currentTarget.currentTime / d);
            }}
            onEnded={() => goToOffset(1)}
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <img
            src={reel.video}
            alt={reel.title}
            onDoubleClick={handleVideoDouble}
            className="absolute inset-0 size-full object-cover"
          />
        )}
        {nextReel && (
          <img src={nextReel.video} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover" style={{ transform: "translateY(100%)" }} />
        )}
      </div>

      <div className="absolute inset-x-0 top-0 h-[calc(220/390*var(--mvw))] bg-gradient-to-b from-black/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[calc(340/390*var(--mvw))] bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

      {/* Top bar */}
      <div className={classNames("absolute inset-x-0 top-[calc(40/390*var(--mvw))] z-10 flex items-center justify-between px-[calc(16/390*var(--mvw))] transition-opacity duration-300", !chromeVisible && "pointer-events-none opacity-0")}>
        <button type="button" onClick={goBack} aria-label="Back" className="flex size-[calc(36/390*var(--mvw))] items-center justify-center rounded-full border border-brand/70 bg-black/30 cursor-pointer">
          <img src={backArrow} alt="" aria-hidden="true" className="size-[calc(16/390*var(--mvw))]" />
        </button>
        <span className="font-primary text-[calc(16/390*var(--mvw))] font-semibold text-brand-light">Wonashorts</span>
        <button type="button" aria-label="More" className="flex size-[calc(36/390*var(--mvw))] items-center justify-center rounded-full border border-brand/70 bg-black/30 cursor-pointer">
          <img src={moreIcon} alt="" aria-hidden="true" className="size-[calc(16/390*var(--mvw))]" />
        </button>
      </div>

      {/* Filter chips */}
      <div className={classNames("absolute inset-x-0 top-[calc(88/390*var(--mvw))] z-10 flex gap-[calc(8/390*var(--mvw))] px-[calc(16/390*var(--mvw))] transition-opacity duration-300", !chromeVisible && "pointer-events-none opacity-0")}>
        {CHIPS.map((c) => (
          <button key={c} type="button" onClick={() => setChip(c)} className={classNames("rounded-full px-[calc(16/390*var(--mvw))] py-[calc(6/390*var(--mvw))] font-primary text-[calc(12/390*var(--mvw))] font-medium leading-none", chip === c ? "bg-brand text-gray-1" : "bg-black/30 text-gray-1")}>
            {c}
          </button>
        ))}
      </div>

      {/* Double-tap like burst */}
      {burst && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <HeartIcon filled className="size-[calc(90/390*var(--mvw))] animate-ping" />
        </div>
      )}

      {/* Right action rail */}
      <div className="absolute right-[calc(14/390*var(--mvw))] top-1/2 z-10 flex -translate-y-1/2 flex-col items-center gap-[calc(20/390*var(--mvw))]">
        <button type="button" onClick={handleFollow} aria-label={following ? "Unfollow" : "Follow"} className="relative size-[calc(46/390*var(--mvw))] cursor-pointer">
          <img src={reel.creatorAvatar} alt="" className="size-full rounded-full border border-brand/70 object-cover" />
          <span className={classNames("absolute -bottom-[calc(4/390*var(--mvw))] left-1/2 flex size-[calc(18/390*var(--mvw))] -translate-x-1/2 items-center justify-center rounded-full text-[calc(11/390*var(--mvw))] font-bold leading-none", following ? "bg-brand text-gray-1" : "bg-brand text-gray-1")}>
            {following ? "✓" : "+"}
          </span>
        </button>

        <button type="button" onClick={() => setLiked((l) => !l)} aria-label="Like" aria-pressed={liked} className={railBtn}>
          <span className={railCircle}><HeartIcon filled={liked} className="size-[calc(20/390*var(--mvw))]" /></span>
          <span className={railLabel}>{reel.likes}</span>
        </button>

        <button type="button" onClick={() => setShareOpen(true)} aria-label="Share" className={railBtn}>
          <span className={railCircle}><img src={shareIcon} alt="" aria-hidden="true" className="size-[calc(18/390*var(--mvw))]" /></span>
          <span className={railLabel}>Share</span>
        </button>

        <button type="button" onClick={handleSave} aria-label="Add to My Stuff" aria-pressed={saved} className={railBtn}>
          <span className={classNames(railCircle, saved && "bg-brand")}><img src={saveIcon} alt="" aria-hidden="true" className="size-[calc(18/390*var(--mvw))]" /></span>
          <span className={railLabel}>My List</span>
        </button>
      </div>

      {/* Swipe hint */}
      {canGoDown && (
        <div className={classNames("pointer-events-none absolute inset-x-0 bottom-[calc(180/390*var(--mvw))] z-10 flex flex-col items-center gap-[calc(2/390*var(--mvw))] transition-opacity duration-300", !chromeVisible && "opacity-0")}>
          <img src={swipeArrow} alt="" aria-hidden="true" className="size-[calc(22/390*var(--mvw))] animate-bounce" />
          <span className="font-primary text-[calc(11/390*var(--mvw))] text-gray-1/70">Swipe up for next</span>
        </div>
      )}

      {/* Caption + progress (above the nav) — auto-hides with the rest of the chrome. */}
      <div className={classNames("absolute inset-x-0 bottom-[calc(96/390*var(--mvw))] z-10 flex flex-col gap-[calc(8/390*var(--mvw))] px-[calc(16/390*var(--mvw))] transition-opacity duration-300", !chromeVisible && "pointer-events-none opacity-0")}>
        <div className="flex items-center gap-[calc(8/390*var(--mvw))]">
          <span className="rounded-full border border-brand px-[calc(12/390*var(--mvw))] py-[calc(3/390*var(--mvw))] font-primary text-[calc(11/390*var(--mvw))] font-semibold uppercase text-brand">{reel.badge}</span>
          <span className="font-primary text-[calc(14/390*var(--mvw))] font-bold text-gray-1">{reel.handle}</span>
        </div>
        <p className="font-primary text-[calc(12/390*var(--mvw))] text-gray-1/90">{reel.title}</p>
        <button type="button" onClick={openDetails} className="flex w-fit items-center gap-[calc(6/390*var(--mvw))] rounded-full bg-brand px-[calc(14/390*var(--mvw))] py-[calc(7/390*var(--mvw))] font-primary text-[calc(10/390*var(--mvw))] font-semibold text-gray-1 cursor-pointer">
          <img src={watchIcon} alt="" aria-hidden="true" className="size-[calc(12/390*var(--mvw))]" /> Watch full episode
        </button>
        <p className="font-primary text-[calc(12/390*var(--mvw))] font-bold text-brand/85">{reel.hashtags.join(" ")}</p>
        <p className="font-primary text-[calc(10/390*var(--mvw))] text-gray-1/80">◉ {reel.audio}</p>
        <div className="mt-[calc(4/390*var(--mvw))] flex items-center gap-[calc(8/390*var(--mvw))]">
          <span className="font-primary text-[calc(11/390*var(--mvw))] text-gray-1/70">{currentTimeLabel}</span>
          <div className="h-[calc(3/390*var(--mvw))] flex-1 overflow-clip rounded-full bg-gray-1/25">
            <div className="h-full rounded-full bg-brand" style={{ width: `${progress * 100}%` }} />
          </div>
          <span className="font-primary text-[calc(11/390*var(--mvw))] text-gray-1/90">{totalTimeLabel}</span>
        </div>
      </div>

      {/* Follow toast (above nav) */}
      {toast && (
        <div className="absolute inset-x-[calc(16/390*var(--mvw))] bottom-[calc(84/390*var(--mvw))] z-20 flex items-center gap-[calc(10/390*var(--mvw))] rounded-2xl bg-surface-raised/95 p-[calc(12/390*var(--mvw))] shadow-2xl backdrop-blur-md">
          <img src={reel.creatorAvatar} alt="" className="size-[calc(34/390*var(--mvw))] rounded-full object-cover" />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="font-primary text-[calc(13/390*var(--mvw))] font-semibold text-gray-1">{toast.text}</span>
            <span className="truncate font-primary text-[calc(11/390*var(--mvw))] text-gray-1/60">{toast.sub}</span>
          </div>
          <button type="button" onClick={() => setToast(null)} aria-label="Dismiss" className="shrink-0 px-[calc(4/390*var(--mvw))] font-primary text-[calc(16/390*var(--mvw))] text-gray-1/70 cursor-pointer">×</button>
        </div>
      )}

      {/* Unfollow confirmation */}
      {unfollowAsk && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 px-[calc(32/390*var(--mvw))]">
          <div className="flex w-full flex-col gap-[calc(16/390*var(--mvw))] rounded-2xl bg-page p-[calc(24/390*var(--mvw))] text-center">
            <p className="font-primary text-[calc(15/390*var(--mvw))] font-semibold text-gray-1">Unfollow {reel.handle}?</p>
            <div className="flex gap-[calc(12/390*var(--mvw))]">
              <button type="button" onClick={() => setUnfollowAsk(false)} className="flex-1 rounded-full border border-gray-1/30 py-[calc(10/390*var(--mvw))] font-primary text-[calc(13/390*var(--mvw))] text-gray-1 cursor-pointer">Cancel</button>
              <button type="button" onClick={() => { setFollowing(false); setUnfollowAsk(false); }} className="flex-1 rounded-full bg-brand py-[calc(10/390*var(--mvw))] font-primary text-[calc(13/390*var(--mvw))] font-semibold text-gray-1 cursor-pointer">Unfollow</button>
            </div>
          </div>
        </div>
      )}

      {/* Share Reel bottom sheet */}
      {shareOpen && (
        <div className="absolute inset-0 z-[60] flex flex-col justify-end bg-black/60" onClick={closeShare}>
          <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-[calc(18/390*var(--mvw))] rounded-t-3xl bg-gradient-to-b from-[#1a2548] to-page px-[calc(20/390*var(--mvw))] pb-[calc(28/390*var(--mvw))] pt-[calc(14/390*var(--mvw))]">
            <div className="mx-auto h-[calc(4/390*var(--mvw))] w-[calc(44/390*var(--mvw))] rounded-full bg-gray-1/30" />
            <h3 className="text-center font-primary text-[calc(16/390*var(--mvw))] font-bold text-brand">Share Reel</h3>

            <div className="flex items-center gap-[calc(12/390*var(--mvw))] border-b border-gray-1/10 pb-[calc(16/390*var(--mvw))]">
              <img src={reel.video} alt="" className="h-[calc(60/390*var(--mvw))] w-[calc(46/390*var(--mvw))] shrink-0 rounded-lg object-cover" />
              <div className="flex min-w-0 flex-col gap-[calc(3/390*var(--mvw))]">
                <span className="font-primary text-[calc(14/390*var(--mvw))] font-semibold text-gray-1">{reel.title}</span>
                <span className="font-primary text-[calc(12/390*var(--mvw))] text-gray-1/60">{reel.handle} · {reel.likes} likes</span>
              </div>
            </div>

            <p className="font-primary text-[calc(13/390*var(--mvw))] font-semibold text-gray-1">Share via</p>
            <div className="flex justify-between">
              {SHARE_TARGETS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={s.active ? copyLink : undefined}
                  className="flex flex-col items-center gap-[calc(6/390*var(--mvw))] cursor-pointer"
                >
                  <span className="flex size-[calc(54/390*var(--mvw))] items-center justify-center rounded-full" style={{ background: s.bg }}>
                    <img src={s.icon} alt="" aria-hidden="true" className="size-[calc(26/390*var(--mvw))]" />
                  </span>
                  <span className={classNames("font-primary text-[calc(11/390*var(--mvw))]", s.active ? "text-brand" : "text-gray-1/70")}>{s.key}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-[calc(10/390*var(--mvw))] rounded-full border border-gray-1/15 bg-black/30 py-[calc(6/390*var(--mvw))] pl-[calc(16/390*var(--mvw))] pr-[calc(6/390*var(--mvw))]">
              <span className="min-w-0 flex-1 truncate font-primary text-[calc(12/390*var(--mvw))] text-gray-1/70">{shareUrl}</span>
              <button type="button" onClick={copyLink} className="flex shrink-0 items-center gap-[calc(4/390*var(--mvw))] rounded-full bg-brand px-[calc(16/390*var(--mvw))] py-[calc(7/390*var(--mvw))] font-primary text-[calc(10/390*var(--mvw))] font-semibold text-gray-1 cursor-pointer">
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>

            <button type="button" onClick={closeShare} className="rounded-full bg-gray-1/10 py-[calc(12/390*var(--mvw))] font-primary text-[calc(14/390*var(--mvw))] font-medium text-gray-1 cursor-pointer">
              Cancel
            </button>
          </div>
        </div>
      )}

      <MobileBottomNav />
    </div>
  );
};

export default MobileShortsPlayer;
