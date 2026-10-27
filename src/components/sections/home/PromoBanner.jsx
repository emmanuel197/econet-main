import React from "react";
import classNames from "../../../utils/classNames";

/**
 * PromoBanner — full-width promotional ad banner shown between rails on the Home page
 * (per the API brief: "large promotional banner, similar to the Champions League banner
 * in Mango+", image picked from the banners' preview_image values once the API lands).
 * Renders nothing when no image is available.
 *
 * Props:
 *   image — banner image src
 *   alt   — accessible label for the ad
 *   href  — optional click-through URL (opens in a new tab)
 */
const PromoBanner = React.forwardRef(({ image, alt = "Promotional banner", href, className = "", ...props }, ref) => {
  if (!image) return null;

  const img = (
    <img src={image} alt={alt} className="block w-full h-auto object-cover" loading="lazy" />
  );

  return (
    <section
      ref={ref}
      className={classNames("pr-[calc(53/1728*var(--vw))]", className)}
      {...props}
    >
      <div className="overflow-hidden rounded-[calc(16/1728*var(--vw))]">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {img}
          </a>
        ) : (
          img
        )}
      </div>
    </section>
  );
});

PromoBanner.displayName = "PromoBanner";
export default PromoBanner;
