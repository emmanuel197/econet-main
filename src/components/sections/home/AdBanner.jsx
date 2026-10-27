import React from "react";
import classNames from "../../../utils/classNames";
import SectionHeader from "../../ui/SectionHeader";

const AdBanner = ({ data, className = "" }) => {
  if (!data) return null;
  const { asset, title, headline, accentWord, tagline, ctaText, poster, brand } = data;

  // If an asset (SVG/image) is provided, show it directly
  if (asset) {
    return (
      <section className={classNames("mr-[calc(53/1728*var(--vw))] flex flex-col gap-[calc(16/1728*var(--vw))]", className)}>
        {/* The production mobile app labels this banner (CRM `secondbanner`, "Recommended"
           in English). Rendered only when a label exists. */}
        {title && <SectionHeader title={title} showArrow={false} />}
        <div className="relative overflow-clip rounded-2xl">
          <img
            src={asset}
            alt={title || "Ad Banner"}
            // The source is a banner `preview_image` (1920×1080), and `h-auto` made it
            // ~912px tall at desktop width — a wall, not a banner. Cap the height and
            // cover-crop so it reads as a promo strip at any viewport.
            className="w-full max-h-[calc(420/1728*var(--vw))] rounded-2xl object-cover"
          />
        </div>
      </section>
    );
  }

  // Otherwise, render the coded banner version
  const [before, after] = headline?.split(accentWord) || ["", ""];

  return (
    <section
      className={classNames(
        "relative mr-[calc(53/1728*var(--vw))] overflow-clip rounded-2xl",
        "bg-gradient-to-r from-[#0d1f0d] via-[#12280f] to-[#1a3a12]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-[calc(40/1728*var(--vw))] px-[calc(56/1728*var(--vw))] py-[calc(48/1728*var(--vw))]">
        <div className="flex min-w-0 flex-col gap-[calc(18/1728*var(--vw))]">
          <h2 className="font-primary font-bold text-h4 leading-tight text-gray-1">
            "{before}
            <span className="text-[#3db53d]">{accentWord}</span>
            {after}"
          </h2>
          <p className="font-primary text-h6 italic text-gray-1/85">{tagline}</p>
          <p className="mt-[calc(20/1728*var(--vw))] font-primary text-xl italic text-gray-1/90">{ctaText}</p>

          <div className="flex items-center gap-[calc(16/1728*var(--vw))]">
            {["Google Play", "App Store"].map((store) => (
              <span
                key={store}
                className="flex flex-col rounded-lg border border-gray-1/40 bg-black px-[calc(18/1728*var(--vw))] py-[calc(8/1728*var(--vw))]"
              >
                <span className="font-primary text-xs uppercase text-gray-1/70">
                  {store === "App Store" ? "Download on the" : "Get it on"}
                </span>
                <span className="font-primary text-lg font-semibold text-gray-1">{store}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-[calc(40/1728*var(--vw))]">
          {poster && (
            <div className="w-[calc(230/1728*var(--vw))] rotate-6 overflow-clip rounded-2xl border-4 border-black shadow-2xl">
              <img src={poster} alt="" className="aspect-[9/16] w-full object-cover" />
            </div>
          )}
          <span className="font-primary text-h5 font-bold text-[#3db53d]">{brand}</span>
        </div>
      </div>
    </section>
  );
};

export default AdBanner;
