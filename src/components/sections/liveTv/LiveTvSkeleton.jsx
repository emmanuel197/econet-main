import React from "react";
import { Pulse } from "../../shared/PageSkeleton";

/**
 * LiveTvSkeleton — placeholder mirroring LiveTvPage's real layout (search bar,
 * category tabs, featured program + On Air schedule rows, live-channels
 * sidebar) at the same fluid sizes, so content doesn't jump when it swaps in.
 */
const LiveTvSkeleton = () => (
  <div className="relative font-primary">
    <div className="flex flex-col gap-[calc(28/1728*var(--vw))] px-[calc(53/1728*var(--vw))] pt-[calc(146/1728*var(--vw))] pb-[calc(96/1728*var(--vw))]">
      {/* Search bar */}
      <Pulse className="h-[calc(56/1728*var(--vw))] w-full rounded-full" />

      {/* Category tab pills */}
      <div className="flex gap-[calc(12/1728*var(--vw))]">
        {Array.from({ length: 7 }, (_, i) => (
          <Pulse
            key={i}
            className="h-[calc(44/1728*var(--vw))] w-[calc(150/1728*var(--vw))] rounded-full"
          />
        ))}
      </div>

      <div className="flex gap-[calc(40/1728*var(--vw))]">
        <div className="flex min-w-0 flex-1 flex-col gap-[calc(36/1728*var(--vw))]">
          {/* Featured live program card */}
          <Pulse className="h-[calc(500/1728*var(--vw))] w-full rounded-2xl" />

          {/* On Air Today: heading + tabs row, then schedule rows */}
          <div className="flex flex-col gap-[calc(20/1728*var(--vw))]">
            <div className="flex items-center justify-between">
              <Pulse className="h-[calc(28/1728*var(--vw))] w-[calc(220/1728*var(--vw))]" />
              <Pulse className="h-[calc(20/1728*var(--vw))] w-[calc(200/1728*var(--vw))]" />
            </div>
            {Array.from({ length: 6 }, (_, i) => (
              <Pulse key={i} className="h-[calc(80/1728*var(--vw))] w-full" />
            ))}
          </div>
        </div>

        {/* Live channels sidebar */}
        <div className="flex w-[calc(380/1728*var(--vw))] shrink-0 flex-col gap-[calc(16/1728*var(--vw))]">
          <Pulse className="h-[calc(28/1728*var(--vw))] w-[calc(200/1728*var(--vw))]" />
          {Array.from({ length: 5 }, (_, i) => (
            <Pulse key={i} className="h-[calc(120/1728*var(--vw))] w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default LiveTvSkeleton;
