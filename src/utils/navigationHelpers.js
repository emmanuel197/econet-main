import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { isAuthenticatedUser, getSelectedOperator } from "./authConstants";
import { redirectReducer } from "../store/slice/authSlice";

// Ported from legacy navigationHelpers.js: navigate to a page if signed in,
// otherwise remember the destination and send the user into the auth flow.
// (Legacy also dispatched selectedMovieReducer — that slice doesn't exist here yet.)
//
// Edge case legacy missed: it always went straight to /signin, whose mount effect
// then bounced to /select-network when no operator was chosen — a visible flash.
// We route directly: no operator → /select-network (which continues to /signin via
// location.state.from), operator chosen → /signin.
export const useHandleNavigation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (page) => {
    if (isAuthenticatedUser()) {
      navigate(page);
      return;
    }
    dispatch(redirectReducer(page));
    if (!getSelectedOperator()) {
      navigate("/select-network", { state: { from: "/signin" } });
    } else {
      navigate("/signin");
    }
  };
};

// Where to land after a successful login. Consumes (reads + clears) the intent
// saved by useHandleNavigation — legacy stored "redirectTo" but never read it,
// so every login hard-landed on "/". Sanitized to same-origin app paths so a
// tampered localStorage value can't redirect off-site ("//evil.com" style), and
// auth pages are excluded so a stale intent can't bounce a fresh login back
// into the auth flow.
const AUTH_PATHS = ["/signin", "/signup", "/select-network", "/otp-verification", "/reset-password", "/out-of-region"];
export const consumePostLoginDestination = () => {
  let dest = null;
  try {
    dest = JSON.parse(window.localStorage.getItem("redirectTo"));
  } catch {
    dest = null;
  }
  window.localStorage.removeItem("redirectTo");
  if (
    typeof dest !== "string" ||
    !dest.startsWith("/") ||
    dest.startsWith("//") ||
    AUTH_PATHS.some((p) => dest === p || dest.startsWith(`${p}?`))
  ) {
    return "/";
  }
  return dest;
};
