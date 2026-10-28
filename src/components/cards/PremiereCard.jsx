import React from "react";
import { useNavigate } from "react-router-dom";
import { m, IconPlay } from "../sections/tvod/TvodUi";
import { StatusPill, useReminder } from "../sections/premiere/PremiereUi";

// WonaPremiere card — WONA comps (home rail 4041:1276 / "OnTopOfBecauseYouWatched", landing
// rails): 118×182 poster, top-right status pill (red LIVE, pink date for upcoming, grey date
// for past), title and a frosted button — "Watch Now" for live/past, "Remind Me" for
// upcoming. The card opens the title page; the button acts in place.

// lucide:bell
const IconBell = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const PremiereCard = ({ title, className = "" }) => {
  const navigate = useNavigate();
  const [reminded, toggleReminder] = useReminder(title);
  const open = () => navigate(`/premiere/title/${title.id}`);
  const upcoming = title.status === "upcoming";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => e.key === "Enter" && open()}
      className={`relative shrink-0 cursor-pointer overflow-clip rounded-[5px] ${className}`}
      style={{ width: m(118), height: m(182) }}
    >
      <img src={title.poster} alt={title.title} className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-black/20" />
      <StatusPill title={title} className="absolute" style={{ top: m(5), right: m(8) }} />

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center bg-gradient-to-b from-transparent to-black/70" style={{ gap: m(5), padding: `${m(20)} ${m(8)} ${m(8)}` }}>
        <span className="w-full truncate text-center font-primary font-semibold text-gray-1" style={{ fontSize: m(11), lineHeight: m(13) }}>
          {title.title}
        </span>
        <button
          type="button"
          onClick={upcoming ? toggleReminder : (e) => (e.stopPropagation(), open())}
          className={`flex w-full cursor-pointer items-center justify-center rounded-full font-primary font-medium text-gray-1 backdrop-blur-md ${upcoming && reminded ? "bg-brand/80" : "bg-gray-1/30"}`}
          style={{ gap: m(4), height: m(26), fontSize: m(10), lineHeight: m(12) }}
        >
          {upcoming ? <IconBell style={{ width: m(12), height: m(12) }} /> : <IconPlay size={12} />}
          {upcoming ? (reminded ? "Reminder Set" : "Remind Me") : "Watch Now"}
        </button>
      </div>
    </div>
  );
};

export default PremiereCard;
