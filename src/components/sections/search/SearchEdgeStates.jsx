import React from "react";
import classNames from "../../../utils/classNames";
import hintIcon from "../../../../assets/icons/search-edge-min-chars-hint-info-empty-warning.svg";
import spinnerIcon from "../../../../assets/icons/search-edge-searching-loader-searching-spinner.svg";
import zeroIcon from "../../../../assets/icons/search-edge-zero-results-message-no-results-info.svg";
import wifiErrorIcon from "../../../../assets/icons/search-edge-connection-error-message-wifi-error.svg";
import toastIcon from "../../../../assets/icons/search-edge-toast-notification-bookmark-added.svg";

const CenteredState = ({ icon, title, subtitle, children }) => (
  <div className="flex flex-col items-center gap-[calc(16/1728*var(--vw))] py-[calc(80/1728*var(--vw))] text-center">
    <img src={icon} alt="" aria-hidden="true" className="size-[calc(56/1728*var(--vw))] opacity-70" />
    <h3 className="font-primary font-semibold text-h6 text-gray-1">{title}</h3>
    {subtitle && <p className="max-w-[calc(420/1728*var(--vw))] font-primary text-lg text-gray-1/60">{subtitle}</p>}
    {children}
  </div>
);

export const ShortQueryHint = ({ minLength }) => (
  <CenteredState
    icon={hintIcon}
    title={`Keep typing…`}
    subtitle={`Type at least ${minLength} characters to search WONA.`}
  />
);

const SkeletonBox = ({ className = "" }) => (
  <div className={classNames("animate-pulse rounded-lg bg-gray-1/10", className)} />
);

// Mirrors SearchResultsSection's real layout (hero + Movies/TV Shows/TV Channels
// groups) with placeholder boxes at the same sizes, so the skeleton doesn't jump
// once real content swaps in. Page-level slow-network state — the in-panel
// "search in progress" state is SearchingLoader below.
const SKELETON_GROUPS = [
  { count: 9, tileClass: "aspect-[2/3] w-[calc(250/1728*var(--vw))] rounded-lg" },
  { count: 6, tileClass: "aspect-[2/3] w-[calc(250/1728*var(--vw))] rounded-lg" },
  // Kept in sync with ChannelCard's reduced desktop box (331x191).
  { count: 4, tileClass: "h-[calc(191/1728*var(--vw))] w-[calc(331/1728*var(--vw))] rounded-[20px]" },
];

export const ResultsSkeleton = () => (
  <div className="flex flex-col gap-[calc(28/1728*var(--vw))]">
    <SkeletonBox className="h-[calc(420/1728*var(--vw))] w-full rounded-2xl" />
    {SKELETON_GROUPS.map(({ count, tileClass }, i) => (
      <div key={i} className="flex flex-col gap-[calc(16/1728*var(--vw))]">
        <SkeletonBox className="h-[calc(24/1728*var(--vw))] w-[calc(140/1728*var(--vw))]" />
        <div className="flex flex-wrap gap-[calc(20/1728*var(--vw))]">
          {Array.from({ length: count }).map((_, j) => (
            <SkeletonBox key={j} className={tileClass} />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export const SearchingLoader = () => (
  <div className="flex flex-col items-center gap-[calc(16/1728*var(--vw))] py-[calc(120/1728*var(--vw))]">
    <img src={spinnerIcon} alt="" aria-hidden="true" className="size-[calc(40/1728*var(--vw))] animate-spin" />
    <p className="font-primary text-base text-gray-1/60">Searching…</p>
  </div>
);

export const ZeroResultsMessage = ({ query, suggestion, onSuggestionClick }) => (
  <div className="flex flex-col items-center gap-[calc(16/1728*var(--vw))] py-[calc(100/1728*var(--vw))] text-center">
    <img src={zeroIcon} alt="" aria-hidden="true" className="size-[calc(44/1728*var(--vw))]" />
    <p className="font-primary text-base leading-relaxed text-gray-1/60">
      No results for
      <br />
      <span className="font-semibold text-brand">"{query}"</span>
    </p>
    {suggestion && (
      <button
        type="button"
        onClick={() => onSuggestionClick?.(suggestion)}
        className="mt-[calc(4/1728*var(--vw))] rounded-full bg-gray-1/10 px-[calc(20/1728*var(--vw))] py-[calc(10/1728*var(--vw))] font-primary text-base text-gray-1 cursor-pointer hover:bg-gray-1/15"
      >
        Did you mean: <span className="font-semibold text-brand">”{suggestion}?”</span>
      </button>
    )}
  </div>
);

export const NetworkErrorMessage = ({ onRetry }) => (
  <div className="flex flex-col items-center gap-[calc(14/1728*var(--vw))] py-[calc(100/1728*var(--vw))] text-center">
    <img src={wifiErrorIcon} alt="" aria-hidden="true" className="size-[calc(44/1728*var(--vw))]" />
    <h3 className="font-primary font-semibold text-h6 text-gray-1">Connection Error</h3>
    <p className="max-w-[calc(300/1728*var(--vw))] font-primary text-base leading-relaxed text-gray-1/60">
      We couldn't reach the server. Check your connection and try again.
    </p>
    <button
      type="button"
      onClick={onRetry}
      className="mt-[calc(6/1728*var(--vw))] flex items-center gap-[calc(8/1728*var(--vw))] rounded-full bg-brand px-[calc(22/1728*var(--vw))] py-[calc(10/1728*var(--vw))] font-primary font-medium text-base text-gray-1 cursor-pointer"
    >
      <span aria-hidden="true">⟳</span>
      Try Again
    </button>
  </div>
);

export const AddedToast = ({ visible }) => (
  <div
    className={classNames(
      "fixed bottom-[calc(48/1728*var(--vw))] left-1/2 -translate-x-1/2 z-50 flex items-center gap-[calc(10/1728*var(--vw))]",
      "rounded-full bg-surface-raised px-[calc(20/1728*var(--vw))] py-[calc(12/1728*var(--vw))] shadow-lg transition-all duration-300",
      visible ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-2"
    )}
  >
    <img src={toastIcon} alt="" aria-hidden="true" className="size-[calc(20/1728*var(--vw))]" />
    <span className="font-primary text-base text-gray-1">Added to My Stuff</span>
  </div>
);
