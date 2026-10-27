import React from "react";
import classNames from "../../utils/classNames";
import playButton from "../../../assets/icons/home-keep-watching-play-button.svg";
import keepWatchingProgress from "../../../assets/icons/home-keep-watching-progress-bar.svg";
import liveProgress from "../../../assets/icons/home-live-on-tv-now-progress-bar.svg";
import Badge from "../ui/Badge";

const ContinueCard = React.forwardRef(
  ({ image, title = "Title", subtitle = "", variant = "keep-watching", progress = null, className = "", onClick, ...props }, ref) => {
    // progress (0–100): real playback progress — renders a live bar. The SVG
    // asset is the design-fixture fallback (its gold fill is FIXED-width, so it
    // can't represent actual progress).
    const progressSrc = variant === "live" ? liveProgress : keepWatchingProgress;
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={classNames(
          // Desktop-only reduction 387x210 -> 330x179: the same 0.8533 factor
          // PosterCard's desktop shrink uses (glotv-main GTV-092 applied it to
          // its ContinueCard too) — every other desktop calc() below is rescaled
          // by the same factor. Backs both Keep Watching and Live On Tv Now.
          // Mobile follows the WONA mobile comp: Keep Watching 199x130, Live on TV 155x95.
          "relative h-[calc(179/1728*var(--vw))] w-[calc(330/1728*var(--vw))] shrink-0 rounded-sm overflow-clip cursor-pointer",
          variant === "live"
            ? "max-md:h-[calc(95/390*var(--mvw))] max-md:w-[calc(155/390*var(--mvw))]"
            : "max-md:h-[calc(130/390*var(--mvw))] max-md:w-[calc(199/390*var(--mvw))]",
          className
        )}
        {...props}
      >
        {image ? (
          <img src={image} alt={title} className="absolute inset-0 size-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-navy-9" />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[51%] to-black/85" />

        {variant === "live" && (
          <Badge variant="live" className="absolute top-[calc(10/1728*var(--vw))] left-[calc(10/1728*var(--vw))] max-md:top-[calc(6/390*var(--mvw))] max-md:left-[calc(6/390*var(--mvw))]">
            LIVE
          </Badge>
        )}

        <img
          src={playButton}
          alt=""
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[calc(34/1728*var(--vw))] opacity-50 max-md:size-[calc(26/390*var(--mvw))]"
        />

        {/* Below md the --vw system floors at 768 (0.444x), which rendered these labels
           at ~7px. Mirror PosterCard and re-scale the caption on the 390 comp.
           Desktop type is a literal calc (24 -> 20, 18 -> 15) rather than the global
           text-2xl/text-lg tokens, so it shrinks with the card. */}
        <div className="absolute inset-x-0 bottom-[calc(26/1728*var(--vw))] flex flex-col gap-[calc(5/1728*var(--vw))] px-[calc(10/1728*var(--vw))] max-md:bottom-[calc(10/390*var(--mvw))] max-md:gap-[calc(2/390*var(--mvw))] max-md:px-[calc(8/390*var(--mvw))]">
          <span className="truncate font-primary font-semibold text-[calc(20/1728*var(--vw))] text-gray-1 leading-none max-md:text-[calc(13/390*var(--mvw))] max-md:leading-tight">{title}</span>
          {subtitle && (
            <span className="truncate font-primary text-[calc(15/1728*var(--vw))] text-gray-1/65 leading-none max-md:text-[calc(10/390*var(--mvw))]">{subtitle}</span>
          )}
        </div>

        {progress != null ? (
          <div className="absolute inset-x-0 bottom-0 h-[calc(7/1728*var(--vw))] bg-gray-1/20 max-md:h-[calc(3/390*var(--mvw))]">
            <div
              className="h-full bg-brand"
              style={{ width: `${Math.min(100, Math.max(2, progress))}%` }}
            />
          </div>
        ) : (
          <img src={progressSrc} alt="" aria-hidden="true" className="absolute inset-x-0 bottom-0 w-full h-[calc(7/1728*var(--vw))] max-md:h-[calc(3/390*var(--mvw))]" />
        )}
      </div>
    );
  }
);

ContinueCard.displayName = "ContinueCard";
export default ContinueCard;
