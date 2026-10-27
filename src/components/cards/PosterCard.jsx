import React from "react";
import classNames from "../../utils/classNames";

// Poster-local fluid(): scales on --vwh (height-aware) instead of --vw, so
// posters shrink on wide-but-short screens while the rest of the page keeps
// the width-driven comp scale.
const pf = (px) => `calc(${px} / 1728 * var(--vwh))`;
import playIcon from "../../../assets/icons/home-because-you-watched-card-play.svg";
import addIcon from "../../../assets/icons/home-because-you-watched-card-add.svg";
import Button from "../ui/Button";

const PosterCard = React.forwardRef(
  ({ image, title = "Title", metadata = "", rank = null, className = "", onClick, ...props }, ref) => (
    <div
      ref={ref}
      onClick={onClick}
      className={classNames(
        // Desktop keeps the height-aware --vwh scale; mobile widens past the
        // straddle threshold so the rail's rightmost card peeks past the edge.
        //
        // Desktop-only reduction from the Figma-spec 375x517 to 320x441 (same
        // 375:517 aspect, factor 0.8533): the comp-sized posters read too big on
        // real desktops. Same shrink glotv-main applied to its PosterCard (GTV-092)
        // and every other rail card — every --vwh calc() in the overlay below is
        // rescaled by the same factor so the card's internal proportions hold.
        // Mobile follows the WONA mobile comp: 118x182, 5px radius, thin light border,
        // artwork only (no title overlay).
        "group relative h-[calc(441/1728*var(--vwh))] w-[calc(320/1728*var(--vwh))] shrink-0 cursor-pointer",
        "max-md:h-[calc(182/390*var(--mvw))] max-md:w-[calc(118/390*var(--mvw))]",
        "transition-transform duration-300 ease-in hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {/* Media is clipped in its own layer, not the outer div, so the rank numeral below can overhang past the rounded corner unclipped. */}
      <div className="absolute inset-0 rounded-xl overflow-clip max-md:rounded-[5px] max-md:border max-md:border-[#e1e7f8]">
        {image ? (
          <img
            src={image}
            alt={title}
            className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-navy-9" />
        )}

        <div className="absolute inset-x-0 bottom-0 h-[calc(170/1728*var(--vwh))] max-md:hidden bg-gradient-to-b from-transparent to-black/30 backdrop-blur-[1.25px]" />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between max-md:hidden px-[calc(17/1728*var(--vwh))] pb-[calc(24/1728*var(--vwh))] max-md:px-[calc(12/390*var(--mvw))] max-md:pb-[calc(12/390*var(--mvw))]">
        <div className="flex flex-col gap-[calc(5/1728*var(--vwh))] max-w-[calc(131/1728*var(--vwh))] max-md:max-w-full max-md:gap-[calc(3/390*var(--mvw))]">
          {/* Type sizes inlined on --vwh: the global text-* tokens scale on --vw,
              which reads oversized inside the height-capped card. max-md: scales
              on the mobile comp so text isn't desktop-tiny in the 186px card. */}
          <h3 className="truncate font-primary font-semibold text-[calc(20/1728*var(--vwh))] text-gray-1 leading-[calc(27/1728*var(--vwh))] max-md:text-[calc(13/390*var(--mvw))] max-md:leading-tight">{title}</h3>
          {metadata && (
            <p className="font-primary text-[calc(15/1728*var(--vwh))] text-gray-1/65 leading-none max-md:text-[calc(11/390*var(--mvw))]">{metadata}</p>
          )}
        </div>
        {/* Action buttons are a desktop affordance — on the small mobile card the
            whole poster is tappable (onClick), so hide them below md. */}
        <div className="flex items-end gap-[calc(10/1728*var(--vwh))] shrink-0 max-md:hidden">
          {/* size={null}: Button's md preset pads on --vw — both buttons size on
              --vwh here so they stay equal-height inside the capped card. */}
          <Button
            variant="secondary"
            size={null}
            className="gap-[calc(5/1728*var(--vwh))] px-[calc(17/1728*var(--vwh))] py-[calc(10/1728*var(--vwh))]"
            startIcon={
              <img src={playIcon} alt="" aria-hidden="true" className="size-[calc(17/1728*var(--vwh))]" />
            }
          >
            <span className="font-primary font-medium text-[calc(15/1728*var(--vwh))] text-gray-1 leading-none">Play</span>
          </Button>
          <Button
            variant="secondary"
            iconOnly
            aria-label="Add to My Stuff"
            className="w-[calc(39/1728*var(--vwh))] py-[calc(12/1728*var(--vwh))]"
          >
            <img src={addIcon} alt="" aria-hidden="true" className="size-[calc(14/1728*var(--vwh))]" />
          </Button>
        </div>
        </div>
      </div>

      {/* Rank position alternates: odd ranks sit top-left, even ranks drop lower and overhang further off the left edge. */}
      {rank != null && (
        <div
          className="pointer-events-none absolute flex h-[calc(143/1728*var(--vwh))] w-[calc(80/1728*var(--vwh))] items-center justify-center"
          style={rank % 2 === 0 ? { left: pf(-41), top: pf(195) } : { left: pf(14), top: pf(0) }}
        >
          <span
            className="font-primary font-extrabold leading-none tracking-[-2px] text-[#d97aa9]"
            style={{
              fontSize: pf(200),
              WebkitTextStroke: "3px #e7eaf4", // WONA Figma: fill #d97aa9, 3px #e7eaf4 stroke
              paintOrder: "stroke",
              textShadow: "0px 8px 12.9px rgba(0,0,0,0.14)",
            }}
          >
            {rank}
          </span>
        </div>
      )}
    </div>
  )
);

PosterCard.displayName = "PosterCard";
export default PosterCard;
