import axios from "axios";
import { CLIENT_BASE } from "./authApis";
import { getSelectedOperator, getUserInfo } from "../utils/authConstants";

// Shared Uniqcast Client API helper. Fixes the legacy patterns: token/operator are
// read at CALL time (legacy read the cookie once at module load), and the 401→refresh
// interceptor is registered once globally (see api/refreshToken.js via main.jsx).

// Image ids → URLs (legacy pattern; accessKey is the public one legacy shipped).
const IMAGE_ACCESS_KEY = "WkVjNWNscFhORDBLCg==";
export const imageUrl = (imageId) =>
  imageId == null
    ? null
    : `${CLIENT_BASE}/api/client/v1/global/images/${imageId}?accessKey=${IMAGE_ACCESS_KEY}`;

export const clientContext = () => {
  const userInfo = getUserInfo();
  const { access_token, user_id } = userInfo?.data?.data ?? {};
  const operator = getSelectedOperator();
  return {
    access_token,
    user_id,
    operator_uid: operator?.operator_uid,
    ready: Boolean(access_token && operator),
  };
};

export const clientGet = async (path, params) => {
  const { access_token } = clientContext();
  const res = await axios.get(`${CLIENT_BASE}/api/client/${path}`, {
    params,
    timeout: 20000, // surface hung requests instead of stalling the page load
    headers: { Authorization: `Bearer ${access_token}` },
  });
  return res.data;
};

export const clientPost = async (path, body) => {
  const { access_token } = clientContext();
  const res = await axios.post(`${CLIENT_BASE}/api/client/${path}`, body, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  return res.data;
};

export const clientPut = async (path, body) => {
  const { access_token } = clientContext();
  const res = await axios.put(`${CLIENT_BASE}/api/client/${path}`, body, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  return res.data;
};

export const clientDelete = async (path) => {
  const { access_token } = clientContext();
  const res = await axios.delete(`${CLIENT_BASE}/api/client/${path}`, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  return res.data;
};

// packages → comma string; nearly every content call filters by the user's packages
// (legacy chain, confirmed against MangoTV's shared API). Cached per page-load.
let packagesCache = null;
export const getPackagesString = async () => {
  if (packagesCache) return packagesCache;
  const { operator_uid, user_id } = clientContext();
  const res = await clientGet(`v1/${operator_uid}/users/${user_id}/packages`, {
    device_class: "desktop",
  });
  if (res.status === "ok") {
    packagesCache = res.data.map((p) => p.id).join(",");
    return packagesCache;
  }
  return "";
};
export const clearPackagesCache = () => (packagesCache = null);
