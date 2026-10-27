import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // CRM-configured dashboard rails: [{id, uid, name, items}] — rendered dynamically
  // when present (API mode); the named fixture rails below are the design fallback.
  vodRails: [],
  // Brief's Genre section: VOD categories with branded=true (Mango+ Brands
  // pattern), rendered halfway through the vodRails.
  brandedGenres: [],
  // Brief §6–8: channel categories injected into the VOD listing — the first after
  // the first VOD rail, the second before the last. {id, uid, name, items} | null.
  firstChannelRail: null,
  secondChannelRail: null,
  // Brief §9: promo banner image — a random pick from the banners' preview_image values.
  promoBanner: null,
  promoBannerTitle: "",
  hero: [],
  afriplayShorts: [],
  keepWatching: [],
  becauseYouWatched: [],
  liveOnTvNow: [],
  top10Movies: [],
  genres: [],
  newReleases: [],
  browseLiveChannels: [],
  onlyOnAfriplay: [],

  loaders: { home: true },
  errors: { home: null },
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    fetchHomeBegin: (state) => {
      state.loaders.home = true;
      state.errors.home = null;
    },
    fetchHomeSuccess: (state, action) => {
      const {
        vodRails,
        brandedGenres,
        hero,
        afriplayShorts,
        keepWatching,
        becauseYouWatched,
        liveOnTvNow,
        top10Movies,
        genres,
        newReleases,
        browseLiveChannels,
        onlyOnAfriplay,
        firstChannelRail,
        secondChannelRail,
        promoBanner,
        promoBannerTitle,
      } = action.payload;
      state.vodRails = vodRails ?? state.vodRails;
      state.brandedGenres = brandedGenres ?? state.brandedGenres;
      state.firstChannelRail = firstChannelRail ?? state.firstChannelRail;
      state.secondChannelRail = secondChannelRail ?? state.secondChannelRail;
      state.promoBanner = promoBanner ?? state.promoBanner;
      state.promoBannerTitle = promoBannerTitle ?? state.promoBannerTitle;
      state.hero = hero ?? state.hero;
      state.afriplayShorts = afriplayShorts ?? state.afriplayShorts;
      state.keepWatching = keepWatching ?? state.keepWatching;
      state.becauseYouWatched = becauseYouWatched ?? state.becauseYouWatched;
      state.liveOnTvNow = liveOnTvNow ?? state.liveOnTvNow;
      state.top10Movies = top10Movies ?? state.top10Movies;
      state.genres = genres ?? state.genres;
      state.newReleases = newReleases ?? state.newReleases;
      state.browseLiveChannels = browseLiveChannels ?? state.browseLiveChannels;
      state.onlyOnAfriplay = onlyOnAfriplay ?? state.onlyOnAfriplay;
      state.loaders.home = false;
    },
    fetchHomeError: (state, action) => {
      state.loaders.home = false;
      state.errors.home = action.payload || "Failed to load home content";
    },
    resetHome: () => initialState,
  },
});

export const { fetchHomeBegin, fetchHomeSuccess, fetchHomeError, resetHome } =
  homeSlice.actions;

export const selectHomeRails = (state) => state.home;
export const selectHomeLoading = (state) => state.home.loaders.home;
export const selectHomeError = (state) => state.home.errors.home;

export default homeSlice.reducer;
