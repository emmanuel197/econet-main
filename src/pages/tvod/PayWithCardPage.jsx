import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { PREVIEW_DECLINED_CARD_SUFFIX } from "../../data/tvodFixtures";
import { updateCheckout } from "../../utils/tvodCheckout";
import { TOAST } from "../../utils/toast";
import useTvodOrder from "./useTvodOrder";
import { m, CheckoutScreen, AmountDueCard, Field, Toggle, TermsLine, PrimaryButton, SecureNote, IconCard } from "../../components/sections/tvod/TvodUi";

/**
 * PayWithCardPage (/premiere/:id/pay/card) — WONA "Pay with Card": Amount due, Card
 * Number, Expiry / CVV, Cardholder Name, "Save card", terms, Confirm Purchase.
 * Preview mode (no payment API): a card ending 0002 is declined, anything else succeeds.
 */
const digits = (v) => v.replace(/\D/g, "");
const formatCardNumber = (v) => digits(v).slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
const formatExpiry = (v) => {
  const d = digits(v).slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
};

const PayWithCardPage = () => {
  const navigate = useNavigate();
  const order = useTvodOrder();
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [save, setSave] = useState(true);
  if (!order.title) return <Navigate to="/premiere" replace />;
  const { title, amount, amountDetail } = order;

  const valid = digits(card).length === 16 && digits(expiry).length === 4 && digits(cvv).length >= 3 && name.trim().length > 1;

  const confirm = () => {
    if (!valid) return TOAST.error("Check the card details and try again.");
    const number = digits(card);
    const declined = number.endsWith(PREVIEW_DECLINED_CARD_SUFFIX);
    updateCheckout({ paidVia: `Card ****${number.slice(-4)}`, failureReason: declined ? `Your card ending ${number.slice(-4)} was declined by your bank. Try another card or pay with Mobile Money.` : null });
    navigate(`/premiere/${title.id}/result/${declined ? "failed" : "confirmed"}`, { replace: true });
  };

  return (
    <CheckoutScreen
      title="Pay with Card"
      onBack={() => navigate(`/premiere/${title.id}/checkout`)}
      footer={
        <>
          <TermsLine action="pay" />
          <PrimaryButton onClick={confirm} disabled={!valid}>Confirm Purchase</PrimaryButton>
          <SecureNote />
        </>
      }
    >
      <AmountDueCard amount={amount} detail={amountDetail} />
      <Field label="Card Number">
        <div className="flex items-center rounded-[12px] border border-[#fdfdf8]/20 bg-[#060915]/60 focus-within:border-brand" style={{ height: m(50), padding: `0 ${m(20)}`, gap: m(12) }}>
          <span className="text-gray-1/40"><IconCard size={18} /></span>
          <input
            inputMode="numeric"
            autoComplete="cc-number"
            value={card}
            onChange={(e) => setCard(formatCardNumber(e.target.value))}
            placeholder="0000 0000 0000 0000"
            className="w-full bg-transparent font-primary text-gray-1 outline-none placeholder:text-gray-1/40"
            style={{ fontSize: m(14) }}
          />
        </div>
      </Field>
      <div className="grid grid-cols-2" style={{ gap: m(8) }}>
        <Field label="Expiry" inputMode="numeric" autoComplete="cc-exp" value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))} placeholder="MM / YY" />
        <Field label="CVV" inputMode="numeric" autoComplete="cc-csc" value={cvv} onChange={(e) => setCvv(digits(e.target.value).slice(0, 4))} placeholder="123" />
      </div>
      <Field label="Cardholder Name" autoComplete="cc-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name on card" />
      <Toggle checked={save} onChange={setSave} label="Save card for future payments" />
    </CheckoutScreen>
  );
};

export default PayWithCardPage;
