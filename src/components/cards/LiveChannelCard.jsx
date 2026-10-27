import React from "react";
import classNames from "../../utils/classNames";
import Badge from "../ui/Badge";
import bellIcon from "../../../assets/icons/epg-sport-on-air-today-schedule-bell-notification.svg";

/**
 * LiveChannelCard — rich EPG card: channel + category chip, LIVE + show title,
 * "Next: …" line, bell, and a progress bar for the running show. Used by the
 * All Live Channels sidebar AND the live segment of On Air Today.
 */
const LiveChannelCard = React.forwardRef(
  ({ data, active = false, onClick, className = "", ...props }, ref) => {
    const { logo, channel, category, title, next, progress = 0 } = data;

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className={classNames(
          "flex w-full items-start gap-[calc(18/1728*var(--vw))] rounded-xl p-[calc(22/1728*var(--vw))] text-left cursor-pointer transition-colors",
          active ? "border border-brand bg-gray-1/10" : "hover:bg-gray-1/10",
          className
        )}
        {...props}
      >
        <img src={logo} alt={channel} className="size-[calc(64/1728*var(--vw))] shrink-0 rounded-lg object-cover" />

        <div className="flex min-w-0 flex-1 flex-col gap-[calc(6/1728*var(--vw))]">
          <div className="flex items-center gap-[calc(10/1728*var(--vw))]">
            <span className="font-primary text-sm text-gray-1/60">{channel}</span>
            <span className="rounded-md bg-gray-1/10 px-[calc(8/1728*var(--vw))] py-[calc(2/1728*var(--vw))] font-primary text-xs text-gray-1/80">
              {category}
            </span>
          </div>
          <div className="flex items-center gap-[calc(8/1728*var(--vw))]">
            <Badge variant="live">LIVE</Badge>
            <span className="min-w-0 font-primary font-semibold text-base leading-snug text-gray-1">{title}</span>
          </div>
          <span className="font-primary text-sm text-gray-1/60">Next: {next}</span>
          <div className="mt-[calc(2/1728*var(--vw))] h-[calc(3/1728*var(--vw))] w-[calc(150/1728*var(--vw))] overflow-clip rounded-full bg-gray-1/15">
            <div className="h-full rounded-full bg-brand" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>

        <img src={bellIcon} alt="" aria-hidden="true" className="size-[calc(18/1728*var(--vw))] shrink-0 opacity-70" />
      </button>
    );
  }
);

LiveChannelCard.displayName = "LiveChannelCard";
export default LiveChannelCard;
