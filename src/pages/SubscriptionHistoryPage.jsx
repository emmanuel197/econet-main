import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import classNames from "../utils/classNames";
import Button from "../components/ui/Button";
import SubscriptionModal from "../components/sections/subscriptions/SubscriptionModal";
import { fetchPurchaseHistory } from "../api/subscriptions";
import {
  selectSubscriptions,
  activeSubscriptionReducer,
  subscriptionModalReducer,
} from "../store/slice/subscriptionSlice";

/**
 * SubscriptionHistoryPage — ported from legacy subscriptionHistoryPage.js with the
 * sidebar/checkbox layout replaced by simple History / Active tabs. Free plans are
 * filtered out; on the Active tab a row can be cancelled (opens the shared modal
 * in its cancel mode, keyed off this route's pathname).
 */
const SubscriptionHistoryPage = () => {
  const dispatch = useDispatch();
  const { modalOpen, isLoading, purchaseHistory, activeSubscription } =
    useSelector(selectSubscriptions);

  useEffect(() => {
    fetchPurchaseHistory(dispatch, activeSubscription ? "Active" : "");
  }, [dispatch, activeSubscription]);

  const rows = (Array.isArray(purchaseHistory) ? purchaseHistory : []).filter(
    (sub) => sub.product_name !== "Free"
  );

  const openCancelModal = (sub) =>
    dispatch(
      subscriptionModalReducer({
        isOpen: true,
        productId: sub.product_id,
        productName: sub.product_name,
        productPrice: sub.price,
        currency: sub.currency,
      })
    );

  return (
    <div className="min-h-screen px-[calc(53/1728*var(--vw))] pb-[calc(64/1728*var(--vw))] pt-[calc(160/1728*var(--vw))] font-primary text-gray-1 max-md:px-[calc(20/390*var(--mvw))] max-md:pb-[calc(32/390*var(--mvw))] max-md:pt-[calc(100/390*var(--mvw))]">
      {modalOpen && <SubscriptionModal />}

      <div className="mb-[calc(32/1728*var(--vw))] flex items-baseline justify-between gap-[calc(12/390*var(--mvw))] max-md:mb-[calc(16/390*var(--mvw))]">
        <h1 className="text-4xl font-semibold max-md:text-[calc(20/390*var(--mvw))]">Subscriptions</h1>
        <Link to="/subscriptions" className="text-base text-brand hover:underline max-md:text-[calc(12/390*var(--mvw))]">
          Available Packs
        </Link>
      </div>

      <div className="mb-[calc(24/1728*var(--vw))] flex gap-[calc(12/1728*var(--vw))] max-md:mb-[calc(14/390*var(--mvw))] max-md:gap-[calc(8/390*var(--mvw))]">
        {[
          { label: "History", value: false },
          { label: "Active Subscriptions", value: true },
        ].map((tab) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => dispatch(activeSubscriptionReducer(tab.value))}
            className={classNames(
              "cursor-pointer rounded-full px-[calc(20/1728*var(--vw))] py-[calc(10/1728*var(--vw))] text-base max-md:px-[calc(14/390*var(--mvw))] max-md:py-[calc(8/390*var(--mvw))] max-md:text-[calc(12/390*var(--mvw))]",
              activeSubscription === tab.value
                ? "bg-brand font-medium text-page"
                : "bg-gray-1/10 text-gray-1 hover:bg-gray-1/20"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-gray-5 max-md:text-[calc(13/390*var(--mvw))]">Loading…</p>
      ) : rows.length > 0 ? (
        <div className="flex flex-col gap-[calc(12/1728*var(--vw))] max-md:gap-[calc(8/390*var(--mvw))]">
          {rows.map((sub, index) => (
            <div
              key={sub.id ?? index}
              className="flex items-center justify-between rounded-[calc(16/1728*var(--vw))] border border-gray-1/10 bg-gray-1/5 px-[calc(24/1728*var(--vw))] py-[calc(16/1728*var(--vw))] max-md:rounded-[calc(12/390*var(--mvw))] max-md:px-[calc(14/390*var(--mvw))] max-md:py-[calc(11/390*var(--mvw))]"
            >
              <div className="flex flex-col gap-[calc(6/1728*var(--vw))] max-md:gap-[calc(5/390*var(--mvw))]">
                <span className="text-lg font-medium leading-none max-md:text-[calc(14/390*var(--mvw))]">{sub.product_name}</span>
                <span className="text-sm text-gray-5 leading-none max-md:text-[calc(11/390*var(--mvw))]">
                  {sub.purchase_date} · {sub.currency} {sub.price}
                  {sub.status && ` · ${sub.status}`}
                </span>
              </div>
              {activeSubscription && (
                <Button variant="secondary" size="md" onClick={() => openCancelModal(sub)} className="max-md:px-[calc(14/390*var(--mvw))] max-md:py-[calc(8/390*var(--mvw))] max-md:text-[calc(12/390*var(--mvw))]">
                  Cancel
                </Button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-start gap-[calc(16/1728*var(--vw))] rounded-[calc(24/1728*var(--vw))] border border-gray-1/10 bg-gray-1/5 p-[calc(40/1728*var(--vw))] max-md:gap-[calc(12/390*var(--mvw))] max-md:rounded-[calc(16/390*var(--mvw))] max-md:p-[calc(20/390*var(--mvw))]">
          <p className="text-gray-1/90 max-md:text-[calc(13/390*var(--mvw))] max-md:leading-relaxed">
            You have no {activeSubscription ? "active " : ""}subscriptions. Choose your desired
            bundle from the available packs to enjoy amazing WONA content.
          </p>
          <Link to="/subscriptions">
            <Button variant="primary" size="lg" className="max-md:px-[calc(16/390*var(--mvw))] max-md:py-[calc(10/390*var(--mvw))] max-md:text-[calc(13/390*var(--mvw))]">Browse Packs</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SubscriptionHistoryPage;
