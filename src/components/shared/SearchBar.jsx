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
          ? "rounded-t-[calc(40/1728*var(--vw))] bg-black/70 backdrop-blur-2xl px-[calc(40/1728*var(--vw))] pt-[calc(36/1728*var(--vw))] pb-[calc(26/1728*var(--vw))] [box-shadow:inset_0_-1px_0_var(--color-brand)]"
          : "rounded-full border border-gray-1/15 bg-black/40 px-[calc(40/1728*var(--vw))] py-[calc(24/1728*var(--vw))] focus-within:border-brand/60",
        className
      )}
    >
      <img src={searchIcon} alt="" aria-hidden="true" className="size-[calc(24/1728*var(--vw))] shrink-0 opacity-[0.56]" />
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="flex-1 min-w-0 bg-transparent font-primary text-xl text-gray-1 placeholder:text-gray-1/56 outline-none"
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
