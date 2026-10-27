import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Button from "../../ui/Button";
import AuthInput from "../auth/AuthInput";
import { TOAST, EMAIL_REGEXP, getSelectedOperator } from "../../../utils/authConstants";
import { subscriptionModalReducer, selectSubscriptions } from "../../../store/slice/subscriptionSlice";
import { purchasePackage, cancelSubscription } from "../../../api/subscriptions";

/**
 * SubscriptionModal — ported from legacy SubscriptionModal.js (logic 1:1, revamp UI).
 * Purchase flow: (optional auto-renewal/on-demand choice) → email → purchase POST →
 * redirect to the operator billing page. On /subscription-history the same modal
 * cancels the subscription instead (no email needed).
 */
const SubscriptionModal = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [selectedOption, setSelectedOption] = useState(null);
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const {
    productId,
    productPrice,
    productName,
    currency,
    paymentInitiated,
    activeSubscription,
    hasSubscriptionTypes,
    isMTN,
  } = useSelector(selectSubscriptions);

  const isCancelFlow = pathname.includes("subscription-history");
  const selectedOperator = getSelectedOperator() || {};
  const isOperatorMTN = isMTN ?? selectedOperator.username_prefix?.includes("amngh") ?? false;

  // Resolve the concrete plan id from the (possibly nested) ID structure.
  const getOperatorId = (subscriptionType = null) => {
    if (typeof productId === "object" && productId !== null) {
      const operatorId = productId[isOperatorMTN ? "mtn" : "other"];
      if (typeof operatorId === "object" && operatorId !== null) {
        if (subscriptionType) return operatorId[subscriptionType] || operatorId["auto-renewal"];
        return operatorId;
      }
      return operatorId;
    }
    return productId;
  };

  const operatorIds = getOperatorId();
  const hasOptions =
    hasSubscriptionTypes &&
    typeof operatorIds === "object" &&
    operatorIds !== null &&
    Boolean(operatorIds["auto-renewal"] && operatorIds["on-demand"]);

  const emailInvalid = !email || !EMAIL_REGEXP.test(email);
  const subscriber_uid = window.localStorage.getItem("afri_username");

  const closeModal = () => {
    dispatch(subscriptionModalReducer({ isOpen: false }));
    setSelectedOption(null);
    setEmail("");
    setEmailTouched(false);
  };

  const confirm = (planId) => {
    if (isCancelFlow) {
      cancelSubscription(planId);
      window.localStorage.removeItem("premiumSub");
      return;
    }
    setEmailTouched(true);
    if (emailInvalid) {
      TOAST.error("Enter a valid email and click continue");
      return;
    }
    purchasePackage(planId, subscriber_uid, email);
  };

  const title = paymentInitiated
    ? "Your subscription has been initiated…"
    : `Are you sure you want to ${isCancelFlow ? "cancel your subscription" : "continue"}?`;

  const emailField = !isCancelFlow && !paymentInitiated && (
    <div className="flex flex-col gap-[calc(8/1728*var(--vw))]">
      <AuthInput
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {emailTouched && emailInvalid && <p className="text-sm text-red-400">Enter a valid email</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-[calc(53/1728*var(--vw))] max-md:px-[calc(20/390*var(--mvw))]">
      <div className="relative flex w-full max-w-[calc(560/1728*var(--vw))] flex-col gap-[calc(24/1728*var(--vw))] rounded-[calc(24/1728*var(--vw))] border border-gray-1/10 bg-page p-[calc(40/1728*var(--vw))] max-md:max-w-full max-md:gap-[calc(16/390*var(--mvw))] max-md:rounded-[calc(16/390*var(--mvw))] max-md:p-[calc(20/390*var(--mvw))]">
        {!paymentInitiated && (
          <button
            type="button"
            onClick={closeModal}
            aria-label="Close"
            className="absolute right-[calc(20/1728*var(--vw))] top-[calc(16/1728*var(--vw))] cursor-pointer text-xl max-md:right-[calc(14/390*var(--mvw))] max-md:top-[calc(10/390*var(--mvw))] max-md:text-[calc(16/390*var(--mvw))] text-gray-5 hover:text-gray-1"
          >
            ✕
          </button>
        )}

        {hasOptions && !selectedOption && !paymentInitiated ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-1 max-md:text-[calc(16/390*var(--mvw))]">
              You have selected the {productName} Pack for {currency} {productPrice}
            </h2>
            <div className="flex gap-[calc(16/1728*var(--vw))] max-md:gap-[calc(10/390*var(--mvw))]">
              <Button variant="primary" size="lg" onClick={() => setSelectedOption("auto-renewal")} className="flex-1 max-md:px-[calc(16/390*var(--mvw))] max-md:py-[calc(10/390*var(--mvw))] max-md:text-[calc(13/390*var(--mvw))]">
                Auto-Renewal
              </Button>
              <Button variant="secondary" size="lg" onClick={() => setSelectedOption("on-demand")} className="flex-1 max-md:px-[calc(16/390*var(--mvw))] max-md:py-[calc(10/390*var(--mvw))] max-md:text-[calc(13/390*var(--mvw))]">
                On-Demand
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-[calc(8/1728*var(--vw))]">
              <h2 className="text-2xl font-semibold text-gray-1 max-md:text-[calc(16/390*var(--mvw))]">
                {hasOptions && selectedOption && !paymentInitiated
                  ? `Continue with the ${selectedOption} option?`
                  : title}
              </h2>
              {!paymentInitiated && !activeSubscription && !isCancelFlow && (
                <p className="text-base text-gray-5 max-md:text-[calc(12/390*var(--mvw))]">
                  You will be billed {currency} {productPrice} for the {productName} subscription
                </p>
              )}
            </div>

            {emailField}

            <div className="flex gap-[calc(16/1728*var(--vw))] max-md:gap-[calc(10/390*var(--mvw))]">
              {!paymentInitiated && (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={hasOptions && selectedOption ? () => setSelectedOption(null) : closeModal}
                  className="flex-1 max-md:px-[calc(16/390*var(--mvw))] max-md:py-[calc(10/390*var(--mvw))] max-md:text-[calc(13/390*var(--mvw))]"
                >
                  {hasOptions && selectedOption ? "Back" : "Cancel"}
                </Button>
              )}
              <Button
                variant="primary"
                size="lg"
                disabled={!paymentInitiated && !isCancelFlow && emailTouched && emailInvalid}
                onClick={
                  paymentInitiated
                    ? () => (window.location.href = "/home")
                    : () => confirm(hasOptions && selectedOption ? getOperatorId(selectedOption) : getOperatorId())
                }
                className="flex-1 disabled:opacity-60 max-md:px-[calc(16/390*var(--mvw))] max-md:py-[calc(10/390*var(--mvw))] max-md:text-[calc(13/390*var(--mvw))]"
              >
                {paymentInitiated ? "Go Home" : isCancelFlow ? "Yes, Cancel" : "Continue"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionModal;
