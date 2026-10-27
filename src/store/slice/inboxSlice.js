import { createSlice } from "@reduxjs/toolkit";

// CRM inbox rows: {id, title, message, date, time, notification_status}.
const initialState = {
  messages: [],
  loading: false,
  error: null,
};

const inboxSlice = createSlice({
  name: "inbox",
  initialState,
  reducers: {
    fetchInboxBegin: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchInboxSuccess: (state, action) => {
      // Coerce to an array. `api/inbox.js` passes `res.data?.data` straight through, so an
      // unexpected CRM payload (an object instead of a list) used to land here and then
      // white-screen EVERY page: selectInboxUnreadCount calls .filter, and it runs in the
      // Navbar / MobileNavActions, which render on every route. Observed 2026-07-30.
      state.messages = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
    },
    fetchInboxError: (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to load notifications";
    },
    messageRead: (state, action) => {
      const msg = state.messages.find((m) => m.id === action.payload);
      if (msg) msg.notification_status = "read";
    },
    messageDeleted: (state, action) => {
      state.messages = state.messages.filter((m) => m.id !== action.payload);
    },
    resetInbox: () => initialState,
  },
});

export const {
  fetchInboxBegin,
  fetchInboxSuccess,
  fetchInboxError,
  messageRead,
  messageDeleted,
  resetInbox,
} = inboxSlice.actions;

export const selectInboxMessages = (state) => state.inbox.messages;
export const selectInboxUnreadCount = (state) =>
  state.inbox.messages.filter((m) => m.notification_status !== "read").length;
export const selectInboxLoading = (state) => state.inbox.loading;

export default inboxSlice.reducer;
