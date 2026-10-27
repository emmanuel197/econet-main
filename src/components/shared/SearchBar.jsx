import React from "react";
import classNames from "../../utils/classNames";
import searchIcon from "../../../assets/icons/search-bar-search-filled.svg";
import clearIcon from "../../../assets/icons/search-mobile-clear-cancel.svg";

const SearchBar = React.forwardRef(
  ({ value, onChange, onClear, placeholder = "Search movies, shows, channels...", active = false, className = "", ...props }, ref) => (
    <div
      className={classNames(
        "flex items-center gap-[calc(14/1728*var(--vw))] transition-colors",
        active
          ? "rounded-t-2xl border-b border-brand/60 bg-black/50 backdrop-blur-2xl px-[calc(24/1728*var(--vw))] py-[calc(18/1728*var(--vw))]"
          : "rounded-full border border-gray-1/15 bg-gray-1/10 px-[calc(22/1728*var(--vw))] py-[calc(14/1728*var(--vw))] focus-within:border-brand/60",
        className
      )}
    >
      <img src={searchIcon} alt="" aria-hidden="true" className="size-[calc(22/1728*var(--vw))] shrink-0 opacity-70" />
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="flex-1 min-w-0 bg-transparent font-primary text-lg text-gray-1 placeholder:text-gray-1/50 outline-none"
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="shrink-0 cursor-pointer opacity-70 hover:opacity-100"
        >
          <img src={clearIcon} alt="" aria-hidden="true" className="size-[calc(18/1728*var(--vw))]" />
        </button>
      )}
    </div>
  )
);

SearchBar.displayName = "SearchBar";
export default SearchBar;
