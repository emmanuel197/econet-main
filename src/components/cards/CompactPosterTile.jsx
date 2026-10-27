import React from "react";
import classNames from "../../utils/classNames";

/**
 * CompactPosterTile — poster-only thumbnail for the Search results grid
 * (Movies/TV Shows tabs, 6 per row). No title/metadata overlay — the artwork
 * itself carries the title, unlike the bigger PosterCard used elsewhere.
 */
const CompactPosterTile = React.forwardRef(
  ({ image, title = "Title", className = "", onClick, ...props }, ref) => (
    <div
      ref={ref}
      onClick={onClick}
      className={classNames(
        "group aspect-[2/3] w-[calc(250/1728*var(--vw))] shrink-0 cursor-pointer overflow-clip rounded-lg border border-brand/70",
        className
      )}
      {...props}
    >
      {image ? (
        <img
          src={image}
          alt={title}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="size-full bg-navy-9" />
      )}
    </div>
  )
);

CompactPosterTile.displayName = "CompactPosterTile";
export default CompactPosterTile;
