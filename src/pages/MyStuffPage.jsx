import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "../utils/classNames";
import Button from "../components/ui/Button";
import { Pulse } from "../components/shared/PageSkeleton";
import { fetchWatchlist } from "../api/fetchMoviesApi";
import { removeWatchlist } from "../api/details";
import { goToDetails } from "../utils/contentNavigation";

/**
 * MyStuffPage (/my-stuff) — legacy profile Watchlist tab promoted to its own
 * page (legacy logic, revamp UI): every my_content bookmark, artwork-enriched,
 * with per-item Remove (bookmarks DELETE) and click-through to details.
 */
function MyStuffPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState(null); // null = loading
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    let alive = true;
    fetchWatchlist().then((cards) => alive && setItems(cards));
    return () => {
      alive = false;
    };
  }, []);

  const remove = async (card) => {
    setRemoving(card.id);
    try {
      await removeWatchlist(card.contentId, card.contentType);
      // Optimistic list update — legacy refetched; dropping locally avoids the
      // full artwork-enrichment round-trip.
      setItems((list) => list.filter((c) => c.id !== card.id));
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="relative min-h-screen font-primary text-gray-1">
      <div className="flex flex-col gap-[calc(32/1728*var(--vw))] px-[calc(53/1728*var(--vw))] pt-[calc(146/1728*var(--vw))] pb-[calc(96/1728*var(--vw))]">
        <div className="flex flex-col gap-[calc(4/1728*var(--vw))]">
          <h1 className="font-primary font-bold text-h5 text-gray-1">
            My <span className="text-brand">Stuff</span>
          </h1>
          <p className="font-primary text-lg text-gray-1/70">
            Everything you&apos;ve saved and started watching
          </p>
        </div>

        {items === null ? (
          <div className="flex flex-wrap gap-[calc(23/1728*var(--vw))]">
            {Array.from({ length: 8 }, (_, i) => (
              <Pulse key={i} className="aspect-[2/3] w-[calc(250/1728*var(--vw))] rounded-lg" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-start gap-[calc(16/1728*var(--vw))] py-[calc(48/1728*var(--vw))]">
            <p className="font-primary text-base text-gray-1/60">
              Nothing here yet — add movies and shows with the “My Stuff” button.
            </p>
            <Button variant="primary" size="lg" onClick={() => navigate("/home")}>
              Browse Content
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-[calc(23/1728*var(--vw))]">
            {items.map((card) => (
              <div key={card.id} className="group flex w-[calc(250/1728*var(--vw))] flex-col gap-[calc(10/1728*var(--vw))]">
                <button
                  type="button"
                  onClick={() => goToDetails(navigate, card)}
                  className="relative aspect-[2/3] w-full cursor-pointer overflow-clip rounded-lg"
                  aria-label={`Open ${card.title}`}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {card.percentWatched >= 1 && (
                    <div className="absolute inset-x-0 bottom-0 h-[calc(4/1728*var(--vw))] bg-gray-1/20">
                      <div
                        className="h-full bg-brand"
                        style={{ width: `${Math.min(100, card.percentWatched)}%` }}
                      />
                    </div>
                  )}
                </button>
                <div className="flex items-start justify-between gap-[calc(8/1728*var(--vw))]">
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-primary font-semibold text-base text-gray-1">
                      {card.title}
                    </span>
                    {card.subtitle && (
                      <span className="truncate font-primary text-sm text-gray-1/60">{card.subtitle}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(card)}
                    disabled={removing === card.id}
                    className={classNames(
                      "shrink-0 rounded-full bg-gray-1/10 px-[calc(12/1728*var(--vw))] py-[calc(4/1728*var(--vw))]",
                      "font-primary text-xs text-gray-1/80 cursor-pointer hover:bg-error-8/20 hover:text-error-8"
                    )}
                  >
                    {removing === card.id ? "…" : "Remove"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyStuffPage;
