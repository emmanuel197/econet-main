import axios from "axios";
import {
  COOKIES,
  EMAIL_REGEXP,
  ERROR_MESSAGES,
  TOAST,
  CM_AUTH_HEADERS,
  getSelectedOperator,
  getUserInfo,
} from "../utils/authConstants";
import {
  generateOTPAPI,
  loginAPI,
  loginV2API,
  signUpAPI,
  validateOTPAPI,
  networkAuthAPI,
  resetPasswordAPI,
} from "./authApis";
import { sendLog } from "./account";
import { setDeviceInCookies } from "../utils/setDeviceInCookies";
import { consumePostLoginDestination } from "../utils/navigationHelpers";
import { isAuthenticatedReducer, isLoadingReducer } from "../store/slice/authSlice";
import store from "../store/store";

// Ported from legacy src/GLOBAL/redux/auth.js. Flows kept 1:1 (network verify →
// OTP → signup/login on Uniqcast); operator/user reads made call-time instead of
// module-load, and toasts use the local toast util instead of wc-toast.

// Every account uses this single default password. Users never enter, set, or
// change a password: sign-up/sign-in collect only the mobile number, an OTP
// verifies it, and the backend's still-required password field is always this
// constant. Same approach as MangoTV and GloTV (DEFAULT_PASSWORD in their auth.js).
const DEFAULT_PASSWORD = "1234567";

const _verifyMSISDN = (mobileNumber) => {
  const storedMSISDN = COOKIES.get("afri_msisdn");
  if (!storedMSISDN || storedMSISDN !== mobileNumber) {
    COOKIES.set("afri_msisdn", mobileNumber, { path: "/" });
    return false;
  }
  return true;
};

const _verifyEmail = (email) => EMAIL_REGEXP.test(email);

const prefixedMobileNumber = (mobileNumber) => {
  const operator = getSelectedOperator();
  return operator.username_prefix + mobileNumber;
};

const validateUserData = (isPhoneNumber, mobileNumber, email, password, rePassword) => {
  if (!isPhoneNumber) {
    // NOTE: legacy inverted this check (toasted when the email WAS valid) — fixed.
    if (!_verifyEmail(email)) {
      store.dispatch(isLoadingReducer(false));
      TOAST.error(ERROR_MESSAGES.AUTH.invalidEmail);
      return false;
    }
  } else if (mobileNumber && mobileNumber.length < 10) {
    store.dispatch(isLoadingReducer(false));
    TOAST.error(ERROR_MESSAGES.AUTH.invalidMobileNumber);
    return false;
  } else {
    if (password && password.length < 7) {
      store.dispatch(isLoadingReducer(false));
      TOAST.error(ERROR_MESSAGES.AUTH.invalidPassword);
      return false;
    } else if (rePassword && password !== rePassword) {
      store.dispatch(isLoadingReducer(false));
      TOAST.error(ERROR_MESSAGES.AUTH.passwordMismatch);
      return false;
    }
  }
  return true;
};

// Verify the number belongs to the selected operator's network via the CRM auth API.
const verifyNetwork = async () => {
  const operator = getSelectedOperator();
  const username = window.localStorage.getItem("afri_username");
  const url = networkAuthAPI(operator.operator_uid, username);
  const res = await axios.get(url, {
    headers: CM_AUTH_HEADERS,
  });

  if (res.data.status === "ok") {
    if (!res.data.valid) {
      TOAST.error(ERROR_MESSAGES.VERIFICATION.invalidNetwork);
      return false;
    }
    return true;
  }
  TOAST.error(ERROR_MESSAGES.errorOccured);
  return false;
};

// Sign-up entry: validate → network check → OTP → /otp-verification.
export const verifyUserData = async (isPhoneNumber, mobileNumber, email, navigate) => {
  const user_info = getUserInfo();

  // Validate the identifier only — no password is collected anymore.
  if (!validateUserData(isPhoneNumber, mobileNumber, email)) return;

  window.localStorage.setItem("afri_email", email);
  window.localStorage.setItem("afri_mobile_number", mobileNumber);
  window.localStorage.setItem("afri_username", prefixedMobileNumber(mobileNumber));

  try {
    if (!(await verifyNetwork())) return;
  } catch {
    TOAST.error(ERROR_MESSAGES.errorOccured);
    return;
  }

  if (!user_info || !_verifyMSISDN(mobileNumber)) {
    await generateOTP(mobileNumber);
    navigate("/otp-verification", { state: { isSignUp: true } });
    return;
  }

  window.location.href = consumePostLoginDestination();
};

// Sign-in entry: validate → network check → OTP → /otp-verification.
export const initiateLoginWithOTP = async (isPhoneNumber, mobileNumber, email, navigate) => {
  // Validate the identifier only — no password is collected anymore.
  if (!validateUserData(isPhoneNumber, mobileNumber, email)) return;

  window.localStorage.setItem("afri_mobile_number", mobileNumber);
  window.localStorage.setItem("afri_username", prefixedMobileNumber(mobileNumber));

  try {
    if (!(await verifyNetwork())) return;
    await generateOTP(mobileNumber);
    navigate("/otp-verification", { state: { isSignUp: false } });
  } catch {
    TOAST.error(ERROR_MESSAGES.errorOccured);
  }
};

