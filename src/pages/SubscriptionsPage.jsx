import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SubscriptionsData from "../data/subscriptionsData";
import SubscriptionCard from "../components/sections/subscriptions/SubscriptionCard";
import SubscriptionModal from "../components/sections/subscriptions/SubscriptionModal";
import { selectSubscriptions } from "../store/slice/subscriptionSlice";

// Ported from legacy subscriptionPage.js — packages come from the static
// SubscriptionsData constant (no packages API exists).
const SubscriptionsPage = () => {
  const { modalOpen } = useSelector(selectSubscriptions);

  return (
    // max-md: full-width single column on the 390 comp basis; top padding clears
    // the fixed mobile top bar.
    <div className="min-h-screen px-[calc(53/1728*var(--vw))] pb-[calc(64/1728*var(--vw))] pt-[calc(160/1728*var(--vw))] font-primary text-gray-1 max-md:px-[calc(20/390*var(--mvw))] max-md:pb-[calc(32/390*var(--mvw))] max-md:pt-[calc(100/390*var(--mvw))]">
      {modalOpen && <SubscriptionModal />}

      <div className="mb-[calc(32/1728*var(--vw))] flex items-baseline justify-between gap-[calc(12/390*var(--mvw))] max-md:mb-[calc(16/390*var(--mvw))]">
        <h1 className="text-4xl font-semibold max-md:text-[calc(20/390*var(--mvw))]">Choose your plan</h1>
        <Link
          to="/subscription-history"
          className="text-base text-brand hover:underline max-md:text-[calc(12/390*var(--mvw))]"
        >
          Subscription History
        </Link>
      </div>

      <div className="flex flex-wrap gap-[calc(24/1728*var(--vw))] max-md:flex-col max-md:gap-[calc(14/390*var(--mvw))]">
        {SubscriptionsData.map((subscription) => (
          <SubscriptionCard key={subscription.UID} subscription={subscription} />
        ))}
      </div>

      <div className="mt-[calc(32/1728*var(--vw))] flex flex-col gap-[calc(4/1728*var(--vw))] text-sm text-gray-5 max-md:mt-[calc(20/390*var(--mvw))] max-md:gap-[calc(3/390*var(--mvw))] max-md:text-[calc(11/390*var(--mvw))]">
        <p>WONA Terms of Use apply for all bundles</p>
        <p>*Data bundles are available only for Econet subscribers</p>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
