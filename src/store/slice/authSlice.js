import { createSlice } from "@reduxjs/toolkit";

// Ported from legacy src/GLOBAL/redux/slice/authSlice.js (same state shape/actions;
// mirrored to localStorage for reload persistence, as legacy did).
const authSlice = createSlice({
  name: "auth",

  initialState: {
    isAuthenticated: false,
    redirectTo: null,
    isValid: false,
    isLoading: false,
  },

  reducers: {
    isValidReducer: (state, action) => {
      state.isValid = action.payload;
    },
    isLoadingReducer: (state, action) => {
      state.isLoading = action.payload;
    },
    isAuthenticatedReducer: (state, action) => {
      state.isAuthenticated = action.payload;
      window.localStorage.setItem("isAuthenticated", JSON.stringify(action.payload));
    },
    redirectReducer: (state, action) => {
      state.redirectTo = action.payload;
      window.localStorage.setItem("redirectTo", JSON.stringify(action.payload));
    },
  },
});

export default authSlice.reducer;
export const { isValidReducer, isLoadingReducer, isAuthenticatedReducer, redirectReducer } =
  authSlice.actions;

export const selectAuth = (state) => state.auth;
