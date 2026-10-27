import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import classNames from "../utils/classNames";

import HeroSection from "../components/sections/home/HeroSection";
import ContentRail from "../components/sections/home/ContentRail";
import PosterCard from "../components/cards/PosterCard";
import PageSkeleton from "../components/shared/PageSkeleton";

import { selectMoviesPage, selectMoviesPageLoading } from "../store/slice/moviesSlice";
import { fetchMoviesPageContent, fetchTrailer } from "../api/fetchMoviesApi";
import { fetchMovieDetails, fetchSeriesDetails } from "../api/details";
import { homeFixtures } from "../data/homeFixtures";
import { goToDetails } from "../utils/contentNavigation";

/**
 * MoviesPage (/movies) — legacy movies.js flow, revamp UI:
 *  - hero spotlight from the recently-added rail (background trailer, like Home)
 *  - genre tabs from v1/{ouid}/genres; "All" shows every category rail (brief:
 *    Movies section = ALL VOD categories), a genre shows the filtered poster grid
 * Fixtures render as fallback in design-review / signed-out mode.
 */
function MoviesPage() {
  const api = useSelector(selectMoviesPage);
  const loading = useSelector(selectMoviesPageLoading);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMoviesPageContent();
  }, []);

  const apiMode = api.rails.length > 0;
  const rails = apiMode
    ? api.rails
    : [
        { id: "fx-new", name: "New Release on Wona", items: homeFixtures.newReleases },
        { id: "fx-top", name: "Top 10 Movies", isTop10: true, items: homeFixtures.top10Movies },
        { id: "fx-only", name: "Only on Wona", items: homeFixtures.onlyOnAfriplay },
        { id: "fx-because", name: "Because You Watched", items: homeFixtures.becauseYouWatched },
      ];

  // Hero spotlight: recently-added rail if present, else the first rail
  // (legacy DynamicBanner picked from recently added).
  const heroRail =
    rails.find((r) => /recentlyadded|recent/i.test(r.uid || "")) || rails[0];
  const heroSlides = (heroRail?.items || []).slice(0, 5).map((item) => ({
    id: item.id,
    backdrop:
      (item.raw && (item.raw.preview_image_id || item.raw.background_image_id)
        ? item.image.replace(/images\/\d+/, `images/${item.raw.preview_image_id ?? item.raw.background_image_id}`)
        : item.image) || item.image,
    title: item.title,
    description: item.raw?.description || "",
    year: item.raw?.year ?? null,
    rating: item.raw?.critics_rating ?? null,
    genres: [],
    raw: item.raw ? { content_id: item.raw.id, type: item.raw.type || "movie" } : null,
  }));
  const heroCount = Math.max(1, heroSlides.length);
  const [heroIndex, setHeroIndex] = useState(0);
  const activeSlide = heroSlides[heroIndex % heroCount] || null;
  const activeContentId = activeSlide?.raw?.content_id;

  // Background trailer, HomePage pattern (cache incl. null = "no trailer").
  const [trailers, setTrailers] = useState({});
  const [muted, setMuted] = useState(true);
  useEffect(() => {
    if (!activeContentId || trailers[activeContentId] !== undefined) return;
    let alive = true;
    fetchTrailer(activeContentId, activeSlide.raw.type).then((url) => {
      if (alive) setTrailers((t) => ({ ...t, [activeContentId]: url ?? null }));
    });
    return () => {
      alive = false;
    };
  }, [activeContentId]); // eslint-disable-line react-hooks/exhaustive-deps
  const activeTrailer = activeContentId ? trailers[activeContentId] ?? null : null;

  // The CRM vod/content listing rows carry NO description (verified live —
  // only id/title/year/rating/image fields), so the hero synopsis comes from a
  // lazy per-title details fetch, cached like the trailers (null = fetched,
  // nothing usable).
  const [heroDetails, setHeroDetails] = useState({});
  useEffect(() => {
    if (!activeContentId || heroDetails[activeContentId] !== undefined) return;
    let alive = true;
    const fetcher = activeSlide.raw.type === "series" ? fetchSeriesDetails : fetchMovieDetails;
    fetcher(activeContentId)
      .then((d) => {
        if (alive) setHeroDetails((h) => ({ ...h, [activeContentId]: d?.description || null }));
      })
      .catch(() => {
        if (alive) setHeroDetails((h) => ({ ...h, [activeContentId]: null }));
      });
    return () => {
      alive = false;
    };
  }, [activeContentId]); // eslint-disable-line react-hooks/exhaustive-deps
  const slideWithDescription = activeSlide
    ? {
        ...activeSlide,
        description: activeSlide.description || heroDetails[activeContentId] || "",
      }
    : null;

  useEffect(() => {
    if (heroCount < 2 || activeTrailer) return;
    const timer = setInterval(() => setHeroIndex((i) => (i + 1) % heroCount), 8000);
    return () => clearInterval(timer);
  }, [heroCount, activeTrailer]);

  // ?category={id} — deep link from the homepage's branded Genres rail (brief:
  // Genre section opens the category, Mango+ Brands pattern). When it matches a
  // rail, that category renders as a full grid instead of the rails view.
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const categoryRail = categoryParam
    ? rails.find((r) => String(r.id) === String(categoryParam)) || null
    : null;

  // Genre tabs (legacy GenreTabs): "All" = rails; a genre = filtered grid.
  const [activeGenre, setActiveGenre] = useState(null); // null = All
  const genreLabels = apiMode ? api.genres : [];
  const genreMovies = activeGenre
    ? api.allMovies.filter((m) => m.genreIds?.includes(activeGenre.id))
    : [];

  if (loading) return <PageSkeleton rails={4} />;

  return (
    <div className="relative overflow-hidden font-primary text-gray-1">
      {activeSlide && (
        <HeroSection
          slide={slideWithDescription}
          slideCount={heroCount}
          activeIndex={heroIndex % heroCount}
          trailerUrl={activeTrailer}
          muted={muted}
          onToggleMute={() => setMuted((m) => !m)}
          onTrailerEnded={() => setHeroIndex((i) => (i + 1) % heroCount)}
          onWatchNow={() =>
            activeContentId &&
            navigate(`/watch/movie/${activeContentId}`, {
              state: { variant: "movie", contentId: activeContentId, title: activeSlide.title },
            })
          }
          onMyStuff={() => activeContentId && navigate(`/movie/${activeContentId}`)}
        />
      )}

      <div className="flex flex-col gap-[calc(40/1728*var(--vw))] pl-[calc(53/1728*var(--vw))] py-[calc(48/1728*var(--vw))]">
        {categoryRail ? (
          <>
            <div className="flex items-center gap-[calc(20/1728*var(--vw))] pr-[calc(53/1728*var(--vw))]">
              <button
                type="button"
                onClick={() => setSearchParams({}, { replace: true })}
                className="cursor-pointer rounded-full bg-gray-1/10 px-[calc(20/1728*var(--vw))] py-[calc(8/1728*var(--vw))] font-primary text-base text-gray-1 hover:bg-gray-1/15"
              >
                ← All Movies
              </button>
              <h2 className="font-primary font-bold text-h6 text-gray-1">{categoryRail.name}</h2>
            </div>
            <div className="flex flex-wrap gap-[calc(23/1728*var(--vw))] pr-[calc(53/1728*var(--vw))]">
              {categoryRail.items.map((m) => (
                <PosterCard
                  key={m.id}
                  image={m.image}
                  title={m.title}
                  metadata={m.metadata}
                  onClick={() => m.raw && goToDetails(navigate, m)}
                />
              ))}
            </div>
          </>
        ) : (
          <>
        {genreLabels.length > 0 && (
          <div className="flex flex-wrap gap-[calc(12/1728*var(--vw))] pr-[calc(53/1728*var(--vw))]">
            {[null, ...genreLabels].map((g) => {
              const isActive = (g?.id ?? null) === (activeGenre?.id ?? null);
              return (
                <button
                  key={g?.id ?? "all"}
                  type="button"
                  onClick={() => setActiveGenre(g)}
                  className={classNames(
                    "flex h-[calc(38/1728*var(--vw))] items-center justify-center rounded-full px-[calc(20/1728*var(--vw))]",
                    "font-primary font-medium text-base cursor-pointer transition-colors",
                    isActive
                      ? "bg-brand text-page"
                      : "bg-gray-1/10 text-gray-1 border border-gray-1/15 hover:bg-gray-1/15"
                  )}
                >
                  {g ? g.name : "All"}
                </button>
              );
            })}
          </div>
        )}

        {activeGenre ? (
          genreMovies.length ? (
            <div className="flex flex-wrap gap-[calc(23/1728*var(--vw))] pr-[calc(53/1728*var(--vw))]">
              {genreMovies.map((m) => (
                <PosterCard
                  key={m.id}
                  image={m.image}
                  title={m.title}
                  metadata={m.metadata}
                  onClick={() => m.raw && goToDetails(navigate, m)}
                />
              ))}
            </div>
          ) : (
            <p className="py-[calc(24/1728*var(--vw))] font-primary text-base text-gray-1/60">
              No {activeGenre.name.toLowerCase()} titles available right now.
            </p>
          )
        ) : (
          rails.map((rail) => (
            <ContentRail
              key={rail.id}
              title={rail.name}
              items={rail.items}
              gap={23}
              renderItem={(m) => (
                <PosterCard
                  image={m.image}
                  title={m.title}
                  metadata={m.metadata}
                  rank={rail.isTop10 ? m.rank : undefined}
                  onClick={() => m.raw && goToDetails(navigate, m)}
                />
              )}
            />
          ))
        )}
          </>
        )}
      </div>
    </div>
  );
}

export default MoviesPage;
