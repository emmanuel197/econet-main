import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { USE_FIXTURES } from "../../utils/devFlags";
import { m, PhoneColumn, IconPlay } from "../../components/sections/tvod/TvodUi";
import { ScreenHeader, FilterTabs, SortMenu, Section, PosterTile, EmptyState, usePreviewEmpty } from "../../components/sections/more/MoreUi";
import { libraryActiveRentals, libraryOwned, libraryExpired, libraryNewReleases, expiresLabel } from "../../data/moreFixtures";

/**
 * MyLibraryPage (/library) — WONA comps More6, More7, More14 and More15: titles the user
 * rented or bought (TVOD). All / Rentals / Purchased filter with Sort by, then Active
 * Rentals (expiry + progress), Owned Titles, Expired Rentals and New Release on Wona.
 * No rentals/purchases API is known yet, so outside sample mode the library is empty
 * (comp More15).
 */
const TABS = [
  { id: "all", label: "All" },
  { id: "rentals", label: "Rentals" },
  { id: "purchased", label: "Purchased" },
];

const IconBooks = () => (
  <svg viewBox="176 23 37 34" aria-hidden="true" style={{ width: m(36), height: m(33) }}>
    <path
      fill="currentColor"
      d="M183.557 24.2856C184.315 24.2856 185.042 24.5867 185.578 25.1225C186.114 25.6583 186.415 26.385 186.415 27.1428V52.8571C186.415 53.6148 186.114 54.3416 185.578 54.8774C185.042 55.4132 184.315 55.7142 183.557 55.7142H180.715C179.957 55.7142 179.23 55.4132 178.694 54.8774C178.158 54.3416 177.857 53.6148 177.857 52.8571V27.1428C177.857 26.385 178.158 25.6583 178.694 25.1225C179.23 24.5867 179.957 24.2856 180.715 24.2856H183.557ZM193.557 24.2856C194.315 24.2856 195.042 24.5867 195.578 25.1225C196.114 25.6583 196.415 26.385 196.415 27.1428V52.8571C196.415 53.6148 196.114 54.3416 195.578 54.8774C195.042 55.4132 194.315 55.7142 193.557 55.7142H190.707C189.95 55.7142 189.223 55.4132 188.687 54.8774C188.151 54.3416 187.85 53.6148 187.85 52.8571V27.1428C187.85 26.385 188.151 25.6583 188.687 25.1225C189.223 24.5867 189.95 24.2856 190.707 24.2856H193.557ZM206.529 29.3471L212.043 51.4656C212.134 51.8298 212.152 52.2083 212.097 52.5795C212.041 52.9507 211.913 53.3073 211.72 53.629C211.527 53.9507 211.272 54.2312 210.97 54.4544C210.669 54.6776 210.326 54.8392 209.962 54.9299L207.157 55.6299C206.793 55.7206 206.415 55.7386 206.044 55.683C205.673 55.6274 205.316 55.4992 204.995 55.3058C204.673 55.1124 204.393 54.8575 204.17 54.5557C203.947 54.254 203.785 53.9112 203.695 53.5471L198.18 31.4285C198.089 31.0645 198.071 30.6861 198.126 30.315C198.182 29.9438 198.31 29.5872 198.503 29.2656C198.696 28.9439 198.951 28.6634 199.252 28.4401C199.554 28.2168 199.896 28.0551 200.26 27.9642L203.065 27.2656C203.429 27.1748 203.807 27.1565 204.178 27.2119C204.55 27.2674 204.906 27.3954 205.228 27.5887C205.55 27.782 205.83 28.0367 206.053 28.3384C206.277 28.6402 206.438 28.9829 206.529 29.3471Z"
    />
  </svg>
);

const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" style={{ width: m(12), height: m(12) }}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const Progress = ({ value, track = "bg-gray-1/25" }) => (
  <span className={`absolute inset-x-0 bottom-0 ${track}`} style={{ height: m(4) }}>
    <span className="block h-full rounded-full bg-brand" style={{ width: `${value}%` }} />
  </span>
);

