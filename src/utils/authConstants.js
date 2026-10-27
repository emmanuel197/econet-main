import Cookies from "universal-cookie";
import { TOAST } from "./toast";
import { WONA_OPERATOR } from "./operators";

// Ported from legacy src/utils/constants.js. The legacy module read user_info /
// afri_selected_operator ONCE at module load (stale after login/logout); here the
// dynamic values are getter functions instead.
export const COOKIES = new Cookies();
export { TOAST };

export const EMAIL_REGEXP = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const getUserInfo = () => COOKIES.get("user_info");

// Dev-only auth bypass: set VITE_BYPASS_AUTH=true in .env.local (gitignored) to
// treat the session as authenticated — ProtectedRoute lets you through and the
// navbar renders its signed-in state — without logging in. Real auth flows
// (login/OTP/refresh) are untouched. NEVER set this in a deployed environment.
export const AUTH_BYPASS = import.meta.env.VITE_BYPASS_AUTH === "true";
if (AUTH_BYPASS) {
  console.warn("[auth] VITE_BYPASS_AUTH is ON — route protection disabled (dev only)");
}

// Single auth check for gating UI/routes; respects the dev bypass.
export const isAuthenticatedUser = () => AUTH_BYPASS || Boolean(getUserInfo());

// WONA has a single operator, so there is no network to choose: always return it.
// (AfriPlay stored the user's choice from /select-network in localStorage.)
export const getSelectedOperator = () => WONA_OPERATOR;

export const hasSelectedNetwork = () => true;

// CRM API basic-auth credentials (legacy hardcoded these; env overrides supported).
export const CM_AUTH_HEADERS = {
  Username: import.meta.env.VITE_CM_USERNAME || "tva",
  Password: import.meta.env.VITE_CM_PASSWORD || "tva12345#",
};

export const ERROR_MESSAGES = {
  errorOccured: "Oops! An error occurred. Try again",
  AUTH: {
    wrongOTP: "Wrong OTP. Try again",
    invalidMobileNumber: "Invalid Mobile Number",
    invalidEmail: "Invalid Email", // legacy text wrongly said "Invalid Mobile Number"
    invalidPassword: "Password should be a minimum of 7 characters",
    passwordMismatch: "Passwords do not match",
    invalidLogin: "Invalid login credentials",
    invalidAccount: "Account does not exist. Sign up instead",
    tooManyAttempts: "Too many attempts. Try again in",
    existingAccount: "We couldn't sign in to this number. Please try again or contact support.",
  },
  VERIFICATION: {
    invalidNetwork: "Sorry, your number is not on this network. Change network and try again",
  },
};

export const LOG_MESSAGES = {
  login: "logged in",
  logout: "logged out",
  playMovie: "played movie",
  playSeries: "played series",
  search: "searched",
  quit: "quit",
};
