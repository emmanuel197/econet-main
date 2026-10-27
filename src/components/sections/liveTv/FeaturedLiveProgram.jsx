import React from "react";
import classNames from "../../../utils/classNames";
import Badge from "../../ui/Badge";
import Button from "../../ui/Button";
import playIcon from "../../../../assets/icons/home-hero-watch-now-play.svg";
import fullGuideIcon from "../../../../assets/icons/epg-sport-featured-live-program-full-guide-menu.svg";

// The only shipped EPG image is a square 3×3 tile COLLAGE (rounded cards with
// transparent gutters), not a full-bleed hero photo — so it sits contained on the
// right and the text column gets the left half.
const FeaturedLiveProgram = ({ program, onWatchNow, onFullGuide, className = "" }) => {
  if (!program) return null;
  const {
    image, status, watching, channelLogo, channelLabel, title, subtitle,
    teamA, teamB, minute, startTime, endTime, remaining, progress,
  } = program;

  return (
    <div
      className={classNames(
        "relative flex h-[calc(500/1728*var(--vw))] w-full items-center gap-[calc(20/1728*var(--vw))] overflow-clip rounded-2xl",
        "bg-gradient-to-r from-[#1a2548] via-[#0f1a3e] to-[#0e152c] p-[calc(32/1728*var(--vw))]",
        className
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-[calc(14/1728*var(--vw))]">
        <div className="flex items-center gap-[calc(12/1728*var(--vw))]">
          {status === "LIVE" && <Badge variant="live">LIVE</Badge>}
          <span className="font-primary text-base text-gray-1/70">{watching}</span>
        </div>

        <div className="flex items-center gap-[calc(10/1728*var(--vw))]">
          <img src={channelLogo} alt="" className="h-[calc(28/1728*var(--vw))] w-auto rounded-md object-contain" />
          <span className="font-primary text-base text-gray-1/80">{channelLabel}</span>
        </div>

        <h2 className="font-primary font-bold text-h5 leading-tight text-gray-1">
          {title}
          <br />
          <span className="text-brand">{subtitle}</span>
        </h2>

        {teamA && teamB && (
          <div className="flex items-center gap-[calc(32/1728*var(--vw))]">
            <div className="flex flex-col items-center gap-[calc(6/1728*var(--vw))]">
              <img src={teamA.flag} alt="" className="h-[calc(45/1728*var(--vw))] w-[calc(45/1728*var(--vw))] rounded-sm" />
              <span className="font-primary text-sm text-gray-1/70">{teamA.name}</span>
            </div>
            <div className="flex flex-col items-center gap-[calc(6/1728*var(--vw))]">
              <span className="font-primary font-bold text-h5 leading-none text-gray-1">
                {teamA.score} <span className="text-gray-1/40">-</span> {teamB.score}
              </span>
              <span className="rounded-full bg-error-8/25 px-[calc(12/1728*var(--vw))] py-[calc(2/1728*var(--vw))] font-primary text-xs text-error-8">
                {minute}
              </span>
            </div>
            <div className="flex flex-col items-center gap-[calc(6/1728*var(--vw))]">
              <img src={teamB.flag} alt="" className="h-[calc(45/1728*var(--vw))] w-[calc(45/1728*var(--vw))] rounded-sm" />
              <span className="font-primary text-sm text-gray-1/70">{teamB.name}</span>
            </div>
          </div>
        )}

        <div className="flex w-[calc(380/1728*var(--vw))] flex-col gap-[calc(8/1728*var(--vw))]">
          <div className="flex items-center justify-between font-primary text-sm text-gray-1/60">
            <span>{startTime}</span>
            <span>{remaining}</span>
            <span>{endTime}</span>
          </div>
          <div className="h-[calc(4/1728*var(--vw))] w-full overflow-clip rounded-full bg-gray-1/15">
            <div className="h-full rounded-full bg-brand" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>

        <div className="flex items-center gap-[calc(12/1728*var(--vw))] pt-[calc(6/1728*var(--vw))]">
          <Button
            variant="primary"
            size="lg"
            onClick={onWatchNow}
            startIcon={<img src={playIcon} alt="" aria-hidden="true" className="size-[calc(20/1728*var(--vw))]" />}
          >
            Watch Now
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={onFullGuide}
            startIcon={<img src={fullGuideIcon} alt="" aria-hidden="true" className="size-[calc(18/1728*var(--vw))]" />}
          >
            Full Guide
          </Button>
        </div>
      </div>

      {/* Slightly wider than the square source; object-cover trims the collage's
         partial top/bottom tile rows, pulling it closer to the text column. */}
      <img
        src={image}
        alt={title}
        className="h-full w-[calc(510/1728*var(--vw))] shrink-0 rounded-xl object-cover"
      />
    </div>
  );
};

export default FeaturedLiveProgram;