// 198×129 landscape: expiry badge, play disc, title, progress
const ActiveRentalCard = ({ rental, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={`Continue ${rental.title}`}
    className="relative shrink-0 cursor-pointer overflow-clip rounded-[4.5px] border border-[#e1e7f8] text-left"
    style={{ width: m(198), height: m(129) }}
  >
    <img src={rental.image} alt="" className="absolute inset-0 size-full object-cover" />
    <span className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/90" />
    <span
      className="absolute flex items-center rounded-[8px] border border-[#fff6df]/30 bg-black/40 font-semibold text-brand"
      style={{ top: m(9), left: m(11), height: m(25), padding: `0 ${m(8)}`, gap: m(5), fontSize: m(10), letterSpacing: "-0.25px" }}
    >
      <IconClock />
      {expiresLabel(rental.expiresAt)}
    </span>
    <span
      className="absolute flex -translate-x-1/2 items-center justify-center rounded-full border-[1.5px] border-gray-1 bg-brand/10 text-gray-1"
      style={{ left: "50%", top: m(47), width: m(34), height: m(34) }}
    >
      <IconPlay size={12} />
    </span>
    <span className="absolute flex flex-col" style={{ left: m(8), right: m(8), bottom: m(10), gap: m(2) }}>
      <span className="truncate font-primary font-semibold text-gray-1" style={{ fontSize: m(13) }}>{rental.title}</span>
      <span className="truncate font-primary text-gray-1/65" style={{ fontSize: m(10) }}>{`${rental.progress}% watched · ${rental.left}`}</span>
    </span>
    <Progress value={rental.progress} />
  </button>
);

// 155×95 landscape: red "expired" pill, title, how far they got
const ExpiredCard = ({ title, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={`Rent ${title.title} again`}
    className="relative shrink-0 cursor-pointer overflow-clip rounded-[4.5px] border border-[#e1e7f8] text-left"
    style={{ width: m(155), height: m(95) }}
  >
    <img src={title.poster} alt="" className="absolute inset-0 size-full object-cover object-top opacity-60 grayscale-[40%]" />
    <span className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/85" />
    <span
      className="absolute flex items-center rounded-full bg-[#d92d20] font-semibold text-gray-1"
      style={{ top: m(8), left: m(11), height: m(15), padding: `0 ${m(6)}`, gap: m(4), fontSize: m(8) }}
    >
      <span className="rounded-full bg-gray-1" style={{ width: m(3), height: m(3) }} />
      expired
    </span>
    <span className="absolute truncate font-primary font-bold text-gray-1" style={{ left: m(6), right: m(6), bottom: m(10), fontSize: m(13) }}>
      {title.title}
    </span>
    <Progress value={title.progress} track="bg-[#e8ebf4]" />
  </button>
);

const byTitle = (a, b) => a.title.localeCompare(b.title);

const MyLibraryPage = () => {
  const navigate = useNavigate();
  const previewEmpty = usePreviewEmpty();
  const [tab, setTab] = useState("all");
  const [sort, setSort] = useState("added");
  const open = (id) => navigate(`/tvod/${id}`);

  const sample = USE_FIXTURES && !previewEmpty;
  const order = (list, dateKey) => [...list].sort(sort === "title" ? byTitle : (a, b) => b[dateKey] - a[dateKey]);
  const active = sample ? order(libraryActiveRentals, "rentedAt") : [];
  const owned = sample ? order(libraryOwned, "boughtAt") : [];
  const expired = sample ? order(libraryExpired, "expiredAt") : [];
  const empty = !active.length && !owned.length && !expired.length;

  const show = (id) => tab === "all" || tab === id;

  return (
    <PhoneColumn style={{ paddingBottom: m(24) }}>
      <ScreenHeader title="My Library" />
      {empty ? (
        <EmptyState
          icon={<IconBooks />}
          title="Your library is empty"
          body="Rent or buy any movie or show to start watching, and it'll show up here with easy access anytime."
          howToTitle="How to add to My Library"
          steps={[
            "Find a movie or show you want to rent or buy",
            "Tap Rent or Buy and complete your payment",
            "It appears here, ready to watch within your rental or purchase window",
          ]}
        />
      ) : (
        <>
          <div className="flex items-center justify-between" style={{ padding: `0 ${m(21)}` }}>
            <FilterTabs tabs={TABS} value={tab} onChange={setTab} />
            <SortMenu value={sort} onChange={setSort} variant="text" />
          </div>

          <div className="flex flex-col" style={{ gap: m(28), marginTop: m(24) }}>
            {show("rentals") && active.length > 0 && (
              <Section title="Active Rentals" onMore={tab === "all" ? () => setTab("rentals") : undefined}>
                {active.map((r) => (
                  <ActiveRentalCard key={r.id} rental={r} onClick={() => open(r.id)} />
                ))}
              </Section>
            )}
            {show("purchased") && owned.length > 0 && (
              <Section title="Owned Titles" grid={tab === "purchased"} onMore={tab === "all" ? () => setTab("purchased") : undefined}>
                {owned.map((t) => (
                  <PosterTile key={t.id} title={t.title} image={t.poster} fluid={tab === "purchased"} onClick={() => open(t.id)} />
                ))}
              </Section>
            )}
            {show("rentals") && expired.length > 0 && (
              <Section title="Expired Rentals">
                {expired.map((t) => (
                  <ExpiredCard key={t.id} title={t} onClick={() => open(t.id)} />
                ))}
              </Section>
            )}
            {tab === "all" && (
              <Section title="New Release on Wona" onMore={() => navigate("/tvod")}>
                {libraryNewReleases.map((t) => (
                  <PosterTile key={t.id} title={t.title} image={t.poster} onClick={() => open(t.id)} />
                ))}
              </Section>
            )}
          </div>
        </>
      )}
    </PhoneColumn>
  );
};

export default MyLibraryPage;
