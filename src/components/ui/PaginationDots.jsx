import React from "react";
import classNames from "../../utils/classNames";

const PaginationDots = React.forwardRef(
  ({ count = 0, activeIndex = 0, className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={classNames("flex items-center gap-[calc(8/1728*var(--vw))]", className)}
      {...props}
    >
      {Array.from({ length: count }).map((_, i) =>
        i === activeIndex ? (
          <span
            key={i}
            className="h-[calc(12/1728*var(--vw))] w-[calc(42/1728*var(--vw))] rounded-full bg-brand-light"
          />
        ) : (
          <span key={i} className="size-[calc(12/1728*var(--vw))] rounded-full bg-gray-1/70" />
        )
      )}
    </div>
  )
);

PaginationDots.displayName = "PaginationDots";
export default PaginationDots;
