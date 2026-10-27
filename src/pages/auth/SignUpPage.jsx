import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setDeviceInCookies } from "../../utils/setDeviceInCookies";
import checkUserAllowed from "../../utils/checkUserAllowed";
import { COOKIES } from "../../utils/authConstants";
import { verifyUserData } from "../../api/auth";
import AuthShell from "../../components/sections/auth/AuthShell";
import AuthInput from "../../components/sections/auth/AuthInput";
import Button from "../../components/ui/Button";
import { selectAuth } from "../../store/slice/authSlice";

// Ported from legacy signUpPage.js (revamp UI). Passwordless: only the mobile
// number is collected; the account is created with the shared default password
// after OTP verification (api/auth.js).
const SignUpPage = () => {
  const navigate = useNavigate();
  const { isLoading } = useSelector(selectAuth);
  const [email] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const user_info = COOKIES.get("user_info");

  // Both effects are REDIRECTS, not user navigation — they must replace, or Back
  // lands on this page, re-fires the redirect, and traps the history stack.
  useEffect(() => {
    if (user_info) navigate("/", { replace: true });
  }, [user_info, navigate]);

  useEffect(() => {
    setMobileNumber(localStorage.getItem("afri_mobile_number") || "");
  }, []);

  useEffect(() => {
    setDeviceInCookies();
    checkUserAllowed();
    window.scrollTo(0, 0);
  }, []);

  const handleMobileNumberInput = (e) => {
    const cleaned = e.target.value.replace(/\s/g, "");
    if (isNaN(Number(cleaned))) return;
    setMobileNumber(cleaned.slice(0, 10));
  };

  return (
    <AuthShell title="Sign Up" subtitle="Create your WONA account">
      <div className="flex flex-col gap-[calc(14/390*var(--mvw))] md:gap-[calc(16/1728*var(--vw))]">
        <AuthInput
          placeholder="eg. 0771234567"
          value={mobileNumber}
          onChange={handleMobileNumberInput}
        />

        <p className="text-[calc(13/390*var(--mvw))] text-gray-5 md:text-sm">
          Already have an account?{" "}
          <Link className="text-brand hover:underline" to="/signin">
            Sign in
          </Link>
        </p>

        <Button
          variant="primary"
          size="lg"
          disabled={isLoading}
          onClick={() => verifyUserData(true, mobileNumber, email, navigate)}
          className="w-full text-[calc(16/390*var(--mvw))] py-[calc(17/390*var(--mvw))] disabled:opacity-60 md:py-[calc(16/1728*var(--vw))] md:text-xl"
        >
          {isLoading ? "Please wait…" : "Continue"}
        </Button>
      </div>
    </AuthShell>
  );
};

export default SignUpPage;
