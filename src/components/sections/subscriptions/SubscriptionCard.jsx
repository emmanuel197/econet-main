import React from "react";
import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import { getSelectedOperator } from "../../../utils/authConstants";
import { subscriptionModalReducer } from "../../../store/slice/subscriptionSlice";

// Ported from legacy cards/subscriptionCard.js (logic 1:1, revamp UI). MTN is
// detected from the selected operator's username prefix; data-bonus lines are
// hidden for non-MTN operators (bonuses are MTN-only).
const SubscriptionCard = ({ subscription }) => {
  const dispatch = useDispatch();
  const operator = getSelectedOperator() || {};
  const isMTN = operator.username_prefix?.includes("amngh") || false;

  const operatorId = subscription.ID?.[isMTN ? "mtn" : "other"];
  const hasSubscriptionTypes =
    typeof operatorId === "object" &&
    operatorId !== null &&
    Boolean(operatorId["auto-renewal"] && operatorId["on-demand"]);

  const details = isMTN
    ? subscription.Details
    : subscription.Details.filter((d) => !/data bonus/i.test(d));

  const openModal = () =>
    dispatch(
      subscriptionModalReducer({
        isOpen: true,
        productId: subscription.ID,
        productName: subscription.Name,
        productPrice: subscription.Price,
        currency: subscription.Currency,
        hasSubscriptionTypes,
        isMTN,
      })
    );

  return (
    // max-md: full-width card on the 390 mobile comp basis (page stacks them in
    // one column); desktop keeps the fixed 360-comp card in a wrapping row.
    <div className="flex w-[calc(360/1728*var(--vw))] shrink-0 flex-col gap-[calc(16/1728*var(--vw))] rounded-[calc(24/1728*var(--vw))] border border-gray-1/10 bg-gray-1/5 p-[calc(32/1728*var(--vw))] max-md:w-full max-md:gap-[calc(12/390*var(--mvw))] max-md:rounded-[calc(16/390*var(--mvw))] max-md:p-[calc(18/390*var(--mvw))]">
      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-semibold text-gray-1 max-md:text-[calc(16/390*var(--mvw))]">{subscription.Name}</h3>
        <span className="rounded-full bg-gray-1/10 px-[calc(12/1728*var(--vw))] py-[calc(4/1728*var(--vw))] text-sm text-gray-5 max-md:px-[calc(10/390*var(--mvw))] max-md:py-[calc(3/390*var(--mvw))] max-md:text-[calc(11/390*var(--mvw))]">
          {subscription.Validity}
        </span>
      </div>

      <p className="text-3xl font-semibold text-brand max-md:text-[calc(18/390*var(--mvw))]">
        {subscription.Currency} {subscription.Price.toFixed(2)}
      </p>

      <ul className="flex flex-1 flex-col gap-[calc(8/1728*var(--vw))] max-md:gap-[calc(6/390*var(--mvw))]">
        {details.map((detail) => (
          <li key={detail} className="flex items-start gap-[calc(8/1728*var(--vw))] text-base text-gray-1/90 max-md:gap-[calc(6/390*var(--mvw))] max-md:text-[calc(12/390*var(--mvw))]">
            <span className="text-brand" aria-hidden="true">✓</span>
            {detail}
          </li>
        ))}
      </ul>

      <Button
        variant="primary"
        size="lg"
        onClick={openModal}
        className="w-full max-md:px-[calc(20/390*var(--mvw))] max-md:py-[calc(11/390*var(--mvw))] max-md:text-[calc(14/390*var(--mvw))]"
      >
        Subscribe
      </Button>
    </div>
  );
};

export default SubscriptionCard;
