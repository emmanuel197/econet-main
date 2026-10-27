import React from "react";
import classNames from "../../utils/classNames";

const VARIANTS = {
  new: "rounded-[calc(16/1728*var(--vw))] bg-brand px-[calc(11/1728*var(--vw))] py-[calc(1/1728*var(--vw))] font-semibold text-base text-gray-1",
  // `max-md:` re-scales on the 390 comp: below md the --vw system floors at 768
  // (0.444×), which shrank the LIVE pill's 10px label to ~4px on a phone.
  live: "rounded-full bg-error-8 gap-[calc(6/1728*var(--vw))] px-[calc(10/1728*var(--vw))] py-[calc(4/1728*var(--vw))] font-semibold text-xs text-gray-1 leading-none max-md:gap-[calc(4/390*var(--mvw))] max-md:px-[calc(6/390*var(--mvw))] max-md:py-[calc(3/390*var(--mvw))] max-md:text-[calc(9/390*var(--mvw))]",
  flag: "rounded-xl border-[0.5px] border-[rgba(242,244,250,0.7)] bg-[rgba(14,21,44,0.3)] px-[calc(16/1728*var(--vw))] py-[calc(6/1728*var(--vw))] text-lg text-navy-1",
  genre: "rounded-3xl bg-[rgba(38,38,38,0.8)] px-[calc(16/1728*var(--vw))] py-[calc(8/1728*var(--vw))] font-medium text-xl text-gray-2",
  // Shorts tile pill: the page colour at 60% (AfriPlay's comp used its purple page,
  // rgba(31,8,50,0.6); WONA uses the navy page), NOT the opaque navy-11 this used to use — fully
  // rounded (radius 100), padding 10/6, 12px semibold white.
  duration: "rounded-full bg-page/60 px-[calc(10/1728*var(--vw))] py-[calc(6/1728*var(--vw))] font-semibold text-sm text-gray-1 leading-none max-md:px-[calc(7/390*var(--mvw))] max-md:py-[calc(3/390*var(--mvw))] max-md:text-[calc(10/390*var(--mvw))]",
};

const Badge = React.forwardRef(
  ({ variant = "new", children, className = "", ...props }, ref) => (
    <span
      ref={ref}
      className={classNames(
        "flex items-center justify-center font-primary",
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      {variant === "live" && (
        <span className="size-[calc(7/1728*var(--vw))] rounded-full border border-gray-1" />
      )}
      {children}
    </span>
  )
);

Badge.displayName = "Badge";
export default Badge;
