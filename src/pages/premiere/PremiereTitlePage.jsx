import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import classNames from "../../utils/classNames";
import { getPremiereTitle, titleMeta } from "../../data/premiereFixtures";
import { showPreviewNotice } from "../../utils/toast";
import logo from "../../../assets/logos/wona-logo.svg";
import { CountdownInline, GenrePills, useReminder, useMyStuff, REMINDER_SET_CLASS } from "../../components/sections/premiere/PremiereUi";
import { m, PhoneColumn, BackButton, PrimaryButton, SecondaryButton, BarHeading, IconPlay, IconShare, IconChevronDown, IconCheck } from "../../components/sections/tvod/TvodUi";

/**
 * PremiereTitlePage (/premiere/title/:id) — one page, three WONA comps that share the same
 * trailer frame at the top ("premieretrailerhero" / "premieremoviehero" /
 * "standardmovieframeforwonapremiere"):
 *  - upcoming → countdown page ("premieretrailer" / "premieremovie"): PREMIERES IN card,
 *    Remind Me + My Stuff, tabs More Like This | Trailer & More
 *  - live / past movie → standard movie ("restofthestandardmoviepage"): Watch Now + My
 *    Stuff, tabs More Like This | Trailer
 *  - live / past series → standard series ("standardseriesforwonapremiere1/2"): Watch Now +
 *    My Stuff, tabs Episodes (season picker + episode cards) | More Like This | Trailer
 */
const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: m(16), height: m(16) }}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const PlayDisc = ({ size = 45 }) => (
  <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-gray-1" style={{ width: m(size), height: m(size) }}>
    <IconPlay size={18} />
  </span>
);

const EpisodeCard = ({ ep }) => (
  <button type="button" onClick={showPreviewNotice} className="flex w-full cursor-pointer flex-col rounded-[9.6px] border-[0.8px] border-gray-1/10 text-left" style={{ padding: m(12), gap: m(12) }}>
    <span className="relative block w-full overflow-clip rounded-[5px]" style={{ height: m(110) }}>
      <img src={ep.image} alt="" className="absolute inset-0 size-full object-cover" />
      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-b from-transparent to-black/70" style={{ height: m(61), padding: `0 ${m(10)} ${m(8)}` }}>
        <span className="font-primary font-medium text-gray-1" style={{ fontSize: m(12) }}>{`E${ep.n} · ${ep.title}`}</span>
        <span className="font-primary text-gray-1/70" style={{ fontSize: m(10) }}>{ep.length}</span>
      </span>
    </span>
    <span className="font-primary text-gray-1/60" style={{ fontSize: m(12), lineHeight: 1.45 }}>{ep.description}</span>
  </button>
);

