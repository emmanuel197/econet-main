import axios from "axios";
import { COOKIES, LOG_MESSAGES, getUserInfo, getSelectedOperator } from "../utils/authConstants";
import { logAPI, logoutAPI, CM_BASE } from "./authApis";
import { clientContext, clientGet, clientDelete } from "./client";

// Ported from legacy src/GLOBAL/redux/account.js (sendLog + logout + clearStorage).
// Legacy read the user_info cookie once at module load — here it's read per call.

export const sendLog = async ({ action, content_type, content_name } = {}) => {
  try {
    const deviceInfo = COOKIES.get("device_info") || {};
    const username = window.localStorage.getItem("afri_username");

    await axios.post(logAPI(), {
      subscriber_uid: username || "anonymous",
      device_id: COOKIES.get("device"),
      device_type: deviceInfo.device?.vendor || "Desktop",
      device_name: deviceInfo.browser?.name || "Unknown",
      platform: deviceInfo.os?.name || "Unknown",
      action: LOG_MESSAGES[action] || action,
      content_type: content_type || "",
      content_name: content_name || "",
      medium: "Web",
    });
  } catch {
    // logging is fire-and-forget — never surface errors (matches legacy)
  }
};

const clearStorage = () => {
  window.localStorage.clear();
  ["user_info", "device_info", "device", "afri_msisdn"].forEach((name) =>
    COOKIES.remove(name, { path: "/" })
  );
  window.location.href = "/";
};

// ---- Profile page (legacy profile.js endpoints; brief silent on profile so
// legacy behaviour carries over per the scope note) ----

const crmContext = () => {
  const { access_token } = clientContext();
  return {
    operator_uid: getSelectedOperator()?.operator_uid,
    subscriber_uid: window.localStorage.getItem("afri_username"),
    headers: { Authorization: `Bearer ${access_token}` },
  };
};

export const getProfile = async () => {
  const { operator_uid, subscriber_uid, headers } = crmContext();
  const res = await axios.get(
    `${CM_BASE}/api/subscriber/?operator_uid=${operator_uid}&subscriber_uid=${subscriber_uid}&limit=30`,
    { headers }
  );
  return res.data?.data?.[0] ?? null;
};

export const updateProfile = async (firstName, lastName) => {
  const { operator_uid, subscriber_uid, headers } = crmContext();
  const res = await axios.put(
    `${CM_BASE}/api/subscriber/?operator_uid=${operator_uid}&subscriber_uid=${subscriber_uid}`,
    { first_name: firstName, last_name: lastName },
    { headers }
  );
  return res.data;
};

export const fetchUserDevices = async () => {
  const { operator_uid, user_id } = clientContext();
  try {
    const res = await clientGet(`v1/${operator_uid}/users/${user_id}/devices`);
    return res.status === "ok" ? res.data : [];
  } catch {
    return [];
  }
};

export const deleteUserDevice = async (deviceId) => {
  const { operator_uid, user_id } = clientContext();
  const res = await clientDelete(`v1/${operator_uid}/users/${user_id}/devices/${deviceId}`);
  return res.status === "ok";
};

export const fetchFaqs = async () => {
  const { operator_uid } = crmContext();
  try {
    const res = await axios.get(
      `${CM_BASE}/api/faq/?operator_uid=${operator_uid}&translation=en&limit=30&offset=0`
    );
    return res.data?.data ?? [];
  } catch {
    return [];
  }
};

export const logout = async () => {
  try {
    const userInfo = getUserInfo();
    const accessToken = userInfo?.data?.data?.access_token;
    if (accessToken) {
      await sendLog({ action: "logout" });
      await axios.post(logoutAPI, {}, { headers: { Authorization: `Bearer ${accessToken}` } });
    }
  } catch {
    // proceed to clear the session regardless (matches legacy finally)
  } finally {
    clearStorage();
  }
};
