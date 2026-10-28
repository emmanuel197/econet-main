import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "../../utils/classNames";
import { tvodHero, tvodFeatured, tvodTitles, formatPrice } from "../../data/tvodFixtures";
import { startCheckout } from "../../utils/tvodCheckout";
import { m, PhoneColumn, BackButton, IconLock, IconCart, IconTimer, IconChevronRight } from "../../components/sections/tvod/TvodUi";

/**
 * TvodPage (/tvod) — WONA "TVOD page" design (390×1069): hero with back button,
 * "PREMIUM / Rent or Buy", All · Movies · Tv Shows chips, the Featured title with
 * Buy/Rent, then Movies and Tv Shows rails of lockable posters with Buy/Rent.
 * Tapping a poster opens the title page; Buy/Rent open it with the access sheet.
 */
const CHIPS = ["All", "Movies", "Tv Shows"];

const BuyRent = ({ title, size = "sm" }) => {
  const navigate = useNavigate();
  const open = (optionId) => (e) => {
    e.stopPropagation();
    startCheckout(title.id, optionId);
    navigate(`/tvod/${title.id}?access=${optionId}`);
  };
  const big = size === "lg";
  const h = big ? 36 : 26;
  return (
    <div className="flex" style={{ gap: m(big ? 6 : 5) }}>
      <button type="button" onClick={open("buy")} className="flex cursor-pointer items-center justify-center rounded-full border border-gray-1/80 bg-brand font-primary font-semibold tracking-[-0.408px] text-gray-1" style={{ height: m(h), width: m(big ? 129 : 60), gap: m(5), fontSize: m(big ? 13 : 10) }}>
        <IconCart size={big ? 16 : 12} /> {big ? `Buy · ${formatPrice(title.buyPrice)}` : "Buy"}
      </button>
      <button type="button" onClick={open("standard")} className="flex cursor-pointer items-center justify-center rounded-full bg-gray-1/30 font-primary font-medium tracking-[-0.408px] text-gray-1 backdrop-blur-md" style={{ height: m(h), width: m(big ? 129 : 60), gap: m(5), fontSize: m(big ? 13 : 10) }}>
        <IconTimer size={big ? 16 : 12} /> {big ? `Rent · ${formatPrice(title.rentPrice)}` : "Rent"}
      </button>
    </div>
  );
};

// 150×200 locked poster with a frosted info panel (title, year · genre, Buy/Rent)
const TvodPosterCard = ({ title }) => {
  const navigate = useNavigate();
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/tvod/${title.id}`)}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/tvod/${title.id}`)}
      className="relative shrink-0 cursor-pointer overflow-clip rounded-[8px] border-[0.8px] border-gray-1/40"
      style={{ width: m(150), height: m(200) }}
    >
      <img src={title.poster} alt={title.title} className="absolute inset-0 size-full object-cover" />
      <span className="absolute flex items-center justify-center rounded-full border-[0.5px] border-brand bg-black/65 text-brand" style={{ top: m(5), right: m(5), width: m(24), height: m(24) }}>
        <IconLock size={12} />
      </span>
      <div className="absolute flex flex-col items-center rounded-[8px] bg-black/65 backdrop-blur-sm" style={{ left: m(5), right: m(5), bottom: m(5), padding: `${m(8)} ${m(8)} ${m(7)}`, gap: m(2) }}>
        <span className="w-full truncate text-center font-primary font-semibold text-gray-1" style={{ fontSize: m(12) }}>{title.title}</span>
        <span className="font-primary text-gray-1/60" style={{ fontSize: m(11.5), marginBottom: m(6) }}>{`${title.year} · ${title.genres[0]}`}</span>
        <BuyRent title={title} />
      </div>
    </div>
  );
};

const Rail = ({ label, items }) => (
  <section className="flex flex-col" style={{ gap: m(14) }}>
    <div className="flex items-center justify-between" style={{ padding: `0 ${m(21)}` }}>
      <h2 className="font-primary text-gray-1" style={{ fontSize: m(16) }}>
        {label} <span className="text-gray-1/40" style={{ fontSize: m(13) }}>({String(items.length).padStart(2, "0")})</span>
      </h2>
      <IconChevronRight size={20} />
    </div>
    <div className="flex overflow-x-auto scrollbar-hide" style={{ gap: m(10), padding: `0 ${m(21)}` }}>
      {items.map((t) => (
        <TvodPosterCard key={t.id} title={t} />
      ))}
    </div>
  </section>
);

