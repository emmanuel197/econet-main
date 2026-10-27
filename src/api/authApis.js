import { getSelectedOperator } from "../utils/authConstants";
import { WONA_OPERATOR } from "../utils/operators";

// Ported from legacy src/GLOBAL/constants/apis.js. All CRM endpoints are scoped to
// the operator chosen on /select-network (localStorage "afri_selected_operator").
export const CM_BASE = "https://tvanywhereonline.com/cm";
export const CLIENT_BASE = "https://ott.tvanywhereafrica.com:28182";

export const generateOTPAPI = () =>
  `${CM_BASE}/api/otp/?operator_uid=${getSelectedOperator().operator_uid}&mode=generate`;

export const validateOTPAPI = () =>
  `${CM_BASE}/api/otp/?operator_uid=${getSelectedOperator().operator_uid}&mode=validate`;

export const signUpAPI = () =>
  `${CM_BASE}/api/subscriber/?operator_uid=${getSelectedOperator().operator_uid}`;

export const loginAPI = `${CLIENT_BASE}/api/client/v1/global/login`;
// Client API v6.5.1 (V2) on the same host. V2 is the primary login: V1 reports a
// rate-locked account as a bare 3010 "invalid login credentials" even for the right
// password, while V2 answers 429/4290 with the unlock time. Verified live 2026-09-15
// (curl against this host): both endpoints exist; a bad login is 3010 on each.
export const loginV2API = `${CLIENT_BASE}/api/client/v2/global/login`;
export const logoutAPI = `${CLIENT_BASE}/api/client/v1/global/logout`;
export const refreshAPI = `${CLIENT_BASE}/api/client/v1/global/refresh`;
export const refreshV2API = `${CLIENT_BASE}/api/client/v2/global/refresh`;

export const networkAuthAPI = (operatorUid, username) =>
  `${CM_BASE}/api/auth/?operator_uid=${operatorUid}&usr=${username}`;

export const logAPI = () => {
  const operator = getSelectedOperator();
  return `${CM_BASE}/api/logs/?operator_uid=${
    operator ? operator.operator_uid : WONA_OPERATOR.operator_uid
  }`;
};

export const fetchUserAPI = () => `${CM_BASE}/api/subscriber/?limit=30`;

export const resetPasswordAPI = (operatorUid, subscriberUid) =>
  `${CM_BASE}/api/subscriber/?operator_uid=${operatorUid}&subscriber_uid=${subscriberUid}`;
