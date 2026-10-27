import React from "react";
import classNames from "../../utils/classNames";
import arrowRight from "../../../assets/icons/home-afriplay-shorts-arrow-right.svg";
import Badge from "./Badge";
import Button from "./Button";

const SectionHeader = React.forwardRef(
  ({ title, isNew = false, showArrow = true, onArrowClick, className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={classNames("flex items-center justify-between", className)}
      {...props}
    >
      <div className="flex items-center gap-[calc(12/1728*var(--vw))]">
        {/* text-h6 scales on --vw (768 floor → ~13px on phones); max-md: bumps
            section titles to the mobile comp so headings read at ~17px. */}
        <h2 className="font-primary font-bold text-h6 text-gray-1 max-md:text-[calc(17/390*var(--mvw))]">{title}</h2>
        {isNew && <Badge variant="new">New</Badge>}
      </div>
      {showArrow && (
        <Button
          variant="bare"
          iconOnly
          boxSize={32}
          aria-label={`See all ${title}`}
          onClick={onArrowClick}
          className="shrink-0 p-0"
        >
          <img src={arrowRight} alt="" aria-hidden="true" className="size-[calc(32/1728*var(--vw))]" />
        </Button>
      )}
    </div>
  )
);

SectionHeader.displayName = "SectionHeader";
export default SectionHeader;
