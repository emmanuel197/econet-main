import React, { useEffect, useState } from "react";
import classNames from "../../utils/classNames";
import signalIcon from "../../../assets/icons/home-mobile-statusbar-signal.svg";
import wifiIcon from "../../../assets/icons/home-mobile-statusbar-wifi.svg";
import batteryIcon from "../../../assets/icons/home-mobile-statusbar-battery.svg";

const formatTime = (d) => {
  const h = d.getHours() % 12 || 12;
  return `${h}:${d.getMinutes().toString().padStart(2, "0")}`;
};

/**
 * MobileStatusBar — faux device status bar drawn at the top of the mobile app frame
 * (part of the design mockup): live clock left, signal/wifi/battery icons right.
 * The clock reflects the real time; the icons are the shipped static glyphs.
 */
const MobileStatusBar = ({ className = "" }) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 20000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={classNames(
        "flex items-center justify-between px-[calc(26/390*var(--mvw))] pt-[calc(12/390*var(--mvw))]",
        className
      )}
    >
      <span className="font-primary text-[calc(15/390*var(--mvw))] font-semibold text-gray-1">
        {formatTime(now)}
      </span>
      {/* Explicit widths + object-contain — some status-bar SVGs have a very wide
         viewBox, so w-auto would balloon them and overflow the row. */}
      <div className="flex items-center gap-[calc(6/390*var(--mvw))]">
        <img src={signalIcon} alt="Signal" className="h-[calc(12/390*var(--mvw))] w-[calc(18/390*var(--mvw))] object-contain" />
        <img src={wifiIcon} alt="Wi-Fi" className="h-[calc(12/390*var(--mvw))] w-[calc(17/390*var(--mvw))] object-contain" />
        <img src={batteryIcon} alt="Battery" className="h-[calc(12/390*var(--mvw))] w-[calc(26/390*var(--mvw))] object-contain" />
      </div>
    </div>
  );
};

export default MobileStatusBar;
