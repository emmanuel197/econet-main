import React, { useEffect, useState } from "react";
import { Pulse } from "../components/shared/PageSkeleton";
import { useNavigate, useParams } from "react-router-dom";
import playIcon from "../../assets/icons/home-hero-watch-now-play.svg";
import Button from "../components/ui/Button";
import DetailsHero from "../components/sections/details/DetailsHero";
import ContentRail from "../components/sections/home/ContentRail";
import PosterCard from "../components/cards/PosterCard";
import classNames from "../utils/classNames";
import { imageUrl } from "../api/client";
import { fetchSeriesDetails, fetchSimilar, detailsToCard } from "../api/details";
import { goToDetails } from "../utils/contentNavigation";

/**
 * SeriesDetailsPage (/series/:id) — legacy seriesDetails.js workflow, revamp UI:
 * hero + season stepper + episode list + More Like This. Playback is per-EPISODE
 * (/watch/series/{episodeId}); the watch page owns the premiumSub gate.
 * Legacy bug fixed in port: PLAY targeted the LAST episode of the season — it
 * now plays the first.
 */
const SeriesDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [failed, setFailed] = useState(false);
  const [seasonIndex, setSeasonIndex] = useState(0);
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setDetails(null);
    setFailed(false);
    setSeasonIndex(0);
    fetchSeriesDetails(id)
      .then((d) => (d ? setDetails(d) : setFailed(true)))
      .catch(() => setFailed(true));
    fetchSimilar("series", id).then((rows) => setSimilar((rows || []).map(detailsToCard)));
  }, [id]);

  if (failed)
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 font-primary text-gray-1">
        <p className="text-2xl">We couldn&apos;t load this series.</p>
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

  const seasons = details.seasons || [];
  const season = seasons[seasonIndex] || null;
  const episodes = season?.episodes || [];

  const playEpisode = (episode) => {
    navigate(`/watch/series/${episode.id}`, {
      state: { variant: "movie", contentId: episode.id, title: details.title },
    });
  };

  const poster = imageUrl(details.images?.POSTER ?? details.image_id) || "";
  const backdrop = imageUrl(details.images?.BACKGROUND) || poster;

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
        {episodes.length > 0 && (
          <Button
            variant="primary"
            size="lg"
            onClick={() => playEpisode(episodes[0])}
            className="max-md:px-[calc(18/390*var(--mvw))] max-md:py-[calc(10/390*var(--mvw))]"
            startIcon={<img src={playIcon} alt="" aria-hidden="true" className="size-[calc(20/1728*var(--vw))] max-md:size-[calc(15/390*var(--mvw))]" />}
          >
            <span className="font-medium text-xl text-gray-1 max-md:text-[calc(13/390*var(--mvw))]">Play</span>
          </Button>
        )}
      </DetailsHero>

      {seasons.length > 0 && (
        <div className="flex flex-col gap-[calc(24/1728*var(--vw))] px-[calc(60/1728*var(--vw))] py-[calc(40/1728*var(--vw))] max-md:gap-[calc(16/390*var(--mvw))] max-md:px-[calc(20/390*var(--mvw))] max-md:py-[calc(24/390*var(--mvw))]">
          <div className="flex items-center gap-[calc(20/1728*var(--vw))] max-md:justify-between max-md:gap-[calc(10/390*var(--mvw))]">
            <h2 className="text-4xl font-semibold max-md:text-[calc(19/390*var(--mvw))]">Episodes</h2>
            {seasons.length > 1 && (
              <div className="flex items-center gap-[calc(12/1728*var(--vw))] max-md:gap-[calc(8/390*var(--mvw))]">
                <button
                  type="button"
                  disabled={seasonIndex === 0}
                  onClick={() => setSeasonIndex((i) => i - 1)}
                  className="cursor-pointer rounded-full bg-gray-1/10 px-3 py-1 text-xl disabled:opacity-30 max-md:text-[calc(14/390*var(--mvw))]"
                  aria-label="Previous season"
                >
                  ‹
                </button>
                <span className="text-xl text-gray-2 max-md:text-[calc(12/390*var(--mvw))] max-md:whitespace-nowrap">
                  Season {season?.number ?? seasonIndex + 1}/{seasons.length}
                </span>
                <button
                  type="button"
                  disabled={seasonIndex === seasons.length - 1}
                  onClick={() => setSeasonIndex((i) => i + 1)}
                  className="cursor-pointer rounded-full bg-gray-1/10 px-3 py-1 text-xl disabled:opacity-30 max-md:text-[calc(14/390*var(--mvw))]"
                  aria-label="Next season"
                >
                  ›
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-[calc(12/1728*var(--vw))] max-md:gap-[calc(8/390*var(--mvw))]">
            {episodes.map((ep, i) => (
              <button
                key={ep.id}
                type="button"
                onClick={() => playEpisode(ep)}
                className={classNames(
                  "flex w-full cursor-pointer items-center gap-[calc(20/1728*var(--vw))] rounded-xl bg-gray-1/5 px-[calc(20/1728*var(--vw))] py-[calc(14/1728*var(--vw))] text-left transition-colors hover:bg-gray-1/10 max-md:gap-[calc(12/390*var(--mvw))] max-md:px-[calc(12/390*var(--mvw))] max-md:py-[calc(10/390*var(--mvw))]"
                )}
              >
                <span className="w-[calc(36/1728*var(--vw))] shrink-0 text-2xl font-semibold text-brand max-md:w-[calc(20/390*var(--mvw))] max-md:text-[calc(15/390*var(--mvw))]">
                  {ep.number ?? i + 1}
                </span>
                {ep.images?.POSTER || ep.image_id ? (
                  <img
                    src={imageUrl(ep.images?.POSTER ?? ep.image_id)}
                    alt=""
                    className="h-[calc(64/1728*var(--vw))] w-[calc(110/1728*var(--vw))] shrink-0 rounded-lg object-cover max-md:h-[calc(48/390*var(--mvw))] max-md:w-[calc(82/390*var(--mvw))]"
                  />
                ) : null}
                <span className="flex min-w-0 flex-col">
                  <span className="text-xl font-medium text-gray-1 max-md:truncate max-md:text-[calc(13/390*var(--mvw))]">{ep.title || `Episode ${ep.number ?? i + 1}`}</span>
                  {ep.description && (
                    <span className="line-clamp-1 text-base text-gray-1/60 max-md:text-[calc(11/390*var(--mvw))]">{ep.description}</span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {similar.length > 0 && (
        <div className="flex flex-col gap-[calc(48/1728*var(--vw))] pl-[calc(53/1728*var(--vw))] pb-[calc(48/1728*var(--vw))] max-md:pl-[calc(20/390*var(--mvw))] max-md:pb-[calc(24/390*var(--mvw))]">
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

export default SeriesDetailsPage;
