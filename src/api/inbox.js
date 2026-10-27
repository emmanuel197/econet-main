import axios from "axios";
import store from "../store/store";
import { CM_BASE } from "./authApis";
import {
  fetchInboxBegin,
  fetchInboxSuccess,
  fetchInboxError,
  messageRead,
  messageDeleted,
} from "../store/slice/inboxSlice";
import { getSelectedOperator } from "../utils/authConstants";

/**
 * Inbox — notifications sent to the subscriber from CRM (API brief "Inbox").
 * Fetch shape verified against legacy afriplay-ghana-main (redux/account.js
 * initGetMessages): bare GET, no auth header, keyed by operator + subscriber uid.
 * Rows: {id, title, message, date, time, notification_status: "read"|...}.
 */

const inboxParams = () => ({
  operator_uid: getSelectedOperator()?.operator_uid,
  subscriber_uid: window.localStorage.getItem("afri_username"),
});

export const fetchInbox = async () => {
  const dispatch = store.dispatch;
  const { operator_uid, subscriber_uid } = inboxParams();
  if (!operator_uid || !subscriber_uid) return false; // signed out — no inbox

  dispatch(fetchInboxBegin());
  try {
    const res = await axios.get(`${CM_BASE}/api/inbox/`, {
      params: { operator_uid, subscriber_uid },
    });
    dispatch(fetchInboxSuccess(res.data?.data || []));
    return true;
  } catch (e) {
    console.error("[api] fetchInbox failed:", e.response?.status, e.response?.data || e.message);
    dispatch(fetchInboxError(e.message));
    return false;
  }
};

// ⚠ UNVERIFIED against the CRM Postman collection (brief lists Read/Delete ops
// but legacy never called them). Assumed REST-ish forms on the same resource;
// optimistic local update either way so the UI is correct even if the call 404s.
export const markNotificationRead = async (id) => {
  store.dispatch(messageRead(id));
  try {
    await axios.put(`${CM_BASE}/api/inbox/`, null, {
      params: { ...inboxParams(), notification_id: id, mode: "read" },
    });
  } catch (e) {
    console.warn("[api] markNotificationRead (unverified endpoint) failed:", e.response?.status);
  }
};

export const deleteNotification = async (id) => {
  store.dispatch(messageDeleted(id));
  try {
    await axios.delete(`${CM_BASE}/api/inbox/`, {
      params: { ...inboxParams(), notification_id: id },
    });
  } catch (e) {
    console.warn("[api] deleteNotification (unverified endpoint) failed:", e.response?.status);
  }
};