const TvodPage = () => {
  const navigate = useNavigate();
  const [chip, setChip] = useState("All");
  const featuredTitle = tvodTitles.find((t) => t.id === tvodFeatured.id);
  const movies = tvodTitles.filter((t) => t.type === "movie" && t.id !== tvodFeatured.id);
  const shows = tvodTitles.filter((t) => t.type === "series");

  return (
    <PhoneColumn style={{ paddingBottom: m(40) }}>
      {/* Hero (390×210): backdrop + radial dim, back button, PREMIUM / Rent or Buy */}
      <header className="relative overflow-clip" style={{ height: m(210) }}>
        <img src={tvodHero.backdrop} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,transparent_0%,rgba(14,21,44,0.66)_60%)] bg-gradient-to-b from-transparent to-page" />
        <BackButton className="absolute z-10" style={{ left: m(21), top: m(24) }} />
        <div className="absolute flex flex-col" style={{ left: m(21), bottom: m(17), gap: m(6) }}>
          <span className="flex items-center font-primary text-gray-1/70" style={{ gap: m(4), fontSize: m(12) }}>
            <IconLock size={13} /> PREMIUM
          </span>
          <h1 className="font-bold text-gray-1" style={{ fontSize: m(22), fontFamily: "'Helvetica Neue', var(--font-primary)" }}>Rent or Buy</h1>
          <span className="font-primary text-gray-1/70" style={{ fontSize: m(12) }}>New releases · Not in your plan</span>
        </div>
      </header>

      <div className="flex" style={{ gap: m(4), padding: `${m(21)} ${m(21)} 0` }}>
        {CHIPS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setChip(c)}
            className={classNames("cursor-pointer rounded-full font-primary", chip === c ? "border-[0.5px] border-gray-1 bg-brand text-gray-1" : "text-gray-1/80")}
            style={{ height: m(25), padding: `0 ${m(12)}`, fontSize: m(12) }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Featured (348×237) */}
      {chip !== "Tv Shows" && featuredTitle && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => navigate(`/tvod/${featuredTitle.id}`)}
          className="relative mx-auto cursor-pointer overflow-clip rounded-[16px]"
          style={{ width: m(348), height: m(237), marginTop: m(16) }}
        >
          <img src={tvodFeatured.backdrop} alt="" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-black/44" />
          <span className="absolute rounded-full border-[0.5px] border-[#f4f6fc]/70 bg-page/30 font-primary text-[#f7f9fd] backdrop-blur-md" style={{ top: m(8), right: m(19), padding: `${m(4)} ${m(8)}`, fontSize: m(11) }}>
            Featured
          </span>
          <div className="absolute flex flex-col" style={{ left: m(12), bottom: m(14), gap: m(10) }}>
            <img src={tvodFeatured.titleArt} alt={featuredTitle.title} className="object-contain object-left" style={{ width: m(153), height: m(52) }} />
            <div className="flex items-center font-primary text-gray-1" style={{ gap: m(6), fontSize: m(11.5) }}>
              {tvodFeatured.genres.map((g, i) => (
                <React.Fragment key={g}>
                  {i > 0 && <span className="rounded-full bg-brand" style={{ width: m(4), height: m(4) }} />}
                  {g}
                </React.Fragment>
              ))}
            </div>
            <BuyRent title={{ ...featuredTitle, buyPrice: tvodFeatured.buyPrice, rentPrice: tvodFeatured.rentPrice }} size="lg" />
          </div>
        </div>
      )}

      <div className="flex flex-col" style={{ gap: m(28), marginTop: m(32) }}>
        {chip !== "Tv Shows" && <Rail label="Movies" items={movies} />}
        {chip !== "Movies" && <Rail label="Tv Shows" items={shows} />}
      </div>
    </PhoneColumn>
  );
};

export default TvodPage;
