import React from "react";
import classNames from "../../utils/classNames";

// WonaPremiere card — WONA Figma mobile home, section 4041:1276 (cards 4041:1286…1330).
// 118×182 poster with a top-right badge (red "Live" pill, or a pink date pill for an
// upcoming premiere) and a frosted bottom button: "Watch Now" when live, "Remind Me"
// when upcoming. Mobile-only, so every size is on the 390 basis (--mvw).
const m = (px) => `calc(${px}/390*var(--mvw))`;

const IconPlay = (props) => (
  <svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M3 1.8v8.4c0 .5.5.8.9.5l6.4-4.2c.4-.2.4-.8 0-1L3.9 1.3c-.4-.3-.9 0-.9.5z" />
  </svg>
);

// lucide:bell
const IconBell = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const PremiereCard = ({ image, title, live = false, date, onClick, className = "" }) => (
  <div
    onClick={onClick}
    className={classNames(
      "relative shrink-0 cursor-pointer overflow-clip rounded-[5px] border border-[#e1e7f8]",
      className
    )}
    style={{ width: m(118), height: m(182) }}
  >
    <img src={image} alt={title || ""} className="absolute inset-0 size-full object-cover" />
    <div className="absolute inset-0 bg-black/20" />

    {live ? (
      <span
        className="absolute flex items-center rounded-lg bg-[#b42318] font-primary font-semibold text-gray-1"
        style={{ top: m(7), right: m(6), gap: m(4), padding: `${m(2)} ${m(10)}`, fontSize: m(8), lineHeight: m(11) }}
      >
        <span className="rounded-full bg-gray-1" style={{ width: m(3), height: m(3) }} />
        Live
      </span>
    ) : (
      date && (
        <span
          className="absolute rounded-full bg-brand font-primary font-semibold uppercase text-gray-10"
          style={{ top: m(5), right: m(6), padding: `${m(3)} ${m(6)}`, fontSize: m(9), lineHeight: m(11) }}
        >
          {date}
        </span>
      )
    )}

    <div
      className="absolute inset-x-0 bottom-0 flex flex-col items-center bg-gradient-to-b from-transparent to-black/85"
      style={{ gap: m(5), padding: `0 ${m(8)} ${m(8)}` }}
    >
      {title && (
        <span className="w-full truncate text-center font-primary font-semibold text-gray-1" style={{ fontSize: m(11), lineHeight: m(13) }}>
          {title}
        </span>
      )}
      <span
        className="flex w-full items-center justify-center rounded-full bg-gray-1/30 font-primary font-medium text-gray-1 backdrop-blur-md"
        style={{ gap: m(4), padding: `${m(7)} 0`, fontSize: m(10), lineHeight: m(12) }}
      >
        {live ? <IconPlay style={{ width: m(12), height: m(12) }} /> : <IconBell style={{ width: m(12), height: m(12) }} />}
        {live ? "Watch Now" : "Remind Me"}
      </span>
    </div>
  </div>
);

export default PremiereCard;
