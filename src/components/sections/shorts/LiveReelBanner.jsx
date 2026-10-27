import React from "react";
import { Link } from "react-router-dom";
import classNames from "../../../utils/classNames";
import Badge from "../../ui/Badge";

// WONA Figma 4041:27213 "Frame 511": 381x286 artwork card with a 2px red border; Live pill
// top-left, creator handle (pink) + title on the left and views on the right at the bottom.
// `showLive` is off in API mode: the banner image comes from the rail category's
// heading_image_id, which carries no live/stream flag — the badge would be invented.
// `onClick` lets the page seed the reel queue before navigating (preventDefault).
const LiveReelBanner = ({ data, showLive = true, onClick, className = "" }) => {
  if (!data) return null;
  const { id, image, title, views, handle } = data;
  return (
    <Link
      to={`/shorts/${id}`}
      onClick={onClick}
      className={classNames(
        "group relative block h-[calc(286/1728*var(--vw))] w-full overflow-clip rounded-[20px]",
        showLive && "border-2 border-error-9",
        className
      )}
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black" />
      {showLive && (
        <Badge variant="live" className="absolute left-[calc(20/1728*var(--vw))] top-[calc(16/1728*var(--vw))]">
          Live
        </Badge>
      )}
      <div className="absolute inset-x-[calc(20/1728*var(--vw))] bottom-[calc(24/1728*var(--vw))] flex items-end justify-between gap-[calc(16/1728*var(--vw))]">
        <div className="flex min-w-0 flex-col gap-[calc(4/1728*var(--vw))]">
          {handle && <span className="font-primary font-semibold text-base text-brand">{handle}</span>}
          <span className="font-primary font-semibold text-lg leading-snug text-[#eef0f7] line-clamp-2">{title}</span>
        </div>
        {views && <span className="shrink-0 font-primary text-base text-gray-4">{views}</span>}
      </div>
    </Link>
  );
};

export default LiveReelBanner;
