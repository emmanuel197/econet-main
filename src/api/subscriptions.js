import axios from "axios";
import { CM_BASE } from "./authApis";
import { TOAST, ERROR_MESSAGES, CM_AUTH_HEADERS, getSelectedOperator } from "../utils/authConstants";
import { checkActiveSubscription } from "../utils/activeSubs";
import { BILLING_ENABLED } from "../utils/devFlags";
import {
  fetchPackageReducer,
  paymentInitiatedReducer,
  purchaseHistoryReducer,
  premiumSubReducer,
  subscriptionModalReducer,
} from "../store/slice/subscriptionSlice";
import store from "../store/store";

// Ported from legacy src/GLOBAL/redux/subscriptionApis.js. Purchases use telco /
// redirect billing on the CRM API: the purchase POST returns a redirect_url where
// payment is confirmed — there is no client-side status polling. Entitlement is
// re-derived by re-fetching the order history (premiumSub).

const SUBSCRIPTION_ERRORS = {
  subscriptionFailed: "Sorry, your subscription failed. Try again",
  subscriptionCancel: "Sorry, your cancellation failed. Try again",
};

export const purchasePackage = async (product_id, subscriber_uid, email) => {
  const operator_uid = getSelectedOperator().operator_uid;
  store.dispatch(fetchPackageReducer(true));

  try {
    const response = await axios.post(
      `${CM_BASE}/api/purchase/?operator_uid=${operator_uid}`,
      {
        subscriber_uid,
        subscription_type: "one-off",
        email,
        bill: BILLING_ENABLED, // VITE_BILLING=false → test order, no real charge
        product_id,
        medium: "web",
      },
      { headers: { Password: CM_AUTH_HEADERS.Password, "Content-Type": "application/json" } }
    );

    if (response.data.status === "ok") {
      store.dispatch(paymentInitiatedReducer(response.data.payment_status));
      // Billing confirmation happens on the operator's page (legacy behaviour).
      window.location.href = response.data.redirect_url || "/home";
      return;
    }
    TOAST.error(SUBSCRIPTION_ERRORS.subscriptionFailed);
  } catch {
    TOAST.error(SUBSCRIPTION_ERRORS.subscriptionFailed);
  } finally {
    store.dispatch(fetchPackageReducer(false));
  }
};

// Legacy cancels with two sequential purchase calls: method=delete then method=update.
export const cancelSubscription = async (product_id) => {
  const operator_uid = getSelectedOperator().operator_uid;
  const subscriber_uid = window.localStorage.getItem("afri_username");
  const body = { subscriber_uid, product_id, medium: "web" };
  const headers = { Password: CM_AUTH_HEADERS.Password, "Content-Type": "application/json" };
  store.dispatch(fetchPackageReducer(true));

  try {
    await axios.post(`${CM_BASE}/api/purchase/?operator_uid=${operator_uid}&method=delete`, body, { headers });
    await axios.post(`${CM_BASE}/api/purchase/?operator_uid=${operator_uid}&method=update`, body, { headers });
    store.dispatch(subscriptionModalReducer({ isOpen: false }));
    window.location.href = "/home";
  } catch {
    TOAST.error(SUBSCRIPTION_ERRORS.subscriptionCancel);
  } finally {
    store.dispatch(fetchPackageReducer(false));
  }
};

// Order history; status "Active" narrows to running subscriptions. Also refreshes
// the premiumSub entitlement flag (used to gate playback).
export const fetchPurchaseHistory = async (dispatch, active = "") => {
  const operator_uid = getSelectedOperator().operator_uid;
  const subscriber_uid = window.localStorage.getItem("afri_username");
  dispatch(fetchPackageReducer(true));

  try {
    const response = await axios.get(
      `${CM_BASE}/api/orders/?operator_uid=${operator_uid}&subscriber_uid=${subscriber_uid}&limit=30&status=${active}`,
      { headers: { Password: CM_AUTH_HEADERS.Password } }
    );

    if (response.data.status === "ok") {
      dispatch(purchaseHistoryReducer(response.data.data));
      dispatch(premiumSubReducer(checkActiveSubscription(response.data.data)));
    }
  } catch {
    TOAST.error(ERROR_MESSAGES.errorOccured);
  } finally {
    dispatch(fetchPackageReducer(false));
  }
};
