import React, { useEffect, useState } from "react";
import { Pulse } from "../components/shared/PageSkeleton";
import { useNavigate, useParams } from "react-router-dom";
import playIcon from "../../assets/icons/home-hero-watch-now-play.svg";
import addIcon from "../../assets/icons/home-hero-my-stuff-add.svg";
import Button from "../components/ui/Button";
import DetailsHero from "../components/sections/details/DetailsHero";
import ContentRail from "../components/sections/home/ContentRail";
import PosterCard from "../components/cards/PosterCard";
import { imageUrl } from "../api/client";
import {
  fetchMovieDetails,
  fetchTrailerUrl,
  fetchSimilar,
  updateWatchlist,
  removeWatchlist,
  detailsToCard,
} from "../api/details";
import { TOAST } from "../utils/authConstants";
import { goToDetails } from "../utils/contentNavigation";

/**
 * MovieDetailsPage (/movie/:id) — legacy movieDetailsPage.js workflow, revamp UI.
 * No subscription check here: WATCH always goes to /watch, which owns the
 * premiumSub gate (subscribed → playout, else trailer/subscribe screen).
 */
const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [failed, setFailed] = useState(false);
  const [watchlisted, setWatchlisted] = useState(false);
  const [trailerBusy, setTrailerBusy] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setDetails(null);
    setFailed(false);
    fetchMovieDetails(id)
      .then((d) => {
        if (import.meta.env.DEV)
          console.log("[details] movie image fields — image_store_id:", d?.image_store_id, "movie_image_stores:", d?.movie_image_stores, "movie_genres:", d?.movie_genres);
        return d ? setDetails(d) : setFailed(true);
      })
      .catch(() => setFailed(true));
    fetchSimilar("movies", id).then((rows) => setSimilar((rows || []).map(detailsToCard)));
  }, [id]);

  const handleWatch = () => {
    // Legacy routed by uid; the numeric id rides along for trailer/bookmark calls.
    navigate(`/watch/movie/${details.uid || details.id}`, {
      state: { variant: "movie", contentId: details.id, title: details.title },
    });
  };

  const handleTrailer = async () => {
    if (trailerBusy) return;
    setTrailerBusy(true);
    const trailer = await fetchTrailerUrl(details.id, "movie");
    setTrailerBusy(false);
    // Trailer plays for everyone; missing trailer is handled on the watch page
    // ("Trailer Was Not Found" + Back — legacy edge case).
    navigate(`/watch/movie/${details.uid || details.id}`, {
      state: { trailer, variant: "trailer", contentId: details.id, title: details.title },
    });
  };

  const toggleWatchlist = async () => {
    const next = !watchlisted;
    setWatchlisted(next); // optimistic, like legacy
    if (next) await updateWatchlist(details.id, "movie", 0);
    else await removeWatchlist(details.id, "movie");
    TOAST.success(next ? "Added to My Stuff" : "Removed from My Stuff");
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: details.title, url });
      } catch {
        /* cancelled */
      }
      return;
    }
    await navigator.clipboard?.writeText(url);
    TOAST.success("Link copied");
  };

  if (failed)
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 font-primary text-gray-1">
        <p className="text-2xl">We couldn&apos;t load this title.</p>
        <Button variant="primary" size="lg" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  if (!details)
    return (
      <div className="flex flex-col gap-[calc(24/1728*var(--vw))] px-[calc(53/1728*var(--vw))] pt-[calc(146/1728*var(--vw))] max-md:gap-[calc(14/390*var(--mvw))] max-md:px-[calc(16/390*var(--mvw))] max-md:pt-[calc(70/390*var(--mvw))]">
        <Pulse className="h-[calc(520/1728*var(--vw))] w-full rounded-2xl max-md:h-[calc(240/390*var(--mvw))]" />
        <Pulse className="h-[calc(36/1728*var(--vw))] w-1/3 max-md:h-[calc(22/390*var(--mvw))] max-md:w-2/3" />
        <Pulse className="h-[calc(18/1728*var(--vw))] w-1/2 max-md:h-[calc(14/390*var(--mvw))] max-md:w-full" />
        <Pulse className="h-[calc(18/1728*var(--vw))] w-2/5 max-md:h-[calc(14/390*var(--mvw))] max-md:w-4/5" />
      </div>
    );

  // Movie details ship images differently from series (verified live): a bare
  // image_store_id for the poster, plus a movie_image_stores collection that may
  // carry typed art. Handle both array-of-rows and keyed-map shapes.
  const storeArt = (kind) => {
    const stores = details.movie_image_stores;
    if (Array.isArray(stores))
      return stores.find((s) => (s.type || s.kind || "").toUpperCase().includes(kind))?.image_store_id ?? null;
    return stores?.[kind] ?? null;
  };
  const poster =
    imageUrl(
      details.images?.POSTER ?? details.image_id ?? details.image_store_id ?? storeArt("POSTER")
    ) || "";
  const backdrop =
    imageUrl(details.images?.BACKGROUND ?? details.background_image_id ?? storeArt("BACKGROUND")) ||
    poster;

  return (
    <div className="relative overflow-hidden font-primary text-gray-1">
      <DetailsHero
        image={backdrop}
        poster={poster}
        title={details.title}
        rating={details.user_rating || details.critics_rating}
        year={details.year}
        genres={(details.genres || []).filter((g) => typeof g === "string")}
        description={details.description}
      >
        <Button
          variant="primary"
          size="lg"
          onClick={handleWatch}
          className="max-md:px-[calc(18/390*var(--mvw))] max-md:py-[calc(10/390*var(--mvw))]"
          startIcon={<img src={playIcon} alt="" aria-hidden="true" className="size-[calc(20/1728*var(--vw))] max-md:size-[calc(15/390*var(--mvw))]" />}
        >
          <span className="font-medium text-xl text-gray-1 max-md:text-[calc(13/390*var(--mvw))]">Watch Movie</span>
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={handleTrailer}
          disabled={trailerBusy}
          className="max-md:px-[calc(18/390*var(--mvw))] max-md:py-[calc(10/390*var(--mvw))]"
        >
          <span className="font-medium text-xl text-gray-1 max-md:text-[calc(13/390*var(--mvw))]">{trailerBusy ? "Loading…" : "Trailer"}</span>
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={toggleWatchlist}
          className="max-md:px-[calc(18/390*var(--mvw))] max-md:py-[calc(10/390*var(--mvw))]"
          startIcon={<img src={addIcon} alt="" aria-hidden="true" className="size-[calc(20/1728*var(--vw))] max-md:size-[calc(15/390*var(--mvw))]" />}
        >
          <span className="font-medium text-xl text-gray-1 max-md:text-[calc(13/390*var(--mvw))]">{watchlisted ? "In My Stuff" : "My Stuff"}</span>
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={handleShare}
          className="max-md:px-[calc(18/390*var(--mvw))] max-md:py-[calc(10/390*var(--mvw))]"
        >
          <span className="font-medium text-xl text-gray-1 max-md:text-[calc(13/390*var(--mvw))]">Share</span>
        </Button>
      </DetailsHero>

      {similar.length > 0 && (
        <div className="flex flex-col gap-[calc(48/1728*var(--vw))] pl-[calc(53/1728*var(--vw))] py-[calc(48/1728*var(--vw))] max-md:pl-[calc(20/390*var(--mvw))] max-md:py-[calc(24/390*var(--mvw))]">
          <ContentRail
            title="More Like This"
            items={similar}
            gap={23}
            renderItem={(m) => (
              <PosterCard
                image={m.image}
                title={m.title}
                metadata={m.metadata}
                onClick={() => goToDetails(navigate, m)}
              />
            )}
          />
        </div>
      )}
    </div>
  );
};

export default MovieDetailsPage;
