import { createSlice } from "@reduxjs/toolkit";

// Ported from legacy src/GLOBAL/redux/slice/subscriptionSlice.js (slice name kept
// as "fetchPackages" only in spirit — registered here as state.subscriptions).
// premiumSub is the cached entitlement flag, mirrored to localStorage.
const readPremiumSub = () => {
  try {
    return JSON.parse(window.localStorage.getItem("premiumSub")) || false;
  } catch {
    return false;
  }
};

const subscriptionSlice = createSlice({
  name: "subscriptions",

  initialState: {
    isLoading: false,
    modalOpen: false,
    productId: null,
    productName: null,
    productPrice: null,
    currency: "GHS",
    hasSubscriptionTypes: false,
    isMTN: false,
    paymentInitiated: false,
    purchaseHistory: [],
    activeSubscription: false,
    premiumSub: readPremiumSub(),
  },

  reducers: {
    fetchPackageReducer: (state, action) => {
      state.isLoading = action.payload;
    },
    subscriptionModalReducer: (state, action) => {
      const { isOpen, productId, productName, productPrice, currency, hasSubscriptionTypes, isMTN } =
        action.payload;
      state.modalOpen = isOpen;
      if (isOpen) {
        state.productId = productId ?? null;
        state.productName = productName ?? null;
        state.productPrice = productPrice ?? null;
        state.currency = currency ?? "GHS";
        state.hasSubscriptionTypes = hasSubscriptionTypes ?? false;
        state.isMTN = isMTN ?? false;
      } else {
        state.paymentInitiated = false;
      }
    },
    paymentInitiatedReducer: (state, action) => {
      state.paymentInitiated = action.payload === "initiated";
    },
    purchaseHistoryReducer: (state, action) => {
      state.purchaseHistory = action.payload;
    },
    activeSubscriptionReducer: (state, action) => {
      state.activeSubscription = action.payload;
    },
    premiumSubReducer: (state, action) => {
      state.premiumSub = action.payload;
      window.localStorage.setItem("premiumSub", JSON.stringify(action.payload));
    },
  },
});

export default subscriptionSlice.reducer;
export const {
  fetchPackageReducer,
  subscriptionModalReducer,
  paymentInitiatedReducer,
  purchaseHistoryReducer,
  activeSubscriptionReducer,
  premiumSubReducer,
} = subscriptionSlice.actions;

export const selectSubscriptions = (state) => state.subscriptions;
