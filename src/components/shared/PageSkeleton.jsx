import React from "react";
import classNames from "../../utils/classNames";

export const Pulse = ({ className = "" }) => (
  <div className={classNames("animate-pulse rounded-xl bg-gray-1/10", className)} />
);

/**
 * PageSkeleton — hero + poster-rail placeholders shown while a page's API
 * content is loading. Exists to kill the fixtures flash: rails fall back to
 * fixture posters when empty, so without this gate the dummy art rendered for
 * the first fetch round-trip before real content swapped in.
 */
const PageSkeleton = ({ rails = 3, hero = true }) => (
  <div className="relative overflow-hidden font-primary">
    {hero && <Pulse className="h-[min(calc(1117/1728*var(--vw)),100vh)] w-full rounded-none" />}
    <div className="flex flex-col gap-[calc(48/1728*var(--vw))] pl-[calc(53/1728*var(--vw))] py-[calc(64/1728*var(--vw))]">
      {Array.from({ length: rails }, (_, r) => (
        <div key={r} className="flex flex-col gap-[calc(20/1728*var(--vw))]">
          <Pulse className="h-[calc(36/1728*var(--vw))] w-[calc(320/1728*var(--vw))]" />
          <div className="flex gap-[calc(23/1728*var(--vw))] overflow-hidden">
            {/* Kept in sync with PosterCard's actual box (320x441 on the
                height-aware --vwh, 186x256 on the 390 mobile comp) — otherwise
                the skeleton reserves more room than the card and the rail
                visibly shrinks once data lands. */}
            {Array.from({ length: 5 }, (_, i) => (
              <Pulse key={i} className="h-[calc(441/1728*var(--vwh))] w-[calc(320/1728*var(--vwh))] shrink-0 max-md:h-[calc(256/390*var(--mvw))] max-md:w-[calc(186/390*var(--mvw))]" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default PageSkeleton;
