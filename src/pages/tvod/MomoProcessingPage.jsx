import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { momoCountry, momoProviders, PREVIEW_MOMO_NOT_APPROVED_SUFFIX, PREVIEW_MOMO_INSUFFICIENT_SUFFIX } from "../../data/tvodFixtures";
import { updateCheckout } from "../../utils/tvodCheckout";
import { TOAST } from "../../utils/toast";
import useTvodOrder from "./useTvodOrder";
import { m, CheckoutScreen, AmountDueCard, SecondaryButton, SecureNote, IconPhone } from "../../components/sections/tvod/TvodUi";

/**
 * MomoProcessingPage (/premiere/:id/pay/momo/processing) — WONA "Processing": the
 * request was sent, "Check your phone", waiting state and a 2-minute expiry countdown.
 * Preview mode (no payment API): resolves after a few seconds — numbers ending 0000 are
 * not approved, 1111 fail for insufficient balance, anything else is confirmed. If the
 * countdown runs out first, the request counts as not approved.
 */
const EXPIRY_SECONDS = 120;
const PREVIEW_RESOLVE_MS = 6000;

const MomoProcessingPage = () => {
  const navigate = useNavigate();
  const order = useTvodOrder();
  const [secondsLeft, setSecondsLeft] = useState(EXPIRY_SECONDS);
  const [attempt, setAttempt] = useState(0);
  const number = order.checkout?.momoNumber || "";
  const provider = momoProviders.find((p) => p.id === order.checkout?.momoProvider);

  // Countdown (restarts on resend)
  useEffect(() => {
    setSecondsLeft(EXPIRY_SECONDS);
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [attempt]);

  // Preview outcome
  useEffect(() => {
    if (!order.title) return undefined;
    const t = setTimeout(() => {
      if (number.endsWith(PREVIEW_MOMO_NOT_APPROVED_SUFFIX)) {
        navigate(`/premiere/${order.title.id}/result/not-approved`, { replace: true });
      } else if (number.endsWith(PREVIEW_MOMO_INSUFFICIENT_SUFFIX)) {
        updateCheckout({ failureReason: `Insufficient balance on ${provider?.short || "MoMo"} ending ${number.slice(-4)}. Top up your wallet and try again, or choose a different payment method.` });
        navigate(`/premiere/${order.title.id}/result/failed`, { replace: true });
      } else {
        navigate(`/premiere/${order.title.id}/result/confirmed`, { replace: true });
      }
    }, PREVIEW_RESOLVE_MS);
    return () => clearTimeout(t);
  }, [attempt]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (secondsLeft === 0 && order.title) navigate(`/premiere/${order.title.id}/result/not-approved`, { replace: true });
  }, [secondsLeft]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!order.title || !number) return <Navigate to="/premiere" replace />;
  const masked = `${momoCountry.dialCode} ** *** **${number.slice(-2)}`;
  const mmss = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;

  return (
    <CheckoutScreen
      title="Mobile Money"
      onBack={() => navigate(`/premiere/${order.title.id}/pay/momo`)}
      footer={
        <>
          <SecondaryButton
            onClick={() => {
              setAttempt((a) => a + 1);
              TOAST.info("Payment request sent again.");
            }}
          >
            Didn&apos;t get it? Resend request
          </SecondaryButton>
          <SecureNote />
        </>
      }
    >
      <AmountDueCard label="Processing" amount={order.amount} detail={order.amountDetail} />

      <div className="flex flex-col items-center text-center" style={{ marginTop: m(8) }}>
        <span className="relative flex items-center justify-center rounded-full border border-brand bg-brand/10 text-brand" style={{ width: m(119), height: m(119) }}>
          <span className="absolute inset-0 animate-ping rounded-full border border-brand/40" />
          <IconPhone size={44} />
        </span>
        <h2 className="font-primary font-semibold text-gray-1" style={{ marginTop: m(30), fontSize: m(18) }}>Check your phone</h2>
        <p className="font-primary text-gray-1/75" style={{ marginTop: m(10), fontSize: m(13), maxWidth: m(290) }}>
          We&apos;ve sent a MoMo payment request to your {provider?.short?.split(" ")[0] || "MoMo"} number - <span className="font-medium text-brand">{masked}</span>. Approve it with your MoMo PIN.
        </p>

        <h3 className="flex items-center font-primary font-semibold text-gray-1" style={{ marginTop: m(110), gap: m(8), fontSize: m(14) }}>
          <span className="animate-pulse rounded-full bg-brand" style={{ width: m(8), height: m(8) }} />
          Waiting for approval
        </h3>
        <p className="font-primary text-gray-1/75" style={{ marginTop: m(10), fontSize: m(13), maxWidth: m(230) }}>
          This usually takes under 30 seconds. Do not close the app.
        </p>
        <span className="flex items-center rounded-[12px] border border-brand bg-brand/10 font-primary text-gray-1" style={{ marginTop: m(22), height: m(47), padding: `0 ${m(15)}`, gap: m(8), fontSize: m(13) }}>
          Request expires in <span className="font-bold text-brand" style={{ fontSize: m(14) }}>{mmss}</span>
        </span>
      </div>
    </CheckoutScreen>
  );
};

export default MomoProcessingPage;
