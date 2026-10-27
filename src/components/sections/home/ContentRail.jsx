import React from "react";
import classNames from "../../../utils/classNames";
import SectionHeader from "../../ui/SectionHeader";
import fluid from "../../../utils/fluid";

const ContentRail = React.forwardRef(
  ({ title, items = [], renderItem, gap = 24, isNew = false, showArrow = true, onArrowClick, titleIcon, mobileTitleClassName, className = "", ...props }, ref) => (
    <section ref={ref} className={classNames("flex flex-col gap-[calc(30/1728*var(--vw))]", className)} {...props}>
      {/* Header keeps the right gutter; the scroll row below bleeds to the screen edge. */}
      <SectionHeader
        title={title}
        isNew={isNew}
        showArrow={showArrow}
        onArrowClick={onArrowClick}
        icon={titleIcon}
        mobileTitleClassName={mobileTitleClassName}
        className="pr-[calc(53/1728*var(--vw))]"
      />
      <div
        className="flex overflow-x-auto scrollbar-hide pb-[calc(4/1728*var(--vw))]"
        style={{ gap: fluid(gap) }}
      >
        {items.map((item, index) => (
          <React.Fragment key={item.id ?? index}>{renderItem(item, index)}</React.Fragment>
        ))}
      </div>
    </section>
  )
);

ContentRail.displayName = "ContentRail";
export default ContentRail;
