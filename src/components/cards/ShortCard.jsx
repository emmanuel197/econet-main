import React from "react";
import classNames from "../../utils/classNames";
import Badge from "../ui/Badge";

const ShortCard = React.forwardRef(
  ({ image, duration = "", title = "Short", className = "", onClick, ...props }, ref) => (
    <div
      ref={ref}
      onClick={onClick}
      className={classNames(
        // Desktop-only reduction 266 -> 227 — the same 0.8533 factor PosterCard's
        // desktop shrink uses (and glotv-main's GTV-092 applied to its ShortCard),
        // so the home page reads as one consistent scale. Mobile pinned to the
        // 390 comp (120px) so the shrink doesn't also land on phones, where the
        // --vw 768 floor previously rendered ~118px.
        "relative size-[calc(227/1728*var(--vw))] shrink-0 cursor-pointer",
        "max-md:size-[calc(120/390*var(--mvw))]",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 rounded-full overflow-clip border-[3px] border-[rgba(218,19,117,0.7)]">
        {image ? (
          <img src={image} alt={title} className="size-full object-cover" />
        ) : (
          <div className="size-full bg-navy-9" />
        )}
      </div>
      {/* Conditional: API items have no duration, and unguarded this rendered as an empty
         purple pill on the homepage Afrishorts rail. */}
      {duration && (
        <Badge
          variant="duration"
          className="absolute left-1/2 -translate-x-1/2 bottom-[calc(9/1728*var(--vw))] max-md:bottom-[calc(8/390*var(--mvw))]"
        >
          {duration}
        </Badge>
      )}
    </div>
  )
);

ShortCard.displayName = "ShortCard";
export default ShortCard;
