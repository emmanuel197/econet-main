import React from "react";
import { Link } from "react-router-dom";
import classNames from "../../../utils/classNames";

// Setting overflow-x-auto also forces overflow-y to auto (CSS spec), which would
// clip the hover scale-up; the vertical padding + matching negative margin gives
// the transform room without adding gap to the page flow.
// onSelect (API mode) routes through openAfrishortsPlayer so the reel queue is
// seeded before navigation; without it the Link's plain /shorts/:id nav is kept
// (fixtures already live in the player's fixture lookup).
const ShortsAvatarRail = ({ items = [], onSelect, className = "" }) => (
  <div
    className={classNames(
      "-my-[calc(10/1728*var(--vw))] overflow-x-auto scrollbar-hide",
      className
    )}
  >
    <div className="flex items-center gap-[calc(16/1728*var(--vw))]  py-[calc(10/1728*var(--vw))]">
      {items.map((s, i) => (
        <Link
          key={s.id ?? i}
          to={`/shorts/${s.id ?? `sr-${i + 1}`}`}
          onClick={onSelect ? (e) => { e.preventDefault(); onSelect(s); } : undefined}
          className="shrink-0 size-[calc(125/1728*var(--vw))] rounded-full overflow-clip border-2 border-brand/80 transition-transform duration-200 hover:scale-105"
        >
          {s.image ? (
            <img src={s.image} alt="" className="size-full object-cover" />
          ) : (
            <div className="size-full bg-navy-9" />
          )}
        </Link>
      ))}
    </div>
  </div>
);

export default ShortsAvatarRail;
