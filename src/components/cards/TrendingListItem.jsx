import React from "react";
import { Link } from "react-router-dom";
import classNames from "../../utils/classNames";
import fluid from "../../utils/fluid";

const TrendingListItem = React.forwardRef(
  ({ id, rank, image, title = "Untitled", views = "", className = "", ...props }, ref) => (
    <Link
      to={`/shorts/${id}`}
      ref={ref}
      className={classNames("group relative block w-full shrink-0 overflow-clip rounded-[14px]", className)}
      style={{ height: fluid(150) }}
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

      <span className="absolute left-[calc(10/1728*var(--vw))] top-[calc(9/1728*var(--vw))] flex size-[calc(30/1728*var(--vw))] items-center justify-center rounded-full bg-[#ec1882] font-primary font-semibold text-lg text-[#060a16]">
        {rank}
      </span>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-[calc(2/1728*var(--vw))] bg-gradient-to-t from-black/85 via-black/35 to-transparent px-[calc(12/1728*var(--vw))] pb-[calc(10/1728*var(--vw))] pt-[calc(36/1728*var(--vw))]">
        <span className="font-primary font-semibold text-xl text-gray-1 leading-tight line-clamp-2">
          {title}
        </span>
        {views && (
          <span className="font-primary text-base text-gray-4 leading-none">{views}</span>
        )}
      </div>
    </Link>
  )
);

TrendingListItem.displayName = "TrendingListItem";
export default TrendingListItem;
