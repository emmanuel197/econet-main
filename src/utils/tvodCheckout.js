// TVOD checkout state (title, access option, payment method, MoMo details), kept in
// sessionStorage so a refresh mid-checkout doesn't lose it. Each screen reads it with
// getCheckout() and adds to it with updateCheckout().
const KEY = "wona:tvodCheckout";

export const getCheckout = () => {
  try {
    return JSON.parse(sessionStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
};

export const updateCheckout = (patch) => {
  const next = { ...getCheckout(), ...patch };
  try {
    sessionStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* non-fatal */
  }
  return next;
};

export const startCheckout = (titleId, optionId) => {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ titleId, optionId, method: "card" }));
  } catch {
    /* non-fatal */
  }
};

// "Expires if unstarted" / "Start before": 30 days from today, e.g. "Jul 15, 2026"
export const startDeadline = () => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};
