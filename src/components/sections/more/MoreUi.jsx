import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "../../../utils/classNames";
import { m, BackButton, PrimaryButton, IconChevronDown, IconChevronRight } from "../tvod/TvodUi";

export { IconChevronRight };

// Shared pieces for the "More" tab screens (WONA comps More1–More15, 390 basis via m()).

// 62px header: 26px back button left, bold 16px title centred (comps More6/More8)
export const ScreenHeader = ({ title }) => (
  <header className="relative flex items-center" style={{ height: m(62), padding: `0 ${m(21)}` }}>
    <BackButton size={26} className="bg-black/20" />
    <h1 className="absolute left-1/2 -translate-x-1/2 font-primary font-bold text-gray-1" style={{ fontSize: m(16) }}>
      {title}
    </h1>
  </header>
);

// Filter chips: active is a pink 25px pill with a white hairline, the rest plain text
export const FilterTabs = ({ tabs, value, onChange }) => (
  <div className="flex items-center" style={{ gap: m(12) }}>
    {tabs.map((t) => (
      <button
        key={t.id}
        type="button"
        onClick={() => onChange(t.id)}
        className={classNames(
          "cursor-pointer rounded-full font-primary tracking-[-0.408px]",
          value === t.id ? "border-[0.5px] border-gray-1 bg-brand font-semibold text-gray-1" : "border-[0.5px] border-transparent text-gray-1/80"
        )}
        style={{ height: m(25), padding: `0 ${m(value === t.id ? 12 : 0)}`, fontSize: m(12) }}
      >
        {t.label}
      </button>
    ))}
  </div>
);

export const SORTS = [
  { id: "added", label: "Date Added" },
  { id: "title", label: "Title (A–Z)" },
];

// "Date Added ⌄" pill (121×36, white/10) with a small menu under it
export const SortMenu = ({ value, onChange, variant = "pill" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);
  const current = SORTS.find((s) => s.id === value);
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={classNames(
          "flex cursor-pointer items-center font-primary text-gray-1/80",
          variant === "pill" && "rounded-full border border-gray-1/10 bg-gray-1/10"
        )}
        style={variant === "pill" ? { height: m(36), padding: `0 ${m(14)}`, gap: m(6), fontSize: m(12) } : { gap: m(4), fontSize: m(12) }}
      >
        {variant === "pill" ? current.label : "Sort by"}
        <IconChevronDown size={14} />
      </button>
      {open && (
        <div className="absolute right-0 z-20 flex flex-col overflow-clip rounded-[12px] border border-gray-1/10 bg-surface-raised shadow-lg" style={{ top: `calc(100% + ${m(6)})`, minWidth: m(150) }}>
          {SORTS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                onChange(s.id);
                setOpen(false);
              }}
              className={classNames("cursor-pointer text-left font-primary", s.id === value ? "bg-gray-1/10 font-semibold text-brand" : "text-gray-1/80")}
              style={{ padding: `${m(10)} ${m(14)}`, fontSize: m(12) }}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Section: 16px semibold heading (+ muted "(06)" count), chevron on the right, then a
// horizontal row that bleeds off the right edge as in the comps (grid: 3-up, used when a
// filter shows a single section)
export const Section = ({ title, count, onMore, grid = false, children }) => (
  <section className="flex flex-col" style={{ gap: m(22) }}>
    <div className="flex items-center justify-between" style={{ padding: `0 ${m(21)}` }}>
      <h2 className="flex items-baseline font-primary font-semibold tracking-[-0.4px] text-gray-1" style={{ fontSize: m(16), gap: m(4) }}>
        {title}
        {count != null && (
          <span className="font-normal text-gray-1/40" style={{ fontSize: m(13) }}>
            ({String(count).padStart(2, "0")})
          </span>
        )}
      </h2>
      {onMore && (
        <button type="button" aria-label={`See all ${title}`} onClick={onMore} className="cursor-pointer text-[#dbe1f6]">
          <IconChevronRight size={22} />
        </button>
      )}
    </div>
    <div
      className={grid ? "grid grid-cols-3" : "flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"}
      style={{ gap: m(10), rowGap: grid ? m(16) : undefined, padding: `0 ${m(21)}` }}
    >
      {children}
    </div>
  </section>
);

// 117×181 poster with the comps' light hairline (fluid: fills a grid cell, same shape)
export const PosterTile = ({ title, image, onClick, fluid = false, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={title}
    className={classNames("relative shrink-0 cursor-pointer overflow-clip rounded-[4.5px] border border-[#e1e7f8]", fluid && "aspect-[117/181] w-full")}
    style={fluid ? undefined : { width: m(117), height: m(181) }}
  >
    <img src={image} alt={title} className="absolute inset-0 size-full object-cover" />
    {children}
  </button>
);

// Empty state (comps More13 / More15): 80px icon disc, title, copy, Browse Titles,
// then a "how to" card
export const EmptyState = ({ icon, title, body, howToTitle, steps }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center" style={{ padding: `${m(40)} ${m(21)} 0` }}>
      <span className="flex items-center justify-center rounded-full border border-gray-1/15 bg-[#313953] text-gray-1" style={{ width: m(80), height: m(80) }}>
        {icon}
      </span>
      <h2 className="text-center font-primary font-semibold text-gray-1" style={{ marginTop: m(18), fontSize: m(18) }}>
        {title}
      </h2>
      <p className="text-center font-primary text-gray-1/75" style={{ marginTop: m(10), fontSize: m(14), lineHeight: m(18), maxWidth: m(300) }}>
        {body}
      </p>
      <PrimaryButton className="border-gray-1" style={{ marginTop: m(28), width: m(117), height: m(43), fontSize: m(13) }} onClick={() => navigate("/home")}>
        Browse Titles
      </PrimaryButton>
      <div className="w-full rounded-[12px] border border-gray-1/15 bg-[#313953]" style={{ marginTop: m(24), padding: `${m(18)} ${m(15)}` }}>
        <h3 className="font-primary font-medium uppercase text-gray-1" style={{ fontSize: m(12) }}>
          {howToTitle}
        </h3>
        <ol className="flex flex-col font-primary text-gray-1/60" style={{ marginTop: m(12), gap: m(8), fontSize: m(12), lineHeight: m(15) }}>
          {steps.map((s, i) => (
            <li key={i}>
              {i + 1}. {s}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

// Tests the comps' empty states in sample mode: add ?empty to the URL
export const usePreviewEmpty = () => new URLSearchParams(window.location.search).has("empty");
