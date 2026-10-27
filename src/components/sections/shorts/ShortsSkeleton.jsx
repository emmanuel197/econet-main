import React from "react";
import { Pulse } from "../../shared/PageSkeleton";

/**
 * ShortsSkeleton — placeholder mirroring ShortsPage's real layout (heading,
 * filter chips, avatar rail, tall/short brick grid, live banner + Trending Now
 * sidebar) at the same fluid sizes, so content doesn't jump when it swaps in.
 */
const GRID_COLUMNS = 4;

const ShortsSkeleton = () => (
  <div className="relative min-h-screen font-primary">
    <div className="flex justify-between gap-x-[calc(24/1728*var(--vw))] pl-[calc(53/1728*var(--vw))] pr-[calc(53/1728*var(--vw))] pt-[calc(146/1728*var(--vw))] pb-[calc(64/1728*var(--vw))]">
      <div className="flex shrink-0 flex-col gap-[calc(32/1728*var(--vw))]">
        {/* Heading + subtitle */}
        <div className="flex flex-col gap-[calc(10/1728*var(--vw))]">
          <Pulse className="h-[calc(40/1728*var(--vw))] w-[calc(320/1728*var(--vw))]" />
          <Pulse className="h-[calc(20/1728*var(--vw))] w-[calc(260/1728*var(--vw))]" />
        </div>

        {/* Filter chips */}
        <div className="flex gap-[calc(12/1728*var(--vw))]">
          {Array.from({ length: 4 }, (_, i) => (
            <Pulse key={i} className="h-[calc(38/1728*var(--vw))] w-[calc(110/1728*var(--vw))] rounded-full" />
          ))}
        </div>

        {/* Avatar circle rail */}
        <div className="flex gap-[calc(16/1728*var(--vw))]">
          {Array.from({ length: 8 }, (_, i) => (
            <Pulse key={i} className="size-[calc(125/1728*var(--vw))] shrink-0 rounded-full" />
          ))}
        </div>

        {/* "For You" heading + brick grid (tall/short checkerboard like the real grid) */}
        <div className="flex flex-col gap-[calc(24/1728*var(--vw))]">
          <Pulse className="h-[calc(28/1728*var(--vw))] w-[calc(140/1728*var(--vw))]" />
          <div className="flex gap-x-[calc(24/1728*var(--vw))]">
            {Array.from({ length: GRID_COLUMNS }, (_, col) => (
              <div key={col} className="flex flex-col gap-[calc(24/1728*var(--vw))]">
                {Array.from({ length: 3 }, (_, row) => {
                  const isTall = row % 2 === col % 2;
                  return (
                    <Pulse
                      key={row}
                      className={
                        isTall
                          ? "h-[calc(285/1728*var(--vw))] w-[calc(245/1728*var(--vw))] rounded-lg"
                          : "h-[calc(206/1728*var(--vw))] w-[calc(245/1728*var(--vw))] rounded-lg"
                      }
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar: live banner + Trending Now rows */}
      <aside className="flex w-[calc(380/1728*var(--vw))] shrink-0 flex-col gap-[calc(32/1728*var(--vw))]">
        <Pulse className="h-[calc(360/1728*var(--vw))] w-full rounded-2xl" />
        <div className="flex flex-col gap-[calc(16/1728*var(--vw))]">
          <Pulse className="h-[calc(24/1728*var(--vw))] w-[calc(180/1728*var(--vw))]" />
          {Array.from({ length: 4 }, (_, i) => (
            <Pulse key={i} className="h-[calc(96/1728*var(--vw))] w-full rounded-xl" />
          ))}
        </div>
      </aside>
    </div>
  </div>
);

export default ShortsSkeleton;
