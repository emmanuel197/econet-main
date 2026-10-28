import React from "react";
import { useNavigate } from "react-router-dom";
import { tvodBanner } from "../../../data/tvodFixtures";
import { m, IconLock, IconArrowRight } from "./TvodUi";

// Mobile home banner between "Live on TV Now" and "Top 10" (WONA design
// "btwnliveontv_and_top10movies", 348×434): three fanned posters, Premium tag,
// "New releases to rent or buy", Browse → the TVOD page.
const POSTERS = [
  { left: 16, top: 82, rotate: -16 },
  { left: 109, top: 31, rotate: -3 },
  { left: 208, top: 47, rotate: 8 },
];

const TvodBanner = () => {
  const navigate = useNavigate();
  return (
    <section
      className="relative mx-auto overflow-clip rounded-[16px] border border-gray-1/20 bg-[#21273b]"
      style={{ width: m(348), height: m(434) }}
    >
      {/* Order matters: the centre poster sits on top */}
      {[0, 2, 1].map((i) => (
        <img
          key={i}
          src={tvodBanner.posters[i]}
          alt=""
          className="absolute rounded-[6px] border-[0.8px] border-[#e1e7f8]/40 object-cover shadow-[0_10px_24px_rgba(0,0,0,0.45)]"
          style={{ left: m(POSTERS[i].left), top: m(POSTERS[i].top), width: m(125), height: m(194), transform: `rotate(${POSTERS[i].rotate}deg)`, transformOrigin: "top left" }}
        />
      ))}

      <div className="absolute inset-x-0 flex flex-col items-center text-center" style={{ top: m(284) }}>
        <span className="flex items-center rounded-full border-[0.5px] border-brand bg-black/24 font-primary text-brand backdrop-blur-xl" style={{ height: m(26), padding: `0 ${m(11)}`, gap: m(5), fontSize: m(12) }}>
          <IconLock size={12} /> Premium
        </span>
        <p className="font-primary text-gray-1" style={{ marginTop: m(17), fontSize: m(16) }}>{tvodBanner.title}</p>
        <p className="font-primary text-gray-5" style={{ marginTop: m(6), fontSize: m(13) }}>{tvodBanner.subtitle}</p>
        <button
          type="button"
          onClick={() => navigate("/tvod")}
          className="flex cursor-pointer items-center justify-center rounded-full border border-gray-1/80 bg-brand font-primary font-semibold tracking-[-0.408px] text-gray-1"
          style={{ marginTop: m(17), width: m(132), height: m(36), gap: m(8), fontSize: m(11) }}
        >
          Browse <IconArrowRight size={16} />
        </button>
      </div>
    </section>
  );
};

export default TvodBanner;
