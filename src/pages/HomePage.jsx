import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { openAfrishortsPlayer } from "../api/shorts";
import { useSelector } from "react-redux";
import classNames from "../utils/classNames";
import HeroSection from "../components/sections/home/HeroSection";
import MobileHero from "../components/sections/home/MobileHero";
import ContentRail from "../components/sections/home/ContentRail";
import AdBanner from "../components/sections/home/AdBanner";
import gloTvAd from "../../assets/GLOTV.svg";
import ShortCard from "../components/cards/ShortCard";
import ContinueCard from "../components/cards/ContinueCard";
import PosterCard from "../components/cards/PosterCard";
import GenreCard from "../components/cards/GenreCard";
import ChannelCard from "../components/cards/ChannelCard";

import { selectHomeRails, selectHomeLoading } from "../store/slice/homeSlice";
import PageSkeleton from "../components/shared/PageSkeleton";
import { fetchHomeContent, fetchTrailer } from "../api/fetchMoviesApi";
import { updateWatchlist } from "../api/details";
import { homeFixtures } from "../data/homeFixtures";
import { goToDetails } from "../utils/contentNavigation";
import useIsMobile from "../utils/useIsMobile";

// DATA: no API endpoints yet — renders from local fixtures. useSelector + dispatch-in-useEffect
// is wired via ../api/fetchMoviesApi.js (legacy-parity module name).
const HomePage = React.forwardRef(({ className, ...props }, ref) => {
  const rails = useSelector(selectHomeRails);
  const loading = useSelector(selectHomeLoading);
  const [heroIndex, setHeroIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Early-outs (fixtures mode / signed-out) clear the loader so the fixture
    // fallback below is treated as final content, not a loading flash.
    fetchHomeContent();
  }, []);

  // API mode marker: dashboard rails resolved ⇒ real content is rendering.
  const apiHome = (rails.vodRails?.length ?? 0) > 0;

  const data = {
    hero: rails.hero?.length ? rails.hero : homeFixtures.hero,
    afriplayShorts: rails.afriplayShorts?.length ? rails.afriplayShorts : homeFixtures.afriplayShorts,
    // MangoTV: Continue Watching only exists when the user has started
    // bookmarks — in API mode an empty rail HIDES (no dummy fixture posters);
    // fixtures remain the design-review fallback only.
    keepWatching: rails.keepWatching?.length
      ? rails.keepWatching
      : apiHome
        ? []
        : homeFixtures.keepWatching,
    becauseYouWatched: rails.becauseYouWatched?.length ? rails.becauseYouWatched : homeFixtures.becauseYouWatched,
    liveOnTvNow: rails.liveOnTvNow?.length ? rails.liveOnTvNow : homeFixtures.liveOnTvNow,
    top10Movies: rails.top10Movies?.length ? rails.top10Movies : homeFixtures.top10Movies,
    genres: rails.genres?.length ? rails.genres : homeFixtures.genres,
    newReleases: rails.newReleases?.length ? rails.newReleases : homeFixtures.newReleases,
    browseLiveChannels: rails.browseLiveChannels?.length ? rails.browseLiveChannels : homeFixtures.browseLiveChannels,
    onlyOnAfriplay: rails.onlyOnAfriplay?.length ? rails.onlyOnAfriplay : homeFixtures.onlyOnAfriplay,
    upcomingTvShows: homeFixtures.upcomingTvShows,
  };

  // Mobile hero chips (All / Movies / Tv Shows) filter the home feed IN PLACE
  // (streaming-app pattern) — hero pool + poster rails narrow to the content
  // type; desktop always renders "All" (the chips only exist below md).
  const isMobile = useIsMobile();
  const [mobileFilter, setMobileFilter] = useState("All");
  const filter = isMobile ? mobileFilter : "All";
  const typeOf = (m) => `${m?.contentType || m?.raw?.type || m?.raw?.vod_type || ""}`.toLowerCase();
  const matchesFilter = (m) => {
    if (filter === "All") return true;
    const t = typeOf(m);
    if (!t) return true; // fixtures carry no type — pass so design mode stays browsable
    return filter === "Movies" ? t.includes("movie") : t.includes("series");
  };
  // Banner slides: movie-linked → content_id; series-linked → series_content_id.
  const slideMatches = (s) => {
    if (filter === "All" || !s?.raw) return true;
    return filter === "Movies" ? s.raw.content_id != null : s.raw.series_content_id != null;
  };
  const filterItems = (items) => items.filter(matchesFilter);

  // Hero background trailer (legacy DynamicBanner pattern): fetch per banner's
  // linked content, cache by content id (null = no trailer, don't refetch).
  const heroPool = data.hero.filter(slideMatches);
  const heroSlides = heroPool.length ? heroPool : data.hero; // never an empty hero
  const heroCount = heroSlides.length;
  const activeSlide = heroSlides[heroIndex % heroCount];
  const activeContentId = activeSlide?.raw?.content_id;
  const [heroTrailers, setHeroTrailers] = useState({});
  const [heroMuted, setHeroMuted] = useState(true);
  useEffect(() => {
    if (!activeContentId || heroTrailers[activeContentId] !== undefined) return;
    let alive = true;
    fetchTrailer(activeContentId, activeSlide.raw.vod_type || activeSlide.raw.type).then((url) => {
      if (alive) setHeroTrailers((t) => ({ ...t, [activeContentId]: url ?? null }));
    });
    return () => {
      alive = false;
    };
  }, [activeContentId]); // eslint-disable-line react-hooks/exhaustive-deps
  const activeTrailer = activeContentId ? heroTrailers[activeContentId] ?? null : null;

  // Hero CTAs (MovieDetailsPage patterns): Watch Now plays the banner's linked
  // movie directly (/watch owns the premiumSub gate); series go to Series
  // Details since playback is per-episode. My Stuff bookmarks movies in place.
  // Fixture slides carry no content_id — both CTAs no-op in design-review mode.
  const [heroStuffAdded, setHeroStuffAdded] = useState(false);
  const heroType = (activeSlide?.raw?.vod_type || activeSlide?.raw?.type || "movie").toLowerCase();
  const heroWatchNow = () => {
    if (!activeContentId) return;
    if (heroType === "series") {
      navigate(`/series/${activeContentId}`);
    } else {
      navigate(`/watch/movie/${activeContentId}`, {
        state: { variant: "movie", contentId: activeContentId, title: activeSlide.title },
      });
    }
  };
  const heroMyStuff = async () => {
    if (!activeContentId || heroStuffAdded) return;
    if (heroType === "series") {
      // Series bookmarks are per-episode — the details page owns that flow.
      navigate(`/series/${activeContentId}`);
      return;
    }
    setHeroStuffAdded(true); // optimistic, like the details page
    const ok = await updateWatchlist(activeContentId, "movie");
    if (!ok) setHeroStuffAdded(false);
  };
  useEffect(() => setHeroStuffAdded(false), [activeContentId]);

  // Auto-advance through the spotlight slides — but hold while a trailer is
  // playing (it advances via onTrailerEnded instead, like the reels player).
  useEffect(() => {
    if (heroCount < 2 || activeTrailer) return;
    const timer = setInterval(() => setHeroIndex((i) => (i + 1) % heroCount), 8000);
    return () => clearInterval(timer);
  }, [heroCount, activeTrailer]);

  // Type-filtered vodRails (mobile chips); empty rails drop out. The Genres
  // midpoint insertion keys off THIS list so it stays centred after filtering.
  const visibleVodRails = (rails.vodRails || [])
    .map((r) => ({ ...r, items: filterItems(r.items) }))
    .filter((r) => r.items.length);
  // Non-VOD sections (live, ads, genres, shorts) hide while a type filter is on.
  const filterActive = filter !== "All";

  // Brief §9: promo banner image = a random `preview_image` from the banners API
  // (api/fetchMoviesApi picks it). The bundled GLOTV.svg is the design/offline
  // fallback only — it used to render unconditionally, so the live site showed a
  // hardcoded ad in place of the operator's own promo.
  const promoImage = rails.promoBanner || (apiHome ? null : gloTvAd);

  // Brief §6–8: an injected channel category renders as a live rail — channel logo,
  // name and its current EPG programme (same card the design uses for live content).
  const channelRail = (rail) =>
    rail?.items?.length ? (
      <ContentRail
        title={rail.name}
        items={rail.items}
        gap={23}
        renderItem={(c) => (
          <ContinueCard
            image={c.image}
            title={c.title}
            subtitle={c.subtitle}
            variant="live"
            onClick={() => c.uid && navigate(`/watch/live/${c.uid}`)}
          />
        )}
      />
    ) : null;

  // While the API fetch is in flight, show skeletons — rendering the fixture
  // fallback here flashed dummy posters for the first round-trip. (After all
  // hooks: rules of hooks.)
  if (loading) return <PageSkeleton rails={4} />;

  return (
    <div ref={ref} className={classNames("relative overflow-hidden font-primary text-gray-1", className)} {...props}>
      {/* The ambient purple blob field used to be a Home-only layer here
          (HOME_GLOWS). It now lives in MainLayout as the shared
          <AmbientBackground /> behind every page, same as glotv-main — a local
          copy on top of it doubled the glow. */}
      <div className="relative z-10">
        {/* Desktop hero (md+, trailer + CTAs) ↔ portrait mobile hero (below md).
            Only the active one mounts (useIsMobile) so a single trailer <video>
            plays — otherwise the hidden hero's video also decoded + played audio,
            which doubled the sound on unmute. */}
        {isMobile ? (
          <MobileHero
            slide={activeSlide}
            slideCount={heroCount}
            activeIndex={heroIndex % heroCount}
            chip={mobileFilter}
            onChipChange={setMobileFilter}
            trailerUrl={activeTrailer}
            muted={heroMuted}
            onToggleMute={() => setHeroMuted((m) => !m)}
            onTrailerEnded={() => setHeroIndex((i) => (i + 1) % heroCount)}
          />
        ) : (
          <HeroSection
            slide={activeSlide}
            slideCount={heroCount}
            activeIndex={heroIndex % heroCount}
            trailerUrl={activeTrailer}
            muted={heroMuted}
            onToggleMute={() => setHeroMuted((m) => !m)}
            onTrailerEnded={() => setHeroIndex((i) => (i + 1) % heroCount)}
            onWatchNow={heroWatchNow}
            onMyStuff={heroMyStuff}
            myStuffLabel={heroStuffAdded ? "In My Stuff" : "My Stuff"}
          />
        )}

      {/* Left gutter only — rails bleed to the right screen edge so posters scroll off/in at
         the very edge; headers re-add the right gutter via their own padding. */}
      <div className="flex flex-col gap-[calc(48/1728*var(--vw))] pl-[calc(53/1728*var(--vw))] py-[calc(64/1728*var(--vw))] max-md:pt-[calc(33/390*var(--mvw))]">
        {/* WONA design labels this rail "Wona Shorts" (with a NEW badge) */}
        {!filterActive && (
        <ContentRail
          title="Wona Shorts"
          isNew
          items={data.afriplayShorts}
          gap={40}
          renderItem={(s) => (
            // Brief: selecting a short → Shorts page playing its vertical trailer.
            <button
              type="button"
              onClick={() => openAfrishortsPlayer(data.afriplayShorts, s.id, navigate)}
              className="cursor-pointer"
              aria-label={`Play ${s.title || "short"}`}
            >
              <ShortCard image={s.image} duration={s.duration} />
            </button>
          )}
        />
        )}

        {/* MangoTV CW behavior: rail hides entirely with no started bookmarks;
            cards resume playback (movies/episodes → player, which resumes from
            the saved bookmark; fixture cards carry no raw → no-op). */}
        {filterItems(data.keepWatching).length > 0 && (
        <ContentRail
          title="Keep Watching"
          items={filterItems(data.keepWatching)}
          gap={23}
          renderItem={(c) => (
            <ContinueCard
              image={c.image}
              title={c.title}
              subtitle={c.subtitle}
              variant="keep-watching"
              progress={c.percentWatched}
              onClick={() => {
                if (!c.raw) return;
                if (c.contentType === "series") {
                  const epId = c.raw.episode?.id;
                  if (epId)
                    navigate(`/watch/series/${epId}`, {
                      state: { variant: "movie", contentId: epId, title: c.title },
                    });
                  else navigate(`/series/${c.contentId}`);
                } else {
                  // Playout keys on the movie UID; numeric contentId rides in
                  // state for the bookmark/resume calls (details-page pattern).
                  navigate(`/watch/movie/${c.uid || c.contentId}`, {
                    state: { variant: "movie", contentId: c.contentId, title: c.title },
                  });
                }
              }}
            />
          )}
        />
        )}

        {/* CRM-configured dashboard rails (API mode) — otherwise the named fixture
            rails below render the as-designed dummy content. Brief: the Genre
            section (branded categories) sits halfway through the VOD listings —
            e.g. 7 rails → after the 3rd (floor(n/2) keeps 3|Genres|4). */}
        {visibleVodRails.length > 0 &&
          visibleVodRails.map((rail, index) => (
            <React.Fragment key={rail.id}>
              {!filterActive && rails.brandedGenres?.length > 0 && index === Math.floor(visibleVodRails.length / 2) && (
                <ContentRail
                  title="Genres"
                  showArrow={false}
                  items={rails.brandedGenres}
                  gap={24}
                  renderItem={(g) => (
                    <GenreCard
                      image={g.image}
                      label={g.label}
                      onClick={() => navigate(`/movies?category=${g.id}`)}
                    />
                  )}
                />
              )}
              <ContentRail
                title={rail.name}
                items={rail.items}
                gap={23}
                renderItem={(m) => (
                  <PosterCard image={m.image} title={m.title} metadata={m.metadata} rank={m.rank} onClick={() => m.raw && goToDetails(navigate, m)} />
                )}
              />

              {/* Brief §7 + §9: the FIRST channel category goes immediately after the
                 first VOD category, and the promotional banner immediately after that. */}
              {!filterActive && index === 0 && channelRail(rails.firstChannelRail)}
              {!filterActive && index === 0 && promoImage && <AdBanner data={{ asset: promoImage, title: rails.promoBannerTitle }} />}

              {/* Brief §8: the SECOND channel category goes immediately BEFORE the last
                 VOD category — i.e. after the second-to-last rail. */}
              {!filterActive &&
                visibleVodRails.length > 1 &&
                index === visibleVodRails.length - 2 &&
                channelRail(rails.secondChannelRail)}
            </React.Fragment>
          ))}

        {!rails.vodRails?.length && (
        <ContentRail
          title="Because You Watched"
          items={filterItems(data.becauseYouWatched)}
          gap={23}
          renderItem={(m) => <PosterCard image={m.image} title={m.title} metadata={m.metadata} onClick={() => m.raw && goToDetails(navigate, m)} />}
        />
        )}

        {/* Live On Tv Now — real channels + current EPG in API mode (wired 2026-07-30;
           it used to be fixture-only, so dummy channels shipped on every live load). */}
        {!filterActive && data.liveOnTvNow.length > 0 && (
        <ContentRail
          title="🔴 Live On Tv Now"
          items={data.liveOnTvNow}
          gap={23}
          renderItem={(c) => (
            <ContinueCard
              image={c.image}
              title={c.title}
              subtitle={c.subtitle}
              variant="live"
              onClick={() => c.uid && navigate(`/watch/live/${c.uid}`)}
            />
          )}
        />
        )}

        {!rails.vodRails?.length && (
        <ContentRail
          title="Top 10 Movies"
          items={filterItems(data.top10Movies)}
          gap={23}
          renderItem={(m) => <PosterCard image={m.image} title={m.title} metadata={m.metadata} rank={m.rank} onClick={() => m.raw && goToDetails(navigate, m)} />}
        />
        )}

        {/* Fixture Genres rail — design-review fallback only; in API mode the
            branded-categories Genres rail renders halfway through vodRails
            (brief). Kept when the API has no branded categories at all. */}
        {!filterActive && !(rails.vodRails?.length > 0 && rails.brandedGenres?.length > 0) && (
          <ContentRail
            title="Genres"
            showArrow={false}
            items={data.genres}
            gap={24}
            renderItem={(g) => <GenreCard image={g.image} label={g.label} />}
          />
        )}

        {!rails.vodRails?.length && (
        <ContentRail
          title="New Release on Wona"
          items={filterItems(data.newReleases)}
          gap={23}
          renderItem={(m) => <PosterCard image={m.image} title={m.title} metadata={m.metadata} onClick={() => m.raw && goToDetails(navigate, m)} />}
        />
        )}

        {/* Header arrow → Live TV browse page; a card → straight into live playback
           (legacy behavior — channels have no details step; the watch page owns the
           subscription gate). Fixture channels carry no uid → no-op. */}
        {!filterActive && (
        <ContentRail
          title="Browse Live Channels"
          items={data.browseLiveChannels}
          gap={23}
          onArrowClick={() => navigate("/live")}
          renderItem={(c) => (
            <ChannelCard
              image={c.image}
              live={c.live}
              title={c.title}
              onClick={() => c.uid && navigate(`/watch/live/${c.uid}`)}
            />
          )}
        />
        )}

        {!rails.vodRails?.length && (
        <ContentRail
          title="Only on Wona"
          items={filterItems(data.onlyOnAfriplay)}
          gap={23}
          renderItem={(m) => <PosterCard image={m.image} title={m.title} metadata={m.metadata} onClick={() => m.raw && goToDetails(navigate, m)} />}
        />
        )}

        {/* Fixture-only teaser rail — no API source exists for "upcoming", so it is
           gated to fixture/design mode. Without that gate it rendered dummy shows
           alongside real API rails on the live site. */}
        {filter !== "Movies" && !apiHome && (
        <ContentRail
          title="Upcoming TV Shows"
          items={data.upcomingTvShows}
          gap={23}
          renderItem={(m) => <PosterCard image={m.image} title={m.title} metadata={m.metadata} />}
        />
        )}
      </div>
      </div>
    </div>
  );
});

HomePage.displayName = "HomePage";
export default HomePage;
