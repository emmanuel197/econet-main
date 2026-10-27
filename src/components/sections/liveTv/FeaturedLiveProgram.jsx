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
        "relative flex h-[calc(549/1728*var(--vw))] w-full items-center gap-[calc(74/1728*var(--vw))] overflow-clip rounded-[calc(24/1728*var(--vw))]",
        "bg-black/32 p-[calc(40/1728*var(--vw))]",
        className
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-[calc(24/1728*var(--vw))]">
        <div className="flex items-center gap-[calc(16/1728*var(--vw))]">
          {status === "LIVE" && <Badge variant="live">LIVE</Badge>}
          {watching && <span className="font-primary text-xl text-gray-1/60">{watching}</span>}
        </div>

        <div className="flex items-center gap-[calc(10/1728*var(--vw))]">
          <img src={channelLogo} alt="" className="size-[calc(48/1728*var(--vw))] rounded-md object-contain" />
          <span className="font-primary text-xl font-medium text-gray-1/60">{channelLabel}</span>
        </div>

        <h2 className="font-primary font-semibold text-h6 leading-[1.23] text-brand">
          {title}
          {subtitle && (
            <>
              <br />
              {subtitle}
            </>
          )}
        </h2>

        {teamA && teamB && (
          <div className="flex items-center gap-[calc(59/1728*var(--vw))]">
            <div className="flex flex-col items-center gap-[calc(10/1728*var(--vw))]">
              <img src={teamA.flag} alt="" className="h-[calc(45/1728*var(--vw))] w-[calc(45/1728*var(--vw))] rounded-sm" />
              <span className="font-primary text-lg text-gray-1">{teamA.name}</span>
            </div>
            <div className="flex flex-col items-center gap-[calc(8/1728*var(--vw))]">
              <span className="flex items-center gap-[calc(30/1728*var(--vw))] font-primary font-semibold text-[calc(44/1728*var(--vw))] leading-none text-gray-1">
                {teamA.score} <span className="text-[calc(56/1728*var(--vw))] font-medium text-gray-1/60">-</span> <span className="text-gray-1/60">{teamB.score}</span>
              </span>
              <span className="rounded-full border-[0.5px] border-error-7 bg-[#ef4444]/15 px-[calc(12/1728*var(--vw))] py-[calc(4/1728*var(--vw))] font-primary text-lg font-semibold text-error-7">
                {minute}
              </span>
            </div>
            <div className="flex flex-col items-center gap-[calc(10/1728*var(--vw))]">
              <img src={teamB.flag} alt="" className="h-[calc(45/1728*var(--vw))] w-[calc(45/1728*var(--vw))] rounded-sm" />
              <span className="font-primary text-lg text-gray-1/60">{teamB.name}</span>
            </div>
          </div>
        )}

        <div className="flex w-full flex-col gap-[calc(13/1728*var(--vw))]">
          <div className="flex items-center justify-between font-primary text-lg text-gray-1/60">
            <span>{startTime}</span>
            <span>{remaining}</span>
            <span>{endTime}</span>
          </div>
          <div className="h-[calc(4/1728*var(--vw))] w-full overflow-clip rounded-full bg-gray-1/10">
            <div className="h-full rounded-full bg-brand" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>

        <div className="flex items-center gap-[calc(16/1728*var(--vw))] pt-[calc(8/1728*var(--vw))]">
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
        className="h-full w-[calc(450/1728*var(--vw))] shrink-0 rounded-[calc(16/1728*var(--vw))] object-cover"
      />
    </div>
  );
};

export default FeaturedLiveProgram;
