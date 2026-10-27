import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [], // rail categories ("For You", "Trending", …) from Rails Categories V3
  shortsForYou: [],
  forYouGrid: [],
  liveReelPreview: null,
  trendingNow: [],

  // Full reel records, indexed by id — the /shorts/:id route looks up by id
  // and the up/down nav iterates this array.
  reels: [],

  loaders: { shorts: true },
  errors: { shorts: null },
};

const shortsSlice = createSlice({
  name: "shorts",
  initialState,
  reducers: {
    fetchShortsBegin: (state) => {
      state.loaders.shorts = true;
      state.errors.shorts = null;
    },
    fetchShortsSuccess: (state, action) => {
      const { categories, shortsForYou, forYouGrid, liveReelPreview, trendingNow, reels } = action.payload;
      state.categories = categories ?? state.categories;
      state.shortsForYou = shortsForYou ?? state.shortsForYou;
      state.forYouGrid = forYouGrid ?? state.forYouGrid;
      state.liveReelPreview = liveReelPreview ?? state.liveReelPreview;
      state.trendingNow = trendingNow ?? state.trendingNow;
      state.reels = reels ?? state.reels;
      state.loaders.shorts = false;
    },
    fetchShortsError: (state, action) => {
      state.loaders.shorts = false;
      state.errors.shorts = action.payload || "Failed to load shorts content";
    },
    resetShorts: () => initialState,
  },
});

export const { fetchShortsBegin, fetchShortsSuccess, fetchShortsError, resetShorts } =
  shortsSlice.actions;

export const selectShorts = (state) => state.shorts;
export const selectShortsLoading = (state) => state.shorts.loaders.shorts;
export const selectShortsError = (state) => state.shorts.errors.shorts;
export const selectReelById = (id) => (state) =>
  state.shorts.reels.find((r) => r.id === id) ?? null;

export default shortsSlice.reducer;
