import { createSlice } from "@reduxjs/toolkit";

// Movies page (legacy movies.js flow): genre tabs + all-category rails + a
// full movie list for the genre-filtered grid.
const initialState = {
  genres: [], // [{id, uid, name}] from v1/{ouid}/genres
  rails: [], // [{id, uid, name, isTop10, items}] — ALL VOD categories (brief)
  allMovies: [], // toCard'd user movies, raw.genres ids power the genre grid

  loaders: { movies: true },
  errors: { movies: null },
};

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    fetchMoviesPageBegin: (state) => {
      state.loaders.movies = true;
      state.errors.movies = null;
    },
    fetchMoviesPageSuccess: (state, action) => {
      const { genres, rails, allMovies } = action.payload;
      state.genres = genres ?? state.genres;
      state.rails = rails ?? state.rails;
      state.allMovies = allMovies ?? state.allMovies;
      state.loaders.movies = false;
    },
    fetchMoviesPageError: (state, action) => {
      state.loaders.movies = false;
      state.errors.movies = action.payload || "Failed to load movies";
    },
    resetMoviesPage: () => initialState,
  },
});

export const {
  fetchMoviesPageBegin,
  fetchMoviesPageSuccess,
  fetchMoviesPageError,
  resetMoviesPage,
} = moviesSlice.actions;

export const selectMoviesPage = (state) => state.movies;
export const selectMoviesPageLoading = (state) => state.movies.loaders.movies;

export default moviesSlice.reducer;
