import React, { useEffect, useState } from "react";
import classNames from "../../../utils/classNames";
import { countdown } from "../../../data/premiereFixtures";
import { TOAST } from "../../../utils/toast";
import { m } from "../tvod/TvodUi";

// Shared WonaPremiere pieces (WONA mobile comps, 390 basis via m()).

// Ticking countdown for a premiere timestamp (re-renders every second)
export const useCountdown = (at) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!at) return undefined;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [at]);
  return at ? countdown(at, now) : null;
};

// "Remind Me" — remembered per device until a premiere API exists
const REMINDERS_KEY = "wona:premiereReminders";
const readReminders = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(REMINDERS_KEY)) || []);
  } catch {
    return new Set();
  }
};
export const useReminder = (title) => {
  const [on, setOn] = useState(() => readReminders().has(title?.id));
  const toggle = (e) => {
    e?.stopPropagation?.();
    const set = readReminders();
    const next = !set.has(title.id);
    if (next) set.add(title.id);
    else set.delete(title.id);
    try {
      localStorage.setItem(REMINDERS_KEY, JSON.stringify([...set]));
    } catch {
      /* non-fatal */
    }
    setOn(next);
    TOAST.info(next ? `We'll remind you when ${title.title} premieres.` : `Reminder for ${title.title} removed.`);
  };
  return [on, toggle];
};

// Top-right status pill: red LIVE, pink date (upcoming), grey date (past) — 17px tall
export const StatusPill = ({ title, className = "", style }) => {
  const live = title.status === "live";
  const past = title.status === "past";
  return (
    <span
      className={classNames(
        "flex items-center rounded-full font-primary font-semibold uppercase",
        live ? "bg-error-8 text-gray-1" : past ? "bg-gray-7 text-gray-1" : "bg-brand text-gray-10",
        className
      )}
      style={{ height: m(17), padding: `0 ${m(6)}`, gap: m(3), fontSize: m(9), ...style }}
    >
      {live && <span className="rounded-full bg-gray-1" style={{ width: m(3), height: m(3) }} />}
      {live ? "Live" : title.dateLabel}
    </span>
  );
};

// Pills for genres (17px, white/20 + muted hairline)
export const GenrePills = ({ genres, size = "sm" }) => (
  <div className="flex flex-wrap" style={{ gap: m(4) }}>
    {genres.map((g) => (
      <span
        key={g}
        className={classNames("rounded-full font-primary text-gray-1/80", size === "sm" ? "border-[0.8px] border-[#9999b2]/30 bg-gray-1/20" : "border-[0.8px] border-gray-1/10 bg-gray-1/10")}
        style={size === "sm" ? { height: m(17), padding: `0 ${m(8)}`, fontSize: m(9.5), lineHeight: m(16) } : { padding: `${m(4)} ${m(10)}`, fontSize: m(11) }}
      >
        {g}
      </span>
    ))}
  </div>
);

// Big countdown boxes (landing hero): 60×74 black/50 tiles, 22px numbers, 12px labels
export const CountdownBoxes = ({ at }) => {
  const c = useCountdown(at);
  if (!c) return null;
  const pad = (n) => String(n).padStart(2, "0");
  return (
    <div className="flex flex-col items-center" style={{ gap: m(14) }}>
      <span className="font-primary font-bold text-gray-1" style={{ fontSize: m(14) }}>PREMIERES IN:</span>
      <div className="flex" style={{ gap: m(14) }}>
        {[
          [c.d, "Day"],
          [c.h, "Hours"],
          [c.m, "Mins"],
          [c.s, "Secs"],
        ].map(([v, l]) => (
          <span key={l} className="flex flex-col items-center justify-center rounded-[8px] bg-black/50 backdrop-blur-md" style={{ width: m(60), height: m(74), gap: m(6) }}>
            <span className="font-primary font-bold text-gray-1" style={{ fontSize: m(22), lineHeight: 1 }}>{pad(v)}</span>
            <span className="font-primary font-medium text-gray-1" style={{ fontSize: m(12) }}>{l}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

// Inline countdown card (title page): "PREMIERES IN:" over 09d : 12h : 18m : 04s
export const CountdownInline = ({ at }) => {
  const c = useCountdown(at);
  if (!c) return null;
  const pad = (n) => String(n).padStart(2, "0");
  const part = (v, u) => (
    <span className="flex items-baseline" style={{ gap: m(2) }}>
      <span className="font-primary font-bold text-gray-1" style={{ fontSize: m(22) }}>{pad(v)}</span>
      <span className="font-primary text-gray-1/60" style={{ fontSize: m(14) }}>{u}</span>
    </span>
  );
  return (
    <div className="flex flex-col items-center rounded-[12px] border border-gray-1/10 bg-gray-1/10" style={{ height: m(77), justifyContent: "center", gap: m(6) }}>
      <span className="font-primary font-medium text-gray-1/60" style={{ fontSize: m(12) }}>PREMIERES IN:</span>
      <div className="flex items-baseline" style={{ gap: m(10) }}>
        {part(c.d, "d")}
        <span className="font-primary font-bold text-gray-1/80" style={{ fontSize: m(18) }}>:</span>
        {part(c.h, "h")}
        <span className="font-primary font-bold text-gray-1/80" style={{ fontSize: m(18) }}>:</span>
        {part(c.m, "m")}
        <span className="font-primary font-bold text-gray-1/80" style={{ fontSize: m(18) }}>:</span>
        {part(c.s, "s")}
      </div>
    </div>
  );
};