export const generateOTP = async (mobileNumber) => {
  try {
    const res = await axios.post(generateOTPAPI(), { mobile_number: mobileNumber });
  } catch (e) {
    console.error("[auth] generateOTP — failed:", e.response?.data || e.message);
    TOAST.error(ERROR_MESSAGES.errorOccured);
  }
};

const validateOTP = async (mobileNumber, OTPCode) => {
  if (!OTPCode || OTPCode.length < 6) {
    TOAST.error(ERROR_MESSAGES.AUTH.wrongOTP);
    return null;
  }
  try {
    const OTP = await axios.post(validateOTPAPI(), {
      mobile_number: mobileNumber,
      otp: OTPCode,
    });
    return OTP.data;
  } catch (e) {
    console.error("[auth] validateOTP — failed:", e.response?.data || e.message);
    TOAST.error(e.response?.data?.message || ERROR_MESSAGES.AUTH.wrongOTP);
    return null;
  }
};

// Sign-up OTP: validate OTP → create subscriber → login.
export const verifyOTP = async (isPhoneNumber, OTPCode) => {
  const username = window.localStorage.getItem("afri_username");
  const mobileNumber = window.localStorage.getItem("afri_mobile_number");
  const email = window.localStorage.getItem("afri_email");

  const OTP = await validateOTP(mobileNumber, OTPCode);
  if (!OTP) return;

  if (OTP.status === "error") {
    TOAST.error(OTP.message || OTP.data?.message || ERROR_MESSAGES.AUTH.wrongOTP);
    return;
  }

  if (OTP.status === "ok") {
    store.dispatch(isLoadingReducer(true));

    let signupResponse;
    try {
      signupResponse = await axios.post(signUpAPI(), {
        first_name: "Afri",
        last_name: "Play",
        email: email,
        phone_number: mobileNumber,
        password: DEFAULT_PASSWORD,
        username: username,
      });
    } catch (e) {
      // Was unguarded: a failed signup request threw out of the click handler and
      // left the Done button stuck on "Verifying…".
      console.error("[auth] signup — failed:", e.response?.data || e.message);
      store.dispatch(isLoadingReducer(false));
      TOAST.error(e.response?.data?.message || ERROR_MESSAGES.errorOccured);
      return;
    }

    if (signupResponse.data.message === "subscriber already exist") {
      // The number is registered already — log straight in with the default
      // password (LoginUnicast resets the account to it first). A 3010 here
      // means that reset didn't take, so LoginUnicast says so instead of the
      // bare backend verdict.
      const success = await LoginUnicast(true, mobileNumber, email, DEFAULT_PASSWORD, { existingAccount: true });
      if (success) window.location.href = consumePostLoginDestination();
      return;
    }

    if (signupResponse.data.status === "error") {
      store.dispatch(isLoadingReducer(false));
      TOAST.error(`Oops! ${signupResponse.data.message}. Try again`);
      return;
    }

    if (signupResponse.data.status === "ok") {
      const success = await LoginUnicast(true, mobileNumber, email, DEFAULT_PASSWORD);
      if (success) window.location.href = consumePostLoginDestination();
    }
  }
};

// Sign-in OTP: validate OTP → login (no subscriber creation).
export const verifySignInOTP = async (isPhoneNumber, OTPCode) => {
  const mobileNumber = window.localStorage.getItem("afri_mobile_number");
  const email = window.localStorage.getItem("afri_email");

  const OTP = await validateOTP(mobileNumber, OTPCode);
  if (!OTP) return;

  if (OTP.status === "error") {
    TOAST.error(OTP.message || OTP.data?.message || ERROR_MESSAGES.AUTH.wrongOTP);
    return;
  }

  if (OTP.status === "ok") {
    // OTP verified — log in with the default password (LoginUnicast resets the
    // account to it first). existingAccount gives a 3010 a clearer message.
    const success = await LoginUnicast(true, mobileNumber, email, DEFAULT_PASSWORD, { existingAccount: true });
    if (success) window.location.href = consumePostLoginDestination();
  }
};

// Client API error bodies: { code, status: "error", data: { message, timeout? } }.
// 4290 = rate-locked (V2 only — V1 reports the same lock as a bare 3010, which is the
// whole reason V2 goes first). Verified live 2026-09-15: a bad login is 3010 on both
// versions ("Invalid Credentials" on V2, "invalid login credentials" on V1).
const loginErrorMessage = (body, { existingAccount = false } = {}) => {
  if (body?.code === 4290 || body?.data?.timeout) {
    const until = Number(body.data?.timeout ?? body.data?.details?.timeout);
    const minutes = Math.max(1, Math.ceil((until - Math.floor(Date.now() / 1000)) / 60));
    return `${ERROR_MESSAGES.AUTH.tooManyAttempts} ${minutes} minute${minutes === 1 ? "" : "s"}`;
  }
  if (existingAccount && body?.code === 3010) return ERROR_MESSAGES.AUTH.existingAccount;
  const message = body?.data?.message || body?.message;
  if (typeof message === "string" && message.trim() && !/^invalid body/i.test(message)) {
    return message.charAt(0).toUpperCase() + message.slice(1);
  }
  return ERROR_MESSAGES.AUTH.invalidLogin;
};

