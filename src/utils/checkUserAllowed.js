import axios from "axios";
import { CM_AUTH_HEADERS } from "./authConstants";

// Ported from legacy src/utils/checkUserAllowed.js — geo/region gate run on auth pages.
// Redirects out-of-region visitors. Errors also redirect, matching legacy behaviour.
const checkUserAllowed = async () => {
  try {
    const res = await axios.get("https://tvanywhereonline.com/cm/api/auth/", {
      headers: CM_AUTH_HEADERS,
    });
    if (!res.data.valid) {
      window.location.replace("/out-of-region");
    }
  } catch {
    window.location.replace("/out-of-region");
  }
};

export default checkUserAllowed;
