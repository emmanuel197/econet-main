import React from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { startDeadline } from "../../utils/tvodCheckout";
import { showPreviewNotice } from "../../utils/toast";
import useTvodOrder from "./useTvodOrder";
import { m, PhoneColumn, StatusBadge, InfoTable, PrimaryButton, SecondaryButton } from "../../components/sections/tvod/TvodUi";

/**
 * PaymentResultPage (/tvod/:id/result/:status) — the three WONA outcome screens:
 *  confirmed     "Rental Confirmed!" — summary, Download Receipt, Watch Now, Go to My Library
 *  failed        "Payment Failed" — reason, summary, Try Another Method, Back to Title
 *  not-approved  "Request Not Approved" — what happened, Try Again, Pay with Card instead
 * (The comp's confirmed subtitle repeats the failure copy and its button reads "My Libary";
 * both are corrected here.)
 */
const ReasonBox = ({ heading, children }) => (
  <div className="flex flex-col rounded-[12px] border border-error-8/20 bg-error-8/10" style={{ padding: `${m(16)} ${m(15)}`, gap: m(10) }}>
    <span className="font-primary font-medium text-[#fda29b]" style={{ fontSize: m(14) }}>{heading}</span>
    <span className="font-primary text-error-6" style={{ fontSize: m(12), lineHeight: 1.5 }}>{children}</span>
  </div>
);

const PaymentResultPage = () => {
  const { status } = useParams();
  const navigate = useNavigate();
  const order = useTvodOrder();
  if (!order.title) return <Navigate to="/tvod" replace />;
  const { title, option, isBuy, packageLabel, amount, checkout } = order;
  const noun = isBuy ? "purchase" : "rental";

  const content = {
    confirmed: {
      tone: "success",
      heading: isBuy ? "Purchase Confirmed!" : "Rental Confirmed!",
      sub: isBuy ? `${title.title} is yours to keep. Enjoy!` : `You have 30 days to start watching, and ${option.hours} hours once you start.`,
    },
    failed: { tone: "error", heading: "Payment Failed", sub: `Your ${noun} was not processed. You have not been charged.` },
    "not-approved": { tone: "error", heading: "Request Not Approved", sub: "The payment request timed out or was declined. You have not been charged." },
  }[status];
  if (!content) return <Navigate to={`/tvod/${title.id}`} replace />;

  return (
    <PhoneColumn className="flex min-h-screen flex-col" style={{ padding: `${m(60)} ${m(21)} ${m(30)}` }}>
      <StatusBadge tone={content.tone} />
      <h1 className="text-center font-primary font-bold text-gray-1" style={{ marginTop: m(22), fontSize: m(20) }}>{content.heading}</h1>
      <p className="mx-auto text-center font-primary text-gray-1/75" style={{ marginTop: m(10), fontSize: m(13), maxWidth: m(280) }}>{content.sub}</p>

      <div className="flex flex-col" style={{ marginTop: m(40), gap: m(12) }}>
        {status === "failed" && <ReasonBox heading="Reason">{checkout.failureReason || "Your payment could not be completed."}</ReasonBox>}
        {status === "not-approved" && (
          <ReasonBox heading="What happened?">
            The USSD prompt was not approved within 2 minutes. This can happen if you dismissed it or had no network. Your wallet was not debited.
          </ReasonBox>
        )}

        {status === "confirmed" && (
          <InfoTable
            tone="success"
            rows={[
              { label: "Title", value: title.title },
              { label: "Package", value: packageLabel },
              { label: "Quality", value: option.quality },
              { label: "Paid Via", value: checkout.paidVia || "—" },
              ...(isBuy ? [] : [{ label: "Start before", value: startDeadline() }]),
            ]}
            total={{ label: "Amount", value: amount, valueClass: "font-semibold text-[#53cf7b]" }}
          />
        )}
        {status === "failed" && (
          <InfoTable
            rows={[
              { label: "Title", value: title.title },
              { label: "Package", value: packageLabel },
              ...(isBuy ? [] : [{ label: "Expires if unstarted", value: startDeadline() }]),
            ]}
            total={{ label: "Amount", value: `${amount} · Not charged`, valueClass: "font-semibold text-error-6" }}
          />
        )}
      </div>

      <div className="flex flex-col" style={{ marginTop: m(32), gap: m(8) }}>
        {status === "confirmed" && (
          <>
            <button type="button" onClick={showPreviewNotice} className="mx-auto cursor-pointer rounded-full border border-gray-1/16 font-primary font-semibold text-gray-1/75" style={{ height: m(39), padding: `0 ${m(24)}`, fontSize: m(14), marginBottom: m(24) }}>
              Download Receipt
            </button>
            <PrimaryButton style={{ height: m(40) }} onClick={showPreviewNotice}>Watch Now</PrimaryButton>
            <SecondaryButton style={{ height: m(44) }} onClick={() => navigate("/my-stuff")}>Go to My Library</SecondaryButton>
          </>
        )}
        {status === "failed" && (
          <>
            <PrimaryButton onClick={() => navigate(`/tvod/${title.id}/checkout`, { replace: true })}>Try Another Method</PrimaryButton>
            <SecondaryButton onClick={() => navigate(`/tvod/${title.id}`, { replace: true })}>Back to Title</SecondaryButton>
          </>
        )}
        {status === "not-approved" && (
          <>
            <PrimaryButton style={{ height: m(43) }} onClick={() => navigate(`/tvod/${title.id}/pay/momo`, { replace: true })}>Try Again</PrimaryButton>
            <SecondaryButton onClick={() => navigate(`/tvod/${title.id}/pay/card`, { replace: true })}>Pay with Card instead</SecondaryButton>
          </>
        )}
      </div>
    </PhoneColumn>
  );
};

export default PaymentResultPage;
