import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import classNames from "../../utils/classNames";
import { momoProviders, momoCountry } from "../../data/tvodFixtures";
import { getCheckout, updateCheckout } from "../../utils/tvodCheckout";
import useTvodOrder from "./useTvodOrder";
import { m, CheckoutScreen, AmountDueCard, Field, Toggle, TermsLine, PrimaryButton, SecureNote, IconPhone, IconChevronDown } from "../../components/sections/tvod/TvodUi";

/**
 * MobileMoneyPage (/premiere/:id/pay/momo) — WONA "Mobile Money": Amount due, service
 * provider picker, Mobile Money Number (+233), "Save this number", HOW IT WORKS, and
 * Send Payment Request (disabled until a provider and a 9-digit number are set).
 * The comp labels the provider field "Card Number" (copied from the card screen); it
 * reads "Service Provider" here.
 */
const ProviderBadge = ({ provider, size = 18 }) =>
  provider.logo ? (
    <img src={provider.logo} alt="" className="shrink-0 rounded-[3px] object-cover" style={{ width: m(size), height: m(size) }} />
  ) : (
    <span className="flex shrink-0 items-center justify-center rounded-[3px] bg-gray-1/15 font-primary font-bold text-gray-1" style={{ width: m(size), height: m(size), fontSize: m(8) }}>
      {provider.name.charAt(0)}
    </span>
  );

const MobileMoneyPage = () => {
  const navigate = useNavigate();
  const order = useTvodOrder();
  const saved = getCheckout();
  const [providerId, setProviderId] = useState(saved.momoProvider || null);
  const [number, setNumber] = useState(saved.momoNumber || "");
  const [open, setOpen] = useState(false);
  const [save, setSave] = useState(true);
  if (!order.title) return <Navigate to="/premiere" replace />;
  const { title, amount, amountDetail } = order;
  const provider = momoProviders.find((p) => p.id === providerId);
  const ready = Boolean(provider) && number.length === 9;

  const send = () => {
    updateCheckout({ momoProvider: provider.id, momoNumber: number, paidVia: `${provider.short} ***${number.slice(-4)}` });
    navigate(`/premiere/${title.id}/pay/momo/processing`);
  };

  return (
    <CheckoutScreen
      title="Mobile Money"
      onBack={() => navigate(`/premiere/${title.id}/checkout`)}
      footer={
        <>
          <TermsLine action="confirm" />
          <PrimaryButton onClick={send} disabled={!ready}>Send Payment Request</PrimaryButton>
          <SecureNote />
        </>
      }
    >
      <AmountDueCard amount={amount} detail={amountDetail} />

      <Field label="Service Provider">
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className={classNames("flex w-full cursor-pointer items-center rounded-[12px] border bg-[#060915]/60 text-left", open ? "border-brand" : "border-[#fdfdf8]/20")}
            style={{ height: m(50), padding: `0 ${m(20)}`, gap: m(10) }}
          >
            {provider ? <ProviderBadge provider={provider} /> : <span className="text-gray-1/40"><IconPhone size={18} /></span>}
            <span className={classNames("flex-1 font-primary", provider ? "text-[#c7c1cc]" : "text-gray-1/40")} style={{ fontSize: m(14) }}>
              {provider ? provider.name : "Select your service provider"}
            </span>
            <span className={classNames("text-gray-1/60 transition-transform", open && "rotate-180")}><IconChevronDown size={18} /></span>
          </button>
          {open && (
            <div className="absolute inset-x-0 z-20 overflow-clip rounded-[12px] border border-gray-1/15 bg-[#21273b] shadow-2xl" style={{ top: m(56) }}>
              {momoProviders.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setProviderId(p.id);
                    setOpen(false);
                  }}
                  className={classNames("flex w-full cursor-pointer items-center text-left hover:bg-gray-1/10", p.id === providerId && "bg-brand/10")}
                  style={{ height: m(46), padding: `0 ${m(20)}`, gap: m(10) }}
                >
                  <ProviderBadge provider={p} />
                  <span className="font-primary text-gray-1" style={{ fontSize: m(14) }}>{p.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </Field>

      <Field label="Mobile Money Number">
        <div className="flex items-center overflow-clip rounded-[12px] border border-[#fdfdf8]/20 bg-[#060915]/60 focus-within:border-brand" style={{ height: m(50) }}>
          <span className="flex h-full items-center border-r border-[#fdfdf8]/20 font-primary text-[#c7c1cc]" style={{ padding: `0 ${m(14)} 0 ${m(20)}`, gap: m(6), fontSize: m(14) }}>
            <img src={momoCountry.flag} alt="" className="rounded-[3px] object-cover" style={{ width: m(16), height: m(16) }} />
            {momoCountry.dialCode}
            <IconChevronDown size={14} />
          </span>
          <input
            inputMode="numeric"
            autoComplete="tel-national"
            value={number}
            onChange={(e) => setNumber(e.target.value.replace(/\D/g, "").replace(/^0/, "").slice(0, 9))}
            placeholder="24 000 0000"
            className="h-full flex-1 bg-transparent font-primary text-[#c7c1cc] outline-none placeholder:text-gray-1/40"
            style={{ padding: `0 ${m(16)}`, fontSize: m(14) }}
          />
        </div>
      </Field>

      <Toggle checked={save} onChange={setSave} label="Save this number for later" />

      <div className="flex flex-col rounded-[12px] border border-gray-1/15 bg-[#313953]" style={{ padding: `${m(16)} ${m(15)}`, gap: m(10) }}>
        <span className="font-primary font-medium text-gray-1" style={{ fontSize: m(12) }}>HOW IT WORKS</span>
        {["1. Tap Send Request", "2. You'll get a USSD prompt on your phone", "3. Enter your MoMo PIN to approve", "4. We confirm and unlock your rental"].map((s) => (
          <span key={s} className="font-primary text-gray-1/60" style={{ fontSize: m(12) }}>{s}</span>
        ))}
      </div>
    </CheckoutScreen>
  );
};

export default MobileMoneyPage;
