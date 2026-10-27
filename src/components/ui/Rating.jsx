import React from "react";
import classNames from "../../utils/classNames";

const Rating = React.forwardRef(({ value, icon, className = "", ...props }, ref) => (
  <span
    ref={ref}
    className={classNames("flex items-center gap-[calc(12/1728*var(--vw))]", className)}
    {...props}
  >
    <img src={icon} alt="" aria-hidden="true" className="size-[calc(24/1728*var(--vw))]" />
    <span className="text-2xl text-brand">{value}</span>
  </span>
));

Rating.displayName = "Rating";
export default Rating;
