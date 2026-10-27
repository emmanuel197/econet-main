import React, { useState } from "react";
import classNames from "../../../utils/classNames";
import playIcon from "../../../../assets/icons/home-mobile-hero-play.svg";
import addIcon from "../../../../assets/icons/home-mobile-hero-add-circle.svg";
import playCenter from "../../../../assets/icons/comments-reel-player-play-center.svg";
import speakerIcon from "../../../../assets/icons/comments-reel-player-control-speaker.svg";
import PaginationDots from "../../ui/PaginationDots";
import { HeroTrailer } from "./HeroSection";

const CHIPS = ["All", "Movies", "Tv Shows"];

/**
 * MobileHero — portrait home hero for the 390 comp. Two states, toggled by Watch Now:
 *  - poster : featured artwork with title/metadata/CTA (the default "Homepage" frame)
 *  - playing: the artwork becomes the inline video surface (UI-only — no media files
 *             ship yet, same limitation as the Shorts player), with a centre play/pause.
 * Rendered only below md; the desktop HeroSection stays for md+.
 */
const MobileHero = ({
  slide,
  slideCount = 1,
  activeIndex = 0,
  onWatchNow,
  onMyStuff,
  trailerUrl = null,
  muted = true,
  onToggleMute,
  onTrailerEnded,
  chip: chipProp,
  onChipChange,
  className = "",
}) => {
  const [playing, setPlaying] = useState(false);
  // Once the trailer can play it takes over the whole hero background (like the
  // desktop hero) and the poster circle is hidden.
  const [trailerActive, setTrailerActive] = useState(false);
  // Chips are controlled when the parent passes chip/onChipChange (HomePage
  // filters its feed by content type); uncontrolled fallback keeps other
  // usages rendering unchanged.
  const [chipState, setChipState] = useState("All");
  const chip = chipProp ?? chipState;
  const setChip = onChipChange ?? setChipState;
  if (!slide) return null;

  // Watch Now: if a handler is passed (landing → auth funnel, or a real play
  // route), use it; otherwise fall back to the UI-only play toggle (Home).
  const handleWatch = onWatchNow ? () => onWatchNow() : () => setPlaying((p) => !p);

  return (
    <section
      className={classNames("relative w-full overflow-hidden", className)}
      style={{ height: "calc(640/390*var(--mvw))" }}
    >
      {/* Blurred artwork fills the background; the sharp copy lives in the poster
         below — until the trailer can play, when it takes over full-bleed. */}
      <img src={slide.backdrop} alt="" className="absolute inset-0 size-full scale-110 object-cover blur-2xl brightness-[0.45]" />
      {/* Full-bleed background trailer (same surface as the desktop hero) — fades
         in over the blurred art once ready, and flips trailerActive so the poster
         circle hides. */}
      <HeroTrailer url={trailerUrl} muted={muted} onEnded={onTrailerEnded} onActiveChange={setTrailerActive} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-page" />

      {/* Mute/unmute — only while the trailer plays; right edge mirrors the chips'
         left padding, on the chips row. */}
      {trailerActive && onToggleMute && (
        <button
          type="button"
          onClick={onToggleMute}
          aria-pressed={muted}
          aria-label={muted ? "Unmute trailer" : "Mute trailer"}
          // z-20: sits above the full-width chips row (z-10) that shares this top
          // offset — otherwise the chips container's empty right half swallowed
          // the tap and the mute toggle never fired.
          className="absolute right-[calc(20/390*var(--mvw))] top-[calc(100/390*var(--mvw))] z-20 flex size-[calc(34/390*var(--mvw))] items-center justify-center rounded-full bg-black/40 backdrop-blur-sm cursor-pointer"
        >
          <img
            src={speakerIcon}
            alt=""
            aria-hidden="true"
            className={classNames("size-[calc(16/390*var(--mvw))]", muted && "opacity-40")}
          />
        </button>
      )}

      {/* Filter chips — left edge aligned to the AfriPlay logo (top-bar row px 20/390·mvw).
         Only the active chip is a pink pill; the rest are plain text (no glass pill).
         Container is pointer-events-none so its empty right half doesn't intercept
         taps meant for the mute pill; each chip re-enables pointer events. */}
      <div className="pointer-events-none absolute inset-x-0 top-[calc(100/390*var(--mvw))] z-10 flex justify-start gap-[calc(4/390*var(--mvw))] pl-[calc(20/390*var(--mvw))]">
        {CHIPS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setChip(c)}
            className={classNames(
              "pointer-events-auto rounded-full px-[calc(8/390*var(--mvw))] py-[calc(6/390*var(--mvw))] font-primary text-[calc(13/390*var(--mvw))] font-medium leading-none transition-colors",
              chip === c ? "bg-brand text-gray-1" : "text-gray-1/70"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Poster + text as one centred column near the hero's bottom, with bottom
         padding so the CTA clears the hero edge (Figma leaves ~28 below the
         buttons). Gap of 18 between the circle and the text block. */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-[calc(18/390*var(--mvw))] pb-[calc(28/390*var(--mvw))]">
        {/* Circular poster — the sharp featured artwork (253×253). Hidden once
           the trailer takes over the full hero background. */}
        {!trailerActive && (
          <div className="relative size-[calc(253/390*var(--mvw))] overflow-hidden rounded-full shadow-2xl">
            {/* Prefer the LANDSCAPE preview image for the circle. `✅ VERIFIED` 2026-07-30:
               this operator's `banner_image_id` is a pre-composed PORTRAIT hero (1650×2475 —
               blurred backdrop + the key art already circle-cropped + the title baked in), so
               cover-cropping it here produced a circle inside a circle with the subject small
               and ringed by blur. `preview_image_id` is the clean 1920×1080 key art, which
               fills the circle properly. Falls back to the backdrop when there is no preview. */}
            <img
              src={slide.previewImage || slide.backdrop}
              alt={slide.title || ""}
              className="absolute inset-0 size-full object-cover"
            />
            {/* Playing state: centre play/pause over the poster surface */}
            {playing && (
              <button
                type="button"
                onClick={() => setPlaying(false)}
                aria-label="Pause"
                className="absolute left-1/2 top-1/2 flex size-[calc(60/390*var(--mvw))] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm cursor-pointer"
              >
                <span className="flex items-center gap-[calc(5/390*var(--mvw))]" aria-hidden="true">
                  <span className="h-[calc(20/390*var(--mvw))] w-[calc(6/390*var(--mvw))] rounded-sm bg-gray-1" />
                  <span className="h-[calc(20/390*var(--mvw))] w-[calc(6/390*var(--mvw))] rounded-sm bg-gray-1" />
                </span>
              </button>
            )}
          </div>
        )}

        {/* Text area (≈200 wide) — Figma stacks badge → title → genres → dots →
           CTA with ~12 between each. */}
        <div className="flex w-[calc(200/390*var(--mvw))] flex-col items-center gap-[calc(12/390*var(--mvw))] text-center">
        {slide.flag && (
          <span className="rounded-full bg-black/40 px-[calc(14/390*var(--mvw))] py-[calc(5/390*var(--mvw))] font-primary text-[calc(12/390*var(--mvw))] text-gray-1">
            {slide.flag}
          </span>
        )}

        {slide.titleArt ? (
          <img src={slide.titleArt} alt={slide.title || ""} className="h-[calc(60/390*var(--mvw))] w-auto object-contain" />
        ) : (
          slide.title && <h1 className="font-primary text-[calc(30/390*var(--mvw))] font-bold leading-tight text-gray-1">{slide.title}</h1>
        )}

        {slide.genres?.length > 0 && (
          <p className="font-primary text-[calc(13/390*var(--mvw))] text-gray-1/80">
            {slide.genres.join("  •  ")}
          </p>
        )}

        {slideCount > 1 && <PaginationDots count={slideCount} activeIndex={activeIndex} />}

        {/* Flat CTA row: Watch Now + 36×36 add button, 10px gap, lifted from the
           block above (Figma leaves a clear gap before the buttons). */}
        <div className="mt-[calc(6/390*var(--mvw))] flex items-center gap-[calc(10/390*var(--mvw))]">
          <button
            type="button"
            onClick={handleWatch}
            className="flex h-[calc(40/390*var(--mvw))] items-center gap-[calc(7/390*var(--mvw))] rounded-full bg-brand px-[calc(22/390*var(--mvw))] font-primary text-[calc(14/390*var(--mvw))] font-semibold text-gray-1 cursor-pointer"
          >
            <img src={playing ? playCenter : playIcon} alt="" aria-hidden="true" className="size-[calc(14/390*var(--mvw))]" />
            Watch Now
          </button>
          <button
            type="button"
            onClick={onMyStuff}
            aria-label="Add to My Stuff"
            className="flex size-[calc(40/390*var(--mvw))] items-center justify-center rounded-full border border-gray-1/40 bg-black/30 cursor-pointer"
          >
            <img src={addIcon} alt="" aria-hidden="true" className="size-[calc(18/390*var(--mvw))]" />
          </button>
        </div>
        </div>
      </div>
    </section>
  );
};

export default MobileHero;
