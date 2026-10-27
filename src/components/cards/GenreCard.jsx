import React from "react";
import classNames from "../../utils/classNames";

// 10px radius isn't in the token scale [3/5/8/12/16] — kept as a literal to match the design.
const GenreCard = React.forwardRef(
  ({ image, label = "Genre", className = "", onClick, ...props }, ref) => (
    <div
      ref={ref}
      onClick={onClick}
      className={classNames(
        // Desktop-only reduction 330x224 -> 282x191 (padding 24 -> 20, label
        // 36/24 -> 31/20): the same 0.8533 factor PosterCard's desktop shrink
        // uses (glotv-main GTV-092 applied it to its GenreCard too). Also lands
        // on Search's "Browse By Categories" — same component. Mobile untouched.
        "group relative h-[calc(191/1728*var(--vw))] w-[calc(282/1728*var(--vw))] shrink-0 rounded-[10px] overflow-clip cursor-pointer flex items-end p-[calc(20/1728*var(--vw))]",
        // Below md the --vw system floors at 768 (0.444x) — re-scale on the 390 comp
        // so the card stays phone-sized and its label readable.
        // Radius scales WITH the card: the desktop 10px is a fixed px, so on the smaller
        // mobile card it read as proportionally rounder. 330->156 wide => 10 -> ~5.
        "max-md:h-[calc(105/390*var(--mvw))] max-md:w-[calc(156/390*var(--mvw))] max-md:rounded-[calc(5/390*var(--mvw))] max-md:p-[calc(10/390*var(--mvw))]",
        className
      )}
      {...props}
    >
      {image ? (
        <img
          src={image}
          alt={label}
          className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-navy-9" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[64%] to-black/70" />
      <p className="relative line-clamp-2 font-primary font-bold text-[calc(31/1728*var(--vw))] text-gray-1 leading-[calc(20/1728*var(--vw))] tracking-[-0.5px] max-md:text-[calc(13/390*var(--mvw))] max-md:leading-tight max-md:tracking-normal">
        {label}
      </p>
    </div>
  )
);

GenreCard.displayName = "GenreCard";
export default GenreCard;
