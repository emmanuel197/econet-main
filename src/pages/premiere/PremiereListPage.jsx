import React, { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import classNames from "../../utils/classNames";
import { premiereSections, premieresByStatus, titleMeta } from "../../data/premiereFixtures";
import { StatusPill, GenrePills, useReminder, REMINDER_SET_CLASS } from "../../components/sections/premiere/PremiereUi";
import { m, PhoneColumn, BackButton, IconPlay } from "../../components/sections/tvod/TvodUi";

/**
 * PremiereListPage (/premiere/list/:section) — WONA "Showing Now" / "Upcoming Premieres" /
 * "Past Premieres" (comps Frame 14265 + Frame 98 + Frame 673): header image with back,
 * WONAPREMIERE eyebrow, title and count line; All / Movies / Tv Shows tabs with counts
 * (this is where movies and series split); then rows of poster + genres + title (year) +
 * length + synopsis + Watch Now / Remind Me. A row opens the title page.
 */
const TABS = [
  { id: "all", label: "All", match: () => true },
  { id: "movie", label: "Movies", match: (t) => t.type === "movie" },
  { id: "series", label: "Tv Shows", match: (t) => t.type === "series" },
];

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: m(12), height: m(12) }}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const Row = ({ title }) => {
  const navigate = useNavigate();
  const [reminded, toggleReminder] = useReminder(title);
  const open = () => navigate(`/premiere/title/${title.id}`);
  const upcoming = title.status === "upcoming";
  return (
    <div role="button" tabIndex={0} onClick={open} onKeyDown={(e) => e.key === "Enter" && open()} className="flex cursor-pointer" style={{ gap: m(21) }}>
      <div className="relative shrink-0 overflow-clip rounded-[5px]" style={{ width: m(105), height: m(125) }}>
        <img src={title.poster} alt={title.title} className="size-full object-cover" />
        <StatusPill title={title} className="absolute" style={{ top: m(5), left: m(5) }} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col" style={{ gap: m(7) }}>
        <GenrePills genres={title.genres} />
        <div className="flex items-baseline justify-between" style={{ gap: m(8), marginTop: m(6) }}>
          <span className="truncate font-primary font-semibold text-gray-1" style={{ fontSize: m(12) }}>{`${title.title} (${title.year})`}</span>
          <span className="shrink-0 font-primary text-[#9999b3]/65" style={{ fontSize: m(10) }}>{titleMeta(title)}</span>
        </div>
        <p className="line-clamp-2 font-primary text-gray-1/60" style={{ fontSize: m(11) }}>{title.synopsis}</p>
        <button
          type="button"
          onClick={upcoming ? toggleReminder : (e) => (e.stopPropagation(), open())}
          className={classNames(
            "mt-auto flex w-fit cursor-pointer items-center justify-center rounded-full border font-primary font-semibold tracking-[-0.408px]",
            upcoming ? (reminded ? REMINDER_SET_CLASS : "border-transparent bg-gray-1/30 text-gray-1") : "border-gray-1/80 bg-brand text-gray-1"
          )}
          style={{ height: m(32), padding: `0 ${m(16)}`, gap: m(6), fontSize: m(10) }}
        >
          {upcoming ? <BellIcon /> : <IconPlay size={12} />}
          {upcoming ? (reminded ? "Reminder Set" : "Remind Me") : "Watch Now"}
        </button>
      </div>
    </div>
  );
};

const PremiereListPage = () => {
  const { section: sectionKey } = useParams();
  const section = premiereSections[sectionKey];
  const [tab, setTab] = useState("all");
  if (!section) return <Navigate to="/premiere" replace />;
  const items = premieresByStatus(section.status);
  const counts = Object.fromEntries(TABS.map((t) => [t.id, items.filter(t.match).length]));
  const shown = items.filter(TABS.find((t) => t.id === tab).match);

  return (
    <PhoneColumn style={{ paddingBottom: m(60) }}>
      <header className="relative overflow-clip" style={{ height: m(251) }}>
        <img src={section.header} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,transparent_0%,rgba(14,21,44,0.66)_60%)] bg-gradient-to-b from-transparent to-page" />
        <BackButton className="absolute z-10" style={{ left: m(21), top: m(24) }} />
        <div className="absolute flex flex-col" style={{ left: m(21), bottom: m(24), gap: m(6) }}>
          <span className="font-primary text-gray-1/70" style={{ fontSize: m(12) }}>WONAPREMIERE</span>
          <h1 className="font-primary font-bold text-gray-1" style={{ fontSize: m(22) }}>{section.title}</h1>
          <span className="font-primary text-gray-1/70" style={{ fontSize: m(12) }}>{section.subtitle(items.length)}</span>
        </div>
      </header>

      <div className="grid grid-cols-3 border-b border-gray-1/10">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={classNames("-mb-px cursor-pointer border-b-2 font-primary", tab === t.id ? "border-brand bg-gray-1/10 font-semibold text-brand" : "border-transparent text-gray-1/80")}
            style={{ height: m(42), fontSize: m(12) }}
          >
            {t.label}{counts[t.id] ? ` (${String(counts[t.id]).padStart(2, "0")})` : ""}
          </button>
        ))}
      </div>

      <div className="flex flex-col" style={{ gap: m(16), padding: `${m(24)} ${m(21)} 0` }}>
        {shown.length ? (
          shown.map((t) => <Row key={t.id} title={t} />)
        ) : (
          <p className="py-10 text-center font-primary text-gray-1/50" style={{ fontSize: m(13) }}>Nothing here yet.</p>
        )}
      </div>
    </PhoneColumn>
  );
};

export default PremiereListPage;
