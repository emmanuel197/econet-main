import React from "react";
import classNames from "../../../utils/classNames";

const ChannelCategoryTabs = ({ categories = [], active, onChange, className = "" }) => (
  <div className={classNames("flex items-center gap-[calc(12/1728*var(--vw))]", className)}>
    {categories.map((cat) => {
      const isActive = cat === active;
      return (
        <button
          key={cat}
          type="button"
          onClick={() => onChange?.(cat)}
          className={classNames(
            "flex h-[calc(40/1728*var(--vw))] items-center justify-center rounded-full px-[calc(22/1728*var(--vw))]",
            "font-primary font-medium text-base cursor-pointer transition-colors",
            isActive
              ? "bg-brand text-page"
              : "bg-gray-1/10 text-gray-1 border border-gray-1/15 hover:bg-gray-1/15"
          )}
        >
          {cat}
        </button>
      );
    })}
  </div>
);

export default ChannelCategoryTabs;
