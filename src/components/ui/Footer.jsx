import React from "react";
import classNames from "../../utils/classNames";
import logo from "../../../assets/logos/wona-logo.svg";
import glow from "../../../assets/illustrations/home-footer-glow-ellipse.webp";
import bgShape from "../../../assets/icons/home-footer-background-shape.svg";
import iconInstagram from "../../../assets/icons/home-footer-social-instagram.svg";
import iconTwitter from "../../../assets/icons/home-footer-social-twitter.svg";
import iconYoutube from "../../../assets/icons/home-footer-social-youtube.svg";

const LINK_COLUMNS = [
  ["Investor Relation", "Privacy", "Contact Us", "Audio Descriptions"],
  ["Help Center", "Legal Notices", "Not Sharing my personal information"],
  ["Gift Cards", "Wona Shop", "Cookie preferences", "Ads choices"],
  ["Media Center", "Terms of Use", "Coperate Information"],
];

const Footer = React.forwardRef(({ className, ...props }, ref) => (
  <footer
    ref={ref}
    className={classNames(
      "relative h-[calc(339/1728*var(--vw))] overflow-clip bg-page border-t-2 border-[rgba(242,240,203,0.12)] font-primary",
      className
    )}
    {...props}
  >
    <div className="absolute bottom-[calc(-248.42/1728*var(--vw))] left-[calc(-343/1728*var(--vw))] h-[calc(688.419/1728*var(--vw))] w-[calc(1077.412/1728*var(--vw))] pointer-events-none">
      <div className="absolute inset-[-0.12%_0_-18.67%_-12.18%]">
        <img src={bgShape} alt="" aria-hidden="true" className="block size-full max-w-none" />
      </div>
    </div>
    <div className="absolute right-[calc(-78/1728*var(--vw))] top-[calc(50%+calc(40/1728*var(--vw)))] -translate-y-1/2 size-[calc(369/1728*var(--vw))] opacity-40 pointer-events-none">
      <div className="absolute inset-[-54.2%]">
        <img src={glow} alt="" aria-hidden="true" className="block size-full max-w-none" />
      </div>
    </div>

    <div className="absolute left-[calc(61/1728*var(--vw))] top-[calc(54/1728*var(--vw))] flex w-[calc(1528/1728*var(--vw))] items-start justify-between">
      <div className="flex flex-col gap-[calc(16/1728*var(--vw))]">
        <img src={logo} alt="WONA" className="h-[calc(42/1728*var(--vw))] w-auto object-contain" />
        <div className="flex items-center gap-[calc(28/1728*var(--vw))]">
          <img src={iconInstagram} alt="Instagram" className="size-[calc(36/1728*var(--vw))]" />
          <img src={iconTwitter} alt="Twitter" className="size-[calc(36/1728*var(--vw))]" />
          <img src={iconYoutube} alt="YouTube" className="size-[calc(36/1728*var(--vw))]" />
        </div>
      </div>

      <div className="flex items-start gap-[calc(52/1728*var(--vw))] opacity-70">
        {LINK_COLUMNS.map((col, i) => (
          <ul key={i} className="flex w-[calc(222/1728*var(--vw))] flex-col gap-[calc(24/1728*var(--vw))]">
            {col.map((label) => (
              <li key={label} className="text-xl text-navy-3 leading-[calc(38/1728*var(--vw))]">
                {label}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>

    <p className="absolute left-[calc(64/1728*var(--vw))] top-[calc(287/1728*var(--vw))] text-xl text-navy-3 opacity-60 leading-[calc(38/1728*var(--vw))]">
      ©2007-2026 Wona
    </p>
  </footer>
));

Footer.displayName = "Footer";
export default Footer;
