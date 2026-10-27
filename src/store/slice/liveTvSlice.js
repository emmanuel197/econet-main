import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Category tab labels (with the implicit "All" first) — from categories/channels.
  categories: [],
  scheduleDate: "",
  featuredProgram: null,
  // Chronological schedule rows: {id, time, category, title, channel, logo, when}.
  onAirToday: [],
  // Live-now channel cards: {id, uid, logo, channel, category, title, next, progress}.
  liveChannels: [],
  liveChannelsTotal: 0,

  loaders: { liveTv: true },
  errors: { liveTv: null },
};

const liveTvSlice = createSlice({
  name: "liveTv",
  initialState,
  reducers: {
    fetchLiveTvBegin: (state) => {
      state.loaders.liveTv = true;
      state.errors.liveTv = null;
    },
    fetchLiveTvSuccess: (state, action) => {
      const { categories, scheduleDate, featuredProgram, onAirToday, liveChannels, liveChannelsTotal } =
        action.payload;
      state.categories = categories ?? state.categories;
      state.scheduleDate = scheduleDate ?? state.scheduleDate;
      state.featuredProgram = featuredProgram ?? state.featuredProgram;
      state.onAirToday = onAirToday ?? state.onAirToday;
      state.liveChannels = liveChannels ?? state.liveChannels;
      state.liveChannelsTotal = liveChannelsTotal ?? state.liveChannelsTotal;
      state.loaders.liveTv = false;
    },
    fetchLiveTvError: (state, action) => {
      state.loaders.liveTv = false;
      state.errors.liveTv = action.payload || "Failed to load live TV";
    },
    resetLiveTv: () => initialState,
  },
});

export const { fetchLiveTvBegin, fetchLiveTvSuccess, fetchLiveTvError, resetLiveTv } =
  liveTvSlice.actions;

export const selectLiveTv = (state) => state.liveTv;
export const selectLiveTvLoading = (state) => state.liveTv.loaders.liveTv;
export const selectLiveTvError = (state) => state.liveTv.errors.liveTv;

export default liveTvSlice.reducer;
