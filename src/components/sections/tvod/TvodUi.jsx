import React from "react";
import useGoBack from "../../../utils/useGoBack";
import classNames from "../../../utils/classNames";

// Shared pieces for the TVOD screens (WONA designs, 390-wide mobile comps). Sizes use
// the mobile basis: m(px) = px on a 390 phone, capped at 430 (the screens sit in a
// centred phone-width column on desktop).
export const m = (px) => `calc(${px}/390*var(--mvw))`;

// ── Icons (stroke follows currentColor) ──────────────────────────────────────
const Svg = ({ size = 16, children, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: m(size), height: m(size) }} {...props}>
    {children}
  </svg>
);
export const IconBack = (p) => <Svg {...p}><path d="M15 18l-6-6 6-6" /></Svg>;
export const IconLock = (p) => <Svg {...p}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Svg>;
export const IconCart = (p) => <Svg {...p}><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H6" /></Svg>;
export const IconTimer = (p) => <Svg {...p}><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2M9 2h6" /></Svg>;
export const IconPlay = (p) => <Svg {...p}><path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="none" /></Svg>;
export const IconShield = (p) => <Svg {...p}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /></Svg>;
export const IconCard = (p) => <Svg {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h4" /></Svg>;
export const IconPhone = (p) => <Svg {...p}><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M2 14a6 6 0 0 1 6 6M2 18a2 2 0 0 1 2 2" /></Svg>;
export const IconArrowRight = (p) => <Svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
export const IconChevronDown = (p) => <Svg {...p}><path d="M6 9l6 6 6-6" /></Svg>;
export const IconChevronRight = (p) => <Svg {...p}><path d="M9 6l6 6-6 6" /></Svg>;
export const IconShare = (p) => <Svg {...p}><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13" /></Svg>;
export const IconInfo = (p) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></Svg>;
export const IconCheck = (p) => <Svg {...p}><path d="M5 12l5 5 9-10" /></Svg>;
export const IconX = (p) => <Svg {...p}><path d="M6 6l12 12M18 6L6 18" /></Svg>;

// 32px circular back button (black/40, 0.8px white border) — TVOD page & title page.
// Checkout headers use the 26px variant.
export const BackButton = ({ size = 32, onClick, className = "", style }) => {
  const goBack = useGoBack();
  return (
    <button
      type="button"
      aria-label="Back"
      onClick={onClick ?? (() => goBack())}
      className={classNames("flex shrink-0 cursor-pointer items-center justify-center rounded-full border-[0.8px] border-gray-1/80 bg-black/40 text-gray-1", className)}
      style={{ width: m(size), height: m(size), ...style }}
    >
      <IconBack size={size <= 26 ? 14 : 16} />
    </button>
  );
};

// Pink pill CTA (348×40–42, 0.5px white border) and the white/30 secondary pill
export const PrimaryButton = ({ children, disabled = false, className = "", style, ...props }) => (
  <button
    type="button"
    disabled={disabled}
    className={classNames(
      "flex w-full cursor-pointer items-center justify-center gap-[calc(6/390*var(--mvw))] rounded-full border border-gray-1/80 font-primary font-semibold tracking-[-0.408px] transition-opacity",
      disabled ? "cursor-not-allowed border-gray-1/48 bg-brand/48 text-page" : "bg-brand text-gray-1 hover:opacity-90",
      className
    )}
    style={{ height: m(42), fontSize: m(13), ...style }}
    {...props}
  >
    {children}
  </button>
);
export const SecondaryButton = ({ children, className = "", style, ...props }) => (
  <button
    type="button"
    className={classNames("flex w-full cursor-pointer items-center justify-center gap-[calc(6/390*var(--mvw))] rounded-full bg-gray-1/30 font-primary font-medium text-gray-1 backdrop-blur-md hover:bg-gray-1/40", className)}
    style={{ height: m(42), fontSize: m(13), ...style }}
    {...props}
  >
    {children}
  </button>
);

export const SecureNote = () => (
  <p className="flex items-center justify-center gap-[calc(6/390*var(--mvw))] font-primary text-gray-1/75" style={{ fontSize: m(12) }}>
    <IconShield size={14} /> Secure 256-bit encrypted checkout
  </p>
);

// Section heading with the pink left bar (Synopsis, Lead Casts, Payment Method)
export const BarHeading = ({ children, action }) => (
  <div className="flex items-center justify-between">
    <h2 className="flex items-center gap-[calc(12/390*var(--mvw))] font-primary font-semibold text-gray-1" style={{ fontSize: m(16) }}>
      <span className="block rounded-full bg-brand" style={{ width: m(2), height: m(30) }} />
      {children}
    </h2>
    {action}
  </div>
);

// 19px radio ring; pink with a filled dot when selected
export const RadioDot = ({ selected }) => (
  <span
    className={classNames("flex shrink-0 items-center justify-center rounded-full border", selected ? "border-brand" : "border-gray-1/20")}
    style={{ width: m(19), height: m(19) }}
  >
    {selected && <span className="rounded-full bg-brand" style={{ width: m(9), height: m(9) }} />}
  </span>
);

// Poster + title + meta + pink outlined tag (sheet / order summary header)
export const TitleSummary = ({ title, tag }) => (
  <div className="flex items-start gap-[calc(17/390*var(--mvw))]">
    <img src={title.poster} alt={title.title} className="shrink-0 rounded-[7px] object-cover shadow-[0_6px_20px_rgba(218,19,117,0.25)]" style={{ width: m(65), height: m(80) }} />
    <div className="flex min-w-0 flex-col" style={{ gap: m(6) }}>
      <span className="font-primary font-semibold text-gray-1" style={{ fontSize: m(14) }}>{title.title}</span>
      <span className="font-primary text-gray-5" style={{ fontSize: m(13) }}>
        {[title.year, "1h 53m", ...title.genres.slice(0, 2)].join(" · ")}
      </span>
      {tag && (
        <span className="w-fit rounded-full border border-brand bg-brand/10 font-primary text-brand" style={{ fontSize: m(12), padding: `${m(3)} ${m(11)}` }}>
          {tag}
        </span>
      )}
    </div>
  </div>
);

// Key/value table (Order Summary, results). rows: [{label, value, valueClass}]; total: {label, value, valueClass}
export const InfoTable = ({ rows = [], total, className = "", tone = "default" }) => (
  <div
    className={classNames(
      "flex flex-col rounded-[12px] border",
      tone === "success" ? "border-[#2a4435] bg-[#22c55e]/10" : "border-gray-1/15 bg-[#313953]",
      className
    )}
    style={{ padding: `${m(6)} ${m(15)}` }}
  >
    {[...rows, ...(total ? [{ ...total, isTotal: true }] : [])].map((r, i, all) => (
      <div
        key={r.label}
        className={classNames("flex items-center justify-between", i < all.length - 1 && (tone === "success" ? "border-b border-[#2a4435]" : "border-b border-[#384368]"))}
        style={{ minHeight: m(r.isTotal ? 46 : 42) }}
      >
        <span className={classNames("font-primary", r.isTotal ? "font-medium text-gray-1" : "text-gray-1/60")} style={{ fontSize: m(r.isTotal ? 14 : 12) }}>
          {r.label}
        </span>
        <span className={classNames("font-primary font-medium text-gray-1", r.valueClass)} style={{ fontSize: m(r.isTotal ? (r.big ? 18 : 14) : 13) }}>
          {r.value}
        </span>
      </div>
    ))}
  </div>
);

// Pink-bordered summary card at the top of the payment screens (Amount due / Processing)
export const AmountDueCard = ({ label = "Amount due", amount, detail }) => (
  <div className="flex items-center justify-between rounded-[12px] border border-brand bg-[#21273b]" style={{ padding: `0 ${m(15)}`, height: m(64) }}>
    <div className="flex flex-col" style={{ gap: m(4) }}>
      <span className="font-primary font-semibold text-gray-1" style={{ fontSize: m(14) }}>{label}</span>
      <span className="font-primary text-gray-1/60" style={{ fontSize: m(12) }}>{detail}</span>
    </div>
    <div className="flex items-center" style={{ gap: m(10) }}>
      <span className="font-primary font-bold text-gray-1" style={{ fontSize: m(16) }}>{amount}</span>
      <RadioDot selected />
    </div>
  </div>
);

// Labelled dark input (Card Number, Expiry…). `children` replaces the default <input>.
export const Field = ({ label, children, className = "", ...inputProps }) => (
  <label className={classNames("flex flex-col", className)} style={{ gap: m(12) }}>
    <span className="font-primary text-gray-1/75" style={{ fontSize: m(13) }}>{label}</span>
    {children ?? (
      <input
        className="w-full rounded-[12px] border border-[#fdfdf8]/20 bg-[#060915]/60 font-primary text-gray-1 outline-none placeholder:text-gray-1/40 focus:border-brand"
        style={{ height: m(50), padding: `0 ${m(20)}`, fontSize: m(14) }}
        {...inputProps}
      />
    )}
  </label>
);

export const Toggle = ({ checked, onChange, label }) => (
  <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="flex w-full cursor-pointer items-center justify-between">
    <span className="font-primary text-gray-1/75" style={{ fontSize: m(13) }}>{label}</span>
    <span className={classNames("relative rounded-full transition-colors", checked ? "bg-brand" : "bg-gray-1/20")} style={{ width: m(32), height: m(18) }}>
      <span className="absolute top-1/2 -translate-y-1/2 rounded-full bg-gray-1 transition-all" style={{ width: m(14), height: m(14), left: checked ? m(16) : m(2) }} />
    </span>
  </button>
);

// Phone-width column for the TVOD screens; on desktop it sits centred under the navbar.
export const PhoneColumn = ({ children, className = "", style }) => (
  <div className={classNames("mx-auto w-full max-w-[430px] font-primary text-gray-1 md:pt-[calc(110/1728*var(--vw))]", className)} style={style}>
    {children}
  </div>
);

// Checkout screen frame: 62px header (back + centred title, hairline under), scrolling
// body, footer pinned to the bottom (terms + CTA + secure note).
export const CheckoutScreen = ({ title, onBack, children, footer }) => (
  <PhoneColumn className="flex min-h-screen flex-col">
    <header className="relative flex items-center border-b border-gray-1/10" style={{ height: m(62), padding: `0 ${m(21)}` }}>
      <BackButton size={26} onClick={onBack} className="bg-black/20" />
      <h1 className="absolute left-1/2 -translate-x-1/2 font-primary font-bold text-gray-1" style={{ fontSize: m(16) }}>{title}</h1>
    </header>
    <div className="flex flex-1 flex-col" style={{ padding: `${m(28)} ${m(21)} ${m(24)}`, gap: m(24) }}>
      {children}
    </div>
    {footer && (
      <div className="sticky bottom-0 flex flex-col bg-page/90 backdrop-blur-md" style={{ padding: `${m(12)} ${m(21)} ${m(18)}`, gap: m(12) }}>
        {footer}
      </div>
    )}
  </PhoneColumn>
);

export const TermsLine = ({ action = "pay" }) => (
  <p className="text-center font-primary text-gray-1/75" style={{ fontSize: m(11.5) }}>
    By clicking {action}, you agree to Wona&apos;s <span className="text-brand">Terms of Service.</span>
  </p>
);

// 79px status circle used by the result screens (tone: success | error)
export const StatusBadge = ({ tone }) => (
  <span
    className={classNames(
      "mx-auto flex items-center justify-center rounded-full border",
      tone === "success" ? "border-[#22c55e] bg-[#22c55e]/10 text-[#22c55e]" : "border-error-7 bg-error-8/10 text-error-7"
    )}
    style={{ width: m(79), height: m(79) }}
  >
    {tone === "success" ? <IconCheck size={34} /> : <IconX size={34} />}
  </span>
);
