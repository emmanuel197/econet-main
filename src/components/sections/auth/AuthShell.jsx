import React from "react";
import classNames from "../../../utils/classNames";

/**
 * AuthShell — centered card wrapper shared by the auth screens (signup/signin/OTP/
 * reset/select-network). No Figma frames exist for auth yet (flows reuse legacy
 * behaviour per the API brief), so styling follows this codebase's tokens: dark
 * surface card on page, gold accents, fluid() 1728-comp scaling.
 */
// Same backdrop the legacy auth pages used (auth.scss .auth): Cloudinary hero image
// under a dark purple overlay so the card and copy stay readable.
const AUTH_BG =
  "linear-gradient(rgba(14, 21, 44, 0.58), rgba(14, 21, 44, 0.58)), url('https://res.cloudinary.com/dou9sjstz/image/upload/v1664554166/auth-page-bg_hx5p9o.png')";

// Scaling: below md the card follows the 390 mobile comp (--mvw); at md+ it uses
// the 1728 desktop comp (--vw). Without the mobile basis, --vw's 768 floor made
// the card render desktop-narrow (~230px) on a phone.
const AuthShell = ({ title, subtitle, children, className = "" }) => (
  <div
    className="flex min-h-screen items-center justify-center bg-cover bg-center px-[calc(20/390*var(--mvw))] py-[calc(96/390*var(--mvw))] md:px-[calc(53/1728*var(--vw))] md:py-[calc(160/1728*var(--vw))]"
    style={{ backgroundImage: AUTH_BG }}
  >
    <div
      className={classNames(
        "w-full border border-gray-1/10 bg-gray-1/5 backdrop-blur-sm",
        "max-w-[calc(350/390*var(--mvw))] rounded-[calc(20/390*var(--mvw))] p-[calc(24/390*var(--mvw))]",
        "md:max-w-[calc(520/1728*var(--vw))] md:rounded-[calc(24/1728*var(--vw))] md:p-[calc(48/1728*var(--vw))]",
        className
      )}
    >
      {title && (
        <h2 className="mb-[calc(6/390*var(--mvw))] text-[calc(24/390*var(--mvw))] font-semibold text-gray-1 md:mb-[calc(8/1728*var(--vw))] md:text-3xl">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="mb-[calc(20/390*var(--mvw))] text-[calc(14/390*var(--mvw))] text-gray-5 md:mb-[calc(24/1728*var(--vw))] md:text-base">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  </div>
);

export default AuthShell;
