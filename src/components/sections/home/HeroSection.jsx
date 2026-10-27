import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import classNames from "../../../utils/classNames";
import starIcon from "../../../../assets/icons/home-hero-rating-star.svg";
import playIcon from "../../../../assets/icons/home-hero-watch-now-play.svg";
import addIcon from "../../../../assets/icons/home-hero-my-stuff-add.svg";
import speakerIcon from "../../../../assets/icons/comments-reel-player-control-speaker.svg";

// Background trailer over the backdrop (legacy DynamicBanner/BannerBackground
// logic, revamp UI): image shows until the video can play, trailer starts muted,
// pauses when the hero is scrolled out of view, and falls back to the image on
// error or end. Exported so MobileHero reuses the same trailer surface.
// onActiveChange(bool): fires true once the trailer can play, false on
// error/end — lets a parent (MobileHero) swap layout when the video takes over.
export const HeroTrailer = ({ url, muted, onEnded, onActiveChange }) => {
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    onActiveChange?.(ready && !failed);
  }, [ready, failed]); // eslint-disable-line react-hooks/exhaustive-deps

  // React doesn't reliably sync the <video> `muted` DOM PROPERTY from the
  // attribute prop, so the mute toggle appeared to do nothing — set it
  // imperatively. Runs inside the click's gesture, so browsers allow the unmute.
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !url) return;
    setReady(false);
    setFailed(false);
    let hls;
    if (url.includes(".m3u8") && !v.canPlayType("application/vnd.apple.mpegurl")) {
      if (!Hls.isSupported()) {
        setFailed(true);
        return;
      }
      // MangoTV useHls pattern, hardened: with autoStartLoad (the default) the
      // first fragment request can already be in flight at a low ABR-estimated
      // level before MANIFEST_PARSED fires — the visible "scales up" ramp. Hold
      // loading until the manifest is parsed, pin startLevel to the top
      // rendition, THEN startLoad — first pixels are full quality. currentLevel
      // stays auto so playback can still step down if bandwidth genuinely drops.
      hls = new Hls({
        enableWorker: true,
        capLevelToPlayerSize: false,
        autoStartLoad: false,
        abrEwmaDefaultEstimate: 5_000_000, // 5 Mbps
      });
      hls.loadSource(url);
      hls.attachMedia(v);
      hls.on(Hls.Events.MANIFEST_PARSED, (_evt, data) => {
        if (data.levels?.length) hls.startLevel = data.levels.length - 1;
        hls.startLoad();
        v.play().catch(() => {});
      });
      hls.on(Hls.Events.ERROR, (_evt, data) => {
        if (data.fatal) setFailed(true);
      });
    } else {
      v.src = url;
      v.play().catch(() => {});
    }
    return () => hls?.destroy();
  }, [url]);

  // Legacy paused the trailer past scrollY 350; with fluid scaling, pause once
  // the hero itself is mostly off screen.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onScroll = () => {
      const heroHeight = v.closest("section")?.offsetHeight ?? 600;
      if (window.scrollY < heroHeight * 0.7) v.play().catch(() => {});
      else v.pause();
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [url]);

  if (!url || failed) return null;
  return (
    <video
      ref={videoRef}
      muted={muted}
      autoPlay
      playsInline
      onCanPlay={() => setReady(true)}
      onError={() => setFailed(true)}
      onEnded={() => onEnded?.()}
      className={classNames(
        "absolute inset-0 size-full object-cover transition-opacity duration-700",
        ready ? "opacity-100" : "opacity-0"
      )}
    />
  );
};
import Button from "../../ui/Button";
import Badge from "../../ui/Badge";
import Rating from "../../ui/Rating";
import Divider from "../../ui/Divider";
import PaginationDots from "../../ui/PaginationDots";

