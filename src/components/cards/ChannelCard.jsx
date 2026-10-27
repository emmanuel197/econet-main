import React from "react";
import classNames from "../../utils/classNames";

// 20px radius isn't in the token scale [3/5/8/12/16] — kept as a literal to match the design.
const ChannelCard = React.forwardRef(
  ({ image, live = false, title = "Channel", className = "", onClick, ...props }, ref) => (
    <div
      ref={ref}
      onClick={onClick}
      className={classNames(
        // Desktop-only reduction 388x224 -> 331x191 (live dot 14 -> 12 at 11/10):
        // the same 0.8533 factor PosterCard's desktop shrink uses (glotv-main
        // GTV-092 applied it to its ChannelCard too), so the page reads as one
        // consistent shrink. Mobile follows the WONA mobile comp (164x92).
        "relative h-[calc(191/1728*var(--vw))] w-[calc(331/1728*var(--vw))] shrink-0 rounded-[20px] overflow-clip cursor-pointer",
        "max-md:h-[calc(92/390*var(--mvw))] max-md:w-[calc(164/390*var(--mvw))] max-md:rounded-[calc(10/390*var(--mvw))]",
        live && "border border-error-8",
        className
      )}
      {...props}
    >
      {image ? (
        <img src={image} alt={title} className="absolute inset-0 size-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-navy-9" />
      )}
      {live && (
        <span className="absolute top-[calc(10/1728*var(--vw))] left-[calc(11/1728*var(--vw))] size-[calc(12/1728*var(--vw))] rounded-full bg-gradient-to-b from-error-8 to-[#731811] max-md:top-[calc(7/390*var(--mvw))] max-md:left-[calc(7/390*var(--mvw))] max-md:size-[calc(8/390*var(--mvw))]" />
      )}
    </div>
  )
);

ChannelCard.displayName = "ChannelCard";
export default ChannelCard;
