import React, { useRef } from "react";

/**
 * OtpInput — six single-digit boxes (replaces legacy react-otp-input dependency).
 * Calls onChange with the concatenated code; supports typing, backspace and paste.
 */
const LENGTH = 6;

const OtpInput = ({ value = "", onChange }) => {
  const refs = useRef([]);
  const digits = Array.from({ length: LENGTH }, (_, i) => value[i] ?? "");

  const commit = (next) => onChange(next.join("").slice(0, LENGTH));

  const handleChange = (i, raw) => {
    const char = raw.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = char;
    commit(next);
    if (char && i < LENGTH - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (pasted) {
      e.preventDefault();
      onChange(pasted);
      refs.current[Math.min(pasted.length, LENGTH - 1)]?.focus();
    }
  };

  return (
    // Boxes scale on the 390 mobile comp (--mvw) below md, 1728 (--vw) at md+ —
    // on --vw alone the 768 floor shrank them to ~25px squares on phones.
    <div
      className="flex justify-between gap-[calc(8/390*var(--mvw))] md:gap-[calc(12/1728*var(--vw))]"
      onPaste={handlePaste}
    >
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          inputMode="numeric"
          maxLength={2}
          className={
            "size-[calc(42/390*var(--mvw))] rounded-[calc(10/390*var(--mvw))] border border-gray-1/15 bg-gray-1/10 text-center text-[calc(20/390*var(--mvw))] text-gray-1 outline-none focus:border-brand " +
            "md:size-[calc(56/1728*var(--vw))] md:rounded-[calc(12/1728*var(--vw))] md:text-2xl"
          }
        />
      ))}
    </div>
  );
};

export default OtpInput;
