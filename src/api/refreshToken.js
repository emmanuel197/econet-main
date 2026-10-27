import axios from "axios";
import { COOKIES, getUserInfo } from "../utils/authConstants";
import { refreshAPI, refreshV2API } from "./authApis";

// Ported from legacy src/GLOBAL/constants/refreshToken.js + utils/interceptResponse.js.
// Legacy registered a new axios interceptor per thunk call (they stacked up); here a
// single global 401→refresh interceptor is registered once at app boot (see main.jsx).

let inFlight = null;

export const refresh_token = async () => {
  if (inFlight) return inFlight;
  const userInfo = getUserInfo();
  const refreshToken = userInfo?.data?.data?.refresh_token;
  if (!refreshToken) return;

  // Renew on the API version that issued the tokens (LoginUnicast records it).
  // Sessions from before that marker existed are V1 sessions.
  const url = window.localStorage.getItem("afri_auth_version") === "v2" ? refreshV2API : refreshAPI;

  inFlight = (async () => {
    try {
      const result = await axios.post(url, { refresh_token: refreshToken });
      COOKIES.set("user_info", result, { path: "/" });
      window.location.reload();
    } catch (e) {
      // A dead refresh token would otherwise 401 → refresh → 401 forever. Drop the
      // session so the next protected route sends the user to sign in instead.
      console.error("[auth] refresh_token — failed:", e.response?.data || e.message);
      COOKIES.remove("user_info", { path: "/" });
      window.localStorage.removeItem("afri_auth_version");
    } finally {
      inFlight = null;
    }
  })();
  return inFlight;
};

let registered = false;
export const setupAuthInterceptor = () => {
  if (registered) return;
  registered = true;
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const url = error.config?.url || "";
      // A 401 from the refresh (or login) call itself is not "token expired" — never
      // re-enter the refresh from those, or the interceptor recurses.
      if (error.response?.status === 401 && getUserInfo() && !/\/global\/(refresh|login)/.test(url)) {
        refresh_token();
      }
      return Promise.reject(error);
    }
  );
};
