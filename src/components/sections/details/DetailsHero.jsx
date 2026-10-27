import React, { useState } from "react";
import classNames from "../../../utils/classNames";
import starIcon from "../../../../assets/icons/home-hero-rating-star.svg";
import Badge from "../../ui/Badge";
import Rating from "../../ui/Rating";
import Divider from "../../ui/Divider";

// Clamp threshold: synopses shorter than this render in full, no toggle.
const CLAMP_CHARS = 220;

/**
 * DetailsHero — poster + title/meta/synopsis block for the Movie/Series details
 * pages (no Figma frames exist for these screens — brief: keep the legacy
 * workflow; visuals reuse the revamp's Home hero treatment). Long synopses
 * clamp to three lines behind a Show More toggle. Action buttons are passed as
 * children so each page composes its own row.
 */
const DetailsHero = ({
  image, // backdrop (BACKGROUND art, falls back to poster art)
  poster, // portrait POSTER art — rendered as a card beside the text
  title,
  rating,
  year,
  maturity,
  genres = [],
  description,
  children,
  className = "",
}) => {
  const [showFull, setShowFull] = useState(false);
  const clampable = (description || "").length > CLAMP_CHARS;

  // Desktop: poster beside a left-aligned text column, all --vw. Mobile (max-md):
  // the row stacks into a centred column and everything scales on the 390 mobile
  // comp (--mvw) — the --vw sizes floor at 768 and overflow a phone.
  return (
    <section className={classNames("relative min-h-[calc(760/1728*var(--vw))] w-full overflow-hidden font-primary max-md:min-h-0", className)}>
      {image && <img src={image} alt="" className="absolute inset-0 size-full object-cover" />}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-page" />

      <div className="relative flex w-full items-start gap-[calc(48/1728*var(--vw))] px-[calc(60/1728*var(--vw))] pb-[calc(56/1728*var(--vw))] pt-[calc(180/1728*var(--vw))] max-md:flex-col max-md:items-center max-md:gap-[calc(16/390*var(--mvw))] max-md:px-[calc(20/390*var(--mvw))] max-md:pb-[calc(28/390*var(--mvw))] max-md:pt-[calc(96/390*var(--mvw))] max-md:text-center">
        {poster && (
          <img
            src={poster}
            alt={title}
            className="w-[calc(300/1728*var(--vw))] shrink-0 rounded-2xl border border-gray-1/10 object-cover shadow-2xl max-md:w-[calc(150/390*var(--mvw))] max-md:rounded-[calc(14/390*var(--mvw))]"
            style={{ aspectRatio: "2 / 3" }}
          />
        )}

        <div className="flex flex-col items-start gap-[calc(24/1728*var(--vw))] max-md:items-center max-md:gap-[calc(12/390*var(--mvw))]">
          <h1 className="max-w-[calc(900/1728*var(--vw))] text-5xl font-semibold text-gray-1 max-md:max-w-full max-md:text-[calc(24/390*var(--mvw))]">{title}</h1>

          {(rating || maturity || year) && (
            <div className="flex items-center gap-[calc(20/1728*var(--vw))] max-md:gap-[calc(10/390*var(--mvw))]">
              {rating && <Rating value={rating} icon={starIcon} />}
              {rating && (maturity || year) && <Divider />}
              {maturity && <span className="text-2xl text-gray-2 max-md:text-[calc(13/390*var(--mvw))]">{maturity}</span>}
              {maturity && year && <Divider />}
              {year && <span className="text-2xl text-gray-2 max-md:text-[calc(13/390*var(--mvw))]">{year}</span>}
            </div>
          )}

          {genres.length > 0 && (
            <div className="flex items-center gap-[calc(14/1728*var(--vw))] max-md:flex-wrap max-md:justify-center max-md:gap-[calc(8/390*var(--mvw))]">
              {genres.map((g) => (
                <Badge key={g} variant="genre">
                  {g}
                </Badge>
              ))}
            </div>
          )}

          {description && (
            <div className="flex w-[calc(700/1728*var(--vw))] flex-col items-start gap-[calc(8/1728*var(--vw))] max-md:w-full max-md:items-center max-md:gap-[calc(6/390*var(--mvw))]">
              <p className={classNames("text-2xl text-gray-1 opacity-80 max-md:text-[calc(13/390*var(--mvw))] max-md:leading-relaxed", clampable && !showFull && "line-clamp-3")}>
                {description}
              </p>
              {clampable && (
                <button
                  type="button"
                  onClick={() => setShowFull((s) => !s)}
                  className="cursor-pointer text-xl font-medium text-brand hover:underline max-md:text-[calc(13/390*var(--mvw))]"
                >
                  {showFull ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          )}

          <div className="flex items-center gap-[calc(16/1728*var(--vw))] max-md:w-full max-md:flex-wrap max-md:justify-center max-md:gap-[calc(10/390*var(--mvw))]">{children}</div>
        </div>
      </div>
    </section>
  );
};

export default DetailsHero;
