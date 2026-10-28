import React from "react";
import { useNavigate } from "react-router-dom";
import classNames from "../../utils/classNames";
import { premiereFeatured, getPremiereTitle, premieresByStatus, premiereSections } from "../../data/premiereFixtures";
import PremiereCard from "../../components/cards/PremiereCard";
import { CountdownBoxes, useReminder } from "../../components/sections/premiere/PremiereUi";
import { m, PhoneColumn, IconPlay, IconChevronRight } from "../../components/sections/tvod/TvodUi";

/**
 * PremierePage (/premiere) — WONA WonaPremiere landing (comps "Frame 670" + "Frame 14247"):
 * the home chips with WonaPremiere active, the featured upcoming premiere (title art,
 * genres, Watch Trailer, reminder bell, live PREMIERES IN countdown), then Showing Now,
 * Upcoming Premieres and Past Premieres rails — each heading opens its full list.
 * All / Movies / Tv Shows go back to the home feed with that chip selected.
 */
const CHIPS = ["All", "Movies", "Tv Shows", "WonaPremiere"];

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: m(16), height: m(16) }}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const Rail = ({ sectionKey }) => {
  const navigate = useNavigate();
  const section = premiereSections[sectionKey];
  const items = premieresByStatus(section.status);
  return (
    <section className="flex flex-col" style={{ gap: m(14) }}>
      <button type="button" onClick={() => navigate(`/premiere/list/${sectionKey}`)} className="flex cursor-pointer items-center justify-between text-left" style={{ padding: `0 ${m(21)}` }}>
        <h2 className="font-primary font-semibold tracking-[-0.5px] text-gray-1" style={{ fontSize: m(16) }}>{section.title}</h2>
        <span className="text-[#dbe1f6]"><IconChevronRight size={18} /></span>
      </button>
      <div className="flex overflow-x-auto scrollbar-hide" style={{ gap: m(8), padding: `0 ${m(21)}` }}>
        {items.map((t) => (
          <PremiereCard key={t.id} title={t} />
        ))}
      </div>
    </section>
  );
};

const PremierePage = () => {
  const navigate = useNavigate();
  const featured = getPremiereTitle(premiereFeatured.id);
  const [reminded, toggleReminder] = useReminder(featured);

  return (
    <PhoneColumn style={{ paddingBottom: m(120) }}>
      {/* Featured premiere hero (390×624) */}
      <header className="relative overflow-clip" style={{ height: m(624) }}>
        <img src={premiereFeatured.hero} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-b from-transparent to-page" style={{ height: m(260) }} />

        <div className="absolute flex items-center" style={{ top: m(100), left: m(20), gap: m(4) }}>
          {CHIPS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => (c === "WonaPremiere" ? undefined : navigate("/home", { state: { chip: c } }))}
              className={classNames(
                "cursor-pointer rounded-full font-primary tracking-[-0.408px]",
                c === "WonaPremiere" ? "border-[0.5px] border-gray-1 bg-brand font-semibold text-gray-1" : "text-gray-1/80"
              )}
              style={{ height: m(25), padding: `0 ${m(c === "WonaPremiere" ? 12 : 8)}`, fontSize: m(12) }}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="absolute inset-x-0 flex flex-col items-center" style={{ top: m(259) }}>
          <span className="rounded-full border-[0.5px] border-[#f4f6fc]/70 bg-page/30 font-primary text-[#f7f9fd] backdrop-blur-md" style={{ padding: `${m(4)} ${m(8)}`, fontSize: m(11) }}>
            Featured Premiere
          </span>
          <img src={premiereFeatured.titleArt} alt={featured.title} className="object-contain" style={{ width: m(130), height: m(71), marginTop: m(8) }} />
          <div className="flex items-center font-primary text-gray-1" style={{ marginTop: m(14), gap: m(6), fontSize: m(11.5) }}>
            {featured.genres.map((g, i) => (
              <React.Fragment key={g}>
                {i > 0 && <span className="rounded-full bg-brand" style={{ width: m(4), height: m(4) }} />}
                {g}
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center" style={{ marginTop: m(14), gap: m(4) }}>
            <span className="rounded-full bg-[#e83a8e]" style={{ width: m(28), height: m(8) }} />
            {[0.7, 0.7, 0.5, 0.35, 0.22, 0.22].map((o, i) => (
              <span key={i} className="rounded-full bg-gray-1" style={{ width: m(i < 3 ? 8 : i === 3 ? 6 : 5), height: m(i < 3 ? 8 : i === 3 ? 6 : 5), opacity: o }} />
            ))}
          </div>
          <div className="flex items-center" style={{ marginTop: m(15), gap: m(4) }}>
            <button
              type="button"
              onClick={() => navigate(`/premiere/title/${featured.id}`)}
              className="flex cursor-pointer items-center justify-center rounded-full border border-gray-1/80 bg-brand font-primary font-semibold tracking-[-0.408px] text-gray-1"
              style={{ width: m(115), height: m(36), gap: m(6), fontSize: m(11) }}
            >
              <IconPlay size={14} /> Watch Trailer
            </button>
            <button
              type="button"
              aria-label={reminded ? "Remove reminder" : "Remind me"}
              onClick={toggleReminder}
              className={classNames("flex cursor-pointer items-center justify-center rounded-full text-gray-1 backdrop-blur-md", reminded ? "bg-brand" : "bg-gray-1/30")}
              style={{ width: m(36), height: m(36) }}
            >
              <BellIcon />
            </button>
          </div>
          <div style={{ marginTop: m(24) }}>
            <CountdownBoxes at={featured.premiereAt} />
          </div>
        </div>
      </header>

      <div className="flex flex-col" style={{ gap: m(38), marginTop: m(20) }}>
        <Rail sectionKey="showing" />
        <Rail sectionKey="upcoming" />
        <Rail sectionKey="past" />
      </div>
    </PhoneColumn>
  );
};

export default PremierePage;