// PUT the shared default password onto an existing CRM subscriber (the same
// endpoint the old reset-password flow used). Never blocks login: a failure is
// logged and the login attempt goes ahead.
const resetToDefaultPassword = async (operatorUid, subscriberUid) => {
  try {
    const res = await axios.put(
      resetPasswordAPI(operatorUid, encodeURIComponent(subscriberUid)),
      { password: DEFAULT_PASSWORD },
      { headers: CM_AUTH_HEADERS }
    );
    if (res.data?.message !== "subscriber account updated" && res.data?.status !== "ok") {
      console.warn("[auth] default-password reset not applied:", res.data);
    }
  } catch (e) {
    console.warn("[auth] default-password reset failed:", e.response?.data || e.message);
  }
};

// Uniqcast Client API login; stores the whole axios response in the user_info cookie
// (legacy shape — downstream reads user_info.data.data.{access_token,refresh_token,user_id};
// V2's data carries the same keys, so that shape is unchanged).
//
// Ported from GloTV's fix for the identical "invalid login credentials after OTP"
// report (glotv-main commit 41811e3): the generic 3010 toast was hiding the real
// verdict — most often a rate lock that only V2 reports as such (4290 + unlock time),
// or a stale network choice (see hasSelectedNetwork in utils/authConstants.js).
export const LoginUnicast = async (isPhoneNumber, mobileNumber, email, password, { existingAccount = false } = {}) => {
  store.dispatch(isLoadingReducer(true));
  if (!validateUserData(isPhoneNumber, mobileNumber, email, password)) return;

  window.localStorage.setItem("afri_username", prefixedMobileNumber(mobileNumber));
  const username = window.localStorage.getItem("afri_username");
  const selectedOperator = getSelectedOperator();
  const formattedOperator = `${username}@${selectedOperator.operator_uid}`;

  // Accounts created before passwordless sign-in still have the password the
  // user chose back then, so the default-password login below would fail for
  // them. Callers reach here only after the OTP has proved the user owns this
  // number, so reset the CRM password to the default first. Harmless for
  // accounts already on it.
  if (password === DEFAULT_PASSWORD) {
    await resetToDefaultPassword(selectedOperator.operator_uid, username);
  }

  // V1 rejects a body without `device` outright (3011 "login credentials not
  // provided") — guarantee the cookie exists even when the user reached this step
  // without passing through a page that sets it. Idempotent.
  setDeviceInCookies();
  const deviceInfoCookie = COOKIES.get("device_info") || {};
  const credentials = {
    username: formattedOperator,
    password: password,
    device: COOKIES.get("device"),
    device_class: deviceInfoCookie.device?.type || "Desktop",
    device_type: deviceInfoCookie.device?.vendor || "Desktop",
    device_os: deviceInfoCookie.os?.name || "Windows",
  };

  try {
    let loginResponse;
    let version = "v2";
    try {
      loginResponse = await axios.post(loginV2API, { login_type: "Credentials", ...credentials });
    } catch (v2Error) {
      // A 4xx from V2 is the real verdict (wrong password, rate limit, blocked
      // account) — retrying it on V1 only replaces the backend's message with a less
      // specific one. Only a transport failure, a 5xx or a missing endpoint justifies
      // the V1 fallback.
      const status = v2Error.response?.status;
      if (status && status < 500 && status !== 404) throw v2Error;
      console.warn("[auth] Login V2 unavailable, falling back to V1:", v2Error.message);
      version = "v1";
      loginResponse = await axios.post(loginAPI, credentials);
    }

    if (loginResponse.data.status === "ok") {
      COOKIES.set("user_info", loginResponse, { path: "/" });
      // refresh_token() renews on the version that issued the tokens.
      window.localStorage.setItem("afri_auth_version", version);
      await sendLog({ action: "login" }).catch(() => {});
      store.dispatch(isAuthenticatedReducer(true));
      store.dispatch(isLoadingReducer(false));
      return true;
    }

    // A 200 with status !== "ok" used to fall through silently and leave the button
    // stuck on "Verifying…".
    console.error("[auth] LoginUnicast — rejected:", loginResponse.data);
    store.dispatch(isLoadingReducer(false));
    TOAST.error(loginErrorMessage(loginResponse.data, { existingAccount }));
  } catch (e) {
    const err = e.response?.data;
    console.error("[auth] LoginUnicast — failed:", err || e.message);
    store.dispatch(isLoadingReducer(false));
    TOAST.error(loginErrorMessage(err, { existingAccount }));
  }
};

// The forgot-password / reset-password flow (fetchUserAccount,
// validateUserAccount, verifyResetOTP, resetPassword) was removed: every
// account uses the single DEFAULT_PASSWORD and users can't change it, so there
// is nothing to reset.