const PremiereTitleContent = ({ id }) => {
  const title = getPremiereTitle(id);
  const [reminded, toggleReminder] = useReminder(title);
  const [expanded, setExpanded] = useState(false);
  const [inStuff, toggleStuff] = useMyStuff(title);
  const upcoming = title?.status === "upcoming";
  const isSeries = title?.type === "series";
  const tabs = upcoming
    ? [["more", "More Like This"], ["trailer", "Trailer"]]
    : isSeries
      ? [["episodes", "Episodes"], ["more", "More Like This"], ["trailer", "Trailer"]]
      : [["more", "More Like This"], ["trailer", "Trailer"]];
  const [tab, setTab] = useState(upcoming ? "trailer" : isSeries ? "episodes" : "more");
  const [season, setSeason] = useState(title?.seasons ? title.seasons.length : 1);
  const [seasonOpen, setSeasonOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!title) return <Navigate to="/premiere" replace />;
  const episodes = isSeries ? title.seasons.find((s) => s.n === season)?.episodes || [] : [];

  return (
    <PhoneColumn style={{ paddingBottom: m(40) }}>
      {/* Shared trailer frame */}
      <div className="relative" style={{ height: m(254) }}>
        <img src={title.trailerStill} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-black/20" />
        <BackButton className="absolute" style={{ left: m(21), top: m(13) }} />
        <button
          type="button"
          aria-label="Play trailer"
          onClick={showPreviewNotice}
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-gray-1/70 bg-black/10 text-gray-1 backdrop-blur-sm"
          style={{ width: m(50), height: m(50) }}
        >
          <IconPlay size={20} />
        </button>
      </div>

      <div className="flex flex-col" style={{ padding: `${m(12)} ${m(21)} 0` }}>
        <div className="flex items-center justify-between">
          <img src={logo} alt="WONA" className="w-auto" style={{ height: m(20) }} />
          <span className="font-primary text-gray-1/60" style={{ fontSize: m(12) }}>WONAPREMIERE</span>
        </div>

        <div className="flex items-center justify-between" style={{ marginTop: m(22) }}>
          <h1 className="font-primary font-bold text-gray-1" style={{ fontSize: m(22) }}>{title.title}</h1>
          <button type="button" aria-label="Share" onClick={showPreviewNotice} className="cursor-pointer text-gray-1/80">
            <IconShare size={20} />
          </button>
        </div>

        <div className="flex flex-wrap items-center font-primary text-gray-1/60" style={{ marginTop: m(10), gap: m(7), fontSize: m(12.5) }}>
          <span>{title.year}</span>
          <span className="rounded-full bg-gray-1/60" style={{ width: m(2), height: m(2) }} />
          <span>{titleMeta(title)}</span>
          <span className="rounded-full bg-gray-1/60" style={{ width: m(2), height: m(2) }} />
          {title.badges.map((b) => (
            <span key={b} className="rounded-[4px] bg-gray-1/10 font-medium text-text-soft" style={{ padding: `${m(3)} ${m(8)}`, fontSize: m(10) }}>{b}</span>
          ))}
        </div>

        <div style={{ marginTop: m(14) }}>
          <GenrePills genres={title.genres} size="lg" />
        </div>

        {upcoming ? (
          <>
            <div style={{ marginTop: m(26) }}>
              <CountdownInline at={title.premiereAt} />
            </div>
            <div className="flex" style={{ marginTop: m(16), gap: m(6) }}>
              <PrimaryButton style={{ flex: 1 }} className={reminded ? REMINDER_SET_CLASS : ""} onClick={toggleReminder}>
                <BellIcon /> {reminded ? "Reminder Set" : "Remind Me"}
              </PrimaryButton>
              <SecondaryButton style={{ width: m(inStuff ? 92 : 105) }} onClick={toggleStuff}>
                {inStuff ? (
                  <>
                    <IconCheck size={14} /> Added
                  </>
                ) : (
                  "My Stuff"
                )}
              </SecondaryButton>
            </div>
          </>
        ) : (
          <div className="flex flex-col" style={{ marginTop: m(26), gap: m(8) }}>
            <PrimaryButton style={{ height: m(40) }} onClick={showPreviewNotice}>
              <IconPlay size={14} /> Watch Now
            </PrimaryButton>
            <SecondaryButton style={{ height: m(40) }} onClick={toggleStuff}>
              {inStuff ? (
                <>
                  <IconCheck size={14} /> Added
                </>
              ) : (
                "My Stuff"
              )}
            </SecondaryButton>
          </div>
        )}

        <div className="flex flex-col" style={{ marginTop: m(40), gap: m(18) }}>
          <BarHeading>Synopsis</BarHeading>
          <p className={classNames("font-primary text-gray-1/70", !expanded && "line-clamp-3")} style={{ fontSize: m(13), lineHeight: 1.45 }}>{title.synopsis}</p>
          <button type="button" onClick={() => setExpanded((v) => !v)} className="w-fit cursor-pointer font-primary text-brand" style={{ fontSize: m(13), marginTop: m(-8) }}>
            {expanded ? "Read Less" : "Read More"}
          </button>
        </div>

        <div className="grid grid-cols-3" style={{ marginTop: m(30) }}>
          {title.credits.map((c, i) => (
            <div key={c.label} className={classNames("flex flex-col", i > 0 && "border-l border-gray-1/30")} style={{ gap: m(6), paddingLeft: i > 0 ? m(12) : 0 }}>
              <span className="font-primary text-gray-1/70" style={{ fontSize: m(12) }}>{c.label}</span>
              <span className="font-primary font-semibold text-gray-1" style={{ fontSize: m(13) }}>{c.value}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col" style={{ marginTop: m(36), gap: m(22) }}>
          <BarHeading action={<button type="button" onClick={showPreviewNotice} className="cursor-pointer font-primary font-semibold text-brand" style={{ fontSize: m(11) }}>View Full Credits</button>}>
            Lead Casts
          </BarHeading>
          <div className="flex justify-between">
            {title.cast.map((c) => (
              <div key={c.name} className="flex flex-col items-center text-center" style={{ width: m(110), gap: m(4) }}>
                <img src={c.photo} alt={c.name} className="rounded-full object-cover" style={{ width: m(80), height: m(80), marginBottom: m(10) }} />
                <span className="font-primary text-gray-1" style={{ fontSize: m(11) }}>{c.name}</span>
                <span className="font-primary text-gray-1/60" style={{ fontSize: m(11) }}>{c.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={classNames("grid border-b border-gray-1/30", tabs.length === 3 ? "grid-cols-3" : "grid-cols-2")} style={{ marginTop: m(30) }}>
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={classNames("-mb-px cursor-pointer border-b-2 font-primary", tab === key ? "border-brand font-semibold text-brand" : "border-transparent font-medium text-gray-1/80")}
            style={{ padding: `${m(14)} 0`, fontSize: m(13) }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ padding: `${m(22)} ${m(21)} 0` }}>
        {tab === "episodes" && (
          <div className="flex flex-col" style={{ gap: m(16) }}>
            <div className="relative flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSeasonOpen((o) => !o)}
                className="flex cursor-pointer items-center rounded-full border border-gray-1/10 bg-gray-1/10 font-primary text-gray-1/80"
                style={{ height: m(36), padding: `0 ${m(14)}`, gap: m(10), fontSize: m(12) }}
              >
                Season {season} <IconChevronDown size={14} />
              </button>
              <span className="font-primary text-gray-1/80" style={{ fontSize: m(12) }}>{episodes.length} Episodes</span>
              {seasonOpen && (
                <div className="absolute left-0 z-20 overflow-clip rounded-[12px] border border-gray-1/15 bg-[#21273b] shadow-2xl" style={{ top: m(42), width: m(140) }}>
                  {title.seasons.map((s) => (
                    <button
                      key={s.n}
                      type="button"
                      onClick={() => {
                        setSeason(s.n);
                        setSeasonOpen(false);
                      }}
                      className={classNames("block w-full cursor-pointer text-left font-primary hover:bg-gray-1/10", s.n === season ? "text-brand" : "text-gray-1")}
                      style={{ padding: `${m(10)} ${m(14)}`, fontSize: m(12) }}
                    >
                      Season {s.n}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {episodes.map((ep) => (
              <EpisodeCard key={ep.n} ep={ep} />
            ))}
          </div>
        )}

        {tab === "more" && (
          <div className="grid grid-cols-3" style={{ gap: m(11) }}>
            {title.moreLikeThis.map((img, i) => (
              <img key={i} src={img} alt="" className="w-full rounded-[4.5px] border border-[#e1e7f8] object-cover" style={{ aspectRatio: "108 / 181" }} />
            ))}
          </div>
        )}

        {tab === "trailer" && (
          <div className="flex flex-col" style={{ gap: m(13) }}>
            {title.trailers.map((img, i) => (
              <button key={i} type="button" onClick={showPreviewNotice} className="relative block w-full cursor-pointer overflow-clip rounded-[4.5px] border border-[#e1e7f8]" style={{ height: m(195) }}>
                <img src={img} alt="" className="absolute inset-0 size-full object-cover" />
                <span className="absolute inset-0 bg-black/25" />
                <PlayDisc />
              </button>
            ))}
          </div>
        )}
      </div>
    </PhoneColumn>
  );
};

// Keyed by id so tab / season / reminder state starts fresh for each title
// (React would otherwise reuse this page's state when only :id changes).
const PremiereTitlePage = () => {
  const { id } = useParams();
  return <PremiereTitleContent key={id} id={id} />;
};

export default PremiereTitlePage;
