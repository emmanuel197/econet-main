// Ported from legacy src/utils/activeSubs.js — true if any non-free "Active"
// subscription's [purchase, end] window contains now.
export const checkActiveSubscription = (userSubscriptions = []) => {
  const now = new Date();
  return userSubscriptions
    .filter((sub) => sub.price !== 0)
    .some((sub) => {
      if (sub.status !== "Active") return false;
      const startDate = new Date(`${sub.purchase_date} ${sub.purchase_time}`);
      const endDate = new Date(`${sub.end_date} ${sub.end_time}`);
      return now >= startDate && now <= endDate;
    });
};
