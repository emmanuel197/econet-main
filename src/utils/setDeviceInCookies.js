import { v4 as uuidv4 } from "uuid";
import { UAParser } from "ua-parser-js";
import { COOKIES } from "./authConstants";

// Ported from legacy src/GLOBAL/constants/setDeviceInCookies.js.
// Legacy set the "device" cookie without a path but removed it with path "/"
// on logout (orphaning it) — fixed here by always using path "/".
export const setDeviceInCookies = () => {
  const parser = new UAParser();

  if (!COOKIES.get("device")) {
    COOKIES.set("device", uuidv4(), { path: "/" });
  }
  COOKIES.set("device_info", parser.getResult(), { path: "/" });
};
