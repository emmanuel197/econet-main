import React from "react";
import classNames from "../../utils/classNames";

const Divider = React.forwardRef(({ orientation = "vertical", className = "", ...props }, ref) => (
  <span
    ref={ref}
    className={classNames(
      orientation === "vertical"
        ? "h-[calc(33/1728*var(--vw))] w-[calc(5/1728*var(--vw))]"
        : "w-full h-[calc(5/1728*var(--vw))]",
      "bg-gray-1/20",
      className
    )}
    {...props}
  />
));

Divider.displayName = "Divider";
export default Divider;
