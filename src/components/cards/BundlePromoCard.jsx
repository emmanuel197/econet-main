import React from "react";
import classNames from "../../utils/classNames";

// Wona Bundle promo card — WONA Figma mobile home, section 4041:1463.
// 348×420 artwork with a frosted red panel along the bottom carrying the bundle
// name and what it includes ("Live TV • Movies • + Shorts"). Mobile-only (--mvw basis).
const m = (px) => `calc(${px}/390*var(--mvw))`;

const BundlePromoCard = ({ image, title, features = [], onClick, className = "" }) => (
  <div
    onClick={onClick}
    className={classNames("relative shrink-0 cursor-pointer overflow-clip rounded-[10px]", className)}
    style={{ width: m(348), height: m(420) }}
  >
    <img src={image} alt={title} className="absolute inset-0 size-full object-cover" />

    <div
      className="absolute rounded-[10px] bg-gradient-to-b from-[#a0050d] to-[#440d0e] opacity-60 blur-xl"
      style={{ left: m(8), right: m(8), bottom: m(8), height: m(128) }}
    />
    <div className="absolute flex flex-col items-center" style={{ left: m(14), bottom: m(68), width: m(160), gap: m(8) }}>
      <span className="font-primary font-semibold text-gray-1" style={{ fontSize: m(12), lineHeight: m(12) }}>
        {title}
      </span>
      <span className="flex items-center font-primary text-gray-1" style={{ gap: m(6), fontSize: m(11), lineHeight: m(16) }}>
        {features.map((f, i) => (
          <React.Fragment key={f}>
            {i > 0 && <span className="rounded-full bg-brand" style={{ width: m(4), height: m(4) }} />}
            {f}
          </React.Fragment>
        ))}
      </span>
    </div>
  </div>
);

export default BundlePromoCard;
