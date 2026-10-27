import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { verifyOTP, verifySignInOTP } from "../../api/auth";
import AuthShell from "../../components/sections/auth/AuthShell";
import OtpInput from "../../components/sections/auth/OtpInput";
import Button from "../../components/ui/Button";
import { selectAuth } from "../../store/slice/authSlice";

// Ported from legacy otpVerification.js — one page serves the sign-up and sign-in
// flows, branched on location.state.isSignUp. No password rides in navigation
// state: the verify functions apply the shared default password themselves.
const OtpVerificationPage = () => {
  const { isLoading } = useSelector(selectAuth);
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const mobileNumber = localStorage.getItem("afri_mobile_number");

  const { isSignUp } = location.state || {};

  const initVerifyOTP = () => {
    if (isSignUp === false) {
      verifySignInOTP(true, otp); // sign-in flow
    } else {
      verifyOTP(true, otp); // sign-up flow (default)
    }
  };

  return (
    <AuthShell title="Enter Verification Code" subtitle={`Code sent to ${mobileNumber || "your number"}`}>
      <div className="flex flex-col gap-[calc(20/390*var(--mvw))] md:gap-[calc(24/1728*var(--vw))]">
        <OtpInput value={otp} onChange={setOtp} />
        <Button
          variant="primary"
          size="lg"
          disabled={isLoading}
          onClick={initVerifyOTP}
          className="w-full text-[calc(16/390*var(--mvw))] py-[calc(17/390*var(--mvw))] disabled:opacity-60 md:py-[calc(16/1728*var(--vw))] md:text-xl"
        >
          {isLoading ? "Verifying…" : "Done"}
        </Button>
      </div>
    </AuthShell>
  );
};

export default OtpVerificationPage;
