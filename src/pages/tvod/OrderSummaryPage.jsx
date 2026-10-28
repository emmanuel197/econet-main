import React, { useState } from "react";
import useGoBack from "../../utils/useGoBack";
import { Navigate, useNavigate } from "react-router-dom";
import classNames from "../../utils/classNames";
import { updateCheckout, startDeadline } from "../../utils/tvodCheckout";
import useTvodOrder from "./useTvodOrder";
import { m, CheckoutScreen, TitleSummary, InfoTable, BarHeading, RadioDot, PrimaryButton, SecureNote, IconPhone, IconCard } from "../../components/sections/tvod/TvodUi";

/**
 * OrderSummaryPage (/tvod/:id/checkout) — WONA "Order Summary": title + package tag,
 * the package table (Package, Quality, Start/Watch window, Expiry, Total) and the
 * Payment Method choice (Mobile Money / Credit-Debit Card). Continue → that payment screen.
 */
const METHODS = [
  { id: "momo", label: "Mobile Money", detail: "Pay with MTN MoMo, Vodafone Cash, or AirtelTigo Money", Icon: IconPhone },
  { id: "card", label: "Credit / Debit Card", detail: "Visa, Mastercard, or American Express accepted", Icon: IconCard },
];

const OrderSummaryPage = () => {
  const navigate = useNavigate();
  const goBack = useGoBack();
  const order = useTvodOrder();
  const [method, setMethod] = useState(order.checkout?.method || "card");
  if (!order.title) return <Navigate to="/tvod" replace />;
  const { title, option, isBuy, packageLabel, tag, amount } = order;

  const rows = [
    { label: "Package", value: packageLabel },
    { label: "Quality", value: option.quality },
    ...(isBuy
      ? []
      : [
          { label: "Start Window", value: "30 days from today" },
          { label: "Watch window", value: `${option.hours}hrs once started` },
          { label: "Expires if unstarted", value: startDeadline() },
        ]),
  ];

  const next = () => {
    updateCheckout({ method });
    navigate(`/tvod/${title.id}/pay/${method}`);
  };

  return (
    <CheckoutScreen
      title="Order Summary"
      onBack={() => goBack(`/tvod/${title.id}`)}
      footer={
        <>
          <PrimaryButton onClick={next}>Continue</PrimaryButton>
          <SecureNote />
        </>
      }
    >
      <TitleSummary title={title} tag={tag} />
      <InfoTable rows={rows} total={{ label: "Total", value: amount, valueClass: "font-bold text-brand", big: true }} />

      <div className="flex flex-col" style={{ gap: m(16), marginTop: m(16) }}>
        <BarHeading>Payment Method</BarHeading>
        {METHODS.map(({ id, label, detail, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setMethod(id)}
            className={classNames(
              "flex cursor-pointer items-center rounded-[12px] border text-left",
              method === id ? "border-brand bg-[#21273b]" : "border-gray-1/20 bg-[#313953]"
            )}
            style={{ minHeight: m(76), padding: `${m(12)} ${m(15)}`, gap: m(16) }}
          >
            <span className={method === id ? "text-brand" : "text-gray-1"}><Icon size={24} /></span>
            <span className="flex flex-1 flex-col" style={{ gap: m(4) }}>
              <span className="font-primary font-semibold text-gray-1" style={{ fontSize: m(14) }}>{label}</span>
              <span className="font-primary text-gray-1/60" style={{ fontSize: m(11) }}>{detail}</span>
            </span>
            <RadioDot selected={method === id} />
          </button>
        ))}
      </div>
    </CheckoutScreen>
  );
};

export default OrderSummaryPage;
