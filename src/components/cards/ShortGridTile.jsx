import React from "react";
import { Link } from "react-router-dom";
import classNames from "../../utils/classNames";
import fluid from "../../utils/fluid";
import Badge from "../ui/Badge";

/**
 * Shorts "For You" grid tile — Figma `4041:27263` (Component 5 tall 245×285 / Component 6
 * short 245×207, read 2026-07-30).
 *
 * Title + views are OVERLAID on the poster, bottom-left — not stacked beneath it, which is
 * what this component used to do. Per the comp: card radius 20, text block inset left 16 /
 * bottom 20 with a 10 gap, title 20px semibold at 95% white over 2 lines, views 16px
 * regular at 55%; both variants place that block the same distance off the bottom (tall
 * top 191 + 74 tall block = 20 from the bottom; short top 113 + 74 = 20), so it is
 * bottom-anchored rather than offset per height.
 *
 * Titles wrap to at most 2 lines and ellipsize (`line-clamp-2`); the design shows two-line
 * titles and real API titles run longer than the fixtures did.
 */
const ShortGridTile = React.forwardRef(
  (
    { id, image, title = "Untitled", duration = "", views = "", width, height, className = "", ...props },
    ref
  ) => {
    const hasExplicitSize = width != null && height != null;

    return (
      <Link
        to={`/shorts/${id}`}
        ref={ref}
        className={classNames(
          "group relative block overflow-clip rounded-[calc(20/1728*var(--vw))]",
          !hasExplicitSize && "aspect-[16/10] w-full",
          className
        )}
        style={hasExplicitSize ? { width: fluid(width), height: fluid(height) } : undefined}
        {...props}
      >
        {image ? (
          <img
            src={image}
            alt={title}
            className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-navy-9" />
        )}

        {/* Comp has a full-card wash to 30% black plus a blurred bottom-left scrim
           (rgba(0,0,0,.24)→.6) purely so the white text stays legible over bright posters.
           Reproduced as the wash + a bottom gradient rather than the rotated blurred layers. */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
        <div className="absolute inset-x-0 bottom-0 h-[calc(120/1728*var(--vw))] bg-gradient-to-t from-black/60 via-black/25 to-transparent" />

        {/* API rail items carry no duration of their own — the pill shows the feature
           runtime joined in from the movie listing (see api/shorts.js), so it stays
           conditional: unguarded it rendered as an empty pill. */}
        {duration && (
          <Badge
            variant="duration"
            className="absolute right-[calc(12/1728*var(--vw))] top-[calc(9/1728*var(--vw))]"
          >
            {duration}
          </Badge>
        )}

        <div className="absolute bottom-[calc(20/1728*var(--vw))] left-[calc(16/1728*var(--vw))] right-[calc(16/1728*var(--vw))] flex flex-col gap-[calc(10/1728*var(--vw))]">
          <span className="font-primary font-semibold text-[calc(20/1728*var(--vw))] leading-[1.2] text-gray-1/95 line-clamp-2">
            {title}
          </span>
          {views && (
            <span className="font-primary text-lg leading-[calc(16/1728*var(--vw))] text-gray-1/55 line-clamp-1">
              {views} views
            </span>
          )}
        </div>
      </Link>
    );
  }
);

ShortGridTile.displayName = "ShortGridTile";
export default ShortGridTile;
