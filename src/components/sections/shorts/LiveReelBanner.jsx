import React from "react";
import { Link } from "react-router-dom";
import classNames from "../../../utils/classNames";
import Badge from "../../ui/Badge";

// `showLive` is off in API mode: the banner image comes from the rail category's
// heading_image_id, which carries no live/stream flag — the badge would be invented.
// `onClick` lets the page seed the reel queue before navigating (preventDefault).
const LiveReelBanner = ({ data, showLive = true, onClick, className = "" }) => {
  if (!data) return null;
  const { id, image, title, views } = data;

  return (
    <Link
      to={`/shorts/${id}`}
      onClick={onClick}
      className={classNames(
        "group relative block w-full overflow-clip rounded-xl bg-surface-raised/40",
        className
      )}
    >
      <div className="relative aspect-[4/3] w-full">
        {image ? (
          <img
            src={image}
            alt={title}
            className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-navy-9" />
        )}
        {showLive && (
          <Badge variant="live" className="absolute left-[calc(14/1728*var(--vw))] top-[calc(14/1728*var(--vw))]">
            LIVE
          </Badge>
        )}
        <div className="absolute inset-x-0 bottom-0 h-[calc(90/1728*var(--vw))] bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      <div className="flex flex-col gap-[calc(4/1728*var(--vw))] px-[calc(16/1728*var(--vw))] py-[calc(14/1728*var(--vw))]">
        <span className="font-primary font-semibold text-base text-gray-1 leading-snug line-clamp-2">
          {title}
        </span>
        {views && (
          <span className="font-primary text-sm text-gray-1/65 leading-none">{views}</span>
        )}
      </div>
    </Link>
  );
};

export default LiveReelBanner;
