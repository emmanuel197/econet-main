import React, { useEffect, useState } from "react";
import useGoBack from "../../utils/useGoBack";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import classNames from "../../utils/classNames";
import { getTvodTitle, formatPrice } from "../../data/tvodFixtures";
import { startCheckout, updateCheckout } from "../../utils/tvodCheckout";
import { showPreviewNotice } from "../../utils/toast";
import AccessSheet from "../../components/sections/tvod/AccessSheet";
import logo from "../../../assets/logos/wona-logo.svg";
import { m, PhoneColumn, BackButton, PrimaryButton, SecondaryButton, BarHeading, IconTimer, IconCart, IconPlay, IconShare, IconInfo } from "../../components/sections/tvod/TvodUi";

/**
 * TvodTitlePage (/tvod/:id) — WONA "standard movie" design: trailer still with back +
 * play (390×254), logo/TVOD row, title + meta + quality tags + genre pills, the pink
 * "Not in your plan" notice, Rent / Buy, Synopsis, credits, Lead Casts, and a
 * More Like This / Trailer tab. Rent and Buy open the "Choose your access" sheet;
 * `?access=` (from the TVOD page's Buy/Rent) opens it straight away.
 */
const TvodTitlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = useGoBack();
  const [searchParams, setSearchParams] = useSearchParams();
  const title = getTvodTitle(id);
  const [tab, setTab] = useState("more");
  const [expanded, setExpanded] = useState(false);
  const sheetOption = searchParams.get("access");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!title)
    return (
      <PhoneColumn className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p style={{ fontSize: m(18) }}>We couldn&apos;t find this title.</p>
        <PrimaryButton style={{ width: m(200) }} onClick={() => navigate("/tvod")}>Back to Rent or Buy</PrimaryButton>
      </PhoneColumn>
    );

  const openSheet = (optionId) => setSearchParams({ access: optionId });
  const closeSheet = () => goBack(`/tvod/${title.id}`);
  const continueToCheckout = (option) => {
    startCheckout(title.id, option.id);
    updateCheckout({ titleId: title.id, optionId: option.id });
    navigate(`/tvod/${title.id}/checkout`);
  };

  return (
    <PhoneColumn style={{ paddingBottom: m(40) }}>
      {/* Trailer still */}
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
          <span className="font-primary text-gray-1/60" style={{ fontSize: m(12) }}>TVOD</span>
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
          <span>{title.runtime}</span>
          <span className="rounded-full bg-gray-1/60" style={{ width: m(2), height: m(2) }} />
          {title.badges.map((b) => (
            <span key={b} className="rounded-[4px] bg-gray-1/10 font-medium text-text-soft" style={{ padding: `${m(3)} ${m(8)}`, fontSize: m(10) }}>{b}</span>
          ))}
        </div>

        <div className="flex flex-wrap" style={{ marginTop: m(14), gap: m(4) }}>
          {title.genres.map((g) => (
            <span key={g} className="rounded-full border-[0.8px] border-gray-1/10 bg-gray-1/10 font-primary text-gray-1/80" style={{ padding: `${m(4)} ${m(10)}`, fontSize: m(11) }}>{g}</span>
          ))}
        </div>

        <div className="flex items-start rounded-[12px] border border-brand/10 bg-brand/5" style={{ marginTop: m(26), padding: `${m(12)} ${m(14)}`, gap: m(12) }}>
          <span className="shrink-0 text-gray-1/70" style={{ marginTop: m(2) }}><IconInfo size={16} /></span>
          <p className="font-primary text-gray-1/70" style={{ fontSize: m(11) }}>
            Not in your plan. Rent or buy to watch this title. Rental gives you 30 days to start watching this movie and 48 hours to finish once started.
          </p>
        </div>

        <div className="flex flex-col" style={{ marginTop: m(12), gap: m(8) }}>
          <PrimaryButton style={{ height: m(40) }} onClick={() => openSheet("standard")}>
            <IconTimer size={16} /> Rent for {formatPrice(title.rentPrice)} · 48hrs
          </PrimaryButton>
          <SecondaryButton style={{ height: m(40) }} onClick={() => openSheet("buy")}>
            <IconCart size={16} /> Buy for {formatPrice(title.buyPrice)}
          </SecondaryButton>
        </div>

        {/* Synopsis */}
        <div className="flex flex-col" style={{ marginTop: m(40), gap: m(18) }}>
          <BarHeading>Synopsis</BarHeading>
          <p className={classNames("font-primary text-gray-1/70", !expanded && "line-clamp-4")} style={{ fontSize: m(13), lineHeight: 1.45 }}>{title.synopsis}</p>
          <button type="button" onClick={() => setExpanded((v) => !v)} className="w-fit cursor-pointer font-primary text-brand" style={{ fontSize: m(13), marginTop: m(-8) }}>
            {expanded ? "Read Less" : "Read More"}
          </button>
        </div>

        {/* Credits */}
        <div className="grid grid-cols-3" style={{ marginTop: m(30) }}>
          {title.credits.map((c, i) => (
            <div key={c.label} className={classNames("flex flex-col", i > 0 && "border-l border-gray-1/30")} style={{ gap: m(6), paddingLeft: i > 0 ? m(12) : 0 }}>
              <span className="font-primary text-gray-1/70" style={{ fontSize: m(12) }}>{c.label}</span>
              <span className="font-primary font-semibold text-gray-1" style={{ fontSize: m(13) }}>{c.value}</span>
            </div>
          ))}
        </div>

        {/* Lead Casts */}
        <div className="flex flex-col" style={{ marginTop: m(36), gap: m(22) }}>
          <BarHeading action={<button type="button" onClick={showPreviewNotice} className="cursor-pointer font-primary font-semibold text-brand" style={{ fontSize: m(11) }}>View Full Credits</button>}>
            Lead Casts
          </BarHeading>
          <div className="flex justify-between" style={{ padding: `0 ${m(5)}` }}>
            {title.cast.map((c) => (
              <div key={c.name} className="flex flex-col items-center text-center" style={{ width: m(100), gap: m(4) }}>
                <img src={c.photo} alt={c.name} className="rounded-full object-cover" style={{ width: m(80), height: m(80), marginBottom: m(10) }} />
                <span className="font-primary text-gray-1" style={{ fontSize: m(11) }}>{c.name}</span>
                <span className="font-primary text-gray-1/60" style={{ fontSize: m(11) }}>{c.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* More Like This / Trailer */}
      <div className="grid grid-cols-2 border-b border-gray-1/30" style={{ marginTop: m(30) }}>
        {[
          ["more", "More Like This"],
          ["trailer", "Trailer"],
        ].map(([key, label]) => (
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
      {tab === "more" ? (
        <div className="grid grid-cols-3" style={{ gap: m(11), padding: `${m(22)} ${m(21)} 0` }}>
          {title.moreLikeThis.map((img, i) => (
            <img key={i} src={img} alt="" className="w-full rounded-[4.5px] border border-[#e1e7f8] object-cover" style={{ aspectRatio: "108 / 181" }} />
          ))}
        </div>
      ) : (
        <button type="button" onClick={showPreviewNotice} className="relative mx-auto block cursor-pointer overflow-clip rounded-[12px]" style={{ width: m(348), height: m(196), marginTop: m(22) }}>
          <img src={title.trailerStill} alt="" className="absolute inset-0 size-full object-cover" />
          <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-gray-1/70 bg-black/20 text-gray-1" style={{ width: m(50), height: m(50) }}>
            <IconPlay size={20} />
          </span>
        </button>
      )}

      {sheetOption && <AccessSheet title={title} initialOptionId={sheetOption} onClose={closeSheet} onContinue={continueToCheckout} />}
    </PhoneColumn>
  );
};

export default TvodTitlePage;
