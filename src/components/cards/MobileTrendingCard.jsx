import React from "react";
import { Link } from "react-router-dom";
import classNames from "../../utils/classNames";

const MobileTrendingCard = React.forwardRef(
  ({ id, rank, image, title = "Untitled", views = "", className = "", ...props }, ref) => (
    <Link
      to={`/shorts/${id}`}
      ref={ref}
      className={classNames("shrink-0 w-[108px] flex flex-col gap-1.5", className)}
      {...props}
    >
      <div className="relative aspect-square w-full overflow-clip rounded-lg">
        {image ? (
          <img src={image} alt={title} className="absolute inset-0 size-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-navy-9" />
        )}
        <span
          className="absolute left-2 top-1 font-primary font-bold leading-none text-brand-6"
          style={{
            fontSize: "32px",
            WebkitTextStroke: "1.5px #ffffff",
            paintOrder: "stroke",
            textShadow: "0 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          {rank}
        </span>
      </div>

      <span className="font-primary font-semibold text-xs text-gray-1 leading-tight line-clamp-2">
        {title}
      </span>
      {views && (
        <span className="font-primary text-[10px] text-gray-1/65 leading-none">{views}</span>
      )}
    </Link>
  )
);

MobileTrendingCard.displayName = "MobileTrendingCard";
export default MobileTrendingCard;