// TODO: missing API — spotlight content + "My Stuff" toggle need endpoints (none documented).
const HeroSection = React.forwardRef(
  (
    {
      slide,
      slideCount = 7,
      activeIndex = 0,
      className = "",
      onWatchNow,
      onMyStuff,
      myStuffLabel = "My Stuff",
      trailerUrl = null,
      muted = true,
      onToggleMute,
      onTrailerEnded,
      ...props
    },
    ref
  ) => {
    if (!slide) return null;
    return (
      <section
        ref={ref}
        // Height = the Figma aspect (1117/1728 of width) CAPPED at the viewport,
        // so short-but-wide desktops still show the bottom-anchored details
        // without scrolling; the object-cover backdrop crops the difference.
        className={classNames(
          "relative h-[min(calc(1117/1728*var(--vw)),100vh)] w-full overflow-hidden font-primary",
          className
        )}
        {...props}
      >
        <img src={slide.backdrop} alt="" className="absolute inset-0 size-full object-cover" />
        <HeroTrailer url={trailerUrl} muted={muted} onEnded={onTrailerEnded} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
        <div className="absolute inset-0 bg-black/30" />

        {trailerUrl && (
          <button
            type="button"
            onClick={onToggleMute}
            aria-pressed={muted}
            aria-label={muted ? "Unmute trailer" : "Mute trailer"}
            className="absolute right-[calc(60/1728*var(--vw))] top-[calc(160/1728*var(--vw))] z-10 flex size-[calc(48/1728*var(--vw))] items-center justify-center rounded-full bg-black/40 backdrop-blur-sm cursor-pointer"
          >
            <img
              src={speakerIcon}
              alt=""
              aria-hidden="true"
              className={classNames("size-[calc(20/1728*var(--vw))]", muted && "opacity-40")}
            />
          </button>
        )}

        <div className="absolute bottom-[calc(69/1728*var(--vw))] left-1/2 flex w-[calc(1607/1728*var(--vw))] -translate-x-1/2 items-end justify-between">
          <div className="flex flex-col items-start gap-[calc(24/1728*var(--vw))]">
            {slide.flag && <Badge variant="flag">{slide.flag}</Badge>}

            {slide.titleArt ? (
              <img src={slide.titleArt} alt="" className="h-[calc(136/1728*var(--vw))] w-[calc(375/1728*var(--vw))] object-contain" />
            ) : (
              slide.title && <h1 className="text-5xl font-semibold text-gray-1">{slide.title}</h1>
            )}

            {(slide.rating || slide.maturity || slide.year) && (
              <div className="flex items-center gap-[calc(20/1728*var(--vw))]">
                {slide.rating && <Rating value={slide.rating} icon={starIcon} />}
                {slide.rating && slide.maturity && <Divider />}
                {slide.maturity && <span className="text-2xl text-gray-2">{slide.maturity}</span>}
                {(slide.rating || slide.maturity) && slide.year && <Divider />}
                {slide.year && <span className="text-2xl text-gray-2">{slide.year}</span>}
              </div>
            )}

            <div className="flex items-center gap-[calc(14/1728*var(--vw))]">
              {(slide.genres || []).map((g) => (
                <Badge key={g} variant="genre">
                  {g}
                </Badge>
              ))}
            </div>

            <p className="w-[calc(624/1728*var(--vw))] text-2xl text-gray-1 opacity-80">{slide.description}</p>

            <div className="flex items-start gap-[calc(16/1728*var(--vw))]">
              <Button
                variant="primary"
                size="lg"
                onClick={onWatchNow}
                startIcon={
                  <img src={playIcon} alt="" aria-hidden="true" className="size-[calc(20/1728*var(--vw))]" />
                }
              >
                <span className="font-medium text-xl text-gray-1">Watch Now</span>
              </Button>
              <Button
                variant="secondary"
                size={null}
                onClick={onMyStuff}
                className="self-stretch gap-[calc(6/1728*var(--vw))] px-[calc(18/1728*var(--vw))] font-medium text-xl"
                startIcon={
                  <img src={addIcon} alt="" aria-hidden="true" className="size-[calc(20/1728*var(--vw))]" />
                }
              >
                <span className="font-medium text-xl text-gray-1">{myStuffLabel}</span>
              </Button>
            </div>
          </div>

          <PaginationDots
            count={slideCount}
            activeIndex={activeIndex}
            className="rounded-xl px-[calc(34/1728*var(--vw))] py-[calc(5/1728*var(--vw))]"
          />
        </div>
      </section>
    );
  }
);

HeroSection.displayName = "HeroSection";
export default HeroSection;
