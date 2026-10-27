import React from "react";
import { Link } from "react-router-dom";
import classNames from "../../utils/classNames";
import Badge from "../ui/Badge";

// Title/views sit below the image, not overlaid — unlike the desktop ShortGridTile.
const MobileShortGridTile = React.forwardRef(
  ({ id, image, title = "Untitled", duration = "", views = "", className = "", ...props }, ref) => (
    <Link
      to={`/shorts/${id}`}
      ref={ref}
      className={classNames("flex flex-col gap-1.5", className)}
      {...props}
    >
      <div className="relative aspect-[16/10] w-full overflow-clip rounded-lg">
        {image ? (
          <img src={image} alt={title} className="absolute inset-0 size-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-navy-9" />
        )}
        {/* Conditional — API items carry no duration; unguarded it renders an empty pill. */}
        {duration && (
          <Badge variant="duration" className="absolute right-1.5 top-1.5">
            {duration}
          </Badge>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="font-primary font-medium text-xs text-gray-1 leading-tight line-clamp-1">
          {title}
        </span>
        {views && (
          <span className="font-primary text-[10px] text-gray-1/60 leading-none">{views}</span>
        )}
      </div>
    </Link>
  )
);

MobileShortGridTile.displayName = "MobileShortGridTile";
export default MobileShortGridTile;
