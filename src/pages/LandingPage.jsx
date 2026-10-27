import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticatedUser } from "../utils/authConstants";
import { setDeviceInCookies } from "../utils/setDeviceInCookies";
import { sendLog } from "../api/account";
import { fetchLandingContent } from "../api/landing";
import { useHandleNavigation } from "../utils/navigationHelpers";

import HeroSection from "../components/sections/home/HeroSection";
import MobileHero from "../components/sections/home/MobileHero";
import ContentRail from "../components/sections/home/ContentRail";
import PosterCard from "../components/cards/PosterCard";
import FaqSection from "../components/sections/landing/FaqSection";
import { homeFixtures } from "../data/homeFixtures";
import PageSkeleton from "../components/shared/PageSkeleton";

/**
 * LandingPage — public "/" for signed-out visitors, ported from legacy landing.js:
 * hero + a slim set of teaser rails (Trending / Recently Added / Binge Worthy) + FAQ.
 * Authenticated users are redirected straight to /home (the full HomePage).
 * Content comes from the public CRM client endpoint (api/landing.js — no auth
 * needed); fixtures render as the fallback while loading / on failure.
 */
const LandingPage = () => {
  // isAuthenticatedUser honours VITE_BYPASS_AUTH (like ProtectedRoute), so in dev the
  // root path lands on the real /home instead of this signed-out teaser page.
  const authed = isAuthenticatedUser();
  const [content, setContent] = useState(null);
  // Fixtures only render once the CRM fetch has settled — rendering them while
  // it's in flight flashed dummy posters for the first round-trip.
  const [loading, setLoading] = useState(true);
  const handleNavigation = useHandleNavigation();

  // All landing CTAs (posters, hero Watch Now / My Stuff) funnel into the auth
  // flow: signed out → /select-network (if no operator yet) → /signin, with the
  // destination remembered and honoured after login (consumePostLoginDestination).
  const requireAuth = () => handleNavigation("/home");

  useEffect(() => {
    window.scrollTo(0, 0);
    setDeviceInCookies();
    sendLog({ action: "visit" }); // legacy sent a landing "visit" log for analytics
    fetchLandingContent()
      .then((data) => {
        if (data) setContent(data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (authed) {
    return <Navigate replace to="/home" />;
  }

  if (loading) return <PageSkeleton rails={3} />;

  // Legacy showed one random banner; we take the first CRM-ordered one.
  const heroSlide = content?.hero?.[0] ?? homeFixtures.hero[0];
  const rails = [
    { title: "Trending", items: content?.trending?.length ? content.trending : homeFixtures.becauseYouWatched },
    { title: "Recently Added", items: content?.recentlyAdded?.length ? content.recentlyAdded : homeFixtures.newReleases },
    { title: "Binge Worthy", items: content?.bingeWorthy?.length ? content.bingeWorthy : homeFixtures.onlyOnAfriplay },
  ];

  return (
    <div className="relative overflow-hidden font-primary text-gray-1">
      {/* Desktop hero (md+) ↔ portrait mobile hero (below md) — mirrors HomePage
          so the landing hero matches Home on mobile screens. */}
      <div className="hidden md:block">
        <HeroSection
          slide={heroSlide}
          slideCount={1}
          activeIndex={0}
          onWatchNow={requireAuth}
          onMyStuff={requireAuth}
        />
      </div>
      <div className="md:hidden">
        <MobileHero slide={heroSlide} slideCount={1} activeIndex={0} onWatchNow={requireAuth} onMyStuff={requireAuth} />
      </div>

      <div className="flex flex-col gap-[calc(48/1728*var(--vw))] pl-[calc(53/1728*var(--vw))] py-[calc(64/1728*var(--vw))]">
        {rails.map((rail) => (
          <ContentRail
            key={rail.title}
            title={rail.title}
            items={rail.items}
            gap={23}
            renderItem={(m) => (
              <PosterCard image={m.image} title={m.title} metadata={m.metadata} onClick={requireAuth} />
            )}
          />
        ))}

        <FaqSection />
      </div>
    </div>
  );
};

export default LandingPage;
