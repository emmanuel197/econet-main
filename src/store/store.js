import { configureStore } from "@reduxjs/toolkit";
import homeReducer from "./slice/homeSlice";
import shortsReducer from "./slice/shortsSlice";
import authReducer from "./slice/authSlice";
import subscriptionReducer from "./slice/subscriptionSlice";
import liveTvReducer from "./slice/liveTvSlice";
import moviesReducer from "./slice/moviesSlice";
import inboxReducer from "./slice/inboxSlice";

const store = configureStore({
  reducer: {
    home: homeReducer,
    shorts: shortsReducer,
    auth: authReducer,
    subscriptions: subscriptionReducer,
    liveTv: liveTvReducer,
    movies: moviesReducer,
    inbox: inboxReducer,
  },
});

export default store;
